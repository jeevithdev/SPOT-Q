# MongoDB Atlas Setup Guide

## 🚀 Quick Setup Steps

### 1. Create MongoDB Atlas Account
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign up for a free account
3. Verify your email address

### 2. Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select a cloud provider and region
4. Give your cluster a name (e.g., "SPOT-Q-Cluster")
5. Click "Create"

### 3. Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Set privileges to "Read and write to any database"
6. Click "Add User"

### 4. Whitelist IP Addresses
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0) for development
   - **For production**: Add specific IP addresses only
4. Click "Confirm"

### 5. Get Connection String
1. Go to "Clusters" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as driver
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with your database name (e.g., "yourDatabase")

### 6. Update Your Configuration
1. Copy the connection string to your `backend/config.env` file
2. Replace the `MONGODB_URI` value
3. Rename `config.env` to `.env`

## 🔧 Example Connection String
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/yourDatabase?retryWrites=true&w=majority
```

## 🧪 Test Your Connection
```bash
cd backend
node test-connection.js
```

## 🔒 Security Best Practices

### For Development:
- Use "Allow access from anywhere" (0.0.0.0/0)
- Use strong passwords
- Don't commit credentials to version control

### For Production:
- Whitelist specific IP addresses only
- Use environment variables for credentials
- Enable MongoDB Atlas security features
- Consider using MongoDB Atlas VPC peering

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Authentication failed | Check username/password |
| IP not whitelisted | Add your IP to Network Access |
| Connection timeout | Check firewall settings |
| SSL/TLS errors | Ensure connection string uses `mongodb+srv://` |

## 📚 Additional Resources
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Options](https://docs.mongodb.com/manual/reference/connection-string/)
- [Security Checklist](https://docs.atlas.mongodb.com/security-checklist/)
