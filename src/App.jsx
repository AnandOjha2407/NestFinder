import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Home from './pages/Home'
import Guest from './pages/Guest'
import Hotel from './pages/Hotel'
import Rental from './pages/Rental'
import Search from './pages/Search'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PropertyDetail from './pages/PropertyDetail'
import Favorites from './pages/Favorites'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Bookings from './pages/Bookings'
import Help from './pages/Help'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guest" element={<Guest />} />
        <Route path="/hotel" element={<Hotel />} />
        <Route path="/rental" element={<Rental />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bookings" 
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          } 
        />
        <Route path="/help" element={<Help />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
