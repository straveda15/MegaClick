import OpsNotification from "./ops-notification.model.js";

export const createNotification = async (data) => {
  const notification = new OpsNotification(data);
  await notification.save();
  return notification;
};

export const getNotificationsForRole = async (role, limit = 50) => {
  return await OpsNotification.find({ roleTarget: role })
    .sort({ createdAt: -1 })
    .limit(limit);
};

export const markAsRead = async (id) => {
  const notification = await OpsNotification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );
  if (!notification) throw new Error("Notification not found");
  return notification;
};

// --- Export logic for existing orders to bridge through
import { sendOrderConfirmation as originalSendOrderConfirmation } from "../../notification/notification.service.js";
export const sendOrderConfirmation = async (order) => {
   console.log(`Stub bridging: Order confirmation for order ${order.orderNumber}`);
   return true;
};
