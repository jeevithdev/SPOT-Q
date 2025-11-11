/**
 * Role and Department-based Access Control Middleware
 * Controls access based on user's department and role
 */

// Map API routes to required departments
const ROUTE_DEPARTMENT_MAP = {
    '/api/v1/tensile-tests': 'Tensile',
    '/api/v1/impact-tests': 'Impact',
    '/api/v1/micro-tensile-tests': 'Micro Tensile',
    '/api/v1/micro-structure': 'Micro Structure',
    '/api/v1/qc-reports': 'QC - production',
    '/api/v1/process-records': 'Process',
    '/api/v1/melting-logs': 'Melting',
    '/api/v1/cupola-holder-logs': 'Melting',
    '/api/v1/dmm-settings': 'Moulding',
    '/api/v1/dismatic-reports': 'Moulding',
    '/api/v1/sand-testing-records': 'Sand Lab',
    '/api/v1/foundry-sand-testing-notes': 'Sand Lab'
};

/**
 * Get the required department for a given route path
 * @param {string} path - The request path (may include query string)
 * @returns {string|null} - The required department or null if not mapped
 */
function getRequiredDepartment(path) {
    // Remove query string if present
    const pathWithoutQuery = path.split('?')[0];
    
    // Check for exact matches first
    if (ROUTE_DEPARTMENT_MAP[pathWithoutQuery]) {
        return ROUTE_DEPARTMENT_MAP[pathWithoutQuery];
    }
    
    // Check for path prefixes (for nested routes like /api/v1/tensile-tests/:id)
    for (const routePath in ROUTE_DEPARTMENT_MAP) {
        if (pathWithoutQuery.startsWith(routePath + '/') || pathWithoutQuery === routePath) {
            return ROUTE_DEPARTMENT_MAP[routePath];
        }
    }
    
    return null;
}

/**
 * Check if user has access to the required department
 * @param {Object} user - The user object
 * @param {string} requiredDepartment - The required department
 * @returns {boolean} - True if user has access
 */
function hasDepartmentAccess(user, requiredDepartment) {
    if (!user) {
        return false;
    }
    
    // Admin role users have access to everything
    if (user.role === 'admin') {
        return true;
    }
    
    // Users with 'Admin' department have access to everything
    if (user.department === 'Admin') {
        return true;
    }
    
    // Users with 'All' department have access to everything
    if (user.department === 'All') {
        return true;
    }
    
    // Check if user's department matches the required department
    return user.department === requiredDepartment;
}

/**
 * Middleware to check department-based access
 * Must be used after the protect middleware (which sets req.user)
 */
exports.checkDepartmentAccess = (req, res, next) => {
    // Skip authorization for auth routes
    if (req.originalUrl && req.originalUrl.startsWith('/api/auth')) {
        return next();
    }
    
    // Skip authorization for health check
    if (req.originalUrl === '/api/health' || req.path === '/api/health') {
        return next();
    }
    
    // Use originalUrl for full path matching
    const requestPath = req.originalUrl || req.path;
    
    // Get the required department for this route
    const requiredDepartment = getRequiredDepartment(requestPath);
    
    // If route is not mapped to any department, allow access
    // But log a warning in development
    if (!requiredDepartment) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`⚠️  No department mapping found for route: ${requestPath}`);
        }
        return next();
    }
    
    // Check if user has access
    if (!hasDepartmentAccess(req.user, requiredDepartment)) {
        return res.status(403).json({
            success: false,
            message: `Access denied. This resource requires '${requiredDepartment}' department access. Your department: '${req.user.department}'`
        });
    }
    
    next();
};

/**
 * Middleware to check if user is admin (for admin-only routes)
 * Admin users have role='admin' OR department='Admin'
 */
exports.checkAdminAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }
    
    // Check if user is admin
    const isAdmin = req.user.role === 'admin' || req.user.department === 'Admin';
    
    if (!isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
    
    next();
};

// Export the map for reference
exports.ROUTE_DEPARTMENT_MAP = ROUTE_DEPARTMENT_MAP;

