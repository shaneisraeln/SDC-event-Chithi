import { motion } from 'framer-motion'
import { useState } from 'react'
import { useProgress } from '../context/ProgressContext'
import F1Button from './F1Button'
import { useMotion } from '../context/MotionContext'

const FinalPasswordModal = ({ clues, expectedPassword = 'TRACE', onClose, onSuccess }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const { markFinalPasswordEntered } = useProgress()
  const { reducedMotion } = useMotion()

  const orderedClues = Array.isArray(clues) ? [...clues] : []

  const handleSubmit = () => {
    if (password.trim().toUpperCase() === expectedPassword.toUpperCase()) {
      setSuccess(true)
      markFinalPasswordEntered()
      if (onSuccess) onSuccess()
    } else {
      setError(true)
      setTimeout(() => setError(false), 500)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="pit-stop-modal p-8 rounded-lg max-w-2xl w-full racing-stripes"
      >
        <div className="sponsor-logo"></div>

        {!success ? (
          <>
            <h2 className="text-4xl font-bold text-red-400 text-center mb-6 text-glow f1-typography">
              🏁 Championship Finale
            </h2>
            
            <p className="text-red-300 text-center mb-8 f1-body-text">
              You have conquered all circuits. Arrange the championship clues to claim your title.
            </p>

            <div className="flex justify-center gap-4 mb-8">
              {orderedClues.map((clue, index) => (
                <motion.div
                  key={index}
                  className="w-16 h-16 bg-gradient-to-br from-red-600 to-yellow-600 rounded-lg flex items-center justify-center text-3xl font-bold neon-border"
                  style={{ borderColor: '#FFD700' }}
                  animate={!reducedMotion ? {
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  whileHover={{ scale: 1.2, rotate: 360 }}
                >
                  {clue}
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ENTER CHAMPIONSHIP CODE..."
                className={`w-full px-4 py-3 f1-input rounded-lg text-center text-2xl uppercase ${
                  error ? 'animate-shake border-red-500' : ''
                }`}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              
              <div className="flex gap-4">
                <F1Button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-bold"
                  variant="victory"
                >
                  🏆 Claim Championship
                </F1Button>
                <F1Button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg"
                  variant="pit_stop"
                >
                  🏎️ Return to Pit
                </F1Button>
              </div>
            </div>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={!reducedMotion ? {
                scale: [1, 1.2, 1],
                rotate: [0, 360]
              } : {}}
              transition={{ duration: 2 }}
              className="text-8xl mb-6"
            >
              🏆
            </motion.div>
            <h2 className="text-5xl font-bold text-red-400 mb-4 text-glow">
              CHAMPIONSHIP WON!
            </h2>
            <p className="text-2xl text-red-300 mb-8">
              You are the F1 Racing Academy Champion!
            </p>
            <p className="text-yellow-400 mb-8">
              Championship code: <span className="text-3xl font-bold text-glow">{expectedPassword.toUpperCase()}</span>
            </p>
            <F1Button
              onClick={onClose}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg text-xl font-bold"
              variant="victory"
            >
              🏁 Return to Championship
            </F1Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default FinalPasswordModal
