import express from "express";
import { protect, requireAdmin } from "../../shared/middleware/auth.middleware.js";
import * as tierController from "./tier.controller.js";

const router = express.Router();

router.use(protect, requireAdmin);

// Specific named path must come before /:id
router.get("/cities/search", tierController.searchCities);

router.get("/", tierController.listCityTiers);
router.post("/", tierController.createCityTier);
router.patch("/:id", tierController.updateCityTier);
router.delete("/:id", tierController.deleteCityTier);

export default router;
