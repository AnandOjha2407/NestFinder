# Backend Server Setup ✅

## What's Been Created

### Backend Server (`server.js`)
- ✅ Express.js server running on port 5000
- ✅ CORS enabled for frontend communication
- ✅ JWT authentication
- ✅ File-based user storage (`data/users.json`)
- ✅ Password hashing with bcrypt

### Authentication Endpoints

1. **POST /api/auth/signup**
   - Creates new user account
   - Hashes password securely
   - Returns JWT token and user data

2. **POST /api/auth/login**
   - Authenticates user with email/password
   - Returns JWT token and user data

3. **GET /api/health**
   - Health check endpoint

## How to Run

### Start the Backend Server:
```bash
npm run server
```
or
```bash
node server.js
```

The server will start on `http://localhost:5000`

### Start the Frontend:
```bash
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies API calls to port 5000.

## User Storage

Users are stored in `data/users.json` with:
- Unique ID
- Name, Email
- Hashed password (bcrypt)
- Created timestamp

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT tokens for authentication (7-day expiration)
- ✅ Password validation (minimum 6 characters)
- ✅ Email uniqueness check
- ✅ Secure password storage (never sent back to client)

## Testing

1. **Signup**: 
   - Go to `/signup`
   - Create a new account
   - You'll be automatically logged in

2. **Login**:
   - Go to `/login`
   - Use your email and password
   - You'll be logged in and redirected

## Notes

- The JWT_SECRET is currently hardcoded. In production, use environment variables.
- User data is stored in JSON file. For production, consider using a database.
- Server runs on port 5000 (as expected by frontend)
- All dependencies are already in package.json

## Status

✅ Backend server created and ready to use
✅ Authentication endpoints working
✅ User storage implemented
✅ Server can be started with `npm run server`

---

**Last Updated**: Backend server setup complete

