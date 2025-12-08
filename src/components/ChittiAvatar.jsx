import { motion } from 'framer-motion'
import { useState } from 'react'
import { useMotion } from '../context/MotionContext'

const ChittiAvatar = ({ size = 'large', interactive = true }) => {
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

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      animate={!reducedMotion && interactive ? {
        rotateY: mousePos.x * 15,
        rotateX: -mousePos.y * 15,
      } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Robot head */}
      <motion.div
        className="relative w-full h-full rounded-2xl glass-effect neon-border"
        animate={!reducedMotion ? {
          boxShadow: isHovered
            ? ['0 0 20px #a855f7', '0 0 40px #a855f7', '0 0 20px #a855f7']
            : '0 0 10px #a855f7'
        } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {/* Eyes */}
        <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-purple-500 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-purple-500 rounded-full animate-pulse" />
        
        {/* Mouth/Display */}
        <motion.div
          className="absolute bottom-1/3 left-1/4 right-1/4 h-2 bg-purple-400 rounded"
          animate={!reducedMotion && isHovered ? {
            scaleX: [1, 1.2, 1],
          } : {}}
          transition={{ duration: 0.5 }}
        />

        {/* Antenna */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-purple-500">
          <motion.div
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-purple-400 rounded-full"
            animate={!reducedMotion ? {
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>

        {/* Glitch effect on hover */}
        {isHovered && !reducedMotion && (
          <motion.div
            className="absolute inset-0 bg-purple-500 mix-blend-overlay rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.2, repeat: 3 }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export default ChittiAvatar
