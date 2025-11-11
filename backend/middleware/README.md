# Middleware Documentation

## Overview

The application uses two main middleware files for authentication and authorization:

1. **auth.js** - Handles authentication (JWT token verification)
2. **rolecheck.js** - Handles authorization (department and role-based access control)

## auth.js

### `protect`
- **Purpose**: Authenticates users by verifying JWT tokens
- **Function**: Loads user from database and attaches to `req.user`
- **Usage**: Must be used before any protected route
- **No Authorization**: This middleware only authenticates, it does not check permissions

```javascript
const { protect } = require('./middleware/auth');
router.get('/route', protect, handler);
```

## rolecheck.js

### `checkDepartmentAccess`
- **Purpose**: Authorizes access based on user's department
- **Function**: Checks if user's department matches the required department for the route
- **Usage**: Must be used after `protect` middleware
- **Access Rules**:
  - Users with `role='admin'` have access to all departments
  - Users with `department='Admin'` have access to all departments
  - Users with `department='All'` have access to all departments
  - Other users can only access routes for their assigned department

```javascript
const { checkDepartmentAccess } = require('./middleware/rolecheck');
router.get('/route', protect, checkDepartmentAccess, handler);
```

### `checkAdminAccess`
- **Purpose**: Authorizes access for admin-only routes
- **Function**: Checks if user has admin privileges
- **Usage**: Must be used after `protect` middleware
- **Admin Criteria**: User must have `role='admin'` OR `department='Admin'`

```javascript
const { checkAdminAccess } = require('./middleware/rolecheck');
router.get('/admin/route', protect, checkAdminAccess, handler);
```

## Route-Department Mapping

The following routes are mapped to departments:

| Route | Required Department |
|-------|-------------------|
| `/api/v1/tensile-tests` | Tensile |
| `/api/v1/impact-tests` | Impact |
| `/api/v1/micro-tensile-tests` | Micro Tensile |
| `/api/v1/micro-structure` | Micro Structure |
| `/api/v1/qc-reports` | QC - production |
| `/api/v1/process-records` | Process |
| `/api/v1/melting-logs` | Melting |
| `/api/v1/cupola-holder-logs` | Melting |
| `/api/v1/dmm-settings` | Moulding |
| `/api/v1/dismatic-reports` | Moulding |
| `/api/v1/sand-testing-records` | Sand Lab |
| `/api/v1/foundry-sand-testing-notes` | Sand Lab |

## Usage Examples

### Protected Route with Department Access
```javascript
// In server.js
app.use('/api/v1/tensile-tests', protect, checkDepartmentAccess, tensileRoutes);
```

### Admin-Only Route
```javascript
// In routes/auth.js
router.get('/admin/users', protect, checkAdminAccess, getAllUsers);
```

### Public Route (No Protection)
```javascript
// In routes/auth.js
router.post('/login', login); // No middleware needed
```

## Error Responses

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Not authorized, access token missing."
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "Access denied. This resource requires 'Tensile' department access. Your department: 'Melting'"
}
```

## Important Notes

1. **Order Matters**: Always use `protect` before `checkDepartmentAccess` or `checkAdminAccess`
2. **No Role-Based Authorization**: The old `authorize()` function has been removed. All authorization is now handled by `rolecheck.js`
3. **Admin Access**: Admin users (role='admin' or department='Admin') have access to all departments
4. **Department Matching**: Users can only access routes that match their assigned department

