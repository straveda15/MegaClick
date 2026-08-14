/**
 * Rate Cache — LRU in-memory cache for shipping rate calculations.
 *
 * Composite key:  provider + origin + destination + weight + paymentMode
 * TTL:            15 min (standard), 5 min (express)
 * Max entries:    1000 (LRU eviction)
 *
 * Invalidate all entries for a provider when its config changes.
 */

const MAX_ENTRIES = 1000;
const TTL_STANDARD_MS = 15 * 60 * 1000; // 15 minutes
const TTL_EXPRESS_MS = 5 * 60 * 1000; // 5 minutes

/** @type {Map<string, { data: Object, expiresAt: number }>} */
const cache = new Map();

/* ── Key generation ──────────────────────────────────────────────────────── */

/**
 * Build a deterministic cache key from rate-request parameters.
 * @param {Object} params
 * @returns {string}
 */
export function buildRateKey({
  provider,
  originPincode,
  destinationPincode,
  weight,
  paymentMode = "PREPAID",
}) {
  return [provider, originPincode, destinationPincode, weight, paymentMode]
    .map((v) => String(v).trim().toUpperCase())
    .join("|");
}

/* ── Read ────────────────────────────────────────────────────────────────── */

/**
 * Get a cached rate result, or `null` if miss / expired.
 * @param {string} key
 * @returns {Object|null}
 */
export function getRateFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  // Move to end (most-recently used) — Map preserves insertion order
  cache.delete(key);
  cache.set(key, entry);

  console.log(`  ⚡ [RateCache] HIT — ${key}`);
  return entry.data;
}

/* ── Write ───────────────────────────────────────────────────────────────── */

/**
 * Store a rate result in the cache.
 * @param {string} key
 * @param {Object} data
 * @param {Object} [options]
 * @param {boolean} [options.isExpress=false] — shorter TTL for express rates
 */
export function setRateInCache(key, data, { isExpress = false } = {}) {
  // LRU eviction — remove oldest entry when over capacity
  if (cache.size >= MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
    console.log(`  🗑  [RateCache] Evicted oldest entry`);
  }

  const ttl = isExpress ? TTL_EXPRESS_MS : TTL_STANDARD_MS;

  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl,
  });

  console.log(
    `  💾 [RateCache] SET — ${key} (TTL: ${ttl / 60_000}min)`
  );
}

/* ── Invalidation ────────────────────────────────────────────────────────── */

/**
 * Invalidate all cached rates for a specific provider.
 * Call this when provider config changes.
 * @param {string} providerName
 */
export function invalidateProviderRates(providerName) {
  const prefix = providerName.trim().toUpperCase();
  let count = 0;

  for (const key of cache.keys()) {
    if (key.startsWith(prefix + "|")) {
      cache.delete(key);
      count++;
    }
  }

  if (count > 0) {
    console.log(
      `  🧹 [RateCache] Invalidated ${count} entries for provider "${providerName}"`
    );
  }
}

/**
 * Flush the entire cache. Useful for testing.
 */
export function flushRateCache() {
  cache.clear();
  console.log(`  🧹 [RateCache] Flushed all entries`);
}

/**
 * Get current cache size (for monitoring).
 * @returns {number}
 */
export function rateCacheSize() {
  return cache.size;
}
