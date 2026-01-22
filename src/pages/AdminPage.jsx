import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useProgress } from '../context/ProgressContext'
import { 
  subscribeToSubmissions, 
  subscribeToUsers, 
  getAnalytics 
} from '../services/databaseService'
import { getAdminStats } from '../utils/adminLogger'

const AdminPage = () => {
  const [adminPassword, setAdminPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [submissions, setSubmissions] = useState([])
  const [users, setUsers] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false)
  const [unsubscribeFunctions, setUnsubscribeFunctions] = useState([])

  // Simple admin authentication
  const handleLogin = () => {
    if (adminPassword === 'chitti-admin-2024') {
      setIsAuthenticated(true)
      loadAdminData()
    } else {
      alert('Invalid admin password!')
    }
  }

  const loadAdminData = async () => {
    try {
      // Try Firebase first
      console.log('🔥 Attempting to load Firebase data...')
      
      // Set up real-time subscriptions
      const unsubscribeSubmissions = subscribeToSubmissions((firebaseSubmissions) => {
        console.log('📝 Firebase submissions updated:', firebaseSubmissions.length)
        setSubmissions(firebaseSubmissions)
        setIsFirebaseConnected(true)
        updateAnalytics(firebaseSubmissions, users)
      })

      const unsubscribeUsers = subscribeToUsers((firebaseUsers) => {
        console.log('👥 Firebase users updated:', firebaseUsers.length)
        setUsers(firebaseUsers)
        setIsFirebaseConnected(true)
        updateAnalytics(submissions, firebaseUsers)
      })

      // Store unsubscribe functions
      setUnsubscribeFunctions([unsubscribeSubmissions, unsubscribeUsers])

      // Get initial analytics
      const analyticsData = await getAnalytics()
      setAnalytics(analyticsData)
      
      console.log('✅ Firebase connection established')

    } catch (error) {
      console.warn('❌ Firebase failed, falling back to localStorage:', error)
      setIsFirebaseConnected(false)
      
      // Fallback to localStorage
      const localData = getAdminStats()
      setSubmissions(localData.submissions)
      setUsers(localData.users)
      setAnalytics(localData)
    }
  }

  const updateAnalytics = (currentSubmissions, currentUsers) => {
    const totalSubmissions = currentSubmissions.length
    const passedSubmissions = currentSubmissions.filter(s => s.passed).length
    const failedSubmissions = totalSubmissions - passedSubmissions
    const passRate = totalSubmissions > 0 ? ((passedSubmissions / totalSubmissions) * 100).toFixed(1) : 0
    
    // Active users = users active in last 30 minutes
    const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000)
    const activeUsers = currentUsers.filter(u => {
      const lastActive = u.lastActive?.toMillis ? u.lastActive.toMillis() : u.lastActive
      return lastActive > thirtyMinutesAgo
    }).length
    
    setAnalytics({
      totalSubmissions,
      passedSubmissions,
      failedSubmissions,
      passRate,
      totalUsers: currentUsers.length,
      activeUsers,
      recentActivity: currentSubmissions.slice(0, 5),
      topProblems: getTopProblems(currentSubmissions),
      languageDistribution: getLanguageDistribution(currentSubmissions)
    })
  }

  const getTopProblems = (submissions) => {
    const problemCounts = {}
    submissions.forEach(sub => {
      problemCounts[sub.problemId] = (problemCounts[sub.problemId] || 0) + 1
    })
    return Object.entries(problemCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([problem, count]) => ({ problem, count }))
  }

  const getLanguageDistribution = (submissions) => {
    const langCounts = {}
    submissions.forEach(sub => {
      langCounts[sub.language] = (langCounts[sub.language] || 0) + 1
    })
    return Object.entries(langCounts).map(([language, count]) => ({ language, count }))
  }

  // Real-time updates with Firebase subscriptions
  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData()
      
      // Cleanup subscriptions on unmount
      return () => {
        unsubscribeFunctions.forEach(unsubscribe => {
          if (typeof unsubscribe === 'function') {
            unsubscribe()
          }
        })
      }
    }
  }, [isAuthenticated])

  // Fallback polling for localStorage (only if Firebase fails)
  useEffect(() => {
    if (isAuthenticated && !isFirebaseConnected) {
      const interval = setInterval(() => {
        console.log('📊 Polling localStorage (Firebase unavailable)')
        const localData = getAdminStats()
        setSubmissions(localData.submissions)
        setUsers(localData.users)
        setAnalytics(localData)
      }, 10000) // Poll every 10 seconds as fallback
      
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, isFirebaseConnected])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 max-w-md w-full mx-4"
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">🔐 Admin Access</h1>
            <p className="text-gray-300">Enter admin password to continue</p>
          </div>
          
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Login to Admin Panel
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-4 text-center">
            Password: chitti-admin-2024
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">🛠️ Chitti Challenge Admin</h1>
              <div className="flex items-center space-x-2">
                <p className="text-gray-400 text-sm">
                  {isFirebaseConnected ? '🔥 Firebase Real-time' : '💾 localStorage Fallback'}
                </p>
                <span className="text-gray-500">•</span>
                <p className="text-gray-400 text-sm">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  if (confirm('Clear all tracking data? This cannot be undone.')) {
                    // Clear both Firebase and localStorage
                    localStorage.removeItem('admin_submissions')
                    localStorage.removeItem('admin_users') 
                    localStorage.removeItem('admin_page_views')
                    
                    if (isFirebaseConnected) {
                      alert('Note: This only clears localStorage. Firebase data requires manual deletion.')
                    }
                    
                    loadAdminData()
                  }
                }}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Clear Local Data
              </button>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex space-x-1 bg-gray-800/30 rounded-lg p-1 mb-6">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'submissions', label: '📝 Submissions', icon: '📝' },
            { id: 'users', label: '👥 Users', icon: '👥' },
            { id: 'analytics', label: '📈 Analytics', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && <OverviewTab analytics={analytics} />}
          {activeTab === 'submissions' && <SubmissionsTab submissions={submissions} />}
          {activeTab === 'users' && <UsersTab users={users} />}
          {activeTab === 'analytics' && <AnalyticsTab submissions={submissions} />}
        </motion.div>
      </div>
    </div>
  )
}

