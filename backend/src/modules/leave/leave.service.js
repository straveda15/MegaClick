import Leave from "./leave.model.js";
import LeaveBalance from "./leave-balance.model.js";
import EmployeeProfile from "../team/team.model.js";
import eventBus, { EVENTS } from "../../shared/events/eventBus.js";

class LeaveService {
  async applyLeave(data, requesterId) {
    const { userId, fromDate, toDate, leaveType, reason } = data;

    // Verify employee profile exists
    const profile = await EmployeeProfile.findOne({ userId });
    if (!profile) throw new Error("Employee profile not found.");

    // Calculate days
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffMs = end - start;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive

    const leave = await Leave.create({
      userId,
      employeeProfileId: profile._id,
      leaveType,
      fromDate: start,
      toDate: end,
      days: diffDays,
      reason,
      requestedBy: requesterId,
      status: "pending",
    });

    return leave;
  }

  async updateLeaveStatus(id, updateData, adminId) {
    const { status, rejectionReason } = updateData;

    const leave = await Leave.findById(id);
    if (!leave) throw new Error("Leave request not found.");

    if (leave.status !== "pending") {
      throw new Error(`Leave request is already ${leave.status}.`);
    }

    const balanceTypes = ["sick", "casual", "earned"];

    // Deduct from the balance only now, on approval — this is what moves the KPI
    // counts. A rejection never touches the balance. (The `balanceDeducted` guard
    // also stops any legacy leave that already deducted at apply time from being
    // double-counted here.)
    if (status === "approved" && !leave.balanceDeducted && balanceTypes.includes(leave.leaveType)) {
      const balance = await this.getOrCreateBalance(leave.userId);
      const bucket = balance[leave.leaveType];
      if (bucket.used + leave.days > bucket.total) {
        throw new Error(
          `Insufficient ${leave.leaveType} leave balance to approve. Available: ${bucket.total - bucket.used} day(s), requested: ${leave.days}`
        );
      }
      bucket.used += leave.days;
      await balance.save();
      leave.balanceDeducted = true;
    }

    // Legacy safety net: refund any leave that had deducted at apply time under
    // the old flow if it's now being rejected.
    if (status === "rejected" && leave.balanceDeducted) {
      const balance = await this.getOrCreateBalance(leave.userId);
      if (balance[leave.leaveType]) {
        balance[leave.leaveType].used = Math.max(0, balance[leave.leaveType].used - leave.days);
        await balance.save();
      }
      leave.balanceDeducted = false;
    }

    leave.status = status;
    leave.approvedBy = adminId;
    leave.approvedAt = new Date();
    if (rejectionReason) leave.rejectionReason = rejectionReason;

    await leave.save();

    // If an approved leave covers today, free the member's sales leads right away
    // and spread them across the available roster (the 30-min job is the safety
    // net for future-dated leaves and for when the leave ends).
    if (status === "approved") {
      const now = new Date();
      if (leave.fromDate <= now && leave.toDate >= new Date(now.toDateString())) {
        try {
          const { autoDistributeLeads } = await import("../sales/services/salesLead.service.js");
          await autoDistributeLeads(adminId);
        } catch (err) {
          console.error("[Leave] Lead redistribution on approval failed:", err.message);
        }
      }
    }

    return leave;
  }

  async getAllLeaves(filters = {}) {
    return await Leave.find({ ...filters, isDeleted: { $ne: true } })
      .populate("userId", "name lastName email")
      .populate("employeeProfileId", "employeeId designation department")
      .populate("approvedBy", "name lastName")
      .sort({ createdAt: -1 });
  }

  async getLeavesByUser(userId) {
    return await Leave.find({ userId, isDeleted: { $ne: true } })
      .populate("approvedBy", "name lastName service")
      .sort({ fromDate: -1 });
  }

  async getPendingLeaves() {
    return await Leave.find({ status: "pending", isDeleted: { $ne: true } })
      .populate("userId", "name lastName email")
      .populate("employeeProfileId", "employeeId designation department");
  }

