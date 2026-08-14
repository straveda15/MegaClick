import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    reason: {
        type: String,
    },
});

const returnSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: {
            type: [returnItemSchema],
            required: true,
            validate: [v => v.length > 0, "Return must have at least one item."],
        },
        comment: {
            type: String,
        },
        adminComment: {
            type: String,
        },
        status: {
            type: String,
            enum: ["REQUESTED", "APPROVED", "REJECTED", "PICKED_UP", "REFUNDED"],
            default: "REQUESTED",
        },
        requestedAt: {
            type: Date,
            default: Date.now,
        },
        approvedAt: {
            type: Date,
        },
        rejectedAt: {
            type: Date,
        },
        // Date the customer asked for when submitting the return. The admin
        // reviews this and confirms the final pickupDate on approval.
        requestedPickupDate: {
            type: Date,
        },
        pickupDate: {
            type: Date,
        },
        pickupInstructions: {
            type: String,
        },
        pickedUpAt: {
            type: Date,
        },
        shipmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shipment",
        },
        trackingId: {
            type: String,
        },
        awbNumber: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Return = mongoose.model("Return", returnSchema);

export default Return;