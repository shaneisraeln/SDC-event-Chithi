export const problems = {
    // Round 1: Aptitude MCQs (10 Questions)
    1: [{
            id: 'logical-reasoning-1',
            type: 'MCQ',
            title: 'Logical Sequence',
            question: 'What comes next in the sequence: 2, 6, 12, 20, 30, ?',
            options: ['40', '42', '44', '46'],
            correct: 1, // 42
            explanation: 'The differences are 4, 6, 8, 10, 12... (increasing by 2 each time)',
            difficulty: 'Easy',
            timeLimit: 60
        },
        {
            id: 'mathematical-aptitude-1',
            type: 'MCQ',
            title: 'Speed Calculation',
            question: 'A car travels 240 km in 3 hours. What is its average speed in m/s?',
            options: ['22.22 m/s', '20 m/s', '80 m/s', '13.33 m/s'],
            correct: 0, // 22.22 m/s
            explanation: '240 km / 3 hours = 80 km/h = 80 × (1000/3600) = 22.22 m/s',
            difficulty: 'Medium',
            timeLimit: 90
        },
        {
            id: 'pattern-recognition-1',
            type: 'MCQ',
            title: 'Binary Pattern',
            question: 'In binary, what is 1011 + 1101?',
            options: ['11000', '10111', '11001', '10110'],
            correct: 0, // 11000
            explanation: '1011 (11) + 1101 (13) = 11000 (24 in decimal)',
            difficulty: 'Medium',
            timeLimit: 75
        },
        {
            id: 'logical-reasoning-2',
            type: 'MCQ',
            title: 'Code Breaking',
            question: 'If CODING is written as DPEJOH, how is PYTHON written?',
            options: ['QZUIPO', 'QZUIPM', 'QZUIPN', 'QZUJPO'],
            correct: 2, // QZUIPN
            explanation: 'Each letter is shifted by +1 in the alphabet',
            difficulty: 'Easy',
            timeLimit: 60
        },
        {
            id: 'mathematical-aptitude-2',
            type: 'MCQ',
            title: 'Probability',
            question: 'What is the probability of getting at least one head in 3 coin tosses?',
            options: ['1/8', '3/8', '7/8', '1/2'],
            correct: 2, // 7/8
            explanation: 'P(at least one head) = 1 - P(all tails) = 1 - (1/2)³ = 7/8',
            difficulty: 'Hard',
            timeLimit: 120
        },
        {
            id: 'logical-reasoning-3',
            type: 'MCQ',
            title: 'Time Logic',
            question: 'If it takes 5 machines 5 minutes to make 5 widgets, how long does it take 100 machines to make 100 widgets?',
            options: ['5 minutes', '20 minutes', '100 minutes', '500 minutes'],
            correct: 0, // 5 minutes
            explanation: 'Each machine makes 1 widget in 5 minutes, so 100 machines make 100 widgets in 5 minutes',
            difficulty: 'Medium',
            timeLimit: 90
        },
        {
            id: 'pattern-recognition-2',
            type: 'MCQ',
            title: 'Number Series',
            question: 'Find the missing number: 1, 4, 9, 16, ?, 36',
            options: ['20', '25', '30', '32'],
            correct: 1, // 25
            explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6²',
            difficulty: 'Easy',
            timeLimit: 45
        },
        {
            id: 'mathematical-aptitude-3',
            type: 'MCQ',
            title: 'Percentage',
            question: 'A number increased by 20% becomes 144. What was the original number?',
            options: ['120', '115', '125', '130'],
            correct: 0, // 120
            explanation: 'Let x be original number. x + 0.2x = 144, so 1.2x = 144, x = 120',
            difficulty: 'Medium',
            timeLimit: 75
        },
        {
            id: 'logical-reasoning-4',
            type: 'MCQ',
            title: 'Direction Sense',
            question: 'You walk 10m North, then 10m East, then 10m South. How far are you from the starting point?',
            options: ['0m', '10m', '20m', '30m'],
            correct: 1, // 10m
            explanation: 'You end up 10m East of your starting point',
            difficulty: 'Easy',
            timeLimit: 60
        },
        {
            id: 'pattern-recognition-3',
            type: 'MCQ',
            title: 'Algorithm Thinking',
            question: 'In a sorted array [1,3,5,7,9], how many comparisons does binary search need to find 7?',
            options: ['1', '2', '3', '4'],
            correct: 2, // 3
            explanation: 'Compare with 5 (middle), then 7 (right), then found',
            difficulty: 'Hard',
            timeLimit: 90
        }
    ],

    // Round 2: Code Alignment (3 Programs)
    2: [{
            id: 'bubble-sort-fix',
            type: 'CODE_ALIGN',
            title: 'Fix Bubble Sort',
            description: 'Arrange the jumbled lines to create a working bubble sort algorithm',
            language: 'python',
            jumbledLines: [
                'def bubble_sort(arr):',
                '    return arr',
                '        for j in range(0, n-i-1):',
                '    n = len(arr)',
                '            if arr[j] > arr[j+1]:',
                '    for i in range(n):',
                '                arr[j], arr[j+1] = arr[j+1], arr[j]'
            ],
            correctOrder: [0, 3, 5, 2, 4, 6, 1],
            expectedOutput: '[1, 2, 3, 4, 5]',
            testInput: '[5, 2, 8, 1, 9]',
            difficulty: 'Medium',
            timeLimit: 300
        },
        {
            id: 'factorial-fix',
            type: 'CODE_ALIGN',
            title: 'Fix Factorial Function',
            description: 'Rearrange the lines to create a working recursive factorial function',
            language: 'javascript',
            jumbledLines: [
                'function factorial(n) {',
                '    return n * factorial(n - 1);',
                '    if (n <= 1) {',
                '        return 1;',
                '    }',
                '}'
            ],
            correctOrder: [0, 2, 3, 4, 1, 5],
            expectedOutput: '120',
            testInput: '5',
            difficulty: 'Easy',
            timeLimit: 240
        },
        {
            id: 'binary-search-fix',
            type: 'CODE_ALIGN',
            title: 'Fix Binary Search',
            description: 'Organize the scrambled binary search implementation',
            language: 'python',
            jumbledLines: [
                'def binary_search(arr, target):',
                '    while left <= right:',
                '        if arr[mid] == target:',
                '            return mid',
                '    left, right = 0, len(arr) - 1',
                '        mid = (left + right) // 2',
                '        elif arr[mid] < target:',
                '            left = mid + 1',
                '        else:',
                '            right = mid - 1',
                '    return -1'
            ],
            correctOrder: [0, 4, 1, 5, 2, 3, 6, 7, 8, 9, 10],
            expectedOutput: '3',
            testInput: '[1, 3, 5, 7, 9], 7',
            difficulty: 'Hard',
            timeLimit: 360
        }
    ],

    // Round 3: Output Prediction (5 Questions)
    3: [{
            id: 'loop-output-1',
            type: 'OUTPUT_PREDICT',
            title: 'Loop Analysis',
            code: `for i in range(3):
    for j in range(i):
        print(i, j, end=' ')
    print()`,
            question: 'What will be the output of this Python code?',
            options: [
                '0 0\n1 0\n2 0 2 1',
                '\n1 0\n2 0 2 1',
                '0\n1 0\n2 0 2 1',
                'Nothing will be printed'
            ],
            correct: 1,
            explanation: 'i=0: inner loop doesn\'t run (range(0) is empty), prints newline\ni=1: prints "1 0" then newline\ni=2: prints "2 0 2 1" then newline',
            difficulty: 'Medium',
            timeLimit: 120
        },
        {
            id: 'recursion-output-1',
            type: 'OUTPUT_PREDICT',
            title: 'Recursion Trace',
            code: `def mystery(n):
    if n <= 1:
        return 1
    return n + mystery(n-2)

print(mystery(5))`,
            question: 'What will this recursive function output?',
            options: ['9', '8', '15', '6'],
            correct: 0, // 9
            explanation: 'mystery(5) = 5 + mystery(3) = 5 + (3 + mystery(1)) = 5 + (3 + 1) = 9',
            difficulty: 'Hard',
            timeLimit: 150
        },
        {
            id: 'array-manipulation-1',
            type: 'OUTPUT_PREDICT',
            title: 'Array Operations',
            code: `arr = [1, 2, 3, 4, 5]
arr[1:4] = [10]
print(arr)`,
            question: 'What will be printed?',
            options: [
                '[1, 10, 5]',
                '[1, 10, 4, 5]',
                '[10, 2, 3, 4]',
                '[1, 2, 10, 4, 5]'
            ],
            correct: 0, // [1, 10, 5]
            explanation: 'arr[1:4] replaces elements at indices 1, 2, 3 with [10], so [1, 2, 3, 4, 5] becomes [1, 10, 5]',
            difficulty: 'Medium',
            timeLimit: 90
        },
        {
            id: 'string-manipulation-1',
            type: 'OUTPUT_PREDICT',
            title: 'String Slicing',
            code: `s = "PYTHON"
result = s[1::2] + s[::2]
print(result)`,
            question: 'What will be the output?',
            options: ['YTOPTH', 'YTHPTN', 'PYHTON', 'YTHNPO'],
            correct: 1, // YTHPTN
            explanation: 's[1::2] = "YTN" (every 2nd char starting from index 1)\ns[::2] = "PTO" (every 2nd char from start)\nResult: "YTN" + "PTO" = "YTNPTO"',
            difficulty: 'Hard',
            timeLimit: 120
        },
        {
            id: 'dictionary-output-1',
            type: 'OUTPUT_PREDICT',
            title: 'Dictionary Magic',
            code: `d = {'a': 1, 'b': 2}
d.update({'a': 3, 'c': 4})
print(sum(d.values()))`,
            question: 'What will be printed?',
            options: ['6', '7', '9', '10'],
            correct: 2, // 9
            explanation: 'After update: d = {"a": 3, "b": 2, "c": 4}\nsum(d.values()) = 3 + 2 + 4 = 9',
            difficulty: 'Easy',
            timeLimit: 75
        }
    ],

    // Round 4: Easy DSA (String & Array) - 5 Questions
    4: [{
            id: 'two-sum',
            type: 'DSA',
            title: 'Two Sum',
            difficulty: 'Easy',
            description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
            constraints: [
                '2 <= nums.length <= 10^4',
                '-10^9 <= nums[i] <= 10^9',
                '-10^9 <= target <= 10^9',
                'Only one valid answer exists'
            ],
            examples: [{
                    input: 'nums = [2,7,11,15], target = 9',
                    output: '[0,1]',
                    explanation: 'nums[0] + nums[1] == 9, so we return [0, 1]'
                },
                {
                    input: 'nums = [3,2,4], target = 6',
                    output: '[1,2]',
                    explanation: 'nums[1] + nums[2] == 6'
                }
            ],
            hints: [
                'Use a hash map to store numbers you\'ve seen and their indices',
                'For each number, check if (target - number) exists in your hash map'
            ],
            starterCode: {
                python: 'def twoSum(nums, target):\n    # Your code here\n    pass',
                java: 'import java.util.*;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}',
                c: '// Return array of two indices\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Your code here\n    *returnSize = 2;\n    return NULL;\n}',
                cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}'
            }
        },
        {
            id: 'valid-anagram',
            type: 'DSA',
            title: 'Valid Anagram',
            difficulty: 'Easy',
            description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
            constraints: [
                '1 <= s.length, t.length <= 5 * 10^4',
                's and t consist of lowercase English letters'
            ],
            examples: [{
                    input: 's = "anagram", t = "nagaram"',
                    output: 'true',
                    explanation: 'Both strings contain the same characters'
                },
                {
                    input: 's = "rat", t = "car"',
                    output: 'false',
                    explanation: 'Different characters'
                }
            ],
            hints: [
                'Count the frequency of each character in both strings',
                'Compare the frequency maps or sort both strings and compare'
            ],
            starterCode: {
                python: 'def isAnagram(s, t):\n    # Your code here\n    pass',
                java: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Your code here\n        return false;\n    }\n}',
                c: '#include <stdbool.h>\n#include <string.h>\nbool isAnagram(char* s, char* t) {\n    // Your code here\n    return false;\n}',
                cpp: '#include <string>\n#include <algorithm>\nusing namespace std;\n\nbool isAnagram(string s, string t) {\n    // Your code here\n    return false;\n}'
            }
        },
        {
            id: 'contains-duplicate',
            type: 'DSA',
            title: 'Contains Duplicate',
            difficulty: 'Easy',
            description: 'Given an integer array nums, return true if any value appears at least twice in the array.',
            constraints: [
                '1 <= nums.length <= 10^5',
                '-10^9 <= nums[i] <= 10^9'
            ],
            examples: [{
                    input: 'nums = [1,2,3,1]',
                    output: 'true',
                    explanation: '1 appears twice'
                },
                {
                    input: 'nums = [1,2,3,4]',
                    output: 'false',
                    explanation: 'All elements are distinct'
                }
            ],
            hints: [
                'Use a hash set to track seen numbers',
                'Return true as soon as you find a duplicate'
            ],
            starterCode: {
                python: 'def containsDuplicate(nums):\n    # Your code here\n    pass',
                java: 'import java.util.*;\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Your code here\n        return false;\n    }\n}',
                c: '#include <stdbool.h>\nbool containsDuplicate(int* nums, int numsSize) {\n    // Your code here\n    return false;\n}',
                cpp: '#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nbool containsDuplicate(vector<int>& nums) {\n    // Your code here\n    return false;\n}'
            }
        },
        {
            id: 'reverse-string',
            type: 'DSA',
            title: 'Reverse String',
            difficulty: 'Easy',
            description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
            constraints: [
                '1 <= s.length <= 10^5',
                's[i] is a printable ascii character'
            ],
            examples: [{
                input: 's = ["h","e","l","l","o"]',
                output: '["o","l","l","e","h"]',
                explanation: 'Reverse the array in-place'
            }],
            hints: [
                'Use two pointers approach',
                'Swap characters from both ends moving towards center'
            ],
            starterCode: {
                python: 'def reverseString(s):\n    # Your code here\n    pass',
                java: 'class Solution {\n    public void reverseString(char[] s) {\n        // Your code here\n    }\n}',
                c: 'void reverseString(char* s, int sSize) {\n    // Your code here\n}',
                cpp: '#include <vector>\nusing namespace std;\n\nvoid reverseString(vector<char>& s) {\n    // Your code here\n}'
            }
        },
        {
            id: 'valid-palindrome',
            type: 'DSA',
            title: 'Valid Palindrome',
            difficulty: 'Easy',
            description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
            constraints: [
                '1 <= s.length <= 2 * 10^5',
                's consists only of printable ASCII characters'
            ],
            examples: [{
                    input: 's = "A man, a plan, a canal: Panama"',
                    output: 'true',
                    explanation: '"amanaplanacanalpanama" is a palindrome'
                },
                {
                    input: 's = "race a car"',
                    output: 'false',
                    explanation: '"raceacar" is not a palindrome'
                }
            ],
            hints: [
                'Use two pointers from both ends',
                'Skip non-alphanumeric characters',
                'Compare characters in lowercase'
            ],
            starterCode: {
                python: 'def isPalindrome(s):\n    # Your code here\n    pass',
                java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        // Your code here\n        return false;\n    }\n}',
                c: '#include <stdbool.h>\n#include <ctype.h>\nbool isPalindrome(char* s) {\n    // Your code here\n    return false;\n}',
                cpp: '#include <string>\n#include <cctype>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    // Your code here\n    return false;\n}'
            }
        }
    ],

    // Round 5: Medium DSA (String & Array) - 5 Questions
    5: [{
            id: 'group-anagrams',
            type: 'DSA',
            title: 'Group Anagrams',
            difficulty: 'Medium',
            description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
            constraints: [
                '1 <= strs.length <= 10^4',
                '0 <= strs[i].length <= 100',
                'strs[i] consists of lowercase English letters'
            ],
            examples: [{
                input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
                output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
                explanation: 'Group strings that are anagrams of each other'
            }],
            hints: [
                'Use sorted string as key in hash map',
                'Group strings with same sorted characters'
            ],
            starterCode: {
                python: 'def groupAnagrams(strs):\n    # Your code here\n    pass',
                java: 'import java.util.*;\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}',
                c: '// Return array of arrays\nchar*** groupAnagrams(char** strs, int strsSize, int* returnSize, int** returnColumnSizes) {\n    // Your code here\n    return NULL;\n}',
                cpp: '#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<string>> groupAnagrams(vector<string>& strs) {\n    // Your code here\n    return {};\n}'
            }
        },
        {
            id: 'longest-substring-without-repeating',
            type: 'DSA',
            title: 'Longest Substring Without Repeating Characters',
            difficulty: 'Medium',
            description: 'Given a string s, find the length of the longest substring without repeating characters.',
            constraints: [
                '0 <= s.length <= 5 * 10^4',
                's consists of English letters, digits, symbols and spaces'
            ],
            examples: [{
                    input: 's = "abcabcbb"',
                    output: '3',
                    explanation: 'The answer is "abc", with length 3'
                },
                {
                    input: 's = "bbbbb"',
                    output: '1',
                    explanation: 'The answer is "b", with length 1'
                }
            ],
            hints: [
                'Use sliding window technique',
                'Use a hash set to track characters in current window',
                'Expand window when no duplicates, shrink when duplicate found'
            ],
            starterCode: {
                python: 'def lengthOfLongestSubstring(s):\n    # Your code here\n    pass',
                java: 'import java.util.*;\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n        return 0;\n    }\n}',
                c: 'int lengthOfLongestSubstring(char* s) {\n    // Your code here\n    return 0;\n}',
                cpp: '#include <string>\n#include <unordered_set>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // Your code here\n    return 0;\n}'
            }
        },
        {
            id: 'three-sum',
            type: 'DSA',
            title: '3Sum',
            difficulty: 'Medium',
            description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
            constraints: [
                '3 <= nums.length <= 3000',
                '-10^5 <= nums[i] <= 10^5'
            ],
            examples: [{
                input: 'nums = [-1,0,1,2,-1,-4]',
                output: '[[-1,-1,2],[-1,0,1]]',
                explanation: 'The distinct triplets are [-1,0,1] and [-1,-1,2]'
            }],
            hints: [
                'Sort the array first',
                'Use three pointers approach',
                'Skip duplicates to avoid duplicate triplets'
            ],
            starterCode: {
                python: 'def threeSum(nums):\n    # Your code here\n    pass',
                java: 'import java.util.*;\nclass Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Your code here\n        return new ArrayList<>();\n    }\n}',
                c: '// Return array of arrays\nint** threeSum(int* nums, int numsSize, int* returnSize, int** returnColumnSizes) {\n    // Your code here\n    return NULL;\n}',
                cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> threeSum(vector<int>& nums) {\n    // Your code here\n    return {};\n}'
            }
        },
        {
            id: 'container-with-most-water',
            type: 'DSA',
            title: 'Container With Most Water',
            difficulty: 'Medium',
            description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container that contains the most water.',
            constraints: [
                'n == height.length',
                '2 <= n <= 10^5',
                '0 <= height[i] <= 10^4'
            ],
            examples: [{
                input: 'height = [1,8,6,2,5,4,8,3,7]',
                output: '49',
                explanation: 'The maximum area is between height[1] and height[8]'
            }],
            hints: [
                'Use two pointers from both ends',
                'Move the pointer with smaller height',
                'Calculate area at each step and keep track of maximum'
            ],
            starterCode: {
                python: 'def maxArea(height):\n    # Your code here\n    pass',
                java: 'class Solution {\n    public int maxArea(int[] height) {\n        // Your code here\n        return 0;\n    }\n}',
                c: 'int maxArea(int* height, int heightSize) {\n    // Your code here\n    return 0;\n}',
                cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxArea(vector<int>& height) {\n    // Your code here\n    return 0;\n}'
            }
        },
        {
            id: 'product-of-array-except-self',
            type: 'DSA',
            title: 'Product of Array Except Self',
            difficulty: 'Medium',
            description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].',
            constraints: [
                '2 <= nums.length <= 10^5',
                '-30 <= nums[i] <= 30',
                'The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer'
            ],
            examples: [{
                input: 'nums = [1,2,3,4]',
                output: '[24,12,8,6]',
                explanation: 'For each index, multiply all other elements'
            }],
            hints: [
                'Think about left and right products',
                'First pass: calculate left products',
                'Second pass: calculate right products and multiply with left'
            ],
            starterCode: {
                python: 'def productExceptSelf(nums):\n    # Your code here\n    pass',
                java: 'class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Your code here\n        return new int[nums.length];\n    }\n}',
                c: 'int* productExceptSelf(int* nums, int numsSize, int* returnSize) {\n    // Your code here\n    *returnSize = numsSize;\n    return NULL;\n}',
                cpp: '#include <vector>\nusing namespace std;\n\nvector<int> productExceptSelf(vector<int>& nums) {\n    // Your code here\n    return {};\n}'
            }
        }
    ]
}

