const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3002

app.use(cors())
app.use(express.json())

app.post('/api/execute', async (req, res) => {
    try {
        // For local development, redirect to Vercel function
        // In production, this won't be needed
        res.json({
            error: 'Please use the Vercel deployment or update frontend to use /api/execute directly'
        })
    } catch (error) {
        console.error('Execution error:', error)
        res.status(500).json({
            error: error.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log('⚠️  For code execution, deploy to Vercel or run locally with Vercel CLI')
})