import * as serviceCatalogService from "./serviceCatalog.service.js";

export const getCatalog = async (_req, res, next) => {
  try {
    const categories = await serviceCatalogService.listCategories();
    const services = await serviceCatalogService.listServices();

    res.json({
      success: true,
      message: "Service catalog fetched",
      data: {
        categories,
        services,
        total: services.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const service = await serviceCatalogService.createService(
      { title: req.body?.title, categorySlug: req.body?.categorySlug },
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Service added to the catalog",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const service = await serviceCatalogService.updateService(
      req.params.slug,
      { title: req.body?.title, categorySlug: req.body?.categorySlug },
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Service updated",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const result = await serviceCatalogService.deleteService(req.params.slug, req.user._id);

    res.status(200).json({
      success: true,
      message: "Service removed from the catalog",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
