import {
    F1_COLORS
} from '../config/f1Theme.js'

/**
 * Utility functions for F1 theme operations
 */

/**
 * Check if a color value is from the F1 color palette
 * @param {string} color - Color value to check
 * @returns {boolean} - True if color is from F1 palette
 */
export const isF1Color = (color) => {
    return Object.values(F1_COLORS).includes(color)
}

/**
 * Get F1 color class name for Tailwind CSS
 * @param {string} colorKey - Key from F1_COLORS object
 * @returns {string} - Tailwind CSS class name
 */
export const getF1ColorClass = (colorKey) => {
    const colorMap = {
        RACING_RED: 'f1-racing-red',
        CARBON_BLACK: 'f1-carbon-black',
        CHAMPIONSHIP_GOLD: 'f1-championship-gold',
        FERRARI_RED: 'f1-ferrari-red',
        MCLAREN_ORANGE: 'f1-mclaren-orange',
        MERCEDES_SILVER: 'f1-mercedes-silver',
        REDBULL_BLUE: 'f1-redbull-blue',
        ASTON_GREEN: 'f1-aston-green',
        ALPINE_PINK: 'f1-alpine-pink',
        WILLIAMS_BLUE: 'f1-williams-blue',
        HAAS_WHITE: 'f1-haas-white',
        ALPHATAURI_NAVY: 'f1-alphatauri-navy',
        ALFA_RED: 'f1-alfa-red',
        PIT_LANE_YELLOW: 'f1-pit-lane-yellow',
        CHECKERED_FLAG: 'f1-checkered-flag',
        TRACK_ASPHALT: 'f1-track-asphalt',
        TIRE_SMOKE: 'f1-tire-smoke'
    }

    return colorMap[colorKey] || 'f1-racing-red'
}

/**
 * Generate F1-themed CSS classes based on component type
 * @param {string} componentType - Type of component (button, card, modal, etc.)
 * @param {object} theme - Current F1 theme configuration
 * @returns {string} - Space-separated CSS classes
 */
export const generateF1Classes = (componentType, theme) => {
    const baseClasses = {
        button: 'font-f1-display tracking-wide transform transition-all duration-300',
        card: 'bg-gradient-to-br from-f1-carbon-black to-gray-900 border border-f1-racing-red',
        modal: 'bg-f1-carbon-black border-2 border-f1-championship-gold',
        text: 'font-f1-body text-f1-championship-gold',
        heading: 'font-f1-display text-f1-racing-red tracking-wider'
    }

    return baseClasses[componentType] || ''
}

/**
 * Check if element has F1 styling applied
 * @param {HTMLElement} element - DOM element to check
 * @returns {boolean} - True if element has F1 classes
 */
export const hasF1Styling = (element) => {
    if (!element || !element.className) return false

    const f1ClassPatterns = [
        /f1-/,
        /font-f1-/,
        /animate-f1-/,
        /bg-f1-/,
        /text-f1-/,
        /border-f1-/
    ]

    return f1ClassPatterns.some(pattern => pattern.test(element.className))
}

/**
 * Validate F1 color scheme consistency
 * @param {object} colors - Color configuration object
 * @returns {boolean} - True if colors are from F1 palette
 */
export const validateF1ColorScheme = (colors) => {
    if (!colors || typeof colors !== 'object') return false

    const colorValues = Object.values(colors)
    return colorValues.every(color =>
        typeof color === 'string' && isF1Color(color)
    )
}

/**
 * Get racing terminology for common UI elements
 * @param {string} element - UI element type
 * @returns {string} - F1 racing terminology
 */
export const getF1Terminology = (element) => {
    const terminology = {
        // Navigation
        home: 'Pit Lane',
        dashboard: 'Racing Dashboard',
        profile: 'Driver Profile',
        settings: 'Garage Settings',

        // Actions
        start: 'Start Engine',
        submit: 'Cross Finish Line',
        save: 'Pit Stop Save',
        cancel: 'Abort Lap',
        delete: 'Retire from Race',

        // Status
        loading: 'Warming Up Tires',
        success: 'Pole Position Achieved',
        error: 'Technical Difficulty',
        warning: 'Yellow Flag',

        // Progress
        beginner: 'Rookie Driver',
        intermediate: 'Experienced Racer',
        advanced: 'Championship Contender',
        expert: 'Formula 1 Champion'
    }

    return terminology[element] || element
}