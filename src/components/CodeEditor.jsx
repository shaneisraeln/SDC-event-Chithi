import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { useProgress } from '../context/ProgressContext'
import F1Button from './F1Button'
import { testcases } from '../data/testcases'

const CodeEditor = ({ problem, levelId, onSolved }) => {
  const languageCatalog = [
    { id: 'python', name: 'Python', icon: '🐍', monacoLang: 'python' },
    { id: 'java', name: 'Java', icon: '☕', monacoLang: 'java' },
    { id: 'c', name: 'C', icon: '©️', monacoLang: 'c' },
    { id: 'cpp', name: 'C++', icon: '➕', monacoLang: 'cpp' }
  ]

  const placeholderFor = (langId) => {
    switch (langId) {
      case 'python':
        return '# Write your Python solution here'
      case 'java':
        return '// Write your Java solution here'
      case 'c':
        return '// Write your C solution here'
      case 'cpp':
        return '// Write your C++ solution here'
      default:
        return '// Write your code here'
    }
  }

  const allLanguages = languageCatalog

  const getDefaultLanguage = () => {
    if (problem?.starterCode?.python) return 'python'
    const first = problem?.starterCode ? Object.keys(problem.starterCode)[0] : null
    return first || allLanguages[0].id
  }

  const [language, setLanguage] = useState(getDefaultLanguage())
  const [code, setCode] = useState(
    problem?.starterCode?.[getDefaultLanguage()] || placeholderFor(getDefaultLanguage())
  )

  // Reset language/code when the problem changes
  useEffect(() => {
    const nextLang = getDefaultLanguage()
    setLanguage(nextLang)
    setCode(problem?.starterCode?.[nextLang] || placeholderFor(nextLang))
  }, [problem])
  const [testResults, setTestResults] = useState(null)
  const [isRunning, setIsRunning] = useState(false)
  const [showHints, setShowHints] = useState([false, false])
  const { progress, useHint } = useProgress()

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setCode(problem.starterCode[lang] || `// Write your ${lang} code here`)
  }

  const runTests = async () => {
    setIsRunning(true)
    setTestResults(null)

    try {
      const response = await fetch('http://localhost:3001/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          problemId: problem.id,
          testcases: testcases[problem.id]
        })
      })

      const results = await response.json()
      setTestResults(results)

      if (results.allPassed) {
        onSolved(problem.id)
      }
    } catch (error) {
      setTestResults({
        error: 'Failed to execute code. Make sure the server is running.',
        allPassed: false
      })
    } finally {
      setIsRunning(false)
    }
  }

  const revealHint = (index) => {
    const newShowHints = [...showHints]
    newShowHints[index] = true
    setShowHints(newShowHints)
    useHint(levelId, problem.id, index)
  }

  const isSolved = progress.solvedQuestions[`${levelId}-${problem.id}`]

  return (
    <div className="space-y-4">
      {/* Problem Description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="f1-card rounded-lg p-6 racing-stripes"
      >
        <div className="sponsor-logo"></div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-red-400 f1-typography">{problem.title}</h2>
          <span className={`px-3 py-1 rounded text-sm f1-body-text ${
            problem.difficulty === 'Easy' ? 'bg-f1-aston-green text-white' :
            problem.difficulty === 'Medium' ? 'bg-f1-pit-lane-yellow text-black' : 'bg-f1-racing-red text-white'
          }`}>
            {problem.difficulty}
          </span>
        </div>
        
        <p className="text-red-200 mb-4 f1-body-text">{problem.description}</p>
        
        <div className="space-y-3">
          <div>
            <h3 className="text-red-300 font-semibold mb-2 f1-typography">Race Examples:</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} className="carbon-fiber p-3 rounded mb-2 text-sm border border-f1-championship-gold">
                <p className="text-red-200 f1-body-text">Input: {ex.input}</p>
                <p className="text-red-200 f1-body-text">Output: {ex.output}</p>
                {ex.explanation && (
                  <p className="text-red-300 text-xs mt-1 f1-body-text">{ex.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-red-300 font-semibold mb-2 f1-typography">Circuit Constraints:</h3>
            <ul className="list-disc list-inside text-red-200 text-sm space-y-1 f1-body-text">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hints */}
        <div className="mt-4 space-y-2">
          <h3 className="text-red-300 font-semibold f1-typography">Pit Radio Hints:</h3>
          {problem.hints.map((hint, i) => (
            <div key={i}>
              {showHints[i] ? (
                <div className="bg-f1-pit-lane-yellow bg-opacity-30 p-3 rounded text-black text-sm f1-body-text border border-f1-championship-gold">
                  💡 {hint}
                </div>
              ) : (
                <F1Button
                  onClick={() => revealHint(i)}
                  className="px-3 py-1 rounded text-sm"
                  variant="penalty"
                >
                  Reveal Hint {i + 1} (Time Penalty)
                </F1Button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Code Editor */}
      <div className="f1-panel rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-f1-carbon-black via-f1-racing-red/20 to-f1-carbon-black p-2 md:p-4 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-f1-championship-gold/30 racing-stripes gap-4">
          <div className="flex gap-1 md:gap-2 flex-wrap w-full md:w-auto">
            {allLanguages.map(lang => (
              <F1Button
                key={lang.id}
                onClick={() => handleLanguageChange(lang.id)}
                className={`px-2 md:px-4 py-1 md:py-2 rounded-lg font-semibold flex items-center gap-1 md:gap-2 text-sm md:text-base ${
                  language === lang.id ? '' : 'opacity-70'
                }`}
                variant={language === lang.id ? 'victory' : 'normal'}
              >
                <span className="text-xs md:text-base">{lang.icon}</span>
                <span className="hidden sm:inline">{lang.name}</span>
                <span className="sm:hidden">{lang.id.toUpperCase()}</span>
              </F1Button>
            ))}
          </div>
          
          <F1Button
            onClick={runTests}
            disabled={isRunning || isSolved}
            className="px-3 md:px-4 py-2 rounded font-semibold text-sm md:text-base w-full md:w-auto"
            variant={isSolved ? 'victory' : 'normal'}
          >
            {isRunning ? '🏎️ Racing...' : isSolved ? '🏆 Victory!' : '🏁 Start Race'}
          </F1Button>
        </div>

        <Editor
          height="300px md:450px"
          language={allLanguages.find(l => l.id === language)?.monacoLang || 'python'}
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
          options={{
            minimap: { enabled: window.innerWidth > 768 },
            fontSize: window.innerWidth > 768 ? 15 : 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: 'Fira Code, Consolas, monospace',
            fontLigatures: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 },
            wordWrap: window.innerWidth < 768 ? 'on' : 'off'
          }}
        />
      </div>

      {/* Test Results */}
      {testResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="f1-card rounded-lg p-4 racing-stripes"
        >
          <div className="sponsor-logo"></div>
          <h3 className="text-xl font-bold mb-3 text-red-400 f1-typography">
            🏁 Race Results
          </h3>
          
          {testResults.error ? (
            <div className="bg-f1-racing-red bg-opacity-30 p-3 rounded text-red-200 f1-body-text border border-f1-racing-red">
              ❌ Technical Difficulty: {testResults.error}
            </div>
          ) : (
            <div className="space-y-2">
              {testResults.results?.map((result, i) => (
                <div
                  key={i}
                  className={`p-3 rounded border ${
                    result.passed 
                      ? 'bg-f1-aston-green bg-opacity-30 border-f1-aston-green' 
                      : 'bg-f1-racing-red bg-opacity-30 border-f1-racing-red'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`f1-body-text ${result.passed ? 'text-green-300' : 'text-red-300'}`}>
                      {result.passed ? '🏆' : '🚩'} Lap {i + 1}
                    </span>
                  </div>
                  {!result.passed && result.error && (
                    <p className="text-red-200 text-sm mt-1 f1-body-text">{result.error}</p>
                  )}
                </div>
              ))}
              
              {testResults.allPassed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-f1-championship-gold p-4 rounded text-center text-black font-bold text-lg f1-typography border-2 border-f1-racing-red"
                >
                  🏁 Checkered Flag! Perfect Lap!
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default CodeEditor
