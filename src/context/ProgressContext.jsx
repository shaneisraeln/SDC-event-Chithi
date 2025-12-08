import { createContext, useContext, useState, useEffect } from 'react'

const ProgressContext = createContext()

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (!context) throw new Error('useProgress must be used within ProgressProvider')
  return context
}

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('chitti-progress')
    return saved ? JSON.parse(saved) : {
      completedLevels: [],
      solvedQuestions: {},
      hintsUsed: {},
      collectedClues: [],
      finalPasswordEntered: false
    }
  })

  useEffect(() => {
    localStorage.setItem('chitti-progress', JSON.stringify(progress))
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
      finalPasswordEntered: false
    }
    setProgress(emptyProgress)
    localStorage.setItem('chitti-progress', JSON.stringify(emptyProgress))
  }

  const exportProgress = () => {
    const dataStr = JSON.stringify(progress, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'chitti-progress.json'
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
