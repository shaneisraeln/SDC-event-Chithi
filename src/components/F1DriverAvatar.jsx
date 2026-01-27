import { motion } from 'framer-motion'
import { useState } from 'react'
import { useMotion } from '../context/MotionContext'
import { F1_COLORS, F1_TEAMS, F1_ANIMATIONS } from '../config/f1Theme'

const F1DriverAvatar = ({ 
  size = 'large', 
  interactive = true, 
  team = 'FERRARI',
  driverNumber = 44,
  celebrationMode = false 
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { reducedMotion } = useMotion()

  const handleMouseMove = (e) => {
    if (!interactive || reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setMousePos({ x, y })
  }

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  }

  const teamConfig = F1_TEAMS[team] || F1_TEAMS.FERRARI
  const primaryColor = teamConfig.primaryColor
  const secondaryColor = teamConfig.secondaryColor

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      animate={!reducedMotion && interactive ? {
        rotateY: mousePos.x * 10,
        rotateX: -mousePos.y * 10,
        scale: isHovered ? 1.05 : 1
      } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Racing Helmet Container */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${F1_COLORS.CARBON_BLACK} 100%)`
        }}
        animate={!reducedMotion ? {
          boxShadow: isHovered
            ? [`0 0 20px ${primaryColor}`, `0 0 40px ${primaryColor}`, `0 0 60px ${primaryColor}`, `0 0 40px ${primaryColor}`, `0 0 20px ${primaryColor}`]
            : `0 0 15px ${primaryColor}`
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Helmet Base */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-inner">
          
          {/* Helmet Visor */}
          <motion.div
            className="absolute top-4 left-4 right-4 h-8 rounded-full bg-gradient-to-r from-blue-900 via-black to-blue-900 opacity-80"
            animate={!reducedMotion && isHovered ? {
              background: [
                'linear-gradient(90deg, #1e3a8a 0%, #000000 50%, #1e3a8a 100%)',
                'linear-gradient(90deg, #3b82f6 0%, #1e40af 50%, #3b82f6 100%)',
                'linear-gradient(90deg, #1e3a8a 0%, #000000 50%, #1e3a8a 100%)'
              ]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {/* Visor Reflection */}
            {!reducedMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </motion.div>

          {/* Driver Number */}
          <div 
            className="absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ backgroundColor: primaryColor }}
          >
            {driverNumber}
          </div>

          {/* Team Logo Area */}
          <div 
            className="absolute top-2 left-2 w-4 h-4 rounded-full"
            style={{ backgroundColor: secondaryColor }}
          />

          {/* Racing Stripes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div 
              className="w-1 h-full opacity-60"
              style={{ backgroundColor: primaryColor }}
            />
            <div 
              className="w-1 h-full ml-2 opacity-40"
              style={{ backgroundColor: secondaryColor }}
            />
          </div>
        </div>

        {/* Racing Suit Collar (visible at bottom) */}
        <div 
          className="absolute bottom-0 left-2 right-2 h-6 rounded-t-lg"
          style={{ backgroundColor: primaryColor }}
        >
          <div 
            className="absolute top-1 left-1 right-1 h-2 rounded-t-lg opacity-80"
            style={{ backgroundColor: secondaryColor }}
          />
        </div>

        {/* Animated Racing Ring Effect */}
        {!reducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 opacity-60"
            style={{ borderColor: primaryColor }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 0, 0.6],
              rotate: [0, 360]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}

        {/* Victory Celebration Effect */}
        {celebrationMode && !reducedMotion && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-transparent to-yellow-400 mix-blend-overlay"
              animate={{
                opacity: [0, 0.7, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 0.5, repeat: 6 }}
            />
            {/* Confetti particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 3) * 20}%`
                }}
                animate={{
                  y: [-20, 100],
                  x: [0, (i % 2 ? 20 : -20)],
                  rotate: [0, 360],
                  opacity: [1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />
            ))}
          </>
        )}

        {/* Speed Lines Effect on Hover */}
        {isHovered && !reducedMotion && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-0.5 bg-white opacity-70"
                style={{
                  top: `${20 + i * 10}%`,
                  right: '-20px',
                  width: '15px'
                }}
                animate={{
                  x: [0, -60],
                  opacity: [0, 0.7, 0]
                }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.1,
                  repeat: Infinity
                }}
              />
            ))}
          </>
        )}

        {/* Racing Helmet Shine Effect */}
        {!reducedMotion && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-20 rounded-full"
            animate={{
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export default F1DriverAvatar