import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useMotion } from '../context/MotionContext'
import { F1_COLORS } from '../config/f1Theme'

const F1VictoryAnimation = ({ 
  isVisible = false, 
  onComplete,
  achievement = 'Victory!',
  points = 25,
  position = 1
}) => {
  const { reducedMotion } = useMotion()
  const [showConfetti, setShowConfetti] = useState(false)
  const [showPodium, setShowPodium] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const confettiTimer = setTimeout(() => setShowConfetti(true), 500)
      const podiumTimer = setTimeout(() => setShowPodium(true), 1000)
      const completeTimer = setTimeout(() => {
        onComplete?.()
        setShowConfetti(false)
        setShowPodium(false)
      }, 5000)

      return () => {
        clearTimeout(confettiTimer)
        clearTimeout(podiumTimer)
        clearTimeout(completeTimer)
      }
    }
  }, [isVisible, onComplete])

  const CheckeredFlag = () => (
    <motion.div
      className="w-32 h-20 relative"
      initial={{ scale: 0, rotate: -45 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
    >
      {/* Flag pole */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: F1_COLORS.CARBON_BLACK }}
      />
      
      {/* Checkered pattern */}
      <div className="absolute left-1 top-0 right-0 bottom-0 grid grid-cols-8 grid-rows-5">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className={`${
              (Math.floor(i / 8) + i) % 2 === 0 
                ? 'bg-white' 
                : 'bg-black'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.02 }}
          />
        ))}
      </div>
      
      {/* Flag wave animation */}
      {!reducedMotion && (
        <motion.div
          className="absolute left-1 top-0 right-0 bottom-0"
          animate={{
            transform: [
              'perspective(100px) rotateY(0deg)',
              'perspective(100px) rotateY(15deg)',
              'perspective(100px) rotateY(-10deg)',
              'perspective(100px) rotateY(0deg)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  )

  const Confetti = () => (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2"
          style={{
            backgroundColor: [
              F1_COLORS.CHAMPIONSHIP_GOLD,
              F1_COLORS.RACING_RED,
              F1_COLORS.PIT_LANE_YELLOW,
              '#FFFFFF'
            ][i % 4],
            left: `${Math.random() * 100}%`,
            top: '-10px'
          }}
          initial={{ y: -10, rotate: 0, opacity: 1 }}
          animate={!reducedMotion ? {
            y: window.innerHeight + 100,
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            opacity: [1, 1, 0],
            x: (Math.random() - 0.5) * 200
          } : { y: 50, opacity: 0 }}
          transition={{
            duration: 3 + Math.random() * 2,
            ease: "easeOut",
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  )

  const PodiumCeremony = () => (
    <motion.div
      className="flex items-end justify-center gap-4"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, type: "spring" }}
    >
      {/* Podium steps */}
      {[2, 1, 3].map((pos, index) => (
        <motion.div
          key={pos}
          className="flex flex-col items-center"
          initial={{ y: 50 }}
          animate={{ y: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          {/* Trophy */}
          {pos === position && (
            <motion.div
              className="mb-2"
              animate={!reducedMotion ? {
                y: [-5, 5, -5],
                rotate: [-2, 2, -2]
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div 
                className="w-8 h-10 rounded-t-full relative"
                style={{ backgroundColor: F1_COLORS.CHAMPIONSHIP_GOLD }}
              >
                <div 
                  className="absolute top-2 left-1 right-1 h-2 rounded"
                  style={{ backgroundColor: F1_COLORS.RACING_RED }}
                />
                <div 
                  className="absolute bottom-0 left-0 right-0 h-2"
                  style={{ backgroundColor: F1_COLORS.CARBON_BLACK }}
                />
              </div>
            </motion.div>
          )}
          
          {/* Podium step */}
          <div
            className={`w-16 rounded-t-lg flex items-center justify-center text-white font-bold ${
              pos === 1 ? 'h-20' : pos === 2 ? 'h-16' : 'h-12'
            }`}
            style={{
              backgroundColor: pos === 1 
                ? F1_COLORS.CHAMPIONSHIP_GOLD 
                : pos === 2 
                  ? F1_COLORS.MERCEDES_SILVER 
                  : '#CD7F32'
            }}
          >
            {pos}
          </div>
        </motion.div>
      ))}
    </motion.div>
  )

  const SparkleEffect = () => (
    <div className="absolute inset-0 pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: F1_COLORS.CHAMPIONSHIP_GOLD,
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`
          }}
          animate={!reducedMotion ? {
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180]
          } : {}}
          transition={{
            duration: 1.5,
            delay: Math.random() * 3,
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
        />
      ))}
    </div>
  )

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background racing elements */}
          <div className="absolute inset-0">
            {/* Racing track lines */}
            {!reducedMotion && [...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 opacity-20"
                style={{
                  backgroundColor: F1_COLORS.PIT_LANE_YELLOW,
                  top: `${20 + i * 15}%`,
                  left: '-100%',
                  right: '-100%'
                }}
                animate={{
                  x: ['0%', '200%']
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>

          {/* Main victory content */}
          <div className="relative text-center">
            {/* Victory title */}
            <motion.h1
              className="text-6xl md:text-8xl font-black mb-8"
              style={{
                background: `linear-gradient(135deg, ${F1_COLORS.CHAMPIONSHIP_GOLD}, ${F1_COLORS.RACING_RED}, ${F1_COLORS.CHAMPIONSHIP_GOLD})`,
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                backgroundPosition: !reducedMotion ? ['0% 50%', '100% 50%', '0% 50%'] : '0% 50%'
              }}
              transition={{ 
                scale: { duration: 0.8, type: "spring", bounce: 0.4 },
                rotate: { duration: 0.8, type: "spring", bounce: 0.4 },
                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
            >
              {achievement}
            </motion.h1>

            {/* Checkered flag */}
            <div className="flex justify-center mb-8">
              <CheckeredFlag />
            </div>

            {/* Achievement details */}
            <motion.div
              className="flex justify-center gap-8 mb-8 text-white"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: F1_COLORS.CHAMPIONSHIP_GOLD }}>
                  P{position}
                </div>
                <div className="text-sm">Position</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: F1_COLORS.RACING_RED }}>
                  {points}
                </div>
                <div className="text-sm">Points</div>
              </div>
            </motion.div>

            {/* Podium ceremony */}
            {showPodium && <PodiumCeremony />}
          </div>

          {/* Effects */}
          {showConfetti && <Confetti />}
          <SparkleEffect />

          {/* Victory sound visualization */}
          {!reducedMotion && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-1">
                {[...Array(7)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 rounded-full"
                    style={{ backgroundColor: F1_COLORS.RACING_RED }}
                    animate={{
                      height: [10, 30 + Math.random() * 20, 10]
                    }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default F1VictoryAnimation