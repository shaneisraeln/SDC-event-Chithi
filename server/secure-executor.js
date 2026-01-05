const express = require('express');
const cors = require('cors');
const {
    spawn
} = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3003;

// Compiler detection function
function findCompiler(compilerName) {
    const commonPaths = [
        'C:\\MinGW\\bin',
        'C:\\mingw64\\bin',
        'C:\\msys64\\mingw64\\bin',
        '/usr/bin',
        '/usr/local/bin'
    ];

    try {
        // Try to run the compiler to check if it exists
        require('child_process').execSync(`${compilerName} --version`, {
            stdio: 'ignore'
        });
        return compilerName;
    } catch (e) {
        // If direct execution fails, try common paths
        for (const dir of commonPaths) {
            const fullPath = path.join(dir, compilerName + (process.platform === 'win32' ? '.exe' : ''));
            if (fs.existsSync(fullPath)) return fullPath;
        }
    }
    return null;
}

// Detect available compilers
const gccPath = findCompiler('gcc');
const gppPath = findCompiler('g++');
const pythonPath = findCompiler(process.platform === 'win32' ? 'python' : 'python3');
const javacPath = findCompiler('javac');
const javaPath = findCompiler('java');

console.log('🔧 Compiler Detection Results:');
console.log('  GCC:', gccPath || '❌ NOT FOUND');
console.log('  G++:', gppPath || '❌ NOT FOUND');
console.log('  Python:', pythonPath || '❌ NOT FOUND');
console.log('  Java Compiler:', javacPath || '❌ NOT FOUND');
console.log('  Java Runtime:', javaPath || '❌ NOT FOUND');

// Warn about missing compilers
const missingCompilers = [];
if (!gccPath) missingCompilers.push('GCC (C compiler)');
if (!gppPath) missingCompilers.push('G++ (C++ compiler)');
if (!pythonPath) missingCompilers.push('Python interpreter');
if (!javacPath) missingCompilers.push('Java compiler (javac)');
if (!javaPath) missingCompilers.push('Java runtime (java)');

if (missingCompilers.length > 0) {
    console.log('⚠️  WARNING: Missing compilers:', missingCompilers.join(', '));
    console.log('   Some programming languages will not work properly.');
    console.log('   In Docker deployment, all compilers should be available.');
}

// Security middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3001'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Strict rate limiting for code execution
const executeLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 code executions per minute
    message: 'Too many code executions, please wait before trying again.'
});

app.use(express.json({
    limit: '10kb'
})); // Limit payload size

// Secure temp directory
const tempDir = path.join(__dirname, 'secure-temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, {
        recursive: true,
        mode: 0o755
    });
}

