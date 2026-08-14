import { EventEmitter } from "events";
import * as salesNotification from "../utils/salesNotification.js";
// We don't import services directly here if they cause circular deps, or we can use dynamic imports if needed.

class SalesEventBus extends EventEmitter {}
const salesEventBus = new SalesEventBus();

/**
 * Event: RETURN_REGISTERED
 * payload { salesReturn, customer }
 */
salesEventBus.on("RETURN_REGISTERED", async ({ salesReturn, customer }) => {
    try {
        console.log(`[EventBus] RETURN_REGISTERED logic triggered for returnId: ${salesReturn._id}`);
        salesNotification.notifyReturnRegistered(salesReturn, customer);
    } catch (err) {
        console.error("[EventBus] Error handling RETURN_REGISTERED", err);
    }
});

/**
 * Event: ORDER_CONFIRMED
 * payload { order, customer }
 */
salesEventBus.on("ORDER_CONFIRMED", async ({ order, customer }) => {
    try {
        console.log(`[EventBus] ORDER_CONFIRMED logic triggered for orderId: ${order._id}`);
        salesNotification.notifyOrderConfirmed(order, customer);
        // Note: Real "push pushToPackagingQueue" logic would go here.
        // We will log it for now as the actual shipment triggering is handled by order.service.confirmOrder()
    } catch (err) {
        console.error("[EventBus] Error handling ORDER_CONFIRMED", err);
    }
});

/**
 * Event: LEAD_CONVERTED
 * payload { lead, order }
 */
salesEventBus.on("LEAD_CONVERTED", async ({ lead, order }) => {
    try {
        console.log(`[EventBus] LEAD_CONVERTED logic triggered for leadId: ${lead._id}`);
        // Can trigger packaging or other notifications
    } catch (err) {
        console.error("[EventBus] Error handling LEAD_CONVERTED", err);
    }
});

/**
 * Event: RETURN_APPROVED
 * payload { salesReturn, customer }
 */
salesEventBus.on("RETURN_APPROVED", async ({ salesReturn, customer }) => {
     try {
         console.log(`[EventBus] RETURN_APPROVED logic triggered for returnId: ${salesReturn._id}`);
         salesNotification.notifyReturnApproved(salesReturn, customer);
         
         // Trigger the real pickup integration
         // Note: in a true async decoupled system, we might just fire a job.
         try {
             const { initiatePickup } = await import("../services/salesReturn.service.js");
             await initiatePickup(salesReturn._id, "system_event_bus");
         } catch (pickupErr) {
             console.error("[EventBus] Error triggering pickup", pickupErr);
         }
     } catch (err) {
        console.error("[EventBus] Error handling RETURN_APPROVED", err);
     }
});

/**
 * Event: TASK_OVERDUE
 * payload { task, assignee }
 */
salesEventBus.on("TASK_OVERDUE", async ({ task, assignee }) => {
    try {
        console.log(`[EventBus] TASK_OVERDUE logic triggered for taskId: ${task._id}`);
        salesNotification.notifyTaskOverdue(task, assignee);
    } catch (err) {
        console.error("[EventBus] Error handling TASK_OVERDUE", err);
    }
});

/**
 * Event: LEAD_STALE 
 * payload { lead, customer }
 */
salesEventBus.on("LEAD_STALE", async ({ lead, customer }) => {
     try {
        console.log(`[EventBus] LEAD_STALE logic triggered for leadId: ${lead._id}`);
        salesNotification.notifyCartAbandonment(customer, lead);
     } catch (err) {
        console.error("[EventBus] Error handling LEAD_STALE", err);
     }
});

export default salesEventBus;
