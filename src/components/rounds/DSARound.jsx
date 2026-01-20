import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RippleButton from '../RippleButton'
import { useMotion } from '../../context/MotionContext'
import { useProgress } from '../../context/ProgressContext'

const DSARound = ({ question, onSolved, isAlreadySolved }) => {
  const { reducedMotion } = useMotion()
  const progressContext = useProgress()
  
  // Safely destructure with fallbacks
  const {
    markQuestionWrong = () => {},
    isQuestionInTimeout = () => false,
    getTimeoutRemaining = () => 0,
    hasAttemptedQuestion = () => false
  } = progressContext || {}

  const [selectedLanguage, setSelectedLanguage] = useState('python')
  const [code, setCode] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [timeoutCountdown, setTimeoutCountdown] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState(null)

  // Get the level and question IDs
  const levelId = question.type === 'DSA' ? (question.difficulty === 'Easy' ? 4 : 5) : 4
  const questionId = question.id

  useEffect(() => {
    // Reset state when question changes
    setCode(question.starterCode[selectedLanguage] || '')
    setShowResult(false)
    setIsCorrect(false)
    setShowHints(false)
    setIsSubmitting(false)
    setSubmissionError(null)
    
    // Check if question is in timeout
    if (isQuestionInTimeout(levelId, questionId)) {
      setTimeoutCountdown(getTimeoutRemaining(levelId, questionId))
    } else {
      setTimeoutCountdown(0)
    }
  }, [question.id, selectedLanguage, isQuestionInTimeout, getTimeoutRemaining, levelId, questionId])

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

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language)
    setCode(question.starterCode[language] || '')
  }

  const handleSubmit = async () => {
    if (isDisabled || isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      // Import test cases
      const { testcases } = await import('../../data/testcases.js')
      const problemTestCases = testcases[questionId]
      
      if (!problemTestCases) {
        throw new Error(`No test cases found for problem: ${questionId}`)
      }

      // Call the API (local dev server or Vercel function)
      const response = await fetch('http://localhost:3003/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: selectedLanguage,
          problemId: questionId,
          testcases: problemTestCases
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.error) {
        throw new Error(result.error)
      }

      const correct = result.allPassed
      setIsCorrect(correct)
      setShowResult(true)

      if (correct) {
        setTimeout(() => {
          onSolved(question.id, true)
        }, 3000)
      } else {
        // Mark as wrong and start timeout
        markQuestionWrong(levelId, questionId)
        setTimeoutCountdown(10)
      }
    } catch (error) {
      console.error('Submission error:', error)
      setShowResult(true)
      setIsCorrect(false)
      // Show error in results
      setSubmissionError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setCode(question.starterCode[selectedLanguage] || '')
    setShowResult(false)
    setIsCorrect(false)
  }

  const getLanguageIcon = (lang) => {
    const icons = {
      python: '🐍',
      java: '☕',
      c: '⚡',
      cpp: '🔧'
    }
    return icons[lang] || '💻'
  }

  const getLanguageColor = (lang) => {
    const colors = {
      python: 'blue',
      java: 'orange',
      c: 'green',
      cpp: 'purple'
    }
    return colors[lang] || 'gray'
  }

  if (isAlreadySolved) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl mb-4"
        >
          🏆
        </motion.div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">Problem Solved!</h3>
        <p className="text-purple-300">You've already conquered this coding challenge.</p>
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
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            question.difficulty === 'Easy' ? 'bg-green-600/20 text-green-300' :
            'bg-yellow-600/20 text-yellow-300'
          }`}>
            {question.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-600/20 text-blue-300">
            LeetCode Style
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-600/20 text-purple-300">
            No Time Limit
          </span>
          {hasBeenAttempted && !isAlreadySolved && (
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-600/20 text-orange-300">
              Previously Attempted
            </span>
          )}
        </div>
      </div>

      {/* Problem Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-400/30"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Problem Description</h3>
        <p className="text-lg text-blue-100 leading-relaxed mb-4">{question.description}</p>
        
        {/* Examples */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-blue-300">Examples:</h4>
          {question.examples.map((example, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-blue-300 font-semibold">Input: </span>
                  <code className="text-green-400 bg-gray-900 px-2 py-1 rounded text-sm">{example.input}</code>
                </div>
                <div>
                  <span className="text-blue-300 font-semibold">Output: </span>
                  <code className="text-yellow-400 bg-gray-900 px-2 py-1 rounded text-sm">{example.output}</code>
                </div>
              </div>
              {example.explanation && (
                <div className="mt-2">
                  <span className="text-blue-300 font-semibold">Explanation: </span>
                  <span className="text-gray-300 text-sm">{example.explanation}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Constraints */}
        <div className="mt-4">
          <h4 className="text-lg font-semibold text-blue-300 mb-2">Constraints:</h4>
          <ul className="list-disc list-inside space-y-1">
            {question.constraints.map((constraint, index) => (
              <li key={index} className="text-gray-300 text-sm">{constraint}</li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Language Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 rounded-xl p-4 border border-gray-600"
      >
        <h3 className="text-lg font-semibold text-white mb-3">Choose Language:</h3>
        <div className="flex gap-2 flex-wrap">
          {Object.keys(question.starterCode).map((lang) => (
            <button
              key={lang}
              onClick={() => !isDisabled && handleLanguageChange(lang)}
              disabled={isDisabled}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                selectedLanguage === lang
                  ? `bg-${getLanguageColor(lang)}-600 text-white border-2 border-${getLanguageColor(lang)}-400`
                  : isDisabled
                  ? 'bg-gray-700 text-gray-400 border-2 border-gray-600 cursor-not-allowed'
                  : `bg-gray-700 hover:bg-${getLanguageColor(lang)}-700 text-gray-300 hover:text-white border-2 border-gray-600 hover:border-${getLanguageColor(lang)}-400`
              }`}
            >
              {getLanguageIcon(lang)} {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Code Editor */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-900 rounded-xl p-4 border border-gray-600"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Code Editor</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHints(!showHints)}
              className="px-3 py-1 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 rounded-lg text-sm transition-colors"
            >
              💡 {showHints ? 'Hide' : 'Show'} Hints
            </button>
            <button
              onClick={handleReset}
              disabled={isDisabled}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                isDisabled
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Hints */}
        <AnimatePresence>
          {showHints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4"
            >
              <h4 className="text-yellow-300 font-semibold mb-2">💡 Hints:</h4>
              <ul className="list-disc list-inside space-y-1">
                {question.hints.map((hint, index) => (
                  <li key={index} className="text-yellow-200 text-sm">{hint}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Code Textarea */}
        <div className="bg-black rounded-lg border border-gray-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400 text-sm font-mono">
              {getLanguageIcon(selectedLanguage)} {selectedLanguage}
            </span>
          </div>
          <textarea
            value={code}
            onChange={(e) => !isDisabled && setCode(e.target.value)}
            disabled={isDisabled}
            className={`w-full h-64 p-4 bg-black text-green-400 font-mono text-sm resize-none focus:outline-none ${
              isDisabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
            placeholder="Write your solution here..."
            spellCheck={false}
          />
        </div>
      </motion.div>

      {/* Submit Button */}
      {!showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center pt-4"
        >
          <RippleButton
            onClick={handleSubmit}
            disabled={isDisabled || isSubmitting || code.trim() === ''}
            className={`px-8 py-4 text-xl font-bold rounded-xl transition-all duration-300 ${
              isDisabled || isSubmitting || code.trim() === ''
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25'
            }`}
          >
            {isDisabled 
              ? `Wait ${timeoutCountdown}s...` 
              : isSubmitting 
              ? '🔄 Running Tests...' 
              : '🚀 Submit Solution'
            }
          </RippleButton>
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
                {isCorrect ? '🎉' : '❌'}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCorrect ? 'Solution Accepted!' : 'Solution Failed'}
              </h3>
              <p className={`text-lg ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                {isCorrect 
                  ? 'Excellent work! Your solution passed all test cases. Moving to next problem...' 
                  : `Your solution didn't pass all test cases. ${timeoutCountdown > 0 ? `You can try again in ${timeoutCountdown} seconds.` : 'Review your logic and try again!'}`
                }
              </p>
            </div>

            {/* Test Results */}
            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/50 mb-4">
              <h4 className="text-lg font-semibold text-white mb-2">Test Results:</h4>
              {submissionError ? (
                <div className="bg-red-900/20 text-red-300 p-3 rounded">
                  <strong>Error:</strong> {submissionError}
                </div>
              ) : (
                <div className="space-y-2">
                  {question.examples.map((example, index) => (
                    <div key={index} className={`flex items-center gap-2 p-2 rounded ${
                      isCorrect ? 'bg-green-900/20 text-green-300' : 'bg-red-900/20 text-red-300'
                    }`}>
                      <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <span className="text-sm">Test Case {index + 1}</span>
                      <span className="text-xs opacity-75">
                        {isCorrect ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  ))}
                  {!isCorrect && !submissionError && (
                    <div className="text-red-300 text-sm mt-2">
                      Some test cases failed. Check your logic and try again.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Timeout indicator */}
            {!isCorrect && timeoutCountdown > 0 && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mt-4">
                <div className="text-red-400 text-2xl mb-2 text-center">⏱️</div>
                <p className="text-red-300 font-semibold text-center">
                  Please wait {timeoutCountdown} seconds before trying again
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
                <RippleButton
                  onClick={() => {
                    setShowResult(false)
                    setIsCorrect(false)
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-semibold"
                >
                  🔄 Try Again
                </RippleButton>
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
            <h3 className="text-2xl font-bold text-red-400 mb-2">Solution Failed</h3>
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

export default DSARound