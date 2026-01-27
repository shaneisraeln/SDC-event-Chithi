// F1 Championship Achievement System
// Transforms generic achievements into F1 racing rewards

export const F1_CIRCUITS = {
    1: {
        name: 'Monaco Grand Prix',
        country: 'Monaco',
        difficulty: 'Precision'
    },
    2: {
        name: 'Silverstone Circuit',
        country: 'United Kingdom',
        difficulty: 'Technical'
    },
    3: {
        name: 'Monza Speedway',
        country: 'Italy',
        difficulty: 'Strategy'
    },
    4: {
        name: 'Spa-Francorchamps',
        country: 'Belgium',
        difficulty: 'Championship'
    },
    5: {
        name: 'Suzuka Circuit',
        country: 'Japan',
        difficulty: 'Legend'
    }
}

export const F1_TROPHIES = {
    WORLD_CHAMPION: {
        id: 'world_champion',
        name: 'Formula 1 World Champion',
        description: 'Conquered all championship circuits and claimed the title',
        icon: '👑',
        rarity: 'legendary',
        points: 200
    }
}

// Transform generic progress to F1 championship data
export const transformToF1Progress = (genericProgress) => {
    const completedLevels = genericProgress.completedLevels || []

    return {
        championshipPoints: completedLevels.length * 25,
        currentPosition: completedLevels.length >= 5 ? 1 : 5,
        circuitsCompleted: completedLevels,
        totalCircuits: 5,
        raceWins: completedLevels.length,
        podiumFinishes: completedLevels.length,
        polePositions: 0,
        fastestLaps: completedLevels.length,
        lapTimes: {},
        sectorSplits: {},
        qualifyingPositions: {},
        seasonProgress: (completedLevels.length / 5) * 100,
        winPercentage: completedLevels.length > 0 ? ((completedLevels.length / 5) * 100).toFixed(1) : '0',
        pointsPerRace: completedLevels.length > 0 ? (25).toFixed(1) : '0',
        unlockedTrophies: completedLevels.length >= 5 ? [F1_TROPHIES.WORLD_CHAMPION] : [],
        totalAchievements: Object.keys(F1_TROPHIES).length,
        achievementProgress: completedLevels.length >= 5 ? '100.0' : '0.0'
    }
}

export const getChampionshipMessage = (progress) => {
    const completedLevels = progress.completedLevels || []
    const points = completedLevels.length * 25

    if (completedLevels.length >= 5) {
        return `🏆 WORLD CHAMPION! You've conquered all circuits with ${points} championship points!`
    } else if (completedLevels.length >= 3) {
        return `🥉 Podium Contender! ${points} points - Fighting for the championship!`
    } else if (completedLevels.length >= 1) {
        return `🏁 Points Scorer! ${points} points - Building momentum for the title fight!`
    } else {
        return `🏎️ Rookie Driver! ${points} points - Your championship journey begins!`
    }
}

export const getNextAchievementTarget = (progress) => {
    const completedLevels = progress.completedLevels || []

    if (completedLevels.length === 0) {
        return {
            target: F1_TROPHIES.WORLD_CHAMPION,
            requirement: 'Complete Monaco Grand Prix to earn your first trophy'
        }
    } else {
        return {
            target: F1_TROPHIES.WORLD_CHAMPION,
            requirement: 'Master all circuits to claim the World Championship'
        }
    }
}