import AuditLog from './models/auditLog.model.js';

export const getAuditLogs = async ({ page = 1, limit = 50 }) => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const skip = (safePage - 1) * safeLimit;

  try {
    const [logs, total] = await Promise.all([
      AuditLog.find()
        .populate('actorId', 'name lastName role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean(),
      AuditLog.countDocuments(),
    ]);

    return {
      logs,
      total,
      pages: total === 0 ? 0 : Math.ceil(total / safeLimit),
    };
  } catch (error) {
    console.error('[AuditLogs] getAuditLogs error:', error);
    throw error;
  }
};

export const logAudit = async ({ actorId, action, entity, entityId, oldMetrics = null, newMetrics = null, ipAddress = null }) => {
  try {
    const log = new AuditLog({
      actorId,
      action,
      entity,
      entityId,
      oldMetrics,
      newMetrics,
      ipAddress
    });
    
    // Non-blocking save
    log.save().catch((err) => {
      console.error('Failed to save audit log:', err);
    });
    
    return true;
  } catch (error) {
    console.error('Audit Logging Exception:', error);
    return false; // Don't crash main execution for logging error
  }
};
