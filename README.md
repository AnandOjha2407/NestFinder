# 🏠 Nest Finder

A modern property listing platform for finding homes, guest houses, hotels, and rental accommodations. Discover properties across multiple cities and countries with an intuitive, user-friendly interface.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

## 🎯 Project Vision

Nest Finder was designed to create a comprehensive property discovery platform that combines:

- **Real-time Property Discovery**: Discover properties from OpenStreetMap (OSM) based on geographical location
- **Owner-Driven Content**: Property owners can claim and manage their listings with detailed information
- **User Contributions**: Community-driven data with moderation support
- **Multi-Country Support**: Currently supports properties in India and Japan with plans for global expansion
- **Flexible Property Types**: Guest Houses (PGs), Hotels, and Rental properties
- **Booking System**: Integrated booking functionality for seamless reservations

## ✨ Features

### Property Discovery
- 🔍 Location-based property search across multiple cities
- 🏙️ Support for multiple countries (India, Japan)
- 📍 Filter by property type (Guest Houses, Hotels, Rentals)
- 💰 Price range filtering
- 🗺️ Interactive maps with location details

### User Features
- 👤 User authentication and profiles
- ❤️ Save favorite properties
- 📅 Book properties with booking management
- 🔔 Property queries and contact information
- 📱 Responsive design for all devices

### Owner Features
- ✅ Claim property listings
- 📝 Add detailed property information
- 🖼️ Upload property images
- 📞 Manage contact information
- 💼 Manage multiple property listings

### Property Types
- **Guest Houses (PGs)**: Paying guest accommodations with shared facilities
- **Hotels**: Short-term stays with nightly rates
- **Rentals**: Long-term rental properties (1BHK, 2BHK, 3BHK)

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Routing
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **Context API** - State management
- **CSS3** - Styling with CSS Variables

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **File-based Storage** - JSON files for data persistence

### Data Sources
- **OpenStreetMap (OSM)** - Property discovery (planned)
- **Overpass API** - Geographic data queries (planned)
- **Nominatim** - Geocoding service (planned)
- **Static Data** - Currently using static JSON files

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nest-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Configuration

3. **Create `.env` file** in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_change_in_production_min_32_chars
   JWT_EXPIRES_IN=7d

   # Database Configuration (if using database in future)
   # DATABASE_URL=mongodb://localhost:27017/nestfinder
   # DATABASE_NAME=nestfinder

   # OpenStreetMap API (Optional - for future OSM integration)
   OSM_USER_AGENT=NestFinder/2.0.0
   OSM_EMAIL=your-email@example.com

   # Email Configuration (Optional - for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=noreply@nestfinder.com

   # Google Maps API (Optional - for map features)
   GOOGLE_MAPS_API_KEY=AIzaSyDemo_Key_Replace_With_Your_Own_Key

   # File Upload Configuration (Optional)
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads

   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   ```

4. **For development, you can use mock values:**
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=nestfinder_dev_secret_key_12345_change_in_production
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:3000
   ```

### Running the Application

5. **Start the backend server** (Terminal 1):
   ```bash
   npm run server
   # or
   npm start
   ```
   Server will run on `http://localhost:5000`

6. **Start the frontend development server** (Terminal 2):
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

7. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
nest-finder/
├── src/                      # Frontend source code
│   ├── components/          # React components
│   │   ├── common/         # Shared components (Navbar, Footer, etc.)
│   │   └── property/       # Property-specific components
│   ├── context/            # React Context providers
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── styles/             # Global styles
│   └── utils/              # Utility functions
│
├── data/                    # Data storage
│   ├── properties.json     # Indian properties data
│   ├── properties-japan.json  # Japanese properties data
│   └── users.json          # User data (created on first signup)
│
├── public/                  # Static assets
│   ├── assets/             # Images, videos, logos
│   └── data/               # Public data files
│
├── server.js               # Backend Express server
├── .env                    # Environment variables (create this)
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🔐 Authentication

The application uses JWT-based authentication:

1. **Signup**: Create a new account with name, email, and password
2. **Login**: Authenticate with email and password
3. **Token Storage**: JWT tokens stored in localStorage
4. **Protected Routes**: Certain pages require authentication

### Default Test Accounts

For development/testing, you can create accounts through the signup page. No default accounts are provided for security.

## 📊 Data Management

### Current Implementation
- **Static Data**: Properties stored in JSON files (`data/properties.json`)
- **User Data**: Stored in `data/users.json` (created automatically)
- **Bookings**: Stored in browser localStorage
- **Favorites**: Stored in browser localStorage

### Future Plans
- Migrate to database (MongoDB/PostgreSQL)
- Implement OpenStreetMap integration for property discovery
- Add image upload functionality
- Implement data synchronization across devices

## 🌍 Supported Locations

### India
- **Bengaluru** - 13 properties
- **Mumbai** - 8 properties
- **Delhi** - 8 properties

### Japan
- **Tokyo** - 8 properties (Shibuya, Shinjuku, Ueno, Ginza, Asakusa, Setagaya)
- **Osaka** - 3 properties (Namba, Umeda)
- **Kyoto** - 4 properties (Gion, Higashiyama)

**Total**: 44 properties across 6 cities in 2 countries

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start frontend dev server (port 3000)
npm run server       # Start backend server (port 5000)
npm start            # Start backend server

# Production
npm run build        # Build frontend for production
npm run preview      # Preview production build
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - User login
- `GET /api/health` - Health check

### Properties (Planned - Currently using static data)
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/property/:id` - Get single property
- `POST /api/properties/:id/claim` - Claim property as owner
- `PUT /api/properties/:id` - Update property
- `GET /api/properties/my-properties` - Get owner's properties

### Bookings (Planned)
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

## 🎨 Features in Development

- [ ] OpenStreetMap integration for property discovery
- [ ] Image upload functionality
- [ ] Email notifications
- [ ] Advanced search and filters
- [ ] Property reviews and ratings
- [ ] Payment integration
- [ ] Admin dashboard
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👤 Owner

- **Anand Ojha** - [@AnandOjha](https://github.com/AnandOjha2407)

## 🙏 Acknowledgments

- OpenStreetMap community for geographic data
- Unsplash for property images
- React and Express.js communities
- All contributors and users

## 📞 Support

For queries: anandojha901@gmail.com or open an issue in the repository.

## 🔮 Future Roadmap

- **Phase 1** (Current): Static data with basic booking system
- **Phase 2**: OpenStreetMap integration for property discovery
- **Phase 3**: Database migration and user management
- **Phase 4**: Payment gateway integration
- **Phase 5**: Mobile application
- **Phase 6**: Multi-language support
- **Phase 7**: AI-powered property recommendations

---

**Note**: This project is currently in active development. Some features may be incomplete or subject to change.

**Last Updated**: 2026
