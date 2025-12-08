import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProgress } from '../context/ProgressContext'
import { problems, storySegments } from '../data/problems'
import CodeEditor from '../components/CodeEditor'
import StoryModal from '../components/StoryModal'
import TiltCard from '../components/TiltCard'
import RippleButton from '../components/RippleButton'

const LevelPage = () => {
  const { levelId } = useParams()
  const navigate = useNavigate()
  const { progress, markQuestionSolved, markLevelComplete } = useProgress()
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [showStory, setShowStory] = useState(false)

  const levelNumber = parseInt(levelId)
  const levelProblems = problems[levelNumber]
  const story = storySegments[levelNumber]

  useEffect(() => {
    if (levelProblems && levelProblems.length > 0) {
      setSelectedQuestion(levelProblems[0])
    }
  }, [levelId, levelProblems])

  // Safety net: if all questions are already solved (e.g., after a refresh)
  // and the level is not marked complete yet, mark it and surface the story/clue.
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

  const allQuestionsInLevelSolved = () => {
    return levelProblems.every(p => isQuestionSolved(p.id))
  }

  const handleQuestionSolved = (questionId) => {
    console.log('Question solved:', questionId)
    markQuestionSolved(levelNumber, questionId)
    
    // Check if this was the last question to solve
    const allSolved = levelProblems.every(p => {
      if (p.id === questionId) return true // This one just got solved
      return isQuestionSolved(p.id) // Check others
    })
    
    console.log('All questions solved?', allSolved)
    
    if (allSolved && !progress.completedLevels.includes(levelNumber)) {
      console.log('Showing story modal and marking level complete')
      setTimeout(() => {
        markLevelComplete(levelNumber, story.clue)
        setShowStory(true)
      }, 500)
    }
  }

  if (!levelProblems) {
    return <div className="text-white p-8">Level not found</div>
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <RippleButton
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-purple-700 text-white rounded neon-border mb-4"
          >
            ← Back to Dashboard
          </RippleButton>
          
          <h1 className="text-4xl font-bold text-purple-400 text-glow">
            Level {levelId}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Question List */}
          <div className="lg:col-span-1 space-y-3">
            {levelProblems.map((problem, index) => (
              <TiltCard
                key={problem.id}
                className={`p-4 rounded-lg glass-effect neon-border cursor-pointer ${
                  selectedQuestion?.id === problem.id ? 'bg-purple-900' : ''
                }`}
                onClick={() => setSelectedQuestion(problem)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 font-semibold">
                    Q{index + 1}
                  </span>
                  {isQuestionSolved(problem.id) && (
                    <span className="text-green-400">✓</span>
                  )}
                </div>
                <p className="text-sm text-purple-200 mt-1">{problem.title}</p>
              </TiltCard>
            ))}
          </div>

          {/* Code Editor */}
          <div className="lg:col-span-3">
            {selectedQuestion && (
              <CodeEditor
                problem={selectedQuestion}
                levelId={parseInt(levelId)}
                onSolved={handleQuestionSolved}
              />
            )}
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
