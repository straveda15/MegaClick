import mongoose from 'mongoose';

const attendanceLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true
  },
  punchIn: {
    type: Date,
    required: true
  },
  punchOut: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Present', 'Late', 'Absent', 'Auto-Completed'],
    default: 'Present'
  },
  totalHours: {
    type: Number,
    default: 0
  },
  deviceInfo: {
    type: Object
  }
}, { timestamps: true });

// HARDENING: Absolute Database Level constraint preventing double-punch per day
// Extremely critical so overlapping transactions physically cannot override it
attendanceLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('AttendanceLog', attendanceLogSchema);
