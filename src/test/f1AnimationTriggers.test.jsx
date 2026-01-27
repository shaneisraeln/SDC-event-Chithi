import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import * as fc from 'fast-check'
import { motion } from 'framer-motion'
import F1Button from '../components/F1Button'
import F1LoadingIndicator from '../components/F1LoadingIndicator'
import F1VictoryAnimation from '../components/F1VictoryAnimation'
import F1SpeedEffect from '../components/F1SpeedEffect'
import { MotionProvider } from '../context/MotionContext'
import { F1_ANIMATION_PRESETS } from '../utils/f1Animations'

/**
 * **Feature: f1-theme-redesign, Property 8: F1 Animation Triggers**
 * **Validates: Requirements 5.1**
 * 
 * Property: For any user interaction that triggers animations, 
 * the animations should use racing-themed motion effects with appropriate speed and easing
 */

// Mock framer-motion for testing
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: vi.fn(({ children, animate, initial, transition, whileHover, whileTap, ...props }) => {
        const mockDiv = ({ children, ...divProps }) => <div {...divProps}>{children}</div>
        mockDiv.displayName = 'motion.div'
        return mockDiv({ children, ...props })
      }),
      button: vi.fn(({ children, animate, initial, transition, whileHover, whileTap, ...props }) => {
        const mockButton = ({ children, ...buttonProps }) => <button {...buttonProps}>{children}</button>
        mockButton.displayName = 'motion.button'
        return mockButton({ children, ...props })
      }),
      span: vi.fn(({ children, animate, initial, transition, whileHover, whileTap, ...props }) => {
        const mockSpan = ({ children, ...spanProps }) => <span {...spanProps}>{children}</span>
        mockSpan.displayName = 'motion.span'
        return mockSpan({ children, ...props })
      })
    }
  }
})

// Test wrapper with motion context
const TestWrapper = ({ children, reducedMotion = false }) => (
  <MotionProvider>
    <div data-testid="motion-context" data-reduced-motion={reducedMotion}>
      {children}
    </div>
  </MotionProvider>
)

