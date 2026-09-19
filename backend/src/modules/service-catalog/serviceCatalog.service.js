import serviceCategories from "./servicesData.js";
import CustomService from "./customService.model.js";
import CatalogOverride from "./catalogOverride.model.js";
import ServiceStepTemplate from "../service-steps/serviceStepTemplate.model.js";
import AppError from "../../shared/utils/appError.js";

const MAX_TITLE_LENGTH = 100;

const builtInCategoryBySlug = new Map(serviceCategories.map((category) => [category.slug, category]));

/**
 * The dashboard's catalog, flattened: the built-in services from
 * `servicesData.js` with any dashboard edits applied (renamed, moved, hidden),
 * followed by the services added from the dashboard.
 *
 * `servicesData.js` is shared with the public website and is never modified —
 * every edit lives in the database and is layered on here, which is what keeps
 * dashboard changes out of the website.
 */
const buildEntries = async () => {
  const [custom, overrides] = await Promise.all([
    CustomService.find().sort({ createdAt: 1 }).lean(),
    CatalogOverride.find().lean(),
  ]);
  const overrideBySlug = new Map(overrides.map((override) => [override.slug, override]));

  const entries = [];

  for (const category of serviceCategories) {
    for (const service of category.services) {
      const override = overrideBySlug.get(service.slug);
      if (override?.deleted) continue;

      entries.push({
        title: override?.title || service.title,
        slug: service.slug,
        emoji: service.emoji,
        // A stored category that no longer exists falls back to the original.
        categorySlug: builtInCategoryBySlug.has(override?.categorySlug)
          ? override.categorySlug
          : category.slug,
        builtIn: true,
      });
    }
  }

  for (const service of custom) {
    entries.push({
      title: service.title,
      slug: service.slug,
      categorySlug: service.categorySlug,
      builtIn: false,
    });
  }

  return entries;
};

const toCatalogService = (entry) => ({
  title: entry.title,
  slug: entry.slug,
  emoji: entry.emoji,
  category: builtInCategoryBySlug.get(entry.categorySlug)?.title,
  categorySlug: entry.categorySlug,
});

/** Fresh category objects — `servicesData.js` is shared module state and must not be mutated. */
export const listCategories = async () => {
  const entries = await buildEntries();

  return serviceCategories.map((category) => ({
    ...category,
    services: entries
      .filter((entry) => entry.categorySlug === category.slug)
      .map(({ title, slug, emoji }) => ({ title, slug, emoji })),
  }));
};

export const listServices = async () => (await buildEntries()).map(toCatalogService);

/* ── Validation helpers ─────────────────────────────────────────────────── */

/** "Trade Mark Renewal & Filing" → "trade-mark-renewal-and-filing". */
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Case- and spacing-insensitive, so "GST  registration" collides with "GST Registration". */
const comparable = (value) => String(value).toLowerCase().replace(/\s+/g, " ").trim();

/** The cleaned title and the category it belongs to, or a 400 saying what is wrong. */
const validateInput = ({ title, categorySlug }) => {
  const cleanTitle = String(title ?? "").replace(/\s+/g, " ").trim();
  if (!cleanTitle) throw new AppError("A service name is required.", 400);
  if (cleanTitle.length > MAX_TITLE_LENGTH) {
    throw new AppError(`A service name can be at most ${MAX_TITLE_LENGTH} characters.`, 400);
  }

  const category = builtInCategoryBySlug.get(String(categorySlug ?? "").trim());
  if (!category) throw new AppError("Pick a category for this service.", 400);

  return { cleanTitle, category };
};

/**
 * Titles are unique across the whole catalog — two entries that read the same
 * in a dropdown would be indistinguishable to whoever is picking. `exceptSlug`
 * lets a service keep its own name while being edited.
 */
const assertTitleFree = (entries, cleanTitle, exceptSlug) => {
  const duplicate = entries.find(
    (entry) => entry.slug !== exceptSlug && comparable(entry.title) === comparable(cleanTitle)
  );
  if (duplicate) throw new AppError(`"${duplicate.title}" is already in the catalog.`, 409);
};

const findEntry = (entries, slug) => {
  const entry = entries.find((candidate) => candidate.slug === String(slug ?? "").trim());
  if (!entry) throw new AppError("That service is not in the catalog.", 404);
  return entry;
};

/* ── Writes ─────────────────────────────────────────────────────────────── */

export const createService = async ({ title, categorySlug }, actorId) => {
  const { cleanTitle, category } = validateInput({ title, categorySlug });

  const entries = await buildEntries();
  assertTitleFree(entries, cleanTitle);

  // The slug is what everything else keys on, so it must not collide with an
  // existing one even when the titles differ ("Tax & Audit" vs "Tax and Audit").
  // Built-in slugs stay reserved even after that service is deleted, so a new
  // service never inherits a deleted one's steps, fees or history.
  const takenSlugs = new Set([
    ...entries.map((entry) => entry.slug),
    ...serviceCategories.flatMap((entry) => entry.services.map((service) => service.slug)),
  ]);
  const base = slugify(cleanTitle) || `service-${Date.now().toString(36)}`;
  let slug = base;
  for (let suffix = 2; takenSlugs.has(slug); suffix += 1) slug = `${base}-${suffix}`;

  try {
    await CustomService.create({
      title: cleanTitle,
      slug,
      categorySlug: category.slug,
      createdBy: actorId,
    });

    return toCatalogService({ title: cleanTitle, slug, categorySlug: category.slug });
  } catch (error) {
    // Two admins adding the same service at the same moment: the unique index wins.
    if (error?.code === 11000) {
      throw new AppError("That service was just added by someone else.", 409);
    }
    throw error;
  }
};

/**
 * Renames a service and/or moves it to another category. The slug never
 * changes, so leads, tasks, step templates and fees that already point at the
 * service keep working. Leads keep the name they were captured with — it is a
 * record of what was agreed at the time.
 */
export const updateService = async (slug, { title, categorySlug }, actorId) => {
  const entries = await buildEntries();
  const target = findEntry(entries, slug);

  const { cleanTitle, category } = validateInput({ title, categorySlug });
  assertTitleFree(entries, cleanTitle, target.slug);

  if (target.builtIn) {
    await CatalogOverride.findOneAndUpdate(
      { slug: target.slug },
      { $set: { title: cleanTitle, categorySlug: category.slug, deleted: false, updatedBy: actorId } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  } else {
    await CustomService.updateOne(
      { slug: target.slug },
      { $set: { title: cleanTitle, categorySlug: category.slug } }
    );
  }

  // The step template carries its own copy of the name and category for display.
  await ServiceStepTemplate.updateOne(
    { serviceSlug: target.slug },
    { $set: { serviceTitle: cleanTitle, serviceCategory: category.title, categorySlug: category.slug } }
  );

  return toCatalogService({ ...target, title: cleanTitle, categorySlug: category.slug });
};

/**
 * Removes a service from the dashboard's catalog, so it is no longer offered
 * when adding a lead or client. Leads and clients that already have it keep it,
 * and its step template and fees are left in place so work already in flight
 * can still be assigned.
 */
export const deleteService = async (slug, actorId) => {
  const entries = await buildEntries();
  const target = findEntry(entries, slug);

  if (target.builtIn) {
    await CatalogOverride.findOneAndUpdate(
      { slug: target.slug },
      { $set: { deleted: true, updatedBy: actorId } },
      { upsert: true, setDefaultsOnInsert: true }
    );
  } else {
    await CustomService.deleteOne({ slug: target.slug });
  }

  return { slug: target.slug, title: target.title };
};
