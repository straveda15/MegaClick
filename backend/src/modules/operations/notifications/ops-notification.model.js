import mongoose from "mongoose";

const opsNotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["low_inventory", "batch_due", "payment_due"],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    roleTarget: {
      type: String,
      enum: ["admin", "warehouse", "production", "packaging", "dispatch", "ops_staff"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

opsNotificationSchema.index({ roleTarget: 1, isRead: 1 });

const OpsNotification = mongoose.model("OpsNotification", opsNotificationSchema);

export default OpsNotification;
