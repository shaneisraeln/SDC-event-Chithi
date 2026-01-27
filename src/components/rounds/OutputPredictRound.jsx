import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import F1Button from '../F1Button'
import { useMotion } from '../../context/MotionContext'
import { useProgress } from '../../context/ProgressContext'

const OutputPredictRound = ({ question, onSolved, isAlreadySolved }) => {
  const { reducedMotion } = useMotion()
  const progressContext = useProgress()
  
  // Safely destructure with fallbacks
  const {
    markQuestionWrong = () => {},
    isQuestionInTimeout = () => false,
    getTimeoutRemaining = () => 0,
    hasAttemptedQuestion = () => false
  } = progressContext || {}

  const [selectedOption, setSelectedOption] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showTrace, setShowTrace] = useState(false)
  const [timeoutCountdown, setTimeoutCountdown] = useState(0)

  // Get the level and question IDs
  const levelId = 3 // Output Predict is always level 3
  const questionId = question.id

  useEffect(() => {
    // Reset state when question changes
    setSelectedOption(null)
    setShowResult(false)
    setIsCorrect(false)
    setShowTrace(false)
    
    // Check if question is in timeout
    if (isQuestionInTimeout(levelId, questionId)) {
      setTimeoutCountdown(getTimeoutRemaining(levelId, questionId))
    } else {
      setTimeoutCountdown(0)
    }
  }, [question.id, isQuestionInTimeout, getTimeoutRemaining, levelId, questionId])

  // Timeout countdown effect
  useEffect(() => {
    if (timeoutCountdown > 0) {
      const timer = setTimeout(() => {
        setTimeoutCountdown(prev => {
          const newCount = prev - 1
          if (newCount <= 0) {
            return 0
          }
          return newCount
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [timeoutCountdown])

  const isDisabled = timeoutCountdown > 0
  const hasBeenAttempted = hasAttemptedQuestion(levelId, questionId)

  const handleSubmit = () => {
    if (selectedOption === null || isDisabled) return

    const correct = selectedOption === question.correct
    setIsCorrect(correct)
    setShowTrace(true)

    if (correct) {
      setShowResult(true)
      setTimeout(() => {
        onSolved(question.id, true)
      }, 3000)
    } else {
      // Mark as wrong and start timeout
      markQuestionWrong(levelId, questionId)
      setTimeoutCountdown(10)
      
      // Only show result details for first attempt
      if (!hasBeenAttempted) {
        setShowResult(true)
      } else {
        setShowResult(false)
      }
    }
  }

  const handleRetry = () => {
    setSelectedOption(null)
    setShowResult(false)
    setIsCorrect(false)
    setShowTrace(false)
  }

  const getOptionLetter = (index) => String.fromCharCode(65 + index) // A, B, C, D

  const formatCode = (code) => {
    return code.split('\n').map((line, index) => (
      <div key={index} className="flex">
        <span className="text-gray-500 text-sm w-8 text-right mr-3 select-none">
          {index + 1}
        </span>
        <span className="text-green-400">{line}</span>
      </div>
    ))
  }

  if (isAlreadySolved) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl mb-4"
        >
          🔮
        </motion.div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">Strategy Mastered!</h3>
        <p className="text-purple-300">You've already predicted this race outcome correctly.</p>
        <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-600">
          <pre className="text-left font-mono">
            {formatCode(question.code)}
          </pre>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          {question.title}
        </motion.h2>
        <div className="flex items-center justify-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            question.difficulty === 'Easy' ? 'bg-green-600/20 text-green-300' :
            question.difficulty === 'Medium' ? 'bg-yellow-600/20 text-yellow-300' :
            'bg-red-600/20 text-red-300'
          }`}>
            {question.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-violet-600/20 text-violet-300">
            No Lap Time Limit
          </span>
        </div>
      </div>

      {/* Code Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 rounded-xl p-6 border border-violet-400/30"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Analyze this race simulation:</h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="bg-black rounded-lg p-4 border border-gray-700">
          <pre className="font-mono text-sm overflow-x-auto">
            {formatCode(question.code)}
          </pre>
        </div>
      </motion.div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-violet-900/20 to-purple-900/20 rounded-xl p-6 border border-violet-400/30"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Strategy Prediction Challenge:</h3>
          {hasBeenAttempted && !isAlreadySolved && (
            <div className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-lg text-sm">
              Previously Attempted
            </div>
          )}
        </div>
        <p className="text-lg text-violet-100 leading-relaxed">{question.question}</p>
        
        {hasBeenAttempted && !showResult && (
          <div className="mt-4 bg-orange-900/20 border border-orange-500/50 rounded-lg p-3">
            <p className="text-orange-300 text-sm text-center">
              🤔 You've tried this before. Trace through the race simulation step by step!
            </p>
          </div>
        )}
      </motion.div>

      {/* Options */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <h3 className="text-xl font-semibold text-white mb-4">What will be the race simulation output?</h3>
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => !showResult && !isDisabled && setSelectedOption(index)}
            disabled={showResult || isDisabled}
            className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
              showResult
                ? index === question.correct
                  ? 'border-green-500 bg-green-500/20 text-green-300'
                  : index === selectedOption && selectedOption !== question.correct
                  ? 'border-red-500 bg-red-500/20 text-red-300'
                  : 'border-gray-600 bg-gray-800/50 text-gray-400'
                : isDisabled
                ? 'border-gray-600 bg-gray-800/50 text-gray-400 cursor-not-allowed'
                : selectedOption === index
                ? 'border-violet-400 bg-violet-600/20 text-white'
                : 'border-gray-600 bg-gray-800/50 text-violet-200 hover:border-violet-400/50 hover:bg-violet-900/20'
            }`}
            whileHover={!showResult && !isDisabled ? { scale: 1.02 } : {}}
            whileTap={!showResult && !isDisabled ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                showResult
                  ? index === question.correct
                    ? 'border-green-500 bg-green-500 text-white'
                    : index === selectedOption && selectedOption !== question.correct
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-gray-500 text-gray-500'
                  : isDisabled
                  ? 'border-gray-500 text-gray-500'
                  : selectedOption === index
                  ? 'border-violet-400 bg-violet-600 text-white'
                  : 'border-gray-500 text-gray-300'
              }`}>
                {getOptionLetter(index)}
              </div>
              <div className="flex-1">
                <pre className="font-mono text-lg whitespace-pre-wrap">{option}</pre>
              </div>
              {showResult && index === question.correct && (
                <div className="text-green-400 text-xl">✓</div>
              )}
              {showResult && index === selectedOption && selectedOption !== question.correct && (
                <div className="text-red-400 text-xl">✗</div>
              )}
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Submit Button */}
      {!showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center pt-4"
        >
          <F1Button
            onClick={handleSubmit}
            disabled={selectedOption === null || isDisabled}
            className={`px-8 py-4 text-xl font-bold rounded-xl transition-all duration-300 ${
              selectedOption === null || isDisabled
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/25'
            }`}
            variant="victory"
          >
            {isDisabled ? `Pit Stop ${timeoutCountdown}s...` : '🔮 Predict Race Outcome'}
          </F1Button>
        </motion.div>
      )}

      {/* Result */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`rounded-xl p-6 border-2 ${
              isCorrect
                ? 'border-green-500 bg-green-500/10'
                : 'border-red-500 bg-red-500/10'
            }`}
          >
            <div className="text-center mb-4">
              <div className={`text-6xl mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '🎯' : '🔮'}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCorrect ? 'Perfect Strategy Prediction!' : 'Strategy Miscalculation!'}
              </h3>
              <p className={`text-lg ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                {isCorrect 
                  ? 'You traced through the race simulation perfectly! Advancing to next circuit...' 
                  : `Incorrect prediction. ${timeoutCountdown > 0 ? `You can return to track in ${timeoutCountdown} seconds.` : ''}`
                }
              </p>
            </div>

            {/* Explanation - only show if correct or first attempt */}
            {question.explanation && (!hasBeenAttempted || isCorrect) && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/50">
                <h4 className="text-lg font-semibold text-violet-300 mb-2">Race Simulation Trace:</h4>
                <p className="text-violet-100 leading-relaxed">{question.explanation}</p>
              </div>
            )}

            {/* Show correct output only if correct */}
            {isCorrect && (
              <div className="mt-4 bg-black rounded-lg p-4 border border-gray-700">
                <h4 className="text-lg font-semibold text-green-300 mb-2">Actual Race Output:</h4>
                <pre className="text-green-400 font-mono text-lg">
                  {question.options[question.correct]}
                </pre>
              </div>
            )}

            {/* Timeout indicator */}
            {!isCorrect && timeoutCountdown > 0 && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mt-4">
                <div className="text-red-400 text-2xl mb-2 text-center">⏱️</div>
                <p className="text-red-300 font-semibold text-center">
                  Please wait {timeoutCountdown} seconds before returning to track
                </p>
                <div className="w-full bg-red-900/50 rounded-full h-2 mt-3">
                  <motion.div
                    className="h-2 bg-red-500 rounded-full"
                    animate={{ width: `${((10 - timeoutCountdown) / 10) * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>
            )}

            {/* Try Again Button */}
            {!isCorrect && timeoutCountdown === 0 && !isDisabled && (
              <div className="text-center mt-4">
                <F1Button
                  onClick={handleRetry}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-semibold"
                  variant="normal"
                >
                  🔄 Return to Track
                </F1Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default OutputPredictRound