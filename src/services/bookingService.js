import { staticDataService } from './staticDataService'

const BOOKINGS_KEY = 'nestfinder_bookings'

// Generate booking ID
const generateBookingId = () => {
  return `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Calculate total price
const calculateTotalPrice = (property, checkIn, checkOut) => {
  if (!property.price) return 0
  
  const priceMatch = property.price.match(/[\d,]+/)
  if (!priceMatch) return 0
  
  const pricePerUnit = parseInt(priceMatch[0].replace(/,/g, ''))
  
  // For hotels, calculate per night
  if (property.type === 'Hotel') {
    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
    return pricePerUnit * nights
  }
  
  // For rentals and guest houses, return monthly price (can be prorated later)
  return pricePerUnit
}

export const bookingService = {
  // Create a new booking
  createBooking: async (propertyId, bookingData) => {
    try {
      const property = await staticDataService.getById(propertyId)
      if (!property) {
        throw new Error('Property not found')
      }
      
      const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]')
      
      const booking = {
        id: generateBookingId(),
        propertyId,
        propertyName: property.name,
        propertyType: property.type,
        propertyLocation: property.location,
        propertyImage: property.images?.[0] || null,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests || 1,
        totalPrice: calculateTotalPrice(property, bookingData.checkIn, bookingData.checkOut),
        status: 'confirmed',
        bookedAt: new Date().toISOString(),
        contactName: bookingData.contactName || '',
        contactEmail: bookingData.contactEmail || '',
        contactPhone: bookingData.contactPhone || ''
      }
      
      bookings.push(booking)
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
      
      return booking
    } catch (error) {
      console.error('Error creating booking:', error)
      throw error
    }
  },
  
  // Get all bookings
  getAllBookings: async () => {
    try {
      const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]')
      // Sort by booking date (newest first)
      return bookings.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return []
    }
  },
  
  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]')
      return bookings.find(b => b.id === bookingId) || null
    } catch (error) {
      console.error('Error fetching booking:', error)
      return null
    }
  },
  
  // Cancel a booking
  cancelBooking: async (bookingId) => {
    try {
      const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]')
      const updated = bookings.map(b => 
        b.id === bookingId ? { ...b, status: 'cancelled' } : b
      )
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated))
      return { success: true }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw error
    }
  },
  
  // Delete a booking
  deleteBooking: async (bookingId) => {
    try {
      const bookings = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]')
      const updated = bookings.filter(b => b.id !== bookingId)
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated))
      return { success: true }
    } catch (error) {
      console.error('Error deleting booking:', error)
      throw error
    }
  }
}

