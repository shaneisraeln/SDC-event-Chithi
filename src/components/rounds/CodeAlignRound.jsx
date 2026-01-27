import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import F1Button from '../F1Button'
import { useMotion } from '../../context/MotionContext'
import { useProgress } from '../../context/ProgressContext'

// Sortable Item Component
const SortableItem = ({ id, line, index, disabled = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-lg border transition-all duration-200 ${
        disabled
          ? 'border-gray-600 bg-gray-700/50 opacity-50 cursor-not-allowed'
          : isDragging
          ? 'border-orange-400 bg-orange-400/20 shadow-lg shadow-orange-400/25 z-50'
          : 'border-gray-500 bg-gray-700 hover:border-orange-400/50'
      }`}
      {...attributes}
      {...(disabled ? {} : listeners)}
    >
      <div className="flex items-center gap-3">
        <div className="text-gray-400 text-sm font-mono w-6 text-center">
          {index + 1}
        </div>
        <div className={`${disabled ? 'text-gray-500' : 'text-orange-300'} ${disabled ? 'cursor-not-allowed' : 'cursor-move'}`}>
          ⋮⋮
        </div>
        <code className="text-green-400 font-mono flex-1">{line.content}</code>
      </div>
    </div>
  )
}

const CodeAlignRound = ({ question, onSolved, isAlreadySolved }) => {
  const { reducedMotion } = useMotion()
  const progressContext = useProgress()
  
  // Safely destructure with fallbacks
  const {
    markQuestionWrong = () => {},
    isQuestionInTimeout = () => false,
    getTimeoutRemaining = () => 0,
    hasAttemptedQuestion = () => false
  } = progressContext || {}

  const [lines, setLines] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [timeoutCountdown, setTimeoutCountdown] = useState(0)

  // Get the level and question IDs
  const levelId = 2 // Code Align is always level 2
  const questionId = question.id

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    // Initialize with jumbled lines
    const initialLines = question.jumbledLines.map((line, index) => ({
      id: `line-${index}`,
      content: line,
      originalIndex: index
    }))
    setLines(initialLines)
    setShowResult(false)
    setIsCorrect(false)
    setShowCode(false)
    
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

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setLines((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const checkSolution = () => {
    if (isDisabled) return
    
    const currentOrder = lines.map(line => line.originalIndex)
    const correctOrder = question.correctOrder
    const correct = JSON.stringify(currentOrder) === JSON.stringify(correctOrder)
    
    setIsCorrect(correct)
    setShowCode(true)

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

  const resetCode = () => {
    if (isDisabled) return
    
    const initialLines = question.jumbledLines.map((line, index) => ({
      id: `line-${index}`,
      content: line,
      originalIndex: index
    }))
    setLines(initialLines)
    setShowResult(false)
    setShowCode(false)
  }

  const getCorrectCode = () => {
    return question.correctOrder.map(index => question.jumbledLines[index]).join('\n')
  }

  const getCurrentCode = () => {
    return lines.map(line => line.content).join('\n')
  }

  if (isAlreadySolved) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl mb-4"
        >
          🔧
        </motion.div>
        <h3 className="text-2xl font-bold text-green-400 mb-2">Setup Configuration Complete!</h3>
        <p className="text-purple-300">You've already solved this technical challenge.</p>
        <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-600">
          <pre className="text-green-400 text-left">
            <code>{getCorrectCode()}</code>
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
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-orange-600/20 text-orange-300">
            {question.language.toUpperCase()}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-600/20 text-blue-300">
            No Lap Time Limit
          </span>
        </div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-orange-900/20 to-red-900/20 rounded-xl p-6 border border-orange-400/30"
      >
        <h3 className="text-xl font-semibold text-white mb-2">Racing Mission:</h3>
        <p className="text-lg text-orange-100 leading-relaxed">{question.description}</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-orange-300 font-semibold">Expected Output: </span>
            <code className="text-green-400 bg-gray-800 px-2 py-1 rounded">{question.expectedOutput}</code>
          </div>
          <div>
            <span className="text-orange-300 font-semibold">Race Data Input: </span>
            <code className="text-blue-400 bg-gray-800 px-2 py-1 rounded">{question.testInput}</code>
          </div>
        </div>
      </motion.div>

      {/* Drag and Drop Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-900 rounded-xl p-6 border border-gray-600"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Drag setup lines to fix the race configuration:</h3>
          <div className="flex gap-2">
            {hasBeenAttempted && !isAlreadySolved && (
              <div className="px-3 py-1 bg-orange-600/20 text-orange-300 rounded-lg text-sm">
                Previously Attempted
              </div>
            )}
            <F1Button
              onClick={resetCode}
              disabled={isDisabled}
              className={`px-4 py-2 rounded-lg text-sm ${
                isDisabled 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              variant="pit_stop"
            >
              🔄 Pit Stop Reset
            </F1Button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={lines.map(line => line.id)} strategy={verticalListSortingStrategy}>
            <div className={`space-y-2 min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-colors ${
              isDisabled 
                ? 'border-gray-600 bg-gray-800/30 opacity-50' 
                : 'border-gray-600 bg-gray-800/50'
            }`}>
              {lines.map((line, index) => (
                <SortableItem
                  key={line.id}
                  id={line.id}
                  line={line}
                  index={index}
                  disabled={isDisabled}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </motion.div>

      {/* Code Preview */}
      {showCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl p-6 border border-gray-600"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Your Race Setup:</h3>
          <pre className={`text-sm font-mono p-4 rounded-lg border ${
            isCorrect 
              ? 'border-green-500 bg-green-500/10 text-green-400' 
              : 'border-red-500 bg-red-500/10 text-red-400'
          }`}>
            <code>{getCurrentCode()}</code>
          </pre>
        </motion.div>
      )}

      {/* Submit Button */}
      {!showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center pt-4"
        >
          <F1Button
            onClick={checkSolution}
            disabled={isDisabled}
            className={`px-8 py-4 text-xl font-bold rounded-xl transition-all duration-300 ${
              isDisabled
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-lg shadow-orange-500/25'
            }`}
            variant="victory"
          >
            {isDisabled ? `Pit Stop ${timeoutCountdown}s...` : '🔧 Technical Inspection'}
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
                {isCorrect ? '🎉' : '🔧'}
              </div>
              <h3 className={`text-2xl font-bold mb-2 ${
                isCorrect ? 'text-green-400' : 'text-red-400'
              }`}>
                {isCorrect ? 'Technical Inspection Passed!' : 'Setup Configuration Error!'}
              </h3>
              <p className={`text-lg ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                {isCorrect 
                  ? 'Perfect! Your race setup runs flawlessly. Advancing to next circuit...' 
                  : `The setup configuration isn't optimal yet. ${timeoutCountdown > 0 ? `You can return to pit lane in ${timeoutCountdown} seconds.` : 'Try rearranging the setup lines!'}`
                }
              </p>
            </div>

            {/* Show correct solution only if not attempted before or if correct */}
            {!isCorrect && !hasBeenAttempted && (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/50">
                <h4 className="text-lg font-semibold text-orange-300 mb-2">Pit Crew Hint:</h4>
                <p className="text-orange-100">Try to think about the logical flow of the race setup.</p>
              </div>
            )}

            {/* Don't show solution if attempted wrong before */}
            {hasBeenAttempted && !isCorrect && !showResult && (
              <div className="bg-orange-900/20 border border-orange-500/50 rounded-lg p-4 mt-4">
                <div className="text-orange-400 text-2xl mb-2 text-center">🤔</div>
                <p className="text-orange-300 font-semibold text-center">
                  You've attempted this before. Think about the race setup structure!
                </p>
              </div>
            )}

            {/* Timeout indicator */}
            {!isCorrect && timeoutCountdown > 0 && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mt-4">
                <div className="text-red-400 text-2xl mb-2 text-center">⏱️</div>
                <p className="text-red-300 font-semibold text-center">
                  Please wait {timeoutCountdown} seconds before returning to pit lane
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
                  onClick={resetCode}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-semibold"
                  variant="normal"
                >
                  🔄 Return to Pit Lane
                </F1Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CodeAlignRound