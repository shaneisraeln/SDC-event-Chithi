const express = require('express')
const cors = require('cors')
const {
    executeCode
} = require('./executor')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.post('/api/execute', async (req, res) => {
    try {
        const {
            code,
            language,
            problemId,
            testcases
        } = req.body

        if (!code || !language || !problemId || !testcases) {
            return res.status(400).json({
                error: 'Missing required fields'
            })
        }

        const results = await executeCode(code, language, problemId, testcases)
        res.json(results)
    } catch (error) {
        console.error('Execution error:', error)
        res.status(500).json({
            error: error.message
        })
    }
})

app.listen(PORT, () => {
    console.log(`🚀 Autograder server running on http://localhost:${PORT}`)
})