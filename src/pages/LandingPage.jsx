import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ChittiAvatar from '../components/ChittiAvatar'
import RippleButton from '../components/RippleButton'
import { useMotion } from '../context/MotionContext'

const LandingPage = () => {
  const navigate = useNavigate()
  const { reducedMotion, toggleReducedMotion } = useMotion()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <ChittiAvatar size="large" />
        
        <motion.h1
          className="text-6xl font-bold mt-8 mb-4 text-glow"
          style={{ color: '#a855f7' }}
          animate={!reducedMotion ? {
            textShadow: [
              '0 0 10px #a855f7',
              '0 0 20px #a855f7, 0 0 30px #a855f7',
              '0 0 10px #a855f7'
            ]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          CHITTI CHALLENGE
        </motion.h1>
        
        <p className="text-xl text-purple-300 mb-8 max-w-2xl">
          Face off against Chitti, the advanced AI robot, in a battle of intelligence.
          Solve 15 DSA challenges across 5 levels to unlock the final code.
        </p>

        <div className="space-y-4">
          <RippleButton
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xl font-semibold neon-border"
          >
            Start Challenge
          </RippleButton>

          <div className="flex items-center justify-center gap-4 mt-6">
            <label className="flex items-center gap-2 text-purple-300 cursor-pointer">
              <input
                type="checkbox"
                checked={reducedMotion}
                onChange={toggleReducedMotion}
                className="w-4 h-4"
              />
              <span>Reduce Motion</span>
            </label>
          </div>
        </div>

        <motion.div
          className="mt-12 text-purple-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>No login required • Progress saved locally</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LandingPage
