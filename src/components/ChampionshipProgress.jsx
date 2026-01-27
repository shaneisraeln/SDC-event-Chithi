import { motion } from 'framer-motion'
import { useProgress } from '../context/ProgressContext'
import { useMotion } from '../context/MotionContext'
import { 
  transformToF1Progress, 
  F1_CIRCUITS, 
  F1_TROPHIES,
  getChampionshipMessage,
  getNextAchievementTarget
} from '../utils/f1AchievementSystem'
import { F1_ANIMATION_PRESETS } from '../utils/f1Animations'

const ChampionshipProgress = ({ variant = 'full', className = '' }) => {
  const { progress } = useProgress()
  const { reducedMotion } = useMotion()
  const f1Progress = transformToF1Progress(progress)

  if (variant === 'compact') {
    return <CompactChampionshipProgress f1Progress={f1Progress} className={className} />
  }

  return (
    <div className={`championship-progress ${className}`}>
      {/* Championship Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text text-transparent mb-2">
            CHAMPIONSHIP STANDINGS
          </h2>
          <p className="text-red-300 text-lg">
            {getChampionshipMessage(progress)}
          </p>
        </div>

        {/* Championship Points Display */}
        <div className="glass-effect neon-border rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ChampionshipStat
              label="Championship Points"
              value={f1Progress.championshipPoints}
              icon="🏆"
              color="yellow"
            />
            <ChampionshipStat
              label="Current Position"
              value={`P${f1Progress.currentPosition}`}
              icon="🏁"
              color="red"
            />
            <ChampionshipStat
              label="Race Wins"
              value={f1Progress.raceWins}
              icon="🥇"
              color="gold"
            />
            <ChampionshipStat
              label="Win Rate"
              value={`${f1Progress.winPercentage}%`}
              icon="📊"
              color="green"
            />
          </div>
        </div>
      </motion.div>

      {/* Circuit Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-2xl font-bold text-red-400 mb-4 text-glow">
          Circuit Championship Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(F1_CIRCUITS).map(([circuitId, circuit]) => {
            const isCompleted = f1Progress.circuitsCompleted.includes(parseInt(circuitId))
            const qualifyingPosition = f1Progress.qualifyingPositions[circuitId] || 'N/A'
            const lapTime = f1Progress.lapTimes[circuitId]
            
            return (
              <motion.div
                key={circuitId}
                className={`glass-effect rounded-xl p-4 border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'border-green-500/60 bg-green-500/10' 
                    : 'border-red-500/30 bg-red-900/20'
                }`}
                whileHover={!reducedMotion ? { scale: 1.02 } : {}}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{circuit.name}</h4>
                    <p className="text-xs text-gray-400">{circuit.country}</p>
                  </div>
                  <div className={`text-2xl ${isCompleted ? 'animate-pulse' : 'opacity-50'}`}>
                    {isCompleted ? '🏆' : '🏎️'}
                  </div>
                </div>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={isCompleted ? 'text-green-400' : 'text-red-400'}>
                      {isCompleted ? 'VICTORY' : 'LOCKED'}
                    </span>
                  </div>
                  
                  {isCompleted && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Grid Position:</span>
                        <span className="text-yellow-400">P{qualifyingPosition}</span>
                      </div>
                      
                      {lapTime && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Best Lap:</span>
                          <span className="text-blue-400">{lapTime.bestLap.toFixed(3)}s</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Difficulty:</span>
                    <span className="text-purple-400">{circuit.difficulty}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Racing Statistics Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <h3 className="text-2xl font-bold text-red-400 mb-4 text-glow">
          Racing Statistics Dashboard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <div className="glass-effect neon-border rounded-xl p-6">
            <h4 className="text-lg font-bold text-yellow-400 mb-4">Performance Metrics</h4>
            <div className="space-y-3">
              <StatRow label="Podium Finishes" value={f1Progress.podiumFinishes} icon="🥇" />
              <StatRow label="Pole Positions" value={f1Progress.polePositions} icon="🏁" />
              <StatRow label="Fastest Laps" value={f1Progress.fastestLaps} icon="⚡" />
              <StatRow label="Points per Race" value={f1Progress.pointsPerRace} icon="📈" />
            </div>
          </div>

          {/* Season Progress */}
          <div className="glass-effect neon-border rounded-xl p-6">
            <h4 className="text-lg font-bold text-yellow-400 mb-4">Season Progress</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Championship Progress</span>
                  <span className="text-red-400">{f1Progress.seasonProgress.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${f1Progress.seasonProgress}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Achievement Progress</span>
                  <span className="text-purple-400">{f1Progress.achievementProgress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${f1Progress.achievementProgress}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
              </div>
              
              <div className="text-center pt-2">
                <span className="text-sm text-gray-400">
                  {f1Progress.circuitsCompleted.length}/{f1Progress.totalCircuits} Circuits Conquered
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trophy Cabinet */}
      <TrophyCabinet f1Progress={f1Progress} />

      {/* Next Achievement Target */}
      <NextAchievementTarget progress={progress} />
    </div>
  )
}

// Compact version for dashboard display
const CompactChampionshipProgress = ({ f1Progress, className }) => {
  return (
    <div className={`compact-championship-progress ${className}`}>
      <div className="glass-effect neon-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-red-400">Championship Standing</h3>
          <div className="text-2xl">🏆</div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-400">{f1Progress.championshipPoints}</div>
            <div className="text-xs text-gray-400">Points</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">P{f1Progress.currentPosition}</div>
            <div className="text-xs text-gray-400">Position</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">{f1Progress.raceWins}</div>
            <div className="text-xs text-gray-400">Wins</div>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">Season Progress</span>
            <span className="text-xs text-red-400">{f1Progress.seasonProgress.toFixed(0)}%</span>
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-red-500 to-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${f1Progress.seasonProgress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Championship statistic component
const ChampionshipStat = ({ label, value, icon, color }) => {
  const colorClasses = {
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    gold: 'text-yellow-500',
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400'
  }

  return (
    <div className="text-center">
      <div className="text-3xl mb-1">{icon}</div>
      <div className={`text-2xl font-bold ${colorClasses[color] || 'text-white'} mb-1`}>
        {value}
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

// Statistics row component
const StatRow = ({ label, value, icon }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-gray-300">{label}</span>
    </div>
    <span className="text-white font-bold">{value}</span>
  </div>
)

// Trophy cabinet component
const TrophyCabinet = ({ f1Progress }) => {
  const { reducedMotion } = useMotion()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-8"
    >
      <h3 className="text-2xl font-bold text-red-400 mb-4 text-glow">
        Trophy Cabinet
      </h3>
      <div className="glass-effect neon-border rounded-xl p-6">
        {f1Progress.unlockedTrophies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {f1Progress.unlockedTrophies.map((trophy, index) => (
              <motion.div
                key={trophy.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`p-4 rounded-lg border-2 ${
                  trophy.rarity === 'legendary' ? 'border-yellow-500/60 bg-yellow-500/10' :
                  trophy.rarity === 'gold' ? 'border-yellow-600/60 bg-yellow-600/10' :
                  trophy.rarity === 'silver' ? 'border-gray-400/60 bg-gray-400/10' :
                  'border-orange-600/60 bg-orange-600/10'
                }`}
                whileHover={!reducedMotion ? { scale: 1.05 } : {}}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">{trophy.icon}</div>
                  <h4 className="font-bold text-white text-sm mb-1">{trophy.name}</h4>
                  <p className="text-xs text-gray-400 mb-2">{trophy.description}</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-yellow-400">+{trophy.points} pts</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      trophy.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-400' :
                      trophy.rarity === 'gold' ? 'bg-yellow-600/20 text-yellow-500' :
                      trophy.rarity === 'silver' ? 'bg-gray-400/20 text-gray-300' :
                      'bg-orange-600/20 text-orange-400'
                    }`}>
                      {trophy.rarity}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4 opacity-50">🏆</div>
            <p className="text-gray-400">No trophies yet. Complete circuits to start your collection!</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Next achievement target component
const NextAchievementTarget = ({ progress }) => {
  const nextTarget = getNextAchievementTarget(progress)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="glass-effect neon-border rounded-xl p-6"
    >
      <h3 className="text-xl font-bold text-purple-400 mb-4 text-center">
        Next Championship Target
      </h3>
      <div className="text-center">
        <div className="text-5xl mb-3">{nextTarget.target.icon}</div>
        <h4 className="text-lg font-bold text-white mb-2">{nextTarget.target.name}</h4>
        <p className="text-gray-400 mb-4">{nextTarget.target.description}</p>
        <div className="bg-purple-500/20 border border-purple-500/50 rounded-lg p-3">
          <p className="text-purple-300 text-sm">{nextTarget.requirement}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default ChampionshipProgress