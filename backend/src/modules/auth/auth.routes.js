import express from "express";
import {
  sendPhoneOtp,
  verifyPhoneOtp,
  googleAuth,
  refreshTokenController,
  employeeLogin,
  adminLogin,
  testerLogin,
} from "./auth.controller.js";

const router = express.Router();

// Phone OTP authentication
router.post("/phone/send-otp",   sendPhoneOtp);
router.post("/phone/verify-otp", verifyPhoneOtp);

// Google authentication
router.post("/google", googleAuth);

// Refresh token
router.post("/refresh", refreshTokenController);

// Employee authentication
router.post("/employee/login", employeeLogin);

// Admin authentication
router.post("/admin/login", adminLogin);

// Tester authentication
router.post("/tester/login", testerLogin);

export default router;
