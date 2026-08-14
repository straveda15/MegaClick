import express from "express";
import * as serviceCatalogController from "./serviceCatalog.controller.js";

const router = express.Router();

router.get("/", serviceCatalogController.getCatalog);

export default router;
