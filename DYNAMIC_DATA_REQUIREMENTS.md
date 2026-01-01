# Dynamic Real-Time Data Requirements

This document outlines all dynamic, real-time data needed for each page and property type in Nest Finder.

---

## 🔍 Data Source Priority

When displaying property data, follow this priority order:
1. **Owner-provided data** (`owner_provided_data`) - Highest priority
2. **User-submitted data** (`user_submitted_data`) - Second priority (if moderated/approved)
3. **OSM discovered data** (`discovered_from: "OSM"`) - Basic info only
4. **External links** - For reference (map links, external images)
5. **"Not Available"** - Show if no data exists

**Never use fake/mock/hardcoded data.**

---

## 📄 Property Data Model

### Core Property Fields (Required from OSM or Owner)

```javascript
{
  // Identity
  id: string,                    // Unique ID (e.g., "osm-guest-12345")
  name: string,                  // Property name (from OSM or owner)
  type: "Guest" | "Hotel" | "Rental",  // Property type
  
  // Location (Required)
  location: string,              // Full address string
  latitude: number,              // GPS latitude
  longitude: number,             // GPS longitude
  city: string,                  // City name
  country: string,               // Country name
  
  // Discovery Metadata
  discovered_from: "OSM",        // How property was discovered
  discoveredAt: string,          // ISO timestamp
  source: string,                // "OpenStreetMap"
  sourceUrl: string,             // OSM link (optional)
  
  // Claiming Status
  is_claimed: boolean,           // Whether owner has claimed
  owner_id: string | null,       // User ID if claimed
  claimedAt: string | null,      // ISO timestamp
  
  // Owner-Provided Data (when claimed)
  owner_provided_data: {
    rent: string,                // Price (e.g., "₹15,000/month")
    description: string,          // Full description
    amenities: string[],          // ["WiFi", "AC", "Parking", ...]
    contact: string,              // Phone or email
    images: string[],             // Array of image URLs (uploaded)
    bedrooms: number | null,      // Number of bedrooms
    bathrooms: number | null,     // Number of bathrooms
    area: string | null,          // Area (e.g., "800 sqft")
    furnished: boolean | null,    // Furnished status
    available_from: string | null // Move-in date
  } | null,
  
  // User-Submitted Data (moderated)
  user_submitted_data: [{
    submitted_by: string,         // User ID
    submitted_at: string,         // ISO timestamp
    approved: boolean,            // Admin approval status
    price_range: string | null,   // User-reported price
    facilities: string[] | null,  // User-reported facilities
    review: string | null,        // User review/comment
    rating: number | null         // User rating (1-5)
  }] | [],
  
  // External Links (for reference only)
  mapLink: string | null,         // OpenStreetMap link
  googleMapsLink: string | null   // Google Maps link
}
```

---

## 🏠 Property Type-Specific Data Requirements

### 1. Guest Houses (PGs / Paying Guest)

**Required Real-Time Data:**
- ✅ Name (from OSM or owner)
- ✅ Location (lat/lng, address)
- ✅ Type: "Guest"

**Owner-Provided Data (when claimed):**
- ✅ Monthly rent (per person or per room)
- ✅ Contact information (phone/email)
- ✅ Images (uploaded by owner)
- ✅ Amenities:
  - WiFi availability
  - AC/Non-AC
  - Food included/not included
  - Laundry service
  - Parking availability
  - Security
  - Common areas
  - Rules (e.g., visitors allowed, curfew)
- ✅ Rooms available (single/double/triple sharing)
- ✅ Bathrooms (attached/shared)
- ✅ Deposit amount
- ✅ Available from (date)

