const {
    executeCode
} = require('./server/executor');

const testCase = {
    visible: [],
    hidden: [{
        input: {
            nums: [-1, -2, -3, -4, -5],
            target: -8
        },
        output: [2, 4]
    }]
};

async function test() {
    console.log('Testing negative numbers case...\n');
    console.log('Input: nums = [-1, -2, -3, -4, -5], target = -8');
    console.log('Expected: [2, 4] (because -3 + -5 = -8)\n');

    // Correct solution
    const code = `function twoSum(nums, target) {
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

    const result = await executeCode(code, 'javascript', 'two-sum', testCase);

    console.log('Result:', result);
    console.log('\nTest passed:', result.allPassed);

    if (!result.allPassed) {
        console.log('Output:', result.results[0].output);
        console.log('Expected:', result.results[0].expected);
        console.log('Error:', result.results[0].error);
    }
}

test().catch(console.error);