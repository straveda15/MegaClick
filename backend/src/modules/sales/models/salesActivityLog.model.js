import mongoose from "mongoose";

const salesActivityLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      // e.g., 'CSV_UPLOADED', 'ORDER_CONFIRMED', 'LEAD_CONVERTED', 'RETURN_APPROVED', 'TASK_COMPLETED'
    },
    entityType: {
      type: String,
      required: true,
      // e.g., 'Order', 'SalesLead', 'SalesReturn', 'Task', 'CSVUpload'
    },
    entityId: {
      type: mongoose.Schema.Types.Mixed, // Could be ObjectId string or other ID
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}, // For storing arbitrary JSON relevant to the action (e.g., previous state, new state)
    },
  },
  {
    timestamps: true, // we will use createdAt as the timestamp
  }
);

salesActivityLogSchema.index({ entityType: 1, entityId: 1 });
salesActivityLogSchema.index({ actor: 1, createdAt: -1 });
salesActivityLogSchema.index({ action: 1, createdAt: -1 });

const SalesActivityLog = mongoose.model("SalesActivityLog", salesActivityLogSchema);

export default SalesActivityLog;
