// F1 Audio System
// Comprehensive audio system for F1 racing theme with sound effects and fallbacks

import {
    F1_SOUND_TRIGGERS
} from './f1Animations'

class F1AudioSystem {
    constructor() {
        this.audioContext = null
        this.sounds = new Map()
        this.isEnabled = true
        this.volume = 0.7
        this.isInitialized = false
        this.fallbackSounds = new Map()

        // Initialize audio context on first user interaction
        this.initializeAudioContext()
    }

    // Initialize Web Audio API context
    async initializeAudioContext() {
        try {
            // Create audio context (requires user interaction)
            this.audioContext = new(window.AudioContext || window.webkitAudioContext)()

            // Resume context if suspended (Chrome autoplay policy)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume()
            }

            this.isInitialized = true
            console.log('F1 Audio System initialized')
        } catch (error) {
            console.warn('F1 Audio System: Web Audio API not supported, using fallback', error)
            this.setupFallbackSounds()
        }
    }

    // Setup fallback sound system using HTML5 Audio
    setupFallbackSounds() {
        const fallbackSoundData = {
            ENGINE_REV: {
                frequency: 300,
                duration: 200
            },
            TIRE_SCREECH: {
                frequency: 800,
                duration: 300
            },
            VICTORY_HORN: {
                frequency: 500,
                duration: 500
            },
            PIT_RADIO: {
                frequency: 250,
                duration: 150
            },
            BUTTON_HOVER: {
                frequency: 400,
                duration: 100
            },
            CHECKERED_FLAG: {
                frequency: 600,
                duration: 400
            }
        }

        Object.entries(fallbackSoundData).forEach(([name, config]) => {
            this.fallbackSounds.set(name, config)
        })
    }

    // Enable/disable audio system
    setEnabled(enabled) {
        this.isEnabled = enabled
    }

    // Set master volume (0.0 to 1.0)
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume))
    }

    // Generate F1 racing sound using Web Audio API
    async generateF1Sound(soundType, options = {}) {
        if (!this.isEnabled || !this.audioContext) {
            return this.playFallbackSound(soundType)
        }

        try {
            const config = F1_SOUND_TRIGGERS[soundType] || F1_SOUND_TRIGGERS.ENGINE_REV
            const {
                frequency = config.frequency,
                    duration = config.duration * 1000, // Convert to ms
                    volume = config.volume * this.volume,
                    waveType = 'sawtooth'
            } = {
                ...config,
                ...options
            }

            // Create oscillator for engine-like sounds
            const oscillator = this.audioContext.createOscillator()
            const gainNode = this.audioContext.createGain()
            const filterNode = this.audioContext.createBiquadFilter()

            // Connect audio nodes
            oscillator.connect(filterNode)
            filterNode.connect(gainNode)
            gainNode.connect(this.audioContext.destination)

            // Configure oscillator
            oscillator.type = waveType
            oscillator.frequency.setValueAtTime(frequency.start, this.audioContext.currentTime)

            // Configure filter for more realistic F1 sound
            filterNode.type = 'lowpass'
            filterNode.frequency.setValueAtTime(2000, this.audioContext.currentTime)
            filterNode.Q.setValueAtTime(1, this.audioContext.currentTime)

            // Configure gain envelope
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime)
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01)

            // Apply sound-specific effects
            this.applyF1SoundEffects(oscillator, gainNode, filterNode, soundType, duration)

            // Start and stop oscillator
            oscillator.start(this.audioContext.currentTime)
            oscillator.stop(this.audioContext.currentTime + duration / 1000)

            return new Promise(resolve => {
                oscillator.onended = resolve
            })
        } catch (error) {
            console.warn('F1 Audio System: Error generating sound, using fallback', error)
            return this.playFallbackSound(soundType)
        }
    }

    // Apply F1-specific sound effects
    applyF1SoundEffects(oscillator, gainNode, filterNode, soundType, duration) {
        const currentTime = this.audioContext.currentTime
        const durationSec = duration / 1000

        switch (soundType) {
            case 'ENGINE_REV':
                // Engine rev up and down
                oscillator.frequency.exponentialRampToValueAtTime(800, currentTime + durationSec * 0.3)
                oscillator.frequency.exponentialRampToValueAtTime(400, currentTime + durationSec * 0.7)
                oscillator.frequency.exponentialRampToValueAtTime(200, currentTime + durationSec)

                // Filter sweep for engine character
                filterNode.frequency.exponentialRampToValueAtTime(3000, currentTime + durationSec * 0.3)
                filterNode.frequency.exponentialRampToValueAtTime(1500, currentTime + durationSec)
                break

            case 'TIRE_SCREECH':
                // High frequency screech with modulation
                oscillator.frequency.setValueAtTime(1200, currentTime)
                oscillator.frequency.exponentialRampToValueAtTime(800, currentTime + durationSec * 0.5)
                oscillator.frequency.exponentialRampToValueAtTime(400, currentTime + durationSec)

                // Add noise-like character
                filterNode.frequency.setValueAtTime(4000, currentTime)
                filterNode.Q.setValueAtTime(5, currentTime)
                break

            case 'VICTORY_HORN':
                // Triumphant horn sound
                oscillator.frequency.setValueAtTime(400, currentTime)
                oscillator.frequency.linearRampToValueAtTime(600, currentTime + durationSec * 0.3)
                oscillator.frequency.linearRampToValueAtTime(500, currentTime + durationSec * 0.7)
                oscillator.frequency.linearRampToValueAtTime(600, currentTime + durationSec)

                // Smooth filter for horn character
                filterNode.frequency.setValueAtTime(2500, currentTime)
                break

            case 'PIT_RADIO':
                // Radio static effect
                oscillator.type = 'square'
                oscillator.frequency.setValueAtTime(300, currentTime)
                filterNode.frequency.setValueAtTime(1000, currentTime)
                filterNode.Q.setValueAtTime(10, currentTime)
                break

            case 'BUTTON_HOVER':
                // Quick beep
                oscillator.frequency.setValueAtTime(600, currentTime)
                oscillator.frequency.exponentialRampToValueAtTime(800, currentTime + durationSec * 0.5)
                oscillator.frequency.exponentialRampToValueAtTime(600, currentTime + durationSec)
                break

            case 'CHECKERED_FLAG':
                // Celebratory fanfare
                oscillator.frequency.setValueAtTime(500, currentTime)
                oscillator.frequency.linearRampToValueAtTime(750, currentTime + durationSec * 0.25)
                oscillator.frequency.linearRampToValueAtTime(600, currentTime + durationSec * 0.5)
                oscillator.frequency.linearRampToValueAtTime(800, currentTime + durationSec * 0.75)
                oscillator.frequency.linearRampToValueAtTime(1000, currentTime + durationSec)
                break

            default:
                // Default engine sound
                oscillator.frequency.exponentialRampToValueAtTime(600, currentTime + durationSec * 0.5)
                oscillator.frequency.exponentialRampToValueAtTime(300, currentTime + durationSec)
        }

        // Fade out at the end
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + durationSec - 0.05)
    }

    // Fallback sound system for browsers without Web Audio API
    playFallbackSound(soundType) {
        if (!this.isEnabled) return Promise.resolve()

        const soundConfig = this.fallbackSounds.get(soundType)
        if (!soundConfig) return Promise.resolve()

        return new Promise(resolve => {
            // Create a simple beep using HTML5 Audio with data URI
            const {
                frequency,
                duration
            } = soundConfig

            // Generate a simple sine wave data URI (simplified)
            const sampleRate = 8000
            const samples = Math.floor(sampleRate * duration / 1000)
            const buffer = new ArrayBuffer(samples * 2)
            const view = new DataView(buffer)

            for (let i = 0; i < samples; i++) {
                const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3 * this.volume
                view.setInt16(i * 2, sample * 32767, true)
            }

            // Create audio element with generated sound
            const audio = new Audio()
            audio.volume = this.volume

            // Simple fallback - just log the sound effect
            console.log(`F1 Sound Effect: ${soundType} (${frequency}Hz, ${duration}ms)`)

            setTimeout(resolve, duration)
        })
    }

    // Play specific F1 sound effects
    async playEngineRev(intensity = 'medium') {
        const intensityConfig = {
            low: {
                volume: 0.3,
                duration: 300
            },
            medium: {
                volume: 0.5,
                duration: 500
            },
            high: {
                volume: 0.7,
                duration: 800
            }
        }

        const config = intensityConfig[intensity] || intensityConfig.medium
        return this.generateF1Sound('ENGINE_REV', config)
    }

    async playTireScreech(duration = 400) {
        return this.generateF1Sound('TIRE_SCREECH', {
            duration
        })
    }

    async playVictoryHorn() {
        return this.generateF1Sound('VICTORY_HORN')
    }

    async playPitRadio() {
        return this.generateF1Sound('PIT_RADIO')
    }

    async playButtonHover() {
        return this.generateF1Sound('BUTTON_HOVER')
    }

    async playCheckeredFlag() {
        return this.generateF1Sound('CHECKERED_FLAG')
    }

    // Play multiple sounds in sequence
    async playSequence(sounds) {
        for (const sound of sounds) {
            if (typeof sound === 'string') {
                await this.generateF1Sound(sound)
            } else {
                await this.generateF1Sound(sound.type, sound.options)
            }
        }
    }

    // Play victory celebration sequence
    async playVictoryCelebration() {
        const celebrationSequence = [{
                type: 'CHECKERED_FLAG',
                options: {
                    duration: 800
                }
            },
            {
                type: 'VICTORY_HORN',
                options: {
                    duration: 1000
                }
            },
            {
                type: 'ENGINE_REV',
                options: {
                    duration: 600
                }
            }
        ]

        return this.playSequence(celebrationSequence)
    }

    // Play pit stop sequence
    async playPitStopSequence() {
        const pitStopSequence = [{
                type: 'TIRE_SCREECH',
                options: {
                    duration: 200
                }
            },
            {
                type: 'PIT_RADIO',
                options: {
                    duration: 300
                }
            },
            {
                type: 'ENGINE_REV',
                options: {
                    duration: 400
                }
            }
        ]

        return this.playSequence(pitStopSequence)
    }

    // Initialize audio on user interaction (required for autoplay policies)
    async initializeOnUserInteraction() {
        if (!this.isInitialized) {
            await this.initializeAudioContext()
        }

        // Play a silent sound to unlock audio context
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume()
        }
    }

    // Cleanup audio resources
    dispose() {
        if (this.audioContext) {
            this.audioContext.close()
            this.audioContext = null
        }
        this.sounds.clear()
        this.fallbackSounds.clear()
        this.isInitialized = false
    }
}

