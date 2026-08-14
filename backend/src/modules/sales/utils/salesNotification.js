/**
 * Notification Abstraction Layer for Sales Operations Engine
 * Provides hooks for WhatsApp / SMS integration.
 * Currently uses console logging to simulate external API calls.
 */

export const notifyCartAbandonment = async (customer, lead) => {
    // TODO: MSG91 transactional SMS or WhatsApp Business API
    // Endpoint: POST https://control.msg91.com/api/v5/flow/ (requires flow_id from MSG91 console)
    // Use sms.service.js pattern as reference for MSG91 REST API integration
    console.log(`[Notification Hook] 🛒 Cart Abandonment / Stale Lead for customer ${customer.name} (${customer.phone})`);
    console.log(`   Message: "Hi ${customer.name}, you left something in your cart / inquiry. Complete it now!"`);
    return true;
};

export const notifyLeadInactive = async (customer, lead) => {
    // TODO: WhatsApp Business API or MSG91 transactional SMS
    // Separate integration from OTP service (uses different endpoint and approval flow)
    console.log(`[Notification Hook] 💤 Lead Inactive notice for ${customer.name}`);
    return true;
};

export const notifyTaskOverdue = async (task, assignee) => {
    // Notify the internal team, possibly via Slack or internal SMS
    // assignee would be a User doc
    console.log(`[Notification Hook] ⏰ OVERDUE TASK ALERT to ${assignee?.name || 'Manager'}`);
    console.log(`   Task: ${task.title} is overdue!`);
    return true;
};

export const notifyOrderConfirmed = async (order, customer) => {
    // TODO: MSG91 transactional SMS (separate from OTP, uses different template)
    // POST https://control.msg91.com/api/v5/flow/
    // Also consider email integration (separate service, e.g., SendGrid)
    console.log(`[Notification Hook] ✅ Order ${order.orderNumber || order._id} confirmed for ${customer?.name}`);
    return true;
};

export const notifyReturnRegistered = async (salesReturn, customer) => {
    // TODO: MSG91 transactional SMS or email integration
    console.log(`[Notification Hook] 📝 Return Registered for order ${salesReturn.orderId}. Customer: ${customer?.name}`);
    return true;
};

export const notifyReturnApproved = async (salesReturn, customer) => {
    // TODO: MSG91 transactional SMS or email integration
    console.log(`[Notification Hook] 📦 Return approved. Pickup initiated for order ${salesReturn.orderId}`);
    return true;
};
