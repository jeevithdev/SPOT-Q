# Utility Functions

This folder contains utility functions for the backend application.

## createAdmin.js

Utility function to create or update an admin user in the database. This utility can be used as a standalone script or imported as a module.

### Features

- ✅ Creates admin user if it doesn't exist
- ✅ Updates existing admin user if it exists
- ✅ Can be run as a standalone script
- ✅ Can be imported and used programmatically
- ✅ Always available in the utils folder (even if admin is deleted from database)

### Usage as Standalone Script

From the `backend` directory:

```bash
# Using default credentials
npm run create-admin

# Using custom credentials
npm run create-admin -- ADMIN001 YourPassword123 "Admin Name"

# Direct execution
node utils/createAdmin.js
node utils/createAdmin.js ADMIN001 MyPassword "Admin Name"
```

### Usage as Module

```javascript
const { createAdminUser } = require('./utils/createAdmin');

// Create admin with default credentials
const result = await createAdminUser();

// Create admin with custom credentials
const result = await createAdminUser('ADMIN001', 'MyPassword123', 'Admin Name');

// Result format:
// {
//   success: true,
//   action: 'created' | 'updated',
//   user: { ... },
//   message: '...'
// }
```

### Default Credentials

- **Employee ID**: `ADMIN001`
- **Password**: `Admin@123`
- **Name**: `Administrator`

### Use Cases

1. **Initial Setup**: Create admin user when setting up the application
2. **Recovery**: Recreate admin user if deleted from database
3. **Reset**: Reset admin password if forgotten
4. **Automation**: Use in deployment scripts to ensure admin exists

### Notes

- The utility automatically handles MongoDB connection
- Password is automatically hashed using bcrypt
- If a user with the same Employee ID exists, it will be updated to admin role
- The utility is always available in the codebase, regardless of database state

