import { motion } from 'framer-motion'
import { useState } from 'react'
import { useF1Audio } from '../context/F1AudioContext'
import { useMotion } from '../context/MotionContext'
import { F1_COLORS } from '../config/f1Theme'
import F1Button from './F1Button'

const F1AudioControls = ({ className = '' }) => {
  const { 
    isAudioEnabled, 
    volume, 
    toggleAudio, 
    adjustVolume,
    playEngineRev,
    playTireScreech,
    playVictoryHorn,
    playCheckeredFlag
  } = useF1Audio()
  const { reducedMotion } = useMotion()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    adjustVolume(newVolume)
  }

  const testSound = async (soundType) => {
    switch (soundType) {
      case 'engine':
        await playEngineRev('medium')
        break
      case 'tires':
        await playTireScreech(300)
        break
      case 'victory':
        await playVictoryHorn()
        break
      case 'flag':
        await playCheckeredFlag()
        break
    }
  }

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Audio Toggle Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold text-sm
          transition-all duration-300
          ${isAudioEnabled 
            ? 'bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30' 
            : 'bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30'
          }
        `}
        whileHover={!reducedMotion ? { scale: 1.05 } : {}}
        whileTap={!reducedMotion ? { scale: 0.95 } : {}}
      >
        <span className="text-lg">
          {isAudioEnabled ? '🔊' : '🔇'}
        </span>
        <span>F1 Audio</span>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </motion.button>

      {/* Expanded Audio Controls */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden absolute top-full left-0 right-0 mt-2 z-50"
      >
        <div 
          className="p-4 rounded-lg border-2 backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(28, 28, 28, 0.9)',
            borderColor: F1_COLORS.RACING_RED + '40'
          }}
        >
          {/* Audio Enable/Disable */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold">Audio System</span>
            <F1Button
              onClick={toggleAudio}
              variant={isAudioEnabled ? 'victory' : 'penalty'}
              className="px-3 py-1 text-sm"
            >
              {isAudioEnabled ? 'ON' : 'OFF'}
            </F1Button>
          </div>

          {/* Volume Control */}
          {isAudioEnabled && (
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-red-300 text-sm">Volume</span>
                  <span className="text-red-400 text-sm font-mono">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(90deg, ${F1_COLORS.RACING_RED} 0%, ${F1_COLORS.CHAMPIONSHIP_GOLD} 50%, ${F1_COLORS.RACING_RED} 100%)`
                    }}
                  />
                  <div 
                    className="absolute top-0 left-0 h-2 rounded-lg pointer-events-none"
                    style={{
                      width: `${volume * 100}%`,
                      background: `linear-gradient(90deg, ${F1_COLORS.CHAMPIONSHIP_GOLD}, ${F1_COLORS.RACING_RED})`
                    }}
                  />
                </div>
              </div>

              {/* Sound Test Buttons */}
              <div className="space-y-2">
                <div className="text-red-300 text-sm font-semibold mb-2">
                  Test F1 Sounds
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <F1Button
                    onClick={() => testSound('engine')}
                    variant="normal"
                    className="px-3 py-2 text-xs"
                  >
                    🏎️ Engine
                  </F1Button>
                  <F1Button
                    onClick={() => testSound('tires')}
                    variant="pit_stop"
                    className="px-3 py-2 text-xs"
                  >
                    🛞 Tires
                  </F1Button>
                  <F1Button
                    onClick={() => testSound('victory')}
                    variant="victory"
                    className="px-3 py-2 text-xs"
                  >
                    🏆 Victory
                  </F1Button>
                  <F1Button
                    onClick={() => testSound('flag')}
                    variant="normal"
                    className="px-3 py-2 text-xs"
                  >
                    🏁 Flag
                  </F1Button>
                </div>
              </div>

              {/* Audio Info */}
              <div className="mt-4 p-2 rounded bg-black/30 border border-red-500/20">
                <div className="text-red-300 text-xs">
                  <div className="font-semibold mb-1">F1 Audio Features:</div>
                  <ul className="space-y-1 text-red-400">
                    <li>• Engine rev sounds on interactions</li>
                    <li>• Tire screech effects for pit stops</li>
                    <li>• Victory celebration sounds</li>
                    <li>• Racing-themed button feedback</li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Audio Disabled Message */}
          {!isAudioEnabled && (
            <div className="text-center py-4">
              <div className="text-red-400 text-sm mb-2">
                F1 Audio System Disabled
              </div>
              <div className="text-red-500 text-xs">
                Enable audio to experience immersive F1 racing sounds
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default F1AudioControls