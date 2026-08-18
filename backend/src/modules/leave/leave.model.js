import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeProfile",
    },
    leaveType: {
      type: String,
      enum: ["sick", "casual", "earned", "maternity", "paternity", "other"],
      required: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
    // A half day is a single date worked in part. Kept as its own flag rather
    // than inferred from `days === 0.5`, so the session (morning/afternoon) has
    // somewhere to live and rounding can never turn a half day into a full one.
    isHalfDay: {
      type: Boolean,
      default: false,
    },
    halfDaySession: {
      type: String,
      enum: ["first_half", "second_half"],
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
    // True when this leave deducted from the user's LeaveBalance (self-service apply).
    // Gates balance restoration on cancel/reject so admin-created leaves aren't refunded.
    balanceDeducted: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

leaveSchema.index({ userId: 1 });
leaveSchema.index({ status: 1 });
leaveSchema.index({ fromDate: 1, toDate: 1 });

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;