**User-Submitted Data:**
- Price range (if owner hasn't provided)
- Facilities (user-reported)
- Reviews and ratings
- Photos (if owner hasn't uploaded)

**Display Logic:**
- Show "Price not available" if `rent` is missing
- Show "Contact info not available" if `contact` is missing
- Show "Images not available" placeholder if no images
- Show amenities list if available, otherwise hide section

---

### 2. Hotels

**Required Real-Time Data:**
- ✅ Name (from OSM or owner)
- ✅ Location (lat/lng, address)
- ✅ Type: "Hotel"

**Owner-Provided Data (when claimed):**
- ✅ Price per night
- ✅ Contact information (phone/email/booking link)
- ✅ Images (uploaded by owner)
- ✅ Amenities:
  - WiFi
  - Room service
  - Restaurant
  - Parking
  - Gym/Fitness center
  - Pool
  - Spa
  - Conference rooms
  - Airport shuttle
  - Pet-friendly
- ✅ Star rating (1-5)
- ✅ Number of rooms
- ✅ Check-in/Check-out times
- ✅ Cancellation policy
- ✅ Room types available (Single, Double, Suite, etc.)

**User-Submitted Data:**
- Price range (per night)
- Reviews and ratings
- Photos
- Facilities experienced

**Display Logic:**
- Show "Price per night not available" if missing
- Show "Contact info not available" if missing
- Show star rating if available
- Show room types if available

---

### 3. Rental Properties

**Required Real-Time Data:**
- ✅ Name (from OSM or owner)
- ✅ Location (lat/lng, address)
- ✅ Type: "Rental"

**Owner-Provided Data (when claimed):**
- ✅ Monthly rent
- ✅ Security deposit
- ✅ Contact information (phone/email)
- ✅ Images (uploaded by owner)
- ✅ Property details:
  - Bedrooms (1BHK, 2BHK, 3BHK, etc.)
  - Bathrooms
  - Area (sqft/sqm)
  - Furnished/Unfurnished/Semi-furnished
  - Floor number
  - Total floors in building
  - Property age
  - Available from (date)
- ✅ Amenities:
  - WiFi
  - AC
  - Parking (2-wheeler/4-wheeler)
  - Power backup
  - Lift/Elevator
  - Security
  - Gym
  - Swimming pool
  - Garden/Park nearby
  - Nearby facilities (schools, hospitals, markets)
- ✅ Tenant preferences:
  - Family/Bachelors/Both
  - Pets allowed
  - Preferred tenants

**User-Submitted Data:**
- Price range
- Reviews
- Photos
- Facilities
- Neighborhood info

**Display Logic:**
- Show "Price not available" if rent missing
- Show "Deposit not available" if missing
- Show bedroom/bathroom/area if available
- Show "Furnishing info not available" if missing
- Show "Available from: Not specified" if missing

---

## 📱 Page-Specific Data Requirements

### 1. Home Page (`/`)

**Real-Time Data Needed:**
- ✅ Array of properties (max 12 featured)
  - Mix of Guest, Hotel, Rental types
  - Filtered by selected city/country (from LocationContext)
  - Sorted randomly or by discovery date
- ✅ Property fields per card:
  - `id`, `name`, `type`, `location`
  - `price` or `owner_provided_data.rent` or "Price not available"
  - `images[0]` or "Image not available" placeholder
  - `latitude`, `longitude` (for map features if needed)

**API Call:**
```
GET /api/properties?city={city}&country={country}&limit=12
```

**Display Rules:**
- Show loading state while fetching
- Show "No properties found" if array is empty
- Each property card shows: image, name, location, price, type badge
- If no city selected, show empty state with message to select city

---

### 2. Guest Houses Page (`/guest`)

**Real-Time Data Needed:**
- ✅ Array of all Guest type properties
  - Filtered by selected city/country
  - Paginated (6 per page, load more)
- ✅ Property fields per card:
  - All fields from Home page
  - Additional: `amenities[]` if available
- ✅ Total count: `properties.length`

**API Call:**
```
GET /api/properties?type=Guest&city={city}&country={country}
```

**Display Rules:**
- Show total count: "Available Guest Houses ({count})"
- Pagination: Show 6 initially, "Show More" loads next 6
- Each card shows all available property info
- Show "No guest houses found in {city}" if empty

---

### 3. Hotels Page (`/hotel`)

**Real-Time Data Needed:**
- ✅ Array of all Hotel type properties
  - Filtered by selected city/country
  - Paginated (6 per page)
- ✅ Property fields per card:
  - All standard fields
  - `owner_provided_data.star_rating` if available
  - `owner_provided_data.price_per_night` for hotels
- ✅ Total count

**API Call:**
```
GET /api/properties?type=Hotel&city={city}&country={country}
```

**Display Rules:**
- Show "Available Hotels ({count})"
- Show star rating if available
- Show price per night instead of monthly rent
- Pagination with "Show More"

---

### 4. Rental Properties Page (`/rental`)

**Real-Time Data Needed:**
- ✅ Array of all Rental type properties
  - Filtered by selected city/country
  - Paginated (6 per page)
- ✅ Property fields per card:
  - All standard fields
  - `owner_provided_data.bedrooms` (1BHK, 2BHK, etc.)
  - `owner_provided_data.area` (sqft)
  - `owner_provided_data.furnished` status
- ✅ Total count

**API Call:**
```
GET /api/properties?type=Rental&city={city}&country={country}
```

**Display Rules:**
- Show "Available Rentals ({count})"
- Show bedroom count, area, furnishing status on cards
- Pagination

---

### 5. Property Detail Page (`/property/:id`)

**Real-Time Data Needed:**
- ✅ Single property object (complete data)
- ✅ All owner-provided data if claimed
- ✅ All user-submitted data (approved only)
- ✅ Map links (OSM and Google Maps)
- ✅ Claim status (`is_claimed`)

**API Call:**
```
GET /api/property/:id
```

**Display Sections & Data:**

1. **Header:**
   - `name` (required)
   - `type` badge (required)
   - `location` (required)

2. **Images:**
   - `owner_provided_data.images[]` or "Images not available"
   - Image carousel if multiple images
   - External image links if provided (but not displayed directly)

3. **Price Section:**
   - `owner_provided_data.rent` or "Price not available"
   - Show "(owner provided)" badge if claimed

4. **Property Features:**
   - `type` (required)
   - `location` (required)
   - `owner_provided_data.bedrooms` or hide if not available
   - `owner_provided_data.bathrooms` or hide if not available
   - `owner_provided_data.area` or hide if not available
   - `owner_provided_data.furnished` or hide if not available

5. **Description:**
   - `owner_provided_data.description` or generic placeholder text (not fake data)

6. **Amenities:**
   - `owner_provided_data.amenities[]` or hide section if empty

7. **External Links:**
   - `mapLink` (OpenStreetMap) - Show button if available
   - `googleMapsLink` (Google Maps) - Show button if available

8. **Contact:**
   - `owner_provided_data.contact` or "Contact info not available"
   - "Claim This Property" button if `is_claimed === false`

9. **Map Section:**
   - Embed map using `latitude` and `longitude`
   - Show only if coordinates available

**Display Rules:**
- Show "Not available" for missing optional fields
- Hide sections if no data (don't show empty lists)
- Show "Claim This Property" button if not claimed and user is authenticated

---

### 6. Search Page (`/search`)

**Real-Time Data Needed:**
- ✅ Search results array (filtered by query)
- ✅ Filter options (type, price range)
- ✅ Total count

**API Call:**
```
GET /api/properties?q={searchQuery}&type={type}&minPrice={min}&maxPrice={max}
```

**Display Rules:**
- Show search query in header
- Show "Found {count} Properties"
- Filter sidebar with:
  - Type dropdown (All, Guest, Hotel, Rental)
  - Min Price input
  - Max Price input
- Results grid same as other listing pages
- Show "No properties found" if empty
- Pagination

---

### 7. Favorites Page (`/favorites`)

**Real-Time Data Needed:**
- ✅ Array of favorited properties (for authenticated user)
- ✅ All property fields (same as listing cards)

**API Call:**
```
GET /api/favorites
Headers: Authorization: Bearer {token}
```

**Display Rules:**
- Show "My Favorites" header
- Show count if available
- Grid layout same as other listing pages
- Show "No favorites yet" empty state if array is empty
- Each card same as other pages

---

### 8. Bookings Page (`/bookings`)

**Real-Time Data Needed:**
- ✅ Array of user's bookings
- ✅ Booking details:
  - Property ID (reference to property)
  - Booking dates (check-in, check-out)
  - Booking status (pending, confirmed, cancelled)
  - Amount paid
  - Booking reference ID

**API Call:**
```
GET /api/bookings
Headers: Authorization: Bearer {token}
```

**Display Rules:**
- Show "My Bookings" header
- List of booking cards with property info
- Show booking status, dates, amount
- Link to property detail page
- Show "No bookings yet" if empty

---

### 9. Profile Page (`/profile`)

**Real-Time Data Needed:**
- ✅ User profile data:
  - Name
  - Email
  - Phone (optional)
  - Profile picture (optional)
  - Account creation date
- ✅ User's claimed properties (if owner)
  - Array of properties where `owner_id === user.id`

**API Call:**
```
GET /api/user/profile
Headers: Authorization: Bearer {token}

GET /api/properties/my-properties
Headers: Authorization: Bearer {token}
```

**Display Rules:**
- Show user info form
- Show "My Properties" section if owner
- Allow editing profile info
- Show claimed properties list with edit links

---

### 10. Settings Page (`/settings`)

**Real-Time Data Needed:**
- ✅ User preferences:
  - Theme preference (light/dark)
  - Language preference
  - Notification settings
  - Email preferences

**API Call:**
```
GET /api/user/settings
Headers: Authorization: Bearer {token}
```

**Display Rules:**
- Show settings form
- Allow updating preferences
- Save to backend and update context

---

## 🔄 Real-Time Data Flow

### Property Discovery Flow:

1. **User selects city/country** → LocationContext updates
2. **Frontend calls API** → `GET /api/properties?city={city}&country={country}&type={type}`
3. **Backend queries OSM** → Overpass API for properties in that location
4. **Backend merges data** → Combines OSM data with stored claimed properties
5. **Backend returns array** → All properties (claimed + discovered)
6. **Frontend displays** → Property cards with real data or "Not available"

### Property Claiming Flow:

1. **Owner clicks "Claim"** → Opens ClaimPropertyModal
2. **Owner fills form** → Rent, amenities, images, contact, description
3. **Frontend sends** → `POST /api/properties/:id/claim` with owner data
4. **Backend updates** → Sets `is_claimed: true`, saves `owner_provided_data`
5. **Property refreshed** → Shows owner-provided data immediately

---

## ✅ "Not Available" Display Rules

**Always show "Not available" for missing data:**

- **Price**: "Price not available" or "Contact owner for pricing"
- **Images**: Placeholder with icon + "Image not available"
- **Contact**: "Contact info not available" + "Claim This Property" button
- **Description**: Generic placeholder text explaining property type + location (not fake details)
- **Amenities**: Hide section entirely if no amenities
- **Bedrooms/Bathrooms**: Hide feature tag if not available
- **Area**: Hide if not available
- **Map**: Hide map section if no coordinates

**Never:**
- ❌ Generate fake prices
- ❌ Use stock images as fallbacks
- ❌ Make up property details
- ❌ Show placeholder text that looks like real data

---

## 📊 Summary Table

| Page | Primary Data Source | Key Fields | Fallback |
|------|-------------------|------------|----------|
| Home | `/api/properties` | name, location, price, images, type | "Not available" |
| Guest | `/api/properties?type=Guest` | Same + amenities | "Not available" |
| Hotel | `/api/properties?type=Hotel` | Same + star rating, price/night | "Not available" |
| Rental | `/api/properties?type=Rental` | Same + bedrooms, area, furnished | "Not available" |
| Detail | `/api/property/:id` | Complete property object | "Not available" |
| Search | `/api/properties?q={query}` | Filtered results | "Not available" |
| Favorites | `/api/favorites` | User's favorited properties | Empty state |
| Bookings | `/api/bookings` | User's booking history | Empty state |
| Profile | `/api/user/profile` | User info + claimed properties | Form defaults |
| Settings | `/api/user/settings` | User preferences | Default values |

---

## 🚀 Implementation Notes

1. **All API calls must return real data** - No mock responses
2. **Backend must query OSM in real-time** - No cached static data
3. **Frontend must handle empty states** - Show "Not available" gracefully
4. **Images only from owner uploads** - No external image URLs displayed
5. **Map links for reference** - Show buttons to external maps, don't embed images
6. **User-submitted data requires moderation** - Only show approved submissions
7. **Owner-provided data takes priority** - Always display if available

---

**Last Updated:** Current implementation
**Status:** ✅ Static data removed, ready for real-time backend integration

