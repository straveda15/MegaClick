import mongoose from 'mongoose';

const outboxEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    index: true
  },
  payload: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'processed', 'failed'],
    default: 'pending',
    index: true
  },
  lockedUntil: {
    type: Date, // Null if not locked. If lockedUntil < now, consider it a crashed worker
    index: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  failedReason: {
    type: String
  }
}, { timestamps: true });

// Optimizes the sweeping query for $findOneAndUpdate
outboxEventSchema.index({ status: 1, lockedUntil: 1 });

export default mongoose.model('OutboxEvent', outboxEventSchema);
