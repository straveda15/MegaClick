import RawMaterial from "./raw-material.model.js";

export const createRawMaterial = async (data) => {
  const material = new RawMaterial(data);
  await material.save();
  return material;
};

export const getAllRawMaterials = async (filters = {}) => {
  return await RawMaterial.find(filters).populate("vendorId", "name phone email").sort({ createdAt: -1 });
};

export const getRawMaterialById = async (id) => {
  const material = await RawMaterial.findById(id).populate("vendorId", "name phone email");
  if (!material) throw new Error("Raw Material not found");
  return material;
};

export const updateRawMaterial = async (id, data) => {
  const material = await RawMaterial.findById(id);
  if (!material) throw new Error("Raw Material not found");

  Object.assign(material, data);
  await material.save();
  return material;
};

export const deleteRawMaterial = async (id) => {
  const result = await RawMaterial.findByIdAndDelete(id);
  if (!result) throw new Error("Raw Material not found");
  return true;
};

export const receiveStock = async (id, quantity) => {
    const material = await RawMaterial.findById(id);
    if (!material) throw new Error("Raw Material not found");

    material.stock += quantity;
    material.lastReceived = new Date();
    await material.save();

    return material;
};

export const consumeStock = async (id, quantity) => {
    const material = await RawMaterial.findById(id);
    if (!material) throw new Error("Raw Material not found");

    if (material.stock < quantity) {
        throw new Error(`Insufficient stock. Available: ${material.stock}`);
    }

    material.stock -= quantity;
    await material.save();

    if (material.status === "low_stock" || material.status === "out_of_stock") {
        try {
            const { createNotification } = await import("../notifications/ops-notification.service.js");
            await createNotification({
                title: `Low Raw Material Stock`,
                message: `${material.name} is ${material.status} (Stock: ${material.stock})`,
                type: "low_inventory",
                entityId: material._id,
                roleTarget: "warehouse",
            });
        } catch (err) {
            console.error("Failed to trigger raw material low stock notification:", err.message);
        }
    }

    return material;
};
