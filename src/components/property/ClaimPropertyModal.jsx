import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import './ClaimPropertyModal.css'

const ClaimPropertyModal = ({ property, isOpen, onClose, onClaim }) => {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    rent: property?.price?.replace(/[^\d]/g, '') || '',
    contact: '',
    description: '',
    bedrooms: property?.bedrooms || '',
    bathrooms: property?.bathrooms || '',
    furnished: property?.furnished || false,
    available: true,
    facilities: []
  })
  const [facilityInput, setFacilityInput] = useState('')
  const [imageUrls, setImageUrls] = useState([])
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const commonFacilities = [
    'WiFi', 'AC', 'Parking', 'Security', 'Laundry', 'Kitchen', 
    'Geyser', 'Power Backup', 'Furnished', 'Meals', 'Housekeeping'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!formData.contact) {
      setError('Contact information is required')
      return
    }

    setLoading(true)
    try {
      const ownerData = {
        ...formData,
        rent: formData.rent ? `₹${parseInt(formData.rent).toLocaleString('en-IN')}/month` : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        images: imageUrls
      }
      
      await onClaim(ownerData)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to claim property')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFacility = () => {
    if (facilityInput.trim() && !formData.facilities.includes(facilityInput.trim())) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facilityInput.trim()]
      })
      setFacilityInput('')
    }
  }

  const handleRemoveFacility = (facility) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter(f => f !== facility)
    })
  }

  const handleAddCommonFacility = (facility) => {
    if (!formData.facilities.includes(facility)) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, facility]
      })
    }
  }

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim() && !imageUrls.includes(imageUrlInput.trim())) {
      setImageUrls([...imageUrls, imageUrlInput.trim()])
      setImageUrlInput('')
    }
  }

  const handleRemoveImageUrl = (url) => {
    setImageUrls(imageUrls.filter(u => u !== url))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="claim-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="claim-modal-content"
          style={{ '--theme-primary': theme.primary, '--theme-gradient': theme.gradient }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="claim-modal-header">
            <h2>Claim This Property</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <form onSubmit={handleSubmit} className="claim-form">
            <div className="form-group">
              <label>Property Name</label>
              <input type="text" value={property?.name || ''} disabled />
            </div>

            <div className="form-group">
              <label>Contact Information *</label>
              <input
                type="text"
                placeholder="Phone number or email"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Monthly Rent (₹)</label>
                <input
                  type="number"
                  placeholder="e.g., 15000"
                  value={formData.rent}
                  onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Bedrooms</label>
                <input
                  type="number"
                  placeholder="e.g., 2"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Bathrooms</label>
                <input
                  type="number"
                  placeholder="e.g., 1"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe your property..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>Facilities</label>
              <div className="facilities-input">
                <input
                  type="text"
                  placeholder="Add facility (e.g., WiFi, AC)"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFacility())}
                />
                <button type="button" onClick={handleAddFacility}>Add</button>
              </div>
              <div className="common-facilities">
                {commonFacilities.map(facility => (
                  <button
                    key={facility}
                    type="button"
                    className={`facility-tag ${formData.facilities.includes(facility) ? 'active' : ''}`}
                    onClick={() => handleAddCommonFacility(facility)}
                  >
                    {facility}
                  </button>
                ))}
              </div>
              <div className="selected-facilities">
                {formData.facilities.map(facility => (
                  <span key={facility} className="facility-chip">
                    {facility}
                    <button type="button" onClick={() => handleRemoveFacility(facility)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Image URLs (paste image links)</label>
              <div className="image-urls-input">
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                />
                <button type="button" onClick={handleAddImageUrl}>Add</button>
              </div>
              <div className="image-urls-list">
                {imageUrls.map((url, index) => (
                  <div key={index} className="image-url-item">
                    <span>{url}</span>
                    <button type="button" onClick={() => handleRemoveImageUrl(url)}>×</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.furnished}
                  onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                />
                Furnished
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                />
                Available
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Claiming...' : 'Claim Property'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ClaimPropertyModal

