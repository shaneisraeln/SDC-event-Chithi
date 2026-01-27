import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import F1Button from '../components/F1Button'
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
          <F1Button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-purple-700 text-white rounded neon-border mb-4"
            variant="pit_stop"
          >
            ← Back to Dashboard
          </F1Button>
          
          <h1 className="text-4xl font-bold text-red-400 text-glow mb-2 f1-typography">
            🏎️ Pit Lane CMS
          </h1>
          <p className="text-red-300 f1-body-text">
            Manage racing challenges and championship segments
          </p>
        </motion.div>

        <div className="flex gap-4 mb-6">
          <F1Button
            onClick={() => setActiveTab('problems')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'problems' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
            variant="normal"
          >
            Problems
          </F1Button>
          <F1Button
            onClick={() => setActiveTab('stories')}
            className={`px-6 py-3 rounded-lg font-semibold ${
              activeTab === 'stories' ? 'bg-purple-600' : 'bg-gray-700'
            }`}
            variant="normal"
          >
            Story Segments
          </F1Button>
        </div>

        {activeTab === 'problems' && (
          <TiltCard className="f1-panel rounded-lg p-6 racing-stripes">
            <div className="sponsor-logo"></div>
            <h2 className="text-2xl font-bold text-red-400 mb-4 f1-typography">
              🏁 Racing Challenge Management
            </h2>
            <p className="text-red-300 mb-4 f1-body-text">
              Edit racing challenges in: <code className="bg-f1-carbon-black px-2 py-1 rounded border border-f1-championship-gold">src/data/problems.js</code>
            </p>
            <p className="text-red-300 mb-4 f1-body-text">
              Edit test cases in: <code className="bg-f1-carbon-black px-2 py-1 rounded border border-f1-championship-gold">src/data/testcases.js</code>
            </p>
            <div className="carbon-fiber p-4 rounded text-sm text-red-200 border border-f1-championship-gold">
              <p className="mb-2 f1-typography">To add a new racing challenge:</p>
              <ol className="list-decimal list-inside space-y-1 f1-body-text">
                <li>Add challenge definition to problems.js</li>
                <li>Add test cases to testcases.js</li>
                <li>Add reference solution to server/solutions.js</li>
                <li>Restart the pit crew server</li>
              </ol>
            </div>
          </TiltCard>
        )}

        {activeTab === 'stories' && (
          <TiltCard className="f1-panel rounded-lg p-6 racing-stripes">
            <div className="sponsor-logo"></div>
            <h2 className="text-2xl font-bold text-red-400 mb-4 f1-typography">
              🏆 Championship Story Management
            </h2>
            <p className="text-red-300 mb-4 f1-body-text">
              Edit championship segments in: <code className="bg-f1-carbon-black px-2 py-1 rounded border border-f1-championship-gold">src/data/problems.js</code>
            </p>
            <div className="carbon-fiber p-4 rounded text-sm text-red-200 border border-f1-championship-gold">
              <p className="mb-2 f1-typography">Championship segment structure:</p>
              <pre className="bg-f1-carbon-black p-3 rounded overflow-x-auto border border-f1-championship-gold f1-body-text">
{`{
  title: 'Championship Title',
  content: 'Racing narrative...',
  clue: 'T',
  animation: 'victory-celebration'
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
