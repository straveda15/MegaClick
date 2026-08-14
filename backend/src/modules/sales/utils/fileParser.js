import { parse } from "csv-parse/sync";
import * as XLSX from "xlsx";

/**
 * Normalizes a header string so that different spellings/casings/spacings of
 * the same column collapse to a single token.
 *   "MOBILE NO."   -> "mobileno"
 * "Customer Phone" -> "customerphone"
 *   "Product Name" -> "productname"
 */
const normalizeHeader = (header) =>
    String(header ?? "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

/**
 * Builds a lookup of { normalizedHeader: canonicalFieldName } from an alias map.
 * The canonical field name is always registered as an alias of itself, so files
 * that already use the canonical headers keep working.
 *
 * @param {Object<string, string[]>} aliasMap - { canonicalField: [variant, ...] }
 */
const buildAliasLookup = (aliasMap = {}) => {
    const lookup = {};
    for (const [canonical, variants] of Object.entries(aliasMap)) {
        lookup[normalizeHeader(canonical)] = canonical;
        for (const variant of variants) {
            lookup[normalizeHeader(variant)] = canonical;
        }
    }
    return lookup;
};

const isEmptyCell = (v) => v === "" || v === null || v === undefined;

/**
 * Finds the header row inside a 2D grid of cells. Spreadsheets exported by
 * hand often carry a title row or blank rows above the real headers, so we
 * scan for the first row that contains a recognizable column. When an alias
 * lookup is supplied we look for a known alias; otherwise we take the first
 * non-empty row.
 */
const findHeaderRowIndex = (grid, aliasLookup) => {
    for (let i = 0; i < grid.length; i++) {
        const row = grid[i] || [];
        if (aliasLookup) {
            if (row.some((cell) => aliasLookup[normalizeHeader(cell)])) return i;
        } else if (row.some((cell) => !isEmptyCell(typeof cell === "string" ? cell.trim() : cell))) {
            return i;
        }
    }
    return -1;
};

/**
 * Converts a 2D grid into row objects keyed by the detected header row.
 * Returns { records, headerIndex } where each record is { data, rowNumber }.
 */
const gridToRecords = (grid, aliasLookup) => {
    const headerIndex = findHeaderRowIndex(grid, aliasLookup);
    if (headerIndex === -1) return { records: [], headerIndex: -1 };

    const headers = (grid[headerIndex] || []).map((h) => String(h ?? "").trim());
    const records = [];

    for (let i = headerIndex + 1; i < grid.length; i++) {
        const row = grid[i] || [];
        const data = {};
        let hasValue = false;
        headers.forEach((header, idx) => {
            if (!header) return;
            const cell = row[idx];
            data[header] = cell ?? "";
            if (!isEmptyCell(typeof cell === "string" ? cell.trim() : cell)) hasValue = true;
        });
        if (!hasValue) continue; // skip blank rows
        records.push({ data, rowNumber: i + 1 }); // 1-indexed spreadsheet row
    }

    return { records, headerIndex };
};

/**
 * Remaps the keys of a parsed row onto canonical field names using the alias
 * lookup. Unknown columns (e.g. "SR. NO") are dropped. Empty values are skipped
 * so a blank cell never overwrites a populated one when two headers map to the
 * same canonical field.
 */
const remapRow = (row, aliasLookup) => {
    const mapped = {};
    for (const [rawKey, rawValue] of Object.entries(row)) {
        const canonical = aliasLookup[normalizeHeader(rawKey)];
        if (!canonical) continue; // unrecognized column -> ignore

        const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
        if (isEmptyCell(value)) continue;

        if (mapped[canonical] === undefined || mapped[canonical] === "") {
            mapped[canonical] = value;
        }
    }
    return mapped;
};

/**
 * Universal File Parser Utility (CSV & Excel)
 *
 * Dynamically maps whatever columns the file happens to contain onto the
 * canonical schema fields, so partial files (e.g. only "MOBILE NO." and
 * "PRODUCT NAME") are accepted and the missing fields are simply left blank.
 * Also tolerates title/blank rows above the headers.
 *
 * @param {Buffer} buffer - The raw file content
 * @param {String} filename - Original filename to detect extension
 * @param {Joi.Schema} schema - Joi schema to validate each row
 * @param {Object<string, string[]>} [aliasMap] - Header alias map for column mapping
 * @returns { valid: Array, invalid: Array }
 */
export const parseFile = (buffer, filename = "", schema = null, aliasMap = null) => {
    try {
        const name = String(filename).toLowerCase();
        const isExcel = name.endsWith(".xlsx") || name.endsWith(".xls");
        const aliasLookup = aliasMap ? buildAliasLookup(aliasMap) : null;

        let grid = [];
        if (isExcel) {
            const workbook = XLSX.read(buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            // header:1 -> array of arrays; raw:false keeps phone numbers as strings.
            grid = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "", raw: false, blankrows: false });
        } else {
            // CSV -> array of arrays so we can detect the header row ourselves.
            grid = parse(buffer, {
                skip_empty_lines: true,
                trim: true,
                relax_column_count: true,
            });
        }

        const { records } = gridToRecords(grid, aliasLookup);

        const valid = [];
        const invalid = [];

        for (const { data, rowNumber } of records) {
            const row = aliasLookup ? remapRow(data, aliasLookup) : data;
            if (Object.keys(row).length === 0) continue;

            if (schema) {
                const { error, value } = schema.validate(row, { abortEarly: false, stripUnknown: true });
                if (error) {
                    invalid.push({
                        rowNumber,
                        data,
                        errors: error.details.map((d) => d.message),
                    });
                } else {
                    valid.push(value);
                }
            } else {
                valid.push(row);
            }
        }

        return { valid, invalid };

    } catch (parseError) {
        throw new Error(`File Parsing logic error: ${parseError.message}`);
    }
};
