import { createContext, useContext, useState, useEffect } from 'react'
import { f1AudioSystem } from '../utils/f1AudioSystem'

const F1AudioContext = createContext()

export const useF1Audio = () => {
  const context = useContext(F1AudioContext)
  if (!context) {
    throw new Error('useF1Audio must be used within F1AudioProvider')
  }
  return context
}

export const F1AudioProvider = ({ children }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(() => {
    const saved = localStorage.getItem('f1-audio-enabled')
    return saved !== 'false' // Default to enabled
  })
  
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('f1-audio-volume')
    return saved ? parseFloat(saved) : 0.7
  })
  
  const [isInitialized, setIsInitialized] = useState(false)

  // Update audio system when settings change
  useEffect(() => {
    f1AudioSystem.setEnabled(isAudioEnabled)
    localStorage.setItem('f1-audio-enabled', isAudioEnabled.toString())
  }, [isAudioEnabled])

  useEffect(() => {
    f1AudioSystem.setVolume(volume)
    localStorage.setItem('f1-audio-volume', volume.toString())
  }, [volume])

  // Initialize audio system on first user interaction
  useEffect(() => {
    const initializeAudio = async () => {
      if (!isInitialized) {
        await f1AudioSystem.initializeOnUserInteraction()
        setIsInitialized(true)
      }
    }

    const handleUserInteraction = () => {
      initializeAudio()
      // Remove listeners after first interaction
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }

    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('keydown', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [isInitialized])

  const toggleAudio = () => {
    setIsAudioEnabled(prev => !prev)
  }

  const adjustVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
  }

  // Convenience methods for playing F1 sounds
  const playEngineRev = async (intensity = 'medium') => {
    if (isAudioEnabled) {
      return f1AudioSystem.playEngineRev(intensity)
    }
  }

  const playTireScreech = async (duration = 400) => {
    if (isAudioEnabled) {
      return f1AudioSystem.playTireScreech(duration)
    }
  }

  const playVictoryHorn = async () => {
    if (isAudioEnabled) {
      return f1AudioSystem.playVictoryHorn()
    }
  }

  const playPitRadio = async () => {
    if (isAudioEnabled) {
      return f1AudioSystem.playPitRadio()
    }
  }

  const playButtonHover = async () => {
    if (isAudioEnabled) {
      return f1AudioSystem.playButtonHover()
    }
  }

  const playCheckeredFlag = async () => {
    if (isAudioEnabled) {
      return f1AudioSystem.playCheckeredFlag()
    }
  }

  const playVictoryCelebration = async () => {
    if (isAudioEnabled) {
      return f1AudioSystem.playVictoryCelebration()
    }
  }

  const playPitStopSequence = async () => {
    if (isAudioEnabled) {
      return f1AudioSystem.playPitStopSequence()
    }
  }

  const playF1Sound = async (soundType, options = {}) => {
    if (isAudioEnabled) {
      return f1AudioSystem.generateF1Sound(soundType, options)
    }
  }

  const value = {
    // State
    isAudioEnabled,
    volume,
    isInitialized,
    
    // Controls
    toggleAudio,
    adjustVolume,
    
    // Sound effects
    playEngineRev,
    playTireScreech,
    playVictoryHorn,
    playPitRadio,
    playButtonHover,
    playCheckeredFlag,
    playVictoryCelebration,
    playPitStopSequence,
    playF1Sound,
    
    // Audio system reference
    audioSystem: f1AudioSystem
  }

  return (
    <F1AudioContext.Provider value={value}>
      {children}
    </F1AudioContext.Provider>
  )
}