import * as serviceCatalogService from "./serviceCatalog.service.js";

export const getCatalog = (_req, res) => {
  const categories = serviceCatalogService.listCategories();
  const services = serviceCatalogService.listServices();

  res.json({
    success: true,
    message: "Service catalog fetched",
    data: {
      categories,
      services,
      total: services.length,
    },
  });
};