// Create singleton instance
const f1AudioSystem = new F1AudioSystem()

// Export both the class and singleton instance
export {
    F1AudioSystem,
    f1AudioSystem
}

// Convenience functions for easy use
export const playF1Sound = (soundType, options) => f1AudioSystem.generateF1Sound(soundType, options)
export const playEngineRev = (intensity) => f1AudioSystem.playEngineRev(intensity)
export const playTireScreech = (duration) => f1AudioSystem.playTireScreech(duration)
export const playVictoryHorn = () => f1AudioSystem.playVictoryHorn()
export const playPitRadio = () => f1AudioSystem.playPitRadio()
export const playButtonHover = () => f1AudioSystem.playButtonHover()
export const playCheckeredFlag = () => f1AudioSystem.playCheckeredFlag()
export const playVictoryCelebration = () => f1AudioSystem.playVictoryCelebration()
export const playPitStopSequence = () => f1AudioSystem.playPitStopSequence()

// Initialize audio system on first user interaction
let audioInitialized = false
const initializeAudioOnInteraction = () => {
    if (!audioInitialized) {
        f1AudioSystem.initializeOnUserInteraction()
        audioInitialized = true

        // Remove event listeners after first interaction
        document.removeEventListener('click', initializeAudioOnInteraction)
        document.removeEventListener('keydown', initializeAudioOnInteraction)
        document.removeEventListener('touchstart', initializeAudioOnInteraction)
    }
}

// Add event listeners for audio initialization
if (typeof document !== 'undefined') {
    document.addEventListener('click', initializeAudioOnInteraction)
    document.addEventListener('keydown', initializeAudioOnInteraction)
    document.addEventListener('touchstart', initializeAudioOnInteraction)
}

export default f1AudioSystem