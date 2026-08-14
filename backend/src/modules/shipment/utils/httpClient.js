/**
 * HTTP Client — Axios wrapper with retry, exponential backoff, and logging.
 *
 * Every provider adapter uses this instead of raw axios so we get
 * uniform timeout, retry, and request-level logging for free.
 */

import { randomUUID } from "crypto";
import axios from "axios";

const DEFAULT_TIMEOUT = 15_000; // 15 seconds
const DEFAULT_RETRIES = 3;
const BACKOFF_BASE_MS = 500;

function getHeaderValue(headers, headerName) {
  if (!headers) {
    return null;
  }

  if (typeof headers.get === "function") {
    return headers.get(headerName) ?? headers.get(headerName.toLowerCase());
  }

  const matchedKey = Object.keys(headers).find(
    (key) => key.toLowerCase() === headerName.toLowerCase()
  );

  return matchedKey ? headers[matchedKey] : null;
}

function setHeaderValue(headers, headerName, value) {
  if (headers && typeof headers.set === "function") {
    headers.set(headerName, value);
    return headers;
  }

  return {
    ...(headers || {}),
    [headerName]: value,
  };
}

function ensureWriteIdempotencyConfig(config = {}, method = "REQUEST", url = "") {
  const nextConfig = { ...(config || {}) };
  const headerKey = getHeaderValue(nextConfig.headers, "Idempotency-Key");
  const existingKey = nextConfig.idempotencyKey || headerKey;

  if (existingKey) {
    nextConfig.idempotencyKey = existingKey;

    if (!headerKey) {
      nextConfig.headers = setHeaderValue(
        nextConfig.headers,
        "Idempotency-Key",
        existingKey
      );
    }

    return nextConfig;
  }

  const generatedKey = randomUUID();
  console.debug(
    `  [ShipmentHTTP] Generated Idempotency-Key for ${method.toUpperCase()} ${url}: ${generatedKey}`
  );

  nextConfig.idempotencyKey = generatedKey;
  nextConfig.headers = setHeaderValue(
    nextConfig.headers,
    "Idempotency-Key",
    generatedKey
  );

  return nextConfig;
}

/**
 * Create an HTTP client instance for a shipping provider.
 *
 * @param {Object} options
 * @param {string} options.baseURL       - Provider API base URL.
 * @param {Object} [options.headers={}]  - Default headers (auth keys, etc.).
 * @param {number} [options.timeout]     - Request timeout in ms.
 * @param {number} [options.retries]     - Max retry attempts on failure.
 * @returns {Object} Client with get, post, put, patch, delete methods — all retry-aware.
 */
export function createHttpClient({
  baseURL,
  headers = {},
  timeout = DEFAULT_TIMEOUT,
  retries: defaultRetries = DEFAULT_RETRIES,
  maxRetryWithBackoff = DEFAULT_RETRIES,
}) {
  const instance = axios.create({
    baseURL,
    timeout,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
  });

  /* ── request interceptor — log outbound calls ──────────────────────────── */
  instance.interceptors.request.use((config) => {
    if (config.idempotencyKey && !getHeaderValue(config.headers, "Idempotency-Key")) {
      config.headers = setHeaderValue(
        config.headers,
        "Idempotency-Key",
        config.idempotencyKey
      );
    }

    console.log(
      `  ➜  [ShipmentHTTP] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
    );
    return config;
  });

  /* ── response interceptor — log results ────────────────────────────────── */
  instance.interceptors.response.use(
    (response) => {
      console.log(
        `  ✔  [ShipmentHTTP] ${response.status} ${response.config.url}`
      );
      return response;
    },
    (error) => {
      const status = error.response?.status || "TIMEOUT";
      const url = error.config?.url || "unknown";
      console.error(
        `  ✖  [ShipmentHTTP] ${status} ${url} — ${error.message}`
      );
      return Promise.reject(error);
    }
  );

  /* ── retry wrapper with exponential backoff ────────────────────────────── */
  async function withRetry(requestFn, attempt = 1) {
    try {
      return await requestFn();
    } catch (error) {
      const status = error.response?.status;
      const isRetryable =
        !error.response || // network error / timeout
        status >= 500 || // server error
        error.code === "ECONNABORTED"; // timeout
      const isRateLimited = status === 429;
      const maxAttempts = isRateLimited ? maxRetryWithBackoff : defaultRetries;
      const retries = maxAttempts;

      if ((isRetryable || isRateLimited) && attempt < maxAttempts) {
        const delay = BACKOFF_BASE_MS * Math.pow(2, attempt - 1);
        console.warn(
          `  ↻  [ShipmentHTTP] Retry ${attempt}/${retries} after ${delay}ms…`
        );
        await new Promise((r) => setTimeout(r, delay));
        return withRetry(requestFn, attempt + 1);
      }

      throw error;
    }
  }

  /* ── public API ────────────────────────────────────────────────────────── */
  return {
    get: (url, config) => withRetry(() => instance.get(url, config)),
    post: (url, data, config) => {
      const configWithIdempotency = ensureWriteIdempotencyConfig(
        config,
        "post",
        url
      );
      return withRetry(() => instance.post(url, data, configWithIdempotency));
    },
    put: (url, data, config) => {
      const configWithIdempotency = ensureWriteIdempotencyConfig(
        config,
        "put",
        url
      );
      return withRetry(() => instance.put(url, data, configWithIdempotency));
    },
    patch: (url, data, config) => {
      const configWithIdempotency = ensureWriteIdempotencyConfig(
        config,
        "patch",
        url
      );
      return withRetry(() => instance.patch(url, data, configWithIdempotency));
    },
    delete: (url, config) => {
      const configWithIdempotency = ensureWriteIdempotencyConfig(
        config,
        "delete",
        url
      );
      return withRetry(() => instance.delete(url, configWithIdempotency));
    },

    /** Raw axios instance — for one-off calls that shouldn't retry. */
    raw: instance,
  };
}
