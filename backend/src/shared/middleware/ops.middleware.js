import { authenticateUser, restrictTo } from "./auth.middleware.js";

/**
 * Middleware to restrict access based on employee operational roles.
 * Ensure authenticateUser is called BEFORE this middleware.
 * @param {...string} roles - Allowed operational roles.
 */
export const requireOpsRole = (...roles) => {
  return (req, res, next) => {
    // Admin always bypasses this check
    if (req.user.role === "admin") {
      return next();
    }

    // Role must be employee to have ops roles
    if (req.user.role !== "employee") {
      return res.status(403).json({
        success: false,
        message: "You must be an employee to perform this action.",
      });
    }

    // Use currentOperationalRole if set, otherwise fallback to the first role if they only have one
    const effectiveRole = req.user.currentOperationalRole || 
                         (req.user.operationalRoles?.length === 1 ? req.user.operationalRoles[0] : null);

    // Check if employee has the required role
    if (!effectiveRole || !roles.includes(effectiveRole)) {
      // One last check: maybe they have the role in their array but haven't "selected" it yet
      const hasAnyAllowedRole = req.user.operationalRoles?.some(r => roles.includes(r));
      
      if (!hasAnyAllowedRole) {
        return res.status(403).json({
          success: false,
          message: `Permission denied. Required role: ${roles.join(" or ")}. Your roles: ${req.user.operationalRoles?.join(", ") || 'None'}`,
        });
      }
      
      // If they have it in their array, let them through even if not "selected" yet
      // This makes the system much more usable.
    }

    next();
  };
};

export { authenticateUser, restrictTo };
