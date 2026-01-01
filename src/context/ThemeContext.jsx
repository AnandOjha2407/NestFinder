import { createContext, useContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSettings } from './SettingsContext'
import { getTheme } from '../utils/themes'

const ThemeContext = createContext(null)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const location = useLocation()
  const { settings } = useSettings()
  const [currentTheme, setCurrentTheme] = useState(getTheme('home'))
  const [colorMode, setColorMode] = useState(settings?.preferences?.theme || 'dark')

  // Initialize theme on mount
  useEffect(() => {
    const mode = settings?.preferences?.theme || 'dark'
    const root = document.documentElement
    if (mode === 'light') {
      root.classList.remove('dark-mode')
      root.classList.add('light-mode')
    } else {
      root.classList.remove('light-mode')
      root.classList.add('dark-mode')
    }
    setColorMode(mode)
  }, [])

  useEffect(() => {
    // Update color mode when settings change
    const mode = settings?.preferences?.theme || 'dark'
    setColorMode(mode)
    
    // Apply dark/light mode to document
    const root = document.documentElement
    if (mode === 'light') {
      root.classList.remove('dark-mode')
      root.classList.add('light-mode')
    } else {
      root.classList.remove('light-mode')
      root.classList.add('dark-mode')
    }
  }, [settings?.preferences?.theme])

  useEffect(() => {
    // Determine theme based on current route
    const path = location.pathname
    let themeName = 'home'

    if (path.startsWith('/guest')) themeName = 'guest'
    else if (path.startsWith('/hotel')) themeName = 'hotel'
    else if (path.startsWith('/rental')) themeName = 'rental'
    else if (path.startsWith('/login') || path.startsWith('/signup')) themeName = 'login'
    else if (path.startsWith('/search')) themeName = 'search'
    else if (path.startsWith('/property')) themeName = 'property'
    else themeName = 'home'

    const theme = getTheme(themeName)
    setCurrentTheme(theme)

    // Apply theme to CSS variables with smooth transition
    const root = document.documentElement
    root.style.transition = 'all 0.5s ease'
    root.style.setProperty('--theme-primary', theme.primary)
    root.style.setProperty('--theme-primary-dark', theme.primaryDark)
    root.style.setProperty('--theme-primary-light', theme.primaryLight)
    root.style.setProperty('--theme-secondary', theme.secondary)
    root.style.setProperty('--theme-accent', theme.accent)
    root.style.setProperty('--theme-gradient', theme.gradient)
    root.style.setProperty('--theme-gradient-hover', theme.gradientHover)
    root.style.setProperty('--theme-bg-gradient', theme.bgGradient)
  }, [location.pathname])

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, colorMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