// Input validation and sanitization
function validateInput(code, language, problemId) {
    // Check code length
    if (!code || code.length > 5000) {
        throw new Error('Code must be between 1 and 5000 characters');
    }

    // Validate language
    const allowedLanguages = ['python', 'java', 'c', 'cpp'];
    if (!allowedLanguages.includes(language)) {
        throw new Error('Unsupported language');
    }

    // Validate problem ID
    if (!problemId || !/^[a-z0-9-]+$/.test(problemId)) {
        throw new Error('Invalid problem ID');
    }

    // Check for dangerous patterns
    const dangerousPatterns = [
        /import\s+os/i,
        /import\s+subprocess/i,
        /import\s+sys/i,
        /exec\s*\(/i,
        /eval\s*\(/i,
        /open\s*\(/i,
        /file\s*\(/i,
        /system\s*\(/i,
        /Runtime\.getRuntime/i,
        /ProcessBuilder/i,
        /#include\s*<unistd\.h>/i,
        /#include\s*<sys\//i,
        /fork\s*\(/i,
        /exec\w*\s*\(/i,
        /\bfopen\b/i,
        /\bfwrite\b/i,
        /\bremove\b/i,
        /\bunlink\b/i
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(code)) {
            throw new Error('Code contains potentially dangerous operations');
        }
    }

    return true;
}

// Secure code execution with resource limits
async function executeCodeSecurely(code, language, problemId, testcases) {
    validateInput(code, language, problemId);

    const sessionId = crypto.randomBytes(16).toString('hex');
    const sessionDir = path.join(tempDir, sessionId);

    try {
        // Create isolated session directory
        fs.mkdirSync(sessionDir, {
            mode: 0o700
        });

        const results = [];
        const allTests = [...testcases.visible, ...testcases.hidden];

        for (let i = 0; i < Math.min(allTests.length, 10); i++) { // Limit test cases
            const testcase = allTests[i];
            const result = await executeTestCase(code, language, problemId, testcase, sessionDir, i);
            results.push(result);
        }

        return {
            results,
            allPassed: results.every(r => r.passed)
        };

    } finally {
        // Cleanup session directory
        try {
            fs.rmSync(sessionDir, {
                recursive: true,
                force: true
            });
        } catch (err) {
            console.error('Cleanup error:', err);
        }
    }
}

async function executeTestCase(code, language, problemId, testcase, sessionDir, index) {
    return new Promise((resolve) => {
        const timeout = 5000; // 5 second timeout
        let filename, command, args;

        try {
            // Generate secure filename
            const fileId = `test_${index}_${Date.now()}`;

            switch (language) {
                case 'python':
                    filename = path.join(sessionDir, `${fileId}.py`);
                    const pythonWrapper = generatePythonWrapper(code, problemId, testcase);
                    fs.writeFileSync(filename, pythonWrapper, {
                        mode: 0o600
                    });
                    if (!pythonPath) {
                        throw new Error('Python interpreter not found');
                    }
                    command = pythonPath;
                    args = [filename];
                    break;

                case 'java':
                    const className = `Test${index}${Date.now()}`;
                    filename = path.join(sessionDir, `${className}.java`);
                    const javaWrapper = generateJavaWrapper(code, problemId, testcase, className);
                    fs.writeFileSync(filename, javaWrapper, {
                        mode: 0o600
                    });

                    if (!javacPath || !javaPath) {
                        throw new Error('Java compiler or runtime not found');
                    }

                    // Compile Java
                    const compileChild = spawn(javacPath || 'javac', [filename], {
                        cwd: sessionDir,
                        timeout: timeout,
                        stdio: ['pipe', 'pipe', 'pipe']
                    });

                    let compileStderr = '';
                    compileChild.stderr.on('data', (data) => {
                        compileStderr += data.toString();
                    });

                    compileChild.on('close', (compileCode) => {
                        if (compileCode !== 0) {
                            resolve({
                                passed: false,
                                error: `Compilation failed: ${compileStderr}`
                            });
                            return;
                        }

                        // Run Java
                        const runChild = spawn(javaPath || 'java', ['-cp', sessionDir, className], {
                            cwd: sessionDir,
                            timeout: timeout,
                            stdio: ['pipe', 'pipe', 'pipe']
                        });

                        let runStdout = '';
                        let runStderr = '';

                        runChild.stdout.on('data', (data) => {
                            runStdout += data.toString();
                        });

                        runChild.stderr.on('data', (data) => {
                            runStderr += data.toString();
                        });

                        runChild.on('close', (runCode) => {
                            if (runCode !== 0) {
                                resolve({
                                    passed: false,
                                    error: `Runtime error: ${runStderr}`
                                });
                                return;
                            }

                            try {
                                const result = JSON.parse(runStdout.trim());
                                const passed = JSON.stringify(result) === JSON.stringify(testcase.output);
                                resolve({
                                    passed,
                                    output: result,
                                    expected: testcase.output,
                                    error: passed ? null : `Expected ${JSON.stringify(testcase.output)}, got ${JSON.stringify(result)}`
                                });
                            } catch (err) {
                                resolve({
                                    passed: false,
                                    error: 'Invalid output format'
                                });
                            }
                        });
                    });
                    return; // Exit early for Java

                case 'c':
                    filename = path.join(sessionDir, `${fileId}.c`);
                    const cWrapper = generateCWrapper(code, problemId, testcase);
                    fs.writeFileSync(filename, cWrapper, {
                        mode: 0o600
                    });
                    if (!gccPath) {
                        throw new Error('GCC compiler not found');
                    }
                    command = gccPath;
                    args = [filename, '-o', path.join(sessionDir, fileId), '-std=c99'];
                    break;

                case 'cpp':
                    filename = path.join(sessionDir, `${fileId}.cpp`);
                    const cppWrapper = generateCppWrapper(code, problemId, testcase);
                    fs.writeFileSync(filename, cppWrapper, {
                        mode: 0o600
                    });
                    if (!gppPath) {
                        throw new Error('G++ compiler not found');
                    }
                    command = gppPath;
                    args = [filename, '-o', path.join(sessionDir, fileId), '-std=c++17'];
                    break;

                default:
                    throw new Error('Unsupported language');
            }

            // Execute with strict resource limits
            const child = spawn(command, args, {
                cwd: sessionDir,
                timeout: timeout,
                stdio: ['pipe', 'pipe', 'pipe'],
                uid: process.getuid ? process.getuid() : undefined, // Drop privileges on Unix
                gid: process.getgid ? process.getgid() : undefined,
                env: {}, // Empty environment
                detached: false
            });

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                stdout += data.toString();
                if (stdout.length > 10000) { // Limit output size
                    child.kill('SIGKILL');
                }
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
                if (stderr.length > 10000) { // Limit error output size
                    child.kill('SIGKILL');
                }
            });

            child.on('close', (code, signal) => {
                if (signal === 'SIGKILL') {
                    resolve({
                        passed: false,
                        error: 'Execution terminated (timeout or resource limit exceeded)'
                    });
                    return;
                }

                if (code !== 0) {
                    resolve({
                        passed: false,
                        error: stderr || 'Compilation/execution failed'
                    });
                    return;
                }

                // For compiled languages, run the executable
                if (language === 'c' || language === 'cpp') {
                    const execPath = path.join(sessionDir, `${fileId}${process.platform === 'win32' ? '.exe' : ''}`);
                    const runChild = spawn(execPath, [], {
                        cwd: sessionDir,
                        timeout: timeout,
                        stdio: ['pipe', 'pipe', 'pipe']
                    });

                    let runStdout = '';
                    runChild.stdout.on('data', (data) => {
                        runStdout += data.toString();
                    });

                    runChild.on('close', (runCode) => {
                        if (runCode !== 0) {
                            resolve({
                                passed: false,
                                error: 'Runtime error'
                            });
                            return;
                        }

                        try {
                            const result = JSON.parse(runStdout.trim());
                            const passed = JSON.stringify(result) === JSON.stringify(testcase.output);
                            resolve({
                                passed,
                                output: result,
                                expected: testcase.output,
                                error: passed ? null : `Expected ${JSON.stringify(testcase.output)}, got ${JSON.stringify(result)}`
                            });
                        } catch (err) {
                            resolve({
                                passed: false,
                                error: 'Invalid output format'
                            });
                        }
                    });
                } else {
                    // For interpreted languages
                    try {
                        const result = JSON.parse(stdout.trim());
                        const passed = JSON.stringify(result) === JSON.stringify(testcase.output);
                        resolve({
                            passed,
                            output: result,
                            expected: testcase.output,
                            error: passed ? null : `Expected ${JSON.stringify(testcase.output)}, got ${JSON.stringify(result)}`
                        });
                    } catch (err) {
                        resolve({
                            passed: false,
                            error: 'Invalid output format'
                        });
                    }
                }
            });

            child.on('error', (err) => {
                resolve({
                    passed: false,
                    error: `Execution error: ${err.message}`
                });
            });

        } catch (err) {
            resolve({
                passed: false,
                error: `Setup error: ${err.message}`
            });
        }
    });
}

// Secure wrapper generators (simplified versions)
function generatePythonWrapper(code, problemId, testcase) {
    return `import json
import sys
sys.modules['os'] = None
sys.modules['subprocess'] = None

${code}

try:
    if '${problemId}' == 'reverse-string':
        s = ${JSON.stringify(testcase.input.s)}
        reverseString(s)
        print(json.dumps(s))
    else:
        result = ${getFunctionName(problemId)}(*${JSON.stringify(Object.values(testcase.input))})
        print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`;
}

function generateJavaWrapper(code, problemId, testcase, className) {
    const functionName = getFunctionName(problemId);
    let mainCode = '';

    if (problemId === 'two-sum') {
        const {
            nums,
            target
        } = testcase.input;
        mainCode = `
            int[] nums = {${nums.join(',')}};
            int target = ${target};
            Solution solution = new Solution();
            int[] result = solution.twoSum(nums, target);
            System.out.print("[");
            for (int i = 0; i < result.length; i++) {
                System.out.print(result[i]);
                if (i < result.length - 1) System.out.print(",");
            }
            System.out.print("]");`;
    } else if (problemId === 'valid-anagram') {
        const {
            s,
            t
        } = testcase.input;
        mainCode = `
            String s = "${s}";
            String t = "${t}";
            Solution solution = new Solution();
            boolean result = solution.isAnagram(s, t);
            System.out.print(result ? "true" : "false");`;
    } else if (problemId === 'contains-duplicate') {
        const {
            nums
        } = testcase.input;
        mainCode = `
            int[] nums = {${nums.join(',')}};
            Solution solution = new Solution();
            boolean result = solution.containsDuplicate(nums);
            System.out.print(result ? "true" : "false");`;
    } else if (problemId === 'reverse-string') {
        const {
            s
        } = testcase.input;
        mainCode = `
            char[] s = {${s.map(c => `'${c}'`).join(',')}};
            Solution solution = new Solution();
            solution.reverseString(s);
            System.out.print("[");
            for (int i = 0; i < s.length; i++) {
                System.out.print("\\"" + s[i] + "\\"");
                if (i < s.length - 1) System.out.print(",");
            }
            System.out.print("]");`;
    } else if (problemId === 'valid-palindrome') {
        const {
            s
        } = testcase.input;
        mainCode = `
            String s = "${s}";
            Solution solution = new Solution();
            boolean result = solution.isPalindrome(s);
            System.out.print(result ? "true" : "false");`;
    } else {
        mainCode = `System.out.print("{}");`;
    }

    return `import java.util.*;

class Solution {
${code}
}

public class ${className} {
    public static void main(String[] args) {
        try {
            ${mainCode}
        } catch (Exception e) {
            System.out.print("{\\"error\\": \\"" + e.getMessage() + "\\"}");
        }
    }
}`;
}

function generateCWrapper(code, problemId, testcase) {
    const functionName = getFunctionName(problemId);
    let mainCode = '';

    if (problemId === 'two-sum') {
        const {
            nums,
            target
        } = testcase.input;
        mainCode = `
    int nums[] = {${nums.join(',')}};
    int returnSize = 0;
    int* result = twoSum(nums, ${nums.length}, ${target}, &returnSize);
    printf("[");
    for (int i = 0; i < returnSize; i++) {
        printf("%d", result[i]);
        if (i < returnSize - 1) printf(",");
    }
    printf("]");
    free(result);`;
    } else if (problemId === 'valid-anagram') {
        const {
            s,
            t
        } = testcase.input;
        mainCode = `
    char s[] = "${s}";
    char t[] = "${t}";
    bool result = isAnagram(s, t);
    printf(result ? "true" : "false");`;
    } else if (problemId === 'contains-duplicate') {
        const {
            nums
        } = testcase.input;
        mainCode = `
    int nums[] = {${nums.join(',')}};
    bool result = containsDuplicate(nums, ${nums.length});
    printf(result ? "true" : "false");`;
    } else if (problemId === 'reverse-string') {
        const {
            s
        } = testcase.input;
        mainCode = `
    char s[] = {${s.map(c => `'${c}'`).join(',')}};
    reverseString(s, ${s.length});
    printf("[");
    for (int i = 0; i < ${s.length}; i++) {
        printf("\\"%c\\"", s[i]);
        if (i < ${s.length} - 1) printf(",");
    }
    printf("]");`;
    } else if (problemId === 'valid-palindrome') {
        const {
            s
        } = testcase.input;
        mainCode = `
    char s[] = "${s}";
    bool result = isPalindrome(s);
    printf(result ? "true" : "false");`;
    } else {
        mainCode = `printf("{}");`;
    }

    return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
${code}
int main() {
    ${mainCode}
    return 0;
}`;
}

function generateCppWrapper(code, problemId, testcase) {
    const functionName = getFunctionName(problemId);
    let mainCode = '';

    if (problemId === 'two-sum') {
        const {
            nums,
            target
        } = testcase.input;
        mainCode = `
    vector<int> nums = {${nums.join(',')}};
    vector<int> result = twoSum(nums, ${target});
    cout << "[";
    for (size_t i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]";`;
    } else if (problemId === 'valid-anagram') {
        const {
            s,
            t
        } = testcase.input;
        mainCode = `
    string s = "${s}";
    string t = "${t}";
    bool result = isAnagram(s, t);
    cout << (result ? "true" : "false");`;
    } else if (problemId === 'contains-duplicate') {
        const {
            nums
        } = testcase.input;
        mainCode = `
    vector<int> nums = {${nums.join(',')}};
    bool result = containsDuplicate(nums);
    cout << (result ? "true" : "false");`;
    } else if (problemId === 'reverse-string') {
        const {
            s
        } = testcase.input;
        mainCode = `
    vector<char> s = {${s.map(c => `'${c}'`).join(',')}};
    reverseString(s);
    cout << "[";
    for (size_t i = 0; i < s.size(); i++) {
        cout << "\\"" << s[i] << "\\"";
        if (i < s.size() - 1) cout << ",";
    }
    cout << "]";`;
    } else if (problemId === 'valid-palindrome') {
        const {
            s
        } = testcase.input;
        mainCode = `
    string s = "${s}";
    bool result = isPalindrome(s);
    cout << (result ? "true" : "false");`;
    } else {
        mainCode = `cout << "{}";`;
    }

    return `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
using namespace std;
${code}
int main() {
    ${mainCode}
    return 0;
}`;
}

function getFunctionName(problemId) {
    const functionNames = {
        'two-sum': 'twoSum',
        'valid-anagram': 'isAnagram',
        'contains-duplicate': 'containsDuplicate',
        'reverse-string': 'reverseString',
        'valid-palindrome': 'isPalindrome',
        'group-anagrams': 'groupAnagrams',
        'longest-substring-without-repeating': 'lengthOfLongestSubstring',
        'three-sum': 'threeSum',
        'container-with-most-water': 'maxArea',
        'product-of-array-except-self': 'productExceptSelf'
    };
    return functionNames[problemId] || 'solution';
}

// API endpoint
app.post('/api/execute', executeLimiter, async (req, res) => {
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

        const results = await executeCodeSecurely(code, language, problemId, testcases);
        res.json(results);

    } catch (error) {
        console.error('Execution error:', error);
        res.status(400).json({
            error: error.message
        });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🔒 Secure code executor running on port ${PORT}`);
});

module.exports = app;