export const storySegments = {
    1: {
        title: 'APTITUDE ARENA',
        content: 'Chitti\'s optical sensors scan you intensely. "Human, before we engage in complex algorithms, prove your mental agility. These aptitude challenges will test your logical reasoning, mathematical prowess, and pattern recognition. Only those with sharp minds may proceed. Succeed, and claim the first piece of the victory code: **C**."',
        clue: 'C',
        animation: 'brain-scan'
    },
    2: {
        title: 'CODE CHAOS',
        content: 'The robot\'s circuits spark with electricity. "Impressive cognitive abilities, human. But can you bring order to chaos? My systems have scrambled these code fragments. Reassemble them correctly, make the programs execute flawlessly, and earn the second fragment: **O**. This is where logic meets implementation."',
        clue: 'O',
        animation: 'code-scramble'
    },
    3: {
        title: 'OUTPUT ORACLE',
        content: 'Chitti\'s holographic display shows swirling code patterns. "Remarkable! You possess both intellect and programming intuition. Now for the ultimate test—predict what my algorithms will produce. Trace through each execution path in your mind, foresee the outputs, and claim the third piece: **D**. You are proving worthy of the final challenges."',
        clue: 'D',
        animation: 'prediction-matrix'
    },
    4: {
        title: 'ALGORITHM FORGE',
        content: 'The chamber transforms into a coding arena. "Excellent work, human. Now we enter my true domain—the realm of algorithms and data structures. These are fundamental problems that every programmer must master. Solve these string and array challenges to prove your coding prowess and earn the fourth fragment: **E**."',
        clue: 'E',
        animation: 'algorithm-forge'
    },
    5: {
        title: 'MASTER\'S TRIAL',
        content: 'The final arena materializes with complex algorithmic patterns. "You have impressed me beyond calculation, human. This is the ultimate test—medium-level challenges that separate novices from masters. Conquer these advanced string and array problems, and claim the final fragment: **R**. Complete the word CODER and prove you are truly worthy of victory!"',
        clue: 'R',
        animation: 'masters-trial'
    }
}