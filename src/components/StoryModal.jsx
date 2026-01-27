import { motion } from 'framer-motion'
import { useState } from 'react'
import F1Button from './F1Button'
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
        style={{
          background: 'linear-gradient(135deg, #1C1C1C 0%, #DC143C 50%, #1C1C1C 100%)',
          borderColor: '#FFD700'
        }}
      >
        {/* Pit garage aesthetic background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-red-600 via-transparent to-yellow-600 opacity-20"
          animate={!reducedMotion ? {
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Racing stripes */}
        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-yellow-400 opacity-30" />
        <div className="absolute top-0 right-1/4 w-0.5 h-full bg-yellow-400 opacity-30" />

        <div className="relative z-10">
          <motion.h2
            className="text-4xl font-bold text-red-400 text-glow mb-6 text-center"
            animate={!reducedMotion ? {
              textShadow: [
                '0 0 10px #DC143C',
                '0 0 20px #DC143C, 0 0 30px #DC143C',
                '0 0 10px #DC143C'
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🏁 PIT RADIO: {story.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-red-200 text-lg leading-relaxed mb-8"
          >
            {story.content}
          </motion.p>

          {!showClue ? (
            <div className="text-center">
              <F1Button
                onClick={() => setShowClue(true)}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg text-xl font-bold neon-border"
                variant="victory"
              >
                🏆 Reveal Championship Clue
              </F1Button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                className="inline-block w-32 h-32 bg-gradient-to-br from-red-600 to-yellow-600 rounded-lg flex items-center justify-center text-6xl font-bold neon-border mb-6"
                style={{ borderColor: '#FFD700' }}
                animate={!reducedMotion ? {
                  boxShadow: [
                    '0 0 20px #DC143C',
                    '0 0 40px #DC143C, 0 0 60px #FFD700',
                    '0 0 20px #DC143C'
                  ],
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ scale: 1.2, rotate: 360 }}
              >
                {story.clue}
              </motion.div>

              <p className="text-red-300 mb-6">
                Championship clue collected: <span className="text-2xl font-bold text-yellow-400">{story.clue}</span>
              </p>

              <F1Button
                onClick={onClose}
                className="px-8 py-3 bg-red-700 text-white rounded-lg font-bold neon-border"
                variant="normal"
              >
                🏎️ Return to Track
              </F1Button>
            </motion.div>
          )}
        </div>

        {/* Pit crew activity particles */}
        {showClue && !reducedMotion && (
          <>
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
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
