# Secure Login System

A full-stack authentication system built with React (frontend) and Node.js/Express (backend) with MongoDB database.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with password hashing
- 👤 **User Management**: Registration, login, profile management
- 🔑 **Password Reset**: Email-based password reset functionality
<!-- Google OAuth removed -->
- 🛡️ **Security**: Rate limiting, CORS protection, helmet security headers
- 📱 **Responsive Design**: Mobile-first responsive UI
- ⚡ **Modern Stack**: React 18, Vite, Express.js, MongoDB

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **CSS3** - Modern styling with gradients and animations
- **Context API** - State management for authentication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

## Project Structure

```
SPOT-Q/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── models/
│   │   └── user.js              # User model and schema
│   ├── routes/
│   │   └── auth.js              # Authentication routes
│   ├── .env                     # Environment variables
│   ├── .env.example            # Environment template
│   ├── package.json            # Backend dependencies
│   └── server.js               # Main server file
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   │   └── Dashboard.jsx    # Dashboard component
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   └── Login.jsx        # Login/Register page
│   │   └── styles/
│   │       └── PageStyles/
│   │           └── Login.css     # Login page styles
│   ├── .env                     # Frontend environment variables
│   ├── .env.example            # Frontend environment template
│   ├── index.html              # HTML template
│   ├── main.jsx                # React entry point
│   ├── app.jsx                 # Main app component
│   ├── app.css                 # Global styles
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
└── README.md                   # This file
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SPOT-Q
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the Application**

   **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Environment Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/loginapp?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-long-random-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

> Important: In production the server will refuse to start if `JWT_SECRET` is not set. Use a strong value (at least 32 random bytes). On Windows PowerShell you can generate one like this:

```powershell
[Convert]::ToBase64String((New-Object System.Security.Cryptography.RNGCryptoServiceProvider).GetBytes(32))
```

On macOS/Linux:

```bash
openssl rand -base64 32
```

Then set it in your environment (examples):

```powershell
$env:JWT_SECRET="<paste-generated-secret>"; $env:NODE_ENV="production"; node server.js
```

```bash
export JWT_SECRET="<paste-generated-secret>" NODE_ENV=production && node server.js
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Secure Login System
VITE_APP_VERSION=1.0.0
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- Google OAuth login removed
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **CORS Protection**: Configurable cross-origin policies
- **Helmet**: Security headers
- **Input Validation**: Server-side validation
- **Account Lockout**: Temporary lockout after failed attempts

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with hot reload
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Coding! 🚀**
