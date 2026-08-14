import express from "express";
import * as transactionController from "./transaction.controller.js";
import { authenticateUser, restrictTo, requirePageAccess } from "../../../shared/middleware/auth.middleware.js";

const router = express.Router({ mergeParams: true });

router.post("/", authenticateUser, requirePageAccess("/operations/transactions"), transactionController.createTransaction);
router.get("/", authenticateUser, requirePageAccess("/operations/transactions"), transactionController.getTransactions);


export default router;
