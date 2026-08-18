import ServiceStepTemplate from "./serviceStepTemplate.model.js";
import AppError from "../../shared/utils/appError.js";
import { listServices } from "../service-catalog/serviceCatalog.service.js";

const MAX_STEPS = 40;

/**
 * Coerces whatever the client sent into a clean, ordered step list. Blank
 * titles are dropped rather than rejected so a half-filled row left behind in
 * the editor doesn't block a save.
 */
const normalizeSteps = (steps) => {
  if (!Array.isArray(steps)) return [];

  const cleaned = steps
    .map((step, index) => ({
      title: String(step?.title ?? "").trim(),
      description: String(step?.description ?? "").trim() || undefined,
      order: Number.isFinite(Number(step?.order)) ? Number(step.order) : index,
    }))
    .filter((step) => step.title);

  if (cleaned.length > MAX_STEPS) {
    throw new AppError(`A service can have at most ${MAX_STEPS} steps.`, 400);
  }

  // Re-index after sorting so `order` is always 0..n-1 with no gaps.
  return cleaned
    .sort((a, b) => a.order - b.order)
    .map((step, index) => ({ ...step, order: index }));
};

/** Every configured template, newest edit first. */
export const listTemplates = async () =>
  await ServiceStepTemplate.find().sort({ serviceTitle: 1 }).lean();

/**
 * The template for one service. Returns null when nothing has been configured
 * yet — the caller decides whether that's an empty editor or "no steps to
 * preload".
 */
export const getTemplate = async (serviceSlug) => {
  const slug = String(serviceSlug ?? "").trim();
  if (!slug) throw new AppError("A service slug is required.", 400);
  return await ServiceStepTemplate.findOne({ serviceSlug: slug }).lean();
};

/**
 * Creates or replaces the checklist for a service. The catalog is the source of
 * truth for the service's identity, so the title/category are resolved from it
 * rather than trusted from the request body.
 */
export const saveTemplate = async (serviceSlug, { steps, serviceTitle }, actorId) => {
  const slug = String(serviceSlug ?? "").trim();
  if (!slug) throw new AppError("A service slug is required.", 400);

  const catalogService = listServices().find((service) => service.slug === slug);
  if (!catalogService && !String(serviceTitle ?? "").trim()) {
    throw new AppError("That service is not in the catalog.", 400);
  }

  const normalized = normalizeSteps(steps);

  return await ServiceStepTemplate.findOneAndUpdate(
    { serviceSlug: slug },
    {
      $set: {
        serviceTitle: catalogService?.title || String(serviceTitle).trim(),
        serviceCategory: catalogService?.category,
        categorySlug: catalogService?.categorySlug,
        steps: normalized,
        updatedBy: actorId,
      },
      $setOnInsert: { serviceSlug: slug },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();
};

export const deleteTemplate = async (serviceSlug) => {
  const slug = String(serviceSlug ?? "").trim();
  const deleted = await ServiceStepTemplate.findOneAndDelete({ serviceSlug: slug });
  if (!deleted) throw new AppError("No step template exists for that service.", 404);
  return { serviceSlug: slug };
};

/**
 * The steps to preload when a service is assigned, shaped for a task's own
 * `serviceRequest.steps` copy. An unconfigured service simply preloads nothing.
 */
export const buildTaskSteps = async (serviceSlug) => {
  const template = await getTemplate(serviceSlug).catch(() => null);
  if (!template?.steps?.length) return [];

  return template.steps.map((step, index) => ({
    title: step.title,
    description: step.description,
    order: Number.isFinite(step.order) ? step.order : index,
    done: false,
  }));
};
