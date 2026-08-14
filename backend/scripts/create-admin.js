/**
 * Bootstrap the first admin account.
 *
 * A fresh database has no users, and every screen in the dashboard sits behind
 * an authenticated admin — including the one that creates employees. This
 * script breaks that chicken-and-egg by writing an admin directly.
 *
 * Usage (from the Backend directory):
 *   node scripts/create-admin.js --email you@example.com --password "secret123" --name "Your Name"
 *
 * A phone number may be supplied instead of / as well as an email, in E.164
 * format (leading + and country code):
 *   node scripts/create-admin.js --phone +919876543210 --password "secret123"
 *
 * Re-running with an identifier that already exists promotes that account to
 * admin and resets its password, so it doubles as a password-reset tool.
 */

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const { default: User } = await import("../src/modules/user/user.model.js");

// ── Parse --flag value pairs ────────────────────────────────────────────────
const args = {};
for (let i = 2; i < process.argv.length; i += 2) {
  const key = process.argv[i];
  if (!key.startsWith("--")) {
    console.error(`Unexpected argument "${key}". Expected --flag value pairs.`);
    process.exit(1);
  }
  args[key.slice(2)] = process.argv[i + 1];
}

const { email, phone, password, name = "Admin", lastName = "" } = args;

// ── Validate ────────────────────────────────────────────────────────────────
if (!email && !phone) {
  console.error("Provide at least one of --email or --phone.");
  process.exit(1);
}
if (!password) {
  console.error("--password is required.");
  process.exit(1);
}
if (password.length < 6) {
  console.error("--password must be at least 6 characters (schema minimum).");
  process.exit(1);
}
if (email && !/^\S+@\S+\.\S+$/.test(email)) {
  console.error(`"${email}" is not a valid email address.`);
  process.exit(1);
}
if (phone && !/^\+[1-9]\d{7,14}$/.test(phone)) {
  console.error(
    `"${phone}" is not valid E.164 format. Expected a leading + and country code, e.g. +919876543210.`
  );
  process.exit(1);
}

const uri = process.env.MONGO_URI || process.env.LOCAL_MONGO_URI;
if (!uri) {
  console.error("No MongoDB URI found. Set MONGO_URI or LOCAL_MONGO_URI in Backend/.env");
  process.exit(1);
}

// ── Write ───────────────────────────────────────────────────────────────────
try {
  await mongoose.connect(uri);
  console.log("MongoDB connected:", mongoose.connection.name);

  const lookup = email ? { email: email.toLowerCase() } : { phone };
  let user = await User.findOne(lookup);
  const existed = Boolean(user);

  if (!user) user = new User();

  if (email) user.email = email.toLowerCase();
  if (phone) user.phone = phone;
  user.name = name;
  if (lastName) user.lastName = lastName;
  user.role = "admin";
  user.isActive = true;
  user.source = "admin_panel";
  // Mark the identifier verified so the login screen doesn't demand an OTP.
  if (email) user.isEmailVerified = true;
  if (phone) user.isPhoneVerified = true;
  if (!user.authProvider?.includes("local")) {
    user.authProvider = [...(user.authProvider ?? []), "local"];
  }
  // Assigned raw — the schema's pre-save hook bcrypt-hashes it.
  user.password = password;

  await user.save();

  console.log(
    existed
      ? "\nExisting account promoted to admin and password reset:"
      : "\nAdmin account created:"
  );
  console.log("  id:    ", user._id.toString());
  console.log("  name:  ", [user.name, user.lastName].filter(Boolean).join(" "));
  if (user.email) console.log("  email: ", user.email);
  if (user.phone) console.log("  phone: ", user.phone);
  console.log("\nSign in at http://localhost:8080/login using the Admin tab.");
} catch (err) {
  console.error("\nFailed to create admin:", err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
