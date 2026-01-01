import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import './Profile.css'

const Profile = () => {
  const { user } = useAuth()
  const { theme } = useTheme()

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header" style={{ '--theme-gradient': theme.gradient }}>
          <div className="profile-avatar">
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=${theme.primary.replace('#', '')}&color=fff&size=256`}
              alt={user?.name}
            />
          </div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
        </div>
        <div className="profile-content">
          <div className="profile-section">
            <h2>Profile Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Full Name</label>
                <p>{user?.name}</p>
              </div>
              <div className="info-item">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>
              <div className="info-item">
                <label>Member Since</label>
                <p>Recently Joined</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Profile

