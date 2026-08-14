import * as opsNotificationService from "./ops-notification.service.js";

export const getNotifications = async (req, res) => {
  try {
    let targetRoles = [];

    if (req.user.role === "admin") {
      targetRoles = ["admin"]; 
    } else if (req.user.role === "employee" && req.user.currentOperationalRole) {
      targetRoles = [req.user.currentOperationalRole];
    } else {
      return res.status(403).json({ success: false, message: "No operational role active" });
    }

    const notifications = await opsNotificationService.getNotificationsForRole(targetRoles[0]);
    
    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await opsNotificationService.markAsRead(req.params.id);
    return res.status(200).json({ success: true, message: "Notification marked as read", data: notification });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
