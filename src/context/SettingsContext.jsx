import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext(null)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false
    },
    preferences: {
      language: 'en',
      theme: 'dark'
    },
    account: {
      twoFactor: false,
      loginAlerts: true
    }
  })

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('nestfinder_settings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error loading settings:', error)
      }
    }
  }, [])

  const updateSettings = (category, key, value) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }
      // Save to localStorage
      localStorage.setItem('nestfinder_settings', JSON.stringify(newSettings))
      return newSettings
    })
  }

  const resetSettings = () => {
    const defaultSettings = {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false
      },
      preferences: {
        language: 'en',
        theme: 'dark'
      },
      account: {
        twoFactor: false,
        loginAlerts: true
      }
    }
    setSettings(defaultSettings)
    localStorage.setItem('nestfinder_settings', JSON.stringify(defaultSettings))
  }

  const value = {
    settings,
    updateSettings,
    resetSettings
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

