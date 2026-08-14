import VendorOrder from "./vendorOrder.model.js";
import Vendor from "../vendors/vendor.model.js";
import ProductCost from "../../productCost/productCost.model.js";
import Product from "../../product/product.model.js";
import Transaction from "../transactions/transaction.model.js";
import mongoose from "mongoose";

const getVendorAvailableBalance = (vendor) => {
  const currentBalance = Number(vendor.currentBalance || 0);
  const openingBalance = Number(vendor.openingBalance || 0);
  const initialInvestment = Number(vendor.initialInvestment || 0);

  if (currentBalance === 0 && openingBalance === 0 && initialInvestment > 0) {
    return initialInvestment;
  }

  return currentBalance;
};

export const createVendorOrder = async (data, createdBy) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { vendorId, itemsOrdered } = data;

    const vendor = await Vendor.findById(vendorId).session(session);
    if (!vendor) throw new Error("Vendor not found");

    let totalCost = 0;
    const itemsToSave = [];

    // Map component UI names to Vendor model field names
    const componentToField = {
      'powder': 'powderCostPerGram',
      'spoon': 'spoonCost',
      'jar': 'jarCost',
      'packaging': 'packagingCost',
      'sideLabel': 'sideLabelCost',
      'upperLabel': 'upperLabelCost',
      'shipping': 'shippingCharges',
      'plasticSleeves': 'plasticSleevesCost',
      'courierBag': 'courierBagCost',
      'tape': 'tapeCost',
      'bubbleSheet': 'bubbleSheetCost'
    };

    // Each priced component also carries the unit + basis quantity it was priced in.
    const componentToUnitField = {
      'powder': 'powderUnit',
      'spoon': 'spoonUnit',
      'jar': 'jarUnit',
      'packaging': 'packagingUnit',
      'sideLabel': 'sideLabelUnit',
      'upperLabel': 'upperLabelUnit',
      'shipping': 'shippingUnit',
      'plasticSleeves': 'plasticSleevesUnit',
      'courierBag': 'courierBagUnit',
      'tape': 'tapeUnit',
      'bubbleSheet': 'bubbleSheetUnit'
    };
    const componentToGramsField = {
      'powder': 'powderGrams',
      'spoon': 'spoonGrams',
      'jar': 'jarGrams',
      'packaging': 'packagingGrams',
      'sideLabel': 'sideLabelGrams',
      'upperLabel': 'upperLabelGrams',
      'shipping': 'shippingGrams',
      'plasticSleeves': 'plasticSleevesGrams',
      'courierBag': 'courierBagGrams',
      'tape': 'tapeGrams',
      'bubbleSheet': 'bubbleSheetGrams'
    };

    for (const item of itemsOrdered) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw new Error(`Product not found: ${item.productId}`);

      // Find the specific cost config for this product in the vendor's list
      const vendorProductCost = vendor.productCosts.find(pc => pc.productId.toString() === item.productId.toString());

      const isExtra = typeof item.component === 'string' && item.component.startsWith('extra_');

      // Resolve the raw vendor price, the unit, and the basis quantity it was priced for.
      let rawPrice = 0;
      let vendorUnit = 'units';
      let basisQty = 0;
      if (isExtra) {
        const extraLabel = item.component.replace('extra_', '');
        const extraData = vendorProductCost?.extraCosts?.find(e => e.label === extraLabel);
        rawPrice = extraData?.amount || 0;
        vendorUnit = extraData?.unit || 'g';
        basisQty = extraData?.grams || 0;
      } else {
        const fieldName = componentToField[item.component] || item.component;
        // @ts-ignore
        rawPrice = vendorProductCost ? (vendorProductCost[fieldName] || 0) : 0;
        const unitField = componentToUnitField[item.component];
        if (unitField) vendorUnit = vendorProductCost?.[unitField] || 'units';
        const gramsField = componentToGramsField[item.component];
        if (gramsField) basisQty = vendorProductCost?.[gramsField] || 0;
      }

      // For weight/volume components the stored price is the TOTAL paid for `basisQty`
      // of that unit (e.g. ₹7000 for 500 g), so the per-gram rate = price / basisGrams.
      // item.quantity is normalised to grams, so totals line up. Unit/flat components
      // keep the raw per-unit price.
      const isWeight = vendorUnit === 'g' || vendorUnit === 'kg' || vendorUnit === 'ltr';
      const basisGrams = vendorUnit === 'kg' ? basisQty * 1000 : basisQty;
      const pricePerUnit = (isWeight && basisGrams > 0) ? rawPrice / basisGrams : rawPrice;

      const totalItemCost = pricePerUnit * item.quantity;
      totalCost += totalItemCost;

      const unit = item.unit || (item.component === 'powder' ? 'g' : 'units');
      // displayQuantity = value in the chosen unit; fall back to deriving it
      // from the normalised grams quantity when the client didn't send it.
      const displayQuantity =
        item.displayQuantity !== undefined && item.displayQuantity !== null
          ? Number(item.displayQuantity)
          : unit === 'kg'
            ? item.quantity / 1000
            : item.quantity;

      itemsToSave.push({
        product: product._id,
        productName: product.name,
        component: item.component,
        quantity: item.quantity,
        displayQuantity,
        unit,
        pricePerUnit: pricePerUnit,
        totalItemCost: totalItemCost,
      });
    }

    const availableBalance = getVendorAvailableBalance(vendor);
    if (totalCost > availableBalance) {
      const error = new Error(
        `Insufficient vendor balance. Available balance is ₹${availableBalance.toLocaleString("en-IN")} and order total is ₹${totalCost.toLocaleString("en-IN")}.`
      );
      error.statusCode = 400;
      throw error;
    }

    if (vendor.currentBalance === 0 && vendor.openingBalance === 0 && vendor.initialInvestment > 0) {
      vendor.openingBalance = vendor.initialInvestment;
      vendor.currentBalance = vendor.initialInvestment;
    }

    vendor.currentBalance -= totalCost;
    await vendor.save({ session });

    const vendorOrder = new VendorOrder({
      vendorId: vendor._id,
      itemsOrdered: itemsToSave,
      totalCost,
      remainingBalanceAfterOrder: vendor.currentBalance,
    });

    await vendorOrder.save({ session });

    // Create a transaction record for the ledger
    const transaction = new Transaction({
      vendorId: vendor._id,
      type: "debit",
      amount: totalCost,
      referenceType: "invoice",
      referenceId: vendorOrder._id,
      note: `Order placed for: ${itemsToSave.map(i => i.productName).join(", ")}`,
      createdBy,
    });
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return vendorOrder;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getAllVendorOrders = async (filters = {}) => {
  return await VendorOrder.find(filters)
    .populate("vendorId", "name phone category")
    .populate("itemsOrdered.product", "name slug")
    .sort({ createdAt: -1 });
};

