import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true, 
    },

    otpHash: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["LOGIN", "SIGNUP", "RESET_PASSWORD", "VERIFY_PHONE", "RESET_PIN"],
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    maxAttempts: {
      type: Number,
      default: 5,
    },

    isUsed: {
      type: Boolean,
      default: false,
    },

    lastSentAt: {
      type: Date,
      default: Date.now,
    },

    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);


otpSchema.index({ identifier: 1, type: 1 });

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Otp", otpSchema);