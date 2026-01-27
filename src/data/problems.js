export const problems = {
    // Round 1: Racing Intelligence MCQs (10 Questions)
    1: [{
            id: 'logical-reasoning-1',
            type: 'MCQ',
            title: 'Racing Sequence Analysis',
            question: 'What comes next in the lap time sequence: 2, 6, 12, 20, 30, ?',
            options: ['40', '42', '44', '46'],
            correct: 1, // 42
            explanation: 'The lap time differences are 4, 6, 8, 10, 12... (increasing by 2 each time)',
            difficulty: 'Easy',
            timeLimit: 60
        },
        {
            id: 'mathematical-aptitude-1',
            type: 'MCQ',
            title: 'Racing Speed Calculation',
            question: 'A racing car travels 240 km in 3 hours. What is its average speed in m/s?',
            options: ['22.22 m/s', '20 m/s', '80 m/s', '13.33 m/s'],
            correct: 0, // 22.22 m/s
            explanation: '240 km / 3 hours = 80 km/h = 80 × (1000/3600) = 22.22 m/s',
            difficulty: 'Medium',
            timeLimit: 90
        },
        {
            id: 'pattern-recognition-1',
            type: 'MCQ',
            title: 'Telemetry Data Pattern',
            question: 'In binary telemetry, what is 1011 + 1101?',
            options: ['11000', '10111', '11001', '10110'],
            correct: 0, // 11000
            explanation: '1011 (11) + 1101 (13) = 11000 (24 in decimal)',
            difficulty: 'Medium',
            timeLimit: 75
        },
        {
            id: 'logical-reasoning-2',
            type: 'MCQ',
            title: 'Pit Radio Code Breaking',
            question: 'If RACING is written as SBDJOH, how is DRIVER written?',
            options: ['ESJWFS', 'ESJWFR', 'ESJWFN', 'ESJWFO'],
            correct: 0, // ESJWFS
            explanation: 'Each letter is shifted by +1 in the alphabet',
            difficulty: 'Easy',
            timeLimit: 60
        },
        {
            id: 'mathematical-aptitude-2',
            type: 'MCQ',
            title: 'Championship Probability',
            question: 'What is the probability of getting at least one pole position in 3 qualifying attempts?',
            options: ['1/8', '3/8', '7/8', '1/2'],
            correct: 2, // 7/8
            explanation: 'P(at least one pole) = 1 - P(no poles) = 1 - (1/2)³ = 7/8',
            difficulty: 'Hard',
            timeLimit: 120
        },
        {
            id: 'logical-reasoning-3',
            type: 'MCQ',
            title: 'Pit Stop Logic',
            question: 'If it takes 5 pit crews 5 minutes to service 5 cars, how long does it take 100 pit crews to service 100 cars?',
            options: ['5 minutes', '20 minutes', '100 minutes', '500 minutes'],
            correct: 0, // 5 minutes
            explanation: 'Each pit crew services 1 car in 5 minutes, so 100 crews service 100 cars in 5 minutes',
            difficulty: 'Medium',
            timeLimit: 90
        },
        {
            id: 'pattern-recognition-2',
            type: 'MCQ',
            title: 'Lap Time Series',
            question: 'Find the missing lap time: 1, 4, 9, 16, ?, 36',
            options: ['20', '25', '30', '32'],
            correct: 1, // 25
            explanation: 'Perfect squares: 1², 2², 3², 4², 5², 6²',
            difficulty: 'Easy',
            timeLimit: 45
        },
        {
            id: 'mathematical-aptitude-3',
            type: 'MCQ',
            title: 'Championship Points Percentage',
            question: 'A driver\'s points increased by 20% to reach 144. What were the original points?',
            options: ['120', '115', '125', '130'],
            correct: 0, // 120
            explanation: 'Let x be original points. x + 0.2x = 144, so 1.2x = 144, x = 120',
            difficulty: 'Medium',
            timeLimit: 75
        },
        {
            id: 'logical-reasoning-4',
            type: 'MCQ',
            title: 'Track Navigation Sense',
            question: 'You drive 10m North, then 10m East, then 10m South. How far are you from the starting grid?',
            options: ['0m', '10m', '20m', '30m'],
            correct: 1, // 10m
            explanation: 'You end up 10m East of your starting grid position',
            difficulty: 'Easy',
            timeLimit: 60
        },
        {
            id: 'pattern-recognition-3',
            type: 'MCQ',
            title: 'Racing Strategy Thinking',
            question: 'In a sorted lap time array [1,3,5,7,9], how many comparisons does binary search need to find 7?',
            options: ['1', '2', '3', '4'],
            correct: 2, // 3
            explanation: 'Compare with 5 (middle), then 7 (right), then found',
            difficulty: 'Hard',
            timeLimit: 90
        }
    ],

    // Round 2: Technical Setup Alignment (3 Programs)
    2: [{
            id: 'bubble-sort-fix',
            type: 'CODE_ALIGN',
            title: 'Fix Racing Data Sorting',
            description: 'Arrange the jumbled setup lines to create a working lap time sorting algorithm',
            language: 'python',
            jumbledLines: [
                'def sort_lap_times(times):',
                '    return times',
                '        for j in range(0, n-i-1):',
                '    n = len(times)',
                '            if times[j] > times[j+1]:',
                '    for i in range(n):',
                '                times[j], times[j+1] = times[j+1], times[j]'
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
            title: 'Fix Championship Points Calculator',
            description: 'Rearrange the lines to create a working recursive championship points function',
            language: 'javascript',
            jumbledLines: [
                'function calculatePoints(races) {',
                '    return races * calculatePoints(races - 1);',
                '    if (races <= 1) {',
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
            title: 'Fix Lap Time Search',
            description: 'Organize the scrambled binary search implementation for finding lap times',
            language: 'python',
            jumbledLines: [
                'def find_lap_time(times, target):',
                '    while left <= right:',
                '        if times[mid] == target:',
                '            return mid',
                '    left, right = 0, len(times) - 1',
                '        mid = (left + right) // 2',
                '        elif times[mid] < target:',
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

    // Round 3: Race Strategy Prediction (5 Questions)
    3: [{
            id: 'loop-output-1',
            type: 'OUTPUT_PREDICT',
            title: 'Pit Stop Loop Analysis',
            code: `for lap in range(3):
    for pit_stop in range(lap):
        print(lap, pit_stop, end=' ')
    print()`,
            question: 'What will be the output of this racing simulation code?',
            options: [
                '0 0\n1 0\n2 0 2 1',
                '\n1 0\n2 0 2 1',
                '0\n1 0\n2 0 2 1',
                'Nothing will be printed'
            ],
            correct: 1,
            explanation: 'lap=0: inner loop doesn\'t run (range(0) is empty), prints newline\nlap=1: prints "1 0" then newline\nlap=2: prints "2 0 2 1" then newline',
            difficulty: 'Medium',
            timeLimit: 120
        },
        {
            id: 'recursion-output-1',
            type: 'OUTPUT_PREDICT',
            title: 'Championship Points Recursion',
            code: `def calculate_points(position):
    if position <= 1:
        return 1
    return position + calculate_points(position-2)

print(calculate_points(5))`,
            question: 'What will this championship points function output?',
            options: ['9', '8', '15', '6'],
            correct: 0, // 9
            explanation: 'calculate_points(5) = 5 + calculate_points(3) = 5 + (3 + calculate_points(1)) = 5 + (3 + 1) = 9',
            difficulty: 'Hard',
            timeLimit: 150
        },
        {
            id: 'array-manipulation-1',
            type: 'OUTPUT_PREDICT',
            title: 'Lap Time Data Operations',
            code: `lap_times = [1, 2, 3, 4, 5]
lap_times[1:4] = [10]
print(lap_times)`,
            question: 'What will be printed?',
            options: [
                '[1, 10, 5]',
                '[1, 10, 4, 5]',
                '[10, 2, 3, 4]',
                '[1, 2, 10, 4, 5]'
            ],
            correct: 0, // [1, 10, 5]
            explanation: 'lap_times[1:4] replaces elements at indices 1, 2, 3 with [10], so [1, 2, 3, 4, 5] becomes [1, 10, 5]',
            difficulty: 'Medium',
            timeLimit: 90
        },
        {
            id: 'string-manipulation-1',
            type: 'OUTPUT_PREDICT',
            title: 'Driver Name Slicing',
            code: `driver = "HAMILTON"
result = driver[1::2] + driver[::2]
print(result)`,
            question: 'What will be the output?',
            options: ['AMLTOH', 'AMLTON', 'HMILTN', 'AMLHTO'],
            correct: 1, // AMLTON
            explanation: 'driver[1::2] = "AML" (every 2nd char starting from index 1)\ndriver[::2] = "HMI" (every 2nd char from start)\nResult: "AML" + "TON" = "AMLTON"',
            difficulty: 'Hard',
            timeLimit: 120
        },
        {
            id: 'dictionary-output-1',
            type: 'OUTPUT_PREDICT',
            title: 'Championship Standings Magic',
            code: `standings = {'driver1': 1, 'driver2': 2}
standings.update({'driver1': 3, 'driver3': 4})
print(sum(standings.values()))`,
            question: 'What will be printed?',
            options: ['6', '7', '9', '10'],
            correct: 2, // 9
            explanation: 'After update: standings = {"driver1": 3, "driver2": 2, "driver3": 4}\nsum(standings.values()) = 3 + 2 + 4 = 9',
            difficulty: 'Easy',
            timeLimit: 75
        }
    ],

    // Round 4: Championship Racing Challenges (String & Array) - 5 Questions
    4: [{
            id: 'two-sum',
            type: 'DSA',
            title: 'Pit Crew Pairing',
            difficulty: 'Easy',
            description: 'Given an array of pit crew response times and a target total time, return indices of the two crew members whose times add up to the target.',
            constraints: [
                '2 <= response_times.length <= 10^4',
                '-10^9 <= response_times[i] <= 10^9',
                '-10^9 <= target <= 10^9',
                'Only one valid pairing exists'
            ],
            examples: [{
                    input: 'response_times = [2,7,11,15], target = 9',
                    output: '[0,1]',
                    explanation: 'response_times[0] + response_times[1] == 9, so we return [0, 1]'
                },
                {
                    input: 'response_times = [3,2,4], target = 6',
                    output: '[1,2]',
                    explanation: 'response_times[1] + response_times[2] == 6'
                }
            ],
            hints: [
                'Use a hash map to store crew times you\'ve seen and their indices',
                'For each crew time, check if (target - time) exists in your hash map'
            ],
            starterCode: {
                python: 'def pitCrewPairing(response_times, target):\n    # Your racing strategy here\n    pass',
                java: 'import java.util.*;\nclass Solution {\n    public int[] pitCrewPairing(int[] response_times, int target) {\n        // Your racing strategy here\n        return new int[]{};\n    }\n}',
                c: '// Return array of two crew indices\nint* pitCrewPairing(int* response_times, int timesSize, int target, int* returnSize) {\n    // Your racing strategy here\n    *returnSize = 2;\n    return NULL;\n}',
                cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> pitCrewPairing(vector<int>& response_times, int target) {\n    // Your racing strategy here\n    return {};\n}'
            }
        },
        {
            id: 'valid-anagram',
            type: 'DSA',
            title: 'Driver Name Anagram',
            difficulty: 'Easy',
            description: 'Given two driver names s and t, return true if t is an anagram of s, and false otherwise.',
            constraints: [
                '1 <= s.length, t.length <= 5 * 10^4',
                's and t consist of lowercase English letters'
            ],
            examples: [{
                    input: 's = "hamilton", t = "tonmalih"',
                    output: 'true',
                    explanation: 'Both driver names contain the same characters'
                },
                {
                    input: 's = "vettel", t = "button"',
                    output: 'false',
                    explanation: 'Different characters'
                }
            ],
            hints: [
                'Count the frequency of each character in both driver names',
                'Compare the frequency maps or sort both names and compare'
            ],
            starterCode: {
                python: 'def isDriverAnagram(s, t):\n    # Your racing strategy here\n    pass',
                java: 'class Solution {\n    public boolean isDriverAnagram(String s, String t) {\n        // Your racing strategy here\n        return false;\n    }\n}',
                c: '#include <stdbool.h>\n#include <string.h>\nbool isDriverAnagram(char* s, char* t) {\n    // Your racing strategy here\n    return false;\n}',
                cpp: '#include <string>\n#include <algorithm>\nusing namespace std;\n\nbool isDriverAnagram(string s, string t) {\n    // Your racing strategy here\n    return false;\n}'
            }
        },
        {
            id: 'contains-duplicate',
            type: 'DSA',
            title: 'Duplicate Lap Times',
            difficulty: 'Easy',
            description: 'Given an array of lap times, return true if any lap time appears at least twice in the array.',
            constraints: [
                '1 <= lap_times.length <= 10^5',
                '-10^9 <= lap_times[i] <= 10^9'
            ],
            examples: [{
                    input: 'lap_times = [1,2,3,1]',
                    output: 'true',
                    explanation: 'Lap time 1 appears twice'
                },
                {
                    input: 'lap_times = [1,2,3,4]',
                    output: 'false',
                    explanation: 'All lap times are distinct'
                }
            ],
            hints: [
                'Use a hash set to track seen lap times',
                'Return true as soon as you find a duplicate'
            ],
            starterCode: {
                python: 'def containsDuplicateLaps(lap_times):\n    # Your racing strategy here\n    pass',
                java: 'import java.util.*;\nclass Solution {\n    public boolean containsDuplicateLaps(int[] lap_times) {\n        // Your racing strategy here\n        return false;\n    }\n}',
                c: '#include <stdbool.h>\nbool containsDuplicateLaps(int* lap_times, int timesSize) {\n    // Your racing strategy here\n    return false;\n}',
                cpp: '#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nbool containsDuplicateLaps(vector<int>& lap_times) {\n    // Your racing strategy here\n    return false;\n}'
            }
        },
        {
            id: 'reverse-string',
            type: 'DSA',
            title: 'Reverse Pit Radio Message',
            difficulty: 'Easy',
            description: 'Write a function that reverses a pit radio message. The input message is given as an array of characters.',
            constraints: [
                '1 <= message.length <= 10^5',
                'message[i] is a printable ascii character'
            ],
            examples: [{
                input: 'message = ["B","O","X","B","O","X"]',
                output: '["X","O","B","X","O","B"]',
                explanation: 'Reverse the radio message in-place'
            }],
            hints: [
                'Use two pointers approach',
                'Swap characters from both ends moving towards center'
            ],
            starterCode: {
                python: 'def reverseRadioMessage(message):\n    # Your racing strategy here\n    pass',
                java: 'class Solution {\n    public void reverseRadioMessage(char[] message) {\n        // Your racing strategy here\n    }\n}',
                c: 'void reverseRadioMessage(char* message, int messageSize) {\n    // Your racing strategy here\n}',
                cpp: '#include <vector>\nusing namespace std;\n\nvoid reverseRadioMessage(vector<char>& message) {\n    // Your racing strategy here\n}'
            }
        },
        {
            id: 'valid-palindrome',
            type: 'DSA',
            title: 'Valid Racing Circuit',
            difficulty: 'Easy',
            description: 'A circuit name is valid if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
            constraints: [
                '1 <= circuit_name.length <= 2 * 10^5',
                'circuit_name consists only of printable ASCII characters'
            ],
            examples: [{
                    input: 'circuit_name = "A man, a plan, a canal: Panama"',
                    output: 'true',
                    explanation: '"amanaplanacanalpanama" is a valid circuit'
                },
                {
                    input: 'circuit_name = "race a car"',
                    output: 'false',
                    explanation: '"raceacar" is not a valid circuit'
                }
            ],
            hints: [
                'Use two pointers from both ends',
                'Skip non-alphanumeric characters',
                'Compare characters in lowercase'
            ],
            starterCode: {
                python: 'def isValidCircuit(circuit_name):\n    # Your racing strategy here\n    pass',
                java: 'class Solution {\n    public boolean isValidCircuit(String circuit_name) {\n        // Your racing strategy here\n        return false;\n    }\n}',
                c: '#include <stdbool.h>\n#include <ctype.h>\nbool isValidCircuit(char* circuit_name) {\n    // Your racing strategy here\n    return false;\n}',
                cpp: '#include <string>\n#include <cctype>\nusing namespace std;\n\nbool isValidCircuit(string circuit_name) {\n    // Your racing strategy here\n    return false;\n}'
            }
        }
    ],

    // Round 5: Championship Finals (String & Array) - 5 Questions
    5: [{
            id: 'group-anagrams',
            type: 'DSA',
            title: 'Group Racing Teams',
            difficulty: 'Medium',
            description: 'Given an array of team names, group the anagrams together. You can return the answer in any order.',
            constraints: [
                '1 <= team_names.length <= 10^4',
                '0 <= team_names[i].length <= 100',
                'team_names[i] consists of lowercase English letters'
            ],
            examples: [{
                input: 'team_names = ["ferrari","irarref","mclaren","nerlacm","redbull","llubder"]',
                output: '[["ferrari","irarref"],["mclaren","nerlacm"],["redbull","llubder"]]',
                explanation: 'Group team names that are anagrams of each other'
            }],
            hints: [
                'Use sorted team name as key in hash map',
                'Group team names with same sorted characters'
            ],
            starterCode: {
                python: 'def groupRacingTeams(team_names):\n    # Your championship strategy here\n    pass',
                java: 'import java.util.*;\nclass Solution {\n    public List<List<String>> groupRacingTeams(String[] team_names) {\n        // Your championship strategy here\n        return new ArrayList<>();\n    }\n}',
                c: '// Return array of arrays\nchar*** groupRacingTeams(char** team_names, int namesSize, int* returnSize, int** returnColumnSizes) {\n    // Your championship strategy here\n    return NULL;\n}',
                cpp: '#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<string>> groupRacingTeams(vector<string>& team_names) {\n    // Your championship strategy here\n    return {};\n}'
            }
        },
        {
            id: 'longest-substring-without-repeating',
            type: 'DSA',
            title: 'Longest Clean Racing Sector',
            difficulty: 'Medium',
            description: 'Given a racing telemetry string, find the length of the longest sector without repeating data points.',
            constraints: [
                '0 <= telemetry.length <= 5 * 10^4',
                'telemetry consists of English letters, digits, symbols and spaces'
            ],
            examples: [{
                    input: 'telemetry = "abcabcbb"',
                    output: '3',
                    explanation: 'The answer is "abc", with length 3'
                },
                {
                    input: 'telemetry = "bbbbb"',
                    output: '1',
                    explanation: 'The answer is "b", with length 1'
                }
            ],
            hints: [
                'Use sliding window technique',
                'Use a hash set to track data points in current sector',
                'Expand sector when no duplicates, shrink when duplicate found'
            ],
            starterCode: {
                python: 'def longestCleanSector(telemetry):\n    # Your championship strategy here\n    pass',
                java: 'import java.util.*;\nclass Solution {\n    public int longestCleanSector(String telemetry) {\n        // Your championship strategy here\n        return 0;\n    }\n}',
                c: 'int longestCleanSector(char* telemetry) {\n    // Your championship strategy here\n    return 0;\n}',
                cpp: '#include <string>\n#include <unordered_set>\nusing namespace std;\n\nint longestCleanSector(string telemetry) {\n    // Your championship strategy here\n    return 0;\n}'
            }
        },
        {
            id: 'three-sum',
            type: 'DSA',
            title: 'Triple Championship Points',
            difficulty: 'Medium',
            description: 'Given an array of championship points, return all the triplets [points[i], points[j], points[k]] such that i != j, i != k, and j != k, and points[i] + points[j] + points[k] == 0.',
            constraints: [
                '3 <= points.length <= 3000',
                '-10^5 <= points[i] <= 10^5'
            ],
            examples: [{
                input: 'points = [-1,0,1,2,-1,-4]',
                output: '[[-1,-1,2],[-1,0,1]]',
                explanation: 'The distinct triplets are [-1,0,1] and [-1,-1,2]'
            }],
            hints: [
                'Sort the points array first',
                'Use three pointers approach',
                'Skip duplicates to avoid duplicate triplets'
            ],
            starterCode: {
                python: 'def tripleChampionshipPoints(points):\n    # Your championship strategy here\n    pass',
                java: 'import java.util.*;\nclass Solution {\n    public List<List<Integer>> tripleChampionshipPoints(int[] points) {\n        // Your championship strategy here\n        return new ArrayList<>();\n    }\n}',
                c: '// Return array of arrays\nint** tripleChampionshipPoints(int* points, int pointsSize, int* returnSize, int** returnColumnSizes) {\n    // Your championship strategy here\n    return NULL;\n}',
                cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> tripleChampionshipPoints(vector<int>& points) {\n    // Your championship strategy here\n    return {};\n}'
            }
        },
        {
            id: 'container-with-most-water',
            type: 'DSA',
            title: 'Maximum Fuel Capacity',
            difficulty: 'Medium',
            description: 'You are given an array of fuel tank heights. Find two tanks that together can hold the most fuel.',
            constraints: [
                'n == tank_heights.length',
                '2 <= n <= 10^5',
                '0 <= tank_heights[i] <= 10^4'
            ],
            examples: [{
                input: 'tank_heights = [1,8,6,2,5,4,8,3,7]',
                output: '49',
                explanation: 'The maximum fuel capacity is between tank_heights[1] and tank_heights[8]'
            }],
            hints: [
                'Use two pointers from both ends',
                'Move the pointer with smaller tank height',
                'Calculate fuel capacity at each step and keep track of maximum'
            ],
            starterCode: {
                python: 'def maxFuelCapacity(tank_heights):\n    # Your championship strategy here\n    pass',
                java: 'class Solution {\n    public int maxFuelCapacity(int[] tank_heights) {\n        // Your championship strategy here\n        return 0;\n    }\n}',
                c: 'int maxFuelCapacity(int* tank_heights, int heightsSize) {\n    // Your championship strategy here\n    return 0;\n}',
                cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxFuelCapacity(vector<int>& tank_heights) {\n    // Your championship strategy here\n    return 0;\n}'
            }
        },
        {
            id: 'product-of-array-except-self',
            type: 'DSA',
            title: 'Championship Points Except Self',
            difficulty: 'Medium',
            description: 'Given an array of race results, return an array where each element is the product of all other race results except the current one.',
            constraints: [
                '2 <= race_results.length <= 10^5',
                '-30 <= race_results[i] <= 30',
                'The product of any prefix or suffix of race_results is guaranteed to fit in a 32-bit integer'
            ],
            examples: [{
                input: 'race_results = [1,2,3,4]',
                output: '[24,12,8,6]',
                explanation: 'For each race, multiply all other results'
            }],
            hints: [
                'Think about left and right race products',
                'First pass: calculate left race products',
                'Second pass: calculate right race products and multiply with left'
            ],
            starterCode: {
                python: 'def championshipPointsExceptSelf(race_results):\n    # Your championship strategy here\n    pass',
                java: 'class Solution {\n    public int[] championshipPointsExceptSelf(int[] race_results) {\n        // Your championship strategy here\n        return new int[race_results.length];\n    }\n}',
                c: 'int* championshipPointsExceptSelf(int* race_results, int resultsSize, int* returnSize) {\n    // Your championship strategy here\n    *returnSize = resultsSize;\n    return NULL;\n}',
                cpp: '#include <vector>\nusing namespace std;\n\nvector<int> championshipPointsExceptSelf(vector<int>& race_results) {\n    // Your championship strategy here\n    return {};\n}'
            }
        }
    ]
}

export const storySegments = {
    1: {
        title: 'MONACO GRAND PRIX - QUALIFYING SESSION',
        content: 'The F1 Racing Academy\'s chief engineer reviews your credentials. "Driver, before we unleash you on the championship circuits, prove your racing intellect. These qualifying challenges will test your strategic thinking, mathematical precision, and pattern recognition. Only those with championship mindset may proceed. Succeed, and claim the first piece of the championship code: **T**."',
        clue: 'T',
        animation: 'qualifying-scan'
    },
    2: {
        title: 'SILVERSTONE TECHNICAL CHALLENGE',
        content: 'The pit crew chief signals urgently. "Outstanding qualifying performance, driver! But can you handle technical difficulties under pressure? Our race engineers have scrambled these setup configurations. Reassemble them correctly, make the systems run flawlessly, and earn the second fragment: **R**. This is where strategy meets execution."',
        clue: 'R',
        animation: 'technical-scramble'
    },
    3: {
        title: 'MONZA STRATEGY PREDICTION',
        content: 'The race strategist displays complex telemetry data. "Remarkable! You possess both speed and racing intuition. Now for the ultimate test—predict what our race simulations will produce. Trace through each strategic scenario in your mind, foresee the race outcomes, and claim the third piece: **A**. You are proving worthy of the championship battles."',
        clue: 'A',
        animation: 'strategy-matrix'
    },
    4: {
        title: 'SPA-FRANCORCHAMPS RACING FORGE',
        content: 'The championship arena transforms into a high-speed battleground. "Excellent racecraft, driver. Now we enter the true domain of champions—the realm of racing strategies and data structures. These are fundamental challenges that every champion must master. Conquer these racing scenarios to prove your championship prowess and earn the fourth fragment: **C**."',
        clue: 'C',
        animation: 'racing-forge'
    },
    5: {
        title: 'SUZUKA CHAMPIONSHIP DECIDER',
        content: 'The final championship arena materializes with complex racing patterns. "You have impressed me beyond calculation, driver. This is the ultimate test—championship-level challenges that separate rookies from legends. Master these advanced racing scenarios, and claim the final fragment: **E**. Complete the word TRACE and prove you are truly worthy of the championship title!"',
        clue: 'E',
        animation: 'championship-trial'
    }
}