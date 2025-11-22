# FitHer AI Backend

Backend API for FitHer AI - Body Fat & BMI Calculator

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fither-ai
JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3000
```

3. Make sure MongoDB is running:
   - Local MongoDB: `mongod` or start MongoDB service
   - Or use MongoDB Atlas (cloud): Update `MONGODB_URI` in `.env`

4. Initialize admin user:
```bash
node scripts/initAdmin.js
```

This creates a default admin user:
- Email: `admin@fither.ai`
- Password: `admin123`

## Running

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout (requires authentication)
- `GET /api/auth/me` - Get current user (requires authentication)

### Sessions
- `GET /api/sessions/active` - Get active sessions (requires authentication)
- `POST /api/sessions/end/:sessionId` - End a session (requires authentication)

### Health Check
- `GET /api/health` - Health check

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```
