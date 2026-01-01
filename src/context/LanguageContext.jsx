import { createContext, useContext, useState, useEffect } from 'react'
import { useSettings } from './SettingsContext'
import { translations, featureTranslations } from '../utils/translations'

const LanguageContext = createContext(null)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const { settings } = useSettings()
  const getLanguage = () => {
    const lang = settings?.preferences?.language || 'en'
    // Ensure language is supported
    return translations[lang] ? lang : 'en'
  }
  
  const [currentLanguage, setCurrentLanguage] = useState(getLanguage())
  const [t, setT] = useState(translations[currentLanguage])
  const [features, setFeatures] = useState(featureTranslations[currentLanguage])

  useEffect(() => {
    // Update language when settings change
    const lang = getLanguage()
    if (translations[lang] && featureTranslations[lang]) {
      setCurrentLanguage(lang)
      setT(translations[lang])
      setFeatures(featureTranslations[lang])
      
      // Update HTML lang attribute
      document.documentElement.lang = lang
    }
  }, [settings?.preferences?.language])

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang)
    setT(translations[lang])
    setFeatures(featureTranslations[lang])
    document.documentElement.lang = lang
  }

  const value = {
    language: currentLanguage,
    t, // translations
    features, // feature translations
    changeLanguage
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

