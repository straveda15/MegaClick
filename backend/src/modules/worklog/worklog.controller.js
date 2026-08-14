import * as workLogService from "./worklog.service.js";

export const getMyLogs = async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const logs = await workLogService.getMyLogs(req.user._id, { start, end });
    res.status(200).json({
      success: true,
      message: "Work logs retrieved successfully",
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const createLog = async (req, res, next) => {
  try {
    const { activity, startedAt, endedAt, note } = req.body;
    const log = await workLogService.createManualLog(req.user._id, {
      activity,
      startedAt,
      endedAt,
      note,
    });
    res.status(201).json({
      success: true,
      message: "Log entry added",
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

export const getTeamLogs = async (req, res, next) => {
  try {
    const { start, end, userId } = req.query;
    const logs = await workLogService.getTeamLogs({ start, end, userId });
    res.status(200).json({
      success: true,
      message: "Team logs retrieved successfully",
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};
