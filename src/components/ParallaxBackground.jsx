import { useEffect, useRef } from 'react'
import { useMotion } from '../context/MotionContext'

const ParallaxBackground = () => {
  const { reducedMotion } = useMotion()
  const canvasRef = useRef()

  useEffect(() => {
    if (reducedMotion) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let mouseX = 0, mouseY = 0
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener('mousemove', handleMouseMove)

    const grid = []
    const spacing = 50
    for (let x = 0; x < canvas.width; x += spacing) {
      for (let y = 0; y < canvas.height; y += spacing) {
        grid.push({ x, y, baseX: x, baseY: y })
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      grid.forEach(point => {
        const dx = mouseX - point.x
        const dy = mouseY - point.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 200

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist
          point.x += dx * force * 0.02
          point.y += dy * force * 0.02
        }

        point.x += (point.baseX - point.x) * 0.05
        point.y += (point.baseY - point.y) * 0.05

        const intensity = Math.max(0, 1 - dist / 300)
        ctx.fillStyle = `rgba(168, 85, 247, ${0.1 + intensity * 0.3})`
        ctx.fillRect(point.x - 1, point.y - 1, 2, 2)
      })

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
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-purple-950 to-black" />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: 'linear-gradient(to bottom right, #000, #1a0033, #000)' }}
    />
  )
}

export default ParallaxBackground
