import mongoose from 'mongoose';

const employeeNotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        'task_assigned',
        'task_overdue',
        'leave_approved',
        'leave_rejected',
        'payslip_ready',
        'batch_stage_assigned',
        'low_stock',
        'order_ready_to_pack',
        'order_packed',
        'order_dispatched',
        'system',
      ],
      required: true,
    },
    title: { type: String, required: true },
    body:  { type: String, required: true },
    read:  { type: Boolean, default: false, index: true },
    relatedEntityType: {
      type: String,
      enum: ['task', 'batch', 'leave', 'payslip', 'order', null],
      default: null,
    },
    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
  },
  { timestamps: true }
);

employeeNotificationSchema.index({ recipient: 1, read: 1 });
employeeNotificationSchema.index({ recipient: 1, createdAt: -1 });

const EmployeeNotification = mongoose.model('EmployeeNotification', employeeNotificationSchema);

export default EmployeeNotification;
