import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  entity: {
    type: String,
    required: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  oldMetrics: {
    type: Object
  },
  newMetrics: {
    type: Object
  },
  ipAddress: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
