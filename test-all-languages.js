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

async function testAll() {
    console.log('🧪 Testing All 4 Languages\n');

    // JavaScript
    console.log('🟨 JavaScript...');
    const jsCode = `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
      if (map.has(target - nums[i])) return [map.get(target - nums[i]), i];
      map.set(nums[i], i);
    }
  }`;
    const jsResult = await executeCode(jsCode, 'javascript', 'two-sum', testCases);
    console.log(jsResult.allPassed ? '✅ PASSED\n' : '❌ FAILED:', jsResult.error || jsResult.results[0].error, '\n');

    // Python
    console.log('🐍 Python...');
    const pyCode = `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i`;
    const pyResult = await executeCode(pyCode, 'python', 'two-sum', testCases);
    console.log(pyResult.allPassed ? '✅ PASSED\n' : '❌ FAILED:', pyResult.error || pyResult.results[0].error, '\n');

    // C
    console.log('©️ C...');
    const cCode = `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    return result;
}`;
    const cResult = await executeCode(cCode, 'c', 'two-sum', testCases);
    console.log(cResult.allPassed ? '✅ PASSED\n' : '❌ FAILED:', cResult.error || cResult.results[0].error, '\n');

    // C++
    console.log('➕ C++...');
    const cppCode = `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        if (map.count(target - nums[i])) {
            return {map[target - nums[i]], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`;
    const cppResult = await executeCode(cppCode, 'cpp', 'two-sum', testCases);
    console.log(cppResult.allPassed ? '✅ PASSED\n' : '❌ FAILED:', cppResult.error || cppResult.results[0].error, '\n');

    console.log('✨ All tests complete!');
}

testAll().catch(console.error);