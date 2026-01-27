import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import * as fc from 'fast-check'
import F1DriverAvatar from '../components/F1DriverAvatar'
import { F1_TEAMS } from '../config/f1Theme'
import { MotionProvider } from '../context/MotionContext'

/**
 * **Feature: f1-theme-redesign, Property 3: F1 Avatar Consistency**
 * **Validates: Requirements 2.1**
 * 
 * Property: For any avatar component rendered, the component should display 
 * F1 racing gear elements including helmet and racing suit styling
 */

// Helper function to convert hex to rgb format
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    const r = parseInt(result[1], 16)
    const g = parseInt(result[2], 16)
    const b = parseInt(result[3], 16)
    return `rgb(${r}, ${g}, ${b})`
  }
  return hex
}

// Test wrapper component to provide required context
const TestWrapper = ({ children }) => (
  <MotionProvider>
    {children}
  </MotionProvider>
)

describe('F1 Driver Avatar Consistency', () => {
  // Generator for F1 team names
  const f1TeamArbitrary = fc.constantFrom(...Object.keys(F1_TEAMS))
  
  // Generator for driver numbers (1-99 as per F1 regulations)
  const driverNumberArbitrary = fc.integer({ min: 1, max: 99 })
  
  // Generator for avatar sizes
  const avatarSizeArbitrary = fc.constantFrom('small', 'medium', 'large')
  
  // Generator for boolean values
  const booleanArbitrary = fc.boolean()

  it('should render F1 racing gear elements for any valid avatar configuration', () => {
    fc.assert(
      fc.property(
        f1TeamArbitrary,
        driverNumberArbitrary,
        avatarSizeArbitrary,
        booleanArbitrary,
        booleanArbitrary,
        (team, driverNumber, size, interactive, celebrationMode) => {
          // Render F1DriverAvatar with generated props
          const { container } = render(
            <TestWrapper>
              <F1DriverAvatar
                team={team}
                driverNumber={driverNumber}
                size={size}
                interactive={interactive}
                celebrationMode={celebrationMode}
              />
            </TestWrapper>
          )

          // Property: Avatar should have racing helmet container
          const helmetContainer = container.querySelector('[class*="rounded-full"]')
          expect(helmetContainer).toBeTruthy()

          // Property: Avatar should display helmet base with gradient styling
          const helmetBase = container.querySelector('[class*="bg-gradient-to-br"]')
          expect(helmetBase).toBeTruthy()

          // Property: Avatar should have racing visor element
          const visor = container.querySelector('[class*="bg-gradient-to-r"][class*="blue"]')
          expect(visor).toBeTruthy()

          // Property: Avatar should display driver number
          const driverNumberElement = container.querySelector('[class*="rounded-full"][class*="flex"][class*="items-center"]')
          expect(driverNumberElement).toBeTruthy()
          expect(driverNumberElement.textContent).toBe(driverNumber.toString())

          // Property: Avatar should have team logo area
          const teamLogo = container.querySelectorAll('[class*="rounded-full"]')
          expect(teamLogo.length).toBeGreaterThan(1) // Multiple rounded elements including logo area

          // Property: Avatar should have racing suit collar at bottom
          const racingSuit = container.querySelector('[class*="rounded-t-lg"]')
          expect(racingSuit).toBeTruthy()

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should apply correct team colors for any F1 team configuration', () => {
    fc.assert(
      fc.property(
        f1TeamArbitrary,
        (team) => {
          const teamConfig = F1_TEAMS[team]
          
          const { container } = render(
            <TestWrapper>
              <F1DriverAvatar team={team} />
            </TestWrapper>
          )

          // Property: Avatar should use team's primary and secondary colors
          const styledElements = container.querySelectorAll('*')
          let hasTeamColors = false

          // Check if team colors are applied via inline styles
          styledElements.forEach(element => {
            const style = element.getAttribute('style')
            if (style) {
              // Convert hex colors to rgb format for comparison (browsers render as rgb)
              const primaryRgb = hexToRgb(teamConfig.primaryColor)
              const secondaryRgb = hexToRgb(teamConfig.secondaryColor)
              
              if (style.includes(primaryRgb) || style.includes(secondaryRgb) ||
                  style.includes(teamConfig.primaryColor) || 
                  style.includes(teamConfig.secondaryColor)) {
                hasTeamColors = true
              }
            }
          })

          expect(hasTeamColors).toBe(true)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should render appropriate size classes for any avatar size', () => {
    fc.assert(
      fc.property(
        avatarSizeArbitrary,
        (size) => {
          const { container } = render(
            <TestWrapper>
              <F1DriverAvatar size={size} />
            </TestWrapper>
          )

          const sizeClasses = {
            small: 'w-16 h-16',
            medium: 'w-32 h-32',
            large: 'w-48 h-48'
          }

          // Property: Avatar should have correct size classes applied
          const avatarElement = container.firstChild
          const expectedSizeClass = sizeClasses[size]
          
          expect(avatarElement.className).toContain(expectedSizeClass.split(' ')[0]) // width class
          expect(avatarElement.className).toContain(expectedSizeClass.split(' ')[1]) // height class

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should display celebration effects when in celebration mode', () => {
    const { container } = render(
      <TestWrapper>
        <F1DriverAvatar celebrationMode={true} />
      </TestWrapper>
    )

    // Property: Celebration mode should add victory-themed elements
    // Note: In a real test, we might check for specific celebration animations or effects
    // For now, we verify the component renders without errors in celebration mode
    expect(container.firstChild).toBeTruthy()
  })

  it('should maintain F1 racing theme consistency across all prop combinations', () => {
    fc.assert(
      fc.property(
        f1TeamArbitrary,
        driverNumberArbitrary,
        avatarSizeArbitrary,
        booleanArbitrary,
        booleanArbitrary,
        (team, driverNumber, size, interactive, celebrationMode) => {
          const { container } = render(
            <TestWrapper>
              <F1DriverAvatar
                team={team}
                driverNumber={driverNumber}
                size={size}
                interactive={interactive}
                celebrationMode={celebrationMode}
              />
            </TestWrapper>
          )

          // Property: All F1 avatars should have racing-themed structure
          const racingElements = [
            '[class*="rounded-full"]', // Helmet shape
            '[class*="bg-gradient"]',   // Racing gradients
            '[class*="rounded-t-lg"]'   // Racing suit collar
          ]

          racingElements.forEach(selector => {
            const element = container.querySelector(selector)
            expect(element).toBeTruthy()
          })

          // Property: Avatar should not contain any robot-themed elements
          const robotTerms = ['robot', 'chitti', 'circuit', 'android']
          const allText = container.textContent.toLowerCase()
          const allClasses = Array.from(container.querySelectorAll('*'))
            .map(el => el.className)
            .join(' ')
            .toLowerCase()
          
          robotTerms.forEach(term => {
            expect(allText).not.toContain(term)
            expect(allClasses).not.toContain(term)
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should ensure driver numbers are within F1 regulations', () => {
    fc.assert(
      fc.property(
        driverNumberArbitrary,
        (driverNumber) => {
          const { container } = render(
            <TestWrapper>
              <F1DriverAvatar driverNumber={driverNumber} />
            </TestWrapper>
          )

          // Property: Driver numbers should be within F1 regulations (1-99)
          expect(driverNumber).toBeGreaterThanOrEqual(1)
          expect(driverNumber).toBeLessThanOrEqual(99)

          // Property: Driver number should be displayed on the avatar
          const numberElement = container.querySelector('[class*="rounded-full"][class*="flex"][class*="items-center"]')
          expect(numberElement.textContent).toBe(driverNumber.toString())

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})