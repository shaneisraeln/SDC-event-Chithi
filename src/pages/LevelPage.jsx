import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '../context/ProgressContext'
import { problems, storySegments } from '../data/problems'
import StoryModal from '../components/StoryModal'
import RippleButton from '../components/RippleButton'
import { useMotion } from '../context/MotionContext'
import { logPageView } from '../utils/adminLogger'

// Round-specific components
import MCQRound from '../components/rounds/MCQRound'
import CodeAlignRound from '../components/rounds/CodeAlignRound'
import OutputPredictRound from '../components/rounds/OutputPredictRound'
import DSARound from '../components/rounds/DSARound'

const LevelPage = () => {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const { reducedMotion } = useMotion()
  const { progress, markQuestionSolved, markLevelComplete } = useProgress()

  // Log page view for admin dashboard
  useEffect(() => {
    if (levelId) {
      logPageView(`level-${levelId}`)
    }
  }, [levelId])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showStory, setShowStory] = useState(false)
  const [timeLeft, setTimeLeft] = useState(null)
  const [isTimerActive, setIsTimerActive] = useState(false)

  const levelNumber = parseInt(levelId)
  const levelProblems = problems[levelNumber]
  const story = storySegments[levelNumber]
  const currentQuestion = levelProblems?.[currentQuestionIndex]

  // Timer effect
  useEffect(() => {
    if (!isTimerActive || !timeLeft || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsTimerActive(false)
          // Auto-submit or move to next question
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerActive, timeLeft])

  // Timer is disabled for all rounds - focus on learning, not speed
  useEffect(() => {
    setTimeLeft(null)
    setIsTimerActive(false)
  }, [currentQuestion, levelNumber])

  // Check if level is complete
  useEffect(() => {
    if (!levelProblems?.length || !story) return
    const alreadyComplete = progress.completedLevels.includes(levelNumber)
    const allSolved = levelProblems.every(
      (p) => progress.solvedQuestions[`${levelNumber}-${p.id}`]
    )
    if (allSolved && !alreadyComplete) {
      markLevelComplete(levelNumber, story.clue)
      setShowStory(true)
    }
  }, [levelProblems, levelNumber, progress.completedLevels, progress.solvedQuestions, story, markLevelComplete])

  const isQuestionSolved = (questionId) => {
    return progress.solvedQuestions[`${levelId}-${questionId}`]
  }

  const handleQuestionSolved = (questionId, isCorrect = true) => {
    if (!isCorrect) return

    setIsTimerActive(false)
    markQuestionSolved(levelNumber, questionId)
    
    // Check if this was the last question to solve
    const allSolved = levelProblems.every(p => {
      if (p.id === questionId) return true
      return isQuestionSolved(p.id)
    })
    
    if (allSolved && !progress.completedLevels.includes(levelNumber)) {
      setTimeout(() => {
        markLevelComplete(levelNumber, story.clue)
        setShowStory(true)
      }, 1000)
    } else {
      // Move to next unsolved question
      setTimeout(() => {
        const nextIndex = levelProblems.findIndex((p, idx) => 
          idx > currentQuestionIndex && !isQuestionSolved(p.id)
        )
        if (nextIndex !== -1) {
          setCurrentQuestionIndex(nextIndex)
        }
      }, 1500)
    }
  }

  const handleTimeUp = () => {
    // Move to next question when time runs out
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < levelProblems.length) {
      setCurrentQuestionIndex(nextIndex)
    }
  }

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index)
    setIsTimerActive(false)
  }

  const getRoundComponent = () => {
    if (!currentQuestion) return null

    const commonProps = {
      question: currentQuestion,
      onSolved: handleQuestionSolved,
      isAlreadySolved: isQuestionSolved(currentQuestion.id)
    }

    try {
      switch (currentQuestion.type) {
        case 'MCQ':
          return <MCQRound {...commonProps} />
        case 'CODE_ALIGN':
          return <CodeAlignRound {...commonProps} />
        case 'OUTPUT_PREDICT':
          return <OutputPredictRound {...commonProps} />
        case 'DSA':
          return <DSARound {...commonProps} />
        default:
          return (
            <div className="text-center py-12">
              <div className="text-red-400 text-xl mb-4">❌</div>
              <h3 className="text-xl text-red-400 mb-2">Unknown Question Type</h3>
              <p className="text-gray-400">Question type: {currentQuestion.type}</p>
            </div>
          )
      }
    } catch (error) {
      console.error('Error rendering round component:', error)
      return (
        <div className="text-center py-12">
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <h3 className="text-xl text-red-400 mb-2">Component Error</h3>
          <p className="text-gray-400">Failed to load round component</p>
          <pre className="text-xs text-gray-500 mt-4 max-w-md mx-auto text-left">
            {error.message}
          </pre>
        </div>
      )
    }
  }

  const getRoundInfo = () => {
    const roundTypes = {
      1: { name: 'APTITUDE ARENA', icon: '🧠', color: 'emerald', description: 'Test your mental agility' },
      2: { name: 'CODE CHAOS', icon: '🔧', color: 'orange', description: 'Fix the scrambled code' },
      3: { name: 'OUTPUT ORACLE', icon: '🔮', color: 'violet', description: 'Predict the output' },
      4: { name: 'ALGORITHM FORGE', icon: '⚔️', color: 'blue', description: 'Master easy DSA problems' },
      5: { name: 'MASTER\'S TRIAL', icon: '👑', color: 'purple', description: 'Conquer medium DSA challenges' }
    }
    return roundTypes[levelNumber] || { name: 'Unknown Round', icon: '❓', color: 'gray' }
  }

  if (!levelProblems) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl text-red-400 mb-4">Round Not Found</h2>
          <p className="text-gray-400 mb-4">Level ID: {levelId}</p>
          <p className="text-gray-400 mb-4">Available levels: {Object.keys(problems).join(', ')}</p>
          <RippleButton
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg"
          >
            Return to Dashboard
          </RippleButton>
        </div>
      </div>
    )
  }

  const roundInfo = getRoundInfo()
  const solvedCount = levelProblems.filter(p => isQuestionSolved(p.id)).length

  return (
    <div className="min-h-screen p-4 bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <RippleButton
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-lg neon-border mb-4 transition-colors"
          >
            ← Back to Battle Arena
          </RippleButton>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-5xl">{roundInfo.icon}</div>
              <div>
                <h1 className={`text-4xl font-bold text-${roundInfo.color}-400 text-glow`}>
                  {roundInfo.name}
                </h1>
                <p className="text-purple-300 text-lg">{roundInfo.description}</p>
              </div>
            </div>
            
            {/* Progress */}
            <div className="text-right">
              <div className="text-2xl font-bold text-white mb-1">
                {solvedCount}/{levelProblems.length}
              </div>
              <div className="text-purple-300 text-sm">Completed</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 rounded-full h-3 mb-4">
            <motion.div
              className={`h-3 bg-gradient-to-r from-${roundInfo.color}-500 to-${roundInfo.color}-600 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${(solvedCount / levelProblems.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <div className="glass-effect neon-border rounded-xl p-4 mb-4">
              <h3 className="text-lg font-bold text-purple-300 mb-3">Questions</h3>
              <div className="space-y-2">
                {levelProblems.map((problem, index) => (
                  <motion.button
                    key={problem.id}
                    onClick={() => handleQuestionSelect(index)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                      currentQuestionIndex === index
                        ? `bg-${roundInfo.color}-600/20 border border-${roundInfo.color}-400/50`
                        : 'bg-gray-800/50 border border-gray-600/30 hover:border-purple-400/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">Q{index + 1}</span>
                      {isQuestionSolved(problem.id) && (
                        <span className="text-green-400 text-lg">✓</span>
                      )}
                    </div>
                    <p className="text-sm text-purple-200 truncate">{problem.title}</p>
                    {problem.difficulty && (
                      <span className={`text-xs px-2 py-1 rounded mt-1 inline-block ${
                        problem.difficulty === 'Easy' ? 'bg-green-600/20 text-green-300' :
                        problem.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-300' :
                        'bg-red-600/20 text-red-300'
                      }`}>
                        {problem.difficulty}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Timer removed - focus on learning */}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-effect neon-border rounded-xl p-6"
              >
                {currentQuestion ? (
                  getRoundComponent()
                ) : (
                  <div className="text-center py-12">
                    <div className="text-yellow-400 text-xl mb-4">⚠️</div>
                    <h3 className="text-xl text-yellow-400 mb-2">No Question Found</h3>
                    <p className="text-gray-400">Current question index: {currentQuestionIndex}</p>
                    <p className="text-gray-400">Total questions: {levelProblems?.length || 0}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {showStory && (
          <StoryModal
            story={story}
            onClose={() => {
              setShowStory(false)
              navigate('/dashboard')
            }}
          />
        )}
      </div>
    </div>
  )
}

export default LevelPage
