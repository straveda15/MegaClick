import User from "./user.model.js";
import { generateOtp, verifyOtp } from "../otp/otp.service.js";
import { sendOtpSms } from "../notification/sms.service.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import Order from "../order/order.model.js";
import Refund from "../refund/refund.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : { role: { $in: ["admin", "employee"] } };

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    if (role === "user") {
      const userIds = users.map((u) => u._id);

      const REVENUE_STATUSES = ["PAID", "CONFIRMED", "SHIPPED", "DELIVERED"];
      const orders = await Order.find({
        userId: { $in: userIds },
        orderStatus: { $in: REVENUE_STATUSES },
      });

      const refunds = await Refund.find({
        userId: { $in: userIds },
        status: "SUCCESS",
      });

      const userMap = users.map((u) => {
        const userObj = u.toObject ? u.toObject() : u;

        const userOrders = orders.filter((o) => o.userId && o.userId.toString() === u._id.toString());
        const totalOrdered = userOrders.reduce((sum, o) => sum + (o.pricing?.finalAmount || 0), 0);

        const userRefunds = refunds.filter((r) => r.userId && r.userId.toString() === u._id.toString());
        const totalRefunded = userRefunds.reduce((sum, r) => sum + (r.amount || 0), 0);

        userObj.amountSpent = Math.max(0, totalOrdered - totalRefunded);
        return userObj;
      });

      return res.status(200).json({ success: true, data: userMap });
    }

    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, lastName, email, phone, password, role, operationalRoles, departmentRole, allowedPaths, department, isActive, addressLine1, addressLine2, city, state, postalCode, landmark } = req.body;

    // Creating a customer (role "user") is open to any authenticated staff who can
    // reach the Customer Master page. Creating a privileged account (employee /
    // admin / staff role) stays restricted to HR or Admin.
    const targetRole = role || "employee";
    const canManageStaff = req.user.role === "admin" || req.user.departmentRole === "hr";
    if (targetRole !== "user" && !canManageStaff) {
      return res.status(403).json({ success: false, message: "Access denied. HR or Admin permissions required to create staff accounts." });
    }

    if (!name) return res.status(400).json({ success: false, message: "Name is required." });
    if (!email && !phone) return res.status(400).json({ success: false, message: "Either email or phone is required." });

    const existing = await User.findOne({ $or: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])] });
    if (existing) return res.status(409).json({ success: false, message: "A user with that email or phone already exists." });

    const user = await User.create({
      name,
      lastName: lastName || undefined,
      email: email || undefined,
      phone: phone || undefined,
      ...(password ? { password } : {}),
      role: role || "employee",
      operationalRoles: operationalRoles || [],
      currentOperationalRole: (operationalRoles && operationalRoles.length > 0) ? operationalRoles[0] : null,  // ✅ ADD THIS
      departmentRole: departmentRole || null,
      allowedPaths: allowedPaths || [],
      department: department || undefined,
      authProvider: ["local"],
      isActive: isActive ?? true,
      addressLine1: addressLine1 || undefined,
      addressLine2: addressLine2 || undefined,
      city: city || undefined,
      state: state || undefined,
      postalCode: postalCode || undefined,
      landmark: landmark || undefined,
      address: [addressLine1, addressLine2, landmark, city, state, postalCode].filter(Boolean).join(", ") || undefined,
      source: "admin_panel",
    });

    const safe = user.toObject();
    delete safe.password;
    return res.status(201).json({ success: true, data: safe });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { password, ...updateData } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // Editing staff/admin accounts (or promoting a customer into one) stays
    // restricted to HR/Admin. Editing a customer profile is open to any
    // authenticated staff who can reach the Customer Master page.
    const canManageStaff = req.user.role === "admin" || req.user.departmentRole === "hr";
    const touchesPrivileged = user.role !== "user" || (updateData.role && updateData.role !== "user");
    if (touchesPrivileged && !canManageStaff) {
      return res.status(403).json({ success: false, message: "Access denied. HR or Admin permissions required to modify staff accounts." });
    }

    // Detect an active → inactive transition so we can auto-cancel this user's
    // ongoing tasks after the account is saved.
    const isDeactivating =
      updateData.isActive === false && user.isActive !== false;

    if (password) {
      user.password = password;
    }

    if (
      updateData.addressLine1 !== undefined ||
      updateData.addressLine2 !== undefined ||
      updateData.city !== undefined ||
      updateData.state !== undefined ||
      updateData.postalCode !== undefined ||
      updateData.landmark !== undefined
    ) {
      const a1 = updateData.addressLine1 !== undefined ? updateData.addressLine1 : user.addressLine1;
      const a2 = updateData.addressLine2 !== undefined ? updateData.addressLine2 : user.addressLine2;
      const lm = updateData.landmark !== undefined ? updateData.landmark : user.landmark;
      const ct = updateData.city !== undefined ? updateData.city : user.city;
      const st = updateData.state !== undefined ? updateData.state : user.state;
      const pc = updateData.postalCode !== undefined ? updateData.postalCode : user.postalCode;
      user.address = [a1, a2, lm, ct, st, pc].filter(Boolean).join(", ");
    }

    Object.assign(user, updateData);
    await user.save();

    // When a staff member is deactivated, automatically cancel any task still
    // assigned to and ongoing for them. The assigner / admin oversight then sees
    // a "cancelled" alert on the task and can reassign or confirm it.
    if (isDeactivating) {
      try {
        const { cancelTasksForInactiveUser } = await import("../task/task.service.js");
        await cancelTasksForInactiveUser(user._id, req.user?._id || null);
      } catch (taskErr) {
        console.error("[User] Failed to auto-cancel tasks for deactivated user:", taskErr.message);
      }

      // Spread this member's open sales leads across the remaining active team.
      try {
        const { redistributeLeadsFromInactive } = await import("../sales/services/salesLead.service.js");
        await redistributeLeadsFromInactive(user._id, req.user?._id || null);
      } catch (leadErr) {
        console.error("[User] Failed to redistribute leads for deactivated user:", leadErr.message);
      }
    }

    const safe = user.toObject();
    delete safe.password;
    return res.status(200).json({ success: true, data: safe });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    return res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = {
      _id: req.user._id,
      name: req.user.name,
      lastName: req.user.lastName,
      phone: req.user.phone,
      email: req.user.email,
      role: req.user.role,
      // Role fields — required for dashboard RBAC and employee app routing
      operationalRoles: req.user.operationalRoles ?? [],
      currentOperationalRole: req.user.currentOperationalRole ?? null,
      departmentRole: req.user.departmentRole ?? null,
      isSalesManager: req.user.isSalesManager ?? false,
      allowedPaths: req.user.allowedPaths ?? [],
      isPhoneVerified: req.user.isPhoneVerified,
      isEmailVerified: req.user.isEmailVerified,
      authProvider: req.user.authProvider,
      isActive: req.user.isActive,
      profilePicture: req.user.profilePicture,
      hasPin: Boolean(req.user.pin), // tells client if PIN is configured; never expose hash
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    };

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, lastName, phone, profilePicture } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (name) user.name = name;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    // A manually-uploaded photo should stick — mark it so future Google logins
    // don't silently overwrite it (see auth.controller.js googleAuth).
    if (profilePicture) {
      user.profilePicture = profilePicture;
      user.hasCustomProfilePicture = true;
    }

    await user.save();
    
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Internal server error." });
  }
};

