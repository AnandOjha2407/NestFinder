# Nest Finder - Project Structure & Working

## Overview
Nest Finder is a modern React-based property listing platform that helps users discover and claim properties (Guest Houses, Hotels, and Rentals) using real-time data from OpenStreetMap.

---

## 🏗️ Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with React Router v6
- **Build Tool**: Vite
- **Styling**: CSS Modules + CSS Variables for theming
- **Animations**: Framer Motion
- **Port**: 3000 (dev server)
- **API Proxy**: `/api` routes proxied to `http://localhost:5000`

### Backend (Currently Deleted - To Be Rebuilt)
- **Framework**: Express.js (to be recreated)
- **Port**: 5000
- **Authentication**: JWT (jsonwebtoken)
- **Data Storage**: File-based JSON (planned)

---

## 📁 Project Structure

```
Nest Finder/
├── src/                          # React source code
│   ├── main.jsx                  # Entry point, sets up providers
│   ├── App.jsx                   # Main router configuration
│   │
│   ├── pages/                    # Page components
│   │   ├── Home.jsx              # Landing page with featured properties
│   │   ├── Guest.jsx             # Guest houses listing page
│   │   ├── Hotel.jsx             # Hotels listing page
│   │   ├── Rental.jsx            # Rental properties listing page
│   │   ├── Search.jsx            # Search & filter page
│   │   ├── PropertyDetail.jsx    # Individual property details
│   │   ├── Favorites.jsx         # User's saved properties
│   │   ├── Bookings.jsx          # User's bookings (protected)
│   │   ├── Profile.jsx           # User profile (protected)
│   │   ├── Settings.jsx          # User settings (protected)
│   │   ├── Login.jsx             # Login page
│   │   ├── Signup.jsx            # Registration page
│   │   └── Help.jsx              # Help/FAQ page
│   │
│   ├── components/               # Reusable components
│   │   ├── common/               # Shared components
│   │   │   ├── Navbar.jsx        # Top navigation bar
│   │   │   ├── Footer.jsx        # Footer component
│   │   │   ├── CityPicker.jsx    # Location/city selector
│   │   │   ├── ShowMoreButton.jsx # Pagination button
│   │   │   └── ProtectedRoute.jsx # Auth guard wrapper
│   │   └── property/             # Property-specific components
│   │       ├── PropertyCard.jsx  # Property listing card
│   │       └── ClaimPropertyModal.jsx # Modal for claiming property
│   │
│   ├── context/                  # React Context providers
│   │   ├── AuthContext.jsx       # User authentication state
│   │   ├── ThemeContext.jsx      # Theme (light/dark) management
│   │   ├── LanguageContext.jsx   # i18n translations
│   │   ├── LocationContext.jsx   # Selected city/country state
│   │   └── SettingsContext.jsx   # User settings
│   │
│   ├── services/                 # API service layer
│   │   └── propertyService.js    # Property API calls (GET, POST, PUT, DELETE)
│   │
│   ├── utils/                    # Utility functions
│   │   ├── themes.js             # Theme configurations
│   │   └── translations.js       # i18n translation strings
│   │
│   └── styles/                   # Global styles
│       └── index.css             # Base CSS & resets
│
├── public/                       # Static assets
│   └── assets/                   # Images, videos, logos
│
├── data/                         # (TO BE REMOVED - static data)
│   └── properties.json           # Static property data file
│
├── index.html                    # HTML entry point for Vite
├── vite.config.js                # Vite configuration
├── package.json                  # Dependencies & scripts
└── README.md                     # Project documentation

```

---

## 🔄 How It Works

### 1. Application Flow

**Entry Point** (`main.jsx`):
- Wraps app in React Router (BrowserRouter)
- Provides Context providers: Auth, Settings, Language, Location, Theme
- Renders `<App />` component

**Routing** (`App.jsx`):
- Defines all routes using React Router
- Public routes: `/`, `/guest`, `/hotel`, `/rental`, `/search`, `/login`, `/signup`, `/property/:id`, `/help`
- Protected routes (require authentication): `/favorites`, `/bookings`, `/profile`, `/settings`

### 2. Data Flow

**Property Discovery** (Planned - Backend to be rebuilt):
1. User selects city/country via `CityPicker` (LocationContext)
2. Frontend calls `propertyService.getAll({ type, city, country })`
3. Backend will query OpenStreetMap (OSM) Overpass API
4. OSM returns properties with: name, location (lat/lng), type, source
5. Backend stores discovered properties in JSON file
6. Frontend receives and displays properties in `PropertyCard` components

**Property Claiming** (Planned):
1. Owner clicks "Claim This Property" on `PropertyDetail` page
2. `ClaimPropertyModal` opens, owner fills form (rent, facilities, images, contact)
3. Frontend calls `propertyService.claimProperty(id, ownerData)`
4. Backend updates property: `is_claimed: true`, `owner_id`, `owner_provided_data`
5. Property now shows owner-provided details (price, images, amenities, contact)

**User Interactions**:
- **Favorites**: Authenticated users can save properties
- **Search**: Text search across property names, locations
- **Filters**: Filter by type, price range, location
- **User Submissions**: Users can submit missing info (moderated by backend)

### 3. State Management

**Context API Usage**:
- **AuthContext**: Tracks login status, user token, user data
- **ThemeContext**: Current theme (light/dark), theme colors
- **LanguageContext**: Current language, translations
- **LocationContext**: Selected city, country for property discovery
- **SettingsContext**: User preferences

**Local State**:
- Each page/component manages its own UI state (loading, pagination, filters)
- Property data fetched via `propertyService` and stored in component state

### 4. Component Hierarchy

```
App
├── Routes
    ├── Home
    │   ├── Navbar
    │   ├── PropertyCard[] (featured properties)
    │   └── Footer
    ├── Guest/Hotel/Rental (Category Pages)
    │   ├── Navbar
    │   ├── PropertyCard[] (filtered by type)
    │   └── Footer
    ├── PropertyDetail
    │   ├── Navbar
    │   ├── Property Details (images, price, amenities, map)
    │   ├── ClaimPropertyModal (if owner)
    │   └── Footer
    └── Search
        ├── Navbar
        ├── Filters Sidebar
        ├── PropertyCard[] (search results)
        └── Footer
```

---

## 🎯 Key Features

1. **Property Discovery**: Real-time discovery from OpenStreetMap
2. **Property Claiming**: Owners can claim and add details
3. **Multi-type Support**: Guest Houses, Hotels, Rentals
4. **Location-based**: Filter by city/country
5. **Search & Filter**: Text search, type filter, price range
6. **Favorites**: Save properties for later
7. **Responsive UI**: Modern, animated interface
8. **Theme Support**: Light/Dark modes
9. **Multi-language**: i18n support
10. **Protected Routes**: Authentication-based access

---

## 🚀 Current Status

**Frontend**: ✅ Complete React app with all pages and components
**Backend**: ❌ Deleted (to be rebuilt)
**Static Data**: ⚠️ Present but will be removed (data/properties.json, hardcoded images)

---

## 🔧 Development Scripts

- `npm run dev` - Start Vite dev server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 📝 Next Steps

1. ✅ Remove all static data and hardcoded content
2. ⏳ Rebuild backend server with OSM integration
3. ⏳ Implement property storage (JSON file-based)
4. ⏳ Test end-to-end property discovery flow
5. ⏳ Implement property claiming workflow

