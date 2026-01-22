// Admin logging utilities for tracking submissions and user activity
import {
    logSubmission as firebaseLogSubmission,
    updateUserActivity as firebaseUpdateUserActivity,
    logPageView as firebaseLogPageView,
    generateUserId as firebaseGenerateUserId,
    initializeUserSession
} from '../services/databaseService'

// Use Firebase for logging, with localStorage fallback
export const logSubmission = async (submissionData) => {
    try {
        // Try Firebase first
        await firebaseLogSubmission(submissionData)
    } catch (error) {
        console.warn('Firebase logging failed, using localStorage fallback:', error)

        // Fallback to localStorage
        try {
            const submissions = JSON.parse(localStorage.getItem('admin_submissions') || '[]')

            const newSubmission = {
                id: Date.now() + Math.random(),
                timestamp: Date.now(),
                userId: generateUserId(),
                problemId: submissionData.problemId,
                language: submissionData.language,
                code: submissionData.code,
                passed: submissionData.allPassed,
                results: submissionData.results,
                error: submissionData.error || null
            }

            submissions.unshift(newSubmission) // Add to beginning

            // Keep only last 100 submissions to prevent localStorage bloat
            if (submissions.length > 100) {
                submissions.splice(100)
            }

            localStorage.setItem('admin_submissions', JSON.stringify(submissions))

            // Also update user activity
            updateUserActivity(newSubmission.userId, submissionData.problemId)

        } catch (localError) {
            console.error('Failed to log submission to localStorage:', localError)
        }
    }
}

export const updateUserActivity = async (userId, problemId) => {
    try {
        // Try Firebase first
        await firebaseUpdateUserActivity(userId, problemId)
    } catch (error) {
        console.warn('Firebase user activity update failed, using localStorage fallback:', error)

        // Fallback to localStorage
        try {
            const users = JSON.parse(localStorage.getItem('admin_users') || '[]')

            let user = users.find(u => u.id === userId)
            if (!user) {
                user = {
                    id: userId,
                    firstSeen: Date.now(),
                    lastActive: Date.now(),
                    problemsAttempted: [],
                    totalSubmissions: 0
                }
                users.push(user)
            }

            user.lastActive = Date.now()
            user.totalSubmissions++

            if (problemId && !user.problemsAttempted.includes(problemId)) {
                user.problemsAttempted.push(problemId)
            }

            localStorage.setItem('admin_users', JSON.stringify(users))

        } catch (localError) {
            console.error('Failed to update user activity in localStorage:', localError)
        }
    }
}

export const generateUserId = () => {
    return firebaseGenerateUserId()
}

export const logPageView = async (pageName) => {
    try {
        // Try Firebase first
        await firebaseLogPageView(pageName)
    } catch (error) {
        console.warn('Firebase page view logging failed, using localStorage fallback:', error)

        // Fallback to localStorage
        try {
            const pageViews = JSON.parse(localStorage.getItem('admin_page_views') || '[]')

            pageViews.unshift({
                page: pageName,
                timestamp: Date.now(),
                userId: generateUserId()
            })

            // Keep only last 50 page views
            if (pageViews.length > 50) {
                pageViews.splice(50)
            }

            localStorage.setItem('admin_page_views', JSON.stringify(pageViews))

        } catch (localError) {
            console.error('Failed to log page view to localStorage:', localError)
        }
    }
}

// Initialize user session on app start
export const initializeSession = async () => {
    try {
        await initializeUserSession()
    } catch (error) {
        console.warn('Failed to initialize Firebase session:', error)
    }
}

// Legacy function for backward compatibility (returns localStorage data if Firebase fails)
export const getAdminStats = () => {
    try {
        const submissions = JSON.parse(localStorage.getItem('admin_submissions') || '[]')
        const users = JSON.parse(localStorage.getItem('admin_users') || '[]')
        const pageViews = JSON.parse(localStorage.getItem('admin_page_views') || '[]')

        return {
            totalSubmissions: submissions.length,
            passedSubmissions: submissions.filter(s => s.passed).length,
            totalUsers: users.length,
            activeUsers: users.filter(u => u.lastActive > Date.now() - 3600000).length, // Active in last hour
            totalPageViews: pageViews.length,
            submissions,
            users,
            pageViews
        }
    } catch (error) {
        console.error('Failed to get admin stats:', error)
        return {
            totalSubmissions: 0,
            passedSubmissions: 0,
            totalUsers: 0,
            activeUsers: 0,
            totalPageViews: 0,
            submissions: [],
            users: [],
            pageViews: []
        }
    }
}