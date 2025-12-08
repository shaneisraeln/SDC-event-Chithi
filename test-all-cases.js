const {
    executeCode
} = require('./server/executor');

const allTestCases = {
    visible: [{
            input: {
                nums: [2, 7, 11, 15],
                target: 9
            },
            output: [0, 1]
        },
        {
            input: {
                nums: [3, 2, 4],
                target: 6
            },
            output: [1, 2]
        }
    ],
    hidden: [{
            input: {
                nums: [3, 3],
                target: 6
            },
            output: [0, 1]
        },
        {
            input: {
                nums: [1, 5, 3, 7, 9],
                target: 12
            },
            output: [2, 4]
        },
        {
            input: {
                nums: [-1, -2, -3, -4, -5],
                target: -8
            },
            output: [2, 4]
        }
    ]
};

async function testAll() {
    console.log('Testing all Two Sum test cases...\n');

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

    const result = await executeCode(code, 'javascript', 'two-sum', allTestCases);

    console.log('Overall result:', result.allPassed ? '✅ ALL PASSED' : '❌ SOME FAILED');
    console.log('\nIndividual results:');

    const allTests = [...allTestCases.visible, ...allTestCases.hidden];
    result.results.forEach((res, i) => {
        const testCase = allTests[i];
        console.log(`\nTest ${i + 1}:`);
        console.log(`  Input: nums=${JSON.stringify(testCase.input.nums)}, target=${testCase.input.target}`);
        console.log(`  Expected: ${JSON.stringify(testCase.output)}`);
        console.log(`  Got: ${JSON.stringify(res.output)}`);
        console.log(`  Status: ${res.passed ? '✅ PASSED' : '❌ FAILED'}`);
        if (!res.passed) {
            console.log(`  Error: ${res.error}`);
        }
    });
}

testAll().catch(console.error);