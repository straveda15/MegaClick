import crypto from "crypto";
import Otp from "./otp.model.js";

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 2;
const OTP_COOLDOWN_SECONDS = 30;
const MAX_ATTEMPTS = 5;

const hashOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

const createRandomOtp = () => {
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;
  return crypto.randomInt(min, max + 1).toString();
};

export const generateOtp = async ({ identifier, type, ipAddress, userAgent }) => {
  const lastOtp = await Otp.findOne({ identifier, type })
    .sort({ createdAt: -1 })
    .lean();

  if (lastOtp) {
    const secondsSinceLast =
      (Date.now() - new Date(lastOtp.lastSentAt).getTime()) / 1000;

    if (secondsSinceLast < OTP_COOLDOWN_SECONDS) {
      const waitFor = Math.ceil(OTP_COOLDOWN_SECONDS - secondsSinceLast);
      const err = new Error(
        `Please wait ${waitFor} seconds before requesting a new OTP.`
      );
      err.statusCode = 429;
      throw err;
    }
  }

  await Otp.deleteMany({ identifier, type });

  const rawOtp = createRandomOtp();
  const otpHash = hashOtp(rawOtp);

  await Otp.create({
    identifier,
    otpHash,
    type,
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
    attempts: 0,
    maxAttempts: MAX_ATTEMPTS,
    isUsed: false,
    lastSentAt: new Date(),
    ipAddress,
    userAgent,
  });

  return rawOtp;
};

export const verifyOtp = async ({ identifier, otp, type }) => {
  const otpRecord = await Otp.findOne({
    identifier,
    type,
    isUsed: false,
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    const err = new Error("OTP not found or already used.");
    err.statusCode = 400;
    throw err;
  }

  if (new Date() > otpRecord.expiresAt) {
    const err = new Error("OTP has expired. Please request a new one.");
    err.statusCode = 400;
    throw err;
  }

  if (otpRecord.attempts >= otpRecord.maxAttempts) {
    const err = new Error(
      "Maximum verification attempts exceeded. Please request a new OTP."
    );
    err.statusCode = 429;
    throw err;
  }

  const incomingHash = hashOtp(otp);

  if (incomingHash !== otpRecord.otpHash) {
    otpRecord.attempts += 1;
    await otpRecord.save();

    const remaining = otpRecord.maxAttempts - otpRecord.attempts;
    const err = new Error(
      `Invalid OTP. ${remaining} attempt(s) remaining.`
    );
    err.statusCode = 400;
    throw err;
  }

  otpRecord.isUsed = true;
  await otpRecord.save();

  return true;
};