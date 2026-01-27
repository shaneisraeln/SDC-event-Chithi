import { motion } from 'framer-motion'
import { useMotion } from '../context/MotionContext'
import { F1_COLORS } from '../config/f1Theme'

const F1SpeedEffect = ({ 
  isActive = false,
  intensity = 'medium', // low, medium, high
  direction = 'horizontal', // horizontal, vertical, radial
  className = ''
}) => {
  const { reducedMotion } = useMotion()

  if (reducedMotion || !isActive) return null

  const intensityConfig = {
    low: { count: 8, speed: 1, opacity: 0.3 },
    medium: { count: 15, speed: 2, opacity: 0.5 },
    high: { count: 25, speed: 3, opacity: 0.7 }
  }

  const config = intensityConfig[intensity]

  const HorizontalSpeedLines = () => (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {[...Array(config.count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            right: '-50px',
            width: `${30 + Math.random() * 50}px`,
            opacity: config.opacity
          }}
          animate={{
            x: [0, -window.innerWidth - 100],
            opacity: [0, config.opacity, 0]
          }}
          transition={{
            duration: 0.8 / config.speed,
            delay: i * 0.05,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )

  const VerticalSpeedLines = () => (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {[...Array(config.count)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-50px',
            height: `${30 + Math.random() * 50}px`,
            opacity: config.opacity
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            opacity: [0, config.opacity, 0]
          }}
          transition={{
            duration: 1.2 / config.speed,
            delay: i * 0.08,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )

  const RadialSpeedLines = () => (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {[...Array(config.count)].map((_, i) => {
        const angle = (i / config.count) * 360
        const length = 50 + Math.random() * 100
        
        return (
          <motion.div
            key={i}
            className="absolute w-0.5 bg-white origin-bottom"
            style={{
              top: '50%',
              left: '50%',
              height: `${length}px`,
              transformOrigin: '50% 100%',
              transform: `rotate(${angle}deg)`,
              opacity: config.opacity
            }}
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, config.opacity, 0]
            }}
            transition={{
              duration: 1 / config.speed,
              delay: i * 0.03,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        )
      })}
    </div>
  )

  const TireMarks = () => (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 rounded-full"
          style={{
            backgroundColor: F1_COLORS.TIRE_SMOKE,
            top: `${60 + Math.random() * 30}%`,
            right: '-100px',
            width: `${100 + Math.random() * 200}px`,
            opacity: 0.4
          }}
          animate={{
            x: [0, -window.innerWidth - 300],
            opacity: [0, 0.4, 0],
            scaleY: [1, 0.5, 1]
          }}
          transition={{
            duration: 1.5 / config.speed,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )

  const Sparks = () => (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: F1_COLORS.CHAMPIONSHIP_GOLD,
            top: `${50 + Math.random() * 40}%`,
            left: `${Math.random() * 100}%`
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 100],
            opacity: [1, 0],
            scale: [1, 0]
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 2
          }}
        />
      ))}
    </div>
  )

  const MotionBlur = () => (
    <motion.div
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        background: `linear-gradient(90deg, 
          transparent 0%, 
          ${F1_COLORS.RACING_RED}10 20%, 
          transparent 40%, 
          ${F1_COLORS.CHAMPIONSHIP_GOLD}10 60%, 
          transparent 80%, 
          ${F1_COLORS.RACING_RED}10 100%
        )`
      }}
      animate={{
        x: ['-100%', '100%']
      }}
      transition={{
        duration: 0.6 / config.speed,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )

  const renderSpeedEffect = () => {
    switch (direction) {
      case 'horizontal':
        return (
          <>
            <HorizontalSpeedLines />
            <TireMarks />
            <MotionBlur />
          </>
        )
      case 'vertical':
        return <VerticalSpeedLines />
      case 'radial':
        return (
          <>
            <RadialSpeedLines />
            <Sparks />
          </>
        )
      default:
        return <HorizontalSpeedLines />
    }
  }

  return renderSpeedEffect()
}

export default F1SpeedEffect