import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/common/Navbar'
import PropertyCard from '../components/property/PropertyCard'
import Footer from '../components/common/Footer'
import { propertyService } from '../services/propertyService'
import './Favorites.css'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const data = await propertyService.getFavorites()
      setFavorites(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="favorites-page">
      <Navbar />
      <div className="favorites-container">
        <div className="favorites-header">
          <h1>My Favorites</h1>
          <p>Properties you've saved for later</p>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loader"></div>
          </div>
        ) : favorites.length > 0 ? (
          <div className="favorites-grid">
            {favorites.map((property, index) => (
              <PropertyCard key={property.id} property={property} index={index} />
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <i className='bx bx-heart'></i>
            <h2>No favorites yet</h2>
            <p>Start exploring and save your favorite properties</p>
            <Link to="/search" className="explore-btn">
              Explore Properties
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Favorites

