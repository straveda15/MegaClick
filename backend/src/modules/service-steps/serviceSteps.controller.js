import * as serviceStepsService from "./serviceSteps.service.js";

export const listTemplates = async (_req, res, next) => {
  try {
    const templates = await serviceStepsService.listTemplates();
    res.status(200).json({
      success: true,
      message: "Service step templates fetched",
      data: templates,
    });
  } catch (error) {
    next(error);
  }
};

export const getTemplate = async (req, res, next) => {
  try {
    const template = await serviceStepsService.getTemplate(req.params.serviceSlug);
    res.status(200).json({
      success: true,
      message: template ? "Service step template fetched" : "No steps configured for this service yet",
      // A service with no template is a normal state, not an error — the editor
      // opens empty and the assign stepper simply preloads nothing.
      data: template ?? { serviceSlug: req.params.serviceSlug, steps: [] },
    });
  } catch (error) {
    next(error);
  }
};

export const saveTemplate = async (req, res, next) => {
  try {
    const template = await serviceStepsService.saveTemplate(
      req.params.serviceSlug,
      { steps: req.body?.steps, serviceTitle: req.body?.serviceTitle },
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Service steps saved",
      data: template,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTemplate = async (req, res, next) => {
  try {
    const result = await serviceStepsService.deleteTemplate(req.params.serviceSlug);
    res.status(200).json({
      success: true,
      message: "Service steps removed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
