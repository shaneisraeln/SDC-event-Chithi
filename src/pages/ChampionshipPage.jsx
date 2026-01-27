import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import ChampionshipProgress from '../components/ChampionshipProgress'
import F1Button from '../components/F1Button'
import F1DriverAvatar from '../components/F1DriverAvatar'
import { logPageView } from '../utils/adminLogger'

const ChampionshipPage = () => {
  const navigate = useNavigate()

  // Log page view for admin dashboard
  useEffect(() => {
    logPageView('championship')
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-6 mb-6">
            <F1DriverAvatar size="medium" interactive={true} team="FERRARI" driverNumber={1} />
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent mb-2">
                CHAMPIONSHIP DASHBOARD
              </h1>
              <p className="text-xl text-red-300">
                Your complete F1 racing statistics and achievements
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 justify-center flex-wrap">
            <F1Button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg neon-border font-semibold"
              variant="normal"
            >
              🏎️ Back to Racing Dashboard
            </F1Button>
            <F1Button
              onClick={() => navigate('/victory')}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg neon-border font-semibold"
              variant="victory"
            >
              🏆 Victory Podium
            </F1Button>
          </div>
        </motion.div>

        {/* Full Championship Progress */}
        <ChampionshipProgress variant="full" />
      </div>
    </div>
  )
}

export default ChampionshipPage