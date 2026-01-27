import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useProgress } from '../context/ProgressContext'
import F1Button from '../components/F1Button'
import F1LoadingIndicator from '../components/F1LoadingIndicator'
import F1SpeedEffect from '../components/F1SpeedEffect'
import FinalPasswordModal from '../components/FinalPasswordModal'
import F1DriverAvatar from '../components/F1DriverAvatar'
import ChampionshipProgress from '../components/ChampionshipProgress'
import { problems, storySegments } from '../data/problems'
import { useMotion } from '../context/MotionContext'
import { logPageView } from '../utils/adminLogger'
import { F1_ANIMATION_PRESETS } from '../utils/f1Animations'

const Dashboard = () => {
  const navigate = useNavigate()
  const { progress, resetProgress, exportProgress } = useProgress()
  const { reducedMotion } = useMotion()
  const [showFinalModal, setShowFinalModal] = useState(false)

  // Log page view for admin dashboard
  useEffect(() => {
    logPageView('dashboard')
  }, [])
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [hoveredLevel, setHoveredLevel] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSpeedEffect, setShowSpeedEffect] = useState(false)
  const totalLevels = 5 // 5 rounds total

  // Simulate loading for dramatic effect
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false)
      setShowSpeedEffect(true)
      setTimeout(() => setShowSpeedEffect(false), 2000)
    }, 1500)
    
    return () => clearTimeout(loadingTimer)
  }, [])

  const sortedLevelIds = Object.keys(storySegments)
    .map(Number)
    .sort((a, b) => a - b)
  const unlockedClues = sortedLevelIds
    .filter(id => progress.completedLevels.includes(id))
    .map(id => storySegments[id].clue)
  const expectedPassword = sortedLevelIds.map(id => storySegments[id].clue).join('')
  const challengeOver = progress.finalPasswordEntered

  const levels = [
    { 
      id: 1, 
      name: 'MONACO GRAND PRIX', 
      subtitle: 'Precision Qualifying',
      questions: 10, 
      type: 'MCQ',
      icon: '🏎️',
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      glowColor: 'rgba(16, 185, 129, 0.6)',
      description: 'Lightning-fast qualifying session to secure your grid position'
    },
    { 
      id: 2, 
      name: 'SILVERSTONE CIRCUIT', 
      subtitle: 'Technical Challenge',
      questions: 3, 
      type: 'CODE_ALIGN',
      icon: '🔧',
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      glowColor: 'rgba(249, 115, 22, 0.6)',
      description: 'Navigate technical sections and optimize your racing line'
    },
    { 
      id: 3, 
      name: 'MONZA SPEEDWAY', 
      subtitle: 'Strategy Prediction',
      questions: 5, 
      type: 'OUTPUT_PREDICT',
      icon: '🏁',
      gradient: 'from-violet-500 via-purple-500 to-indigo-500',
      glowColor: 'rgba(139, 92, 246, 0.6)',
      description: 'Predict race outcomes and master strategic decision-making'
    },
    { 
      id: 4, 
      name: 'SPA-FRANCORCHAMPS', 
      subtitle: 'Championship Points',
      questions: 5, 
      type: 'DSA',
      icon: '🏆',
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      glowColor: 'rgba(59, 130, 246, 0.6)',
      description: 'Score crucial championship points in this legendary circuit'
    },
    { 
      id: 5, 
      name: 'SUZUKA CHAMPIONSHIP', 
      subtitle: 'Title Decider',
      questions: 5, 
      type: 'DSA',
      icon: '👑',
      gradient: 'from-purple-500 via-pink-500 to-red-500',
      glowColor: 'rgba(168, 85, 247, 0.6)',
      description: 'The ultimate championship decider - claim your racing crown'
    }
  ]

  const isLevelUnlocked = (levelId) => {
    if (levelId === 1) return true
    return progress.completedLevels.includes(levelId - 1)
  }

  const isLevelComplete = (levelId) => {
    return progress.completedLevels.includes(levelId)
  }

  const getLevelProgress = (levelId) => {
    const levelProblems = problems[levelId]
    const solved = levelProblems.filter(p => 
      progress.solvedQuestions[`${levelId}-${p.id}`]
    ).length
    return `${solved}/${levelProblems.length}`
  }

  const readyForFinale = progress.completedLevels.length === totalLevels

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <F1LoadingIndicator 
            type="moving_car" 
            size="large" 
            message="Preparing Championship Dashboard..."
          />
          <motion.p
            className="mt-8 text-xl text-red-300"
            {...F1_ANIMATION_PRESETS.RACING_PULSE}
          >
            Engines warming up...
          </motion.p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Speed effect overlay */}
      <F1SpeedEffect 
        isActive={showSpeedEffect} 
        intensity="high" 
        direction="horizontal"
        className="z-10"
      />
      
      <div className="max-w-7xl mx-auto relative z-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <div className="flex items-center justify-center gap-6 mb-6">
            <F1DriverAvatar size="medium" interactive={true} team="MCLAREN" driverNumber={44} />
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent mb-2">
                CODE PRIX CHAMPIONSHIP
              </h1>
              <p className="text-xl text-red-300">
                5 Circuits • 28 Challenges • 1 Championship Title
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-400 font-semibold">Championship Progress</span>
              <span className="text-red-300">{progress.completedLevels.length}/5 Circuits</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden neon-border">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${(progress.completedLevels.length / totalLevels) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <F1Button
              onClick={exportProgress}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg neon-border font-semibold"
              variant="normal"
            >
              💾 Export Championship Data
            </F1Button>
            <F1Button
              onClick={() => setShowResetConfirm(true)}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg neon-border font-semibold"
              variant="penalty"
            >
              🔄 Reset Season
            </F1Button>
            {/* Secret Admin Link */}
            <F1Button
              onClick={() => navigate('/admin-dashboard')}
              className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-gray-300 rounded-lg border border-gray-600 font-semibold text-xs opacity-50 hover:opacity-100 transition-opacity"
              title="Pit Lane Control (Secret)"
              variant="pit_stop"
            >
              🛠️
            </F1Button>
          </div>
        </motion.div>

        {/* Victory Tracker */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="glass-effect neon-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-red-400 text-glow">Championship Standings</h3>
              <span className="text-red-300 font-semibold">
                {unlockedClues.length}/5 circuits conquered
              </span>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {[
                { id: 1, name: 'MONACO', icon: '🧠', color: 'emerald' },
                { id: 2, name: 'SILVERSTONE', icon: '🔧', color: 'orange' },
                { id: 3, name: 'MONZA', icon: '🔮', color: 'violet' },
                { id: 4, name: 'SPA', icon: '⚔️', color: 'blue' },
                { id: 5, name: 'SUZUKA', icon: '👑', color: 'purple' }
              ].map((circuit) => {
                const unlocked = progress.completedLevels.includes(circuit.id)
                const clue = storySegments[circuit.id]?.clue
                return (
                  <div
                    key={circuit.id}
                    className={`p-6 rounded-xl border text-center transition-all duration-300 ${
                      unlocked
                        ? `border-${circuit.color}-500/60 bg-${circuit.color}-500/10 text-${circuit.color}-300 shadow-lg shadow-${circuit.color}-500/20`
                        : 'border-red-500/30 bg-red-900/20 text-red-300'
                    }`}
                  >
                    <div className="text-4xl mb-2">{circuit.icon}</div>
                    <div className="text-sm font-semibold mb-2">{circuit.name}</div>
                    <div className="text-2xl font-bold tracking-widest">
                      {unlocked ? clue : '—'}
                    </div>
                    <div className="text-xs mt-2 opacity-75">
                      {unlocked ? 'VICTORY' : 'LOCKED'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Championship Progress Component */}
        <div className="mb-10">
          <ChampionshipProgress variant="compact" />
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {levels.map((level, index) => {
            const unlocked = isLevelUnlocked(level.id)
            const complete = isLevelComplete(level.id)
            const isHovered = hoveredLevel === level.id
            
            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, type: 'spring' }}
                onMouseEnter={() => setHoveredLevel(level.id)}
                onMouseLeave={() => setHoveredLevel(null)}
                className="relative group"
              >
                {/* Glow Effect */}
                {!reducedMotion && isHovered && unlocked && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-75"
                    style={{ background: level.glowColor }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Card */}
                <motion.div
                  className={`relative rounded-2xl overflow-hidden ${
                    !unlocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  onClick={() => unlocked && navigate(`/level/${level.id}`)}
                  whileHover={unlocked && !reducedMotion ? { scale: 1.05, y: -10 } : {}}
                  whileTap={unlocked && !reducedMotion ? { scale: 0.98 } : {}}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${level.gradient} opacity-20`} />
                  
                  {/* Glass Effect */}
                  <div className="relative backdrop-blur-md bg-black/40 border-2 border-purple-500/30 p-6">
                    {/* Lock Overlay */}
                    {!unlocked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="text-6xl mb-2">🔒</div>
                          <p className="text-purple-300 font-semibold">Complete Level {level.id - 1}</p>
                        </div>
                      </div>
                    )}

                    {/* Level Number Badge */}
                    <div className="absolute top-4 right-4">
                      <motion.div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${level.gradient} flex items-center justify-center font-bold text-white text-xl shadow-lg`}
                        animate={!reducedMotion && complete ? {
                          rotate: [0, 360],
                          scale: [1, 1.2, 1]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {complete ? '✓' : level.id}
                      </motion.div>
                    </div>

                    {/* Icon */}
                    <motion.div
                      className="text-7xl mb-4"
                      animate={!reducedMotion && isHovered ? {
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {level.icon}
                    </motion.div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-white mb-2 text-glow">
                      {level.name}
                    </h2>
                    <p className="text-purple-300 text-sm mb-4">{level.subtitle}</p>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/20">
                        <span className="text-purple-300">Type</span>
                        <span className="text-white font-bold text-sm">
                          {level.type === 'MCQ' ? 'Qualifying Session' : 
                           level.type === 'CODE_ALIGN' ? 'Technical Section' : 
                           level.type === 'OUTPUT_PREDICT' ? 'Strategy Planning' :
                           'Championship Race'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/20">
                        <span className="text-purple-300">Questions</span>
                        <span className="text-white font-bold">{level.questions}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/20">
                        <span className="text-purple-300">Progress</span>
                        <span className="text-white font-bold">{getLevelProgress(level.id)}</span>
                      </div>

                      {/* Description */}
                      <div className="p-3 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/20">
                        <p className="text-purple-200 text-sm text-center">{level.description}</p>
                      </div>

                      {/* Status Badge */}
                      <div className={`text-center py-3 rounded-lg font-semibold text-lg ${
                        complete 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                          : unlocked 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                      }`}>
                        {complete ? '🏆 VICTORY' : unlocked ? '🏎️ RACE READY' : '🔒 LOCKED'}
                      </div>
                    </div>

                    {/* Hover Indicator */}
                    {unlocked && (
                      <motion.div
                        className="mt-4 text-center text-purple-400 text-sm font-semibold"
                        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      >
                        {level.type === 'MCQ' ? '🏎️ Start Qualifying →' :
                         level.type === 'CODE_ALIGN' ? '🔧 Enter Pit Lane →' :
                         level.type === 'OUTPUT_PREDICT' ? '🏁 Plan Strategy →' :
                         '🏆 Race for Points →'}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {readyForFinale && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-12"
          >
            <motion.div
              className="glass-effect neon-border rounded-2xl p-8 max-w-2xl mx-auto"
              animate={!reducedMotion ? {
                boxShadow: [
                  '0 0 20px rgba(168, 85, 247, 0.5)',
                  '0 0 40px rgba(168, 85, 247, 0.8)',
                  '0 0 20px rgba(168, 85, 247, 0.5)'
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={!reducedMotion ? {
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🏆
              </motion.div>
              <h2 className="text-3xl font-bold text-red-300 mb-3">
                All Circuits Conquered!
              </h2>
              <p className="text-red-400 mb-6">
                You have mastered all 5 championship circuits. The title fight awaits...
              </p>
              <F1Button
                onClick={() => navigate('/victory')}
                className="px-10 py-5 bg-gradient-to-r from-yellow-500 via-red-600 to-yellow-600 text-white rounded-xl text-2xl font-bold neon-border animate-pulse-slow shadow-2xl"
                variant="victory"
              >
                🏆 CLAIM CHAMPIONSHIP TITLE 🏆
              </F1Button>
            </motion.div>
          </motion.div>
        )}

        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 p-8 rounded-lg neon-border max-w-md"
            >
              <h3 className="text-2xl font-bold text-red-400 mb-4">Reset Championship Season?</h3>
              <p className="text-red-300 mb-6">
                This will delete all your championship progress. This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <F1Button
                  onClick={() => {
                    resetProgress()
                    setShowResetConfirm(false)
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded"
                  variant="penalty"
                >
                  Reset Season
                </F1Button>
                <F1Button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded"
                  variant="pit_stop"
                >
                  Cancel
                </F1Button>
              </div>
            </motion.div>
          </div>
        )}

        {showFinalModal && (
          <FinalPasswordModal
            clues={unlockedClues}
            expectedPassword={expectedPassword}
            onClose={() => setShowFinalModal(false)}
            onSuccess={() => setShowFinalModal(false)}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard
