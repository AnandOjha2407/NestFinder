import { staticDataService } from './staticDataService'

// Use static data service instead of API calls
export const propertyService = {
  // Get all properties
  getAll: async (filters = {}) => {
    try {
      return await staticDataService.getAll(filters)
    } catch (error) {
      console.error('Error fetching properties:', error)
      throw error
    }
  },

  // Get single property
  getById: async (id) => {
    try {
      return await staticDataService.getById(id)
    } catch (error) {
      console.error('Error fetching property:', error)
      throw error
    }
  },

  // Search properties
  search: async (query) => {
    try {
      return await staticDataService.search(query)
    } catch (error) {
      console.error('Error searching properties:', error)
      throw error
    }
  },

  // Get favorites (stored in localStorage)
  getFavorites: async () => {
    try {
      const favorites = JSON.parse(localStorage.getItem('nestfinder_favorites') || '[]')
      // Get full property objects for favorite IDs
      const properties = await staticDataService.getAll()
      return properties.filter(p => favorites.includes(p.id))
    } catch (error) {
      console.error('Error fetching favorites:', error)
      return []
    }
  },

  // Add to favorites
  addFavorite: async (propertyId) => {
    try {
      const favorites = JSON.parse(localStorage.getItem('nestfinder_favorites') || '[]')
      if (!favorites.includes(propertyId)) {
        favorites.push(propertyId)
        localStorage.setItem('nestfinder_favorites', JSON.stringify(favorites))
      }
      return { success: true }
    } catch (error) {
      console.error('Error adding favorite:', error)
      throw error
    }
  },

  // Remove from favorites
  removeFavorite: async (propertyId) => {
    try {
      const favorites = JSON.parse(localStorage.getItem('nestfinder_favorites') || '[]')
      const updated = favorites.filter(id => id !== propertyId)
      localStorage.setItem('nestfinder_favorites', JSON.stringify(updated))
      return { success: true }
    } catch (error) {
      console.error('Error removing favorite:', error)
      throw error
    }
  },

  // Claim property (stub - for future implementation)
  claimProperty: async (propertyId, ownerData) => {
    try {
      // Store claimed properties in localStorage
      const claimed = JSON.parse(localStorage.getItem('nestfinder_claimed') || '{}')
      claimed[propertyId] = {
        ...ownerData,
        claimedAt: new Date().toISOString()
      }
      localStorage.setItem('nestfinder_claimed', JSON.stringify(claimed))
      return { success: true, message: 'Property claimed successfully' }
    } catch (error) {
      console.error('Error claiming property:', error)
      throw error
    }
  },

  // Update claimed property (stub)
  updateProperty: async (propertyId, updates) => {
    try {
      const claimed = JSON.parse(localStorage.getItem('nestfinder_claimed') || '{}')
      if (claimed[propertyId]) {
        claimed[propertyId] = { ...claimed[propertyId], ...updates }
        localStorage.setItem('nestfinder_claimed', JSON.stringify(claimed))
      }
      return { success: true }
    } catch (error) {
      console.error('Error updating property:', error)
      throw error
    }
  },

  // Get owner's properties (stub)
  getMyProperties: async () => {
    try {
      const claimed = JSON.parse(localStorage.getItem('nestfinder_claimed') || '{}')
      const propertyIds = Object.keys(claimed)
      const properties = await staticDataService.getAll()
      return properties.filter(p => propertyIds.includes(p.id))
    } catch (error) {
      console.error('Error fetching owner properties:', error)
      return []
    }
  },

  // Submit user information (stub)
  submitUserInfo: async (propertyId, userData) => {
    try {
      const submissions = JSON.parse(localStorage.getItem('nestfinder_submissions') || '[]')
      submissions.push({
        propertyId,
        ...userData,
        submittedAt: new Date().toISOString(),
        approved: false
      })
      localStorage.setItem('nestfinder_submissions', JSON.stringify(submissions))
      return { success: true, message: 'Information submitted successfully' }
    } catch (error) {
      console.error('Error submitting user info:', error)
      throw error
    }
  }
}

