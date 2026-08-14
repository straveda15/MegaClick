import { getAuditLogs } from './audit.service.js';

const MAX_LIMIT = 100;

export const getAllLogs = async (req, res) => {
  try {
    const rawPage = parseInt(req.query.page, 10);
    const rawLimit = parseInt(req.query.limit, 10);
    const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const limit = Number.isNaN(rawLimit) || rawLimit < 1 ? 50 : Math.min(rawLimit, MAX_LIMIT);

    const data = await getAuditLogs({ page, limit });

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('[AuditLogs]', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching audit logs'
    });
  }
};
