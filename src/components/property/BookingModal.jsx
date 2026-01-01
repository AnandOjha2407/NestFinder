import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { bookingService } from '../../services/bookingService'
import './BookingModal.css'

const BookingModal = ({ property, isOpen, onClose, onBookingSuccess }) => {
  const { isAuthenticated, user } = useAuth()
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
    contactName: user?.name || '',
    contactEmail: user?.email || '',
    contactPhone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      // Set default dates (check-in: tomorrow, check-out: day after)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const dayAfter = new Date()
      dayAfter.setDate(dayAfter.getDate() + 2)
      
      setFormData(prev => ({
        ...prev,
        checkIn: tomorrow.toISOString().split('T')[0],
        checkOut: dayAfter.toISOString().split('T')[0],
        contactName: user?.name || prev.contactName,
        contactEmail: user?.email || prev.contactEmail
      }))
      setError('')
    }
  }, [isOpen, user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }))
  }

  const calculateTotal = () => {
    if (!property.price || !formData.checkIn || !formData.checkOut) return 0
    
    const priceMatch = property.price.match(/[\d,]+/)
    if (!priceMatch) return 0
    
    const pricePerUnit = parseInt(priceMatch[0].replace(/,/g, ''))
    
    if (property.type === 'Hotel') {
      const checkInDate = new Date(formData.checkIn)
      const checkOutDate = new Date(formData.checkOut)
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
      return pricePerUnit * nights
    }
    
    return pricePerUnit
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      setError('Please login to make a booking')
      return
    }

    if (!formData.checkIn || !formData.checkOut) {
      setError('Please select check-in and check-out dates')
      return
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      setError('Check-out date must be after check-in date')
      return
    }

    if (!formData.contactName || !formData.contactEmail) {
      setError('Please fill in contact information')
      return
    }

    setLoading(true)
    setError('')

    try {
      const booking = await bookingService.createBooking(property.id, formData)
      if (onBookingSuccess) {
        onBookingSuccess(booking)
      }
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const totalPrice = calculateTotal()

  return (
    <AnimatePresence>
      <div className="booking-modal-overlay" onClick={onClose}>
        <motion.div
          className="booking-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="booking-modal-header">
            <h2>Book {property.name}</h2>
            <button className="close-btn" onClick={onClose}>
              <i className='bx bx-x'></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="booking-form">
            {property.type === 'Hotel' ? (
              <>
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleChange}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Number of Guests</label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label>Move-in Date</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Expected Stay Duration (Months)</label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={(e) => setFormData(prev => ({ ...prev, guests: parseInt(e.target.value) }))}
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>

            {error && (
              <div className="error-message">
                <i className='bx bx-error-circle'></i>
                {error}
              </div>
            )}

            <div className="booking-summary">
              <div className="summary-row">
                <span>Price per {property.type === 'Hotel' ? 'night' : 'month'}:</span>
                <span>{property.price}</span>
              </div>
              {property.type === 'Hotel' && formData.checkIn && formData.checkOut && (
                <div className="summary-row">
                  <span>Number of nights:</span>
                  <span>
                    {Math.ceil(
                      (new Date(formData.checkOut) - new Date(formData.checkIn)) / (1000 * 60 * 60 * 24)
                    )}
                  </span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default BookingModal

