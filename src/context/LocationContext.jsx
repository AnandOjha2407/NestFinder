import { createContext, useContext, useState, useEffect } from 'react'

const LocationContext = createContext(null)

export const useLocationContext = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocationContext must be used within LocationProvider')
  }
  return context
}

// Popular cities by country
export const citiesByCountry = {
  India: [
    'Bengaluru', 'Delhi', 'Mumbai', 'Chennai', 'Hyderabad', 
    'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'
  ],
  Japan: [
    'Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Fukuoka',
    'Sapporo', 'Hiroshima', 'Sendai', 'Nagoya', 'Kobe'
  ]
}

// City name mappings (to handle variations)
const cityNameMappings = {
  // India
  'Bangalore': 'Bengaluru',
  'Bangaluru': 'Bengaluru',
  'New Delhi': 'Delhi',
  'Bombay': 'Mumbai',
  'Madras': 'Chennai',
  'Calcutta': 'Kolkata',
  // Japan
  'Tōkyō': 'Tokyo',
  'Tokyo-to': 'Tokyo',
  'Ōsaka': 'Osaka',
  'Kyōto': 'Kyoto'
}

// Country name mappings
const countryNameMappings = {
  'IN': 'India',
  'IND': 'India',
  'JP': 'Japan',
  'JPN': 'Japan'
}

// Normalize city name
const normalizeCityName = (cityName) => {
  if (!cityName) return null
  
  // Remove extra spaces and convert to title case
  let normalized = cityName.trim()
  
  // Check if it's in our mappings
  if (cityNameMappings[normalized]) {
    normalized = cityNameMappings[normalized]
  }
  
  // Try to find a match in our city lists (case-insensitive)
  for (const country of Object.keys(citiesByCountry)) {
    const match = citiesByCountry[country].find(
      city => city.toLowerCase() === normalized.toLowerCase()
    )
    if (match) {
      return match
    }
  }
  
  // If no exact match, try partial matching
  for (const country of Object.keys(citiesByCountry)) {
    const match = citiesByCountry[country].find(
      city => normalized.toLowerCase().includes(city.toLowerCase()) ||
              city.toLowerCase().includes(normalized.toLowerCase())
    )
    if (match) {
      return match
    }
  }
  
  return normalized // Return as-is if no match found
}

