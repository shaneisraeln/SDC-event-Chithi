export const problems = {
    1: [{
        id: 'two-sum',
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
            javascript: 'function twoSum(nums, target) {\n    // Your code here\n}',
            python: 'def twoSum(nums, target):\n    # Your code here\n    pass',
            c: '// Return array of two indices\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // Your code here\n    return NULL;\n}',
            cpp: '#include <vector>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}',
            java: 'import java.util.*;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}'
        }
    }],
    2: [{
            id: 'valid-anagram',
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
                javascript: 'function isAnagram(s, t) {\n    // Your code here\n}',
                c: '#include <stdbool.h>\n#include <stddef.h>\n#include <string.h>\nbool isAnagram(char* s, char* t) {\n    // Your code here\n    return false;\n}',
                cpp: '#include <string>\nusing namespace std;\nbool isAnagram(string s, string t) {\n    // Your code here\n    return false;\n}',
                java: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        // Your code here\n        return false;\n    }\n}'
            }
        },
        {
            id: 'first-unique-char',
            title: 'First Unique Character in a String',
            difficulty: 'Easy',
            description: 'Given a string s, find the first non-repeating character and return its index. If it does not exist, return -1.',
            constraints: [
                '1 <= s.length <= 10^5',
                's consists of only lowercase English letters'
            ],
            examples: [{
                    input: 's = "leetcode"',
                    output: '0',
                    explanation: 'The first unique character is "l" at index 0'
                },
                {
                    input: 's = "loveleetcode"',
                    output: '2',
                    explanation: 'The first unique character is "v" at index 2'
                }
            ],
            hints: [
                'Use a hash map to count character frequencies',
                'Iterate through the string again to find the first character with count 1'
            ],
            starterCode: {
                python: 'def firstUniqChar(s):\n    # Your code here\n    pass',
                javascript: 'function firstUniqChar(s) {\n    // Your code here\n}',
                c: 'int firstUniqChar(char* s) {\n    // Your code here\n    return -1;\n}',
                cpp: '#include <string>\nusing namespace std;\nint firstUniqChar(string s) {\n    // Your code here\n    return -1;\n}',
                java: 'class Solution {\n    public int firstUniqChar(String s) {\n        // Your code here\n        return -1;\n    }\n}'
            }
        }
    ],
    3: [{
            id: 'merge-sorted-lists',
            title: 'Merge Two Sorted Lists',
            difficulty: 'Easy',
            description: 'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
            constraints: [
                'The number of nodes in both lists is in the range [0, 50]',
                '-100 <= Node.val <= 100',
                'Both lists are sorted in non-decreasing order'
            ],
            examples: [{
                input: 'list1 = [1,2,4], list2 = [1,3,4]',
                output: '[1,1,2,3,4,4]',
                explanation: 'Merge both sorted lists'
            }],
            hints: [
                'Use a dummy node to simplify edge cases',
                'Compare values from both lists and attach the smaller one'
            ],
            starterCode: {
                python: 'def mergeTwoLists(list1, list2):\n    # Your code here\n    pass',
                javascript: 'function mergeTwoLists(list1, list2) {\n    // Your code here\n}',
                c: '/* struct ListNode is already defined:\nstruct ListNode {\n    int val;\n    struct ListNode *next;\n};\n*/\n\nstruct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {\n    // Your code here\n    return NULL;\n}',
                cpp: 'struct ListNode {\n    int val;\n    ListNode *next;\n};\nListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Your code here\n    return nullptr;\n}',
                java: 'class Solution {\n    public class ListNode {\n        int val;\n        ListNode next;\n        ListNode() {}\n        ListNode(int val) { this.val = val; }\n        ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n    }\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Your code here\n        return null;\n    }\n}'
            }
        },
        {
            id: 'reverse-linked-list',
            title: 'Reverse Linked List',
            difficulty: 'Easy',
            description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
            constraints: [
                'The number of nodes in the list is the range [0, 5000]',
                '-5000 <= Node.val <= 5000'
            ],
            examples: [{
                input: 'head = [1,2,3,4,5]',
                output: '[5,4,3,2,1]',
                explanation: 'Reverse the linked list'
            }],
            hints: [
                'Use three pointers: prev, current, and next',
                'Iterate through the list and reverse the pointers'
            ],
            starterCode: {
                python: 'def reverseList(head):\n    # Your code here\n    pass',
                javascript: 'function reverseList(head) {\n    // Your code here\n}',
                c: '/* struct ListNode is already defined:\nstruct ListNode {\n    int val;\n    struct ListNode *next;\n};\n*/\n\nstruct ListNode* reverseList(struct ListNode* head) {\n    // Your code here\n    return NULL;\n}',
                cpp: 'struct ListNode {\n    int val;\n    ListNode *next;\n};\nListNode* reverseList(ListNode* head) {\n    // Your code here\n    return nullptr;\n}',
                java: 'class Solution {\n    public class ListNode {\n        int val;\n        ListNode next;\n        ListNode() {}\n        ListNode(int val) { this.val = val; }\n        ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n    }\n    public ListNode reverseList(ListNode head) {\n        // Your code here\n        return null;\n    }\n}'
            }
        },
        {
            id: 'remove-duplicates-sorted-list',
            title: 'Remove Duplicates From Sorted List',
            difficulty: 'Easy',
            description: 'Given the head of a sorted linked list, delete all duplicates such that each element appears only once.',
            constraints: [
                'The number of nodes in the list is in the range [0, 300]',
                '-100 <= Node.val <= 100',
                'The list is guaranteed to be sorted in ascending order'
            ],
            examples: [{
                input: 'head = [1,1,2]',
                output: '[1,2]',
                explanation: 'Remove duplicate 1'
            }],
            hints: [
                'Iterate through the list comparing current and next nodes',
                'Skip nodes with duplicate values'
            ],
            starterCode: {
                python: 'def deleteDuplicates(head):\n    # Your code here\n    pass',
                javascript: 'function deleteDuplicates(head) {\n    // Your code here\n}',
                c: '/* struct ListNode is already defined:\nstruct ListNode {\n    int val;\n    struct ListNode *next;\n};\n*/\n\nstruct ListNode* deleteDuplicates(struct ListNode* head) {\n    // Your code here\n    return head;\n}',
                cpp: 'struct ListNode {\n    int val;\n    ListNode *next;\n};\nListNode* deleteDuplicates(ListNode* head) {\n    // Your code here\n    return head;\n}',
                java: 'class Solution {\n    public class ListNode {\n        int val;\n        ListNode next;\n        ListNode() {}\n        ListNode(int val) { this.val = val; }\n        ListNode(int val, ListNode next) { this.val = val; this.next = next; }\n    }\n    public ListNode deleteDuplicates(ListNode head) {\n        // Your code here\n        return head;\n    }\n}'
            }
        }
    ],
    4: [{
            id: 'valid-parentheses',
            title: 'Valid Parentheses',
            difficulty: 'Easy',
            description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
            constraints: [
                '1 <= s.length <= 10^4',
                's consists of parentheses only \'()[]{}\'.'
            ],
            examples: [{
                    input: 's = "()"',
                    output: 'true',
                    explanation: 'Valid parentheses'
                },
                {
                    input: 's = "()[]{}"',
                    output: 'true',
                    explanation: 'All brackets are properly closed'
                }
            ],
            hints: [
                'Use a stack to track opening brackets',
                'When you see a closing bracket, check if it matches the top of the stack'
            ],
            starterCode: {
                python: 'def isValid(s):\n    # Your code here\n    pass',
                javascript: 'function isValid(s) {\n    // Your code here\n}',
                c: '#include <stdbool.h>\n#include <stddef.h>\nbool isValid(char* s) {\n    // Your code here\n    return false;\n}',
                cpp: '#include <string>\nusing namespace std;\nbool isValid(string s) {\n    // Your code here\n    return false;\n}',
                java: 'class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n}'
            }
        },
        {
            id: 'climbing-stairs',
            title: 'Climbing Stairs',
            difficulty: 'Easy',
            description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
            constraints: [
                '1 <= n <= 45'
            ],
            examples: [{
                    input: 'n = 2',
                    output: '2',
                    explanation: 'There are two ways: 1+1 or 2'
                },
                {
                    input: 'n = 3',
                    output: '3',
                    explanation: 'There are three ways: 1+1+1, 1+2, or 2+1'
                }
            ],
            hints: [
                'This is a Fibonacci sequence problem',
                'Think about how many ways to reach step n from step n-1 and n-2',
                'Use dynamic programming or iterative approach'
            ],
            starterCode: {
                python: 'def climbStairs(n):\n    # Your code here\n    pass',
                javascript: 'function climbStairs(n) {\n    // Your code here\n}',
                c: 'int climbStairs(int n) {\n    // Your code here\n    return 0;\n}',
                cpp: 'int climbStairs(int n) {\n    // Your code here\n    return 0;\n}',
                java: 'class Solution {\n    public int climbStairs(int n) {\n        // Your code here\n        return 0;\n    }\n}'
            }
        },
        {
            id: 'binary-search',
            title: 'Binary Search',
            difficulty: 'Easy',
            description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.',
            constraints: [
                '1 <= nums.length <= 10^4',
                '-10^4 < nums[i], target < 10^4',
                'All integers in nums are unique',
                'nums is sorted in ascending order'
            ],
            examples: [{
                input: 'nums = [-1,0,3,5,9,12], target = 9',
                output: '4',
                explanation: '9 exists in nums and its index is 4'
            }],
            hints: [
                'Use two pointers: left and right',
                'Compare middle element with target and adjust pointers'
            ],
            starterCode: {
                python: 'def search(nums, target):\n    # Your code here\n    pass',
                javascript: 'function search(nums, target) {\n    // Your code here\n}',
                c: 'int search(int* nums, int numsSize, int target) {\n    // Your code here\n    return -1;\n}',
                cpp: '#include <vector>\nusing namespace std;\nint search(vector<int>& nums, int target) {\n    // Your code here\n    return -1;\n}',
                java: 'class Solution {\n    public int search(int[] nums, int target) {\n        // Your code here\n        return -1;\n    }\n}'
            }
        },
        {
            id: 'max-depth-binary-tree',
            title: 'Maximum Depth of Binary Tree',
            difficulty: 'Easy',
            description: 'Given the root of a binary tree, return its maximum depth. The maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
            constraints: [
                'The number of nodes in the tree is in the range [0, 10^4]',
                '-100 <= Node.val <= 100'
            ],
            examples: [{
                    input: 'root = [3,9,20,null,null,15,7]',
                    output: '3',
                    explanation: 'The tree has depth 3 (root -> 20 -> 15 or 7)'
                },
                {
                    input: 'root = [1,null,2]',
                    output: '2',
                    explanation: 'The tree has depth 2'
                }
            ],
            hints: [
                'Use recursion to find the depth of left and right subtrees',
                'The depth is 1 + max(left depth, right depth)',
                'Base case: if node is null, return 0'
            ],
            starterCode: {
                python: 'def maxDepth(root):\n    # Your code here\n    pass',
                javascript: 'function maxDepth(root) {\n    // Your code here\n}',
                c: '/* struct TreeNode is already defined:\nstruct TreeNode {\n    int val;\n    struct TreeNode *left;\n    struct TreeNode *right;\n};\n*/\n\nint maxDepth(struct TreeNode* root) {\n    // Your code here\n    return 0;\n}',
                cpp: 'struct TreeNode {\n    int val;\n    TreeNode *left;\n    TreeNode *right;\n};\nint maxDepth(TreeNode* root) {\n    // Your code here\n    return 0;\n}',
                java: 'class Solution {\n    public class TreeNode {\n        int val;\n        TreeNode left;\n        TreeNode right;\n        TreeNode() {}\n        TreeNode(int val) { this.val = val; }\n        TreeNode(int val, TreeNode left, TreeNode right) {\n            this.val = val;\n            this.left = left;\n            this.right = right;\n        }\n    }\n    public int maxDepth(TreeNode root) {\n        // Your code here\n        return 0;\n    }\n}'
            }
        }
    ],
    5: [{
            id: 'majority-element',
            title: 'Majority Element',
            difficulty: 'Easy',
            description: 'Given an array nums of size n, return the majority element. The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.',
            constraints: [
                'n == nums.length',
                '1 <= n <= 5 * 10^4',
                '-10^9 <= nums[i] <= 10^9'
            ],
            examples: [{
                    input: 'nums = [3,2,3]',
                    output: '3',
                    explanation: '3 appears 2 times out of 3'
                },
                {
                    input: 'nums = [2,2,1,1,1,2,2]',
                    output: '2',
                    explanation: '2 appears 4 times out of 7'
                }
            ],
            hints: [
                'Use a hash map to count occurrences',
                'Or try Boyer-Moore Voting Algorithm for O(1) space',
                'The majority element appears more than n/2 times'
            ],
            starterCode: {
                python: 'def majorityElement(nums):\n    # Your code here\n    pass',
                javascript: 'function majorityElement(nums) {\n    // Your code here\n}',
                c: 'int majorityElement(int* nums, int numsSize) {\n    // Your code here\n    return 0;\n}',
                cpp: '#include <vector>\nusing namespace std;\nint majorityElement(vector<int>& nums) {\n    // Your code here\n    return 0;\n}',
                java: 'import java.util.*;\nclass Solution {\n    public int majorityElement(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}'
            }
        },
        {
            id: 'contains-duplicate',
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
            }],
            hints: [
                'Use a hash set to track seen numbers',
                'Return true as soon as you find a duplicate'
            ],
            starterCode: {
                python: 'def containsDuplicate(nums):\n    # Your code here\n    pass',
                javascript: 'function containsDuplicate(nums) {\n    // Your code here\n}',
                c: '#include <stdbool.h>\nbool containsDuplicate(int* nums, int numsSize) {\n    // Your code here\n    return false;\n}',
                cpp: '#include <vector>\nusing namespace std;\nbool containsDuplicate(vector<int>& nums) {\n    // Your code here\n    return false;\n}',
                java: 'import java.util.*;\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Your code here\n        return false;\n    }\n}'
            }
        },
        {
            id: 'max-sum-subarray',
            title: 'Maximum Sum Subarray (Sliding Window)',
            difficulty: 'Medium',
            description: 'Given an array of integers and a number k, find the maximum sum of a subarray of size k.',
            constraints: [
                '1 <= nums.length <= 10^5',
                '1 <= k <= nums.length',
                '-10^4 <= nums[i] <= 10^4'
            ],
            examples: [{
                input: 'nums = [2,1,5,1,3,2], k = 3',
                output: '9',
                explanation: 'Subarray [5,1,3] has maximum sum 9'
            }],
            hints: [
                'Use sliding window technique',
                'Calculate initial window sum, then slide by removing first and adding next element'
            ],
            starterCode: {
                python: 'def maxSumSubarray(nums, k):\n    # Your code here\n    pass',
                javascript: 'function maxSumSubarray(nums, k) {\n    // Your code here\n}',
                c: 'int maxSumSubarray(int* nums, int numsSize, int k) {\n    // Your code here\n    return 0;\n}',
                cpp: '#include <vector>\nusing namespace std;\nint maxSumSubarray(vector<int>& nums, int k) {\n    // Your code here\n    return 0;\n}',
                java: 'class Solution {\n    public int maxSumSubarray(int[] nums, int k) {\n        // Your code here\n        return 0;\n    }\n}'
            }
        },
        {
            id: 'coin-change',
            title: 'Coin Change (Minimum Coins)',
            difficulty: 'Medium',
            description: 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins needed to make up that amount.',
            constraints: [
                '1 <= coins.length <= 12',
                '1 <= coins[i] <= 2^31 - 1',
                '0 <= amount <= 10^4'
            ],
            examples: [{
                input: 'coins = [1,2,5], amount = 11',
                output: '3',
                explanation: '11 = 5 + 5 + 1'
            }],
            hints: [
                'Use dynamic programming',
                'dp[i] represents minimum coins needed for amount i'
            ],
            starterCode: {
                python: 'def coinChange(coins, amount):\n    # Your code here\n    pass',
                javascript: 'function coinChange(coins, amount) {\n    // Your code here\n}',
                c: 'int coinChange(int* coins, int coinsSize, int amount) {\n    // Your code here\n    return -1;\n}',
                cpp: '#include <vector>\nusing namespace std;\nint coinChange(vector<int>& coins, int amount) {\n    // Your code here\n    return -1;\n}',
                java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Your code here\n        return -1;\n    }\n}'
            }
        },
        {
            id: 'longest-substring',
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
            }],
            hints: [
                'Use sliding window with a hash set',
                'Expand window when no duplicates, shrink when duplicate found'
            ],
            starterCode: {
                python: 'def lengthOfLongestSubstring(s):\n    # Your code here\n    pass',
                javascript: 'function lengthOfLongestSubstring(s) {\n    // Your code here\n}',
                c: 'int lengthOfLongestSubstring(char* s) {\n    // Your code here\n    return 0;\n}',
                cpp: '#include <string>\nusing namespace std;\nint lengthOfLongestSubstring(string s) {\n    // Your code here\n    return 0;\n}',
                java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n        return 0;\n    }\n}'
            }
        }
    ]
}

