import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { useMotion } from '../context/MotionContext'
import { F1_COLORS } from '../config/f1Theme'

const F1Button = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  variant = 'normal', // normal, pit_stop, victory, penalty
  team = 'FERRARI',
  playSound = true
}) => {
  const [ripples, setRipples] = useState([])
  const [isHovered, setIsHovered] = useState(false)
  const { reducedMotion } = useMotion()
  const audioRef = useRef()

  // F1 button variants with different styling
  const variants = {
    normal: {
      background: `linear-gradient(135deg, ${F1_COLORS.RACING_RED} 0%, ${F1_COLORS.CARBON_BLACK} 50%, ${F1_COLORS.RACING_RED} 100%)`,
      borderColor: F1_COLORS.CHAMPIONSHIP_GOLD,
      glowColor: F1_COLORS.RACING_RED
    },
    pit_stop: {
      background: `linear-gradient(135deg, ${F1_COLORS.PIT_LANE_YELLOW} 0%, ${F1_COLORS.CARBON_BLACK} 50%, ${F1_COLORS.PIT_LANE_YELLOW} 100%)`,
      borderColor: F1_COLORS.CARBON_BLACK,
      glowColor: F1_COLORS.PIT_LANE_YELLOW
    },
    victory: {
      background: `linear-gradient(135deg, ${F1_COLORS.CHAMPIONSHIP_GOLD} 0%, ${F1_COLORS.RACING_RED} 50%, ${F1_COLORS.CHAMPIONSHIP_GOLD} 100%)`,
      borderColor: F1_COLORS.CHAMPIONSHIP_GOLD,
      glowColor: F1_COLORS.CHAMPIONSHIP_GOLD
    },
    penalty: {
      background: `linear-gradient(135deg, ${F1_COLORS.CARBON_BLACK} 0%, #8B0000 50%, ${F1_COLORS.CARBON_BLACK} 100%)`,
      borderColor: '#8B0000',
      glowColor: '#8B0000'
    }
  }

  const currentVariant = variants[variant] || variants.normal

  // F1 visual effects only (audio removed)
  const playF1Sound = async (soundType) => {
    // Audio system removed - visual effects only
    console.log(`F1 visual effect: ${soundType}`)
  }

  const handleMouseEnter = () => {
    if (disabled) return
    setIsHovered(true)
    playF1Sound('hover')
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  const handleClick = (e) => {
    if (disabled) return

    playF1Sound('click')

    if (!reducedMotion) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const ripple = { x, y, id: Date.now() }
      setRipples(prev => [...prev, ripple])
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== ripple.id))
      }, 800)
    }

    onClick?.(e)
  }

  return (
    <motion.button
      className={`
        relative overflow-hidden border-2 font-bold text-white
        ${className} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      style={{
        background: currentVariant.background,
        borderColor: currentVariant.borderColor,
        boxShadow: isHovered && !disabled ? `0 0 20px ${currentVariant.glowColor}40` : 'none'
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={!reducedMotion && !disabled ? { 
        scale: 1.02,
        y: -2
      } : {}}
      whileTap={!reducedMotion && !disabled ? { 
        scale: 0.98,
        y: 0
      } : {}}
      disabled={disabled}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {/* Racing stripes overlay */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute top-0 left-1/4 w-0.5 h-full"
          style={{ backgroundColor: F1_COLORS.CHAMPIONSHIP_GOLD }}
        />
        <div 
          className="absolute top-0 right-1/4 w-0.5 h-full"
          style={{ backgroundColor: F1_COLORS.CHAMPIONSHIP_GOLD }}
        />
      </div>

      {/* Metallic shine effect */}
      {!reducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
          animate={{
            x: isHovered ? ['-100%', '100%'] : '-100%'
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut'
          }}
        />
      )}

      {/* Speed lines effect on hover */}
      {isHovered && !reducedMotion && !disabled && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-0.5 bg-white opacity-60"
              style={{
                top: `${20 + i * 10}%`,
                right: '-20px',
                width: '15px'
              }}
              animate={{
                x: [0, -80],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          ))}
        </>
      )}

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      {/* F1 Racing ripple effects */}
      {!reducedMotion && ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full border-2"
          initial={{ 
            width: 0, 
            height: 0, 
            opacity: 0.8,
            scale: 0
          }}
          animate={{ 
            width: 400, 
            height: 400, 
            opacity: 0,
            scale: 1
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            borderColor: currentVariant.glowColor,
            backgroundColor: `${currentVariant.glowColor}20`,
            left: ripple.x - 200,
            top: ripple.y - 200,
          }}
        />
      ))}

      {/* Checkered flag pattern for victory variant */}
      {variant === 'victory' && !reducedMotion && (
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ['0px 0px', '20px 20px']
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
          style={{
            backgroundImage: `
              linear-gradient(45deg, ${F1_COLORS.CHECKERED_FLAG} 25%, transparent 25%),
              linear-gradient(-45deg, ${F1_COLORS.CHECKERED_FLAG} 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, ${F1_COLORS.CHECKERED_FLAG} 75%),
              linear-gradient(-45deg, transparent 75%, ${F1_COLORS.CHECKERED_FLAG} 75%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
          }}
        />
      )}

      {/* Pit stop warning lights for pit_stop variant */}
      {variant === 'pit_stop' && !reducedMotion && (
        <motion.div
          className="absolute top-1 right-1 w-2 h-2 rounded-full"
          style={{ backgroundColor: F1_COLORS.RACING_RED }}
          animate={{
            opacity: [1, 0.3, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
        />
      )}

      {/* Carbon fiber texture overlay */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, ${F1_COLORS.CARBON_BLACK} 1px, transparent 0),
            radial-gradient(circle at 2px 2px, ${F1_COLORS.CARBON_BLACK} 1px, transparent 0)
          `,
          backgroundSize: '3px 3px'
        }}
      />
    </motion.button>
  )
}

export default F1Button