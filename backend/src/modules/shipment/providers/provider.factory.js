/**
 * Provider Factory — dynamically selects and instantiates the correct
 * shipping provider adapter based on DB configuration.
 *
 * Selection logic:
 *   1. Evaluate ShippingRules against the shipment context (pincode, weight, etc.)
 *   2. Fall back to the highest-priority active provider if no rules match
 *   3. If the primary provider fails, try fallback providers
 *
 * All config is read from MongoDB — ZERO environment variable dependency.
 */

import ShippingProvider from "../models/shippingProvider.model.js";
import ShippingRule from "../models/shippingRule.model.js";
import { getAdapterClass } from "./provider.registry.js";
import { MockAdapter } from "./mock.adapter.js";
import {
  ShipmentConfigError,
  ShipmentProviderError,
  ShipmentValidationError,
} from "../utils/shipmentErrors.js";
import {
  buildStoredOperationError,
  claimOrGetOperation,
  markOperationFailure,
  markOperationPending,
  markOperationSuccess,
  waitForStoredOperationResolution,
} from "../utils/idempotencyStore.js";

/* ── Adapter instance cache (per provider ID) ────────────────────────────── */
const adapterCache = new Map();

// Only used when SHIPMENT_MODE=mock env var is set (local dev/testing only).
// Production paths that previously fell back to this silently have been replaced
// with hard failures (see getProvider Step 3) to surface misconfiguration.
function buildMockProviderDoc() {
  return {
    _id: null,
    name: "mock",
    displayName: "Mock Provider (dev only)",
    isActive: true,
    priority: 999,
    fallbackPriority: 999,
    config: {},
  };
}

/**
 * Clear the adapter cache. Call when provider config is updated.
 * @param {string} [providerId] — clear specific provider, or all if omitted.
 */
export function clearAdapterCache(providerId) {
  if (providerId) {
    const keyPrefix = `${providerId.toString()}_`;
    for (const key of Array.from(adapterCache.keys())) {
      if (key.startsWith(keyPrefix)) {
        adapterCache.delete(key);
      }
    }
  } else {
    adapterCache.clear();
  }
  console.log(
    `  🔄 [ProviderFactory] Adapter cache cleared${providerId ? ` for ${providerId}` : ""}`
  );
}


/* ── Adapter instantiation ───────────────────────────────────────────────── */

/**
 * Create an adapter instance from a ShippingProvider document.
 * Uses a cache keyed by provider ID + updatedAt to detect config changes.
 *
 * @param {Object} providerDoc - ShippingProvider Mongoose document.
 * @returns {Object} - Adapter instance.
 */
function createAdapter(providerDoc) {
  // Bypass adapter cache: always create a fresh adapter to pick up latest config (e.g., warehouse_id)
  // const key = `${providerDoc._id}_${providerDoc.updatedAt?.getTime?.() || 0}`;
  // if (adapterCache.has(key)) {
  //   console.log('[AdapterCache] hit', true);
  //   const cached = adapterCache.get(key);
  //   console.log('[AdapterCache] Cached _warehouse:', cached._warehouse);
  //   return cached;
  // }

  const AdapterClass = getAdapterClass(providerDoc.name);
  if (!AdapterClass) {
    throw new ShipmentConfigError(
      `No adapter registered for provider "${providerDoc.name}". ` +
        `Register it in provider.registry.js.`,
      { provider: providerDoc.name }
    );
  }

  // ── DIAG: Stage 1 — MongoDB ShippingProvider config ──────────────────────
  if (providerDoc.name === 'shiprocket') {
    const { email: _e, password: _p, ...safeConfig } = providerDoc.config || {};
    console.log('[DIAG][createAdapter] ShippingProvider.config (no credentials):', JSON.stringify(safeConfig));
  }

  const adapter = new AdapterClass(providerDoc.config || {});

  console.log(
    `  ✦  [ProviderFactory] Instantiated adapter: ${providerDoc.name} (${providerDoc.displayName})`
  );

  return adapter;
}

function getProviderErrorStatus(error) {
  const candidate =
    error?.meta?.status ?? error?.response?.status ?? error?.httpStatus ?? null;
  return typeof candidate === "number" ? candidate : null;
}

const FALLBACK_NETWORK_CODES = new Set([
  "ECONNREFUSED",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EHOSTUNREACH",
  "EAI_AGAIN",
  "ECONNABORTED",
]);

function buildProviderAttemptError(providerName, error) {
  return {
    provider: providerName,
    name: error?.name || "Error",
    message: error?.message || "Unknown shipment provider error",
    code: error?.code || error?.meta?.error || null,
    httpStatus: getProviderErrorStatus(error),
  };
}

