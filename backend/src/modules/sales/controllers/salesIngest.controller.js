import * as salesIngestService from "../services/salesIngest.service.js";
import * as salesOrderService from "../services/salesOrder.service.js";
import * as salesLeadService from "../services/salesLead.service.js";
import * as salesReturnService from "../services/salesReturn.service.js";
import { orderCSVSchema, leadCSVSchema, returnCSVSchema, scrapedDataCSVSchema, leadHeaderAliases } from "../validation/sales.validation.js";

export const uploadOrdersCSV = async (req, res, next) => {
    try {
        if (!req.file) throw new Error("CSV file is required");
        const actorId = req.user._id;

        const result = await salesIngestService.processFileUpload(
            req.file.buffer, 
            req.file.originalname,
            orderCSVSchema,
            salesOrderService.ingestOrdersFromCSV,
            actorId
        );

        res.status(200).json({
            success: true,
            message: "Orders file processed",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const uploadLeadsCSV = async (req, res, next) => {
    try {
        if (!req.file) throw new Error("File is required");
        const actorId = req.user._id;

        const result = await salesIngestService.processFileUpload(
            req.file.buffer,
            req.file.originalname,
            leadCSVSchema,
            salesLeadService.ingestLeadsFromCSV,
            actorId,
            leadHeaderAliases
        );

        res.status(200).json({
            success: true,
            message: "Leads file processed",
            data: result
        });
    } catch (error) {
        next(error);
    }
};



export const uploadScrapedDataCSV = async (req, res, next) => {
    try {
        if (!req.file) throw new Error("CSV file is required");
        const actorId = req.user._id;

        const result = await salesIngestService.processFileUpload(
            req.file.buffer, 
            req.file.originalname,
            scrapedDataCSVSchema,
            salesLeadService.ingestScrapedLeadsFromCSV,
            actorId
        );

        res.status(200).json({
            success: true,
            message: "Scraped Data file processed",
            data: result
        });
    } catch (error) {
        next(error);
    }
};
