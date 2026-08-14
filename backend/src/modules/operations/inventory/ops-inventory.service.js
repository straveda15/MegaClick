import OpsInventory from "./ops-inventory.model.js";
import Product from "../../product/product.model.js";
import Vendor from "../vendors/vendor.model.js";

const DEFAULT_WAREHOUSE = "Main Warehouse";
const DEFAULT_REORDER_LEVEL = 10;

const normalizeQuantity = (value, fallback = 0) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return fallback;
  }

  return Math.floor(numericValue);
};

const buildSku = (product = {}) => {
  const baseValue =
    product.slug ||
    product.name ||
    (product.id ? `product-${product.id}` : "") ||
    (product._id ? `product-${String(product._id).slice(-6)}` : "product");

  const normalized = String(baseValue)
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "PRODUCT";
};

const buildInventoryQuery = (filters = {}) => {
  const query = {};

  if (filters.productId) query.productId = filters.productId;
  if (filters.status) query.status = filters.status;
  if (filters.warehouse) query.warehouse = filters.warehouse;

  return query;
};

const buildProductQuery = (filters = {}) => {
  const query = {};

  if (filters.productId) query._id = filters.productId;

  return query;
};

const mapInventoryRecord = (inventoryDoc) => {
  const inventory =
    typeof inventoryDoc?.toObject === "function"
      ? inventoryDoc.toObject()
      : inventoryDoc;

  const product =
    inventory?.productId && typeof inventory.productId === "object"
      ? inventory.productId
      : null;

  const productId = product?._id ?? inventory.productId;
  const available = normalizeQuantity(inventory.available);
  const reserved = normalizeQuantity(inventory.reserved);
  const reorderLevel = normalizeQuantity(
    inventory.reorderLevel,
    DEFAULT_REORDER_LEVEL
  );

  return {
    _id: String(inventory._id),
    productId: productId?.toString?.() || String(productId || ""),
    productName: product?.name || "Unknown Product",
    slug: product?.slug || "",
    sku: inventory.sku || buildSku(product || { _id: productId }),
    available,
    reserved,
    total: available + reserved,
    reorderLevel,
    warehouse: inventory.warehouse || DEFAULT_WAREHOUSE,
    status:
      inventory.status ||
      (available <= 0
        ? "out_of_stock"
        : available <= reorderLevel
          ? "low_stock"
          : "available"),
    lastUpdated: inventory.lastUpdated || inventory.updatedAt || inventory.createdAt,
    productStock: normalizeQuantity(product?.stock, available),
    isActive: product?.isActive !== false,
  };
};

export const syncProductStockFromInventory = async (productId, available, inventoryStatus) => {
  const normalizedAvailable = normalizeQuantity(available);
  const product = await Product.findById(productId).select("stock stockStatus");

  if (product) {
    let changed = false;
    if (product.stock !== normalizedAvailable) {
      product.stock = normalizedAvailable;
      changed = true;
    }
    // Treat "available" inventory as purchasable; low_stock and out_of_stock → unavailable on website
    const newStockStatus = inventoryStatus === "available" ? "available" : "out_of_stock";
    if (product.stockStatus !== newStockStatus) {
      product.stockStatus = newStockStatus;
      changed = true;
    }
    if (changed) await product.save();
  }

  return product;
};

export const ensureInventoryRecordForProduct = async (
  product,
  { syncAvailable = false } = {}
) => {
  if (!product?._id) {
    throw new Error("Product is required to sync inventory");
  }

  // Product.sku (entered in Product Master) is the source of truth; buildSku()
  // is only a fallback for legacy products that were created before SKU existed.
  const resolvedSku = product.sku ? String(product.sku).trim() : buildSku(product);

  const normalizedStock = normalizeQuantity(product.stock);
  let inventory = await OpsInventory.findOne({ productId: product._id });
  let changed = false;

  if (!inventory) {
    inventory = new OpsInventory({
      productId: product._id,
      sku: resolvedSku,
      warehouse: DEFAULT_WAREHOUSE,
      available: normalizedStock,
      reserved: 0,
      reorderLevel: DEFAULT_REORDER_LEVEL,
    });
    changed = true;
  } else {
    if (inventory.sku !== resolvedSku) {
      inventory.sku = resolvedSku;
      changed = true;
    }

    if (!inventory.warehouse) {
      inventory.warehouse = DEFAULT_WAREHOUSE;
      changed = true;
    }

    if (syncAvailable && inventory.available !== normalizedStock) {
      inventory.available = normalizedStock;
      changed = true;
    }
  }

  if (changed) {
    await inventory.save();
  }

  // Always sync stock and stock status from inventory record back to the Product document
  await syncProductStockFromInventory(product._id, inventory.available, inventory.status);

  return inventory;
};

