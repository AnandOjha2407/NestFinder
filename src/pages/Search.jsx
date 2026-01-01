import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/common/Navbar'
import PropertyCard from '../components/property/PropertyCard'
import Footer from '../components/common/Footer'
import ShowMoreButton from '../components/common/ShowMoreButton'
import { propertyService } from '../services/propertyService'
import './Search.css'

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [allProperties, setAllProperties] = useState([])
  const [displayedProperties, setDisplayedProperties] = useState([])
  const [searchQuery, setSearchQuery] = useState(query)
  const [filters, setFilters] = useState({
    type: '',
    minPrice: '',
    maxPrice: ''
  })
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const { theme } = useTheme()

  useEffect(() => {
    if (query) {
      searchProperties(query)
    } else {
      fetchAllProperties()
    }
  }, [query])

  useEffect(() => {
    const endIndex = currentPage * itemsPerPage
    setDisplayedProperties(allProperties.slice(0, endIndex))
  }, [currentPage, allProperties])

  const fetchAllProperties = async () => {
    setLoading(true)
    try {
      const data = await propertyService.getAll()
      setAllProperties(data)
      setDisplayedProperties(data.slice(0, itemsPerPage))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const searchProperties = async (searchTerm) => {
    setLoading(true)
    setCurrentPage(1)
    try {
      const data = await propertyService.search(searchTerm)
      setAllProperties(data)
      setDisplayedProperties(data.slice(0, itemsPerPage))
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    searchProperties(searchQuery)
  }

  const handleFilter = async () => {
    setLoading(true)
    setCurrentPage(1)
    try {
      const data = await propertyService.getAll(filters)
      setAllProperties(data)
      setDisplayedProperties(data.slice(0, itemsPerPage))
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
    <div className="search-page">
      <Navbar />
      <div className="search-container">
        <motion.div
          className="search-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ '--theme-primary': theme.primary }}
        >
          <h1>Search Properties</h1>
          <form onSubmit={handleSearch} className="search-form">
            <i className='bx bx-search-alt-2 search-icon'></i>
            <input
              type="text"
              placeholder="Search by location, name, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </motion.div>

        <div className="search-content">
          <div className="filters-sidebar">
            <h3>Filters</h3>
            <div className="filter-group">
              <label>Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="Flat">Flat</option>
                <option value="House">House</option>
                <option value="Hotel">Hotel</option>
                <option value="Guest">Guest</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Min Price</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
            </div>
            <div className="filter-group">
              <label>Max Price</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
              />
            </div>
            <button onClick={handleFilter} className="apply-filters">
              Apply Filters
            </button>
          </div>

          <div className="results-section">
            <div className="results-header">
              <h2>Found {allProperties.length} Properties</h2>
            </div>
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
              <div className="no-results">
                <i className='bx bx-search-alt-2'></i>
                <h3>No properties found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Search
