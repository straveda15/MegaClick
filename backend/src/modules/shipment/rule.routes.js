import express from "express";
import { protect, requireAdmin } from "../../shared/middleware/auth.middleware.js";
import * as ruleController from "./rule.controller.js";

const router = express.Router();

router.use(protect, requireAdmin);

router.get("/", ruleController.listRules);
router.post("/", ruleController.createRule);
router.patch("/:id", ruleController.updateRule);
router.delete("/:id", ruleController.deleteRule);

export default router;
