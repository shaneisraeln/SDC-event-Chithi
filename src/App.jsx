import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import LevelPage from './pages/LevelPage'
import VictoryPage from './pages/VictoryPage'
import AdminCMS from './pages/AdminCMS'
import AdminPage from './pages/AdminPage'
import CursorTrail from './components/CursorTrail'
import RacingTrackBackground from './components/RacingTrackBackground'
import F1PageTransition from './components/F1PageTransition'
import { ProgressProvider } from './context/ProgressContext'
import { MotionProvider } from './context/MotionContext'
import { F1ThemeProvider } from './context/F1ThemeContext'
import { initializeSession } from './utils/adminLogger'

function App() {
  // Initialize user session for tracking
  useEffect(() => {
    initializeSession()
  }, [])

  return (
    <F1ThemeProvider>
      <MotionProvider>
        <ProgressProvider>
          <Router>
            <div className="relative min-h-screen">
              <RacingTrackBackground />
              <CursorTrail />
              <F1PageTransition>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/level/:levelId" element={<LevelPage />} />
                  <Route path="/victory" element={<VictoryPage />} />
                  <Route path="/admin" element={<AdminCMS />} />
                  <Route path="/admin-dashboard" element={<AdminPage />} />
                </Routes>
              </F1PageTransition>
            </div>
          </Router>
        </ProgressProvider>
      </MotionProvider>
    </F1ThemeProvider>
  )
}

export default App
