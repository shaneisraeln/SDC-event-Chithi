// F1 Theme Configuration System
// Centralized configuration for F1 racing theme including colors, typography, and team data

export const F1_COLORS = {
    // Primary F1 Brand Colors
    RACING_RED: '#DC143C',
    CARBON_BLACK: '#1C1C1C',
    CHAMPIONSHIP_GOLD: '#FFD700',

    // Team Colors
    FERRARI_RED: '#DC143C',
    MCLAREN_ORANGE: '#FF8700',
    MERCEDES_SILVER: '#C0C0C0',
    REDBULL_BLUE: '#1E41FF',
    ASTON_GREEN: '#006F62',
    ALPINE_PINK: '#FF87BC',
    WILLIAMS_BLUE: '#005AFF',
    HAAS_WHITE: '#FFFFFF',
    ALPHATAURI_NAVY: '#2B4562',
    ALFA_RED: '#900000',

    // Track and Environment Colors
    PIT_LANE_YELLOW: '#FFE135',
    CHECKERED_FLAG: '#000000',
    TRACK_ASPHALT: '#2D2D2D',
    TIRE_SMOKE: '#808080'
}

export const F1_TEAMS = {
    FERRARI: {
        name: 'Scuderia Ferrari',
        primaryColor: F1_COLORS.FERRARI_RED,
        secondaryColor: F1_COLORS.CHAMPIONSHIP_GOLD,
        country: 'Italy',
        founded: 1950
    },
    MCLAREN: {
        name: 'McLaren F1 Team',
        primaryColor: F1_COLORS.MCLAREN_ORANGE,
        secondaryColor: F1_COLORS.CARBON_BLACK,
        country: 'United Kingdom',
        founded: 1966
    },
    MERCEDES: {
        name: 'Mercedes-AMG Petronas F1 Team',
        primaryColor: F1_COLORS.MERCEDES_SILVER,
        secondaryColor: F1_COLORS.CARBON_BLACK,
        country: 'Germany',
        founded: 2010
    },
    REDBULL: {
        name: 'Oracle Red Bull Racing',
        primaryColor: F1_COLORS.REDBULL_BLUE,
        secondaryColor: F1_COLORS.CHAMPIONSHIP_GOLD,
        country: 'Austria',
        founded: 2005
    }
}

export const F1_CIRCUITS = {
    MONACO: {
        name: 'Circuit de Monaco',
        country: 'Monaco',
        length: '3.337 km',
        turns: 19,
        difficulty: 'Expert'
    },
    SILVERSTONE: {
        name: 'Silverstone Circuit',
        country: 'United Kingdom',
        length: '5.891 km',
        turns: 18,
        difficulty: 'Advanced'
    },
    MONZA: {
        name: 'Autodromo Nazionale di Monza',
        country: 'Italy',
        length: '5.793 km',
        turns: 11,
        difficulty: 'Intermediate'
    },
    SPA: {
        name: 'Circuit de Spa-Francorchamps',
        country: 'Belgium',
        length: '7.004 km',
        turns: 20,
        difficulty: 'Expert'
    }
}

export const F1_TYPOGRAPHY = {
    DISPLAY: {
        fontFamily: 'Orbitron, monospace',
        fontWeight: '700',
        letterSpacing: '0.05em'
    },
    BODY: {
        fontFamily: 'Rajdhani, sans-serif',
        fontWeight: '400',
        letterSpacing: '0.025em'
    },
    RACING: {
        fontFamily: 'Racing Sans One, cursive',
        fontWeight: '400',
        letterSpacing: '0.1em'
    }
}

export const F1_ANIMATIONS = {
    SPEED: {
        duration: '0.8s',
        easing: 'ease-out',
        transform: 'translateX(-100%) skewX(-15deg)'
    },
    DRIFT: {
        duration: '1.2s',
        easing: 'ease-in-out',
        transform: 'translateX(10px) rotate(2deg)'
    },
    PIT_STOP: {
        duration: '0.5s',
        easing: 'ease-in-out',
        transform: 'scale(1.1) rotate(5deg)'
    },
    VICTORY: {
        duration: '3s',
        easing: 'ease-in-out',
        transform: 'translateY(-20px) scale(1.1)'
    }
}

export const F1_SOUND_EFFECTS = {
    ENGINE_REV: '/src/assets/f1/sounds/engine-rev.mp3',
    TIRE_SCREECH: '/src/assets/f1/sounds/tire-screech.mp3',
    PIT_RADIO: '/src/assets/f1/sounds/pit-radio.mp3',
    VICTORY_CELEBRATION: '/src/assets/f1/sounds/victory-celebration.mp3',
    BUTTON_HOVER: '/src/assets/f1/sounds/button-hover.mp3',
    CHECKERED_FLAG: '/src/assets/f1/sounds/checkered-flag.mp3'
}

// Default F1 theme configuration
export const DEFAULT_F1_THEME = {
    team: F1_TEAMS.FERRARI,
    circuit: F1_CIRCUITS.MONACO,
    colors: {
        primary: F1_COLORS.RACING_RED,
        secondary: F1_COLORS.CHAMPIONSHIP_GOLD,
        background: F1_COLORS.CARBON_BLACK,
        accent: F1_COLORS.PIT_LANE_YELLOW
    },
    typography: F1_TYPOGRAPHY.DISPLAY,
    animations: {
        enabled: true,
        reducedMotion: false,
        speed: 'normal'
    },
    sounds: {
        enabled: true,
        volume: 0.7
    }
}