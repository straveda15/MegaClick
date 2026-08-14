// ═══════════════════════════════════════════════════════════════════════════════
// fetch-geoip.mjs — download the MaxMind GeoLite2-City database at build/deploy.
//
// Runs automatically via the `postinstall` npm hook (and can be run on demand with
// `npm run fetch:geoip`). Downloads the latest GeoLite2-City tarball from MaxMind
// using HTTP Basic auth (account id + license key), extracts GeoLite2-City.mmdb,
// and writes it to GEOIP_DB_PATH (default: Backend/data/GeoLite2-City.mmdb) — the
// exact path the geo-IP resolver loads (see src/shared/infrastructure/geoip.js).
//
// Design goal: NEVER break a build or a deploy. Missing credentials, a bad key, a
// network failure, or a malformed archive all log a warning and exit 0. The app
// then starts normally and session location simply falls back to "Unknown".
// ═══════════════════════════════════════════════════════════════════════════════

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const EDITION_ID = "GeoLite2-City";
const DOWNLOAD_URL = `https://download.maxmind.com/geoip/databases/${EDITION_ID}/download?suffix=tar.gz`;

// Re-download guard: if a recent DB already exists, skip (keeps repeated local
// `npm install`s fast). Render/AWS build on a fresh container so the file is never
// present there and always downloads. Force a refresh with GEOIP_FORCE_DOWNLOAD=1.
const MAX_AGE_DAYS = 7;

const log = (msg) => console.log(`[fetch-geoip] ${msg}`);
const warn = (msg) => console.warn(`[fetch-geoip] WARNING: ${msg}`);

function resolveDestPath() {
  if (process.env.GEOIP_DB_PATH) return path.resolve(process.env.GEOIP_DB_PATH);
  // Mirror the default in geoip.js: Backend/data/GeoLite2-City.mmdb
  return path.resolve(__dirname, "..", "data", `${EDITION_ID}.mmdb`);
}

function isFresh(filePath) {
  try {
    const { mtimeMs, size } = fs.statSync(filePath);
    if (size < 1_000_000) return false; // truncated/placeholder — re-fetch
    const ageDays = (Date.now() - mtimeMs) / (1000 * 60 * 60 * 24);
    return ageDays < MAX_AGE_DAYS;
  } catch {
    return false;
  }
}

// Minimal tar reader: walk 512-byte headers and return the first entry whose name
// matches `predicate`. GeoLite2 archives are plain ustar (short paths), so we don't
// need GNU long-name / pax handling — a global pax header, if present, is skipped
// naturally because its name won't match.
function extractFromTar(tarBuffer, predicate) {
  let offset = 0;
  const readStr = (start, len) => {
    const slice = tarBuffer.subarray(start, start + len);
    const nul = slice.indexOf(0);
    return slice.toString("utf8", 0, nul === -1 ? len : nul);
  };
  while (offset + 512 <= tarBuffer.length) {
    const name = readStr(offset, 100);
    if (name === "") break; // end-of-archive (zero block)
    const size = parseInt(readStr(offset + 124, 12).trim(), 8) || 0;
    const dataStart = offset + 512;
    if (predicate(name)) return tarBuffer.subarray(dataStart, dataStart + size);
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  return null;
}

async function main() {
  const accountId = process.env.MAXMIND_ACCOUNT_ID;
  const licenseKey = process.env.MAXMIND_LICENSE_KEY;
  const dest = resolveDestPath();

  if (!accountId || !licenseKey) {
    warn(
      "MAXMIND_ACCOUNT_ID / MAXMIND_LICENSE_KEY not set — skipping GeoLite2 download. " +
        "Session location will fall back to \"Unknown\". This is expected in local dev."
    );
    return;
  }

  if (!process.env.GEOIP_FORCE_DOWNLOAD && isFresh(dest)) {
    log(`Existing database is fresh (< ${MAX_AGE_DAYS}d): ${dest} — skipping download. ` +
        "Set GEOIP_FORCE_DOWNLOAD=1 to refresh.");
    return;
  }

  log(`Downloading ${EDITION_ID} from MaxMind…`);
  const auth = Buffer.from(`${accountId}:${licenseKey}`).toString("base64");
  const res = await fetch(DOWNLOAD_URL, {
    headers: { Authorization: `Basic ${auth}` },
    signal: AbortSignal.timeout(60_000),
  });

  if (!res.ok) {
    warn(
      `download failed — HTTP ${res.status} ${res.statusText}. ` +
        (res.status === 401
          ? "Check MAXMIND_ACCOUNT_ID and MAXMIND_LICENSE_KEY are correct. "
          : "") +
        "Continuing without a fresh database."
    );
    return;
  }

  const gz = Buffer.from(await res.arrayBuffer());
  const tar = zlib.gunzipSync(gz);
  const mmdb = extractFromTar(tar, (name) => name.endsWith(`${EDITION_ID}.mmdb`));

  if (!mmdb || mmdb.length === 0) {
    warn("could not find GeoLite2-City.mmdb inside the downloaded archive. Continuing.");
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  // Write to a temp file then rename, so a crash mid-write never leaves a partial
  // DB that the resolver would try (and fail) to open.
  const tmp = `${dest}.tmp`;
  fs.writeFileSync(tmp, mmdb);
  fs.renameSync(tmp, dest);

  const mb = (mmdb.length / (1024 * 1024)).toFixed(1);
  log(`✓ GeoLite2-City database ready: ${dest} (${mb} MB)`);
}

main().catch((err) => {
  // Last-resort guard: any unexpected error must NOT fail the build/deploy.
  warn(`unexpected error — ${err?.message || err}. Continuing without geo database.`);
  process.exit(0);
});
