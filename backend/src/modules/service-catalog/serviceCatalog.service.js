import serviceCategories from "./servicesData.js";

const normalizeService = (service, category) => ({
  title: service.title,
  slug: service.slug,
  emoji: service.emoji,
  category: category.title,
  categorySlug: category.slug,
});

export const listCategories = () => serviceCategories;

export const listServices = () =>
  serviceCategories.flatMap((category) =>
    category.services.map((service) => normalizeService(service, category))
  );
