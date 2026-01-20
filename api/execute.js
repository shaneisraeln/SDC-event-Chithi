import Groq from 'groq-sdk';

// Initialize Groq AI
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

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
}

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
        model: "llama-3.1-8b-instant", // Fast and accurate model
        temperature: 0, // Deterministic responses
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
    return `You are a code execution simulator. Analyze this ${language} code and predict its exact output for the given input.

PROBLEM: ${problemId}
CODE:
\`\`\`${language}
${code}
\`\`\`

INPUT: ${JSON.stringify(testcase.input)}
EXPECTED OUTPUT: ${JSON.stringify(testcase.output)}

INSTRUCTIONS:
1. Mentally execute the code step by step
2. Predict the exact output the code would produce
3. Compare with expected output
4. Return ONLY a JSON response in this format:

{
  "passed": true/false,
  "output": [predicted output],
  "error": "explanation if failed" or null
}

Be precise - the output must match exactly for the test to pass.`;
}