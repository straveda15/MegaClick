import express from "express";
import * as checkoutController from "./checkout.controller.js";
import { authenticateUser } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

router.post("/initiate", authenticateUser, checkoutController.initiateCheckout);

export default router;
