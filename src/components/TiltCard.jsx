import { motion } from 'framer-motion'
import { useState } from 'react'
import { useMotion } from '../context/MotionContext'

const TiltCard = ({ children, className = '', onClick }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const { reducedMotion } = useMotion()

  const handleMouseMove = (e) => {
    if (reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setTilt({ x: y * 10, y: -x * 10 })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={!reducedMotion ? {
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? 1.05 : 1,
      } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {isHovered && !reducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${((tilt.y / 10 + 1) / 2) * 100}% ${((tilt.x / 10 + 1) / 2) * 100}%, rgba(168, 85, 247, 0.3), transparent 50%)`,
          }}
        />
      )}
      {children}
    </motion.div>
  )
}

export default TiltCard
