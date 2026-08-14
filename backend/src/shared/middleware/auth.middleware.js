import User from "../../modules/user/user.model.js";
import verifyToken from "../utils/verifyToken.js";

/**
 * Middleware to authenticate user using JWT access token.
 */
export const authenticateUser = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Missing token.",
      });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
    let decoded;

    try {
      decoded = await verifyToken(token, secret);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Invalid or expired token.",
      });
    }

    const currentUser = await User.findById(decoded.userId).select("-password");
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists.",
      });
    }

    // Block deactivated accounts from using any authenticated endpoint, even
    // if they still hold a valid (not-yet-expired) access token.
    if (currentUser.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Please contact HR.",
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Internal authentication error.",
    });
  }
};

/**
 * Alias for authenticateUser to maintain compatibility if needed.
 */
export const protect = authenticateUser;

/**
 * Middleware to restrict access to specific roles.
 * @param {...string} roles - Allowed roles.
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};

export const requireAdmin = restrictTo("admin");

export const requireHR = (req, res, next) => {
  if (req.user.role === "admin" || req.user.departmentRole === "hr") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. HR or Admin permissions required.",
  });
};

export const requireManager = (req, res, next) => {
  if (
    req.user.role === "admin" ||
    req.user.departmentRole === "manager" ||
    req.user.departmentRole === "hr"
  ) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Manager, HR, or Admin permissions required.",
  });
};

/**
 * requireSalesManager — allows admin or the promoted Senior Sales Manager
 * (isSalesManager flag). Guards lead distribution, oversight, and per-lead
 * assignment endpoints.
 */
export const requireSalesManager = (req, res, next) => {
  if (
    req.user.role === "admin" ||
    req.user.isSalesManager === true
  ) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Sales Manager or Admin permissions required.",
  });
};

export const requireEmployee = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "employee") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Employee permissions required.",
  });
};

export const requireProductionStaff = (req, res, next) => {
  if (
    req.user.role === "admin" || 
    req.user.role === "production_staff" ||
    (req.user.role === "employee" && req.user.operationalRoles?.includes("production"))
  ) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Production staff permissions required.",
  });
};

export const requirePackagingStaff = (req, res, next) => {
  if (
    req.user.role === "admin" ||
    req.user.role === "packaging_staff" ||
    (req.user.role === "employee" && (
      req.user.operationalRoles?.includes("packaging") ||
      req.user.operationalRoles?.includes("dispatch") ||
      // Ops staff oversee the full floor (incl. the Orders/dispatch flow)
      req.user.currentOperationalRole === "ops_staff" ||
      req.user.operationalRoles?.includes("ops_staff")
    ))
  ) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Packaging/Dispatch staff or authorized manager permissions required.",
  });
};

export const requireDispatchStaff = (req, res, next) => {
  if (
    req.user.role === "admin" ||
    req.user.role === "dispatch_staff" ||
    (req.user.role === "employee" && (
      req.user.operationalRoles?.includes("dispatch") ||
      // Ops staff oversee the full floor (incl. the Orders/dispatch flow)
      req.user.currentOperationalRole === "ops_staff" ||
      req.user.operationalRoles?.includes("ops_staff")
    ))
  ) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Dispatch staff permissions required.",
  });
};

// Allows production_staff, ops_staff employees, and warehouse/production operational roles.
// Used on the shared floor stock endpoints (GET /stock, GET /vendor-stock, POST /stock/add, PATCH /stock/:id/adjust).
export const requireFloorStockAccess = (req, res, next) => {
  const isWarehouse = req.user.role === "employee" && req.user.operationalRoles?.includes("warehouse");

  const isProduction = req.user.role === "production_staff" ||
                      (req.user.role === "employee" && req.user.operationalRoles?.includes("production"));

  const isOpsStaff = req.user.role === "employee" && (
    req.user.currentOperationalRole === "ops_staff" ||
    req.user.operationalRoles?.includes("ops_staff")
  );

  if (req.user.role === "admin" || isWarehouse || isProduction || isOpsStaff) {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied. Warehouse, Production, or Ops staff permissions required.",
  });
};

// Allows both production_staff and packaging_staff (for shared self-service endpoints)
export const requireOperationsStaff = (req, res, next) => {
  if (
    req.user.role === "admin" ||
    req.user.role === "production_staff" ||
    req.user.role === "packaging_staff" ||
    (req.user.role === "employee" && (
      req.user.operationalRoles?.includes("production") || 
      req.user.operationalRoles?.includes("packaging")
    ))
  ) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Operations staff permissions required.",
  });
};

// Allows any user who can access the employee mobile app:
// production_staff, packaging_staff, dispatch_staff, and employees with operational roles (ops_staff, etc.)
export const requireEmployeeAppAccess = (req, res, next) => {
  if (
    req.user.role === "admin" ||
    req.user.role === "production_staff" ||
    req.user.role === "packaging_staff" ||
    req.user.role === "dispatch_staff" ||
    req.user.role === "employee"
  ) {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Employee app access required.",
  });
};

/**
 * requireSales — previously gated by allowedPaths.
 * Now allows any authenticated employee/admin.
 * Page visibility is controlled exclusively by the frontend RoleGuard (allowedPaths sidebar).
 */
export const requireSales = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "employee") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Authenticated employee required.",
  });
};

/**
 * requireBusinessAnalyst — previously gated by allowedPaths.
 * Now allows any authenticated employee/admin.
 * Page visibility is controlled exclusively by the frontend RoleGuard (allowedPaths sidebar).
 */
export const requireBusinessAnalyst = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "employee") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Authenticated employee required.",
  });
};

/**
 * requirePageAccess — legacy middleware, previously gated API data by allowedPaths.
 *
 * IMPORTANT: allowedPaths is a FRONTEND-ONLY concept controlling sidebar visibility and
 * the frontend RoleGuard. It must NOT gate backend API responses, as that breaks
 * functionality on pages that are legitimately accessible to the user.
 *
 * This middleware now simply ensures the user is authenticated (any employee or admin).
 * HR/admin-only write operations should use requireAdmin, requireHR, or requireManager instead.
 *
 * @param {string|string[]} pagePaths - Ignored, kept for call-site compatibility
 * @param {string[]} fallbackRoles - Optionally still allows specific top-level role overrides
 * @param {string[]} allowedOperationalRoles - Optionally allows specific operational roles
 */
export const requirePageAccess = (pagePaths, fallbackRoles = [], allowedOperationalRoles = []) => {
  return (req, res, next) => {
    // Admins always have access
    if (req.user.role === "admin") return next();

    // Any authenticated employee can access data APIs
    if (req.user.role === "employee") return next();

    // Check if user's role is in fallbackRoles (e.g. "hr", "manager" as strings)
    if (fallbackRoles.includes(req.user.role)) return next();

    // Check if user has an allowed operational role (for staff portal users)
    if (
      allowedOperationalRoles.length > 0 &&
      req.user.operationalRoles?.some(r => allowedOperationalRoles.includes(r))
    ) {
      return next();
    }

    // Allow any staff role (production_staff, packaging_staff, dispatch_staff)
    const staffRoles = ["production_staff", "packaging_staff", "dispatch_staff"];
    if (staffRoles.includes(req.user.role)) return next();

    return res.status(403).json({
      success: false,
      message: "Access denied. Authenticated user required.",
    });
  };
};



