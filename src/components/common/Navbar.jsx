import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import CityPicker from './CityPicker'
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()
  const { theme } = useTheme()
  const { t } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navLinks = [
    { path: '/', label: t.nav.home, icon: 'bx-home' },
    { path: '/guest', label: t.nav.guest, icon: 'bx-building' },
    { path: '/hotel', label: t.nav.hotel, icon: 'bx-hotel' },
    { path: '/rental', label: t.nav.rental, icon: 'bx-home-heart' },
    { path: '/search', label: t.nav.search, icon: 'bx-search' }
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <motion.nav 
      className="navbar"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ '--theme-gradient': theme.gradient }}
    >
      <div className="nav-container">
        <motion.div
          className="logo-section"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="/" className="logo">
            <motion.div 
              className="logo-icon"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <img src="/assets/logo.png" alt="NestFinder" className="logo-img" />
            </motion.div>
            <span className="logo-text">NestFinder</span>
          </Link>
        </motion.div>
        
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link 
                to={link.path} 
                className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
              >
                <i className={`bx ${link.icon}`}></i>
                <span>{link.label}</span>
                {isActive(link.path) && (
                  <motion.div
                    className="active-indicator"
                    layoutId="activeIndicator"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* City Picker */}
        <div className="nav-city-picker">
          <CityPicker />
        </div>

        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <motion.div className="user-section" whileHover={{ scale: 1.05 }}>
                <Link to="/favorites" className="favorites-btn">
                  <i className='bx bx-heart'></i>
                  <span className="badge">{t.nav.favorites}</span>
                </Link>
              </motion.div>
              
              <div className="user-menu-wrapper">
                <motion.button
                  className="user-menu-trigger"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=${theme.primary.replace('#', '')}&color=fff&size=128`}
                    alt={user?.name}
                    className="user-avatar"
                  />
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
                  <i className={`bx ${userMenuOpen ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="user-dropdown"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="user-info">
                        <p className="user-full-name">{user?.name}</p>
                        <p className="user-email">{user?.email}</p>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link 
                        to="/profile" 
                        className="dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <i className='bx bx-user'></i>
                        <span>{t.nav.profile}</span>
                      </Link>
                      <Link 
                        to="/favorites" 
                        className="dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <i className='bx bx-heart'></i>
                        <span>{t.nav.favorites}</span>
                      </Link>
                      <Link 
                        to="/bookings" 
                        className="dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <i className='bx bx-calendar-check'></i>
                        <span>{t.nav.bookings}</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <Link 
                        to="/settings" 
                        className="dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <i className='bx bx-cog'></i>
                        <span>{t.nav.settings}</span>
                      </Link>
                      <Link 
                        to="/help" 
                        className="dropdown-item"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <i className='bx bx-help-circle'></i>
                        <span>{t.nav.help}</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item logout-item">
                        <i className='bx bx-log-out'></i>
                        <span>{t.nav.logout}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <motion.button
                className="btn-login"
                onClick={() => navigate('/login')}
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.nav.login}
              </motion.button>
              <motion.button
                className="btn-signup"
                onClick={() => navigate('/signup')}
                whileHover={{ scale: 1.05, x: 2 }}
                whileTap={{ scale: 0.95 }}
                style={{ '--theme-gradient': theme.gradient }}
              >
                {t.nav.signup}
                <i className='bx bx-right-arrow-alt'></i>
              </motion.button>
            </>
          )}

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`bx ${mobileMenuOpen ? 'bx-x' : 'bx-menu'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`mobile-link ${isActive(link.path) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className={`bx ${link.icon}`}></i>
                <span>{link.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
