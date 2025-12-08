import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useProgress } from '../context/ProgressContext'
import RippleButton from '../components/RippleButton'
import FinalPasswordModal from '../components/FinalPasswordModal'
import ChittiAvatar from '../components/ChittiAvatar'
import { problems, storySegments } from '../data/problems'
import { useMotion } from '../context/MotionContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const { progress, resetProgress, exportProgress } = useProgress()
  const { reducedMotion } = useMotion()
  const [showFinalModal, setShowFinalModal] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [hoveredLevel, setHoveredLevel] = useState(null)
  const totalLevels = Object.keys(problems).length

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
      name: 'The Awakening', 
      subtitle: 'Begin Your Journey',
      questions: 1, 
      icon: '⚡',
      gradient: 'from-purple-500 via-pink-500 to-purple-600',
      glowColor: 'rgba(168, 85, 247, 0.5)'
    },
    { 
      id: 2, 
      name: 'Pattern Recognition', 
      subtitle: 'Master the Patterns',
      questions: 2, 
      icon: '🧩',
      gradient: 'from-pink-500 via-purple-500 to-blue-500',
      glowColor: 'rgba(236, 72, 153, 0.5)'
    },
    { 
      id: 3, 
      name: 'Data Structures', 
      subtitle: 'Navigate the Pathways',
      questions: 3, 
      icon: '🔗',
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      glowColor: 'rgba(59, 130, 246, 0.5)'
    },
    { 
      id: 4, 
      name: 'Algorithm Mastery', 
      subtitle: 'Unlock the Secrets',
      questions: 4, 
      icon: '⚙️',
      gradient: 'from-purple-600 via-blue-600 to-purple-700',
      glowColor: 'rgba(147, 51, 234, 0.5)'
    },
    { 
      id: 5, 
      name: 'The Final Test', 
      subtitle: 'Face the Ultimate Challenge',
      questions: 5, 
      icon: '👑',
      gradient: 'from-yellow-500 via-purple-600 to-pink-600',
      glowColor: 'rgba(234, 179, 8, 0.5)'
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

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <div className="flex items-center justify-center gap-6 mb-6">
            <ChittiAvatar size="medium" interactive={true} />
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
                MISSION CONTROL
              </h1>
              <p className="text-xl text-purple-300">
                Choose Your Challenge • Defeat Chitti
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-400 font-semibold">Overall Progress</span>
              <span className="text-purple-300">{progress.completedLevels.length}/{totalLevels} Levels</span>
            </div>
            <div className="h-3 bg-gray-800 rounded-full overflow-hidden neon-border">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${(progress.completedLevels.length / totalLevels) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap">
            <RippleButton
              onClick={exportProgress}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg neon-border font-semibold"
            >
              💾 Export Progress
            </RippleButton>
            <RippleButton
              onClick={() => setShowResetConfirm(true)}
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg neon-border font-semibold"
            >
              🔄 Reset Progress
            </RippleButton>
          </div>
        </motion.div>

        {/* Clue Tracker */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="glass-effect neon-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-purple-400 text-glow">Clues Collected</h3>
              <span className="text-purple-300 font-semibold">
                {unlockedClues.length}/{totalLevels} clues
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {sortedLevelIds.map((id) => {
                const unlocked = progress.completedLevels.includes(id)
                const clue = storySegments[id].clue
                return (
                  <div
                    key={id}
                    className={`p-4 rounded-xl border text-center ${
                      unlocked
                        ? 'border-green-500/60 bg-green-500/10 text-green-300'
                        : 'border-purple-500/30 bg-purple-900/20 text-purple-300'
                    }`}
                  >
                    <div className="text-sm mb-1">Level {id}</div>
                    <div className="text-3xl font-bold tracking-widest">
                      {unlocked ? clue : '—'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                        <span className="text-purple-300">Questions</span>
                        <span className="text-white font-bold">{level.questions}</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/20">
                        <span className="text-purple-300">Progress</span>
                        <span className="text-white font-bold">{getLevelProgress(level.id)}</span>
                      </div>

                      {/* Status Badge */}
                      <div className={`text-center py-2 rounded-lg font-semibold ${
                        complete 
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                          : unlocked 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
                      }`}>
                        {complete ? '✓ Completed' : unlocked ? '▶ In Progress' : '🔒 Locked'}
                      </div>
                    </div>

                    {/* Hover Indicator */}
                    {unlocked && (
                      <motion.div
                        className="mt-4 text-center text-purple-400 text-sm font-semibold"
                        animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                      >
                        Click to Enter →
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
            className="text-center"
          >
            <RippleButton
              onClick={() => setShowFinalModal(true)}
              className={`px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xl font-bold neon-border ${challengeOver ? '' : 'animate-pulse-slow'}`}
            >
              {challengeOver ? 'Challenge Completed — View Finale' : 'Enter Final Password'}
            </RippleButton>
            {challengeOver && (
              <p className="mt-3 text-green-300 font-semibold">
                Final password accepted. You have conquered the challenge!
              </p>
            )}
          </motion.div>
        )}

        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-900 p-8 rounded-lg neon-border max-w-md"
            >
              <h3 className="text-2xl font-bold text-purple-400 mb-4">Reset Progress?</h3>
              <p className="text-purple-300 mb-6">
                This will delete all your progress. This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <RippleButton
                  onClick={() => {
                    resetProgress()
                    setShowResetConfirm(false)
                  }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded"
                >
                  Reset
                </RippleButton>
                <RippleButton
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded"
                >
                  Cancel
                </RippleButton>
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
