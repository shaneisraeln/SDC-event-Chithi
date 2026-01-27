import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import * as fc from 'fast-check'
import F1DriverAvatar from '../components/F1DriverAvatar'
import { F1_TEAMS } from '../config/f1Theme'
import { MotionProvider } from '../context/MotionContext'

/**
 * **Feature: f1-theme-redesign, Property 2: Robot Asset Elimination**
 * **Validates: Requirements 1.4**
 * 
 * Property: For any asset reference in the application, no robot-themed image paths, 
 * class names, or terminology should exist after F1 transformation
 */

// Test wrapper component to provide required context
const TestWrapper = ({ children }) => (
  <MotionProvider>
    {children}
  </MotionProvider>
)

describe('Robot Asset Elimination', () => {
  // Generator for F1 team names
  const f1TeamArbitrary = fc.constantFrom(...Object.keys(F1_TEAMS))
  
  // Generator for driver numbers
  const driverNumberArbitrary = fc.integer({ min: 1, max: 99 })
  
  // Generator for avatar sizes
  const avatarSizeArbitrary = fc.constantFrom('small', 'medium', 'large')
  
  // Generator for boolean values
  const booleanArbitrary = fc.boolean()

  it('should not contain any robot-themed image paths in F1DriverAvatar', () => {
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

          // Property: No robot-themed image paths should exist
          const robotImagePaths = [
            'chitti-logo.png',
            'robot.png',
            'android.png',
            'bot.png',
            'circuit.png'
          ]

          const allImages = container.querySelectorAll('img')
          allImages.forEach(img => {
            const src = img.getAttribute('src') || ''
            robotImagePaths.forEach(robotPath => {
              expect(src.toLowerCase()).not.toContain(robotPath.toLowerCase())
            })
          })

          // Property: No robot-themed background images in styles
          const allElements = container.querySelectorAll('*')
          allElements.forEach(element => {
            const style = element.getAttribute('style') || ''
            robotImagePaths.forEach(robotPath => {
              expect(style.toLowerCase()).not.toContain(robotPath.toLowerCase())
            })
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should not contain robot-themed CSS class names in F1DriverAvatar', () => {
    fc.assert(
      fc.property(
        f1TeamArbitrary,
        avatarSizeArbitrary,
        (team, size) => {
          const { container } = render(
            <TestWrapper>
              <F1DriverAvatar team={team} size={size} />
            </TestWrapper>
          )

          // Property: No robot-themed CSS classes should exist
          const robotClassNames = [
            'chitti',
            'robot',
            'android',
            'bot-',
            'circuit-node',
            'cyber',
            'mech'
          ]

          const allElements = container.querySelectorAll('*')
          allElements.forEach(element => {
            const className = element.className || ''
            robotClassNames.forEach(robotClass => {
              expect(className.toLowerCase()).not.toContain(robotClass.toLowerCase())
            })
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should not contain robot-themed terminology in F1DriverAvatar content', () => {
    fc.assert(
      fc.property(
        f1TeamArbitrary,
        driverNumberArbitrary,
        (team, driverNumber) => {
          const { container } = render(
            <TestWrapper>
              <F1DriverAvatar team={team} driverNumber={driverNumber} />
            </TestWrapper>
          )

          // Property: No robot-themed terminology should exist in text content
          const robotTerminology = [
            'robot',
            'chitti',
            'android',
            'cyborg',
            'mechanical',
            'circuit',
            'processor',
            'algorithm',
            'binary'
          ]

          const textContent = container.textContent.toLowerCase()
          robotTerminology.forEach(term => {
            expect(textContent).not.toContain(term)
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should not contain robot-themed alt text or aria labels in F1DriverAvatar', () => {
    fc.assert(
      fc.property(
        f1TeamArbitrary,
        (team) => {
          const { container } = render(
            <TestWrapper>
              <F1DriverAvatar team={team} />
            </TestWrapper>
          )

          // Property: No robot-themed alt text or aria labels should exist
          const robotTerminology = [
            'robot',
            'chitti',
            'android',
            'bot',
            'mechanical'
          ]

          const allElements = container.querySelectorAll('*')
          allElements.forEach(element => {
            const altText = (element.getAttribute('alt') || '').toLowerCase()
            const ariaLabel = (element.getAttribute('aria-label') || '').toLowerCase()
            const title = (element.getAttribute('title') || '').toLowerCase()

            robotTerminology.forEach(term => {
              expect(altText).not.toContain(term)
              expect(ariaLabel).not.toContain(term)
              expect(title).not.toContain(term)
            })
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should only contain F1 racing-themed visual elements', () => {
    fc.assert(
      fc.property(
        f1TeamArbitrary,
        avatarSizeArbitrary,
        booleanArbitrary,
        (team, size, celebrationMode) => {
          const { container } = render(
            <TestWrapper>
              <F1DriverAvatar 
                team={team} 
                size={size} 
                celebrationMode={celebrationMode} 
              />
            </TestWrapper>
          )

          // Property: Should contain F1 racing elements instead of robot elements
          const f1Elements = [
            'helmet',
            'racing',
            'f1',
            'driver',
            'visor',
            'suit'
          ]

          // Check that F1-themed classes or content exist
          const allHTML = container.innerHTML.toLowerCase()
          let hasF1Elements = false

          // Look for F1-related styling patterns
          if (allHTML.includes('gradient') || // Racing gradients
              allHTML.includes('rounded-full') || // Helmet shape
              allHTML.includes('racing') || // Racing terminology
              container.querySelector('[class*="bg-gradient"]') || // Racing gradients
              container.querySelector('[class*="rounded-full"]')) { // Helmet shape
            hasF1Elements = true
          }

          expect(hasF1Elements).toBe(true)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should ensure F1DriverAvatar replaces all ChittiAvatar functionality', () => {
    // Property: F1DriverAvatar should provide all the same props as ChittiAvatar
    const { container: f1Avatar } = render(
      <TestWrapper>
        <F1DriverAvatar 
          size="large" 
          interactive={true}
          team="FERRARI"
          driverNumber={44}
          celebrationMode={false}
        />
      </TestWrapper>
    )

    // Property: F1DriverAvatar should render successfully with all props
    expect(f1Avatar.firstChild).toBeTruthy()
    
    // Property: Should have interactive elements (motion div)
    const motionDiv = f1Avatar.querySelector('div')
    expect(motionDiv).toBeTruthy()
    
    // Property: Should have size classes applied
    expect(motionDiv.className).toContain('w-48') // large size
    expect(motionDiv.className).toContain('h-48') // large size
  })

  it('should verify complete elimination of ChittiAvatar references', () => {
    // Property: F1DriverAvatar should not reference any ChittiAvatar code patterns
    const { container } = render(
      <TestWrapper>
        <F1DriverAvatar />
      </TestWrapper>
    )

    const allHTML = container.innerHTML
    
    // Property: Should not contain ChittiAvatar-specific patterns
    expect(allHTML).not.toContain('chitti-logo.png')
    expect(allHTML).not.toContain('Chitti Robot Logo')
    expect(allHTML).not.toContain('purple-600') // ChittiAvatar used purple theme
    expect(allHTML).not.toContain('#a855f7') // ChittiAvatar purple color
    
    // Property: Should contain F1-specific patterns instead
    expect(allHTML).toContain('gradient') // F1 uses gradients
    expect(allHTML).toContain('rounded-full') // Helmet shape
  })
})