function isFallbackEligible(error) {
  const status = getProviderErrorStatus(error);

  if (status === 401) {
    return false;
  }

  if (status === 429) {
    return true;
  }

  if (typeof status === "number") {
    return status >= 500 && status < 600;
  }

  const errorCode =
    typeof error?.code === "string" ? error.code.toUpperCase() : null;
  if (errorCode && FALLBACK_NETWORK_CODES.has(errorCode)) {
    return true;
  }

  if (error?.isAxiosError && !status && !error?.response) {
    return true;
  }

  return error instanceof ShipmentProviderError;
}

function normalizeContextValue(value) {
  return String(value || "").trim().toLowerCase();
}

function matchesStringList(value, list = []) {
  if (!Array.isArray(list) || list.length === 0) return true;
  const normalizedValue = normalizeContextValue(value);
  return list.some((entry) => normalizeContextValue(entry) === normalizedValue);
}

function matchesPincodeList(pincode, list = []) {
  if (!Array.isArray(list) || list.length === 0) return true;
  const normalizedPincode = String(pincode || "").trim();
  return list.some((entry) => {
    const prefix = String(entry || "").trim();
    return prefix && normalizedPincode.startsWith(prefix);
  });
}

function matchesNumberRange(value, min = 0, max = Infinity) {
  const numeric = Number(value ?? 0);
  const minNumber = Number.isFinite(Number(min)) ? Number(min) : 0;
  const maxNumber = Number.isFinite(Number(max)) ? Number(max) : Infinity;
  return numeric >= minNumber && numeric <= maxNumber;
}

function ruleMatchesContext(rule, context = {}) {
  const conditions = rule.conditions || {};
  const destinationPincode = context.pincode || context.destinationPincode;
  const originPincode = context.originPincode;
  const weight = context.weight ?? 0;
  const orderValue = context.orderValue ?? context.value ?? 0;

  return (
    matchesPincodeList(destinationPincode, conditions.pincodes) &&
    matchesPincodeList(originPincode, conditions.originPincodes) &&
    matchesStringList(context.state, conditions.states) &&
    matchesStringList(context.paymentMode, conditions.paymentModes) &&
    matchesNumberRange(weight, conditions.minWeight, conditions.maxWeight) &&
    matchesNumberRange(orderValue, conditions.minValue, conditions.maxValue)
  );
}

async function evaluateRules(context = {}) {
  const rules = await ShippingRule.find({ isActive: true })
    .populate("providerId")
    .sort({ priority: 1 })
    .lean();

  for (const rule of rules) {
    const provider = rule.providerId;
    if (!provider || !provider.isActive || provider.isDeleted) continue;
    if (
      context.paymentMode &&
      Array.isArray(provider.supportedMethods) &&
      !provider.supportedMethods.includes(context.paymentMode)
    ) {
      continue;
    }
    if (ruleMatchesContext(rule, context)) {
      return provider._id;
    }
  }

  return null;
}

/* ── Public API ──────────────────────────────────────────────────────────── */

/**
 * Get the best shipping provider adapter for a given context.
 *
 * Steps:
 *   1. Try rule-based selection
 *   2. Fall back to highest-priority active provider
 *   3. If nothing is configured, return MockAdapter
 *
 * @param {Object} [context={}] - { destinationPincode, weight, paymentMode, state, orderValue }
 * @returns {Promise<{ adapter: Object, providerDoc: Object }>}
 */
export async function getProvider(context = {}) {
  // ENV Override for mock testing
  if (process.env.SHIPMENT_MODE === "mock") {
    console.log("  ⚠  [ProviderFactory] SHIPMENT_MODE=mock active — forcing MockAdapter");
    return {
      adapter: new MockAdapter(),
      providerDoc: buildMockProviderDoc(),
    };
  }

  // Staff-selected courier override (e.g. from dispatch portal dropdown)
  if (context.preferredCourier) {
    if (context.preferredCourier === "mock") {
      return { adapter: new MockAdapter(), providerDoc: buildMockProviderDoc() };
    }
    try {
      return await getProviderByName(context.preferredCourier, { activeOnly: true });
    } catch {
      console.warn(`[ProviderFactory] Preferred courier "${context.preferredCourier}" not found, falling back to rule engine`);
    }
  }

  // Step 1: Rule-based selection
  const ruleMatchId = await evaluateRules(context);

  if (ruleMatchId) {
    const doc = await ShippingProvider.findById(ruleMatchId);
    if (doc && doc.isActive) {
      return { adapter: createAdapter(doc), providerDoc: doc };
    }
  }

  // Step 2: Highest-priority active provider
  const primaryQuery = { isActive: true };
  if (context.paymentMode) {
    primaryQuery.supportedMethods = context.paymentMode;
  }

  const primary = await ShippingProvider.findOne(primaryQuery)
    .sort({ priority: 1 });

  if (primary) {
    return { adapter: createAdapter(primary), providerDoc: primary };
  }

  // Step 3: No providers configured — fail hard. A missing provider is a misconfiguration
  // that must be fixed, not silently bypassed with a mock adapter.
  throw new ShipmentConfigError(
    "No active shipping provider found. Configure at least one provider in the database.",
    { context }
  );
}

