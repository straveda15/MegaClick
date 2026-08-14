import { parse } from "csv-parse/sync";

/**
 * Universal CSV Parser Utility
 * @param {Buffer|String} csvBuffer - The raw CSV content
 * @param {Joi.Schema} schema - Joi schema to validate each row
 * @returns { valid: Array, invalid: Array }
 */
export const parseCSV = (csvBuffer, schema = null) => {
    try {
        const records = parse(csvBuffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        const valid = [];
        const invalid = [];

        for (let i = 0; i < records.length; i++) {
            const row = records[i];
            
            if (schema) {
                const { error, value } = schema.validate(row, { abortEarly: false, stripUnknown: true });
                if (error) {
                    invalid.push({
                        rowNumber: i + 2, // Excel row number (1-indexed + header)
                        data: row,
                        errors: error.details.map(d => d.message)
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
        throw new Error(`CSV Parsing logic error: ${parseError.message}`);
    }
};
