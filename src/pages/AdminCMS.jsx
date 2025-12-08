import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import RippleButton from '../components/RippleButton'
import TiltCard from '../components/TiltCard'

const AdminCMS = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('problems')

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <RippleButton
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-purple-700 text-white rounded neon-border mb-4"
          >
            ← Back to Dashboard
          </RippleButton>
          
          <h1 className="text-4xl font-bold text-purple-400 text-glow mb-2">
            Admin CMS
          </h1>
          <p className="text-purple-300">
            Manage problems and story segments
          </p>
        </motion.div>

        <div className="flex gap-4 mb-6">
          <RippleButton
            onClick={() => setActiveTab('problems')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'problems' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            Problems
          </RippleButton>
          <RippleButton
            onClick={() => setActiveTab('stories')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'stories' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            Story Segments
          </RippleButton>
        </div>

        {activeTab === 'problems' && (
          <TiltCard className="glass-effect neon-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              Problem Management
            </h2>
            <p className="text-purple-300 mb-4">
              Edit problems in: <code className="bg-gray-800 px-2 py-1 rounded">src/data/problems.js</code>
            </p>
            <p className="text-purple-300 mb-4">
              Edit testcases in: <code className="bg-gray-800 px-2 py-1 rounded">src/data/testcases.js</code>
            </p>
            <div className="bg-gray-800 p-4 rounded text-sm text-purple-200">
              <p className="mb-2">To add a new problem:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Add problem definition to problems.js</li>
                <li>Add testcases to testcases.js</li>
                <li>Add reference solution to server/solutions.js</li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </TiltCard>
        )}

        {activeTab === 'stories' && (
          <TiltCard className="glass-effect neon-border rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">
              Story Segment Management
            </h2>
            <p className="text-purple-300 mb-4">
              Edit story segments in: <code className="bg-gray-800 px-2 py-1 rounded">src/data/problems.js</code>
            </p>
            <div className="bg-gray-800 p-4 rounded text-sm text-purple-200">
              <p className="mb-2">Story segment structure:</p>
              <pre className="bg-gray-900 p-3 rounded overflow-x-auto">
{`{
  title: 'Story Title',
  content: 'Story narrative...',
  clue: 'T',
  animation: 'hologram-flicker'
}`}
              </pre>
            </div>
          </TiltCard>
        )}
      </div>
    </div>
  )
}

export default AdminCMS
