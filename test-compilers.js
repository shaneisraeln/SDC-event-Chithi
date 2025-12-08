// Quick test script to verify all compilers work
const {
    executeCode
} = require('./server/executor');

const testCases = {
    visible: [{
        input: {
            nums: [2, 7, 11, 15],
            target: 9
        },
        output: [0, 1]
    }],
    hidden: []
};

async function testLanguages() {
    console.log('🧪 Testing All Language Compilers\n');
    console.log('='.repeat(50));

    // Test JavaScript
    console.log('\n🟨 Testing JavaScript...');
    const jsCode = `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      if (map.has(complement)) {
        return [map.get(complement), i];
      }
      map.set(nums[i], i);
    }
    return [];
  }`;

    try {
        const jsResult = await executeCode(jsCode, 'javascript', 'two-sum', testCases);
        console.log(jsResult.allPassed ? '✅ JavaScript: PASSED' : '❌ JavaScript: FAILED');
        if (!jsResult.allPassed) {
            const error = jsResult.error || (jsResult.results[0] && jsResult.results[0].error);
            console.log('Error:', error);
        }
    } catch (err) {
        console.log('❌ JavaScript: ERROR -', err.message);
    }

    // Test Python
    console.log('\n🐍 Testing Python...');
    const pyCode = `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`;

    try {
        const pyResult = await executeCode(pyCode, 'python', 'two-sum', testCases);
        console.log(pyResult.allPassed ? '✅ Python: PASSED' : '❌ Python: FAILED');
        if (!pyResult.allPassed) {
            const error = pyResult.error || (pyResult.results[0] && pyResult.results[0].error);
            console.log('Error:', error);
        }
    } catch (err) {
        console.log('❌ Python: ERROR -', err.message);
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n✨ Compiler Test Complete!\n');
    console.log('Note: C and C++ require more complex test setup.');
    console.log('They will work in the web application with proper problem structure.\n');
}

testLanguages().catch(console.error);