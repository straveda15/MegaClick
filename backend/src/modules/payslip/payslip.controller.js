import * as payslipService from './payslip.service.js';

export const getMyPayslips = async (req, res, next) => {
  try {
    const payslips = await payslipService.getMyPayslips(req.user._id);
    res.status(200).json({ success: true, data: payslips });
  } catch (err) {
    next(err);
  }
};

export const getMyPayslipByMonth = async (req, res, next) => {
  try {
    const payslip = await payslipService.getMyPayslipByMonth(req.user._id, req.params.month);
    res.status(200).json({ success: true, data: payslip });
  } catch (err) {
    next(err);
  }
};

export const downloadPayslip = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const payslip = await payslipService.getPayslipById(req.params.id, req.user._id, isAdmin);

    if (payslip.pdfUrl) {
      return res.status(200).json({ success: true, data: { pdfUrl: payslip.pdfUrl } });
    }

    // PDF generation requires pdfkit — return structured data until configured
    return res.status(200).json({
      success: true,
      message: 'PDF generation not configured. Returning payslip data.',
      data: payslip,
    });
  } catch (err) {
    next(err);
  }
};

export const generatePayslip = async (req, res, next) => {
  try {
    const payslip = await payslipService.generatePayslip(req.body, req.user._id);
    res.status(201).json({ success: true, message: 'Payslip generated', data: payslip });
  } catch (err) {
    next(err);
  }
};

export const getAllPayslips = async (req, res, next) => {
  try {
    const { month, status, employeeId } = req.query;
    const payslips = await payslipService.getAllPayslips({ month, status, employeeId });
    res.status(200).json({ success: true, data: payslips });
  } catch (err) {
    next(err);
  }
};
