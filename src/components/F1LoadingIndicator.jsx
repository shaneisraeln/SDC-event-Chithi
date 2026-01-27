import { motion } from 'framer-motion'
import { useMotion } from '../context/MotionContext'
import { F1_COLORS } from '../config/f1Theme'

const F1LoadingIndicator = ({ 
  type = 'spinning_wheel', // spinning_wheel, moving_car, pit_stop, checkered_flag
  size = 'medium', // small, medium, large
  message = 'Loading...',
  className = ''
}) => {
  const { reducedMotion } = useMotion()

  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  }

  const SpinningWheel = () => (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={!reducedMotion ? { rotate: 360 } : {}}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      {/* Tire outer ring */}
      <div 
        className="absolute inset-0 rounded-full border-4"
        style={{ borderColor: F1_COLORS.CARBON_BLACK }}
      />
      
      {/* Tire inner ring */}
      <div 
        className="absolute inset-2 rounded-full border-2"
        style={{ borderColor: F1_COLORS.RACING_RED }}
      />
      
      {/* Wheel spokes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 bg-current"
          style={{
            height: '40%',
            top: '30%',
            left: '50%',
            transformOrigin: '50% 100%',
            transform: `rotate(${i * 60}deg)`,
            backgroundColor: F1_COLORS.CHAMPIONSHIP_GOLD
          }}
        />
      ))}
      
      {/* Center hub */}
      <div 
        className="absolute inset-1/3 rounded-full"
        style={{ backgroundColor: F1_COLORS.MERCEDES_SILVER }}
      />
    </motion.div>
  )

  const MovingCar = () => (
    <div className={`${sizeClasses[size]} relative overflow-hidden`}>
      <motion.div
        className="absolute w-8 h-4 rounded-sm"
        style={{ backgroundColor: F1_COLORS.RACING_RED }}
        animate={!reducedMotion ? {
          x: ['-100%', '200%']
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Car details */}
        <div 
          className="absolute top-1 left-1 w-2 h-2 rounded-sm"
          style={{ backgroundColor: F1_COLORS.CARBON_BLACK }}
        />
        <div 
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ backgroundColor: F1_COLORS.CHAMPIONSHIP_GOLD }}
        />
      </motion.div>
      
      {/* Speed lines */}
      {!reducedMotion && [...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 bg-white opacity-40"
          style={{
            top: `${30 + i * 10}%`,
            width: '20%',
            right: '10%'
          }}
          animate={{
            x: [0, -50],
            opacity: [0, 0.4, 0]
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.1,
            repeat: Infinity
          }}
        />
      ))}
    </div>
  )

  const PitStop = () => (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Pit crew activity simulation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={!reducedMotion ? {
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Tire changing animation */}
        <div className="relative">
          <motion.div
            className="w-6 h-6 rounded-full border-2"
            style={{ borderColor: F1_COLORS.CARBON_BLACK }}
            animate={!reducedMotion ? {
              rotate: [0, 180, 360]
            } : {}}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Pneumatic tools */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-3"
              style={{
                backgroundColor: F1_COLORS.PIT_LANE_YELLOW,
                top: '50%',
                left: '50%',
                transformOrigin: '50% 0%',
                transform: `rotate(${i * 90}deg) translateY(-150%)`
              }}
              animate={!reducedMotion ? {
                scaleY: [1, 0.7, 1]
              } : {}}
              transition={{
                duration: 0.3,
                delay: i * 0.1,
                repeat: Infinity
              }}
            />
          ))}
        </div>
      </motion.div>
      
      {/* Sparks effect */}
      {!reducedMotion && [...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            backgroundColor: F1_COLORS.CHAMPIONSHIP_GOLD,
            top: '50%',
            left: '50%'
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 40],
            y: [0, (Math.random() - 0.5) * 40],
            opacity: [1, 0],
            scale: [1, 0]
          }}
          transition={{
            duration: 0.6,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 1
          }}
        />
      ))}
    </div>
  )

  const CheckeredFlag = () => (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={!reducedMotion ? {
        rotateY: [0, 180, 360]
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Checkered pattern */}
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className={`${
              (Math.floor(i / 4) + i) % 2 === 0 
                ? 'bg-white' 
                : 'bg-black'
            }`}
          />
        ))}
      </div>
      
      {/* Flag wave effect */}
      {!reducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  )

  const renderIndicator = () => {
    switch (type) {
      case 'spinning_wheel':
        return <SpinningWheel />
      case 'moving_car':
        return <MovingCar />
      case 'pit_stop':
        return <PitStop />
      case 'checkered_flag':
        return <CheckeredFlag />
      default:
        return <SpinningWheel />
    }
  }

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {renderIndicator()}
      
      {message && (
        <motion.p
          className="text-sm font-medium"
          style={{ color: F1_COLORS.RACING_RED }}
          animate={!reducedMotion ? {
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

export default F1LoadingIndicator