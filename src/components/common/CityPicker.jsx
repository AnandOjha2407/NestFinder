import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocationContext, citiesByCountry } from '../../context/LocationContext'
import { useLanguage } from '../../context/LanguageContext'
import './CityPicker.css'

const CityPicker = () => {
  const { 
    selectedCity, 
    selectedCountry, 
    userCity, 
    userCountry,
    updateLocation,
    loading,
    error,
    requestLocationPermission
  } = useLocationContext()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCountryFilter, setSelectedCountryFilter] = useState(selectedCountry || 'India')
  const [refreshing, setRefreshing] = useState(false)

  const availableCountries = Object.keys(citiesByCountry)
  const filteredCities = citiesByCountry[selectedCountryFilter]?.filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const handleCitySelect = (city) => {
    updateLocation(city, selectedCountryFilter)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleCountryChange = (country) => {
    setSelectedCountryFilter(country)
    setSearchQuery('')
    // Auto-select first city of the country
    if (citiesByCountry[country]?.length > 0) {
      updateLocation(citiesByCountry[country][0], country)
    }
  }

  const handleRefreshLocation = async () => {
    setRefreshing(true)
    try {
      await requestLocationPermission()
    } catch (err) {
      console.error('Error refreshing location:', err)
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="city-picker-wrapper">
      <motion.button
        className="city-picker-button"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <i className='bx bx-map'></i>
        <span className="city-display">
          {loading ? (
            <span className="loading-text">Detecting location...</span>
          ) : selectedCity ? (
            <>
              <span className="city-name">{selectedCity}</span>
              <span className="country-name">{selectedCountry}</span>
            </>
          ) : (
            <span className="select-city">Select City</span>
          )}
        </span>
        <i className={`bx ${isOpen ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="city-picker-dropdown"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Country Selector */}
            <div className="country-selector">
              <label>Country:</label>
              <select
                value={selectedCountryFilter}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="country-select"
              >
                {availableCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div className="city-search">
              <i className='bx bx-search'></i>
              <input
                type="text"
                placeholder={`Search cities in ${selectedCountryFilter}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="city-search-input"
              />
            </div>

            {/* Location Refresh Button */}
            <div className="location-refresh-section">
              <button
                onClick={handleRefreshLocation}
                disabled={refreshing}
                className="refresh-location-btn"
              >
                <i className={`bx ${refreshing ? 'bx-loader-alt bx-spin' : 'bx-refresh'}`}></i>
                <span>{refreshing ? 'Detecting...' : 'Refresh Location'}</span>
              </button>
              {error && (
                <div className="location-error">
                  <i className='bx bx-error-circle'></i>
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Detected Location (if available) */}
            {userCity && userCountry && (
              <div className="detected-location">
                <i className='bx bx-current-location'></i>
                <span>Detected: {userCity}, {userCountry}</span>
                <button
                  onClick={() => handleCitySelect(userCity)}
                  className="use-detected-btn"
                >
                  Use This
                </button>
              </div>
            )}

            {/* City List */}
            <div className="city-list">
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <motion.button
                    key={city}
                    className={`city-item ${selectedCity === city ? 'active' : ''}`}
                    onClick={() => handleCitySelect(city)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <i className='bx bx-map-pin'></i>
                    <span>{city}</span>
                    {selectedCity === city && (
                      <i className='bx bx-check'></i>
                    )}
                  </motion.button>
                ))
              ) : (
                <div className="no-cities">
                  <i className='bx bx-search-alt'></i>
                  <p>No cities found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CityPicker

