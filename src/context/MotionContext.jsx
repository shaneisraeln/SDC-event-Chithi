import { createContext, useContext, useState, useEffect } from 'react'

const MotionContext = createContext()

export const useMotion = () => {
  const context = useContext(MotionContext)
  if (!context) throw new Error('useMotion must be used within MotionProvider')
  return context
}

export const MotionProvider = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(() => {
    const saved = localStorage.getItem('code-prix-reduced-motion')
    return saved === 'true'
  })

  useEffect(() => {
    localStorage.setItem('code-prix-reduced-motion', reducedMotion)
  }, [reducedMotion])

  const toggleReducedMotion = () => {
    setReducedMotion(prev => !prev)
  }

  return (
    <MotionContext.Provider value={{ reducedMotion, toggleReducedMotion }}>
      {children}
    </MotionContext.Provider>
  )
}