export const syncAllInventoryRecords = async (filters = {}) => {
  const products = await Product.find(buildProductQuery(filters))
    .select("_id id name slug sku stock isActive")
    .lean();

  for (const product of products) {
    await ensureInventoryRecordForProduct(product);
  }

  return products.length;
};

export const createInventoryRecord = async (data) => {
  const product = await Product.findById(data.productId).select(
    "_id id name slug sku stock isActive"
  );

  if (!product) {
    throw new Error("Product not found");
  }

  const existingInventory = await OpsInventory.findOne({ productId: data.productId });
  if (existingInventory) {
    throw new Error("Inventory record already exists for this product");
  }

  const inventory = new OpsInventory({
    productId: data.productId,
    sku: data.sku || product.sku || buildSku(product),
    variant: data.variant ?? null,
    warehouse: data.warehouse || DEFAULT_WAREHOUSE,
    available: normalizeQuantity(data.available, normalizeQuantity(product.stock)),
    reserved: normalizeQuantity(data.reserved),
    reorderLevel: normalizeQuantity(data.reorderLevel, DEFAULT_REORDER_LEVEL),
  });

  await inventory.save();
  await syncProductStockFromInventory(product._id, inventory.available, inventory.status);

  await inventory.populate("productId", "name slug stock isActive");
  return mapInventoryRecord(inventory);
};

export const getAllInventory = async (filters = {}) => {
  await syncAllInventoryRecords(filters);

  const inventoryRecords = await OpsInventory.find(buildInventoryQuery(filters))
    .populate("productId", "name slug stock isActive")
    .sort({ lastUpdated: -1 });

  return inventoryRecords.map(mapInventoryRecord);
};

export const updateInventoryDetails = async (id, data) => {
  const inventory = await OpsInventory.findById(id).populate(
    "productId",
    "name slug stock isActive"
  );

  if (!inventory) {
    throw new Error("Inventory record not found");
  }

  Object.assign(inventory, data);

  if (!inventory.sku && inventory.productId) {
    inventory.sku = buildSku(inventory.productId);
  }

  if (!inventory.warehouse) {
    inventory.warehouse = DEFAULT_WAREHOUSE;
  }

  await inventory.save();

  if (inventory.productId?._id) {
    await syncProductStockFromInventory(inventory.productId._id, inventory.available, inventory.status);
  }

  return mapInventoryRecord(inventory);
};

export const adjustStock = async ({ productId, quantity, type = "available" }, session = null) => {
  const product = await Product.findById(productId).select(
    "_id id name slug stock isActive"
  );

  if (!product) {
    throw new Error("Product not found");
  }

  const delta = Number(quantity);
  if (!Number.isFinite(delta)) {
    throw new Error("Quantity must be a valid number");
  }

  const inventory = await ensureInventoryRecordForProduct(product);

  if (type === "available") {
    const nextAvailable = inventory.available + delta;
    if (nextAvailable < 0) {
      throw new Error(
        `Insufficient available stock for ${product.name}. Available: ${inventory.available}`
      );
    }
    inventory.available = nextAvailable;
  } else if (type === "reserved") {
    const nextReserved = inventory.reserved + delta;
    if (nextReserved < 0) {
      throw new Error(
        `Insufficient reserved stock for ${product.name}. Reserved: ${inventory.reserved}`
      );
    }
    inventory.reserved = nextReserved;
  }

  await inventory.save(session ? { session } : undefined);
  await syncProductStockFromInventory(productId, inventory.available, inventory.status);

  if (inventory.status === "low_stock" || inventory.status === "out_of_stock") {
    try {
      const { createNotification } = await import(
        "../notifications/ops-notification.service.js"
      );

      await createNotification({
        title: "Low Finished Goods Stock",
        message: `${product.name} is ${inventory.status} (Available: ${inventory.available})`,
        type: "low_inventory",
        entityId: inventory._id,
        roleTarget: "warehouse",
      });
    } catch (err) {
      console.error("Failed to trigger low stock notification:", err.message);
    }
  }

  await inventory.populate("productId", "name slug stock isActive");
  return mapInventoryRecord(inventory);
};

export const deleteInventoryRecord = async (id) => {
  const result = await OpsInventory.findByIdAndDelete(id);
  if (!result) throw new Error("Inventory record not found");
  return true;
};

export const deleteInventoryRecordByProductId = async (productId) => {
  await OpsInventory.findOneAndDelete({ productId });
  return true;
};