export const receiveVendorOrder = async (orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await VendorOrder.findById(orderId).session(session);
    if (!order) throw new Error("Order not found");
    if (order.status === "received") throw new Error("Order already received");

    const vendor = await Vendor.findById(order.vendorId).session(session);
    if (!vendor) throw new Error("Vendor not found");

    const fieldMap = {
      powder: "powderStock",
      jar: "jarStock",
      spoon: "spoonStock",
      packaging: "packagingStock",
      sideLabel: "sideLabelStock",
      upperLabel: "upperLabelStock",
      plasticSleeves: "plasticSleevesStock",
      courierBag: "courierBagStock",
      tape: "tapeStock",
      bubbleSheet: "bubbleSheetStock",
    };

    for (const item of order.itemsOrdered) {
      const pc = vendor.productCosts.find(
        (p) => p.productId.toString() === item.product.toString()
      );
      if (pc) {
        // Basic mapping for simple components
        const stockField = fieldMap[item.component];
        
        // `quantity` is already stored normalised (grams for g/kg orders),
        // so it is added to stock as-is — no further unit conversion here.
        const quantityToAdd = item.quantity;

        if (stockField) {
          pc[stockField] = (pc[stockField] || 0) + quantityToAdd;
        } else if (item.component.startsWith("extra_")) {
          // Handle extraCosts
          const extraLabel = item.component.replace("extra_", "");
          const extra = pc.extraCosts.find((e) => e.label === extraLabel);
          if (extra) {
            extra.stock = (extra.stock || 0) + quantityToAdd;
          }
        }
      }
    }

    order.status = "received";
    await vendor.save({ session });
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    return order;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