export const storySegments = {
    1: {
        title: 'The Awakening',
        content: 'You stand before Chitti, the advanced robot with unmatched computational power. "Human," Chitti\'s voice resonates, "you dare challenge my intelligence? Very well. Solve my puzzles, and I shall reveal the first piece of the code: the letter **T**. Fail, and remain in ignorance forever."',
        clue: 'T',
        animation: 'hologram-flicker'
    },
    2: {
        title: 'The Pattern Recognition',
        content: 'Chitti\'s eyes glow brighter. "Impressive, human. You possess basic logic. But can you recognize patterns as I do? My neural networks process millions of permutations per second. Prove your worth, and the letter **R** shall be yours."',
        clue: 'R',
        animation: 'neural-pulse'
    },
    3: {
        title: 'The Data Structures',
        content: 'The robot\'s circuits hum with energy. "You continue to surprise me. But now we enter my domain—data structures, the foundation of all computation. Navigate these linked pathways, and claim the letter **A**. This is where most humans fail."',
        clue: 'A',
        animation: 'circuit-flow'
    },
    4: {
        title: 'The Algorithm Mastery',
        content: 'Chitti\'s holographic display shows complex algorithms flowing. "Remarkable! You think like a machine. But can you master the algorithms that power my very existence? Stacks, queues, searches—solve them all, and the letter **C** is yours. We are nearing the end."',
        clue: 'C',
        animation: 'algorithm-cascade'
    },
    5: {
        title: 'The Final Test',
        content: 'The room darkens. Chitti\'s voice becomes solemn. "Human, you have proven yourself worthy. This final challenge will test everything—frequency analysis, optimization, dynamic thinking. Succeed, and the final letter **E** completes your code. The truth awaits those who can TRACE the path to victory."',
        clue: 'E',
        animation: 'energy-surge'
    }
}