// ─── Floor / Ops Staff ───────────────────────────────────────────────────────

const toStockStatus = (modelStatus) => {
  if (modelStatus === 'low_stock') return 'low';
  if (modelStatus === 'out_of_stock') return 'out_of_stock';
  return 'healthy';
};

/**
 * Returns inventory records for the Floor → Stock sub-tab.
 * Queries OpsInventory directly (no full product sync) for performance.
 * filter: 'all' | 'low_stock' | 'out_of_stock'
 * search: string matched against productName or sku (case-insensitive, post-populate)
 */
export const queryFloorStock = async ({ filter, search } = {}) => {
  const dbQuery = {};
  if (filter === 'low_stock') dbQuery.status = 'low_stock';
  else if (filter === 'out_of_stock') dbQuery.status = 'out_of_stock';

  const records = await OpsInventory.find(dbQuery)
    .populate('productId', 'name slug stock isActive recipe')
    .sort({ updatedAt: -1 })
    .lean();
  // Fetch all vendors to get product-specific stock breakdowns
  const vendors = await Vendor.find({ status: 'active' }).lean();

  let items = records.map((inv) => {
    const mapped = mapInventoryRecord(inv);
    
    // Read from the Product's Recipe (BOM) to list only vendors assigned to these materials.
    const vendorStocks = [];
    const recipe = inv.productId?.recipe;
    
    if (recipe) {
      const components = [
        { needed: recipe.powderGrams, vendorId: recipe.powderVendorId, label: 'Powder', stockKey: 'powderStock', unitKey: 'powderUnit', defaultUnit: 'g' },
        { needed: recipe.spoonsNeeded, vendorId: recipe.spoonVendorId, label: 'Spoon', stockKey: 'spoonStock', unitKey: 'spoonUnit', defaultUnit: 'units' },
        { needed: recipe.jarsNeeded, vendorId: recipe.jarVendorId, label: 'Jar', stockKey: 'jarStock', unitKey: 'jarUnit', defaultUnit: 'units' },
        { needed: recipe.sideLabelsNeeded, vendorId: recipe.sideLabelVendorId, label: 'Side Label', stockKey: 'sideLabelStock', unitKey: 'sideLabelUnit', defaultUnit: 'units' },
        { needed: recipe.upperLabelsNeeded, vendorId: recipe.upperLabelVendorId, label: 'Upper Label', stockKey: 'upperLabelStock', unitKey: 'upperLabelUnit', defaultUnit: 'units' },
        { needed: recipe.outerBoxesNeeded, vendorId: recipe.outerBoxVendorId, label: 'Outer Box / Packaging', stockKey: 'packagingStock', unitKey: 'packagingUnit', defaultUnit: 'units' }
      ];

      components.forEach(comp => {
        if (comp.needed > 0 && comp.vendorId) {
          const v = vendors.find(vend => vend._id.toString() === comp.vendorId.toString());
          if (v) {
            const pc = v.productCosts?.find(p => p.productId && p.productId.toString() === mapped.productId);
            vendorStocks.push({
              vendorId: v._id,
              vendorName: v.name,
              quantity: pc ? (pc[comp.stockKey] || 0) : 0,
              unit: pc ? (pc[comp.unitKey] || comp.defaultUnit) : comp.defaultUnit,
              component: comp.label
            });
          }
        }
      });
    }

    return {
      _id: mapped._id,
      productId: mapped.productId,
      productName: mapped.productName,
      sku: mapped.sku,
      variant: inv.variant ?? null,
      qty: mapped.available,
      reserved: mapped.reserved,
      reorderAt: mapped.reorderLevel,
      stockStatus: toStockStatus(mapped.status),
      vendorStocks,
    };
  });

  if (search) {
    const term = search.trim().toLowerCase();
    items = items.filter(
      (item) =>
        item.productName.toLowerCase().includes(term) ||
        item.sku.toLowerCase().includes(term)
    );
  }

  const stockStatusSortOrder = { out_of_stock: 0, low: 1, healthy: 2 };
  items.sort(
    (a, b) => (stockStatusSortOrder[a.stockStatus] ?? 2) - (stockStatusSortOrder[b.stockStatus] ?? 2)
  );

  return items;
};

/**
 * Vendor-centric stock view.
 * Returns each active vendor with the list of products (from their productCosts)
 * and the live stock quantity for each recipe component.
 * Used by the "Vendor Wise" tab in the warehouse / ops stock page.
 */
