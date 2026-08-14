import SalesCustomer from "../models/salesCustomer.model.js";
import User from "../../user/user.model.js";
import SalesActivityLog from "../models/salesActivityLog.model.js";
import Order from "../../order/order.model.js";
import Task from "../../task/task.model.js";
import salesEventBus from "../events/salesEventBus.js";
import { validateTransition } from "../utils/stateMachine.js";
import Return from "../../return/return.model.js";
// We import creating pending orders from existing system so we reuse logic
import * as baseOrderService from "../../order/order.service.js";

export const ingestOrdersFromCSV = async (rows, session, actorId) => {
   // 1. Upsert Customers
   const customerOps = rows.map(row => ({
      updateOne: {
         filter: { phone: row.customerPhone },
         update: {
            $setOnInsert: {
               name: row.customerName,
               email: row.customerEmail,
               source: "csv",
               createdBy: actorId,
               createdAt: new Date()
            }
         },
         upsert: true
      }
   }));
   
   await SalesCustomer.bulkWrite(customerOps, { session });
   
   // Fetch them back to get IDs
   const phones = rows.map(r => r.customerPhone);
   const customers = await SalesCustomer.find({ phone: { $in: phones } }).session(session);
   const phoneToCustomerMap = new Map(customers.map(c => [c.phone, c._id]));

   // 2. We can't use baseOrderService.createPendingOrder within bulkWrite easily because it generates order numbers
   // but for performance, we should bulk create. Given 1M scale requirement, a loop calling saving is bad.
   // Instead we'll construct the docs ourselves mimicking createPendingOrder.

   const orderDocs = await Promise.all(rows.map(async (row) => {
       const customerId = phoneToCustomerMap.get(row.customerPhone);
       
       // Build Order mock based on CSV. Real implementation would map CSV product SKUs to DB products.
       // This code assumes CSV provides valid productId.
       return {
           orderNumber: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random()*1000)}`,
           userId: customerId, // Assuming customer links can act as user in order
           items: [{
               productId: row.productId,
               productName: row.productName,
               priceAtPurchase: row.price,
               quantity: row.quantity
           }],
           shippingAddress: {
               firstName: row.customerName.split(' ')[0],
               lastName: row.customerName.split(' ').slice(1).join(' ') || '.',
               phone: row.customerPhone,
               addressLine1: row.address,
               city: row.city,
               state: row.state,
               postalCode: row.pincode,
               country: "India"
           },
           pricing: {
               subtotal: row.price * row.quantity,
               discountAmount: 0,
               finalAmount: row.price * row.quantity
           },
           source: "admin",
           // We map the sales state 'PENDING' onto the base order model
           orderStatus: "PENDING_PAYMENT"
       };
   }));

   const orders = await Order.insertMany(orderDocs, { session });
   
   // 4. Activity Logs
   await SalesActivityLog.create([{
       actor: actorId,
       action: "CSV_ORDERS_INGESTED",
       entityType: "CSVUpload",
       entityId: `upload_${Date.now()}`,
       metadata: { rowsProcessed: rows.length }
   }], { session });

};

export const confirmSalesOrder = async (orderId, actorId) => {
    // Note: State machine validation. PENDING -> CONFIRMED
    // 'PENDING' in sales terminology usually means PENDING_PAYMENT or CREATED here
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    // Our sales state logic
    // we pretend the "sales" view sees anything not paid as PENDING
    const pseudoSalesState = ["PENDING_PAYMENT", "CREATED"].includes(order.orderStatus) ? "PENDING" : order.orderStatus;
    
    validateTransition("ORDER", pseudoSalesState, "CONFIRMED");

    // In a real flow, confirmation means payment is received or COD is verified.
    // We will bypass payment and confirm the order via existing flow
    const confirmedOrder = await baseOrderService.bypassPayment(orderId);

    // Activity Log
    await SalesActivityLog.create({
        actor: actorId,
        action: "ORDER_CONFIRMED",
        entityType: "Order",
        entityId: orderId,
        metadata: { prevStatus: pseudoSalesState }
    });

    // We can mark related tasks as complete
    await Task.updateMany(
        { "relatedEntity.entityId": orderId, status: "pending" },
        { $set: { status: "completed", completedAt: new Date() } }
    );

    // Emit event
    salesEventBus.emit("ORDER_CONFIRMED", { order: confirmedOrder, customer: { name: confirmedOrder.shippingAddress.firstName } });

    return confirmedOrder;
};

export const getAssignedOrders = async (userId, filters = {}) => {
   // In a real setup, access control would be based on orders assigned via tasks.
   // Find tasks assigned to user
   const taskEntityIds = await Task.distinct("relatedEntity.entityId", {
      assignedTo: userId,
      "relatedEntity.entityType": "Order"
   });
   
   return await Order.find({ _id: { $in: taskEntityIds } }).sort({ createdAt: -1 });
};

export const createManualOrder = async (actorId, data) => {
    try {
        const { 
            firstName, lastName, phone, email, 
            flat, area, landmark, city, state, pincode,
            items 
        } = data;

        // 0. Normalize phone to E.164 (User model requirement: /^\+[1-9]\d{7,14}$/)
        let normalizedPhone = String(phone || "").replace(/[^\d+]/g, "");
        if (/^\d{10}$/.test(normalizedPhone)) {
            normalizedPhone = `+91${normalizedPhone}`;
        } else if (/^\d{12}$/.test(normalizedPhone) && normalizedPhone.startsWith("91")) {
            normalizedPhone = `+${normalizedPhone}`;
        } else if (normalizedPhone.startsWith("0")) {
            normalizedPhone = `+91${normalizedPhone.slice(1)}`;
        }

        // Synthesize name and address from granular frontend fields
        const synthesizedName = `${firstName || ""} ${lastName || ""}`.trim() || data.name || "Customer";
        const synthesizedAddress = `${flat || ""}, ${area || ""}`.trim() || data.addressLine1 || "Address";

        // 1. Upsert Customer
        const customer = await SalesCustomer.findOneAndUpdate(
            { phone: normalizedPhone },
            { 
                $setOnInsert: { 
                    name: synthesizedName, 
                    email, 
                    address: synthesizedAddress,
                    source: "manual",
                    createdBy: actorId,
                    createdAt: new Date()
                } 
            },
            { upsert: true, new: true }
        );

        // 1.5 Ensure a User record exists for this customer (Consolidation)
        let user = await User.findOne({ phone: normalizedPhone });
        if (!user && email) {
            user = await User.findOne({ email: email.toLowerCase() });
        }

        if (!user) {
            user = await User.create({
                name: synthesizedName,
                phone: normalizedPhone,
                email: email || undefined,
                role: "user",
                authProvider: ["local"],
                isActive: true
            });
        }

        // 2. Calculate Pricing
        const subtotal = items.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);

        // 3. Create Order via base service
        const pendingOrder = await baseOrderService.createPendingOrder(user._id, {
            items,
            shippingAddress: {
                firstName: firstName || synthesizedName.split(' ')[0] || "Customer",
                lastName: lastName || synthesizedName.split(' ').slice(1).join(' ') || ".",
                phone: normalizedPhone,
                addressLine1: synthesizedAddress,
                landmark,
                city,
                state,
                postalCode: pincode,
                country: "India"
            },
            pricing: {
                subtotal,
                discountAmount: 0,
                finalAmount: subtotal
            },
            source: "admin"
        });

        // 3. Setup payment and confirm order immediately for manual processing
        const isOnline = data.paymentMethod === "online";
        const providerMap = {
            online: "payu",
            cod: "cod"
        };
        
        // Refresh order from DB to ensure we have latest
        const order = await Order.findById(pendingOrder._id);
        
        // Ensure all granular address fields are set for future displays
        order.shippingAddress = {
            ...order.shippingAddress.toObject(),
            firstName: firstName || order.shippingAddress.firstName,
            lastName: lastName || order.shippingAddress.lastName,
            flat,
            area,
            landmark,
            city,
            state,
            postalCode: pincode
        };

        order.payment.paymentProvider = providerMap[data.paymentMethod] || "COD";
        order.payment.paymentStatus = isOnline ? "SUCCESS" : "PENDING";
        
        // We mark manual orders as PAID initially so they can pass confirmOrder validation
        order.orderStatus = "PAID";
        await order.save();

        // Trigger full confirmation workflow (stock reduction, notifications)
        try {
            await baseOrderService.confirmOrder(order._id);
        } catch (confirmError) {
            console.warn(`[Manual Order] Order ${order.orderNumber} failed confirmation constraints (likely stock):`, confirmError.message);
            // We do not throw. The order is persisted (marked FAILED by base service) 
            // and can be reviewed manually without blocking the creation of the record.
        }

        // 4. Activity Log
        await SalesActivityLog.create({
            actor: actorId,
            action: "MANUAL_ORDER_CREATED",
            entityType: "Order",
            entityId: order._id,
            metadata: { customerName: synthesizedName }
        });

        // Automated task creation removed as per requirement.
        return order;
    } catch (error) {
        console.error("[Manual Order Service Error]", error);
        throw error;
    }
};

export const getOrderByNumber = async (orderNumber) => {
    const order = await baseOrderService.getOrderByNumber(orderNumber);

    // Attach any existing returns for this order so the manual-return UI can
    // tell whether items have already been returned / refunded / are in progress.
    const returns = await Return.find({ orderId: order._id })
        .select("status items comment createdAt approvedAt rejectedAt pickedUpAt")
        .sort({ createdAt: -1 })
        .lean();

    const orderObj = order.toObject({ virtuals: true });
    orderObj.returns = returns;
    return orderObj;
};
