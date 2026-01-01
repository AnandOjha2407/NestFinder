import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useLocationContext } from '../context/LocationContext'
import Navbar from '../components/common/Navbar'
import PropertyCard from '../components/property/PropertyCard'
import Footer from '../components/common/Footer'
import ShowMoreButton from '../components/common/ShowMoreButton'
import { propertyService } from '../services/propertyService'
import './Home.css'

const Home = () => {
  const [allProperties, setAllProperties] = useState([])
  const [displayedProperties, setDisplayedProperties] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { t } = useLanguage()
  const { selectedCity, selectedCountry } = useLocationContext()

  useEffect(() => {
    fetchProperties()
  }, [selectedCity, selectedCountry])

  useEffect(() => {
    // Update displayed properties when currentPage changes
    const endIndex = currentPage * itemsPerPage
    setDisplayedProperties(allProperties.slice(0, endIndex))
  }, [currentPage, allProperties])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      
      // Fetch all types and combine them for home page
      const types = ['Guest', 'Rental', 'Hotel']
      const allPropertiesData = []
      
      if (selectedCity && selectedCountry) {
        // Fetch from each type
        for (const type of types) {
          try {
            const filters = { type, city: selectedCity, country: selectedCountry }
            const data = await propertyService.getAll(filters)
            if (data && data.length > 0) {
              allPropertiesData.push(...data.slice(0, 4)) // Get 4 from each type
            }
          } catch (error) {
            console.error(`Error fetching ${type}:`, error)
          }
        }
      }
      
      // Use real-time data only (no filtering needed - backend returns real data)
      // Shuffle and limit to 12 for home page
      const shuffled = allPropertiesData.sort(() => Math.random() - 0.5)
      const limited = shuffled.slice(0, 12)
      
      setAllProperties(limited)
      setDisplayedProperties(limited.slice(0, itemsPerPage))
      setCurrentPage(1)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShowMore = async () => {
    setLoadingMore(true)
    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))
    setCurrentPage(prev => prev + 1)
    setLoadingMore(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const hasMore = displayedProperties.length < allProperties.length

  return (
    <div className="home-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section" style={{ '--theme-gradient': theme.gradient }}>
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-title"
          >
            {t.home.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hero-subtitle"
          >
            {t.home.subtitle}
          </motion.p>
          <motion.form
            onSubmit={handleSearch}
            className="hero-search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <i className='bx bx-search-alt-2 search-icon'></i>
            <input
              type="search"
              placeholder={t.home.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <motion.button
              type="submit"
              className="search-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.home.search}
            </motion.button>
          </motion.form>
          <motion.div
            className="category-buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.button
              onClick={() => navigate('/guest')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.home.guestHouses}
            </motion.button>
            <motion.button
              onClick={() => navigate('/hotel')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.home.hotels}
            </motion.button>
            <motion.button
              onClick={() => navigate('/rental')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.home.rentals}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="properties-section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>{t.home.featuredProperties}</h2>
            <p>{t.home.handpicked}</p>
          </motion.div>
          {loading ? (
            <div className="loading">
              <div className="loader"></div>
            </div>
          ) : displayedProperties.length > 0 ? (
            <>
              <div className="properties-grid">
                {displayedProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
              <ShowMoreButton
                onClick={handleShowMore}
                loading={loadingMore}
                hasMore={hasMore}
              />
            </>
          ) : (
            <div className="no-properties">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="empty-state"
              >
                <i className='bx bx-home-smile'></i>
                <h3>No properties found</h3>
                <p>Select a city to see available properties, or try browsing our categories above.</p>
                <motion.button
                  onClick={() => navigate('/guest')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ '--theme-gradient': theme.gradient }}
                >
                  Browse Guest Houses
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" style={{ '--theme-gradient': theme.gradient }}>
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>{t.home.readyToFind}</h2>
            <p>{t.home.startSearching}</p>
            <motion.button
              className="cta-btn"
              onClick={() => navigate('/search')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.home.exploreProperties}
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home
