import { motion } from 'framer-motion'
import { useState } from 'react'
import RippleButton from './RippleButton'
import { useMotion } from '../context/MotionContext'

const StoryModal = ({ story, onClose }) => {
  const [showClue, setShowClue] = useState(false)
  const { reducedMotion } = useMotion()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full glass-effect neon-border rounded-lg p-8 relative overflow-hidden"
      >
        {/* Holographic effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-600 via-transparent to-pink-600 opacity-20"
          animate={!reducedMotion ? {
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative z-10">
          <motion.h2
            className="text-4xl font-bold text-purple-400 text-glow mb-6 text-center"
            animate={!reducedMotion ? {
              textShadow: [
                '0 0 10px #a855f7',
                '0 0 20px #a855f7, 0 0 30px #a855f7',
                '0 0 10px #a855f7'
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {story.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-purple-200 text-lg leading-relaxed mb-8"
          >
            {story.content}
          </motion.p>

          {!showClue ? (
            <div className="text-center">
              <RippleButton
                onClick={() => setShowClue(true)}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xl font-bold neon-border"
              >
                Reveal Clue
              </RippleButton>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                className="inline-block w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-6xl font-bold neon-border mb-6"
                animate={!reducedMotion ? {
                  boxShadow: [
                    '0 0 20px #a855f7',
                    '0 0 40px #a855f7, 0 0 60px #ec4899',
                    '0 0 20px #a855f7'
                  ],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.2, rotate: 360 }}
              >
                {story.clue}
              </motion.div>

              <p className="text-purple-300 mb-6">
                Clue letter collected: <span className="text-2xl font-bold text-purple-400">{story.clue}</span>
              </p>

              <RippleButton
                onClick={onClose}
                className="px-8 py-3 bg-purple-700 text-white rounded-lg font-bold neon-border"
              >
                Continue
              </RippleButton>
            </motion.div>
          )}
        </div>

        {/* Particle effects */}
        {showClue && !reducedMotion && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-400 rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  opacity: 1
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  opacity: 0
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  repeat: Infinity
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </div>
  )
}

export default StoryModal
