# 🏠 Nest Finder - Modern Property Search Platform

A beautiful, modern React application for finding homes, guest houses, hostels, and rental properties. Built with React, Express, and a dynamic theme system.

## ✨ Features

- **Modern UI/UX** - Clean, responsive design with smooth animations
- **Dynamic Themes** - Different color themes per page, same style system
- **Authentication** - Email/password login and signup
- **Property Search** - Advanced search with filters
- **Favorites** - Save your favorite properties
- **Property Details** - Detailed property pages with maps
- **Category Pages** - Dedicated pages for Guest, Hostel, and Rental properties

## 🎨 Theme System

Each page has its own color theme while maintaining the same design style:

- **Home**: Purple/Indigo gradient
- **Guest Houses**: Warm Orange
- **Hostels**: Cool Blue
- **Rentals**: Green
- **Login/Signup**: Teal
- **Search**: Deep Blue
- **Property Details**: Violet

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the backend server:**
   ```bash
   npm run server
   ```
   This starts the Express API server on `http://localhost:5000`

3. **Start the React development server:**
   ```bash
   npm run dev
   ```
   This starts Vite dev server on `http://localhost:3000`

4. **Or run both simultaneously:**
   ```bash
   npm start
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
Nest Finder/
├── src/
│   ├── components/
│   │   ├── common/        # Navbar, Footer, ProtectedRoute
│   │   └── property/      # PropertyCard
│   ├── context/           # AuthContext, ThemeContext
│   ├── pages/             # All page components
│   ├── services/          # API service functions
│   ├── styles/            # Global styles
│   └── utils/             # Theme utilities
├── public/                # Static assets
├── data/                  # Property data (JSON)
├── server.js              # Express backend
└── vite.config.js         # Vite configuration
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login

### Properties
- `GET /api/properties` - Get all properties (with optional filters)
- `GET /api/property/:id` - Get single property

### Favorites (Protected)
- `GET /api/favorites` - Get user's favorites
- `POST /api/favorites` - Add to favorites
- `DELETE /api/favorites/:propertyId` - Remove from favorites

## 🛣️ Routes

- `/` - Home page
- `/guest` - Guest houses
- `/hostel` - Hostels
- `/rental` - Rental properties
- `/search` - Search page with filters
- `/login` - Login page
- `/signup` - Signup page
- `/property/:id` - Property detail page
- `/favorites` - User favorites (protected)

## 🚀 BANKAI Features (Future)

When you say "bankai", we'll implement:

1. **Real API Integration** - Replace mock data with real property APIs
2. **Gmail OAuth** - Add Google Sign-In authentication

See `BANKAİ_FEATURES.md` for details.

## 🛠️ Technologies

- **Frontend:**
  - React 18
  - React Router
  - Framer Motion (animations)
  - Vite (build tool)

- **Backend:**
  - Express.js
  - JWT (authentication)
  - bcryptjs (password hashing)

## 📝 Scripts

- `npm run dev` - Start React dev server
- `npm run server` - Start Express API server
- `npm start` - Start both servers
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 👥 Authors

- [Anand Ojha (@AnandOjha)](https://github.com/AnandOjha2407)
- [Anchal (@Anchalanshu)](https://github.com/Anchalanshu)
- [Aniket (@skyneon1)](https://www.github.com/skyneon1)
- [Sameeksha (@Sambil03)](https://github.com/Sambil03)

## 📧 Contact

For queries: www.aniket716@gmail.com

---

**Note:** This project uses mock data. Real API integration will be added when you say "bankai"! 🚀
