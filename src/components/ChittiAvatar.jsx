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
        scale: isHovered ? 1.1 : 1
      } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Logo Container */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden"
        animate={!reducedMotion ? {
          boxShadow: isHovered
            ? ['0 0 20px #a855f7', '0 0 40px #a855f7', '0 0 60px #a855f7', '0 0 40px #a855f7', '0 0 20px #a855f7']
            : '0 0 15px #a855f7'
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Logo Image */}
        <img 
          src="/chitti-logo.png" 
          alt="Chitti Robot Logo"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a gradient if image not found
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'block'
          }}
        />
        
        {/* Fallback gradient (hidden by default) */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-purple-600 via-purple-800 to-black flex items-center justify-center"
          style={{ display: 'none' }}
        >
          <div className="text-6xl font-bold text-purple-300">C</div>
        </div>

        {/* Animated ring effect */}
        {!reducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-purple-500"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Glitch effect on hover */}
        {isHovered && !reducedMotion && (
          <motion.div
            className="absolute inset-0 bg-purple-500 mix-blend-overlay"
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
