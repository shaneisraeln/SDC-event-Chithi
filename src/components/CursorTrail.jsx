import { useEffect, useRef } from 'react'
import { useMotion } from '../context/MotionContext'

const CursorTrail = () => {
  const { reducedMotion } = useMotion()
  const trailRef = useRef([])
  const rafRef = useRef()

  useEffect(() => {
    if (reducedMotion || 'ontouchstart' in window) return

    const trails = []
    for (let i = 0; i < 5; i++) {
      const trail = document.createElement('div')
      trail.className = 'cursor-trail'
      trail.style.opacity = (5 - i) / 10
      trail.style.width = `${20 - i * 3}px`
      trail.style.height = `${20 - i * 3}px`
      document.body.appendChild(trail)
      trails.push({ element: trail, x: 0, y: 0 })
    }
    trailRef.current = trails

    let mouseX = 0, mouseY = 0

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      trails.forEach((trail, index) => {
        const delay = index * 0.1
        trail.x += (mouseX - trail.x) * (0.2 - delay * 0.02)
        trail.y += (mouseY - trail.y) * (0.2 - delay * 0.02)
        trail.element.style.left = `${trail.x}px`
        trail.element.style.top = `${trail.y}px`
      })
      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
      trails.forEach(trail => trail.element.remove())
    }
  }, [reducedMotion])

  return null
}

export default CursorTrail
