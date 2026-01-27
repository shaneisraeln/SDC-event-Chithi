import { useEffect, useRef, useState } from 'react'
import { useMotion } from '../context/MotionContext'
import { F1_COLORS } from '../config/f1Theme'

const RacingTrackBackground = () => {
  const { reducedMotion } = useMotion()
  const canvasRef = useRef()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let animationId
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setMousePosition({ x: mouseX, y: mouseY })
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Create F1 racing track elements
    const trackElements = []
    const trackElementCount = 60
    for (let i = 0; i < trackElementCount; i++) {
      trackElements.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: Math.random() * canvas.width,
        baseY: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 4 + 2,
        type: Math.floor(Math.random() * 3), // 0: track marker, 1: pit element, 2: grandstand
        energy: Math.random(),
        rotation: Math.random() * Math.PI * 2
      })
    }

    // Create moving F1 cars
    const racingCars = []
    for (let i = 0; i < 8; i++) {
      racingCars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2 + 1,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 15 + 10,
        color: Object.values(F1_COLORS)[Math.floor(Math.random() * 4)], // Random F1 team color
        trail: [],
        maxTrailLength: 20
      })
    }

    // Create tire smoke particles
    const smokeParticles = []
    const createSmokeParticle = (x, y) => {
      smokeParticles.push({
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 8 + 4,
        opacity: 0.6,
        life: 1.0
      })
    }

    // Create speed lines
    const speedLines = []
    for (let i = 0; i < 30; i++) {
      speedLines.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 50 + 20,
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1
      })
    }

    const animate = () => {
      time += 0.02
      
      // Clear with racing track asphalt background
      ctx.fillStyle = F1_COLORS.TRACK_ASPHALT
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw racing track gradient overlay
      const gradient = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, 500
      )
      gradient.addColorStop(0, `${F1_COLORS.RACING_RED}20`)
      gradient.addColorStop(0.3, `${F1_COLORS.CHAMPIONSHIP_GOLD}15`)
      gradient.addColorStop(0.7, `${F1_COLORS.PIT_LANE_YELLOW}10`)
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw F1 racing track layout lines
      ctx.strokeStyle = `${F1_COLORS.PIT_LANE_YELLOW}40`
      ctx.lineWidth = 3
      
      // Main racing line (curved track)
      const trackCurve = Math.sin(time) * 50
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2 + trackCurve)
      for (let x = 0; x < canvas.width; x += 20) {
        const y = canvas.height / 2 + Math.sin(x * 0.01 + time * 2) * 80 + trackCurve
        ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Pit lane
      ctx.strokeStyle = `${F1_COLORS.PIT_LANE_YELLOW}60`
      ctx.lineWidth = 2
      ctx.setLineDash([10, 5])
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2 + 120)
      ctx.lineTo(canvas.width, canvas.height / 2 + 120)
      ctx.stroke()
      ctx.setLineDash([])

      // Draw checkered flag pattern in corners
      const flagSize = 20
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          const x = i * flagSize
          const y = j * flagSize
          ctx.fillStyle = (i + j) % 2 === 0 ? F1_COLORS.CHECKERED_FLAG : '#FFFFFF'
          ctx.globalAlpha = 0.1
          ctx.fillRect(x, y, flagSize, flagSize)
          ctx.fillRect(canvas.width - x - flagSize, canvas.height - y - flagSize, flagSize, flagSize)
        }
      }
      ctx.globalAlpha = 1

      // Update and draw racing cars
      racingCars.forEach(car => {
        // Add current position to trail
        car.trail.push({ x: car.x, y: car.y })
        if (car.trail.length > car.maxTrailLength) {
          car.trail.shift()
        }

        // Update car position
        car.x += car.vx + Math.sin(time + car.x * 0.01) * 0.5
        car.y += car.vy + Math.cos(time + car.y * 0.01) * 0.3
        
        // Wrap around screen
        if (car.x > canvas.width + 50) car.x = -50
        if (car.x < -50) car.x = canvas.width + 50
        if (car.y > canvas.height + 50) car.y = -50
        if (car.y < -50) car.y = canvas.height + 50

        // Create tire smoke occasionally
        if (Math.random() < 0.1) {
          createSmokeParticle(car.x, car.y)
        }

        // Draw car trail (speed lines)
        car.trail.forEach((point, index) => {
          const opacity = (index / car.trail.length) * 0.5
          ctx.strokeStyle = `${car.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
          ctx.lineWidth = 2
          if (index > 0) {
            ctx.beginPath()
            ctx.moveTo(car.trail[index - 1].x, car.trail[index - 1].y)
            ctx.lineTo(point.x, point.y)
            ctx.stroke()
          }
        })

        // Draw racing car
        ctx.save()
        ctx.translate(car.x, car.y)
        ctx.rotate(Math.atan2(car.vy, car.vx))
        
        // Car body
        ctx.fillStyle = car.color
        ctx.fillRect(-car.size / 2, -car.size / 4, car.size, car.size / 2)
        
        // Car details
        ctx.fillStyle = F1_COLORS.CARBON_BLACK
        ctx.fillRect(-car.size / 3, -car.size / 6, car.size / 3, car.size / 3)
        
        // Racing stripes
        ctx.fillStyle = F1_COLORS.CHAMPIONSHIP_GOLD
        ctx.fillRect(-car.size / 2, -1, car.size, 2)
        
        ctx.restore()

        // Mouse interaction - cars avoid cursor
        const dx = mouseX - car.x
        const dy = mouseY - car.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 100) {
          const force = (100 - dist) / 100
          car.vx -= dx * force * 0.01
          car.vy -= dy * force * 0.01
        }
      })

      // Update and draw track elements
      trackElements.forEach((element, i) => {
        // Mouse interaction
        const dx = mouseX - element.x
        const dy = mouseY - element.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 120) {
          const force = (120 - dist) / 120
          element.energy = Math.min(1, element.energy + 0.03)
        } else {
          element.energy = Math.max(0, element.energy - 0.02)
        }

        // Update position
        element.x += element.vx * 0.3 + Math.sin(time + i) * 0.2
        element.y += element.vy * 0.3 + Math.cos(time + i) * 0.2
        element.rotation += 0.01
        
        // Boundary bounce
        if (element.x < 0 || element.x > canvas.width) element.vx *= -0.9
        if (element.y < 0 || element.y > canvas.height) element.vy *= -0.9
        
        element.x = Math.max(0, Math.min(canvas.width, element.x))
        element.y = Math.max(0, Math.min(canvas.height, element.y))

        // Draw different track elements
        ctx.save()
        ctx.translate(element.x, element.y)
        ctx.rotate(element.rotation)
        
        const elementSize = element.size * (1 + element.energy)
        const elementOpacity = 0.3 + element.energy * 0.7

        switch (element.type) {
          case 0: // Track markers
            ctx.fillStyle = `${F1_COLORS.PIT_LANE_YELLOW}${Math.floor(elementOpacity * 255).toString(16).padStart(2, '0')}`
            ctx.fillRect(-elementSize / 2, -elementSize / 2, elementSize, elementSize)
            break
          case 1: // Pit elements
            ctx.fillStyle = `${F1_COLORS.RACING_RED}${Math.floor(elementOpacity * 255).toString(16).padStart(2, '0')}`
            ctx.beginPath()
            ctx.arc(0, 0, elementSize, 0, Math.PI * 2)
            ctx.fill()
            break
          case 2: // Grandstand elements
            ctx.fillStyle = `${F1_COLORS.CHAMPIONSHIP_GOLD}${Math.floor(elementOpacity * 255).toString(16).padStart(2, '0')}`
            ctx.fillRect(-elementSize, -elementSize / 4, elementSize * 2, elementSize / 2)
            break
        }
        
        ctx.restore()

        // Add glow effect for energized elements
        if (element.energy > 0.4) {
          ctx.shadowColor = F1_COLORS.RACING_RED
          ctx.shadowBlur = 15 * element.energy
          ctx.save()
          ctx.translate(element.x, element.y)
          ctx.fillStyle = `${F1_COLORS.RACING_RED}${Math.floor(element.energy * 100).toString(16).padStart(2, '0')}`
          ctx.beginPath()
          ctx.arc(0, 0, elementSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
          ctx.shadowBlur = 0
        }
      })

      // Update and draw tire smoke particles
      smokeParticles.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= 0.98
        particle.vy *= 0.98
        particle.life -= 0.02
        particle.opacity = particle.life * 0.6
        particle.size *= 1.02

        if (particle.life <= 0) {
          smokeParticles.splice(index, 1)
          return
        }

        ctx.fillStyle = `${F1_COLORS.TIRE_SMOKE}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update and draw speed lines
      speedLines.forEach(line => {
        line.x -= line.speed * 2
        
        // Reset line when it goes off screen
        if (line.x < -line.length) {
          line.x = canvas.width + line.length
          line.y = Math.random() * canvas.height
        }

        // Mouse interaction - speed up lines near cursor
        const dx = mouseX - line.x
        const dy = mouseY - line.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        let currentSpeed = line.speed
        if (dist < 150) {
          currentSpeed *= 1 + (150 - dist) / 150
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${line.opacity})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(line.x, line.y)
        ctx.lineTo(line.x + line.length, line.y)
        ctx.stroke()
      })

      // Add racing day lighting effect
      const lightingGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      lightingGradient.addColorStop(0, 'rgba(255, 215, 0, 0.05)') // Championship gold sky
      lightingGradient.addColorStop(0.7, 'rgba(220, 20, 60, 0.03)') // Racing red horizon
      lightingGradient.addColorStop(1, 'rgba(28, 28, 28, 0.1)') // Carbon black ground
      
      ctx.fillStyle = lightingGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: F1_COLORS.TRACK_ASPHALT }}
        />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `linear-gradient(135deg, ${F1_COLORS.RACING_RED}20 0%, transparent 50%, ${F1_COLORS.CHAMPIONSHIP_GOLD}20 100%)`
          }}
        />
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${F1_COLORS.RACING_RED}20` }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ backgroundColor: `${F1_COLORS.CHAMPIONSHIP_GOLD}20` }}
          />
        </div>
        {/* Static racing track elements for reduced motion */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-1/2 left-0 right-0 h-1 opacity-40"
            style={{ backgroundColor: F1_COLORS.PIT_LANE_YELLOW }}
          />
          <div 
            className="absolute top-1/2 left-0 right-0 h-0.5 mt-8 opacity-30 border-dashed"
            style={{ borderColor: F1_COLORS.PIT_LANE_YELLOW }}
          />
        </div>
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
    />
  )
}

export default RacingTrackBackground