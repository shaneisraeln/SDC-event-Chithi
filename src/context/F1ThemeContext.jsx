import { createContext, useContext, useState, useEffect } from 'react'
import { DEFAULT_F1_THEME, F1_TEAMS, F1_CIRCUITS, F1_COLORS } from '../config/f1Theme.js'

const F1ThemeContext = createContext()

export const useF1Theme = () => {
  const context = useContext(F1ThemeContext)
  if (!context) {
    throw new Error('useF1Theme must be used within F1ThemeProvider')
  }
  return context
}

export const F1ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or use default
  const [f1Theme, setF1Theme] = useState(() => {
    const savedTheme = localStorage.getItem('chitti-f1-theme')
    return savedTheme ? JSON.parse(savedTheme) : DEFAULT_F1_THEME
  })

  // Persist theme changes to localStorage
  useEffect(() => {
    localStorage.setItem('chitti-f1-theme', JSON.stringify(f1Theme))
  }, [f1Theme])

  // Update team selection
  const updateTeam = (teamKey) => {
    const team = F1_TEAMS[teamKey]
    if (team) {
      setF1Theme(prev => ({
        ...prev,
        team,
        colors: {
          ...prev.colors,
          primary: team.primaryColor,
          secondary: team.secondaryColor
        }
      }))
    }
  }

  // Update circuit selection
  const updateCircuit = (circuitKey) => {
    const circuit = F1_CIRCUITS[circuitKey]
    if (circuit) {
      setF1Theme(prev => ({
        ...prev,
        circuit
      }))
    }
  }

  // Update color scheme
  const updateColors = (colorUpdates) => {
    setF1Theme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        ...colorUpdates
      }
    }))
  }

  // Toggle animations
  const toggleAnimations = () => {
    setF1Theme(prev => ({
      ...prev,
      animations: {
        ...prev.animations,
        enabled: !prev.animations.enabled
      }
    }))
  }

  // Toggle sound effects
  const toggleSounds = () => {
    setF1Theme(prev => ({
      ...prev,
      sounds: {
        ...prev.sounds,
        enabled: !prev.sounds.enabled
      }
    }))
  }

  // Update sound volume
  const updateSoundVolume = (volume) => {
    setF1Theme(prev => ({
      ...prev,
      sounds: {
        ...prev.sounds,
        volume: Math.max(0, Math.min(1, volume))
      }
    }))
  }

  // Reset to default theme
  const resetTheme = () => {
    setF1Theme(DEFAULT_F1_THEME)
  }

  // Get current F1 color palette
  const getF1Colors = () => {
    return {
      ...F1_COLORS,
      current: f1Theme.colors
    }
  }

  // Check if current theme uses F1 colors
  const isF1Themed = () => {
    const f1ColorValues = Object.values(F1_COLORS)
    return f1ColorValues.includes(f1Theme.colors.primary) ||
           f1ColorValues.includes(f1Theme.colors.secondary)
  }

  const contextValue = {
    // Current theme state
    f1Theme,
    
    // Theme update functions
    updateTeam,
    updateCircuit,
    updateColors,
    toggleAnimations,
    toggleSounds,
    updateSoundVolume,
    resetTheme,
    
    // Utility functions
    getF1Colors,
    isF1Themed,
    
    // Quick access to current values
    currentTeam: f1Theme.team,
    currentCircuit: f1Theme.circuit,
    currentColors: f1Theme.colors,
    animationsEnabled: f1Theme.animations.enabled,
    soundsEnabled: f1Theme.sounds.enabled,
    soundVolume: f1Theme.sounds.volume
  }

  return (
    <F1ThemeContext.Provider value={contextValue}>
      {children}
    </F1ThemeContext.Provider>
  )
}