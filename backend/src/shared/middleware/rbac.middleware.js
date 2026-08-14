import AppError from '../utils/appError.js';

/**
 * Valid roles: 'ops_staff', 'production_staff', 'packaging_staff', 'dispatch_staff', 'sales_staff', 'admin'
 * 
 * @param {string[]} allowedRoles Array of allowed roles
 */
export const restrictToRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Requires authentication to set req.user
    if (!req.user || !req.user.role) {
      return next(new AppError('You are not logged in or role is missing. Please log in.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(`Access forbidden: Role '${req.user.role}' lacks permission for this action.`, 403)
      );
    }

    next();
  };
};
