import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import BookingModal from '../components/property/BookingModal'
import { propertyService } from '../services/propertyService'
import './PropertyDetail.css'

const PropertyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { isAuthenticated } = useAuth()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      const data = await propertyService.getById(id)
      setProperty(data)
    } catch (error) {
      console.error('Error:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleContact = () => {
    if (property?.contact) {
      if (property.contact.includes('@')) {
        window.location.href = `mailto:${property.contact}`
      } else {
        window.location.href = `tel:${property.contact}`
      }
    } else {
      alert('Contact information not available')
    }
  }

  const handleBookingSuccess = (booking) => {
    // Show success message and redirect to bookings page
    alert(`Booking confirmed! Booking ID: ${booking.id}`)
    navigate('/bookings')
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    )
  }

  if (!property) return null

  // Get images from property data only (no fallbacks)
  const images = property?.images && property.images.length > 0 
    ? property.images 
    : (property?.image ? [property.image] : [])

  return (
    <div className="property-detail-page">
      <Navbar />
      <div className="detail-container">
        <motion.button
          className="back-btn"
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className='bx bx-arrow-back'></i> Back
        </motion.button>

        <motion.div
          className="detail-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>{property.name}</h1>
          <div className="detail-meta">
            <span className="property-type-badge" style={{ '--theme-primary': theme.primary }}>
              {property.type}
            </span>
            <span className="property-location">
              <i className='bx bx-map'></i> {property.location}
            </span>
          </div>
        </motion.div>

        <div className="detail-content">
          <div className="detail-images">
            {images.length > 0 ? (
              <>
                <div className="main-image">
                  <img src={images[0]} alt={property.name} />
                </div>
                {images.length > 1 && (
                  <div className="thumbnail-images">
                    {images.slice(1).map((img, index) => (
                      <img key={index} src={img} alt={`${property.name} ${index + 2}`} className="thumbnail" />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-image-placeholder-large">
                <i className='bx bx-image'></i>
                <span>Images not available</span>
                <p>Owner can add images when claiming this property</p>
              </div>
            )}
          </div>

          <div className="detail-info">
            <div className="price-section">
              <h2>
                {property.price || property.owner_provided_data?.rent || 'Price not available'}
              </h2>
              <p>
                {property.price || property.owner_provided_data?.rent 
                  ? 'Monthly Rent' 
                  : 'Price information not available'}
                {property.is_claimed && property.owner_provided_data?.rent && (
                  <span className="price-source"> (owner provided)</span>
                )}
              </p>
            </div>

            <div className="features-section">
              <h3>Property Features</h3>
              <div className="features-grid">
                <div className="feature-item">
                  <i className='bx bx-home'></i>
                  <span>Type: {property.type}</span>
                </div>
                <div className="feature-item">
                  <i className='bx bx-map'></i>
                  <span>{property.location}</span>
                </div>
                {property.bedrooms && (
                  <div className="feature-item">
                    <i className='bx bx-bed'></i>
                    <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="feature-item">
                    <i className='bx bx-bath'></i>
                    <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
                  </div>
                )}
                {property.area && (
                  <div className="feature-item">
                    <i className='bx bx-area'></i>
                    <span>{property.area}</span>
                  </div>
                )}
                {property.furnished !== null && property.furnished !== undefined && (
                  <div className="feature-item">
                    <i className='bx bx-check-circle'></i>
                    <span>{property.furnished ? 'Furnished' : 'Unfurnished'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="description-section">
              <h3>Description</h3>
              <p>
                {property.description || property.owner_provided_data?.description || 
                  `This beautiful ${property.type.toLowerCase()} located in ${property.location} offers 
                  modern amenities and a comfortable living space. Perfect for those looking for 
                  quality accommodation in a prime location.`}
              </p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="amenities-section">
                <h3>Amenities</h3>
                <div className="amenities-list">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(property.mapLink || property.googleMapsLink) && (
              <div className="external-links-section">
                <h3>View on Maps</h3>
                <div className="external-links">
                  {property.mapLink && (
                    <a href={property.mapLink} target="_blank" rel="noopener noreferrer" className="map-link-btn">
                      <i className='bx bx-map'></i> OpenStreetMap
                    </a>
                  )}
                  {property.googleMapsLink && (
                    <a href={property.googleMapsLink} target="_blank" rel="noopener noreferrer" className="map-link-btn">
                      <i className='bx bx-map-alt'></i> Google Maps
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="action-buttons">
              {property.contact ? (
                <motion.button
                  className="contact-btn"
                  onClick={handleContact}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className='bx bx-phone'></i> Contact Owner
                </motion.button>
              ) : null}
              <motion.button
                className="query-btn"
                style={{ '--theme-primary': theme.primary }}
                onClick={(e) => {
                  e.preventDefault()
                  if (property.contact) {
                    handleContact()
                  } else {
                    alert('Contact information not available. Please use the booking form to send a query.')
                    setShowBookingModal(true)
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className='bx bx-message-rounded'></i> Send Query
              </motion.button>
              {property.price && property.price !== 'Price not available' && (
                <motion.button
                  className="book-btn"
                  style={{ '--theme-primary': theme.primary }}
                  onClick={() => setShowBookingModal(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className='bx bx-calendar-check'></i> Book Now
                </motion.button>
              )}
            </div>

            {property.latitude && property.longitude && (
              <div className="map-section">
                <h3>Location</h3>
                <div className="map-container">
                  <div className="map-link-container">
                    <a
                      href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-link-button"
                    >
                      <i className='bx bx-map'></i>
                      <span>View on Google Maps</span>
                      <i className='bx bx-link-external'></i>
                    </a>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${property.latitude}&mlon=${property.longitude}&zoom=15`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="map-link-button"
                    >
                      <i className='bx bx-map-alt'></i>
                      <span>View on OpenStreetMap</span>
                      <i className='bx bx-link-external'></i>
                    </a>
                  </div>
                  <p className="map-info">
                    <i className='bx bx-map'></i> {property.location}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      
      <BookingModal
        property={property}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  )
}

export default PropertyDetail

