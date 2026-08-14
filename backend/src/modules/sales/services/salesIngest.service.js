import { parseFile } from "../utils/fileParser.js";
import mongoose from "mongoose";

/**
 * Validates and processes a file buffer (CSV or Excel).
 *
 * @param {Buffer} buffer - File buffer from multer
 * @param {String} filename - Original filename
 * @param {Joi.Schema} schema - Schema for row validation
 * @param {Function} processorFn - Async function to process valid rows (receives rows, session, actorId)
 * @param {String} actorId - ID of user triggering the upload
 * @param {Object<string, string[]>} [aliasMap] - Header alias map for dynamic column mapping
 */
export const processFileUpload = async (buffer, filename, schema, processorFn, actorId, aliasMap = null) => {
    // 1. Parse and Validate
    const { valid, invalid } = parseFile(buffer, filename, schema, aliasMap);
    
    if (valid.length === 0) {
        return {
            success: false,
            message: "No valid rows found in file",
            summary: { total: invalid.length, processed: 0, failed: invalid.length },
            errors: invalid
        };
    }

    // Detect the actual upload format so leads are tagged accurately
    // (e.g. "excel" vs "csv") instead of always saying "csv".
    const uploadSource = /\.(xlsx|xls)$/i.test(String(filename)) ? "excel" : "csv";

    const session = await mongoose.startSession();
    let processingError = null;

    // 2. Transactional processing
    try {
        await session.withTransaction(async () => {
            await processorFn(valid, session, actorId, uploadSource);
        });
    } catch (err) {
        processingError = err;
    } finally {
        session.endSession();
    }

    if (processingError) {
        throw new Error(`File Processing Transaction Failed: ${processingError.message}`);
    }

    return {
        success: true,
        summary: {
           total: valid.length + invalid.length,
           processed: valid.length,
           failed: invalid.length
        },
        errors: invalid.length > 0 ? invalid : undefined
    };
};
