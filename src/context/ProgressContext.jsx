import { createContext, useContext, useState, useEffect } from 'react'

const ProgressContext = createContext()

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress must be used within ProgressProvider')
  return context
}

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = localStorage.getItem('code-prix-progress')
      const defaultProgress = {
        completedLevels: [],
        solvedQuestions: {},
        hintsUsed: {},
        collectedClues: [],
        finalPasswordEntered: false,
        wrongAnswers: {}, // Track wrong answers with timestamps
        questionAttempts: {} // Track number of attempts per question
      }
      
      if (saved) {
        const parsed = JSON.parse(saved)
        // Ensure new fields exist
        return {
          ...defaultProgress,
          ...parsed,
          wrongAnswers: parsed.wrongAnswers || {},
          questionAttempts: parsed.questionAttempts || {}
        }
      }
      
      return defaultProgress
    } catch (error) {
      console.error('Error loading progress:', error)
      return {
        completedLevels: [],
        solvedQuestions: {},
        hintsUsed: {},
        collectedClues: [],
        finalPasswordEntered: false,
        wrongAnswers: {},
        questionAttempts: {}
      }
    }
  })

  useEffect(() => {
    localStorage.setItem('code-prix-progress', JSON.stringify(progress))
  }, [progress])

  const markQuestionSolved = (levelId, questionId) => {
    setProgress(prev => ({
      ...prev,
      solvedQuestions: {
        ...prev.solvedQuestions,
        [`${levelId}-${questionId}`]: true
      }
    }))
  }

  const markQuestionWrong = (levelId, questionId) => {
    const key = `${levelId}-${questionId}`
    const now = Date.now()
    setProgress(prev => ({
      ...prev,
      wrongAnswers: {
        ...prev.wrongAnswers,
        [key]: now
      },
      questionAttempts: {
        ...prev.questionAttempts,
        [key]: (prev.questionAttempts[key] || 0) + 1
      }
    }))
  }

  const isQuestionInTimeout = (levelId, questionId) => {
    const key = `${levelId}-${questionId}`
    const wrongTime = progress.wrongAnswers[key]
    if (!wrongTime) return false
    
    const timeElapsed = Date.now() - wrongTime
    const timeoutDuration = 10000 // 10 seconds
    return timeElapsed < timeoutDuration
  }

  const getTimeoutRemaining = (levelId, questionId) => {
    const key = `${levelId}-${questionId}`
    const wrongTime = progress.wrongAnswers[key]
    if (!wrongTime) return 0
    
    const timeElapsed = Date.now() - wrongTime
    const timeoutDuration = 10000 // 10 seconds
    const remaining = Math.max(0, timeoutDuration - timeElapsed)
    return Math.ceil(remaining / 1000) // Return seconds
  }

  const hasAttemptedQuestion = (levelId, questionId) => {
    const key = `${levelId}-${questionId}`
    return (progress.questionAttempts[key] || 0) > 0
  }

  const markLevelComplete = (levelId, clue) => {
    setProgress(prev => ({
      ...prev,
      completedLevels: [...new Set([...prev.completedLevels, levelId])],
      collectedClues: [...new Set([...prev.collectedClues, clue])]
    }))
  }

  const useHint = (levelId, questionId, hintIndex) => {
    const key = `${levelId}-${questionId}-${hintIndex}`
    setProgress(prev => ({
      ...prev,
      hintsUsed: {
        ...prev.hintsUsed,
        [key]: true
      }
    }))
  }

  const markFinalPasswordEntered = () => {
    setProgress(prev => ({ ...prev, finalPasswordEntered: true }))
  }

  const resetProgress = () => {
    const emptyProgress = {
      completedLevels: [],
      solvedQuestions: {},
      hintsUsed: {},
      collectedClues: [],
      finalPasswordEntered: false,
      wrongAnswers: {},
      questionAttempts: {}
    }
    setProgress(emptyProgress)
    localStorage.setItem('code-prix-progress', JSON.stringify(emptyProgress))
  }

  const exportProgress = () => {
    const dataStr = JSON.stringify(progress, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'code-prix-progress.json'
    link.click()
  }

  const importProgress = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result)
        setProgress(imported)
      } catch (err) {
        alert('Invalid progress file')
      }
    }
    reader.readAsText(file)
  }

  return (
    <ProgressContext.Provider value={{
      progress,
      markQuestionSolved,
      markQuestionWrong,
      isQuestionInTimeout,
      getTimeoutRemaining,
      hasAttemptedQuestion,
      markLevelComplete,
      useHint,
      markFinalPasswordEntered,
      resetProgress,
      exportProgress,
      importProgress
    }}>
      {children}
    </ProgressContext.Provider>
  )
}