export const getVendorStockView = async () => {
  const vendors = await Vendor.find({ status: 'active' }).lean();
  const Product = (await import('../../product/product.model.js')).default;

  const result = [];

  for (const v of vendors) {
    if (!v.productCosts || v.productCosts.length === 0) continue;

    const products = [];

    for (const pc of v.productCosts) {
      let productName = pc.customName || null;
      let productId = null;

      if (pc.productId) {
        const prod = await Product.findById(pc.productId).select('name').lean();
        if (prod) {
          productName = prod.name;
          productId = String(pc.productId);
        }
      }

      if (!productName) continue;

      // Build list of ALL components that have a non-zero cost (i.e. they are in the recipe)
      const componentDefs = [
        { costKey: 'powderCostPerGram', stockKey: 'powderStock', label: 'Powder',         unit: pc.powderUnit || 'g', componentKey: 'powder' },
        { costKey: 'jarCost',           stockKey: 'jarStock',    label: 'Jar',            unit: pc.jarUnit || 'units', componentKey: 'jar' },
        { costKey: 'spoonCost',         stockKey: 'spoonStock',  label: 'Spoon',          unit: pc.spoonUnit || 'units', componentKey: 'spoon' },
        { costKey: 'packagingCost',     stockKey: 'packagingStock', label: 'Packaging',   unit: pc.packagingUnit || 'units', componentKey: 'packaging' },
        { costKey: 'sideLabelCost',     stockKey: 'sideLabelStock', label: 'Side Label',  unit: pc.sideLabelUnit || 'units', componentKey: 'sideLabel' },
        { costKey: 'upperLabelCost',    stockKey: 'upperLabelStock', label: 'Upper Label',unit: pc.upperLabelUnit || 'units', componentKey: 'upperLabel' },
        { costKey: 'plasticSleevesCost',stockKey: 'plasticSleevesStock', label: 'Plastic Sleeve', unit: pc.plasticSleevesUnit || 'units', componentKey: 'plasticSleeves' },
        { costKey: 'courierBagCost',    stockKey: 'courierBagStock', label: 'Courier Bag',unit: pc.courierBagUnit || 'units', componentKey: 'courierBag' },
        { costKey: 'tapeCost',          stockKey: 'tapeStock',   label: 'Tape',           unit: pc.tapeUnit || 'units', componentKey: 'tape' },
        { costKey: 'bubbleSheetCost',   stockKey: 'bubbleSheetStock', label: 'Bubble Sheet', unit: pc.bubbleSheetUnit || 'units', componentKey: 'bubbleSheet' },
      ];

      const components = componentDefs
        .filter(c => pc[c.costKey] > 0)
        .map(c => ({
          label: c.label,
          unit: c.unit,
          stock: pc[c.stockKey] || 0,
          componentKey: c.componentKey,
        }));

      // Extra costs
      if (pc.extraCosts && pc.extraCosts.length > 0) {
        pc.extraCosts.forEach(extra => {
          if (extra.amount > 0) {
            components.push({
              label: extra.label,
              unit: extra.unit || 'units',
              stock: extra.stock || 0,
              componentKey: `extraCosts.${extra._id}`, // unique key if needed, though addStockManual might need a change to support extraCosts.
            });
          }
        });
      }

      if (components.length === 0) continue;

      products.push({
        productId,
        productName,
        isCustom: !!pc.isCustom,
        components,
      });
    }

    if (products.length === 0) continue;

    result.push({
      vendorId: String(v._id),
      vendorName: v.name,
      category: v.category,
      products,
    });
  }

  return result;
};

// --- Used directly by Order Service and Return Service ---

export const reduceStock = async (items, session = null) => {
  for (const item of items) {
    await adjustStock({
      productId: item.productId,
      quantity: -Number(item.quantity || 0),
      type: "available",
    }, session);
  }

  return true;
};

export const increaseStock = async (productId, quantity) => {
  return await adjustStock({
    productId,
    quantity,
    type: "available",
  });
};

/**
 * Apply a global out-of-stock threshold.
 * Sets each inventory item's reorderLevel to `threshold`.
 * The pre-save hook recomputes status: available <= threshold → "low_stock".
 * Products below threshold get stockStatus = "out_of_stock" on the website.
 */
export const applyGlobalThreshold = async (threshold) => {
  const normalized = normalizeQuantity(threshold);
  const allInventory = await OpsInventory.find({}).populate("productId", "_id name slug stock isActive stockStatus");

  let updated = 0;
  for (const inv of allInventory) {
    inv.reorderLevel = normalized;
    await inv.save(); // pre-save hook recomputes inv.status
    if (inv.productId?._id) {
      await syncProductStockFromInventory(inv.productId._id, inv.available, inv.status);
      updated++;
    }
  }

  return { threshold: normalized, updated };
};
