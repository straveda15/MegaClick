import eventBus, { EVENTS } from '../../shared/events/eventBus.js';
import { createNotification } from './employee-notification.service.js';
import User from '../user/user.model.js';
import logger from '../../shared/infrastructure/logger.js';

const safe = (label, fn) => async (payload) => {
  try {
    await fn(payload);
  } catch (err) {
    logger.error(`[NotificationListener] Failed to handle ${label}`, { error: err.message });
  }
};

export const bootstrapNotificationListeners = () => {
  // Task assigned — notify the assignee
  eventBus.on(
    EVENTS.TASK.CREATED,
    safe('task.created', async ({ taskId, assignedUserId, title }) => {
      if (!assignedUserId) return; // role-bucket tasks: no specific assignee yet
      await createNotification({
        recipientId: assignedUserId,
        type: 'task_assigned',
        title: 'New Task Assigned',
        body: title || 'You have been assigned a new task.',
        relatedEntityType: 'task',
        relatedEntityId: taskId,
      });
    })
  );

  // Task overdue — notify the assignee
  eventBus.on(
    EVENTS.TASK.OVERDUE,
    safe('task.overdue', async ({ taskId, assignedUserId, title }) => {
      if (!assignedUserId) return;
      await createNotification({
        recipientId: assignedUserId,
        type: 'task_overdue',
        title: 'Task Overdue',
        body: `Your task "${title || 'a task'}" is overdue.`,
        relatedEntityType: 'task',
        relatedEntityId: taskId,
      });
    })
  );

  // Leave status changed — notify the employee
  eventBus.on(
    EVENTS.LEAVE.STATUS_CHANGED,
    safe('leave.status_changed', async ({ leaveId, userId, status, leaveType, days }) => {
      const isApproved = status === 'approved';
      await createNotification({
        recipientId: userId,
        type: isApproved ? 'leave_approved' : 'leave_rejected',
        title: isApproved ? 'Leave Approved' : 'Leave Rejected',
        body: `Your ${leaveType} leave request for ${days} day(s) has been ${status}.`,
        relatedEntityType: 'leave',
        relatedEntityId: leaveId,
      });
    })
  );

  // Payslip generated — notify the employee
  eventBus.on(
    EVENTS.PAYSLIP.GENERATED,
    safe('payslip.generated', async ({ payslipId, employeeId, month, netPay }) => {
      await createNotification({
        recipientId: employeeId,
        type: 'payslip_ready',
        title: 'Payslip Ready',
        body: `Your payslip for ${month} is ready. Net pay: ₹${netPay?.toFixed(2) ?? '—'}.`,
        relatedEntityType: 'payslip',
        relatedEntityId: payslipId,
      });
    })
  );

  // Low stock alert — notify warehouse / ops_staff (system-wide; handled separately)
  eventBus.on(
    EVENTS.INVENTORY.LOW_STOCK_ALERT,
    safe('inventory.low_stock', async ({ productId, productName, recipientId }) => {
      if (!recipientId) return; // only fires if caller supplies a specific recipient
      await createNotification({
        recipientId,
        type: 'low_stock',
        title: 'Low Stock Alert',
        body: `Stock for "${productName || productId}" has fallen below reorder level.`,
        relatedEntityType: null,
        relatedEntityId: productId,
      });
    })
  );

  // Order confirmed — notify all packaging_staff users
  eventBus.on(
    EVENTS.ORDER.CONFIRMED,
    safe('order.confirmed', async ({ orderId, orderDisplayId }) => {
      const packagingUsers = await User.find({ role: 'packaging_staff', isActive: true })
        .select('_id')
        .lean();
      await Promise.all(
        packagingUsers.map((u) =>
          createNotification({
            recipientId: u._id,
            type: 'order_ready_to_pack',
            title: 'New order ready to pack',
            body: `Order ${orderDisplayId} is ready for packaging`,
            relatedEntityType: 'order',
            relatedEntityId: orderId,
          })
        )
      );
    })
  );

  // Order packed — notify all dispatch_staff users (handoff: packaging → dispatch queue)
  eventBus.on(
    EVENTS.ORDER.PACKED,
    safe('order.packed (dispatch_staff)', async ({ orderId, orderDisplayId }) => {
      const dispatchUsers = await User.find({ role: 'dispatch_staff', isActive: true })
        .select('_id')
        .lean();
      await Promise.all(
        dispatchUsers.map((u) =>
          createNotification({
            recipientId: u._id,
            type: 'order_packed',
            title: 'New order ready for dispatch',
            body: `Order ${orderDisplayId || orderId} has been packed and is in the dispatch queue.`,
            relatedEntityType: 'order',
            relatedEntityId: orderId,
          })
        )
      );
    })
  );

  // Order packed — notify all ops_staff employees (handoff: packaging → ops/dispatch)
  eventBus.on(
    EVENTS.ORDER.PACKED,
    safe('order.packed', async ({ orderId, orderDisplayId }) => {
      const opsStaffUsers = await User.find({
        role: 'employee',
        operationalRoles: 'ops_staff',
        isActive: true,
      })
        .select('_id')
        .lean();

      await Promise.all(
        opsStaffUsers.map((u) =>
          createNotification({
            recipientId: u._id,
            type: 'order_packed',
            title: 'Order ready for dispatch',
            body: `Order ${orderDisplayId || orderId} has been packed and is ready for dispatch.`,
            relatedEntityType: 'order',
            relatedEntityId: orderId,
          })
        )
      );
    })
  );

  // Stock adjusted below reorder threshold — notify ops_staff employees
  eventBus.on(
    EVENTS.INVENTORY.STOCK_ADJUSTED,
    safe('inventory.stock_adjusted', async ({ productName, newQty, reorderAt, itemId }) => {
      if (newQty > reorderAt) return; // only alert when below threshold

      const recipients = await User.find({ role: 'employee', operationalRoles: 'ops_staff', isActive: true })
        .select('_id')
        .lean();
      if (recipients.length === 0) return;

      const body =
        newQty === 0
          ? `${productName || 'A product'} is out of stock.`
          : `${productName || 'A product'} is running low — only ${newQty} units left.`;

      await Promise.all(
        recipients.map((u) =>
          createNotification({
            recipientId: u._id,
            type: 'low_stock',
            title: 'Low Stock Alert',
            body,
            relatedEntityType: null,
            relatedEntityId: itemId,
          })
        )
      );
    })
  );

  // Order dispatched — confirm to the dispatch_staff user who dispatched it
  eventBus.on(
    EVENTS.ORDER.DISPATCHED,
    safe('order.dispatched', async ({ orderId, orderDisplayId, dispatchedBy }) => {
      if (!dispatchedBy) return;
      await createNotification({
        recipientId: dispatchedBy,
        type: 'order_dispatched',
        title: 'Order dispatched',
        body: `Order ${orderDisplayId || orderId} has been successfully dispatched.`,
        relatedEntityType: 'order',
        relatedEntityId: orderId,
      });
    })
  );

  logger.info('[NotificationListener] Employee notification listeners registered');
};