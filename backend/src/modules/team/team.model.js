import mongoose from "mongoose";

const employeeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      unique: true,
      required: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    employmentType: {
      type: String,
      enum: ["full-time", "contract"],
      default: "full-time",
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

// Indexes for performance

employeeProfileSchema.index({ department: 1 });
employeeProfileSchema.index({ managerId: 1 });
employeeProfileSchema.index({ status: 1 });

const EmployeeProfile = mongoose.model("EmployeeProfile", employeeProfileSchema);

export default EmployeeProfile;
