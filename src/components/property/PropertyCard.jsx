import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { propertyService } from '../../services/propertyService'
import './PropertyCard.css'

const PropertyCard = ({ property, index = 0 }) => {
  const { isAuthenticated } = useAuth()
  const { theme } = useTheme()
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showCarousel, setShowCarousel] = useState(false)

  // Get images from property data only (no fallbacks)
  const propertyImages = property?.images && property.images.length > 0 
    ? property.images 
    : (property?.image ? [property.image] : [])
  
  const hasMultipleImages = propertyImages.length > 1
  const currentImage = propertyImages[currentImageIndex] || propertyImages[0]
  const hasImages = propertyImages.length > 0

  const handleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      alert('Please login to add favorites')
      return
    }

    setFavoriteLoading(true)
    try {
      if (isFavorite) {
        await propertyService.removeFavorite(property.id)
        setIsFavorite(false)
      } else {
        await propertyService.addFavorite(property.id)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ y: -12, scale: 1.02 }}
      className="property-card"
      style={{ '--theme-gradient': theme.gradient, '--theme-primary': theme.primary }}
    >
      <Link to={`/property/${property.id}`} className="card-link">
        <div className="card-image-container">
          {hasImages ? (
            <>
              {!imageLoaded && (
                <div className="image-skeleton">
                  <div className="skeleton-shimmer"></div>
                </div>
              )}
              <motion.img 
                src={currentImage} 
                alt={property.name} 
                className="card-image"
                onLoad={() => setImageLoaded(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                key={currentImageIndex}
              />
            </>
          ) : (
            <div className="no-image-placeholder">
              <i className='bx bx-image'></i>
              <span>Image not available</span>
            </div>
          )}
          
          {/* Image Carousel Controls */}
          {hasImages && hasMultipleImages && (
            <div className="carousel-controls">
              <motion.button
                className="carousel-btn prev"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length)
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className='bx bx-chevron-left'></i>
              </motion.button>
              <motion.button
                className="carousel-btn next"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length)
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <i className='bx bx-chevron-right'></i>
              </motion.button>
              <div className="carousel-indicators">
                {propertyImages.map((_, idx) => (
                  <motion.button
                    key={idx}
                    className={`indicator ${idx === currentImageIndex ? 'active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImageIndex(idx)
                    }}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
              <div className="image-count">
                {currentImageIndex + 1} / {propertyImages.length}
              </div>
            </div>
          )}
          
          <div className="card-overlay">
            <motion.span 
              className="property-type"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {property.type}
            </motion.span>
            {isAuthenticated && (
              <motion.button
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleFavorite}
                disabled={favoriteLoading}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <motion.i 
                  className={`bx ${isFavorite ? 'bxs-heart' : 'bx-heart'}`}
                  animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 0.3 }}
                ></motion.i>
              </motion.button>
            )}
          </div>
          <motion.div 
            className="card-hover-overlay"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <motion.button
              className="quick-view-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className='bx bx-search-alt-2'></i>
              Quick View
            </motion.button>
          </motion.div>
        </div>
        <div className="card-content">
          <motion.h3 
            className="card-title"
            whileHover={{ color: theme.primary }}
          >
            {property.name}
          </motion.h3>
          <motion.p 
            className="card-location"
            whileHover={{ x: 5 }}
          >
            <i className='bx bx-map'></i>
            {property.location}
          </motion.p>
          <div className="card-features">
            {property.bedrooms && (
              <div className="feature-tag">
                <i className='bx bx-bed'></i>
                <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="feature-tag">
                <i className='bx bx-bath'></i>
                <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
              </div>
            )}
            {property.area && (
              <div className="feature-tag">
                <i className='bx bx-area'></i>
                <span>{property.area}</span>
              </div>
            )}
            {property.rating && (
              <div className="feature-tag">
                <i className='bx bx-star'></i>
                <span>{property.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="card-footer">
            <motion.span 
              className="card-price"
              whileHover={{ scale: 1.05 }}
            >
              {property.price || property.owner_provided_data?.rent || 'Price not available'}
            </motion.span>
            <motion.button 
              className="view-btn"
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details
              <motion.i 
                className='bx bx-right-arrow-alt'
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              ></motion.i>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default PropertyCard
