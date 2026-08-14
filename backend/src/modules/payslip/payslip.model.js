import mongoose from 'mongoose';
import crypto from 'crypto';

const payslipSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: String, // 'YYYY-MM'
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/,
    },
    slipCode: {
      type: String,
      unique: true,
    },
    earnings: {
      basicSalary:        { type: Number, default: 0 },
      hra:                { type: Number, default: 0 },
      productivityBonus:  { type: Number, default: 0 },
      specialAllowance:   { type: Number, default: 0 },
    },
    deductions: {
      pf:               { type: Number, default: 0 },
      professionalTax:  { type: Number, default: 0 },
      leaveDeductions:  { type: Number, default: 0 },
    },
    grossPay:        { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netPay:          { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'generated'],
      default: 'pending',
    },
    generatedAt: { type: Date },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    pdfUrl: { type: String, default: null },
  },
  { timestamps: true }
);

// Unique constraint: one payslip per employee per month
payslipSchema.index({ employee: 1, month: 1 }, { unique: true });

payslipSchema.pre('save', function () {
  // Auto-generate slip code on first save
  if (!this.slipCode) {
    const rand = crypto.randomBytes(3).toString('hex').toUpperCase();
    this.slipCode = `SLIP-${rand}`;
  }

  // Recompute totals
  const e = this.earnings;
  this.grossPay = e.basicSalary + e.hra + e.productivityBonus + e.specialAllowance;

  const d = this.deductions;
  this.totalDeductions = d.pf + d.professionalTax + d.leaveDeductions;

  this.netPay = this.grossPay - this.totalDeductions;
});

const Payslip = mongoose.model('Payslip', payslipSchema);

export default Payslip;
