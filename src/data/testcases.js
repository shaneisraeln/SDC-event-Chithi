export const testcases = {
    'two-sum': {
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
                output: [1, 3]
            },
            {
                input: {
                    nums: [-1, -2, -3, -4, -5],
                    target: -8
                },
                output: [2, 4]
            }
        ]
    },
    'valid-anagram': {
        visible: [{
                input: {
                    s: 'anagram',
                    t: 'nagaram'
                },
                output: true
            },
            {
                input: {
                    s: 'rat',
                    t: 'car'
                },
                output: false
            }
        ],
        hidden: [{
                input: {
                    s: 'a',
                    t: 'a'
                },
                output: true
            },
            {
                input: {
                    s: 'ab',
                    t: 'ba'
                },
                output: true
            },
            {
                input: {
                    s: 'abc',
                    t: 'def'
                },
                output: false
            }
        ]
    },
    'first-unique-char': {
        visible: [{
                input: {
                    s: 'leetcode'
                },
                output: 0
            },
            {
                input: {
                    s: 'loveleetcode'
                },
                output: 2
            }
        ],
        hidden: [{
                input: {
                    s: 'aabb'
                },
                output: -1
            },
            {
                input: {
                    s: 'z'
                },
                output: 0
            },
            {
                input: {
                    s: 'aabbccddeff'
                },
                output: 8
            }
        ]
    },
    'merge-sorted-lists': {
        visible: [{
                input: {
                    list1: [1, 2, 4],
                    list2: [1, 3, 4]
                },
                output: [1, 1, 2, 3, 4, 4]
            },
            {
                input: {
                    list1: [],
                    list2: [0]
                },
                output: [0]
            }
        ],
        hidden: [{
                input: {
                    list1: [],
                    list2: []
                },
                output: []
            },
            {
                input: {
                    list1: [1],
                    list2: [2]
                },
                output: [1, 2]
            },
            {
                input: {
                    list1: [1, 3, 5],
                    list2: [2, 4, 6]
                },
                output: [1, 2, 3, 4, 5, 6]
            }
        ]
    },
    'reverse-linked-list': {
        visible: [{
                input: {
                    head: [1, 2, 3, 4, 5]
                },
                output: [5, 4, 3, 2, 1]
            },
            {
                input: {
                    head: [1, 2]
                },
                output: [2, 1]
            }
        ],
        hidden: [{
                input: {
                    head: []
                },
                output: []
            },
            {
                input: {
                    head: [1]
                },
                output: [1]
            },
            {
                input: {
                    head: [1, 2, 3]
                },
                output: [3, 2, 1]
            }
        ]
    },
    'remove-duplicates-sorted-list': {
        visible: [{
                input: {
                    head: [1, 1, 2]
                },
                output: [1, 2]
            },
            {
                input: {
                    head: [1, 1, 2, 3, 3]
                },
                output: [1, 2, 3]
            }
        ],
        hidden: [{
                input: {
                    head: []
                },
                output: []
            },
            {
                input: {
                    head: [1]
                },
                output: [1]
            },
            {
                input: {
                    head: [1, 1, 1]
                },
                output: [1]
            }
        ]
    },
    'valid-parentheses': {
        visible: [{
                input: {
                    s: '()'
                },
                output: true
            },
            {
                input: {
                    s: '()[]{}'
                },
                output: true
            },
            {
                input: {
                    s: '(]'
                },
                output: false
            }
        ],
        hidden: [{
                input: {
                    s: '([)]'
                },
                output: false
            },
            {
                input: {
                    s: '{[]}'
                },
                output: true
            },
            {
                input: {
                    s: '((('
                },
                output: false
            }
        ]
    },
    'climbing-stairs': {
        visible: [{
                input: {
                    n: 2
                },
                output: 2
            },
            {
                input: {
                    n: 3
                },
                output: 3
            }
        ],
        hidden: [{
                input: {
                    n: 1
                },
                output: 1
            },
            {
                input: {
                    n: 5
                },
                output: 8
            },
            {
                input: {
                    n: 10
                },
                output: 89
            }
        ]
    },
    'binary-search': {
        visible: [{
                input: {
                    nums: [-1, 0, 3, 5, 9, 12],
                    target: 9
                },
                output: 4
            },
            {
                input: {
                    nums: [-1, 0, 3, 5, 9, 12],
                    target: 2
                },
                output: -1
            }
        ],
        hidden: [{
                input: {
                    nums: [5],
                    target: 5
                },
                output: 0
            },
            {
                input: {
                    nums: [1, 2, 3, 4, 5],
                    target: 1
                },
                output: 0
            },
            {
                input: {
                    nums: [1, 2, 3, 4, 5],
                    target: 5
                },
                output: 4
            }
        ]
    },
    'max-depth-binary-tree': {
        visible: [{
                input: {
                    root: [3, 9, 20, null, null, 15, 7]
                },
                output: 3
            },
            {
                input: {
                    root: [1, null, 2]
                },
                output: 2
            }
        ],
        hidden: [{
                input: {
                    root: []
                },
                output: 0
            },
            {
                input: {
                    root: [1]
                },
                output: 1
            },
            {
                input: {
                    root: [1, 2, 3, 4, 5]
                },
                output: 3
            }
        ]
    },
    'majority-element': {
        visible: [{
                input: {
                    nums: [3, 2, 3]
                },
                output: 3
            },
            {
                input: {
                    nums: [2, 2, 1, 1, 1, 2, 2]
                },
                output: 2
            }
        ],
        hidden: [{
                input: {
                    nums: [1]
                },
                output: 1
            },
            {
                input: {
                    nums: [6, 5, 5]
                },
                output: 5
            },
            {
                input: {
                    nums: [1, 1, 1, 2, 2, 3, 3, 1, 1]
                },
                output: 1
            }
        ]
    },
    'contains-duplicate': {
        visible: [{
                input: {
                    nums: [1, 2, 3, 1]
                },
                output: true
            },
            {
                input: {
                    nums: [1, 2, 3, 4]
                },
                output: false
            }
        ],
        hidden: [{
                input: {
                    nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]
                },
                output: true
            },
            {
                input: {
                    nums: [1]
                },
                output: false
            }
        ]
    },
    'max-sum-subarray': {
        visible: [{
                input: {
                    nums: [2, 1, 5, 1, 3, 2],
                    k: 3
                },
                output: 9
            },
            {
                input: {
                    nums: [2, 3, 4, 1, 5],
                    k: 2
                },
                output: 7
            }
        ],
        hidden: [{
                input: {
                    nums: [1, 4, 2, 10, 23, 3, 1, 0, 20],
                    k: 4
                },
                output: 39
            },
            {
                input: {
                    nums: [-1, -2, -3, -4],
                    k: 2
                },
                output: -3
            }
        ]
    },
    'coin-change': {
        visible: [{
                input: {
                    coins: [1, 2, 5],
                    amount: 11
                },
                output: 3
            },
            {
                input: {
                    coins: [2],
                    amount: 3
                },
                output: -1
            }
        ],
        hidden: [{
                input: {
                    coins: [1],
                    amount: 0
                },
                output: 0
            },
            {
                input: {
                    coins: [1, 2, 5],
                    amount: 100
                },
                output: 20
            },
            {
                input: {
                    coins: [186, 419, 83, 408],
                    amount: 6249
                },
                output: 20
            }
        ]
    },
    'longest-substring': {
        visible: [{
                input: {
                    s: 'abcabcbb'
                },
                output: 3
            },
            {
                input: {
                    s: 'bbbbb'
                },
                output: 1
            }
        ],
        hidden: [{
                input: {
                    s: 'pwwkew'
                },
                output: 3
            },
            {
                input: {
                    s: ''
                },
                output: 0
            },
            {
                input: {
                    s: 'dvdf'
                },
                output: 3
            }
        ]
    },
    'reverse-string': {
        visible: [{
                input: {
                    s: ['h', 'e', 'l', 'l', 'o']
                },
                output: ['o', 'l', 'l', 'e', 'h']
            },
            {
                input: {
                    s: ['H', 'a', 'n', 'n', 'a', 'h']
                },
                output: ['h', 'a', 'n', 'n', 'a', 'H']
            }
        ],
        hidden: [{
                input: {
                    s: ['a']
                },
                output: ['a']
            },
            {
                input: {
                    s: ['a', 'b']
                },
                output: ['b', 'a']
            },
            {
                input: {
                    s: ['1', '2', '3', '4', '5']
                },
                output: ['5', '4', '3', '2', '1']
            }
        ]
    },
    'valid-palindrome': {
        visible: [{
                input: {
                    s: 'A man, a plan, a canal: Panama'
                },
                output: true
            },
            {
                input: {
                    s: 'race a car'
                },
                output: false
            }
        ],
        hidden: [{
                input: {
                    s: ' '
                },
                output: true
            },
            {
                input: {
                    s: 'a'
                },
                output: true
            },
            {
                input: {
                    s: 'Madam'
                },
                output: true
            }
        ]
    },
    'group-anagrams': {
        visible: [{
                input: {
                    strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat']
                },
                output: [
                    ['eat', 'tea', 'ate'],
                    ['tan', 'nat'],
                    ['bat']
                ]
            },
            {
                input: {
                    strs: ['']
                },
                output: [
                    ['']
                ]
            }
        ],
        hidden: [{
                input: {
                    strs: ['a']
                },
                output: [
                    ['a']
                ]
            },
            {
                input: {
                    strs: ['abc', 'bca', 'cab', 'xyz']
                },
                output: [
                    ['abc', 'bca', 'cab'],
                    ['xyz']
                ]
            },
            {
                input: {
                    strs: ['ab', 'ba', 'abc', 'cba']
                },
                output: [
                    ['ab', 'ba'],
                    ['abc', 'cba']
                ]
            }
        ]
    },
    'three-sum': {
        visible: [{
                input: {
                    nums: [-1, 0, 1, 2, -1, -4]
                },
                output: [
                    [-1, -1, 2],
                    [-1, 0, 1]
                ]
            },
            {
                input: {
                    nums: [0, 1, 1]
                },
                output: []
            }
        ],
        hidden: [{
                input: {
                    nums: [0, 0, 0]
                },
                output: [
                    [0, 0, 0]
                ]
            },
            {
                input: {
                    nums: [-2, 0, 1, 1, 2]
                },
                output: [
                    [-2, 0, 2],
                    [-2, 1, 1]
                ]
            },
            {
                input: {
                    nums: [1, 2, -2, -1]
                },
                output: []
            }
        ]
    },
    'container-with-most-water': {
        visible: [{
                input: {
                    height: [1, 8, 6, 2, 5, 4, 8, 3, 7]
                },
                output: 49
            },
            {
                input: {
                    height: [1, 1]
                },
                output: 1
            }
        ],
        hidden: [{
                input: {
                    height: [1, 2, 1]
                },
                output: 2
            },
            {
                input: {
                    height: [2, 3, 4, 5, 18, 17, 6]
                },
                output: 17
            },
            {
                input: {
                    height: [1, 2, 4, 3]
                },
                output: 4
            }
        ]
    },
    'product-of-array-except-self': {
        visible: [{
                input: {
                    nums: [1, 2, 3, 4]
                },
                output: [24, 12, 8, 6]
            },
            {
                input: {
                    nums: [-1, 1, 0, -3, 3]
                },
                output: [0, 0, 9, 0, 0]
            }
        ],
        hidden: [{
                input: {
                    nums: [2, 3]
                },
                output: [3, 2]
            },
            {
                input: {
                    nums: [1, 0]
                },
                output: [0, 1]
            },
            {
                input: {
                    nums: [5, 2, 3, 4]
                },
                output: [24, 60, 40, 30]
            }
        ]
    },
    'longest-substring-without-repeating': {
        visible: [{
                input: {
                    s: 'abcabcbb'
                },
                output: 3
            },
            {
                input: {
                    s: 'bbbbb'
                },
                output: 1
            }
        ],
        hidden: [{
                input: {
                    s: 'pwwkew'
                },
                output: 3
            },
            {
                input: {
                    s: ''
                },
                output: 0
            },
            {
                input: {
                    s: 'dvdf'
                },
                output: 3
            }
        ]
    }
}