/**
 * Get a specific provider by name.
 * @param {string} providerName
 * @param {Object} [options]
 * @param {boolean} [options.activeOnly=true]
 * @param {boolean} [options.includeDeleted=false]
 * @returns {Promise<{ adapter: Object, providerDoc: Object }>}
 */
export async function getProviderByName(
  providerName,
  { activeOnly = true, includeDeleted = false } = {}
) {
  // ENV Override for mock testing
  if (process.env.SHIPMENT_MODE === "mock") {
    console.log("  ⚠  [ProviderFactory] SHIPMENT_MODE=mock active — forcing MockAdapter");
    return { adapter: new MockAdapter(), providerDoc: buildMockProviderDoc() };
  }

  const name = providerName?.toLowerCase?.();
  if (!name) {
    throw new ShipmentConfigError("Provider name is required");
  }

  const query = { name };
  if (activeOnly) query.isActive = true;
  const providerQuery = ShippingProvider.findOne(query);
  if (includeDeleted) {
    providerQuery.setOptions({ includeDeleted: true });
  }

  const doc = await providerQuery;

  if (doc) {
    return { adapter: createAdapter(doc), providerDoc: doc };
  }

  throw new ShipmentConfigError(
    `Provider "${providerName}" not found${activeOnly ? " or not active" : ""}`,
    { provider: providerName }
  );
}

/**
 * Resolve the provider bound to an existing shipment.
 * This intentionally bypasses active-provider selection so follow-up
 * operations keep talking to the provider that created the shipment.
 *
 * @param {Object} params
 * @param {string|null} [params.providerId]
 * @param {string|null} [params.providerName]
 * @returns {Promise<{ adapter: Object, providerDoc: Object }>}
 */
export async function getProviderForShipment({
  providerId = null,
  providerName = null,
} = {}) {
  // ENV Override for mock testing
  if (process.env.SHIPMENT_MODE === "mock") {
    console.log("  ⚠  [ProviderFactory] SHIPMENT_MODE=mock active — forcing MockAdapter");
    return { adapter: new MockAdapter(), providerDoc: buildMockProviderDoc() };
  }

  if (providerId) {
    const doc = await ShippingProvider.findOne({
      _id: providerId,
    }).setOptions({ includeDeleted: true });

    if (doc) {
      return { adapter: createAdapter(doc), providerDoc: doc };
    }
  }

  if (providerName) {
    return getProviderByName(providerName, {
      activeOnly: false,
      includeDeleted: true,
    });
  }

  throw new ShipmentConfigError(
    "Shipment is missing provider metadata; cannot safely continue provider-specific operations"
  );
}

/**
 * Get all fallback providers (ordered by fallbackPriority, then priority).
 * Used when the primary provider fails.
 *
 * @param {string} excludeId - Exclude this provider (the one that failed).
 * @returns {Promise<Array<{ adapter, providerDoc }>>}
 */
export async function getFallbackProviders(excludeId, context = {}) {
  const fallbackQuery = {
    isActive: true,
    isFallback: true,
    _id: { $ne: excludeId },
  };

  if (context.paymentMode) {
    fallbackQuery.supportedMethods = context.paymentMode;
  }

  const fallbacks = await ShippingProvider.find(fallbackQuery).sort({
    fallbackPriority: 1,
    priority: 1,
  });

  return fallbacks.map((doc) => ({
    adapter: createAdapter(doc),
    providerDoc: doc,
  }));
}

/**
 * Execute a provider method with fallback support.
 * If the primary provider fails, try each fallback in priority order.
 *
 * @param {string} method   - Interface method name (e.g. "createOrder").
 * @param {Object} payload  - DTO payload.
 * @param {Object} [context={}] - Context for provider selection.
 * @param {Object} [options={}] - Execution options.
 * @param {string|null} [options.idempotencyKey]
 * @returns {Promise<{ result: Object, providerDoc: Object }>}
 */
