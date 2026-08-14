import Order from './order.model.js';
import User from '../user/user.model.js';
import * as taskService from '../task/task.service.js';
import eventBus, { EVENTS } from '../../shared/events/eventBus.js';
import mongoose from 'mongoose';

// SLA for getting a confirmed order packed, measured from order creation. Used
// to derive a `dueAt` so the UI can flag overdue-to-pack orders.
const PACKAGING_SLA_HOURS = 24;

/**
 * GET /api/v1/orders/packaging/queue
 * Returns all CONFIRMED orders that are not yet packed, oldest first.
 * Guard: packaging_staff only
 */
export const getPackagingQueue = async (req, res) => {
  try {
    // All CONFIRMED orders — including ones already packed but not yet dispatched
    // (they stay CONFIRMED until dispatch), so the UI can show a "Packed" filter.
    const orders = await Order.find({
      orderStatus: 'CONFIRMED',
    })
      .sort({ createdAt: 1 })
      .lean();

    const data = orders.map((order) => {
      const addr = order.shippingAddress || {};
      const firstName = addr.firstName || '';
      const lastInitial = addr.lastName ? addr.lastName.charAt(0) + '.' : '';
      return {
        _id: order._id,
        orderId: order.orderNumber,
        status: order.orderStatus,
        packagingStatus: order.packagingStatus || 'pending',
        customer: {
          name: lastInitial ? `${firstName} ${lastInitial}` : firstName,
          city: addr.city || '',
        },
        itemCount: Array.isArray(order.items) ? order.items.length : 0,
        packagingNotes: order.packagingNotes || '',
        hasSpecialNotes: Boolean(order.packagingNotes && order.packagingNotes.length > 0),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        dueAt: new Date(new Date(order.createdAt).getTime() + PACKAGING_SLA_HOURS * 60 * 60 * 1000),
      };
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/v1/orders/packaging/:orderId
 * Full order detail for packaging context.
 * Guard: packaging_staff only
 */
export const getPackagingOrderDetail = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('userId', 'name email phone')
      .lean();

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const addr = order.shippingAddress || {};
    const data = {
      _id: order._id,
      orderId: order.orderNumber,
      orderStatus: order.orderStatus,
      packagingStatus: order.packagingStatus || 'pending',
      assignedPackager: order.assignedPackager || null,
      customer: {
        name: `${addr.firstName || ''} ${addr.lastName || ''}`.trim(),
        phone: addr.phone || '',
        city: addr.city || '',
        state: addr.state || '',
        addressLine1: addr.addressLine1 || '',
        addressLine2: addr.addressLine2 || '',
        postalCode: addr.postalCode || '',
      },
      items: (order.items || []).map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        priceAtPurchase: item.priceAtPurchase ?? 0,
        lineTotal: (item.priceAtPurchase ?? 0) * (item.quantity ?? 0),
        weight: item.weight || null,
        variant: item.variant || null,
      })),
      packagingNotes: order.packagingNotes || '',
      hasSpecialNotes: Boolean(order.packagingNotes && order.packagingNotes.length > 0),
      pricing: order.pricing,
      createdAt: order.createdAt,
    };

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/v1/orders/packaging/:orderId/status
 * Body: { packagingStatus: 'in_progress' | 'packed' }
 * Guard: packaging_staff only
 */
export const updatePackagingStatus = async (req, res) => {
  try {
    const { packagingStatus } = req.body;

    if (!packagingStatus || !['in_progress', 'packed'].includes(packagingStatus)) {
      return res.status(400).json({
        success: false,
        message: "packagingStatus must be 'in_progress' or 'packed'",
      });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus !== 'CONFIRMED') {
      return res.status(400).json({
        success: false,
        message: `Only CONFIRMED orders can have packaging status updated (current: ${order.orderStatus})`,
      });
    }

    order.packagingStatus = packagingStatus;

    if (packagingStatus === 'in_progress' && !order.assignedPackager) {
      order.assignedPackager = req.user._id;
    }

    await order.save();

    if (packagingStatus === 'packed') {
      // ── Create Dispatch Tasks ───────────────────────────────────────────
      // Find all active dispatch staff to ensure they all see the task
      const dispatchStaff = await User.find({ 
        operationalRoles: { $in: ['dispatch'] }, 
        isActive: true 
      }).select('_id').lean();

      if (dispatchStaff.length > 0) {
        const groupId = new mongoose.Types.ObjectId();
        await Promise.all(dispatchStaff.map(staff => 
          taskService.createTask({
            title: `Dispatch: ${order.orderNumber}`,
            description: `Order ${order.orderNumber} is packed and ready for dispatch.`,
            type: 'order_review',
            status: 'pending',
            assignedTo: staff._id,
            assignedBy: req.user._id,
            relatedEntity: { entityType: 'Order', entityId: order._id },
            source: 'system_trigger',
            priority: 'high',
            taskGroup: groupId,
            dueAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours to dispatch
          })
        ));
      }

      eventBus.emit(EVENTS.ORDER.PACKED, {
        orderId: order._id,
        orderDisplayId: order.orderNumber,
        packagerId: req.user._id,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: order._id,
        orderId: order.orderNumber,
        orderStatus: order.orderStatus,
        packagingStatus: order.packagingStatus,
        dispatchStatus: order.dispatchStatus,
        assignedPackager: order.assignedPackager,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