// Normalize country name
const normalizeCountryName = (countryName) => {
  if (!countryName) return null
  
  const normalized = countryName.trim()
  
  // Check mappings first
  if (countryNameMappings[normalized]) {
    return countryNameMappings[normalized]
  }
  
  // Check if it matches our country list
  const countries = Object.keys(citiesByCountry)
  const match = countries.find(
    country => country.toLowerCase() === normalized.toLowerCase()
  )
  
  return match || normalized
}

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null) // { lat, lng }
  const [userCity, setUserCity] = useState(null)
  const [userCountry, setUserCountry] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [locationPermission, setLocationPermission] = useState('prompt') // 'granted', 'denied', 'prompt'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get location from IP (fallback) - Try multiple services
  const getLocationFromIP = async () => {
    const services = [
      {
        url: 'https://ipapi.co/json/',
        parse: (data) => ({
          city: data.city,
          country: data.country_name,
          countryCode: data.country_code
        })
      },
      {
        url: 'https://ip-api.com/json/',
        parse: (data) => ({
          city: data.city,
          country: data.country,
          countryCode: data.countryCode
        })
      },
      {
        url: 'https://api.ipgeolocation.io/ipgeo?apiKey=free',
        parse: (data) => ({
          city: data.city,
          country: data.country_name,
          countryCode: data.country_code2
        })
      }
    ]

    for (const service of services) {
      try {
        const response = await fetch(service.url)
        if (!response.ok) continue
        
        const data = await response.json()
        const location = service.parse(data)
        
        if (location.city && location.country) {
          const normalizedCity = normalizeCityName(location.city)
          const normalizedCountry = normalizeCountryName(location.country) || normalizeCountryName(location.countryCode)
          
          if (normalizedCity && normalizedCountry) {
            setUserCity(normalizedCity)
            setUserCountry(normalizedCountry)
            setSelectedCity(normalizedCity)
            setSelectedCountry(normalizedCountry)
            return { city: normalizedCity, country: normalizedCountry }
          }
        }
      } catch (error) {
        console.error(`Error with ${service.url}:`, error)
        continue
      }
    }
    
    return null
  }

  // Get city from coordinates using reverse geocoding - Try multiple services
  const getCityFromCoordinates = async (lat, lng) => {
    const services = [
      {
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        parse: (data) => ({
          city: data.city || data.locality,
          country: data.countryName,
          countryCode: data.countryCode
        })
      },
      {
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        parse: (data) => {
          const address = data.address || {}
          return {
            city: address.city || address.town || address.village || address.municipality,
            country: address.country,
            countryCode: address.country_code?.toUpperCase()
          }
        }
      },
      {
        url: `https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`,
        parse: (data) => {
          const address = data.address || {}
          return {
            city: address.city || address.town || address.village,
            country: address.country,
            countryCode: address.country_code?.toUpperCase()
          }
        }
      }
    ]

    for (const service of services) {
      try {
        const response = await fetch(service.url)
        if (!response.ok) continue
        
        const data = await response.json()
        const location = service.parse(data)
        
        if (location.city && location.country) {
          const normalizedCity = normalizeCityName(location.city)
          const normalizedCountry = normalizeCountryName(location.country) || normalizeCountryName(location.countryCode)
          
          if (normalizedCity && normalizedCountry) {
            setUserCity(normalizedCity)
            setUserCountry(normalizedCountry)
            setSelectedCity(normalizedCity)
            setSelectedCountry(normalizedCountry)
            return { city: normalizedCity, country: normalizedCountry }
          }
        }
      } catch (error) {
        console.error(`Error with reverse geocoding service:`, error)
        continue
      }
    }
    
    return null
  }

  // Request location permission and get GPS coordinates
  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return null
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setLocationPermission('granted')
          
          // Get city from coordinates
          const locationData = await getCityFromCoordinates(latitude, longitude)
          resolve(locationData)
        },
        async (error) => {
          console.error('Geolocation error:', error)
          setLocationPermission('denied')
          
          // Fallback to IP-based location
          const ipLocation = await getLocationFromIP()
          resolve(ipLocation)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  // Initialize location on mount
  useEffect(() => {
    const initializeLocation = async () => {
      setLoading(true)
      setError(null)
      
      // Try to get location from localStorage first
      const savedCity = localStorage.getItem('nestfinder_selected_city')
      const savedCountry = localStorage.getItem('nestfinder_selected_country')
      
      if (savedCity && savedCountry) {
        // Validate saved city is in our list
        const isValidCity = Object.values(citiesByCountry).some(cities => 
          cities.includes(savedCity)
        )
        
        if (isValidCity && Object.keys(citiesByCountry).includes(savedCountry)) {
          setSelectedCity(savedCity)
          setSelectedCountry(savedCountry)
          setUserCity(savedCity)
          setUserCountry(savedCountry)
          setLoading(false)
          return
        }
      }

      // Try GPS first, then IP fallback
      let locationData = await requestLocationPermission()
      
      // If GPS failed, try IP-based location
      if (!locationData) {
        locationData = await getLocationFromIP()
      }
      
      // If still no location, set default
      if (!locationData) {
        setError('Could not detect location. Please select a city manually.')
        // Set default to first city of first country
        const defaultCountry = Object.keys(citiesByCountry)[0]
        const defaultCity = citiesByCountry[defaultCountry][0]
        setSelectedCity(defaultCity)
        setSelectedCountry(defaultCountry)
      }
      
      setLoading(false)
    }

    initializeLocation()
  }, [])

  // Save selected city/country to localStorage
  useEffect(() => {
    if (selectedCity && selectedCountry) {
      localStorage.setItem('nestfinder_selected_city', selectedCity)
      localStorage.setItem('nestfinder_selected_country', selectedCountry)
    }
  }, [selectedCity, selectedCountry])

  const updateLocation = (city, country) => {
    setSelectedCity(city)
    setSelectedCountry(country)
  }

  const value = {
    userLocation,
    userCity,
    userCountry,
    selectedCity,
    selectedCountry,
    locationPermission,
    loading,
    error,
    updateLocation,
    requestLocationPermission,
    citiesByCountry
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

