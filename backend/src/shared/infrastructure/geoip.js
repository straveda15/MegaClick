import path from "node:path";
import { fileURLToPath } from "node:url";
import logger from "./logger.js";

// ═══════════════════════════════════════════════════════════════════════════════
// Geo-IP resolution (MaxMind GeoLite2-City).
//
// Resolves a public IP → "Country - Region - City" string in the exact format the
// analytics layer already parses (kpi.service.js `_parseLocation`), so capturing a
// visitor's location is purely additive: nothing downstream changes.
//
// The GeoLite2-City.mmdb file is a free MaxMind download (requires a license key)
// and is intentionally NOT committed. Provide it via GEOIP_DB_PATH, or drop it at
// Backend/data/GeoLite2-City.mmdb. When the DB (or the `maxmind` package) is
// missing, lookups degrade gracefully to null and callers keep their existing
// "Unknown" handling — the track endpoint never breaks on geo.
// ═══════════════════════════════════════════════════════════════════════════════

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_PATH = process.env.GEOIP_DB_PATH
  ? path.resolve(process.env.GEOIP_DB_PATH)
  : path.resolve(__dirname, "../../../data/GeoLite2-City.mmdb");

let readerPromise = null; // cached open() promise — DB is opened once, reused
let disabled = false;     // latched once we know the DB/package is unavailable

async function getReader() {
  if (disabled) return null;
  if (readerPromise) return readerPromise;
  readerPromise = (async () => {
    try {
      // Lazy import so a not-yet-installed package can't crash the track endpoint.
      const maxmind = (await import("maxmind")).default;
      const reader = await maxmind.open(DB_PATH);
      logger.info("[geoip] GeoLite2 database loaded", { path: DB_PATH });
      return reader;
    } catch (err) {
      disabled = true;
      logger.warn("[geoip] geo lookup disabled — database/package unavailable", {
        path: DB_PATH,
        error: err.message,
      });
      return null;
    }
  })();
  return readerPromise;
}

// Loopback / private / link-local addresses never resolve to a public geo (this is
// the common case in local dev), so skip the lookup entirely.
function isPrivateIp(ip) {
  if (!ip) return true;
  const v = ip.replace(/^::ffff:/, ""); // unwrap IPv4-mapped IPv6
  if (v === "::1" || v.startsWith("127.")) return true;
  if (v.startsWith("10.") || v.startsWith("192.168.")) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(v)) return true;
  if (v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80")) return true; // ULA / link-local
  return false;
}

// The dev machine's own public IP — in local dev the server and the browsing
// visitor share one machine, so the server's egress IP is the developer's real
// location. Resolved once (cached) and used to geolocate loopback requests so
// local testing shows a real city instead of "Unknown".
let serverPublicIpPromise = null;
async function getServerPublicIp() {
  if (serverPublicIpPromise) return serverPublicIpPromise;
  serverPublicIpPromise = (async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(3000) });
      const { ip } = await res.json();
      logger.info("[geoip] dev fallback — resolved server public IP", { ip });
      return ip;
    } catch (err) {
      logger.warn("[geoip] dev fallback — could not resolve server public IP", { error: err.message });
      return null;
    }
  })();
  return serverPublicIpPromise;
}

/**
 * Resolve a public IP to a "Country - Region - City" string.
 * Returns null for private IPs, a missing DB, or no match.
 */
export async function lookupLocationString(ip) {
  let target = ip;
  if (isPrivateIp(target)) {
    // Localhost/LAN traffic has no public IP. Outside production we still want a
    // real city for testing:
    //   1. GEOIP_DEV_FALLBACK_IP — an explicit IP to geolocate, or
    //   2. the dev machine's own public IP (server === visitor in local dev).
    // In production, private IPs stay "Unknown" (never mislabel real users).
    if (process.env.GEOIP_DEV_FALLBACK_IP) {
      target = process.env.GEOIP_DEV_FALLBACK_IP;
    } else if (process.env.NODE_ENV !== "production") {
      const serverIp = await getServerPublicIp();
      if (!serverIp) return null;
      target = serverIp;
    } else {
      return null;
    }
  }
  const reader = await getReader();
  if (!reader) return null;
  try {
    const r = reader.get(target.replace(/^::ffff:/, ""));
    if (!r) return null;
    const country = r.country?.names?.en;
    const region = r.subdivisions?.[0]?.names?.en;
    const city = r.city?.names?.en;
    if (!country && !region && !city) return null;
    return [country || "Unknown", region || "Unknown", city || "Unknown"].join(" - ");
  } catch (err) {
    logger.warn("[geoip] lookup failed", { ip, error: err.message });
    return null;
  }
}

export default { lookupLocationString };
