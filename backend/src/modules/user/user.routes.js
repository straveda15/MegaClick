import express from "express";
import {
  getMe,
  getAllUsers,
  createUser,
  selectRole,
  updateUser,
  deleteUser,
  setPin,
  forgotPin,
  resetPin,
  updateProfile,
} from "./user.controller.js";
import { protect, requireAdmin } from "../../shared/middleware/auth.middleware.js";

const router = express.Router();

// ── Session & Account ────────────────────────────────────────────────────────
router.get("/me", protect, getMe);
router.put("/me/profile", protect, updateProfile);
router.post("/select-role", protect, selectRole);
router.post("/set-pin", protect, setPin);

// ── PIN Reset (Public) ───────────────────────────────────────────────────────
router.post("/forgot-pin", forgotPin);
router.post("/reset-pin", resetPin);

// ── Admin / HR — user CRUD ───────────────────────────────────────────────────
// Read: any authenticated employee (sidebar already hides this from unauthorized users)
router.get("/all", protect, getAllUsers);

// Writes: creating/editing customers (role "user") is allowed for any
// authenticated staff who can reach the Customer Master page (page visibility is
// gated on the frontend via allowedPaths). Creating/editing privileged accounts
// (employees/admins) stays restricted to HR/Admin — enforced inside the controller.
router.post("/", protect, createUser);
router.patch("/:id", protect, updateUser);
router.delete("/:id", protect, requireAdmin, deleteUser);


export default router;