import mongoose from "mongoose";

const workLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lat: {
      type: Number,
      required: true,
      min: [-90, "Latitude must be between -90 and 90"],
      max: [90, "Latitude must be between -90 and 90"],
    },
    lng: {
      type: Number,
      required: true,
      min: [-180, "Longitude must be between -180 and 180"],
      max: [180, "Longitude must be between -180 and 180"],
    },
    // Configurable per-location; spec default is 100 m
    radiusMeters: {
      type: Number,
      default: 100,
      min: 10,
    },
    // Employees explicitly assigned to this location
    assignedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Department names (string match against EmployeeProfile.department)
    assignedDepartments: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

workLocationSchema.index({ isActive: 1 });
workLocationSchema.index({ assignedEmployees: 1 });

export default mongoose.model("WorkLocation", workLocationSchema);
