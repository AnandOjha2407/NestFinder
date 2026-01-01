import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'
import { useLocationContext } from '../context/LocationContext'
import Navbar from '../components/common/Navbar'
import PropertyCard from '../components/property/PropertyCard'
import Footer from '../components/common/Footer'
import ShowMoreButton from '../components/common/ShowMoreButton'
import { propertyService } from '../services/propertyService'
import './Category.css'

const Guest = () => {
  const [allProperties, setAllProperties] = useState([])
  const [displayedProperties, setDisplayedProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const { theme } = useTheme()
  const { t, features } = useLanguage()
  const { selectedCity, selectedCountry } = useLocationContext()

  useEffect(() => {
    fetchProperties()
  }, [selectedCity, selectedCountry])

  useEffect(() => {
    const endIndex = currentPage * itemsPerPage
    setDisplayedProperties(allProperties.slice(0, endIndex))
  }, [currentPage, allProperties])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const filters = { type: 'Guest' }
      if (selectedCity) filters.city = selectedCity
      if (selectedCountry) filters.country = selectedCountry
      
      const data = await propertyService.getAll(filters)
      const finalData = data.length > 0 ? data : await propertyService.getAll(filters)
      setAllProperties(finalData)
      setDisplayedProperties(finalData.slice(0, itemsPerPage))
      setCurrentPage(1)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleShowMore = async () => {
    setLoadingMore(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setCurrentPage(prev => prev + 1)
    setLoadingMore(false)
  }

  const hasMore = displayedProperties.length < allProperties.length

  return (
    <div className="category-page">
      <div className="category-hero" style={{ '--theme-gradient': theme.gradient }}>
        <Navbar />
        <div className="hero-content">
          <h1>{t.guest.title}</h1>
          <p>{t.guest.subtitle}</p>
        </div>
      </div>
      <div className="container">
        {/* Introduction Section */}
        <motion.section
          className="intro-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="intro-content">
            <h2>{t.guest.whatIs}</h2>
            <p>{t.guest.description}</p>
            
            <div className="features-section">
              <h3>{t.guest.keyFeatures}</h3>
              <div className="features-grid">
                {features.guest.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <i className='bx bx-check-circle'></i>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <div className="properties-section">
          {loading ? (
            <div className="loading">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <h2>{t.guest.available} ({allProperties.length})</h2>
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
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Guest
