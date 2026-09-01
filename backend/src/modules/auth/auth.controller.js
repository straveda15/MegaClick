import { parsePhoneNumberFromString } from "libphonenumber-js";
import { OAuth2Client } from "google-auth-library";

import { generateOtp, verifyOtp } from "../otp/otp.service.js";
import { sendOtpSms } from "../notification/sms.service.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./auth.service.js";
import User from "../user/user.model.js";
import RefreshToken from "./token.model.js";
import { employeeLoginSchema } from "./auth.validation.js";

const normalizePhone = (phone, countryCode) => {
  const parsed = parsePhoneNumberFromString(phone, countryCode);

  if (!parsed || !parsed.isValid()) {
    const err = new Error("Invalid phone number.");
    err.statusCode = 400;
    throw err;
  }

  return parsed.format("E.164");
};

export const sendPhoneOtp = async (req, res) => {
  try {
    const { phone, countryCode } = req.body;

    if (!phone || !countryCode) {
      return res.status(400).json({
        success: false,
        message: "phone and countryCode are required.",
      });
    }

    const normalizedPhone = normalizePhone(phone, countryCode);

    const rawOtp = await generateOtp({
      identifier: normalizedPhone,
      type: "LOGIN",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    await sendOtpSms(normalizedPhone, rawOtp);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

export const verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, countryCode, otp } = req.body;

    if (!phone || !countryCode || !otp) {
      return res.status(400).json({
        success: false,
        message: "phone, countryCode, and otp are required.",
      });
    }

    const normalizedPhone = normalizePhone(phone, countryCode);

    await verifyOtp({
      identifier: normalizedPhone,
      otp,
      type: "LOGIN",
    });

    let user = await User.findOne({ phone: normalizedPhone });
    let isNewUser = false;

    if (!user) {
      user = await User.create({
        phone: normalizedPhone,
        isPhoneVerified: true,
        authProvider: ["otp"],
      });
      isNewUser = true;
    } else {
      user.isPhoneVerified = true;
      if (!user.authProvider.includes("otp")) {
        user.authProvider.push("otp");
      }
      await user.save();
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, req.ip);

    return res.status(200).json({
      success: true,
      message: isNewUser
        ? "Account created and logged in successfully."
        : "Logged in successfully.",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        authProvider: user.authProvider,
      },
      isNewUser,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "idToken is required.",
      });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let ticket;

    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Google token.",
      });
    }

    const payload = ticket.getPayload();
    const {
      sub: googleId,
      email,
      given_name: name,
      family_name: lastName,
      picture,
    } = payload;

    let user = await User.findOne({ googleId });

    if (!user && email) {
      user = await User.findOne({ email });
    }

    let isNewUser = false;

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name: name || undefined,
        lastName: lastName || undefined,
        profilePicture: picture || undefined,
        isEmailVerified: true,
        authProvider: ["google"],
      });
      isNewUser = true;
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.authProvider.includes("google")) {
        user.authProvider.push("google");
      }
      if (email && !user.email) {
        user.email = email;
        user.isEmailVerified = true;
      }
      // Do NOT overwrite name/lastName here — those are only set from Google
      // on first-time account creation (above). Re-syncing on every login
      // silently reverted any name the user manually edited in their profile.
      // Same reasoning for profilePicture: skip once the user has uploaded
      // their own photo, otherwise Google's avatar reverts it on next login.
      if (picture && !user.hasCustomProfilePicture) user.profilePicture = picture;

      await user.save();
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, req.ip);

    return res.status(200).json({
      success: true,
      message: isNewUser
        ? "Account created and logged in successfully."
        : "Logged in successfully.",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        authProvider: user.authProvider,
      },
      isNewUser,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "refreshToken is required.",
      });
    }

    const decoded = await verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Deactivated accounts cannot refresh their session.
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact HR.",
      });
    }

    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully.",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Invalid refresh token.",
    });
  }
};

export const employeeLogin = async (req, res) => {
  try {
    const { error, value } = employeeLoginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { phone, countryCode, email, password } = value;

    let user;

    if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else if (phone) {
      const normalizedPhone = normalizePhone(phone, countryCode);
      user = await User.findOne({ phone: normalizedPhone });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    // ── Check if account is active ───────────────────────────────────────────
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact HR.",
      });
    }

    const STAFF_ROLES = ["employee", "production_staff", "packaging_staff", "dispatch_staff"];
    
    // Allow login if:
    // 1. Role is explicitly in STAFF_ROLES
    // 2. User has a department role (HR, Manager, etc.)
    // 3. User has operational roles (Production, Warehouse, etc.)
    const hasStaffAccess = 
      STAFF_ROLES.includes(user.role) || 
      (user.departmentRole && user.departmentRole !== "") ||
      (user.operationalRoles && user.operationalRoles.length > 0);

    if (!hasStaffAccess) {
      return res.status(403).json({
        success: false,
        message: "Access restricted to employee accounts.",
      });
    }

    // ── PIN vs Password detection ─────────────────────────────────────────────
    // If the supplied credential is 4–6 digits only, treat it as a PIN attempt.
    const isPinAttempt = /^\d{4,6}$/.test(password);

    if (isPinAttempt && user.pin) {
      // PIN path
      const isPinMatch = await user.comparePin(password);
      if (!isPinMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials." });
      }
    } else {
      // Password path (also handles numeric passwords longer than 6 digits)
      if (!user.password) {
        return res.status(401).json({
          success: false,
          message: "Password not set for this account.",
        });
      }
      const isMatch = await user.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials." });
      }
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, req.ip);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        operationalRoles: user.operationalRoles ?? [],
        currentOperationalRole: user.currentOperationalRole ?? null,
        departmentRole: user.departmentRole ?? null,
        allowedPaths: user.allowedPaths ?? [],
        isPhoneVerified: user.isPhoneVerified,
        hasPin: Boolean(user.pin),
      },
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};
export const adminLogin = async (req, res) => {
  try {
    const { phone, email, password } = req.body;
    // The login form no longer asks for a country — every phone login is
    // assumed Indian unless a caller explicitly passes one.
    const countryCode = req.body.countryCode || "IN";

    // Admins can sign in with either an email (founders/co-founders) or a
    // phone number (legacy admin accounts). Either identifier is acceptable.
    if ((!email && !phone) || !password) {
      return res.status(400).json({
        success: false,
        message: "email or phone, and password are required.",
      });
    }

    let user;
    if (email) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      const normalizedPhone = normalizePhone(phone, countryCode);
      user = await User.findOne({ phone: normalizedPhone });
    }

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access restricted to admins only." });
    }

    // ── Check if account is active ───────────────────────────────────────────
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact HR.",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: "Password not set for this account.",
      });
    }

    const isMatch = await user.comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, req.ip);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

export const testerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    let isNewUser = false;

    if (!user) {
      // Create temporary tester user
      user = await User.create({
        email: email.toLowerCase(),
        password,
        isEmailVerified: true,
        authProvider: ["local"],
        role: "user"
      });
      isNewUser = true;
    } else {
      // Verify password
      if (!user.password) {
        return res.status(401).json({
          success: false,
          message: "Password not set for this account.",
        });
      }
      const isMatch = await user.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials." });
      }
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, req.ip);

    return res.status(200).json({
      success: true,
      message: isNewUser ? "Account created and logged in successfully." : "Logged in successfully.",
      accessToken,
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isPhoneVerified: user.isPhoneVerified,
        isEmailVerified: user.isEmailVerified,
        authProvider: user.authProvider,
      },
      isNewUser,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};
