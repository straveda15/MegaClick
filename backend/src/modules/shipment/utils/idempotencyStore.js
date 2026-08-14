import crypto from "crypto";
import ShippingProvider from "../models/shippingProvider.model.js";
import ShipmentOperation from "../models/shipmentOperation.model.js";
import { ShipmentValidationError } from "./shipmentErrors.js";

const DEFAULT_PENDING_WAIT_MS = 30_000;
const DEFAULT_PENDING_POLL_MS = 250;

function stableSerialize(value) {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableSerialize(entry)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `{${keys
      .map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

function buildRequestFingerprint(payload) {
  return crypto
    .createHash("sha256")
    .update(stableSerialize(payload))
    .digest("hex");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function serializeOperationError(error) {
  const serialized = {
    name: error?.name || "Error",
    message: error?.message || "Unknown shipment operation error",
    code: error?.code || error?.meta?.error || null,
    httpStatus:
      error?.httpStatus ??
      error?.meta?.httpStatus ??
      error?.response?.status ??
      null,
  };

  const nestedErrors = Array.isArray(error?.errors)
    ? error.errors
    : Array.isArray(error?.meta?.errors)
      ? error.meta.errors
      : [];

  if (nestedErrors.length > 0) {
    serialized.errors = nestedErrors.map((entry) =>
      entry instanceof Error ? serializeOperationError(entry) : entry
    );
  }

  const meta =
    error?.meta && typeof error.meta === "object" ? { ...error.meta } : null;
  if (meta?.errors) {
    delete meta.errors;
  }
  if (meta && Object.keys(meta).length > 0) {
    serialized.meta = meta;
  }

  return serialized;
}

function buildStoredOperationState(record, providerDoc = null) {
  return {
    record,
    result: record?.status === "SUCCEEDED" ? record.result : null,
    providerDoc,
    error: record?.status === "FAILED" ? record.error : null,
  };
}

function buildPendingOperationUpdate({
  method,
  idempotencyKey,
  requestFingerprint,
  payload,
  providerDoc = null,
}) {
  return {
    $setOnInsert: {
      method,
      idempotencyKey,
    },
    $set: {
      requestFingerprint,
      status: "PENDING",
      providerId: providerDoc?._id || null,
      providerName: providerDoc?.name || null,
      payload,
      result: null,
      error: null,
    },
  };
}

async function loadOperation({ method, idempotencyKey, payload }) {
  if (!idempotencyKey) {
    return null;
  }

  const record = await ShipmentOperation.findOne({ method, idempotencyKey });
  if (!record) {
    return null;
  }

  const requestFingerprint = buildRequestFingerprint(payload);
  if (
    record.requestFingerprint &&
    record.requestFingerprint !== requestFingerprint
  ) {
    throw new ShipmentValidationError(
      "Idempotency key cannot be reused with a different shipment payload",
      {
        method,
        idempotencyKey,
      }
    );
  }

  return record;
}

async function resolveStoredProvider(record) {
  if (!record?.providerId && !record?.providerName) {
    return null;
  }

  if (record.providerId) {
    return ShippingProvider.findOne({ _id: record.providerId }).setOptions({
      includeDeleted: true,
    });
  }

  return ShippingProvider.findOne({ name: record.providerName }).setOptions({
    includeDeleted: true,
  });
}

export async function getStoredOperationResult({
  method,
  idempotencyKey,
  payload,
}) {
  const record = await loadOperation({ method, idempotencyKey, payload });
  if (!record || record.status !== "SUCCEEDED") {
    return null;
  }

  return {
    ...buildStoredOperationState(record, await resolveStoredProvider(record)),
  };
}

export async function claimOrGetOperation({
  method,
  idempotencyKey,
  payload,
  providerDoc = null,
}) {
  if (!idempotencyKey) {
    return {
      claimed: true,
      record: null,
      result: null,
      providerDoc,
      error: null,
    };
  }

  const requestFingerprint = buildRequestFingerprint(payload);

  try {
    const claimResult = await ShipmentOperation.updateOne(
      {
        method,
        idempotencyKey,
        status: "FAILED",
        $or: [
          { requestFingerprint },
          { requestFingerprint: { $exists: false } },
        ],
      },
      buildPendingOperationUpdate({
        method,
        idempotencyKey,
        requestFingerprint,
        payload,
        providerDoc,
      }),
      { upsert: true }
    );

    if (
      claimResult.upsertedCount > 0 ||
      claimResult.modifiedCount > 0 ||
      claimResult.matchedCount > 0
    ) {
      return {
        claimed: true,
        record: null,
        result: null,
        providerDoc,
        error: null,
      };
    }
  } catch (error) {
    if (error?.code !== 11000) {
      throw error;
    }
  }

  const record = await loadOperation({ method, idempotencyKey, payload });
  if (!record) {
    throw new ShipmentValidationError(
      "Unable to resolve existing shipment operation claim",
      {
        method,
        idempotencyKey,
      }
    );
  }

  return {
    claimed: false,
    ...buildStoredOperationState(record, await resolveStoredProvider(record)),
  };
}

export async function waitForStoredOperationResolution({
  method,
  idempotencyKey,
  payload,
  timeoutMs = DEFAULT_PENDING_WAIT_MS,
  pollIntervalMs = DEFAULT_PENDING_POLL_MS,
}) {
  if (!idempotencyKey) {
    return null;
  }

  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const record = await loadOperation({ method, idempotencyKey, payload });
    if (!record) {
      return null;
    }

    if (record.status !== "PENDING") {
      return buildStoredOperationState(
        record,
        await resolveStoredProvider(record)
      );
    }

    await sleep(pollIntervalMs);
  }

  const record = await loadOperation({ method, idempotencyKey, payload });
  if (!record) {
    return null;
  }

  return buildStoredOperationState(record, await resolveStoredProvider(record));
}

export function buildStoredOperationError(record) {
  const storedError = record?.error || {};
  const error = new Error(
    storedError.message || "Stored shipment operation failed"
  );
  error.name = storedError.name || "Error";

  if (storedError.code) {
    error.code = storedError.code;
  }

  if (storedError.httpStatus) {
    error.httpStatus = storedError.httpStatus;
  }

  if (storedError.meta) {
    error.meta = storedError.meta;
  }

  if (storedError.errors) {
    error.errors = storedError.errors;
  }

  return error;
}

export async function markOperationPending({
  method,
  idempotencyKey,
  payload,
  providerDoc = null,
}) {
  if (!idempotencyKey) {
    return null;
  }

  const existing = await loadOperation({ method, idempotencyKey, payload });
  if (existing?.status === "SUCCEEDED") {
    return existing;
  }

  const requestFingerprint = buildRequestFingerprint(payload);

  return ShipmentOperation.findOneAndUpdate(
    { method, idempotencyKey },
    buildPendingOperationUpdate({
      method,
      idempotencyKey,
      requestFingerprint,
      payload,
      providerDoc,
    }),
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
}

export async function markOperationSuccess({
  method,
  idempotencyKey,
  payload,
  providerDoc = null,
  result,
}) {
  if (!idempotencyKey) {
    return null;
  }

  const requestFingerprint = buildRequestFingerprint(payload);

  return ShipmentOperation.findOneAndUpdate(
    { method, idempotencyKey },
    {
      $setOnInsert: {
        method,
        idempotencyKey,
      },
      $set: {
        requestFingerprint,
        status: "SUCCEEDED",
        providerId: providerDoc?._id || null,
        providerName: providerDoc?.name || null,
        payload,
        result,
        error: null,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
}

export async function markOperationFailure({
  method,
  idempotencyKey,
  payload,
  providerDoc = null,
  error,
  preservePending = false,
  appendAttempt = true,
}) {
  if (!idempotencyKey) {
    return null;
  }

  const requestFingerprint = buildRequestFingerprint(payload);
  const serializedError = serializeOperationError(error);

  const update = {
    $setOnInsert: {
      method,
      idempotencyKey,
    },
    $set: {
      requestFingerprint,
      status: preservePending ? "PENDING" : "FAILED",
      providerId: providerDoc?._id || null,
      providerName: providerDoc?.name || null,
      payload,
      error: serializedError,
      ...(preservePending ? {} : { result: null }),
    },
  };

  if (appendAttempt) {
    update.$push = {
      attempts: {
        providerId: providerDoc?._id || null,
        providerName: providerDoc?.name || null,
        status: "FAILED",
        error: serializedError,
        timestamp: new Date(),
      },
    };
  }

  return ShipmentOperation.findOneAndUpdate(
    { method, idempotencyKey },
    update,
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );
}
