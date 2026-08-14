/**
 * Notification Service Bridge
 * Contains existing stubs + potential operations logic
 */

export const sendOrderConfirmation = async (order) => {
    // TODO: MSG91 transactional SMS + Email (SendGrid / alternative)
    // MSG91: POST https://control.msg91.com/api/v5/flow/
    // Requires: DLT-approved transactional SMS template (separate from OTP template)
    // Template variables: {{order_id}}, {{amount}}, {{customer_name}}, {{delivery_date}}
    console.log(`Stub: Sent order confirmation for order: ${order.orderNumber}`);
    return true;
};