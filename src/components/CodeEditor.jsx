import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { useProgress } from '../context/ProgressContext'
import RippleButton from './RippleButton'
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
        className="glass-effect neon-border rounded-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-purple-400">{problem.title}</h2>
          <span className={`px-3 py-1 rounded text-sm ${
            problem.difficulty === 'Easy' ? 'bg-green-700' :
            problem.difficulty === 'Medium' ? 'bg-yellow-700' : 'bg-red-700'
          }`}>
            {problem.difficulty}
          </span>
        </div>
        
        <p className="text-purple-200 mb-4">{problem.description}</p>
        
        <div className="space-y-3">
          <div>
            <h3 className="text-purple-300 font-semibold mb-2">Examples:</h3>
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-gray-800 p-3 rounded mb-2 text-sm">
                <p className="text-purple-200">Input: {ex.input}</p>
                <p className="text-purple-200">Output: {ex.output}</p>
                {ex.explanation && (
                  <p className="text-purple-300 text-xs mt-1">{ex.explanation}</p>
                )}
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-purple-300 font-semibold mb-2">Constraints:</h3>
            <ul className="list-disc list-inside text-purple-200 text-sm space-y-1">
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hints */}
        <div className="mt-4 space-y-2">
          <h3 className="text-purple-300 font-semibold">Hints:</h3>
          {problem.hints.map((hint, i) => (
            <div key={i}>
              {showHints[i] ? (
                <div className="bg-yellow-900 bg-opacity-30 p-3 rounded text-yellow-200 text-sm">
                  💡 {hint}
                </div>
              ) : (
                <RippleButton
                  onClick={() => revealHint(i)}
                  className="px-3 py-1 bg-gray-700 text-purple-300 rounded text-sm"
                >
                  Reveal Hint {i + 1} (Penalty)
                </RippleButton>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Code Editor */}
      <div className="glass-effect neon-border rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900 p-4 flex items-center justify-between border-b border-purple-500/30">
          <div className="flex gap-2 flex-wrap">
            {allLanguages.map(lang => (
              <button
                key={lang.id}
                onClick={() => handleLanguageChange(lang.id)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                  language === lang.id 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 scale-105' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{lang.icon}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
          
          <RippleButton
            onClick={runTests}
            disabled={isRunning || isSolved}
            className={`px-4 py-2 rounded font-semibold ${
              isSolved ? 'bg-green-700' : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isRunning ? 'Running...' : isSolved ? '✓ Solved' : 'Run Tests'}
          </RippleButton>
        </div>

        <Editor
          height="450px"
          language={allLanguages.find(l => l.id === language)?.monacoLang || 'python'}
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            fontFamily: 'Fira Code, Consolas, monospace',
            fontLigatures: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            smoothScrolling: true,
            padding: { top: 16, bottom: 16 }
          }}
        />
      </div>

      {/* Test Results */}
      {testResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect neon-border rounded-lg p-4"
        >
          <h3 className="text-xl font-bold mb-3 text-purple-400">
            Test Results
          </h3>
          
          {testResults.error ? (
            <div className="bg-red-900 bg-opacity-30 p-3 rounded text-red-200">
              ❌ {testResults.error}
            </div>
          ) : (
            <div className="space-y-2">
              {testResults.results?.map((result, i) => (
                <div
                  key={i}
                  className={`p-3 rounded ${
                    result.passed ? 'bg-green-900 bg-opacity-30' : 'bg-red-900 bg-opacity-30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={result.passed ? 'text-green-300' : 'text-red-300'}>
                      {result.passed ? '✓' : '✗'} Test Case {i + 1}
                    </span>
                  </div>
                  {!result.passed && result.error && (
                    <p className="text-red-200 text-sm mt-1">{result.error}</p>
                  )}
                </div>
              ))}
              
              {testResults.allPassed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-green-700 p-4 rounded text-center text-white font-bold text-lg"
                >
                  🎉 All Tests Passed!
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
