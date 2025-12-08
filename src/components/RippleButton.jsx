import { motion } from 'framer-motion'
import { useState } from 'react'
import { useMotion } from '../context/MotionContext'

const RippleButton = ({ children, onClick, className = '', disabled = false }) => {
  const [ripples, setRipples] = useState([])
  const { reducedMotion } = useMotion()

  const handleClick = (e) => {
    if (disabled) return

    if (!reducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const ripple = { x, y, id: Date.now() }
      setRipples(prev => [...prev, ripple])
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id))
      }, 600)
    }

    onClick?.(e)
  }

  return (
    <motion.button
      className={`relative overflow-hidden ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleClick}
      whileHover={!reducedMotion && !disabled ? { scale: 1.05 } : {}}
      whileTap={!reducedMotion && !disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
    >
      {children}
      {!reducedMotion && ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-purple-400"
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            left: ripple.x - 150,
            top: ripple.y - 150,
          }}
        />
      ))}
    </motion.button>
  )
}

export default RippleButton
