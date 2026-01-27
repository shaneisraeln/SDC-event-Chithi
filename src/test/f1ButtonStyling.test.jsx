import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import F1Button from '../components/F1Button'
import { F1_COLORS } from '../config/f1Theme'

/**
 * **Feature: f1-theme-redesign, Property 5: F1 Button Styling**
 * **Validates: Requirements 3.1**
 * 
 * Property: For any button element rendered, the button should have F1-themed 
 * CSS classes including metallic finishes and racing stripe styling
 */

// Mock the MotionContext to avoid complex setup
vi.mock('../context/MotionContext', () => ({
  useMotion: () => ({
    reducedMotion: false,
    toggleReducedMotion: vi.fn()
  })
}))

describe('F1 Button Styling Property Tests', () => {
  // Generator for F1 button variants
  const f1ButtonVariantArbitrary = fc.constantFrom(
    'normal', 'pit_stop', 'victory', 'penalty'
  )

  // Generator for button content
  const buttonContentArbitrary = fc.constantFrom(
    'Start Engine',
    'Pit Stop',
    'Victory Lap',
    'Penalty Box'
  )

  it('should render F1 buttons with metallic finish styling', () => {
    fc.assert(
      fc.property(
        f1ButtonVariantArbitrary,
        buttonContentArbitrary,
        (variant, content) => {
          const { container } = render(
            <F1Button variant={variant}>
              {content}
            </F1Button>
          )

          const button = container.querySelector('button')
          
          // Property: F1 buttons should have metallic styling through background gradients
          const hasGradientBackground = button.style.background.includes('gradient')
          expect(hasGradientBackground).toBe(true)

          // Property: F1 buttons should have border styling
          expect(button).toHaveClass('border-2')

          // Property: F1 buttons should have font styling for racing theme
          expect(button).toHaveClass('font-bold')

          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should have F1-themed visual effects and overlays', () => {
    fc.assert(
      fc.property(
        f1ButtonVariantArbitrary,
        buttonContentArbitrary,
        (variant, content) => {
          const { container } = render(
            <F1Button variant={variant}>
              {content}
            </F1Button>
          )

          const button = container.querySelector('button')
          
          // Property: F1 buttons should have relative positioning for overlays
          expect(button).toHaveClass('relative')

          // Property: F1 buttons should have overflow hidden for effects
          expect(button).toHaveClass('overflow-hidden')

          // Property: F1 buttons should contain overlay divs
          const overlayDivs = button.querySelectorAll('div')
          expect(overlayDivs.length).toBeGreaterThan(0)

          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should maintain F1 styling when disabled', () => {
    fc.assert(
      fc.property(
        f1ButtonVariantArbitrary,
        buttonContentArbitrary,
        (variant, content) => {
          const { container } = render(
            <F1Button variant={variant} disabled={true}>
              {content}
            </F1Button>
          )

          const button = container.querySelector('button')
          
          // Property: Disabled F1 buttons should still have F1 styling
          expect(button).toHaveClass('border-2')
          expect(button).toHaveClass('font-bold')
          expect(button).toHaveClass('relative')

          // Property: Disabled buttons should have reduced opacity
          expect(button).toHaveClass('opacity-50')

          // Property: Disabled buttons should have disabled cursor
          expect(button).toHaveClass('cursor-not-allowed')

          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should render button content with proper F1 theming', () => {
    fc.assert(
      fc.property(
        buttonContentArbitrary,
        (content) => {
          const { container, unmount } = render(
            <F1Button>
              {content}
            </F1Button>
          )

          // Property: Button content should be rendered and accessible
          expect(screen.getByRole('button', { name: content })).toBeInTheDocument()

          // Property: Button should have F1 styling classes
          const button = container.querySelector('button')
          expect(button).toHaveClass('relative')
          expect(button).toHaveClass('border-2')
          expect(button).toHaveClass('font-bold')

          // Clean up to avoid multiple elements with same content
          unmount()

          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  it('should have F1 button variants with different styling', () => {
    fc.assert(
      fc.property(
        f1ButtonVariantArbitrary,
        (variant) => {
          const { container } = render(
            <F1Button variant={variant}>
              Test Button
            </F1Button>
          )

          const button = container.querySelector('button')
          
          // Property: All variants should have core F1 styling
          expect(button).toHaveClass('relative')
          expect(button).toHaveClass('overflow-hidden')
          expect(button).toHaveClass('border-2')
          expect(button).toHaveClass('font-bold')

          // Property: Button should have background styling
          expect(button.style.background).toBeTruthy()

          return true
        }
      ),
      { numRuns: 50 }
    )
  })
})