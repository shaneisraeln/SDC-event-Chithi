import {
    describe,
    it,
    expect
} from 'vitest'
import * as fc from 'fast-check'
import {
    F1_COLORS,
    F1_TEAMS,
    DEFAULT_F1_THEME
} from '../config/f1Theme.js'
import {
    validateF1ColorScheme,
    isF1Color,
    hasF1Styling
} from '../utils/f1ThemeUtils.js'

/**
 * **Feature: f1-theme-redesign, Property 1: F1 Color Scheme Consistency**
 * **Validates: Requirements 1.3**
 * 
 * Property: For any visual element rendered in the application, 
 * the element should use F1 color schemes including racing red (#DC143C), 
 * carbon fiber black (#1C1C1C), and championship gold (#FFD700)
 */

describe('F1 Theme Color Scheme Consistency', () => {
    // Generator for F1 color values
    const f1ColorArbitrary = fc.constantFrom(...Object.values(F1_COLORS))

    // Generator for color configuration objects
    const f1ColorConfigArbitrary = fc.record({
        primary: f1ColorArbitrary,
        secondary: f1ColorArbitrary,
        background: f1ColorArbitrary,
        accent: f1ColorArbitrary
    })

    // Generator for team configurations
    const f1TeamArbitrary = fc.constantFrom(...Object.values(F1_TEAMS))

    it('should validate that all F1 color values are from the official F1 palette', () => {
        fc.assert(
            fc.property(f1ColorArbitrary, (color) => {
                // Property: Any color from F1_COLORS should be recognized as an F1 color
                expect(isF1Color(color)).toBe(true)

                // Property: F1 colors should be valid hex color codes
                expect(color).toMatch(/^#[0-9A-F]{6}$/i)

                return true
            }), {
                numRuns: 100
            }
        )
    })

    it('should ensure F1 color configurations contain only F1 palette colors', () => {
        fc.assert(
            fc.property(f1ColorConfigArbitrary, (colorConfig) => {
                // Property: Any valid F1 color configuration should pass validation
                expect(validateF1ColorScheme(colorConfig)).toBe(true)

                // Property: All colors in the configuration should be from F1 palette
                Object.values(colorConfig).forEach(color => {
                    expect(isF1Color(color)).toBe(true)
                })

                return true
            }), {
                numRuns: 100
            }
        )
    })

    it('should verify F1 team configurations use consistent F1 colors', () => {
        fc.assert(
            fc.property(f1TeamArbitrary, (team) => {
                // Property: All F1 team primary colors should be from F1 palette
                expect(isF1Color(team.primaryColor)).toBe(true)

                // Property: All F1 team secondary colors should be from F1 palette  
                expect(isF1Color(team.secondaryColor)).toBe(true)

                // Property: Team colors should be valid hex codes
                expect(team.primaryColor).toMatch(/^#[0-9A-F]{6}$/i)
                expect(team.secondaryColor).toMatch(/^#[0-9A-F]{6}$/i)

                return true
            }), {
                numRuns: 100
            }
        )
    })

    it('should ensure default F1 theme uses only F1 palette colors', () => {
        // Property: Default theme colors should all be from F1 palette
        expect(validateF1ColorScheme(DEFAULT_F1_THEME.colors)).toBe(true)

        // Property: Default theme team colors should be from F1 palette
        expect(isF1Color(DEFAULT_F1_THEME.team.primaryColor)).toBe(true)
        expect(isF1Color(DEFAULT_F1_THEME.team.secondaryColor)).toBe(true)
    })

    it('should detect F1 styling in DOM elements with F1 CSS classes', () => {
        fc.assert(
            fc.property(
                fc.constantFrom(
                    'f1-racing-red',
                    'f1-carbon-black',
                    'f1-championship-gold',
                    'font-f1-display',
                    'animate-f1-speed',
                    'bg-f1-ferrari-red',
                    'text-f1-mercedes-silver',
                    'border-f1-pit-lane-yellow'
                ),
                (f1ClassName) => {
                    // Create mock DOM element with F1 class
                    const mockElement = {
                        className: `some-class ${f1ClassName} other-class`
                    }

                    // Property: Elements with F1 classes should be detected as F1-styled
                    expect(hasF1Styling(mockElement)).toBe(true)

                    return true
                }
            ), {
                numRuns: 100
            }
        )
    })

    it('should reject non-F1 colors in validation', () => {
        fc.assert(
            fc.property(
                fc.record({
                    primary: fc.constantFrom('#FF0000', '#00FF00', '#0000FF', '#PURPLE', 'red'),
                    secondary: fc.constantFrom('#FFFFFF', '#000000', '#GRAY', 'blue'),
                    background: fc.constantFrom('#123456', '#ABCDEF', 'green'),
                    accent: fc.constantFrom('#999999', '#CCCCCC', 'yellow')
                }),
                (nonF1ColorConfig) => {
                    // Property: Color configurations with non-F1 colors should fail validation
                    expect(validateF1ColorScheme(nonF1ColorConfig)).toBe(false)

                    return true
                }
            ), {
                numRuns: 100
            }
        )
    })

    it('should ensure core F1 brand colors are always available', () => {
        // Property: Core F1 brand colors must always be present in F1_COLORS
        expect(F1_COLORS.RACING_RED).toBe('#DC143C')
        expect(F1_COLORS.CARBON_BLACK).toBe('#1C1C1C')
        expect(F1_COLORS.CHAMPIONSHIP_GOLD).toBe('#FFD700')

        // Property: Core colors should be recognized as F1 colors
        expect(isF1Color('#DC143C')).toBe(true)
        expect(isF1Color('#1C1C1C')).toBe(true)
        expect(isF1Color('#FFD700')).toBe(true)
    })
})