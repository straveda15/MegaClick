import catchAsync from "../../shared/utils/catchAsync.js";
import AppError from "../../shared/utils/appError.js";
import * as ruleService from "./rule.service.js";
import { createRuleSchema, updateRuleSchema } from "./rule.validation.js";

export const listRules = catchAsync(async (req, res) => {
  const rules = await ruleService.listRules();
  res.status(200).json({ success: true, results: rules.length, data: { rules } });
});

export const createRule = catchAsync(async (req, res, next) => {
  const { error, value } = createRuleSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const rule = await ruleService.createRule(value);
  res.status(201).json({ success: true, data: { rule } });
});

export const updateRule = catchAsync(async (req, res, next) => {
  const { error, value } = updateRuleSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const rule = await ruleService.updateRule(req.params.id, value);
  res.status(200).json({ success: true, data: { rule } });
});

export const deleteRule = catchAsync(async (req, res) => {
  await ruleService.deleteRule(req.params.id);
  res.status(204).json({ success: true, data: null });
});
