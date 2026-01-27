import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { transformNavigation, F1_CIRCUIT_NAMES } from '../utils/f1TerminologyMapper'

/**
 * Feature: f1-theme-redesign, Property 10: F1 Navigation Theming
 * **Validates: Requirements 7.5**
 * 
 * Property: For any navigation element displayed, the element should use F1 venue names 
 * and racing terminology for labels and sections
 */

describe('F1 Navigation Theming Property Tests', () => {
  it('Property 10: F1 Navigation Theming - should transform generic navigation labels to F1 venue names', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          // Generic navigation terms that should be transformed
          fc.constantFrom(
            'Dashboard',
            'Home',
            'Main',
            'Admin',
            'Settings',
            'Profile',
            'About',
            'Help',
            'Contact',
            'Level 1',
            'Level 2',
            'Level 3',
            'Level 4',
            'Level 5',
            'Challenge 1',
            'Challenge 2',
            'Round 1',
            'Round 2',
            'Section A',
            'Section B'
          ),
          // Menu items that should use racing terminology
          fc.constantFrom(
            'Start Challenge',
            'View Progress',
            'Submit Solution',
            'Check Results',
            'Reset Game',
            'Exit Application'
          )
        ),
        (genericNavLabel) => {
          const transformedLabel = transformNavigation(genericNavLabel)
          
          // Property: Transformed label should not be identical to generic label
          expect(transformedLabel.toLowerCase()).not.toBe(genericNavLabel.toLowerCase())
          
          // Property: Should contain F1 racing terminology
          const f1NavigationTerms = [
            'racing championship',
            'pit lane control',
            'championship podium',
            'racing academy',
            'circuit',
            'grand prix',
            'speedway',
            'international',
            'monaco',
            'silverstone',
            'monza',
            'spa-francorchamps',
            'suzuka',
            'bahrain',
            'catalunya',
            'red bull ring',
            'hungaroring',
            'villeneuve',
            'marina bay',
            'americas',
            'interlagos',
            'yas marina',
            'imola',
            'start your engines',
            'cross the finish line',
            'championship standings',
            'race results',
            'pit stop reset',
            'exit pit lane'
          ]
          
          const hasF1NavigationTerms = f1NavigationTerms.some(term => 
            transformedLabel.toLowerCase().includes(term.toLowerCase())
          )
          
          expect(hasF1NavigationTerms).toBe(true)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 10: F1 Navigation Theming - should use authentic F1 circuit names for level navigation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 15 }), // Generate level numbers
        (levelNumber) => {
          const genericLevelLabel = `Level ${levelNumber}`
          const transformedLabel = transformNavigation(genericLevelLabel)
          
          // Property: Should not contain generic "Level" terminology
          expect(transformedLabel.toLowerCase()).not.toContain('level')
          
          // Property: Should use authentic F1 circuit names
          const hasCircuitName = F1_CIRCUIT_NAMES.some(circuitName => 
            transformedLabel.toLowerCase().includes(circuitName.toLowerCase()) ||
            circuitName.toLowerCase().includes(transformedLabel.toLowerCase())
          )
          
          expect(hasCircuitName).toBe(true)
          
          // Property: Should maintain hierarchical structure (if applicable)
          if (levelNumber <= F1_CIRCUIT_NAMES.length) {
            // Should map to a specific circuit
            expect(transformedLabel.length).toBeGreaterThan(5) // Circuit names are longer than "Level"
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 10: F1 Navigation Theming - should maintain navigation hierarchy with racing context', () => {
    fc.assert(
      fc.property(
        fc.record({
          section: fc.constantFrom('Main', 'Settings', 'Profile', 'Help'),
          subsection: fc.constantFrom('Overview', 'Details', 'Advanced', 'Support')
        }),
        ({ section, subsection }) => {
          const hierarchicalNav = `${section} > ${subsection}`
          const transformedNav = transformNavigation(hierarchicalNav)
          
          // Property: Should maintain hierarchical structure
          expect(transformedNav).toContain('>')
          
          // Property: Both parts should be transformed to racing terminology
          const parts = transformedNav.split('>').map(part => part.trim())
          expect(parts).toHaveLength(2)
          
          // Property: Each part should contain racing terminology
          parts.forEach(part => {
            const racingTerms = [
              'racing', 'championship', 'pit', 'circuit', 'track', 'grand prix',
              'speedway', 'academy', 'control', 'podium', 'garage', 'paddock'
            ]
            
            const hasRacingTerm = racingTerms.some(term => 
              part.toLowerCase().includes(term)
            )
            
            expect(hasRacingTerm).toBe(true)
          })
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 10: F1 Navigation Theming - should handle breadcrumb navigation with F1 terminology', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom('Home', 'Dashboard', 'Level', 'Challenge', 'Problem', 'Solution'),
          { minLength: 2, maxLength: 5 }
        ),
        (breadcrumbItems) => {
          const breadcrumb = breadcrumbItems.join(' / ')
          const transformedBreadcrumb = transformNavigation(breadcrumb)
          
          // Property: Should maintain breadcrumb structure
          const originalSeparators = (breadcrumb.match(/\//g) || []).length
          const transformedSeparators = (transformedBreadcrumb.match(/\//g) || []).length
          expect(transformedSeparators).toBe(originalSeparators)
          
          // Property: Each breadcrumb item should be transformed
          const transformedItems = transformedBreadcrumb.split(' / ')
          expect(transformedItems.length).toBe(breadcrumbItems.length)
          
          // Property: No generic terms should remain
          const genericTerms = ['home', 'dashboard', 'level', 'challenge', 'problem', 'solution']
          transformedItems.forEach(item => {
            genericTerms.forEach(genericTerm => {
              expect(item.toLowerCase()).not.toBe(genericTerm)
            })
          })
          
          // Property: Should contain F1 racing terminology
          const hasF1Terms = transformedItems.some(item => {
            const f1Terms = ['racing', 'circuit', 'grand prix', 'championship', 'pit', 'track']
            return f1Terms.some(term => item.toLowerCase().includes(term))
          })
          
          expect(hasF1Terms).toBe(true)
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 10: F1 Navigation Theming - should apply consistent F1 branding to menu items', () => {
    fc.assert(
      fc.property(
        fc.record({
          category: fc.constantFrom('File', 'Edit', 'View', 'Tools', 'Help'),
          action: fc.constantFrom('New', 'Open', 'Save', 'Close', 'Exit', 'Copy', 'Paste', 'Delete')
        }),
        ({ category, action }) => {
          const menuItem = `${category} > ${action}`
          const transformedMenuItem = transformNavigation(menuItem)
          
          // Property: Should transform both category and action
          expect(transformedMenuItem.toLowerCase()).not.toContain(category.toLowerCase())
          expect(transformedMenuItem.toLowerCase()).not.toContain(action.toLowerCase())
          
          // Property: Should use consistent F1 branding
          const f1BrandingTerms = [
            'racing', 'championship', 'pit', 'garage', 'paddock', 'circuit',
            'track', 'grand prix', 'academy', 'control', 'telemetry'
          ]
          
          const hasBranding = f1BrandingTerms.some(term => 
            transformedMenuItem.toLowerCase().includes(term)
          )
          
          expect(hasBranding).toBe(true)
          
          // Property: Should maintain professional racing terminology
          const professionalTerms = [
            'technical', 'strategic', 'performance', 'analysis', 'data',
            'setup', 'configuration', 'optimization'
          ]
          
          // At least some menu items should use professional racing terminology
          const hasProfessionalTerms = professionalTerms.some(term => 
            transformedMenuItem.toLowerCase().includes(term)
          )
          
          // This is a softer requirement - not all menu items need professional terms
          if (category === 'Tools' || action === 'Settings') {
            expect(hasProfessionalTerms).toBe(true)
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 10: F1 Navigation Theming - should handle dynamic navigation labels', () => {
    fc.assert(
      fc.property(
        fc.record({
          prefix: fc.constantFrom('Go to', 'Navigate to', 'Open', 'View'),
          target: fc.constantFrom('Dashboard', 'Profile', 'Settings', 'Level 1', 'Challenge 2'),
          suffix: fc.constantFrom('', ' Page', ' Section', ' Area')
        }),
        ({ prefix, target, suffix }) => {
          const dynamicLabel = `${prefix} ${target}${suffix}`
          const transformedLabel = transformNavigation(dynamicLabel)
          
          // Property: Should transform all components
          expect(transformedLabel.toLowerCase()).not.toContain(target.toLowerCase())
          
          // Property: Action words should be transformed to racing actions
          const racingActions = [
            'enter', 'access', 'navigate to', 'proceed to', 'advance to',
            'race to', 'drive to', 'head to', 'approach'
          ]
          
          if (prefix.toLowerCase().includes('go') || prefix.toLowerCase().includes('navigate')) {
            const hasRacingAction = racingActions.some(action => 
              transformedLabel.toLowerCase().includes(action)
            )
            expect(hasRacingAction).toBe(true)
          }
          
          // Property: Should maintain sentence structure
          expect(transformedLabel.trim().length).toBeGreaterThan(0)
          expect(transformedLabel).not.toBe(dynamicLabel) // Should be transformed
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 10: F1 Navigation Theming - should preserve accessibility while applying F1 theming', () => {
    fc.assert(
      fc.property(
        fc.record({
          label: fc.constantFrom('Home', 'Back', 'Next', 'Submit', 'Cancel', 'Help'),
          ariaLabel: fc.constantFrom('Go to home page', 'Go back', 'Next step', 'Submit form', 'Cancel action', 'Get help')
        }),
        ({ label, ariaLabel }) => {
          const transformedLabel = transformNavigation(label)
          const transformedAriaLabel = transformNavigation(ariaLabel)
          
          // Property: Both visible label and aria-label should be transformed
          expect(transformedLabel.toLowerCase()).not.toBe(label.toLowerCase())
          expect(transformedAriaLabel.toLowerCase()).not.toBe(ariaLabel.toLowerCase())
          
          // Property: Transformed labels should still be descriptive
          expect(transformedLabel.length).toBeGreaterThan(2)
          expect(transformedAriaLabel.length).toBeGreaterThan(5)
          
          // Property: Should maintain semantic meaning while using F1 terminology
          if (label.toLowerCase() === 'home') {
            expect(transformedLabel.toLowerCase()).toMatch(/(racing|championship|academy|main|central)/)
          }
          
          if (label.toLowerCase() === 'back') {
            expect(transformedLabel.toLowerCase()).toMatch(/(return|previous|pit|garage)/)
          }
          
          if (label.toLowerCase() === 'next') {
            expect(transformedLabel.toLowerCase()).toMatch(/(advance|proceed|continue|next|forward)/)
          }
          
          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})