// ─── PIN Management ───────────────────────────────────────────────────────────

/**
 * POST /api/v1/users/set-pin
 * Protected. Employee sets or updates their 4–6 digit PIN.
 */
export const setPin = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin || !/^\d{4,6}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: "PIN must be 4 to 6 digits.",
      });
    }

    req.user.pin = pin; // pre-save hook will bcrypt-hash it
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "PIN set successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

/**
 * POST /api/v1/users/forgot-pin
 * Public. Initiates PIN reset via OTP sent to the employee's registered phone.
 * Body: { phone: string, countryCode: string }
 */
export const forgotPin = async (req, res) => {
  try {
    const { phone, countryCode } = req.body;

    if (!phone || !countryCode) {
      return res.status(400).json({
        success: false,
        message: "phone and countryCode are required.",
      });
    }

    const parsed = parsePhoneNumberFromString(phone, countryCode);
    if (!parsed || !parsed.isValid()) {
      return res.status(400).json({ success: false, message: "Invalid phone number." });
    }
    const normalizedPhone = parsed.format("E.164");

    // Verify user exists — do not reveal whether user is found (security)
    const user = await User.findOne({ phone: normalizedPhone });
    if (user) {
      // generateOtp handles rate-limiting and cooldown internally
      const rawOtp = await generateOtp({
        identifier: normalizedPhone,
        type: "RESET_PIN",
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
      });
      await sendOtpSms(normalizedPhone, rawOtp);
    }

    // Always return success to prevent user enumeration
    return res.status(200).json({
      success: true,
      message: "If an account with that number exists, a reset OTP has been sent.",
    });
  } catch (error) {
    // Propagate rate-limit errors (429) from OTP service
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

/**
 * POST /api/v1/users/reset-pin
 * Public. Verifies OTP and sets new PIN.
 * Body: { phone: string, countryCode: string, otp: string, newPin: string }
 */
export const resetPin = async (req, res) => {
  try {
    const { phone, countryCode, otp, newPin } = req.body;

    if (!phone || !countryCode || !otp || !newPin) {
      return res.status(400).json({
        success: false,
        message: "phone, countryCode, otp, and newPin are required.",
      });
    }

    if (!/^\d{4,6}$/.test(newPin)) {
      return res.status(400).json({
        success: false,
        message: "New PIN must be 4 to 6 digits.",
      });
    }

    const parsed = parsePhoneNumberFromString(phone, countryCode);
    if (!parsed || !parsed.isValid()) {
      return res.status(400).json({ success: false, message: "Invalid phone number." });
    }
    const normalizedPhone = parsed.format("E.164");

    // Throws with appropriate statusCode if OTP is invalid/expired/used
    await verifyOtp({ identifier: normalizedPhone, otp, type: "RESET_PIN" });

    const user = await User.findOne({ phone: normalizedPhone });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    user.pin = newPin; // pre-save hook hashes it
    await user.save();

    return res.status(200).json({
      success: true,
      message: "PIN reset successfully.",
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

export const selectRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ success: false, message: "Role is required." });
    }

    if (req.user.role !== "employee") {
      return res.status(403).json({ success: false, message: "Only employees can specify an operational role." });
    }

    // Ensure the requested role is within the user's assigned operationalRoles
    if (!req.user.operationalRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: `You do not have permission for the '${role}' role. Assigned roles: ${req.user.operationalRoles.join(", ")}`
      });
    }

    req.user.currentOperationalRole = role;
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: `Role successfully switched to ${role}`,
      data: {
        currentOperationalRole: req.user.currentOperationalRole
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};