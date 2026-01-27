import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext'
import { useMotion } from '../context/MotionContext'
import { useF1Audio } from '../context/F1AudioContext'
import F1DriverAvatar from '../components/F1DriverAvatar'
import { transformToF1Progress, getChampionshipMessage } from '../utils/f1AchievementSystem'

const VictoryPage = () => {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const { reducedMotion } = useMotion()
  const { playVictoryCelebration, playCheckeredFlag, playEngineRev } = useF1Audio()
  const [password, setPassword] = useState('')
  const [showError, setShowError] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [stage, setStage] = useState('password') // password, unlocking, victory
  const correctPassword = 'TRACE'
  const f1Progress = transformToF1Progress(progress)

  // Check if all levels are completed
  useEffect(() => {
    const allLevelsCompleted = [1, 2, 3, 4, 5].every(level => 
      progress.completedLevels.includes(level)
    )
    if (!allLevelsCompleted) {
      navigate('/dashboard')
    }
  }, [progress, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password.toUpperCase() === correctPassword) {
      setShowError(false)
      setStage('unlocking')
      playEngineRev('high')
      setTimeout(() => {
        setStage('victory')
        playVictoryCelebration()
      }, 3000)
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 2000)
    }
  }

  const collectedClues = progress.collectedClues || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black relative overflow-hidden">
      {/* Animated background particles */}
      {!reducedMotion && (
        <>
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-500 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0 
              }}
              animate={{ 
                y: [null, Math.random() * window.innerHeight],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 3 + 2, 
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {stage === 'password' && (
            <motion.div
              key="password"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="max-w-2xl mx-auto mt-8 md:mt-20 px-4"
            >
              {/* Header */}
              <motion.div 
                className="text-center mb-12"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent f1-typography">
                  The Final Challenge
                </h1>
                <p className="text-purple-300 text-lg md:text-xl f1-body-text">
                  You have collected all the clues. Now, unlock the truth.
                </p>
              </motion.div>

              {/* F1 Driver Avatar */}
              <motion.div 
                className="flex justify-center mb-8"
                animate={!reducedMotion ? {
                  y: [0, -10, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <F1DriverAvatar size="large" celebrationMode={true} />
              </motion.div>

              {/* Collected Clues Display */}
              <motion.div 
                className="f1-panel rounded-2xl p-8 mb-8 racing-stripes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="sponsor-logo"></div>
                <h2 className="text-2xl font-bold text-red-300 mb-4 text-center f1-typography">
                  🏆 Championship Clues Collected
                </h2>
                <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6">
                  {['T', 'R', 'A', 'C', 'E'].map((letter, index) => (
                    <motion.div
                      key={letter}
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-2xl md:text-3xl font-bold f1-typography ${
                        collectedClues.includes(letter)
                          ? 'bg-gradient-to-br from-f1-racing-red to-f1-championship-gold text-white border-2 border-f1-championship-gold'
                          : 'bg-f1-carbon-black text-f1-tire-smoke border-2 border-f1-tire-smoke'
                      }`}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      {letter}
                    </motion.div>
                  ))}
                </div>
                <p className="text-center text-red-400 italic f1-body-text">
                  "The racing line you've taken reveals the championship code..."
                </p>
              </motion.div>

              {/* Password Input */}
              <motion.form 
                onSubmit={handleSubmit}
                className="f1-card rounded-2xl p-8 racing-stripes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="sponsor-logo"></div>
                <label className="block text-red-300 text-lg mb-4 text-center f1-typography">
                  🏁 Final Championship Code
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 md:px-6 py-3 md:py-4 f1-input rounded-lg text-center text-xl md:text-2xl tracking-widest uppercase"
                  placeholder="ENTER CHAMPIONSHIP CODE"
                  maxLength={5}
                  autoFocus
                />
                
                <AnimatePresence>
                  {showError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-center mt-4"
                    >
                      Incorrect password. Try again.
                    </motion.p>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  className="w-full mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Unlock
                </motion.button>
              </motion.form>

              <motion.button
                onClick={() => navigate('/dashboard')}
                className="mt-6 text-purple-400 hover:text-purple-300 transition-colors block mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                ← Back to Dashboard
              </motion.button>
            </motion.div>
          )}

          {stage === 'unlocking' && (
            <motion.div
              key="unlocking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-screen"
            >
              <motion.div
                className="text-6xl font-bold text-purple-400 mb-8"
                animate={!reducedMotion ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                  opacity: [1, 0.5, 1]
                } : {}}
                transition={{ duration: 1, repeat: 3 }}
              >
                UNLOCKING...
              </motion.div>
              
              <div className="flex gap-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-4 h-4 bg-purple-500 rounded-full"
                    animate={!reducedMotion ? {
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.3, 1]
                    } : {}}
                    transition={{ 
                      duration: 0.6, 
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {stage === 'victory' && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-screen text-center px-4"
            >
              {/* Victory Animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 1 }}
                className="mb-8"
              >
                <F1DriverAvatar size="large" celebrationMode={true} />
              </motion.div>

              <motion.h1
                className="text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                CHALLENGE COMPLETE!
              </motion.h1>

              <motion.div
                className="glass-effect rounded-2xl p-12 max-w-3xl neon-border mb-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.p
                  className="text-2xl text-purple-300 mb-6 leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  "Impressive, human. You have proven yourself worthy."
                </motion.p>
                
                <motion.p
                  className="text-xl text-purple-400 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  {getChampionshipMessage(progress)}
                </motion.p>

                <motion.p
                  className="text-lg text-purple-500 italic"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  The path you TRACED has led you to victory. 
                  You are now among the elite who have defeated Chitti's challenge.
                </motion.p>
              </motion.div>

              {/* Championship Stats */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 }}
              >
                <div className="glass-effect rounded-xl p-6 neon-border">
                  <div className="text-4xl font-bold text-purple-400">{f1Progress.circuitsCompleted.length}</div>
                  <div className="text-purple-300">Circuits</div>
                </div>
                <div className="glass-effect rounded-xl p-6 neon-border">
                  <div className="text-4xl font-bold text-purple-400">{f1Progress.championshipPoints}</div>
                  <div className="text-purple-300">Points</div>
                </div>
                <div className="glass-effect rounded-xl p-6 neon-border">
                  <div className="text-4xl font-bold text-purple-400">P{f1Progress.currentPosition}</div>
                  <div className="text-purple-300">Position</div>
                </div>
                <div className="glass-effect rounded-xl p-6 neon-border">
                  <div className="text-4xl font-bold text-purple-400">{f1Progress.unlockedTrophies.length}</div>
                  <div className="text-purple-300">Trophies</div>
                </div>
              </motion.div>

              {/* Confetti effect */}
              {!reducedMotion && (
                <>
                  {[...Array(100)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: ['#a855f7', '#ec4899', '#fbbf24', '#3b82f6'][i % 4],
                        left: `${Math.random() * 100}%`,
                        top: '-10%'
                      }}
                      animate={{
                        y: window.innerHeight + 100,
                        x: [0, Math.random() * 200 - 100],
                        rotate: Math.random() * 360,
                        opacity: [1, 0]
                      }}
                      transition={{
                        duration: Math.random() * 2 + 2,
                        delay: Math.random() * 2,
                        repeat: Infinity
                      }}
                    />
                  ))}
                </>
              )}

              <motion.button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold text-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Return to Dashboard
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default VictoryPage
