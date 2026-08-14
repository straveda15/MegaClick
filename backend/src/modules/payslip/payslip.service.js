import Payslip from './payslip.model.js';
import AppError from '../../shared/utils/appError.js';
import eventBus, { EVENTS } from '../../shared/events/eventBus.js';

/**
 * Get all payslips for the authenticated employee, newest first.
 */
export const getMyPayslips = async (userId) => {
  return Payslip.find({ employee: userId })
    .sort({ month: -1 })
    .lean();
};

/**
 * Get a single month's payslip for the authenticated employee.
 * @param {string} month - 'YYYY-MM'
 */
export const getMyPayslipByMonth = async (userId, month) => {
  const payslip = await Payslip.findOne({ employee: userId, month })
    .populate('employee', 'name lastName phone email')
    .lean();

  if (!payslip) throw new AppError(`No payslip found for ${month}`, 404);
  return payslip;
};

/**
 * Admin/HR: Generate (create or update) a payslip for an employee.
 */
export const generatePayslip = async (data, generatedBy) => {
  const { employeeId, month, earnings, deductions } = data;

  if (!employeeId || !month) throw new AppError('employeeId and month are required', 400);

  const payslip = await Payslip.findOneAndUpdate(
    { employee: employeeId, month },
    {
      $set: {
        earnings:    earnings    || {},
        deductions:  deductions  || {},
        status:      'generated',
        generatedAt: new Date(),
        generatedBy,
      },
    },
    { new: true, upsert: true, runValidators: true }
  );

  eventBus.emit(EVENTS.PAYSLIP.GENERATED, {
    payslipId:  payslip._id,
    employeeId: payslip.employee,
    month:      payslip.month,
    netPay:     payslip.netPay,
  });

  return payslip;
};

/**
 * Admin/HR: List all payslips with optional filters.
 */
export const getAllPayslips = async (filters = {}) => {
  const query = {};
  if (filters.month)      query.month    = filters.month;
  if (filters.status)     query.status   = filters.status;
  if (filters.employeeId) query.employee = filters.employeeId;

  return Payslip.find(query)
    .populate('employee', 'name lastName phone')
    .sort({ month: -1, createdAt: -1 })
    .lean();
};

/**
 * Get payslip by ID — used for download route.
 * Ensures ownership unless caller is admin.
 */
export const getPayslipById = async (payslipId, userId, isAdmin = false) => {
  const payslip = await Payslip.findById(payslipId)
    .populate('employee', 'name lastName phone email')
    .lean();

  if (!payslip) throw new AppError('Payslip not found', 404);

  if (!isAdmin && payslip.employee._id.toString() !== userId.toString()) {
    throw new AppError('Access denied', 403);
  }

  return payslip;
};
