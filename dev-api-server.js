import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config({
    path: '.env.local'
});

const app = express();
const PORT = 3003;

// Initialize Groq AI
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.use(cors());
app.use(express.json());

// API endpoint that matches our Vercel function
app.post('/api/execute', async (req, res) => {
    try {
        const {
            code,
            language,
            problemId,
            testcases
        } = req.body;

        if (!code || !language || !problemId || !testcases) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        const results = [];
        const allTests = [...testcases.visible, ...testcases.hidden];

        // Process each test case
        for (let i = 0; i < allTests.length; i++) {
            const testcase = allTests[i];

            try {
                const result = await evaluateCodeWithGroq(code, language, problemId, testcase);
                results.push(result);
            } catch (error) {
                results.push({
                    passed: false,
                    error: `AI evaluation failed: ${error.message}`
                });
            }
        }

        return res.json({
            results,
            allPassed: results.every(r => r.passed)
        });

    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
});

async function evaluateCodeWithGroq(code, language, problemId, testcase) {
    const prompt = createEvaluationPrompt(code, language, problemId, testcase);

    const completion = await groq.chat.completions.create({
        messages: [{
                role: "system",
                content: "You are a precise code execution simulator. Analyze code and predict exact outputs. Always respond with valid JSON only."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0,
        max_tokens: 1000
    });

    const response = completion.choices[0].message.content;

    try {
        // Clean the response - remove markdown formatting if present
        let cleanResponse = response;
        if (response.includes('```json')) {
            const match = response.match(/```json\s*([\s\S]*?)\s*```/);
            cleanResponse = match ? match[1] : response;
        }

        // Parse AI response
        const evaluation = JSON.parse(cleanResponse);

        return {
            passed: evaluation.passed,
            output: evaluation.output,
            expected: testcase.output,
            error: evaluation.passed ? null : evaluation.error
        };
    } catch (parseError) {
        // If AI doesn't return valid JSON, try to extract key info
        const passed = response.toLowerCase().includes('true') || response.toLowerCase().includes('pass');
        return {
            passed,
            output: null,
            expected: testcase.output,
            error: passed ? null : 'AI evaluation unclear'
        };
    }
}

function createEvaluationPrompt(code, language, problemId, testcase) {
    return `You are a strict code execution simulator. You must analyze this ${language} code and predict its EXACT output.

CRITICAL RULES:
1. If the code is incomplete, empty, or just a function signature - it MUST FAIL
2. If the code doesn't implement the required logic - it MUST FAIL  
3. Only return "passed": true if the code would actually produce the correct output
4. Be extremely strict - starter code or incomplete implementations should FAIL

PROBLEM: ${problemId}
CODE TO EVALUATE:
\`\`\`${language}
${code}
\`\`\`

INPUT: ${JSON.stringify(testcase.input)}
EXPECTED OUTPUT: ${JSON.stringify(testcase.output)}

ANALYSIS STEPS:
1. Check if code is complete and implements the required logic
2. If incomplete/empty/starter code → FAIL immediately
3. If complete → mentally execute step by step
4. Compare predicted output with expected output
5. Return result

RESPOND WITH ONLY THIS JSON FORMAT:
{
  "passed": true/false,
  "output": [your predicted output or null if code incomplete],
  "error": "specific reason for failure" or null
}

REMEMBER: Be extremely strict. Incomplete code = automatic failure.`;
}

app.listen(PORT, () => {
    console.log(`🚀 Development API server running on http://localhost:${PORT}`);
    console.log('Frontend should be running on http://localhost:3002');
});