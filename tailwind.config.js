/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    purple: '#a855f7',
                    pink: '#ec4899',
                    blue: '#3b82f6',
                },
                f1: {
                    'racing-red': '#DC143C',
                    'carbon-black': '#1C1C1C',
                    'championship-gold': '#FFD700',
                    'ferrari-red': '#DC143C',
                    'mclaren-orange': '#FF8700',
                    'mercedes-silver': '#C0C0C0',
                    'redbull-blue': '#1E41FF',
                    'aston-green': '#006F62',
                    'alpine-pink': '#FF87BC',
                    'williams-blue': '#005AFF',
                    'haas-white': '#FFFFFF',
                    'alphatauri-navy': '#2B4562',
                    'alfa-red': '#900000',
                    'pit-lane-yellow': '#FFE135',
                    'checkered-flag': '#000000',
                    'track-asphalt': '#2D2D2D',
                    'tire-smoke': '#808080'
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'f1-speed': 'f1Speed 0.8s ease-out',
                'f1-drift': 'f1Drift 1.2s ease-in-out',
                'checkered-wave': 'checkeredWave 2s ease-in-out infinite',
                'pit-stop': 'pitStop 0.5s ease-in-out',
                'victory-celebration': 'victoryCelebration 3s ease-in-out',
                'engine-rev': 'engineRev 1s ease-in-out',
            },
            keyframes: {
                glow: {
                    '0%': {
                        boxShadow: '0 0 5px #a855f7, 0 0 10px #a855f7'
                    },
                    '100%': {
                        boxShadow: '0 0 10px #a855f7, 0 0 20px #a855f7, 0 0 30px #a855f7'
                    },
                },
                f1Speed: {
                    '0%': {
                        transform: 'translateX(-100%) skewX(-15deg)',
                        opacity: '0'
                    },
                    '50%': {
                        transform: 'translateX(0%) skewX(-5deg)',
                        opacity: '1'
                    },
                    '100%': {
                        transform: 'translateX(0%) skewX(0deg)',
                        opacity: '1'
                    }
                },
                f1Drift: {
                    '0%': {
                        transform: 'translateX(0) rotate(0deg)'
                    },
                    '25%': {
                        transform: 'translateX(10px) rotate(2deg)'
                    },
                    '75%': {
                        transform: 'translateX(-10px) rotate(-2deg)'
                    },
                    '100%': {
                        transform: 'translateX(0) rotate(0deg)'
                    }
                },
                checkeredWave: {
                    '0%': {
                        backgroundPosition: '0% 0%'
                    },
                    '100%': {
                        backgroundPosition: '100% 100%'
                    }
                },
                pitStop: {
                    '0%': {
                        transform: 'scale(1) rotate(0deg)'
                    },
                    '50%': {
                        transform: 'scale(1.1) rotate(5deg)'
                    },
                    '100%': {
                        transform: 'scale(1) rotate(0deg)'
                    }
                },
                victoryCelebration: {
                    '0%': {
                        transform: 'translateY(0) scale(1)'
                    },
                    '25%': {
                        transform: 'translateY(-20px) scale(1.1)'
                    },
                    '50%': {
                        transform: 'translateY(0) scale(1)'
                    },
                    '75%': {
                        transform: 'translateY(-10px) scale(1.05)'
                    },
                    '100%': {
                        transform: 'translateY(0) scale(1)'
                    }
                },
                engineRev: {
                    '0%': {
                        transform: 'scale(1)',
                        filter: 'brightness(1)'
                    },
                    '50%': {
                        transform: 'scale(1.05)',
                        filter: 'brightness(1.2)'
                    },
                    '100%': {
                        transform: 'scale(1)',
                        filter: 'brightness(1)'
                    }
                }
            },
            fontFamily: {
                'f1-display': ['Orbitron', 'monospace'],
                'f1-body': ['Rajdhani', 'sans-serif'],
                'racing': ['Racing Sans One', 'cursive']
            },
            screens: {
                'xs': '475px',
                'sm': '640px',
                'md': '768px',
                'lg': '1024px',
                'xl': '1280px',
                '2xl': '1536px',
                '3xl': '1920px',
                // F1 specific breakpoints
                'mobile-s': '320px',
                'mobile-m': '375px',
                'mobile-l': '425px',
                'tablet': '768px',
                'laptop': '1024px',
                'laptop-l': '1440px',
                'desktop': '2560px',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
                '144': '36rem',
            },
            fontSize: {
                'xs': ['0.75rem', {
                    lineHeight: '1rem'
                }],
                'sm': ['0.875rem', {
                    lineHeight: '1.25rem'
                }],
                'base': ['1rem', {
                    lineHeight: '1.5rem'
                }],
                'lg': ['1.125rem', {
                    lineHeight: '1.75rem'
                }],
                'xl': ['1.25rem', {
                    lineHeight: '1.75rem'
                }],
                '2xl': ['1.5rem', {
                    lineHeight: '2rem'
                }],
                '3xl': ['1.875rem', {
                    lineHeight: '2.25rem'
                }],
                '4xl': ['2.25rem', {
                    lineHeight: '2.5rem'
                }],
                '5xl': ['3rem', {
                    lineHeight: '1'
                }],
                '6xl': ['3.75rem', {
                    lineHeight: '1'
                }],
                '7xl': ['4.5rem', {
                    lineHeight: '1'
                }],
                '8xl': ['6rem', {
                    lineHeight: '1'
                }],
                '9xl': ['8rem', {
                    lineHeight: '1'
                }],
                // F1 specific font sizes
                'f1-xs': ['0.625rem', {
                    lineHeight: '0.875rem',
                    letterSpacing: '0.05em'
                }],
                'f1-sm': ['0.75rem', {
                    lineHeight: '1rem',
                    letterSpacing: '0.05em'
                }],
                'f1-base': ['1rem', {
                    lineHeight: '1.5rem',
                    letterSpacing: '0.025em'
                }],
                'f1-lg': ['1.25rem', {
                    lineHeight: '1.75rem',
                    letterSpacing: '0.025em'
                }],
                'f1-xl': ['1.5rem', {
                    lineHeight: '2rem',
                    letterSpacing: '0.05em'
                }],
                'f1-2xl': ['2rem', {
                    lineHeight: '2.25rem',
                    letterSpacing: '0.05em'
                }],
                'f1-3xl': ['2.5rem', {
                    lineHeight: '2.75rem',
                    letterSpacing: '0.1em'
                }],
            }
        },
    },
    plugins: [],
}