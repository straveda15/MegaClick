import * as serviceFeesService from "./serviceFees.service.js";

export const listFees = async (_req, res, next) => {
  try {
    const fees = await serviceFeesService.listFees();
    res.status(200).json({
      success: true,
      message: "Service fees fetched",
      data: fees,
    });
  } catch (error) {
    next(error);
  }
};

export const saveFee = async (req, res, next) => {
  try {
    const fee = await serviceFeesService.saveFee(
      req.params.serviceSlug,
      req.body,
      req.user._id
    );

    res.status(200).json({
      success: true,
      message: "Service fee saved",
      data: fee,
    });
  } catch (error) {
    next(error);
  }
};
