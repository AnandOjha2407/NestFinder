import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useSettings } from '../context/SettingsContext'
import { useLanguage } from '../context/LanguageContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import './Settings.css'

const Settings = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { settings, updateSettings, resetSettings } = useSettings()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('notifications')
  const [saved, setSaved] = useState(false)

  const handleToggle = (category, key) => {
    updateSettings(category, key, !settings[category][key])
    showSavedMessage()
  }

  const handleSelect = (category, key, value) => {
    updateSettings(category, key, value)
    showSavedMessage()
  }

  const showSavedMessage = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    if (window.confirm(t.settings.resetConfirm)) {
      resetSettings()
      showSavedMessage()
    }
  }

  const tabs = [
    { id: 'notifications', label: t.settings.tabs.notifications, icon: 'bx-bell' },
    { id: 'privacy', label: t.settings.tabs.privacy, icon: 'bx-lock' },
    { id: 'preferences', label: t.settings.tabs.preferences, icon: 'bx-cog' },
    { id: 'account', label: t.settings.tabs.account, icon: 'bx-user' }
  ]

  return (
    <div className="settings-page">
      <Navbar />
      <div className="settings-container">
        <motion.div
          className="settings-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>{t.settings.title}</h1>
          <p>{t.settings.subtitle}</p>
        </motion.div>

        {saved && (
          <motion.div
            className="save-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <i className='bx bx-check-circle'></i>
            {t.settings.saved}
          </motion.div>
        )}

        <div className="settings-content">
          <div className="settings-sidebar">
            <div className="tabs-list">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={activeTab === tab.id ? { '--theme-primary': theme.primary } : {}}
                >
                  <i className={`bx ${tab.icon}`}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <motion.button
              className="reset-btn"
              onClick={handleReset}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <i className='bx bx-reset'></i>
              {t.settings.resetButton}
            </motion.button>
          </div>

          <div className="settings-main">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="settings-section"
            >
              {activeTab === 'notifications' && (
                <NotificationSettings settings={settings} onToggle={handleToggle} />
              )}
              {activeTab === 'privacy' && (
                <PrivacySettings settings={settings} onToggle={handleToggle} onSelect={handleSelect} />
              )}
              {activeTab === 'preferences' && (
                <PreferenceSettings settings={settings} onSelect={handleSelect} />
              )}
              {activeTab === 'account' && (
                <AccountSettings settings={settings} onToggle={handleToggle} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

const NotificationSettings = ({ settings, onToggle }) => {
  const { t } = useLanguage()
  return (
    <>
      <h2>{t.settings.notifications.title}</h2>
      <p className="section-description">{t.settings.notifications.description}</p>
      
      <div className="settings-group">
        <div className="setting-item">
          <div className="setting-info">
            <h3>{t.settings.notifications.email.title}</h3>
            <p>{t.settings.notifications.email.description}</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={() => onToggle('notifications', 'email')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>{t.settings.notifications.push.title}</h3>
            <p>{t.settings.notifications.push.description}</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={() => onToggle('notifications', 'push')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>{t.settings.notifications.sms.title}</h3>
            <p>{t.settings.notifications.sms.description}</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.notifications.sms}
              onChange={() => onToggle('notifications', 'sms')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </>
  )
}

const PrivacySettings = ({ settings, onToggle, onSelect }) => {
  const { t } = useLanguage()
  return (
    <>
      <h2>{t.settings.privacy.title}</h2>
      <p className="section-description">{t.settings.privacy.description}</p>
      
      <div className="settings-group">
        <div className="setting-item">
          <div className="setting-info">
            <h3>{t.settings.privacy.profileVisibility.title}</h3>
            <p>{t.settings.privacy.profileVisibility.description}</p>
          </div>
          <select
            className="setting-select"
            value={settings.privacy.profileVisibility}
            onChange={(e) => onSelect('privacy', 'profileVisibility', e.target.value)}
          >
            <option value="public">{t.settings.privacy.profileVisibility.public}</option>
            <option value="friends">{t.settings.privacy.profileVisibility.friends}</option>
            <option value="private">{t.settings.privacy.profileVisibility.private}</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>{t.settings.privacy.showEmail.title}</h3>
            <p>{t.settings.privacy.showEmail.description}</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.privacy.showEmail}
              onChange={() => onToggle('privacy', 'showEmail')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>{t.settings.privacy.showPhone.title}</h3>
            <p>{t.settings.privacy.showPhone.description}</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.privacy.showPhone}
              onChange={() => onToggle('privacy', 'showPhone')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </>
  )
}

const PreferenceSettings = ({ settings, onSelect }) => {
  const { t } = useLanguage()
  return (
    <>
      <h2>{t.settings.preferences.title}</h2>
      <p className="section-description">{t.settings.preferences.description}</p>
      
      <div className="settings-group">
        <div className="setting-item">
          <div className="setting-info">
            <h3>{t.settings.preferences.language.title}</h3>
            <p>{t.settings.preferences.language.description}</p>
          </div>
          <select
            className="setting-select"
            value={settings.preferences.language}
            onChange={(e) => onSelect('preferences', 'language', e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="ja">日本語 (Japanese)</option>
          </select>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>{t.settings.preferences.theme.title}</h3>
            <p>{t.settings.preferences.theme.description}</p>
          </div>
          <select
            className="setting-select"
            value={settings.preferences.theme}
            onChange={(e) => onSelect('preferences', 'theme', e.target.value)}
          >
            <option value="dark">{t.settings.preferences.theme.dark}</option>
            <option value="light">{t.settings.preferences.theme.light}</option>
          </select>
        </div>
      </div>
    </>
  )
}

const AccountSettings = ({ settings, onToggle }) => {
  const { t } = useLanguage()
  return (
    <>
      <h2>{t.settings.account.title}</h2>
      <p className="section-description">{t.settings.account.description}</p>
      
      <div className="settings-group">
        <div className="setting-item">
          <div className="setting-info">
            <h3>{t.settings.account.twoFactor.title}</h3>
            <p>{t.settings.account.twoFactor.description}</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.account.twoFactor}
              onChange={() => onToggle('account', 'twoFactor')}
            />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-item">
          <div className="setting-info">
            <h3>{t.settings.account.loginAlerts.title}</h3>
            <p>{t.settings.account.loginAlerts.description}</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.account.loginAlerts}
              onChange={() => onToggle('account', 'loginAlerts')}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="danger-zone">
        <h3>{t.settings.account.dangerZone}</h3>
        <div className="danger-actions">
          <button className="danger-btn">
            <i className='bx bx-trash'></i>
            {t.settings.account.deleteAccount}
          </button>
          <button className="danger-btn">
            <i className='bx bx-lock'></i>
            {t.settings.account.changePassword}
          </button>
        </div>
      </div>
    </>
  )
}

export default Settings

