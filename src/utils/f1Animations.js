// F1 Animation Utilities
// Centralized animation configurations and utilities for F1 racing theme

import {
    F1_COLORS
} from '../config/f1Theme'

// Racing-themed animation presets
export const F1_ANIMATION_PRESETS = {
    // High-speed motion effects
    SPEED_BURST: {
        initial: {
            x: -100,
            opacity: 0,
            scale: 0.8
        },
        animate: {
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: {
            x: 100,
            opacity: 0,
            scale: 1.2
        },
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            duration: 0.6
        }
    },

    // Drift-style entrance
    DRIFT_IN: {
        initial: {
            x: -50,
            y: 20,
            rotate: -5,
            opacity: 0
        },
        animate: {
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1
        },
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 25,
            duration: 0.8
        }
    },

    // Pit stop quick action
    PIT_STOP: {
        initial: {
            scale: 0.9,
            opacity: 0
        },
        animate: {
            scale: 1,
            opacity: 1
        },
        whileHover: {
            scale: 1.05,
            y: -2
        },
        whileTap: {
            scale: 0.95
        },
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    },

    // Victory celebration
    VICTORY_BOUNCE: {
        initial: {
            y: -20,
            scale: 0
        },
        animate: {
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 15,
                bounce: 0.6
            }
        },
        whileInView: {
            y: [-5, 5, -5],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    },

    // Racing flag wave
    FLAG_WAVE: {
        animate: {
            rotateY: [0, 15, -10, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    },

    // Tire spin effect
    TIRE_SPIN: {
        animate: {
            rotate: 360,
            transition: {
                duration: 1,
                repeat: Infinity,
                ease: "linear"
            }
        }
    },

    // Championship glow
    CHAMPIONSHIP_GLOW: {
        animate: {
            boxShadow: [
                `0 0 20px ${F1_COLORS.CHAMPIONSHIP_GOLD}40`,
                `0 0 40px ${F1_COLORS.CHAMPIONSHIP_GOLD}60`,
                `0 0 20px ${F1_COLORS.CHAMPIONSHIP_GOLD}40`
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    },

    // Racing pulse
    RACING_PULSE: {
        animate: {
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    }
}

// Page transition variants
export const F1_PAGE_TRANSITIONS = {
    SPEED_SLIDE: {
        initial: {
            x: 100,
            opacity: 0,
            filter: 'blur(10px)'
        },
        animate: {
            x: 0,
            opacity: 1,
            filter: 'blur(0px)'
        },
        exit: {
            x: -100,
            opacity: 0,
            filter: 'blur(10px)'
        },
        transition: {
            type: "tween",
            ease: "anticipate",
            duration: 0.8
        }
    },

    CHECKERED_WIPE: {
        initial: {
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0% 100%)'
        },
        animate: {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
        },
        exit: {
            clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)'
        },
        transition: {
            duration: 0.8,
            ease: "easeInOut"
        }
    },

    TIRE_SMOKE: {
        initial: {
            opacity: 0,
            y: 50,
            filter: 'blur(5px)'
        },
        animate: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)'
        },
        exit: {
            opacity: 0,
            y: -50,
            filter: 'blur(5px)'
        },
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
}

// Loading animation configurations
export const F1_LOADING_ANIMATIONS = {
    SPINNING_WHEEL: {
        animate: {
            rotate: 360
        },
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
        }
    },

    RACING_CAR: {
        animate: {
            x: ['-100%', '200%']
        },
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    },

    PIT_CREW: {
        animate: {
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
        },
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    },

    CHECKERED_FLAG: {
        animate: {
            rotateY: [0, 180, 360]
        },
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
}

// Interactive hover effects
export const F1_HOVER_EFFECTS = {
    SPEED_BOOST: {
        whileHover: {
            scale: 1.05,
            y: -5,
            boxShadow: `0 10px 30px ${F1_COLORS.RACING_RED}40`,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25
            }
        }
    },

    TIRE_SCREECH: {
        whileHover: {
            x: [0, -2, 2, 0],
            transition: {
                duration: 0.3,
                repeat: 2
            }
        }
    },

    ENGINE_REV: {
        whileHover: {
            scale: [1, 1.02, 1],
            transition: {
                duration: 0.2,
                repeat: 3
            }
        }
    },

    CHAMPIONSHIP_SHINE: {
        whileHover: {
            background: [
                `linear-gradient(135deg, ${F1_COLORS.CHAMPIONSHIP_GOLD}, ${F1_COLORS.RACING_RED})`,
                `linear-gradient(135deg, ${F1_COLORS.RACING_RED}, ${F1_COLORS.CHAMPIONSHIP_GOLD})`,
                `linear-gradient(135deg, ${F1_COLORS.CHAMPIONSHIP_GOLD}, ${F1_COLORS.RACING_RED})`
            ],
            transition: {
                duration: 0.8,
                repeat: Infinity
            }
        }
    }
}

