import ProductCost from "./productCost.model.js";
import Product from "../product/product.model.js";

// GET /v1/product-costs
// Returns all cost configs, each populated with product name/price
export const listProductCosts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: { $ne: false } })
      .select("_id name price orig slug")
      .lean();

    const costs = await ProductCost.find().lean();
    const costMap = Object.fromEntries(costs.map((c) => [c.productId.toString(), c]));

    const result = products.map((p) => {
      const cost = costMap[p._id.toString()] || null;
      const computedTotal = cost ? calcTotal(cost) : 0;
      return {
        product: p,
        cost,
        computedTotal,
        effectiveCost: cost?.finalCost ?? computedTotal,
      };
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// GET /v1/product-costs/:productId
export const getProductCost = async (req, res, next) => {
  try {
    const cost = await ProductCost.findOne({ productId: req.params.productId }).lean();
    const product = await Product.findById(req.params.productId).select("_id name price orig slug").lean();
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const computedTotal = cost ? calcTotal(cost) : 0;
    res.json({
      success: true,
      data: {
        product,
        cost: cost || null,
        computedTotal,
        effectiveCost: cost?.finalCost ?? computedTotal,
      },
    });
  } catch (err) {
    next(err);
  }
};

// PUT /v1/product-costs/:productId  (upsert)
export const upsertProductCost = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).lean();
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const allowed = [
      "powderCostPerGram", "powderGrams",
      "packagingCost", "sideLabelCost", "upperLabelCost", "spoonCost",
      "shippingCharges", "jarCost", "plasticSleevesCost", "courierBagCost",
      "tapeCost", "bubbleSheetCost", "extraCosts", "finalCost",
    ];

    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }

    const cost = await ProductCost.findOneAndUpdate(
      { productId },
      { $set: update },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    const computedTotal = calcTotal(cost);
    res.json({
      success: true,
      data: {
        product,
        cost,
        computedTotal,
        effectiveCost: cost.finalCost ?? computedTotal,
      },
    });
  } catch (err) {
    next(err);
  }
};

function calcTotal(cost) {
  const powder = (cost.powderCostPerGram || 0) * (cost.powderGrams || 0);
  const fixed  =
    (cost.packagingCost      || 0) +
    (cost.sideLabelCost      || 0) +
    (cost.upperLabelCost     || 0) +
    (cost.spoonCost          || 0) +
    (cost.shippingCharges    || 0) +
    (cost.jarCost            || 0) +
    (cost.plasticSleevesCost || 0) +
    (cost.courierBagCost     || 0) +
    (cost.tapeCost           || 0) +
    (cost.bubbleSheetCost    || 0);
  const extras = (cost.extraCosts || []).reduce((s, e) => s + (e.amount || 0), 0);
  return parseFloat((powder + fixed + extras).toFixed(2));
}
