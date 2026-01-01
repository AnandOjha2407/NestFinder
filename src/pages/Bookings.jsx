import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import { bookingService } from '../services/bookingService'
import './Bookings.css'

const Bookings = () => {
  const { user, isAuthenticated } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchBookings()
  }, [isAuthenticated, navigate])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await bookingService.getAllBookings()
      setBookings(data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId)
        fetchBookings()
      } catch (error) {
        console.error('Error cancelling booking:', error)
        alert('Failed to cancel booking')
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmed':
        return 'status-confirmed'
      case 'cancelled':
        return 'status-cancelled'
      default:
        return 'status-pending'
    }
  }

  if (loading) {
    return (
      <div className="bookings-page">
        <Navbar />
        <div className="bookings-container">
          <div className="loading">
            <div className="loader"></div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bookings-page">
      <Navbar />
      <div className="bookings-container">
        <div className="bookings-header">
          <h1>My Bookings</h1>
          <p>View and manage your property bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-bookings">
            <i className='bx bx-calendar-x'></i>
            <h2>No bookings yet</h2>
            <p>Start exploring properties and make your first booking</p>
            <Link to="/search" className="explore-btn" style={{ '--theme-gradient': theme.gradient }}>
              Explore Properties
            </Link>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                className="booking-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {booking.propertyImage && (
                  <div className="booking-image">
                    <img src={booking.propertyImage} alt={booking.propertyName} />
                  </div>
                )}
                <div className="booking-content">
                  <div className="booking-header">
                    <div>
                      <h3>{booking.propertyName}</h3>
                      <p className="booking-location">
                        <i className='bx bx-map'></i> {booking.propertyLocation}
                      </p>
                      <span className={`booking-type ${booking.propertyType.toLowerCase()}`}>
                        {booking.propertyType}
                      </span>
                    </div>
                    <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <div className="detail-item">
                      <i className='bx bx-calendar'></i>
                      <div>
                        <span className="detail-label">Check-in:</span>
                        <span className="detail-value">{formatDate(booking.checkIn)}</span>
                      </div>
                    </div>
                    <div className="detail-item">
                      <i className='bx bx-calendar-check'></i>
                      <div>
                        <span className="detail-label">Check-out:</span>
                        <span className="detail-value">{formatDate(booking.checkOut)}</span>
                      </div>
                    </div>
                    {booking.propertyType === 'Hotel' && (
                      <div className="detail-item">
                        <i className='bx bx-user'></i>
                        <div>
                          <span className="detail-label">Guests:</span>
                          <span className="detail-value">{booking.guests}</span>
                        </div>
                      </div>
                    )}
                    <div className="detail-item">
                      <i className='bx bx-rupee'></i>
                      <div>
                        <span className="detail-label">Total Amount:</span>
                        <span className="detail-value price">₹{booking.totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="booking-footer">
                    <div className="booking-id">
                      Booking ID: <span>{booking.id}</span>
                    </div>
                    <div className="booking-actions">
                      <Link
                        to={`/property/${booking.propertyId}`}
                        className="view-property-btn"
                      >
                        View Property
                      </Link>
                      {booking.status === 'confirmed' && (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Bookings