export async function executeWithFallback(
  method,
  payload,
  context = {},
  { idempotencyKey = null } = {}
) {
  const { adapter, providerDoc } = await getProvider(context);
  const operationClaim = await claimOrGetOperation({
    method,
    idempotencyKey,
    payload,
    providerDoc,
  });

  console.log(`[DIAG][executeWithFallback] method=${method} idempotencyKey=${idempotencyKey} claimed=${operationClaim.claimed} hasResult=${!!operationClaim.result} hasProviderDoc=${!!operationClaim.providerDoc}`);

  if (!operationClaim.claimed) {
    if (operationClaim.result && operationClaim.providerDoc) {
      console.log(`[DIAG][executeWithFallback] RETURNING CACHED RESULT — adapter.${method}() will NOT be called. Cached status=${operationClaim.record?.status}`);
      return {
        result: operationClaim.result,
        providerDoc: operationClaim.providerDoc,
      };
    }

    const resolvedOperation = await waitForStoredOperationResolution({
      method,
      idempotencyKey,
      payload,
    });

    if (resolvedOperation?.result && resolvedOperation.providerDoc) {
      return {
        result: resolvedOperation.result,
        providerDoc: resolvedOperation.providerDoc,
      };
    }

    if (resolvedOperation?.record?.status === "FAILED") {
      throw buildStoredOperationError(resolvedOperation.record);
    }

    throw new ShipmentValidationError(
      `Shipment operation "${method}" is already in progress for idempotency key "${idempotencyKey}"`,
      { method, idempotencyKey }
    );
  }

  try {
    await markOperationPending({
      method,
      idempotencyKey,
      payload,
      providerDoc,
    });
    const result = await adapter[method](payload, { idempotencyKey });
    await markOperationSuccess({
      method,
      idempotencyKey,
      payload,
      providerDoc,
      result,
    });
    return { result, providerDoc };
  } catch (primaryError) {
    console.error(
      `  ✖  [ProviderFactory] ${providerDoc.name}.${method} failed: ${primaryError.message}`
    );

    if (!isFallbackEligible(primaryError)) {
      await markOperationFailure({
        method,
        idempotencyKey,
        payload,
        providerDoc,
        error: primaryError,
      });
      throw primaryError;
    }

    const attemptedErrors = [buildProviderAttemptError(providerDoc.name, primaryError)];
    await markOperationFailure({
      method,
      idempotencyKey,
      payload,
      providerDoc,
      error: primaryError,
      preservePending: true,
    });

    // Try fallbacks
    const fallbacks = await getFallbackProviders(providerDoc._id, context);

    for (const fb of fallbacks) {
      try {
        console.log(
          `  ↻  [ProviderFactory] Trying fallback: ${fb.providerDoc.name}`
        );
        await markOperationPending({
          method,
          idempotencyKey,
          payload,
          providerDoc: fb.providerDoc,
        });
        const result = await fb.adapter[method](payload, { idempotencyKey });
        await markOperationSuccess({
          method,
          idempotencyKey,
          payload,
          providerDoc: fb.providerDoc,
          result,
        });
        return { result, providerDoc: fb.providerDoc };
      } catch (fbError) {
        attemptedErrors.push(
          buildProviderAttemptError(fb.providerDoc.name, fbError)
        );
        await markOperationFailure({
          method,
          idempotencyKey,
          payload,
          providerDoc: fb.providerDoc,
          error: fbError,
          preservePending: true,
        });
        console.error(
          `  ✖  [ProviderFactory] Fallback ${fb.providerDoc.name}.${method} also failed: ${fbError.message}`
        );
      }
    }

    const aggregatedError = new ShipmentProviderError(
      `All providers failed for ${method}. Primary: ${providerDoc.name}. ` +
        `Fallbacks tried: ${fallbacks.map((f) => f.providerDoc.name).join(", ") || "none"}`,
      {
        httpStatus: getProviderErrorStatus(primaryError) === 429 ? 429 : 502,
        method,
        primaryProvider: providerDoc.name,
        primaryStatus: getProviderErrorStatus(primaryError),
        originalError: primaryError.message,
        fallbackProviders: fallbacks.map((f) => f.providerDoc.name),
        errors: attemptedErrors,
      }
    );

    // All providers failed
    await markOperationFailure({
      method,
      idempotencyKey,
      payload,
      providerDoc,
      error: aggregatedError,
      appendAttempt: false,
    });
    throw aggregatedError;
  }
}
