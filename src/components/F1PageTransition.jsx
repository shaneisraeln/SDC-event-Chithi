import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useMotion } from '../context/MotionContext'
import { F1_COLORS } from '../config/f1Theme'

const F1PageTransition = ({ children }) => {
  const location = useLocation()
  const { reducedMotion } = useMotion()

  // Racing-themed transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      x: reducedMotion ? 0 : 100,
      scale: reducedMotion ? 1 : 0.95,
      filter: reducedMotion ? 'none' : 'blur(10px)'
    },
    in: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0px)'
    },
    out: {
      opacity: 0,
      x: reducedMotion ? 0 : -100,
      scale: reducedMotion ? 1 : 1.05,
      filter: reducedMotion ? 'none' : 'blur(10px)'
    }
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: reducedMotion ? 0.3 : 0.8
  }

  // Speed lines overlay during transition
  const SpeedLinesOverlay = () => (
    <motion.div
      className="fixed inset-0 pointer-events-none z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {!reducedMotion && [...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 bg-white opacity-60"
          style={{
            top: `${10 + i * 7}%`,
            right: '-20px',
            width: '100px'
          }}
          initial={{ x: 0, opacity: 0 }}
          animate={{ 
            x: [-100, -window.innerWidth - 100],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.03,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  )

  // Racing car transition effect
  const RacingCarTransition = () => (
    <motion.div
      className="fixed top-1/2 -translate-y-1/2 z-50 pointer-events-none"
      initial={{ x: -200 }}
      animate={{ x: window.innerWidth + 200 }}
      exit={{ x: window.innerWidth + 200 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <div className="relative">
        {/* Racing car body */}
        <div 
          className="w-20 h-8 rounded-sm relative"
          style={{ backgroundColor: F1_COLORS.RACING_RED }}
        >
          {/* Car details */}
          <div 
            className="absolute top-1 left-2 w-4 h-6 rounded-sm"
            style={{ backgroundColor: F1_COLORS.CARBON_BLACK }}
          />
          <div 
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: F1_COLORS.CHAMPIONSHIP_GOLD }}
          />
          
          {/* Racing stripes */}
          <div 
            className="absolute top-2 left-0 right-0 h-0.5"
            style={{ backgroundColor: F1_COLORS.CHAMPIONSHIP_GOLD }}
          />
          <div 
            className="absolute bottom-2 left-0 right-0 h-0.5"
            style={{ backgroundColor: F1_COLORS.CHAMPIONSHIP_GOLD }}
          />
        </div>
        
        {/* Speed trail */}
        {!reducedMotion && (
          <motion.div
            className="absolute top-0 bottom-0 right-full w-40"
            style={{
              background: `linear-gradient(90deg, transparent, ${F1_COLORS.RACING_RED}40, transparent)`
            }}
            animate={{
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
    </motion.div>
  )

  // Checkered flag wipe transition
  const CheckeredFlagWipe = () => (
    <motion.div
      className="fixed inset-0 z-40 pointer-events-none"
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div 
        className="w-full h-full"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            ${F1_COLORS.CHECKERED_FLAG} 0px,
            ${F1_COLORS.CHECKERED_FLAG} 20px,
            #FFFFFF 20px,
            #FFFFFF 40px
          )`
        }}
      />
    </motion.div>
  )

  // Tire smoke transition
  const TireSmokeTransition = () => (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-32 z-30 pointer-events-none"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
    >
      {!reducedMotion && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            backgroundColor: F1_COLORS.TIRE_SMOKE,
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 100}px`
          }}
          initial={{ 
            opacity: 0.6,
            scale: 0.5,
            y: 0
          }}
          animate={{ 
            opacity: 0,
            scale: 1.5,
            y: -100
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  )

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="relative"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Transition effects overlay */}
      <AnimatePresence>
        {!reducedMotion && (
          <>
            <SpeedLinesOverlay />
            <RacingCarTransition />
            <TireSmokeTransition />
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default F1PageTransition