import express from "express";
import { authenticateUser, requireBusinessAnalyst } from "../../shared/middleware/auth.middleware.js";
import { listProductCosts, getProductCost, upsertProductCost } from "./productCost.controller.js";

const router = express.Router();

// Any authenticated user can read product costs (sidebar hides this for unauthorized users)
router.get("/", authenticateUser, listProductCosts);
router.get("/:productId", authenticateUser, getProductCost);

// Write: restricted to admin or business analyst department employees
router.put("/:productId", authenticateUser, requireBusinessAnalyst, upsertProductCost);

export default router;
