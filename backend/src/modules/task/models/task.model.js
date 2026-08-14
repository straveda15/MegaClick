import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
  },
  entityType: {
    type: String, // 'Order', 'Batch', 'Stock'
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  assignedRole: {
    type: String,
    required: true,
    index: true // Key for querying tasks for a role bucket
  },
  assignedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'paused', 'completed', 'overdue'],
    default: 'pending'
  },
  dueDate: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model('ProductionTask', taskSchema);