  async softDeleteLeave(id, adminId) {
    const leave = await Leave.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(), approvedBy: adminId },
      { new: true }
    );

    if (!leave) {
      throw new Error("Leave record not found");
    }
    return leave;
  }

  // ── Self-service methods (production_staff) ──────────────────────────────

  /**
   * Get or create the current-year leave balance for a user.
   */
  async getOrCreateBalance(userId) {
    const year = new Date().getFullYear();
    let balance = await LeaveBalance.findOne({ userId, year });
    if (!balance) {
      balance = await LeaveBalance.create({ userId, year });
    }
    return balance;
  }

  async getMyLeaveBalance(userId) {
    return this.getOrCreateBalance(userId);
  }

  async getMyLeaves(userId, filters = {}) {
    const query = { userId, isDeleted: { $ne: true } };
    if (filters.status) query.status = filters.status;
    return Leave.find(query)
      .populate("approvedBy", "name lastName")
      .sort({ fromDate: -1 });
  }

  /**
   * Apply leave for self — works for both employees with HR profiles and production_staff.
   * Validates and deducts from LeaveBalance.
   */
  async applyLeaveForSelf(userId, data) {
    const { leaveType, fromDate, toDate, reason } = data;

    const allowedTypes = ["sick", "casual", "earned"];
    if (!allowedTypes.includes(leaveType)) {
      throw new Error(`Production staff may only apply for: ${allowedTypes.join(", ")}`);
    }

    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (end < start) throw new Error("toDate must be on or after fromDate");

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    if (start < startOfToday) throw new Error("Cannot apply leave for past dates");

    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Prevent overlapping leave: a person can't hold two leaves on the same
    // dates, regardless of type. Two ranges overlap when each starts on or
    // before the other ends. Only active requests (pending/approved) block.
    const overlap = await Leave.findOne({
      userId,
      isDeleted: { $ne: true },
      status: { $in: ["pending", "approved"] },
      fromDate: { $lte: end },
      toDate: { $gte: start },
    });
    if (overlap) {
      const fmt = (d) => new Date(d).toISOString().slice(0, 10);
      throw new Error(
        `These dates overlap an existing ${overlap.status} ${overlap.leaveType} leave (${fmt(overlap.fromDate)} to ${fmt(overlap.toDate)}). Pick dates that don't clash.`
      );
    }

    const balance = await this.getOrCreateBalance(userId);
    const bucket = balance[leaveType];

    // Validate against remaining (approved) balance so a request can't exceed
    // what's available — but DON'T deduct yet. The KPI counts only move once HR
    // approves; a pending request leaves the balance untouched.
    if (bucket.used + days > bucket.total) {
      throw new Error(
        `Insufficient ${leaveType} leave balance. Available: ${bucket.total - bucket.used} day(s), requested: ${days}`
      );
    }

    // Try to link employeeProfileId if one exists (optional)
    const profile = await EmployeeProfile.findOne({ userId }).select("_id").lean();

    const leave = await Leave.create({
      userId,
      employeeProfileId: profile?._id || undefined,
      leaveType,
      fromDate: start,
      toDate: end,
      days,
      reason,
      requestedBy: userId,
      status: "pending",
      balanceDeducted: false,
    });

    return leave;
  }

  /**
   * Cancel own pending leave — restores balance.
   */
  async cancelMyLeave(leaveId, userId) {
    const leave = await Leave.findOne({ _id: leaveId, userId, isDeleted: { $ne: true } });
    if (!leave) throw new Error("Leave request not found");
    if (leave.status !== "pending") {
      throw new Error(`Only pending leave requests can be cancelled (current status: ${leave.status})`);
    }

    // Restore balance — only if this leave deducted from it.
    const allowedTypes = ["sick", "casual", "earned"];
    if (leave.balanceDeducted && allowedTypes.includes(leave.leaveType)) {
      const balance = await this.getOrCreateBalance(userId);
      balance[leave.leaveType].used = Math.max(0, balance[leave.leaveType].used - leave.days);
      await balance.save();
      leave.balanceDeducted = false;
    }

    leave.isDeleted = true;
    leave.deletedAt = new Date();
    await leave.save();

    return leave;
  }

  /**
   * Called by HR/admin approval flow — emit event so notifications fire.
   */
  async updateLeaveStatusWithEvent(id, updateData, adminId) {
    const leave = await this.updateLeaveStatus(id, updateData, adminId);
    eventBus.emit(EVENTS.LEAVE.STATUS_CHANGED, {
      leaveId: leave._id,
      userId: leave.userId,
      status: leave.status,
      leaveType: leave.leaveType,
      days: leave.days,
    });
    return leave;
  }
}

export default new LeaveService();
