import { useEffect, useRef, useState } from 'react'
import { useMotion } from '../context/MotionContext'

const ParallaxBackground = () => {
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

    // Create competitive circuit-like nodes
    const nodes = []
    const nodeCount = 80
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        baseX: Math.random() * canvas.width,
        baseY: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        hue: Math.random() * 60 + 240, // Purple to blue range
        energy: Math.random()
      })
    }

    // Create floating code symbols
    const codeSymbols = ['{}', '[]', '()', '<>', '/>', '&&', '||', '==', '!=', '++', '--', '=>']
    const floatingCode = []
    for (let i = 0; i < 15; i++) {
      floatingCode.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        symbol: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
        opacity: Math.random() * 0.3 + 0.1,
        size: Math.random() * 20 + 10
      })
    }

    const animate = () => {
      time += 0.01
      
      // Clear with dark background
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw dynamic gradient overlay
      const gradient = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, 400
      )
      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)')
      gradient.addColorStop(0.5, 'rgba(59, 130, 246, 0.08)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw competitive grid lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)'
      ctx.lineWidth = 1
      const gridSize = 100
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Update and draw nodes with connections
      nodes.forEach((node, i) => {
        // Mouse interaction
        const dx = mouseX - node.x
        const dy = mouseY - node.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < 150) {
          const force = (150 - dist) / 150
          node.vx += dx * force * 0.0001
          node.vy += dy * force * 0.0001
          node.energy = Math.min(1, node.energy + 0.02)
        } else {
          node.energy = Math.max(0, node.energy - 0.01)
        }

        // Update position
        node.x += node.vx + Math.sin(time + i) * 0.1
        node.y += node.vy + Math.cos(time + i) * 0.1
        
        // Boundary bounce
        if (node.x < 0 || node.x > canvas.width) node.vx *= -0.8
        if (node.y < 0 || node.y > canvas.height) node.vy *= -0.8
        
        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))

        // Draw connections to nearby nodes
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx2 = node.x - otherNode.x
            const dy2 = node.y - otherNode.y
            const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
            
            if (dist2 < 120) {
              const opacity = (120 - dist2) / 120 * 0.3 * (node.energy + otherNode.energy)
              ctx.strokeStyle = `hsla(${(node.hue + otherNode.hue) / 2}, 70%, 60%, ${opacity})`
              ctx.lineWidth = 1
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(otherNode.x, otherNode.y)
              ctx.stroke()
            }
          }
        })

        // Draw node
        const nodeSize = node.size * (1 + node.energy * 2)
        const nodeOpacity = 0.4 + node.energy * 0.6
        
        ctx.fillStyle = `hsla(${node.hue}, 70%, 60%, ${nodeOpacity})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
        ctx.fill()
        
        // Add glow effect for energized nodes
        if (node.energy > 0.3) {
          ctx.shadowColor = `hsl(${node.hue}, 70%, 60%)`
          ctx.shadowBlur = 10 * node.energy
          ctx.beginPath()
          ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0
        }
      })

      // Update and draw floating code symbols
      floatingCode.forEach(code => {
        code.x += code.vx
        code.y += code.vy
        
        // Wrap around screen
        if (code.x < -50) code.x = canvas.width + 50
        if (code.x > canvas.width + 50) code.x = -50
        if (code.y < -50) code.y = canvas.height + 50
        if (code.y > canvas.height + 50) code.y = -50
        
        // Mouse interaction
        const dx = mouseX - code.x
        const dy = mouseY - code.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        let opacity = code.opacity
        if (dist < 100) {
          opacity = code.opacity + (100 - dist) / 100 * 0.4
        }
        
        ctx.font = `${code.size}px 'Fira Code', monospace`
        ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`
        ctx.textAlign = 'center'
        ctx.fillText(code.symbol, code.x, code.y)
      })

      // Add scanning lines effect
      const scanLine1 = (time * 100) % canvas.height
      const scanLine2 = ((time * 80) + canvas.height / 2) % canvas.height
      
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.2)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(0, scanLine1)
      ctx.lineTo(canvas.width, scanLine1)
      ctx.stroke()
      
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.15)'
      ctx.beginPath()
      ctx.moveTo(0, scanLine2)
      ctx.lineTo(canvas.width, scanLine2)
      ctx.stroke()

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
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
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

export default ParallaxBackground
