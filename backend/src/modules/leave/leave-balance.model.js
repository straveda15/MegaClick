import mongoose from 'mongoose';

const leaveBalanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    earned: {
      total: { type: Number, default: 18 },
      used:  { type: Number, default: 0 },
    },
    sick: {
      total: { type: Number, default: 12 },
      used:  { type: Number, default: 0 },
    },
    casual: {
      total: { type: Number, default: 7 },
      used:  { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

leaveBalanceSchema.index({ userId: 1, year: 1 }, { unique: true });

const LeaveBalance = mongoose.model('LeaveBalance', leaveBalanceSchema);

export default LeaveBalance;
