import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import F1Button from '../F1Button'
import { useMotion } from '../../context/MotionContext'
import { useProgress } from '../../context/ProgressContext'

const MCQRound = ({ question, onSolved, isAlreadySolved }) => {
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
  const [timeoutCountdown, setTimeoutCountdown] = useState(0)

  // Get the level and question IDs
  const levelId = 1 // MCQ is always level 1
  const questionId = question.id

  useEffect(() => {
    // Reset state when question changes
    setSelectedOption(null)
    setShowResult(false)
    setIsCorrect(false)
    
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
            // Timeout finished, check current status
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
    
    // Only show result if correct OR if this is the first attempt
    if (correct || !hasBeenAttempted) {
      setShowResult(true)
    }

    if (correct) {
      setTimeout(() => {
        onSolved(question.id, true)
      }, 2000)
    } else {
      // Mark as wrong and start timeout
      markQuestionWrong(levelId, questionId)
      setTimeoutCountdown(10)
      
      // For wrong answers on retry, don't show the result details
      if (hasBeenAttempted) {
        // Just show timeout, no result details
        setShowResult(false)
      } else {
        // First attempt, show result
        setShowResult(true)
      }
    }
  }

  const handleRetry = () => {
    setSelectedOption(null)
    setShowResult(false)
    setIsCorrect(false)
  }

  const getOptionLetter = (index) => String.fromCharCode(65 + index) // A, B, C, D

  if (isAlreadySolved) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl mb-4"
        >
          ✅
        </motion.div>
        <h3 className="text-2xl font-bold text-red-400 mb-2">Circuit Already Conquered!</h3>
        <p className="text-purple-300">You've already mastered this racing challenge.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Question Header */}
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
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-emerald-600/20 text-emerald-300">
            No Lap Time Limit
          </span>
        </div>
      </div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-6 border border-purple-400/30"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Racing Challenge:</h3>
        <p className="text-lg text-purple-100 leading-relaxed">{question.question}</p>
      </motion.div>

      {/* Options */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-3"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Choose your racing strategy:</h3>
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => !showResult && !isDisabled && setSelectedOption(index)}
            disabled={showResult || isDisabled}
            className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
              showResult && (isCorrect || !hasBeenAttempted)
                ? index === question.correct
                  ? 'border-green-500 bg-green-500/20 text-green-300'
                  : index === selectedOption && selectedOption !== question.correct
                  ? 'border-red-500 bg-red-500/20 text-red-300'
                  : 'border-gray-600 bg-gray-800/50 text-gray-400'
                : isDisabled
                ? 'border-gray-600 bg-gray-800/50 text-gray-400 cursor-not-allowed'
                : selectedOption === index
                ? 'border-emerald-400 bg-emerald-600/20 text-white'
                : 'border-gray-600 bg-gray-800/50 text-purple-200 hover:border-emerald-400/50 hover:bg-emerald-900/20'
            }`}
            whileHover={!showResult && !isDisabled ? { scale: 1.02 } : {}}
            whileTap={!showResult && !isDisabled ? { scale: 0.98 } : {}}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                showResult && (isCorrect || !hasBeenAttempted)
                  ? index === question.correct
                    ? 'border-green-500 bg-green-500 text-white'
                    : index === selectedOption && selectedOption !== question.correct
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-gray-500 text-gray-500'
                  : isDisabled
                  ? 'border-gray-500 text-gray-500'
                  : selectedOption === index
                  ? 'border-emerald-400 bg-emerald-600 text-white'
                  : 'border-gray-500 text-gray-300'
              }`}>
                {getOptionLetter(index)}
              </div>
              <span className="flex-1 text-lg">{option}</span>
              {showResult && (isCorrect || !hasBeenAttempted) && index === question.correct && (
                <div className="text-green-400 text-xl">✓</div>
              )}
              {showResult && (isCorrect || !hasBeenAttempted) && index === selectedOption && selectedOption !== question.correct && (
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
          transition={{ delay: 0.8 }}
          className="text-center pt-4"
        >
          <F1Button
            onClick={handleSubmit}
            disabled={selectedOption === null || isDisabled}
            className={`px-8 py-4 text-xl font-bold rounded-xl transition-all duration-300 ${
              selectedOption === null || isDisabled
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25'
            }`}
            variant="victory"
          >
            {isDisabled ? `Pit Stop ${timeoutCountdown}s...` : 'Cross Finish Line'}
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
                {isCorrect ? '🎉' : '💥'}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCorrect ? 'Pole Position Achieved!' : 'Pit Stop Required!'}
              </h3>
              <p className={`text-lg ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                {isCorrect 
                  ? 'Fastest lap recorded! Advancing to next racing challenge...' 
                  : `Technical difficulty occurred. ${timeoutCountdown > 0 ? `You can return to track in ${timeoutCountdown} seconds.` : ''}`
                }
              </p>
            </div>

            {/* Explanation - only show if answered correctly or first attempt */}
            {question.explanation && (isCorrect || !hasBeenAttempted) && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/50">
                <h4 className="text-lg font-semibold text-purple-300 mb-2">Race Analysis:</h4>
                <p className="text-purple-100 leading-relaxed">{question.explanation}</p>
              </div>
            )}

            {/* Retry Button for wrong answers */}
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

            {/* Timeout indicator */}
            {!isCorrect && timeoutCountdown > 0 && (
              <div className="text-center mt-4">
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
                  <div className="text-red-400 text-2xl mb-2">⏱️</div>
                  <p className="text-red-300 font-semibold">
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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeout indicator when result is not shown (for retry attempts) */}
      {!showResult && timeoutCountdown > 0 && hasBeenAttempted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900/20 border border-red-500/50 rounded-lg p-6"
        >
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⏱️</div>
            <h3 className="text-2xl font-bold text-red-400 mb-2">Incorrect Answer</h3>
            <p className="text-red-300 font-semibold mb-4">
              Please wait {timeoutCountdown} seconds before trying again
            </p>
            <div className="w-full bg-red-900/50 rounded-full h-3">
              <motion.div
                className="h-3 bg-red-500 rounded-full"
                animate={{ width: `${((10 - timeoutCountdown) / 10) * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default MCQRound