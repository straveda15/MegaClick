import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployeeProfile",
      // Optional: production_staff users may not have an HR-managed EmployeeProfile
    },
    date: {
      type: String, // format YYYY-MM-DD to easily enforce one record per day
      required: true,
    },
    punchIn: {
      type: Date,
    },
    punchOut: {
      type: Date,
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    gpsLocation: {
      lat: Number,
      lng: Number,
    },
    gpsVerified: {
      type: Boolean,
      default: false,
    },
    punchOutGpsLocation: {
      lat: Number,
      lng: Number,
    },
    punchOutGpsVerified: {
      type: Boolean,
      default: false,
    },
    // Set when employee is within a configured WorkLocation radius at punch-in
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkLocation",
      default: null,
    },
    // Where the shift is being worked from. "office" is gated on the assigned
    // work location's radius; "site" is client-site work where there is no
    // configured geofence, so the employee declares where they are instead.
    workMode: {
      type: String,
      enum: ["office", "site"],
      default: "office",
    },
    // Only set for workMode "site" — what the employee typed in, kept alongside
    // their device GPS so the two can be compared later.
    site: {
      name: { type: String, trim: true },
      lat: Number,
      lng: Number,
    },
    isHalfDay: {
      type: Boolean,
      default: false,
    },
    halfDayReason: {
      type: String,
      trim: true,
    },
    halfDayStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    halfDayApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // True once punch-out is committed with explicit confirmed: true from client
    confirmedPunchOut: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: ["mobile", "web", "dashboard"],
      default: "web",
    },
    earlyPunchOutReason: {
      type: String,
      trim: true,
    },
    earlyPunchOutStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    earlyPunchOutApprovedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["present", "half-day", "late", "absent", "on-leave"],
      default: "present",
    },
    overriddenBy: {
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

// Ensure one record per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ employeeProfileId: 1 });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