// Overview Tab Component
const OverviewTab = ({ analytics }) => (
  <div className="space-y-6">
    {/* Key Metrics */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Submissions"
        value={analytics.totalSubmissions || 0}
        icon="📝"
        color="blue"
        subtitle={`${analytics.passedSubmissions || 0} passed`}
      />
      <StatCard
        title="Success Rate"
        value={`${analytics.passRate || 0}%`}
        icon="✅"
        color="green"
        subtitle={`${analytics.failedSubmissions || 0} failed`}
      />
      <StatCard
        title="Total Users"
        value={analytics.totalUsers || 0}
        icon="👥"
        color="purple"
        subtitle="All time"
      />
      <StatCard
        title="Active Now"
        value={analytics.activeUsers || 0}
        icon="🟢"
        color="orange"
        subtitle="Last 30 minutes"
      />
    </div>

    {/* Recent Activity */}
    {analytics.recentActivity && analytics.recentActivity.length > 0 && (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">🔥 Recent Activity</h2>
        <div className="space-y-3">
          {analytics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${activity.passed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <span className="text-white font-medium">{activity.problemId}</span>
                  <span className="text-gray-400 text-sm ml-2">in {activity.language}</span>
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                {new Date(activity.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Problems */}
      {analytics.topProblems && analytics.topProblems.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">🎯 Most Attempted Problems</h3>
          <div className="space-y-2">
            {analytics.topProblems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300">{item.problem}</span>
                <span className="text-blue-400 font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Language Distribution */}
      {analytics.languageDistribution && analytics.languageDistribution.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
          <h3 className="text-lg font-bold text-white mb-4">💻 Language Usage</h3>
          <div className="space-y-2">
            {analytics.languageDistribution.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300 capitalize">{item.language}</span>
                <span className="text-purple-400 font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* No Data State */}
    {analytics.totalSubmissions === 0 && (
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-12 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-white mb-2">No Data Yet</h3>
        <p className="text-gray-400">
          Data will appear here as users start submitting code solutions.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Try submitting some code in the challenges to see live tracking!
        </p>
      </div>
    )}
  </div>
)

// Submissions Tab Component
const SubmissionsTab = ({ submissions }) => (
  <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden">
    <div className="p-6 border-b border-gray-700">
      <h2 className="text-xl font-bold text-white">📝 Live Submissions</h2>
      <p className="text-gray-400">Real-time code submissions and results ({submissions.length} total)</p>
    </div>
    
    {submissions.length === 0 ? (
      <div className="p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-white mb-2">No Submissions Yet</h3>
        <p className="text-gray-400">
          Code submissions will appear here in real-time as users solve problems.
        </p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Problem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Language</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Result</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {submissions.slice(0, 20).map((submission, index) => (
              <tr key={submission.id || index} className="hover:bg-gray-700/30">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(submission.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {submission.userId ? submission.userId.replace('user_', '').substring(0, 8) : 'Anonymous'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span className="bg-gray-700 px-2 py-1 rounded text-xs">
                    {submission.problemId}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs capitalize">
                    {submission.language}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    submission.passed 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-red-900 text-red-200'
                  }`}>
                    {submission.passed ? '✅ Passed' : '❌ Failed'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300">
                  <details className="cursor-pointer">
                    <summary className="text-blue-400 hover:text-blue-300">View Code</summary>
                    <pre className="mt-2 bg-gray-900 p-2 rounded text-xs overflow-x-auto max-w-md">
                      {submission.code ? submission.code.substring(0, 200) + (submission.code.length > 200 ? '...' : '') : 'No code available'}
                    </pre>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)

// Users Tab Component
const UsersTab = ({ users }) => (
  <div className="space-y-6">
    {/* User Stats */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 text-center">
        <div className="text-3xl font-bold text-blue-400">{users.length}</div>
        <div className="text-gray-400">Total Users</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 text-center">
        <div className="text-3xl font-bold text-green-400">
          {users.filter(u => u.lastActive > Date.now() - 30 * 60 * 1000).length}
        </div>
        <div className="text-gray-400">Active (30min)</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6 text-center">
        <div className="text-3xl font-bold text-purple-400">
          {users.reduce((sum, u) => sum + (u.totalSubmissions || 0), 0)}
        </div>
        <div className="text-gray-400">Total Submissions</div>
      </div>
    </div>

    {/* User List */}
    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">👥 User Activity</h2>
        <p className="text-gray-400">Real participant progress and activity</p>
      </div>
      
      {users.length === 0 ? (
        <div className="p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-white mb-2">No Users Yet</h3>
          <p className="text-gray-400">
            Users will appear here as they start participating in the challenge.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">First Seen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Last Active</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Submissions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Problems Tried</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user, index) => {
                const isActive = user.lastActive > Date.now() - 30 * 60 * 1000
                const isRecent = user.lastActive > Date.now() - 5 * 60 * 1000
                
                return (
                  <tr key={user.id || index} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                      {user.id ? user.id.replace('user_', '').substring(0, 12) : `User ${index + 1}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(user.firstSeen || Date.now()).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(user.lastActive || Date.now()).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <span className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs">
                        {user.totalSubmissions || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex flex-wrap gap-1">
                        {(user.problemsAttempted || []).map((problem, i) => (
                          <span key={i} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                            {problem}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isRecent 
                          ? 'bg-green-900 text-green-200' 
                          : isActive 
                          ? 'bg-yellow-900 text-yellow-200'
                          : 'bg-gray-700 text-gray-300'
                      }`}>
                        {isRecent ? '🟢 Online' : isActive ? '🟡 Active' : '⚫ Offline'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)

// Analytics Tab Component
const AnalyticsTab = ({ submissions }) => {
  const problemStats = submissions.reduce((acc, sub) => {
    if (!acc[sub.problemId]) {
      acc[sub.problemId] = { total: 0, passed: 0 }
    }
    acc[sub.problemId].total++
    if (sub.passed) acc[sub.problemId].passed++
    return acc
  }, {})

  const languageStats = submissions.reduce((acc, sub) => {
    acc[sub.language] = (acc[sub.language] || 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Problem Difficulty */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Problem Statistics</h2>
        <div className="space-y-3">
          {Object.entries(problemStats).map(([problem, stats]) => (
            <div key={problem} className="flex justify-between items-center">
              <span className="text-gray-300">{problem}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">{stats.passed}/{stats.total}</span>
                <div className="w-24 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${(stats.passed / stats.total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400">
                  {((stats.passed / stats.total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Usage */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-4">Language Usage</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(languageStats).map(([language, count]) => (
            <div key={language} className="text-center">
              <div className="text-2xl font-bold text-blue-400">{count}</div>
              <div className="text-sm text-gray-400 capitalize">{language}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
const StatCard = ({ title, value, icon, color, subtitle }) => {
  const colorClasses = {
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    purple: 'from-purple-600 to-purple-700',
    orange: 'from-orange-600 to-orange-700'
  }

  return (
    <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-2xl p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm opacity-90">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-xs opacity-75 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  )
}

export default AdminPage