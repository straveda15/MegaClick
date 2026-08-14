import catchAsync from "../../shared/utils/catchAsync.js";
import AppError from "../../shared/utils/appError.js";
import * as tierService from "./tier.service.js";
import { createTierSchema, updateTierSchema, citySearchSchema } from "./tier.validation.js";

export const listCityTiers = catchAsync(async (req, res) => {
  const tiers = await tierService.listCityTiers();
  res.status(200).json({ success: true, results: tiers.length, data: { tiers } });
});

export const createCityTier = catchAsync(async (req, res, next) => {
  const { error, value } = createTierSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const tier = await tierService.createCityTier(value, req.user._id);
  res.status(201).json({ success: true, data: { tier } });
});

export const updateCityTier = catchAsync(async (req, res, next) => {
  const { error, value } = updateTierSchema.validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  const tier = await tierService.updateCityTier(req.params.id, value, req.user._id);
  res.status(200).json({ success: true, data: { tier } });
});

export const deleteCityTier = catchAsync(async (req, res) => {
  await tierService.deleteCityTier(req.params.id);
  res.status(204).json({ success: true, data: null });
});

export const searchCities = catchAsync(async (req, res, next) => {
  const { error, value } = citySearchSchema.validate(req.query);
  if (error) return next(new AppError(error.details[0].message, 400));

  const cities = await tierService.searchCities(value.q);
  res.status(200).json({ success: true, data: { cities } });
});
