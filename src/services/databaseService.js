import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
    where,
    onSnapshot,
    serverTimestamp,
    doc,
    setDoc,
    updateDoc,
    increment
} from 'firebase/firestore'
import {
    db
} from '../config/firebase'

// Generate unique user ID
export const generateUserId = () => {
    let userId = localStorage.getItem('user_id')
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        localStorage.setItem('user_id', userId)
    }
    return userId
}

// Get user's device/browser info for better tracking
const getUserInfo = () => {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
}

// Log submission to Firebase
export const logSubmission = async (submissionData) => {
    try {
        const userId = generateUserId()

        const submission = {
            userId,
            problemId: submissionData.problemId,
            language: submissionData.language,
            code: submissionData.code,
            passed: submissionData.allPassed,
            results: submissionData.results,
            error: submissionData.error || null,
            timestamp: serverTimestamp(),
            userInfo: getUserInfo()
        }

        // Add submission to Firebase
        await addDoc(collection(db, 'submissions'), submission)

        // Update user activity
        await updateUserActivity(userId, submissionData.problemId)

        console.log('✅ Submission logged to Firebase')

    } catch (error) {
        console.error('❌ Failed to log submission to Firebase:', error)
        // Fallback to localStorage
        const submissions = JSON.parse(localStorage.getItem('admin_submissions') || '[]')
        submissions.unshift({
            ...submissionData,
            id: Date.now(),
            timestamp: Date.now(),
            userId: generateUserId()
        })
        localStorage.setItem('admin_submissions', JSON.stringify(submissions.slice(0, 100)))
    }
}

// Update user activity in Firebase
export const updateUserActivity = async (userId, problemId) => {
    try {
        const userRef = doc(db, 'users', userId)

        const userData = {
            id: userId,
            lastActive: serverTimestamp(),
            totalSubmissions: increment(1),
            userInfo: getUserInfo()
        }

        // Add problem to attempted list if not already there
        if (problemId) {
            userData.problemsAttempted = problemId // We'll handle array logic in security rules
        }

        await setDoc(userRef, userData, {
            merge: true
        })

    } catch (error) {
        console.error('❌ Failed to update user activity:', error)
    }
}

// Log page view to Firebase
export const logPageView = async (pageName) => {
    try {
        const userId = generateUserId()

        await addDoc(collection(db, 'pageViews'), {
            userId,
            page: pageName,
            timestamp: serverTimestamp(),
            userInfo: getUserInfo()
        })

        // Update user's last active time
        await updateUserActivity(userId)

    } catch (error) {
        console.error('❌ Failed to log page view:', error)
    }
}

// Get real-time submissions (for admin dashboard)
export const subscribeToSubmissions = (callback, limitCount = 50) => {
    try {
        const q = query(
            collection(db, 'submissions'),
            orderBy('timestamp', 'desc'),
            limit(limitCount)
        )

        return onSnapshot(q, (snapshot) => {
            const submissions = []
            snapshot.forEach((doc) => {
                const data = doc.data()
                let timestamp = Date.now()

                // Safe timestamp conversion
                if (data.timestamp && typeof data.timestamp.toMillis === 'function') {
                    timestamp = data.timestamp.toMillis()
                }

                submissions.push({
                    id: doc.id,
                    ...data,
                    timestamp: timestamp
                })
            })
            callback(submissions)
        })

    } catch (error) {
        console.error('❌ Failed to subscribe to submissions:', error)
        callback([])
        return () => {} // Return empty unsubscribe function
    }
}

// Get real-time users (for admin dashboard)
export const subscribeToUsers = (callback) => {
    try {
        const q = query(
            collection(db, 'users'),
            orderBy('lastActive', 'desc')
        )

        return onSnapshot(q, (snapshot) => {
            const users = []
            snapshot.forEach((doc) => {
                const data = doc.data()
                let lastActive = Date.now()
                let firstSeen = Date.now()

                // Safe timestamp conversion
                if (data.lastActive && typeof data.lastActive.toMillis === 'function') {
                    lastActive = data.lastActive.toMillis()
                }
                if (data.firstSeen && typeof data.firstSeen.toMillis === 'function') {
                    firstSeen = data.firstSeen.toMillis()
                }

                users.push({
                    id: doc.id,
                    ...data,
                    lastActive: lastActive,
                    firstSeen: firstSeen
                })
            })
            callback(users)
        })

    } catch (error) {
        console.error('❌ Failed to subscribe to users:', error)
        callback([])
        return () => {}
    }
}

// Get analytics data
export const getAnalytics = async () => {
    try {
        // Get submissions
        const submissionsQuery = query(collection(db, 'submissions'))
        const submissionsSnapshot = await getDocs(submissionsQuery)
        const submissions = []
        submissionsSnapshot.forEach((doc) => {
            submissions.push({
                id: doc.id,
                ...doc.data()
            })
        })

        // Get users
        const usersQuery = query(collection(db, 'users'))
        const usersSnapshot = await getDocs(usersQuery)
        const users = []
        usersSnapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                ...doc.data()
            })
        })

        // Calculate analytics
        const totalSubmissions = submissions.length
        const passedSubmissions = submissions.filter(s => s.passed).length
        const passRate = totalSubmissions > 0 ? ((passedSubmissions / totalSubmissions) * 100).toFixed(1) : 0

        // Active users (last 30 minutes)
        const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000)
        const activeUsers = users.filter(u => {
            let lastActive = u.lastActive
            if (u.lastActive && typeof u.lastActive.toMillis === 'function') {
                lastActive = u.lastActive.toMillis()
            }
            return lastActive > thirtyMinutesAgo
        }).length

        return {
            totalSubmissions,
            passedSubmissions,
            failedSubmissions: totalSubmissions - passedSubmissions,
            passRate,
            totalUsers: users.length,
            activeUsers,
            submissions,
            users
        }

    } catch (error) {
        console.error('❌ Failed to get analytics:', error)
        return {
            totalSubmissions: 0,
            passedSubmissions: 0,
            failedSubmissions: 0,
            passRate: 0,
            totalUsers: 0,
            activeUsers: 0,
            submissions: [],
            users: []
        }
    }
}

// Initialize user session
export const initializeUserSession = async () => {
    try {
        const userId = generateUserId()
        const userRef = doc(db, 'users', userId)

        await setDoc(userRef, {
            id: userId,
            firstSeen: serverTimestamp(),
            lastActive: serverTimestamp(),
            totalSubmissions: 0,
            problemsAttempted: [],
            userInfo: getUserInfo()
        }, {
            merge: true
        })

        console.log('✅ User session initialized:', userId)

    } catch (error) {
        console.error('❌ Failed to initialize user session:', error)
    }
}