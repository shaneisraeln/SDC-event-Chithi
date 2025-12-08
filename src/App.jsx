import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import LevelPage from './pages/LevelPage'
import VictoryPage from './pages/VictoryPage'
import AdminCMS from './pages/AdminCMS'
import CursorTrail from './components/CursorTrail'
import ParallaxBackground from './components/ParallaxBackground'
import { ProgressProvider } from './context/ProgressContext'
import { MotionProvider } from './context/MotionContext'

function App() {
  return (
    <MotionProvider>
      <ProgressProvider>
        <Router>
          <div className="relative min-h-screen">
            <ParallaxBackground />
            <CursorTrail />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/level/:levelId" element={<LevelPage />} />
                <Route path="/victory" element={<VictoryPage />} />
                <Route path="/admin" element={<AdminCMS />} />
              </Routes>
            </AnimatePresence>
          </div>
        </Router>
      </ProgressProvider>
    </MotionProvider>
  )
}

export default App
