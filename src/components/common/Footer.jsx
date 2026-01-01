import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import './Footer.css'

const Footer = () => {
  const { theme } = useTheme()

  return (
    <footer className="footer" style={{ '--theme-primary': theme.primary }}>
      <div className="footer-container">
        <div className="footer-section">
          <h3>NestFinder</h3>
          <p>Your trusted platform for finding the perfect accommodation.</p>
          <div className="social-links">
            <a href="https://www.youtube.com/skyneon1/" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-youtube'></i>
            </a>
            <a href="https://x.com/skyneon1/" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-twitter'></i>
            </a>
            <a href="https://www.instagram.com/skyneon1/" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-instagram-alt'></i>
            </a>
            <a href="https://LinkedIn.com/skyneon1/" target="_blank" rel="noopener noreferrer">
              <i className='bx bxl-linkedin-square'></i>
            </a>
          </div>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/guest">Guest Houses</Link></li>
            <li><Link to="/hotel">Hotels</Link></li>
            <li><Link to="/rental">Rentals</Link></li>
            <li><Link to="/search">Search</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Help Center</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2024 NestFinder. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

