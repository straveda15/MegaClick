import mongoose from "mongoose";

const inventoryMovementSchema = new mongoose.Schema(
  {
    orderId:       { type: mongoose.Schema.Types.ObjectId, ref: "Order",   required: true, index: true },
    orderNumber:   { type: String, required: true },
    productId:     { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    productName:   { type: String, required: true },
    movementType:  { type: String, enum: ["RESERVE", "RELEASE"], required: true },
    quantity:      { type: Number, required: true, min: 0 },
    reason:        { type: String, enum: ["order_edit", "order_cancel", "order_return"], required: true },
    performedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const InventoryMovement = mongoose.model("InventoryMovement", inventoryMovementSchema);
export default InventoryMovement;