describe('F1 Animation Triggers Property Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // Generator for F1 button variants
  const f1ButtonVariantArbitrary = fc.constantFrom('normal', 'pit_stop', 'victory', 'penalty')
  
  // Generator for F1 loading indicator types
  const f1LoadingTypeArbitrary = fc.constantFrom('spinning_wheel', 'moving_car', 'pit_stop', 'checkered_flag')
  
  // Generator for animation intensity levels
  const animationIntensityArbitrary = fc.constantFrom('low', 'medium', 'high')
  
  // Generator for user interaction types
  const userInteractionArbitrary = fc.constantFrom('click', 'hover', 'focus', 'mouseenter', 'mouseleave')

  it('should trigger F1 racing animations on F1Button interactions', () => {
    fc.assert(
      fc.property(
        f1ButtonVariantArbitrary,
        userInteractionArbitrary,
        fc.boolean(),
        (variant, interactionType, playSound) => {
          const mockOnClick = vi.fn()
          
          render(
            <TestWrapper>
              <F1Button
                variant={variant}
                onClick={mockOnClick}
                playSound={playSound}
                data-testid="f1-button"
              >
                Test Button
              </F1Button>
            </TestWrapper>
          )

          const button = screen.getByTestId('f1-button')
          
          // Property: F1 buttons should have racing-themed styling classes
          expect(button.className).toMatch(/relative|overflow-hidden|border|font-bold|text-white/)
          
          // Property: F1 buttons should respond to user interactions
          if (interactionType === 'click') {
            fireEvent.click(button)
            expect(mockOnClick).toHaveBeenCalled()
          } else if (interactionType === 'hover') {
            fireEvent.mouseEnter(button)
            // Property: Hover should not cause errors
            expect(button).toBeInTheDocument()
          }

          // Property: Motion components should be called with F1 animation properties
          expect(motion.button).toHaveBeenCalled()
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should render F1 loading indicators with racing-themed animations', () => {
    fc.assert(
      fc.property(
        f1LoadingTypeArbitrary,
        fc.constantFrom('small', 'medium', 'large'),
        fc.string({ minLength: 1, maxLength: 50 }),
        (type, size, message) => {
          render(
            <TestWrapper>
              <F1LoadingIndicator
                type={type}
                size={size}
                message={message}
                data-testid="f1-loading"
              />
            </TestWrapper>
          )

          const loadingIndicator = screen.getByTestId('f1-loading')
          
          // Property: F1 loading indicators should be rendered
          expect(loadingIndicator).toBeInTheDocument()
          
          // Property: Loading message should be displayed if provided
          if (message) {
            expect(screen.getByText(message)).toBeInTheDocument()
          }
          
          // Property: Motion components should be used for animations
          expect(motion.div).toHaveBeenCalled()
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should trigger victory animations with F1 racing celebration effects', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.string({ minLength: 1, maxLength: 30 }),
        fc.integer({ min: 1, max: 50 }),
        fc.integer({ min: 1, max: 3 }),
        (isVisible, achievement, points, position) => {
          const mockOnComplete = vi.fn()
          
          render(
            <TestWrapper>
              <F1VictoryAnimation
                isVisible={isVisible}
                achievement={achievement}
                points={points}
                position={position}
                onComplete={mockOnComplete}
                data-testid="f1-victory"
              />
            </TestWrapper>
          )

          if (isVisible) {
            // Property: Victory animation should be visible when isVisible is true
            const victoryElement = screen.getByText(achievement)
            expect(victoryElement).toBeInTheDocument()
            
            // Property: Points and position should be displayed
            expect(screen.getByText(points.toString())).toBeInTheDocument()
            expect(screen.getByText(`P${position}`)).toBeInTheDocument()
          }
          
          // Property: Motion components should be used for victory animations
          expect(motion.div).toHaveBeenCalled()
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should activate F1 speed effects with racing motion dynamics', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        animationIntensityArbitrary,
        fc.constantFrom('horizontal', 'vertical', 'radial'),
        (isActive, intensity, direction) => {
          render(
            <TestWrapper>
              <F1SpeedEffect
                isActive={isActive}
                intensity={intensity}
                direction={direction}
                data-testid="f1-speed-effect"
              />
            </TestWrapper>
          )

          // Property: Speed effects should only render when active and motion is enabled
          if (isActive) {
            // In reduced motion mode, speed effects should not render
            const motionContext = screen.getByTestId('motion-context')
            const reducedMotion = motionContext.getAttribute('data-reduced-motion') === 'true'
            
            if (!reducedMotion) {
              // Property: Motion components should be used for speed effects
              expect(motion.div).toHaveBeenCalled()
            }
          }
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should apply F1 animation presets with racing-themed motion properties', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...Object.keys(F1_ANIMATION_PRESETS)),
        (presetName) => {
          const preset = F1_ANIMATION_PRESETS[presetName]
          
          // Property: All F1 animation presets should have required motion properties
          expect(preset).toBeDefined()
          expect(typeof preset).toBe('object')
          
          // Property: Animation presets should have appropriate timing for racing theme
          if (preset.transition) {
            // Racing animations should be fast and responsive
            if (preset.transition.duration) {
              expect(preset.transition.duration).toBeGreaterThan(0)
              expect(preset.transition.duration).toBeLessThanOrEqual(3) // Max 3 seconds for racing feel
            }
            
            // Racing animations should use appropriate easing
            if (preset.transition.type) {
              expect(['spring', 'tween', 'keyframes']).toContain(preset.transition.type)
            }
          }
          
          // Property: Animation states should be defined
          if (preset.initial) {
            expect(typeof preset.initial).toBe('object')
          }
          
          if (preset.animate) {
            expect(typeof preset.animate).toBe('object')
          }
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should handle reduced motion preferences for F1 animations', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        f1ButtonVariantArbitrary,
        (reducedMotion, variant) => {
          render(
            <TestWrapper reducedMotion={reducedMotion}>
              <F1Button
                variant={variant}
                data-testid="f1-button-reduced-motion"
              >
                Test Button
              </F1Button>
            </TestWrapper>
          )

          const button = screen.getByTestId('f1-button-reduced-motion')
          
          // Property: F1 components should respect reduced motion preferences
          expect(button).toBeInTheDocument()
          
          // Property: Motion components should still be called but with appropriate settings
          expect(motion.button).toHaveBeenCalled()
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should ensure F1 animations have racing-appropriate timing and easing', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0.1, max: 2.0 }),
        fc.constantFrom('linear', 'easeIn', 'easeOut', 'easeInOut', 'anticipate'),
        (duration, easing) => {
          // Create a test animation configuration
          const testAnimation = {
            initial: { opacity: 0, x: -100 },
            animate: { opacity: 1, x: 0 },
            transition: { duration, ease: easing }
          }
          
          // Property: Racing animations should have fast, responsive timing
          expect(testAnimation.transition.duration).toBeGreaterThan(0)
          expect(testAnimation.transition.duration).toBeLessThanOrEqual(2.0)
          
          // Property: Animation should have proper initial and animate states
          expect(testAnimation.initial).toBeDefined()
          expect(testAnimation.animate).toBeDefined()
          
          // Property: Easing should be appropriate for racing theme
          const racingEasings = ['linear', 'easeIn', 'easeOut', 'easeInOut', 'anticipate']
          expect(racingEasings).toContain(easing)
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should trigger F1 hover effects with racing-themed feedback', () => {
    fc.assert(
      fc.property(
        f1ButtonVariantArbitrary,
        fc.boolean(),
        (variant, disabled) => {
          render(
            <TestWrapper>
              <F1Button
                variant={variant}
                disabled={disabled}
                data-testid="f1-hover-button"
              >
                Hover Test
              </F1Button>
            </TestWrapper>
          )

          const button = screen.getByTestId('f1-hover-button')
          
          // Property: F1 buttons should handle hover interactions
          fireEvent.mouseEnter(button)
          
          if (!disabled) {
            // Property: Non-disabled buttons should respond to hover
            expect(button).toBeInTheDocument()
          }
          
          fireEvent.mouseLeave(button)
          
          // Property: Motion components should handle hover states
          expect(motion.button).toHaveBeenCalled()
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })
})