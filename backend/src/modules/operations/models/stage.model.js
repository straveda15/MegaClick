import mongoose from 'mongoose';

const productionStageSchema = new mongoose.Schema({
  batchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true,
    index: true
  },
  stageName: {
    type: String,
    enum: ['mixing', 'processing', 'qc'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending'
  },
  assignedRole: {
    type: String,
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  quantityProcessed: {
    type: Number,
    default: 0
  },
  notes: {
    type: String
  },
  startedAt: { type: Date },
  completedAt: { type: Date }
}, { timestamps: true });

// HARDENING: Absolute DB Level Constraint. Ensures a batch cannot accidentally have 
// dual identical stages (e.g. two parallel 'mixing' stages) created under load spikes.
productionStageSchema.index({ batchId: 1, stageName: 1 }, { unique: true });

export default mongoose.model('ProductionStage', productionStageSchema);
