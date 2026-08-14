import * as notificationService from './employee-notification.service.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const filter = req.query.filter === 'unread' ? 'unread' : 'all';
    const notifications = await notificationService.getMyNotifications(req.user._id, filter);
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await notificationService.getUnreadCount(req.user._id);
    res.status(200).json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user._id);
    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    const count = await notificationService.markAllRead(req.user._id);
    res.status(200).json({ success: true, message: `${count} notification(s) marked as read` });
  } catch (err) {
    next(err);
  }
};