// Victory celebration animations
export const F1_VICTORY_ANIMATIONS = {
    CONFETTI_BURST: (count = 50) =>
        Array.from({
            length: count
        }, (_, i) => ({
            initial: {
                y: -10,
                rotate: 0,
                opacity: 1
            },
            animate: {
                y: window.innerHeight + 100,
                rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                opacity: [1, 1, 0],
                x: (Math.random() - 0.5) * 200
            },
            transition: {
                duration: 3 + Math.random() * 2,
                ease: "easeOut",
                delay: Math.random() * 2
            }
        })),

    PODIUM_RISE: {
        initial: {
            y: 100,
            opacity: 0
        },
        animate: {
            y: 0,
            opacity: 1
        },
        transition: {
            duration: 1,
            type: "spring",
            stiffness: 200
        }
    },

    TROPHY_FLOAT: {
        animate: {
            y: [-5, 5, -5],
            rotate: [-2, 2, -2]
        },
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    },

    CHECKERED_FLAG_WAVE: {
        animate: {
            transform: [
                'perspective(100px) rotateY(0deg)',
                'perspective(100px) rotateY(15deg)',
                'perspective(100px) rotateY(-10deg)',
                'perspective(100px) rotateY(0deg)'
            ]
        },
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
}

// Utility functions for F1 animations
export const F1AnimationUtils = {
    // Create racing-themed stagger animation
    createRacingStagger: (children, delay = 0.1) => ({
        animate: {
            transition: {
                staggerChildren: delay,
                delayChildren: 0.2
            }
        }
    }),

    // Generate speed line animation
    generateSpeedLines: (count = 10, direction = 'horizontal') => {
        const lines = []
        for (let i = 0; i < count; i++) {
            lines.push({
                initial: direction === 'horizontal' ? {
                    x: 0,
                    opacity: 0
                } : {
                    y: 0,
                    opacity: 0
                },
                animate: direction === 'horizontal' ? {
                    x: -window.innerWidth - 100,
                    opacity: [0, 0.6, 0]
                } : {
                    y: window.innerHeight + 100,
                    opacity: [0, 0.6, 0]
                },
                transition: {
                    duration: 0.8,
                    delay: i * 0.05,
                    repeat: Infinity,
                    ease: "linear"
                }
            })
        }
        return lines
    },

    // Create tire smoke particles
    createTireSmoke: (count = 20) => {
        const particles = []
        for (let i = 0; i < count; i++) {
            particles.push({
                initial: {
                    opacity: 0.6,
                    scale: 0.5,
                    y: 0
                },
                animate: {
                    opacity: 0,
                    scale: 1.5,
                    y: -100
                },
                transition: {
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                }
            })
        }
        return particles
    },

    // Generate racing sparks
    createRacingSparks: (count = 8) => {
        const sparks = []
        for (let i = 0; i < count; i++) {
            sparks.push({
                animate: {
                    x: [0, (Math.random() - 0.5) * 40],
                    y: [0, (Math.random() - 0.5) * 40],
                    opacity: [1, 0],
                    scale: [1, 0]
                },
                transition: {
                    duration: 0.6,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1
                }
            })
        }
        return sparks
    },

    // Apply reduced motion fallbacks
    applyReducedMotion: (animation, reducedMotion) => {
        if (reducedMotion) {
            return {
                ...animation,
                animate: {
                    ...animation.animate,
                    transition: {
                        duration: 0.3
                    }
                },
                // Remove complex animations for accessibility
                whileHover: animation.whileHover ? {
                    scale: 1.02
                } : undefined,
                whileTap: animation.whileTap ? {
                    scale: 0.98
                } : undefined
            }
        }
        return animation
    }
}

// F1 sound triggers removed - audio system disabled

export default {
    F1_ANIMATION_PRESETS,
    F1_PAGE_TRANSITIONS,
    F1_LOADING_ANIMATIONS,
    F1_HOVER_EFFECTS,
    F1_VICTORY_ANIMATIONS,
    F1AnimationUtils
}