import EmployeeNotification from './employee-notification.model.js';

/**
 * Create a notification for a single recipient.
 */
export const createNotification = async ({
  recipientId,
  type,
  title,
  body,
  relatedEntityType = null,
  relatedEntityId = null,
}) => {
  return EmployeeNotification.create({
    recipient: recipientId,
    type,
    title,
    body,
    relatedEntityType,
    relatedEntityId,
  });
};

/**
 * Get notifications for the authenticated user, newest first.
 * @param {string} filter - 'all' | 'unread'
 */
export const getMyNotifications = async (userId, filter = 'all') => {
  const query = { recipient: userId };
  if (filter === 'unread') query.read = false;

  return EmployeeNotification.find(query)
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
};

export const getUnreadCount = async (userId) => {
  return EmployeeNotification.countDocuments({ recipient: userId, read: false });
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await EmployeeNotification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { $set: { read: true } },
    { new: true }
  );
  if (!notification) throw new Error('Notification not found');
  return notification;
};

export const markAllRead = async (userId) => {
  const result = await EmployeeNotification.updateMany(
    { recipient: userId, read: false },
    { $set: { read: true } }
  );
  return result.modifiedCount;
};
