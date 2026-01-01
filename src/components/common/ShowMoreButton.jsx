import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { useLanguage } from '../../context/LanguageContext'
import './ShowMoreButton.css'

const ShowMoreButton = ({ onClick, loading = false, hasMore = true }) => {
  const { theme } = useTheme()
  const { t } = useLanguage()

  if (!hasMore) return null

  return (
    <motion.div
      className="show-more-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.button
        className="show-more-btn"
        onClick={onClick}
        disabled={loading}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        style={{ '--theme-gradient': theme.gradient }}
      >
        {loading ? (
          <>
            <div className="loader-small"></div>
            <span>{t.common.loading}</span>
          </>
        ) : (
          <>
            <span>{t.common.showMore}</span>
            <i className='bx bx-chevron-down'></i>
          </>
        )}
      </motion.button>
    </motion.div>
  )
}

export default ShowMoreButton

