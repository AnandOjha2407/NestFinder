// Simulate API delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Load properties data dynamically from multiple files
const loadProperties = async () => {
  try {
    // Load Indian properties
    const indiaResponse = await fetch('/data/properties.json')
    if (!indiaResponse.ok) throw new Error('Failed to load Indian properties')
    const indiaData = await indiaResponse.json()
    
    // Load Japan properties
    let japanData = []
    try {
      const japanResponse = await fetch('/data/properties-japan.json')
      if (japanResponse.ok) {
        japanData = await japanResponse.json()
      }
    } catch (err) {
      console.warn('Japan properties file not found, continuing without it')
    }
    
    // Merge both datasets
    return [...indiaData, ...japanData]
  } catch (error) {
    console.error('Error loading properties:', error)
    return []
  }
}

export const staticDataService = {
  // Get all properties with filtering
  getAll: async (filters = {}) => {
    await delay()
    const propertiesData = await loadProperties()
    
    let filtered = [...propertiesData]
    
    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type)
    }
    
    // Filter by city
    if (filters.city) {
      filtered = filtered.filter(p => 
        p.city.toLowerCase().includes(filters.city.toLowerCase())
      )
    }
    
    // Filter by country
    if (filters.country) {
      filtered = filtered.filter(p => 
        p.country.toLowerCase().includes(filters.country.toLowerCase())
      )
    }
    
    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }
    
    // Search query (name, location)
    if (filters.query) {
      const query = filters.query.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.city.toLowerCase().includes(query)
      )
    }
    
    // Filter by price range
    if (filters.minPrice || filters.maxPrice) {
      filtered = filtered.filter(p => {
        const priceStr = p.price || ''
        const priceMatch = priceStr.match(/[\d,]+/)
        if (!priceMatch) return false
        
        const price = parseInt(priceMatch[0].replace(/,/g, ''))
        if (filters.minPrice && price < parseInt(filters.minPrice)) return false
        if (filters.maxPrice && price > parseInt(filters.maxPrice)) return false
        return true
      })
    }
    
    return filtered
  },
  
  // Get property by ID
  getById: async (id) => {
    await delay()
    const propertiesData = await loadProperties()
    const property = propertiesData.find(p => p.id === id)
    if (!property) {
      throw new Error('Property not found')
    }
    return property
  },
  
  // Search properties
  search: async (query) => {
    await delay()
    const propertiesData = await loadProperties()
    const queryLower = query.toLowerCase()
    return propertiesData.filter(p => 
      p.name.toLowerCase().includes(queryLower) ||
      p.location.toLowerCase().includes(queryLower) ||
      p.city.toLowerCase().includes(queryLower) ||
      p.description?.toLowerCase().includes(queryLower)
    )
  }
}

