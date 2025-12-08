const {
    exec
} = require('child_process');
const fs = require('fs');
const path = require('path');
const {
    promisify
} = require('util');
const execAsync = promisify(exec);

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, {
        recursive: true
    });
}

function findCompiler(compilerName) {
    const commonPaths = ['C:\\MinGW\\bin', 'C:\\mingw64\\bin', 'C:\\msys64\\mingw64\\bin', '/usr/bin', '/usr/local/bin'];
    try {
        require('child_process').execSync(`${compilerName} --version`, {
            stdio: 'ignore'
        });
        return compilerName;
    } catch (e) {
        for (const dir of commonPaths) {
            const fullPath = path.join(dir, compilerName + (process.platform === 'win32' ? '.exe' : ''));
            if (fs.existsSync(fullPath)) return fullPath;
        }
    }
    return null;
}

const gccPath = findCompiler('gcc');
const gppPath = findCompiler('g++');
const pythonPath = findCompiler('python') || findCompiler('python3');
const javacPath = findCompiler('javac');
const javaPath = findCompiler('java');

console.log('Compilers:', {
    gcc: gccPath || 'NOT FOUND',
    gpp: gppPath || 'NOT FOUND',
    python: pythonPath || 'NOT FOUND',
    javac: javacPath || 'NOT FOUND',
    java: javaPath || 'NOT FOUND'
});

const executeJavaScript = async (code, testcases, problemId) => {
    const results = [];
    for (const testcase of [...testcases.visible, ...testcases.hidden]) {
        try {
            // Match function definition, but not in comments (lines starting with //)
            const codeLines = code.split('\n').filter(line => !line.trim().startsWith('//'));
            const codeWithoutComments = codeLines.join('\n');
            const funcMatch = codeWithoutComments.match(/function\s+(\w+)/);
            if (!funcMatch) throw new Error('No function found');

            let fullCode = code;
            let result;

            // Add data structure definitions for specific problems
            if (problemId === 'merge-sorted-lists' || problemId === 'reverse-linked-list' || problemId === 'remove-duplicates-sorted-list') {
                const {
                    list1,
                    list2,
                    head
                } = testcase.input;
                const arr1 = list1 || head || [];
                const arr2 = list2 || [];

                const helperCode = `
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function buildList(arr) {
    if (!arr || arr.length === 0) return null;
    const head = new ListNode(arr[0]);
    let current = head;
    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }
    return head;
}

function listToArray(head) {
    const result = [];
    let current = head;
    while (current) {
        result.push(current.val);
        current = current.next;
    }
    return result;
}

${code}

const l1 = buildList(${JSON.stringify(arr1)});
${problemId === 'merge-sorted-lists' ? `const l2 = buildList(${JSON.stringify(arr2)});` : ''}
const resultNode = ${funcMatch[1]}(l1${problemId === 'merge-sorted-lists' ? ', l2' : ''});
return listToArray(resultNode);
`;
                const func = new Function(helperCode);
                result = func();
            } else if (problemId === 'max-depth-binary-tree') {
                const {
                    root
                } = testcase.input;

                const helperCode = `
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildTree(arr, idx = 0) {
    if (idx >= arr.length || arr[idx] === null) return null;
    const node = new TreeNode(arr[idx]);
    node.left = buildTree(arr, 2*idx+1);
    node.right = buildTree(arr, 2*idx+2);
    return node;
}

${code}

const tree = buildTree(${JSON.stringify(root)});
return ${funcMatch[1]}(tree);
`;
                const func = new Function(helperCode);
                result = func();
            } else {
                // Default execution for simple problems
                const func = new Function(`${code}\nreturn ${funcMatch[1]};`)();
                result = func(...Object.values(testcase.input));
            }

            const passed = JSON.stringify(result) === JSON.stringify(testcase.output);
            results.push({
                passed,
                output: result,
                expected: testcase.output,
                error: passed ? null : `Expected ${JSON.stringify(testcase.output)}, got ${JSON.stringify(result)}`
            });
        } catch (error) {
            results.push({
                passed: false,
                error: error.message
            });
        }
    }
    return {
        results,
        allPassed: results.every(r => r.passed)
    };
};

const executePython = async (code, testcases, problemId) => {
    if (!pythonPath) return {
        error: 'Python not found',
        allPassed: false,
        results: []
    };
    const results = [];
    for (let i = 0; i < [...testcases.visible, ...testcases.hidden].length; i++) {
        const testcase = [...testcases.visible, ...testcases.hidden][i];
        const tempFile = path.join(tempDir, `py_${Date.now()}_${i}.py`);
        try {
            // Match function definition, but not in comments (lines starting with #)
            const codeLines = code.split('\n').filter(line => !line.trim().startsWith('#'));
            const codeWithoutComments = codeLines.join('\n');
            const funcMatch = codeWithoutComments.match(/def\s+(\w+)/);
            if (!funcMatch) throw new Error('No function found');

            let wrapper = '';

            // Add data structure definitions for specific problems
            if (problemId === 'merge-sorted-lists' || problemId === 'reverse-linked-list' || problemId === 'remove-duplicates-sorted-list') {
                const {
                    list1,
                    list2,
                    head
                } = testcase.input;
                const arr1 = list1 || head || [];
                const arr2 = list2 || [];

                wrapper = `import json
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def build_list(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    current = head
    for val in arr[1:]:
        current.next = ListNode(val)
        current = current.next
    return head

def list_to_array(head):
    result = []
    current = head
    while current:
        result.append(current.val)
        current = current.next
    return result

${code}

l1 = build_list(${JSON.stringify(arr1)})
${problemId === 'merge-sorted-lists' ? `l2 = build_list(${JSON.stringify(arr2)})` : ''}
result_node = ${funcMatch[1]}(l1${problemId === 'merge-sorted-lists' ? ', l2' : ''})
result = list_to_array(result_node)
print(json.dumps(result))`;
            } else if (problemId === 'max-depth-binary-tree') {
                const {
                    root
                } = testcase.input;

                // Convert JavaScript array to Python list (null -> None)
                const pythonArray = JSON.stringify(root).replace(/null/g, 'None');

                wrapper = `import json
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr, idx=0):
    if idx >= len(arr) or arr[idx] is None:
        return None
    node = TreeNode(arr[idx])
    node.left = build_tree(arr, 2*idx+1)
    node.right = build_tree(arr, 2*idx+2)
    return node

${code}

tree = build_tree(${pythonArray})
result = ${funcMatch[1]}(tree)
print(json.dumps(result))`;
            } else {
                // Default execution for simple problems
                wrapper = `import json\n${code}\nresult = ${funcMatch[1]}(*${JSON.stringify(Object.values(testcase.input))})\nprint(json.dumps(result))`;
            }

            fs.writeFileSync(tempFile, wrapper);
            const {
                stdout
            } = await execAsync(`"${pythonPath}" "${tempFile}"`, {
                timeout: 5000
            });
            fs.unlinkSync(tempFile);
            const result = JSON.parse(stdout.trim());
            const passed = JSON.stringify(result) === JSON.stringify(testcase.output);
            results.push({
                passed,
                output: result,
                expected: testcase.output,
                error: passed ? null : `Expected ${JSON.stringify(testcase.output)}, got ${JSON.stringify(result)}`
            });
        } catch (error) {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            results.push({
                passed: false,
                error: error.message
            });
        }
    }
    return {
        results,
        allPassed: results.every(r => r.passed)
    };
};

// Helpers to format inputs for C/C++
const formatCArray = (arr) => arr.join(',');
const formatCVectorInit = (arr) => `{${arr.join(',')}}`;
const formatC2DArray = (matrix) => matrix.map(
    row => `{${row.join(',')}}`
).join(',');

const escapeJavaString = (str) => str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const formatJavaIntArray = (arr) => `{${arr.join(',')}}`;
const formatJava2DIntArray = (matrix) => {
    const rows = matrix.map(r => `{${r.join(',')}}`).join(", ");
    return `{${rows}}`;
};

const executeC = async (code, testcases, problemId) => {
    if (!gccPath) return {
        error: 'GCC not found',
        allPassed: false,
        results: []
    };

    const problems = [...testcases.visible, ...testcases.hidden];
    const results = [];

    for (let i = 0; i < problems.length; i++) {
        const testcase = problems[i];
        const ts = Date.now() + i * 100;
        const tempFile = path.join(tempDir, `c_${ts}.c`);
        const exeFile = path.join(tempDir, `c_${ts}${process.platform === 'win32' ? '.exe' : ''}`);

        try {
            let wrapper = '';

            if (problemId === 'two-sum') {
                const inputs = Object.values(testcase.input);
                wrapper = `#include <stdio.h>\n#include <stdlib.h>\n${code}\nint main() {\n  int nums[] = {${inputs[0].join(',')}};\n  int returnSize = 0;\n  int* result = twoSum(nums, ${inputs[0].length}, ${inputs[1]}, &returnSize);\n  printf("[");\n  for (int i = 0; i < returnSize; i++) { printf("%d", result[i]); if (i < returnSize - 1) printf(","); }\n  printf("]");\n  free(result);\n  return 0;\n}`;
            } else if (problemId === 'valid-anagram') {
                const {
                    s,
                    t
                } = testcase.input;
                wrapper = `#include <stdio.h>\n#include <string.h>\n#include <stdbool.h>\n${code}\nint main() {\n  const char* s = "${s}";\n  const char* t = "${t}";\n  bool result = isAnagram((char*)s, (char*)t);\n  printf(result ? "true" : "false");\n  return 0;\n}`;
            } else if (problemId === 'first-unique-char') {
                const {
                    s
                } = testcase.input;
                wrapper = `#include <stdio.h>\n#include <string.h>\n${code}\nint main() {\n  const char* s = "${s}";\n  int result = firstUniqChar((char*)s);\n  printf("%d", result);\n  return 0;\n}`;
            } else if (problemId === 'merge-sorted-lists' || problemId === 'reverse-linked-list' || problemId === 'remove-duplicates-sorted-list') {
                const {
                    list1,
                    list2,
                    head
                } = testcase.input;
                const arr1 = list1 || head || [];
                const arr2 = list2 || [];
                const structDef = `
struct ListNode {
  int val;
  struct ListNode *next;
};
`;
                const buildList = `
struct ListNode* build_list(int arr[], int n) {
  if (n==0) return NULL;
  struct ListNode* head = (struct ListNode*)malloc(sizeof(struct ListNode));
  head->val = arr[0];
  head->next = NULL;
  struct ListNode* cur = head;
  for (int i=1;i<n;i++) {
    cur->next = (struct ListNode*)malloc(sizeof(struct ListNode));
    cur = cur->next;
    cur->val = arr[i];
    cur->next = NULL;
  }
  return head;
}
void print_list(struct ListNode* head) {
  printf("[");
  struct ListNode* cur=head;
  while(cur){ printf("%d", cur->val); if(cur->next) printf(","); cur=cur->next; }
  printf("]");
}
void free_list(struct ListNode* head){ while(head){ struct ListNode* nxt=head->next; free(head); head=nxt; }}
`;
                if (problemId === 'merge-sorted-lists') {
                    wrapper = `#include <stdio.h>\n#include <stdlib.h>\n${structDef}\n${code}\n${buildList}\nint main(){\n  int a1[] = {${arr1.join(',')}}; int n1=${arr1.length};\n  int a2[] = {${arr2.join(',')}}; int n2=${arr2.length};\n  struct ListNode* l1 = build_list(a1,n1);\n  struct ListNode* l2 = build_list(a2,n2);\n  struct ListNode* res = mergeTwoLists(l1,l2);\n  print_list(res);\n  free_list(res);\n  return 0;\n}`;
                } else if (problemId === 'reverse-linked-list') {
                    wrapper = `#include <stdio.h>\n#include <stdlib.h>\n${structDef}\n${code}\n${buildList}\nint main(){\n  int a[] = {${arr1.join(',')}}; int n=${arr1.length};\n  struct ListNode* head = build_list(a,n);\n  struct ListNode* res = reverseList(head);\n  print_list(res);\n  free_list(res);\n  return 0;\n}`;
                } else { // remove-duplicates-sorted-list
                    wrapper = `#include <stdio.h>\n#include <stdlib.h>\n${structDef}\n${code}\n${buildList}\nint main(){\n  int a[] = {${arr1.join(',')}}; int n=${arr1.length};\n  struct ListNode* head = build_list(a,n);\n  struct ListNode* res = deleteDuplicates(head);\n  print_list(res);\n  free_list(res);\n  return 0;\n}`;
                }
            } else if (problemId === 'valid-parentheses') {
                const {
                    s
                } = testcase.input;
                wrapper = `#include <stdio.h>\n#include <string.h>\n#include <stdbool.h>\n${code}\nint main(){\n  const char* s = "${s}";\n  bool res = isValid((char*)s);\n  printf(res ? "true" : "false");\n  return 0;\n}`;
            } else if (problemId === 'climbing-stairs') {
                const {
                    n
                } = testcase.input;
                wrapper = `#include <stdio.h>\n${code}\nint main(){\n  int n = ${n};\n  int res = climbStairs(n);\n  printf("%d", res);\n  return 0;\n}`;
            } else if (problemId === 'binary-search') {
                const {
                    nums,
                    target
                } = testcase.input;
                wrapper = `#include <stdio.h>\n${code}\nint main(){\n  int nums[] = {${nums.join(',')}}; int n=${nums.length}; int target=${target};\n  int res = search(nums, n, target);\n  printf("%d", res);\n  return 0;\n}`;
            } else if (problemId === 'max-depth-binary-tree') {
                const {
                    root
                } = testcase.input;
                const structDef = `
struct TreeNode {
  int val;
  struct TreeNode *left;
  struct TreeNode *right;
};
`;
                const buildTree = `
struct TreeNode* build_tree(int* arr, int n, int idx) {
  if (idx >= n || arr[idx] == -1001) return NULL;
  struct TreeNode* node = (struct TreeNode*)malloc(sizeof(struct TreeNode));
  node->val = arr[idx];
  node->left = build_tree(arr, n, 2*idx+1);
  node->right = build_tree(arr, n, 2*idx+2);
  return node;
}
void free_tree(struct TreeNode* root) {
  if (!root) return;
  free_tree(root->left);
  free_tree(root->right);
  free(root);
}
`;
                const arrStr = root.map(v => v === null ? -1001 : v).join(',');
                wrapper = `#include <stdio.h>\n#include <stdlib.h>\n${structDef}\n${code}\n${buildTree}\nint main(){\n  int arr[] = {${arrStr}}; int n=${root.length};\n  struct TreeNode* tree = build_tree(arr, n, 0);\n  int res = maxDepth(tree);\n  printf("%d", res);\n  free_tree(tree);\n  return 0;\n}`;
            } else if (problemId === 'majority-element') {
                const {
                    nums
                } = testcase.input;
                wrapper = `#include <stdio.h>\n${code}\nint main(){\n  int numsArr[] = {${nums.join(',')}}; int n=${nums.length};\n  int res = majorityElement(numsArr, n);\n  printf("%d", res);\n  return 0;\n}`;
            } else if (problemId === 'contains-duplicate') {
                const {
                    nums
                } = testcase.input;
                wrapper = `#include <stdio.h>\n#include <stdbool.h>\n${code}\nint main(){\n  int numsArr[] = {${nums.join(',')}}; int n=${nums.length};\n  bool res = containsDuplicate(numsArr, n);\n  printf(res ? "true" : "false");\n  return 0;\n}`;
            } else if (problemId === 'max-sum-subarray') {
                const {
                    nums,
                    k
                } = testcase.input;
                wrapper = `#include <stdio.h>\n#include <limits.h>\n${code}\nint main(){\n  int numsArr[] = {${nums.join(',')}}; int n=${nums.length}; int k=${k};\n  int res = maxSumSubarray(numsArr, n, k);\n  printf("%d", res);\n  return 0;\n}`;
            } else if (problemId === 'coin-change') {
                const {
                    coins,
                    amount
                } = testcase.input;
                wrapper = `#include <stdio.h>\n#include <limits.h>\n${code}\nint main(){\n  int coinsArr[] = {${coins.join(',')}}; int n=${coins.length}; int amount=${amount};\n  int res = coinChange(coinsArr, n, amount);\n  printf("%d", res);\n  return 0;\n}`;
            } else if (problemId === 'longest-substring') {
                const {
                    s
                } = testcase.input;
                wrapper = `#include <stdio.h>\n#include <string.h>\n${code}\nint main(){\n  const char* s = "${s}";\n  int res = lengthOfLongestSubstring((char*)s);\n  printf("%d", res);\n  return 0;\n}`;
            } else {
                return {
                    error: `C execution is not configured for problem "${problemId}".`,
                    allPassed: false,
                    results: []
                };
            }

            fs.writeFileSync(tempFile, wrapper);
            await execAsync(`"${gccPath}" "${tempFile}" -o "${exeFile}"`, {
                timeout: 10000
            });
            const {
                stdout
            } = await execAsync(`"${exeFile}"`, {
                timeout: 5000
            });
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);

            const result = JSON.parse(stdout.trim());
            const passed = JSON.stringify(result) === JSON.stringify(testcase.output);
            results.push({
                passed,
                output: result,
                expected: testcase.output,
                error: passed ? null : `Expected ${JSON.stringify(testcase.output)}, got ${JSON.stringify(result)}`
            });
        } catch (error) {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
            results.push({
                passed: false,
                error: error.message
            });
        }
    }

    return {
        results,
        allPassed: results.every(r => r.passed)
    };
};

const executeCPP = async (code, testcases, problemId) => {
    if (!gppPath) return {
        error: 'G++ not found',
        allPassed: false,
        results: []
    };

    const problems = [...testcases.visible, ...testcases.hidden];
    const results = [];

    for (let i = 0; i < problems.length; i++) {
        const testcase = problems[i];
        const ts = Date.now() + i * 100;
        const tempFile = path.join(tempDir, `cpp_${ts}.cpp`);
        const exeFile = path.join(tempDir, `cpp_${ts}${process.platform === 'win32' ? '.exe' : ''}`);

        try {
            let wrapper = '';

            if (problemId === 'two-sum') {
                const inputs = Object.values(testcase.input);
                wrapper = `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n${code}\nint main() {\n  vector<int> nums = {${inputs[0].join(',')}};\n  vector<int> result = twoSum(nums, ${inputs[1]});\n  cout << "[";\n  for (size_t i = 0; i < result.size(); i++) { cout << result[i]; if (i < result.size() - 1) cout << ","; }\n  cout << "]";\n  return 0;\n}`;
            } else if (problemId === 'valid-anagram') {
                const {
                    s,
                    t
                } = testcase.input;
                wrapper = `#include <iostream>\n#include <string>\nusing namespace std;\n${code}\nint main() {\n  string s = "${s}";\n  string t = "${t}";\n  bool result = isAnagram(s, t);\n  cout << (result ? "true" : "false");\n  return 0;\n}`;
            } else if (problemId === 'first-unique-char') {
                const {
                    s
                } = testcase.input;
                wrapper = `#include <iostream>\n#include <string>\nusing namespace std;\n${code}\nint main(){\n  string s = "${s}";\n  int res = firstUniqChar(s);\n  cout << res;\n  return 0;\n}`;
            } else if (problemId === 'merge-sorted-lists' || problemId === 'reverse-linked-list' || problemId === 'remove-duplicates-sorted-list') {
                const {
                    list1,
                    list2,
                    head
                } = testcase.input;
                const arr1 = list1 || head || [];
                const arr2 = list2 || [];
                const structDef = `
struct ListNode {
  int val;
  ListNode *next;
};
`;
                const buildList = `
ListNode* build(const std::vector<int>& arr) {
  if (arr.empty()) return nullptr;
  ListNode* head = new ListNode{arr[0], nullptr};
  ListNode* cur = head;
  for (size_t i=1;i<arr.size();i++) {
    cur->next = new ListNode{arr[i], nullptr};
    cur = cur->next;
  }
  return head;
}
void printList(ListNode* head){
  cout << "[";
  ListNode* cur=head;
  while(cur){ cout << cur->val; if(cur->next) cout << ","; cur=cur->next; }
  cout << "]";
}
void freeList(ListNode* head){ while(head){ ListNode* nxt=head->next; delete head; head=nxt; } }
`;
                if (problemId === 'merge-sorted-lists') {
                    wrapper = `#include <iostream>\n#include <vector>\nusing namespace std;\n${structDef}\n${code}\n${buildList}\nint main(){\n  vector<int> a1 = ${formatCVectorInit(arr1)};\n  vector<int> a2 = ${formatCVectorInit(arr2)};\n  ListNode* l1 = build(a1);\n  ListNode* l2 = build(a2);\n  ListNode* res = mergeTwoLists(l1,l2);\n  printList(res);\n  freeList(res);\n  return 0;\n}`;
                } else if (problemId === 'reverse-linked-list') {
                    wrapper = `#include <iostream>\n#include <vector>\nusing namespace std;\n${structDef}\n${code}\n${buildList}\nint main(){\n  vector<int> a = ${formatCVectorInit(arr1)};\n  ListNode* head = build(a);\n  ListNode* res = reverseList(head);\n  printList(res);\n  freeList(res);\n  return 0;\n}`;
                } else { // remove-duplicates-sorted-list
                    wrapper = `#include <iostream>\n#include <vector>\nusing namespace std;\n${structDef}\n${code}\n${buildList}\nint main(){\n  vector<int> a = ${formatCVectorInit(arr1)};\n  ListNode* head = build(a);\n  ListNode* res = deleteDuplicates(head);\n  printList(res);\n  freeList(res);\n  return 0;\n}`;
                }
            } else if (problemId === 'valid-parentheses') {
                const {
                    s
                } = testcase.input;
                wrapper = `#include <iostream>\n#include <string>\nusing namespace std;\n${code}\nint main(){ string s = "${s}"; bool res = isValid(s); cout << (res ? "true" : "false"); return 0; }`;
            } else if (problemId === 'climbing-stairs') {
                const {
                    n
                } = testcase.input;
                wrapper = `#include <iostream>\nusing namespace std;\n${code}\nint main(){\n  int n = ${n};\n  int res = climbStairs(n);\n  cout << res;\n  return 0;\n}`;
            } else if (problemId === 'binary-search') {
                const {
                    nums,
                    target
                } = testcase.input;
                wrapper = `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main(){ vector<int> nums = ${formatCVectorInit(nums)}; int target=${target}; int res = search(nums, target); cout << res; return 0; }`;
            } else if (problemId === 'max-depth-binary-tree') {
                const {
                    root
                } = testcase.input;
                const structDef = `
struct TreeNode {
  int val;
  TreeNode *left;
  TreeNode *right;
};
`;
                const buildTree = `
TreeNode* build(const vector<int>& arr, int idx) {
  if (idx >= arr.size() || arr[idx] == -1001) return nullptr;
  TreeNode* node = new TreeNode{arr[idx], nullptr, nullptr};
  node->left = build(arr, 2*idx+1);
  node->right = build(arr, 2*idx+2);
  return node;
}
void freeTree(TreeNode* root) {
  if (!root) return;
  freeTree(root->left);
  freeTree(root->right);
  delete root;
}
`;
                const arrStr = root.map(v => v === null ? -1001 : v).join(',');
                wrapper = `#include <iostream>\n#include <vector>\nusing namespace std;\n${structDef}\n${code}\n${buildTree}\nint main(){\n  vector<int> arr = {${arrStr}};\n  TreeNode* tree = build(arr, 0);\n  int res = maxDepth(tree);\n  cout << res;\n  freeTree(tree);\n  return 0;\n}`;
            } else if (problemId === 'majority-element') {
                const {
                    nums
                } = testcase.input;
                wrapper = `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main(){ vector<int> nums = ${formatCVectorInit(nums)}; int res = majorityElement(nums); cout << res; return 0; }`;
            } else if (problemId === 'contains-duplicate') {
                const {
                    nums
                } = testcase.input;
                wrapper = `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main(){ vector<int> nums = ${formatCVectorInit(nums)}; bool res = containsDuplicate(nums); cout << (res ? "true" : "false"); return 0; }`;
            } else if (problemId === 'max-sum-subarray') {
                const {
                    nums,
                    k
                } = testcase.input;
                wrapper = `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main(){ vector<int> nums = ${formatCVectorInit(nums)}; int k=${k}; int res = maxSumSubarray(nums, k); cout << res; return 0; }`;
            } else if (problemId === 'coin-change') {
                const {
                    coins,
                    amount
                } = testcase.input;
                wrapper = `#include <iostream>\n#include <vector>\nusing namespace std;\n${code}\nint main(){ vector<int> coins = ${formatCVectorInit(coins)}; int amount=${amount}; int res = coinChange(coins, amount); cout << res; return 0; }`;
            } else if (problemId === 'longest-substring') {
                const {
                    s
                } = testcase.input;
                wrapper = `#include <iostream>\n#include <string>\nusing namespace std;\n${code}\nint main(){ string s = "${s}"; int res = lengthOfLongestSubstring(s); cout << res; return 0; }`;
            } else {
                return {
                    error: `C++ execution is not configured for problem "${problemId}".`,
                    allPassed: false,
                    results: []
                };
            }

            fs.writeFileSync(tempFile, wrapper);
            await execAsync(`"${gppPath}" "${tempFile}" -o "${exeFile}" -std=c++17`, {
                timeout: 10000
            });
            const {
                stdout
            } = await execAsync(`"${exeFile}"`, {
                timeout: 5000
            });
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);

            const result = JSON.parse(stdout.trim());
            const passed = JSON.stringify(result) === JSON.stringify(testcase.output);
            results.push({
                passed,
                output: result,
                expected: testcase.output,
                error: passed ? null : `Expected ${JSON.stringify(testcase.output)}, got ${JSON.stringify(result)}`
            });
        } catch (error) {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            if (fs.existsSync(exeFile)) fs.unlinkSync(exeFile);
            results.push({
                passed: false,
                error: error.message
            });
        }
    }

    return {
        results,
        allPassed: results.every(r => r.passed)
    };
};

const buildJavaMain = (problemId, testcase) => {
    const {
        input
    } = testcase;
    const lines = [];
    lines.push('  public static void main(String[] args) throws Exception {');

    const printArray = '  private static String arr(int[] a){\n    StringBuilder sb=new StringBuilder(); sb.append("[");\n    for(int i=0;i<a.length;i++){ sb.append(a[i]); if(i+1<a.length) sb.append(","); }\n    sb.append("]"); return sb.toString();\n  }\n';
    const printArray2D = '  private static String arr2d(int[][] a){\n    StringBuilder sb=new StringBuilder(); sb.append("[");\n    for(int i=0;i<a.length;i++){\n      sb.append("[");\n      for(int j=0;j<a[i].length;j++){ sb.append(a[i][j]); if(j+1<a[i].length) sb.append(","); }\n      sb.append("]"); if(i+1<a.length) sb.append(",");\n    }\n    sb.append("]"); return sb.toString();\n  }\n';
    const printQueueJson = '  private static String qjson(java.util.List<Object> out){\n    StringBuilder sb=new StringBuilder(); sb.append("[");\n    for(int i=0;i<out.size();i++){\n      Object v = out.get(i);\n      if(v==null) sb.append("null");\n      else if(v instanceof Boolean) sb.append(((Boolean)v) ? "true" : "false");\n      else sb.append(v.toString());\n      if(i+1<out.size()) sb.append(",");\n    }\n    sb.append("]"); return sb.toString();\n  }\n';
    const listHelpers = '  private static class ListNode { int val; ListNode next; ListNode(){} ListNode(int v){val=v;} ListNode(int v,ListNode n){val=v;next=n;} }\n' +
        '  private static ListNode build(int[] arr){ if(arr.length==0) return null; ListNode h=new ListNode(arr[0]); ListNode c=h; for(int i=1;i<arr.length;i++){ c.next=new ListNode(arr[i]); c=c.next; } return h; }\n' +
        '  private static String listToStr(ListNode head){ StringBuilder sb=new StringBuilder(); sb.append("["); ListNode c=head; while(c!=null){ sb.append(c.val); if(c.next!=null) sb.append(","); c=c.next; } sb.append("]"); return sb.toString(); }\n';

    switch (problemId) {
        case 'two-sum': {
            const nums = formatJavaIntArray(input.nums);
            lines.unshift(printArray);
            lines.push(`    int[] nums = ${nums}; int target = ${input.target};`);
            lines.push('    int[] res = new Solution().twoSum(nums, target);');
            lines.push('    System.out.print(arr(res));');
            break;
        }
        case 'valid-anagram': {
            const s = escapeJavaString(input.s);
            const t = escapeJavaString(input.t);
            lines.push(`    String s = "${s}"; String t = "${t}";`);
            lines.push('    boolean res = new Solution().isAnagram(s, t);');
            lines.push('    System.out.print(res ? "true" : "false");');
            break;
        }
        case 'first-unique-char': {
            const s = escapeJavaString(input.s);
            lines.push(`    String s = "${s}";`);
            lines.push('    int res = new Solution().firstUniqChar(s);');
            lines.push('    System.out.print(res);');
            break;
        }
        case 'valid-parentheses': {
            const s = escapeJavaString(input.s);
            lines.push(`    String s = "${s}";`);
            lines.push('    boolean res = new Solution().isValid(s);');
            lines.push('    System.out.print(res ? "true" : "false");');
            break;
        }
        case 'binary-search': {
            const nums = formatJavaIntArray(input.nums);
            lines.push(`    int[] nums = ${nums}; int target=${input.target};`);
            lines.push('    int res = new Solution().search(nums, target);');
            lines.push('    System.out.print(res);');
            break;
        }
        case 'contains-duplicate': {
            const nums = formatJavaIntArray(input.nums);
            lines.push(`    int[] nums = ${nums};`);
            lines.push('    boolean res = new Solution().containsDuplicate(nums);');
            lines.push('    System.out.print(res ? "true" : "false");');
            break;
        }
        case 'max-sum-subarray': {
            const nums = formatJavaIntArray(input.nums);
            lines.push(`    int[] nums = ${nums}; int k=${input.k};`);
            lines.push('    int res = new Solution().maxSumSubarray(nums, k);');
            lines.push('    System.out.print(res);');
            break;
        }
        case 'coin-change': {
            const coins = formatJavaIntArray(input.coins);
            lines.push(`    int[] coins = ${coins}; int amount=${input.amount};`);
            lines.push('    int res = new Solution().coinChange(coins, amount);');
            lines.push('    System.out.print(res);');
            break;
        }
        case 'longest-substring': {
            const s = escapeJavaString(input.s);
            lines.push(`    String s = "${s}";`);
            lines.push('    int res = new Solution().lengthOfLongestSubstring(s);');
            lines.push('    System.out.print(res);');
            break;
        }
        case 'majority-element': {
            const nums = formatJavaIntArray(input.nums);
            lines.push(`    int[] nums = ${nums};`);
            lines.push('    int res = new Solution().majorityElement(nums);');
            lines.push('    System.out.print(res);');
            break;
        }
        case 'merge-sorted-lists': {
            const list1 = formatJavaIntArray(input.list1 || []);
            const list2 = formatJavaIntArray(input.list2 || []);
            const solutionListHelpers = '  private static Solution.ListNode build(int[] arr, Solution sol){ if(arr.length==0) return null; Solution.ListNode h=sol.new ListNode(arr[0]); Solution.ListNode c=h; for(int i=1;i<arr.length;i++){ c.next=sol.new ListNode(arr[i]); c=c.next; } return h; }\n' +
                '  private static String listToStr(Solution.ListNode head){ StringBuilder sb=new StringBuilder(); sb.append("["); Solution.ListNode c=head; while(c!=null){ sb.append(c.val); if(c.next!=null) sb.append(","); c=c.next; } sb.append("]"); return sb.toString(); }\n';
            lines.unshift(solutionListHelpers);
            lines.push(`    int[] a1 = ${list1};`);
            lines.push(`    int[] a2 = ${list2};`);
            lines.push('    Solution sol = new Solution();');
            lines.push('    Solution.ListNode l1 = build(a1, sol); Solution.ListNode l2 = build(a2, sol);');
            lines.push('    Solution.ListNode res = sol.mergeTwoLists(l1, l2);');
            lines.push('    System.out.print(listToStr(res));');
            break;
        }
        case 'reverse-linked-list': {
            const head = formatJavaIntArray(input.head || []);
            const solutionListHelpers = '  private static Solution.ListNode build(int[] arr, Solution sol){ if(arr.length==0) return null; Solution.ListNode h=sol.new ListNode(arr[0]); Solution.ListNode c=h; for(int i=1;i<arr.length;i++){ c.next=sol.new ListNode(arr[i]); c=c.next; } return h; }\n' +
                '  private static String listToStr(Solution.ListNode head){ StringBuilder sb=new StringBuilder(); sb.append("["); Solution.ListNode c=head; while(c!=null){ sb.append(c.val); if(c.next!=null) sb.append(","); c=c.next; } sb.append("]"); return sb.toString(); }\n';
            lines.unshift(solutionListHelpers);
            lines.push(`    int[] a = ${head};`);
            lines.push('    Solution sol = new Solution();');
            lines.push('    Solution.ListNode h = build(a, sol);');
            lines.push('    Solution.ListNode res = sol.reverseList(h);');
            lines.push('    System.out.print(listToStr(res));');
            break;
        }
        case 'remove-duplicates-sorted-list': {
            const head = formatJavaIntArray(input.head || []);
            const solutionListHelpers = '  private static Solution.ListNode build(int[] arr, Solution sol){ if(arr.length==0) return null; Solution.ListNode h=sol.new ListNode(arr[0]); Solution.ListNode c=h; for(int i=1;i<arr.length;i++){ c.next=sol.new ListNode(arr[i]); c=c.next; } return h; }\n' +
                '  private static String listToStr(Solution.ListNode head){ StringBuilder sb=new StringBuilder(); sb.append("["); Solution.ListNode c=head; while(c!=null){ sb.append(c.val); if(c.next!=null) sb.append(","); c=c.next; } sb.append("]"); return sb.toString(); }\n';
            lines.unshift(solutionListHelpers);
            lines.push(`    int[] a = ${head};`);
            lines.push('    Solution sol = new Solution();');
            lines.push('    Solution.ListNode h = build(a, sol);');
            lines.push('    Solution.ListNode res = sol.deleteDuplicates(h);');
            lines.push('    System.out.print(listToStr(res));');
            break;
        }
        case 'climbing-stairs': {
            lines.push(`    int n = ${input.n};`);
            lines.push('    int res = new Solution().climbStairs(n);');
            lines.push('    System.out.print(res);');
            break;
        }
        case 'max-depth-binary-tree': {
            const solutionTreeHelpers = '  private static Solution.TreeNode buildTree(Integer[] arr, int idx, Solution sol){ if(idx>=arr.length||arr[idx]==null) return null; Solution.TreeNode n=sol.new TreeNode(arr[idx]); n.left=buildTree(arr,2*idx+1,sol); n.right=buildTree(arr,2*idx+2,sol); return n; }\n';
            lines.unshift(solutionTreeHelpers);
            const arrStr = input.root.map(v => v === null ? 'null' : v).join(',');
            lines.push(`    Integer[] arr = {${arrStr}};`);
            lines.push('    Solution sol = new Solution();');
            lines.push('    Solution.TreeNode tree = buildTree(arr, 0, sol);');
            lines.push('    int res = sol.maxDepth(tree);');
            lines.push('    System.out.print(res);');
            break;
        }
        default:
            return null;
    }

    lines.push('  }');
    return lines.join('\n');
};

const executeJava = async (code, testcases, problemId) => {
    if (!javacPath || !javaPath) {
        return {
            error: 'Java compiler/runtime not found',
            allPassed: false,
            results: []
        };
    }

    const problems = [...testcases.visible, ...testcases.hidden];
    const results = [];

    for (let i = 0; i < problems.length; i++) {
        const testcase = problems[i];
        const mainBody = buildJavaMain(problemId, testcase);
        if (!mainBody) {
            return {
                error: `Java execution is not configured for problem "${problemId}".`,
                allPassed: false,
                results: []
            };
        }

        const ts = Date.now() + i * 100;
        const className = `Temp_${ts}`;
        const tempFile = path.join(tempDir, `${className}.java`);
        const source = `import java.util.*;\n${code}\nclass ${className} {\n${mainBody}\n}\n`;
        fs.writeFileSync(tempFile, source);

        try {
            await execAsync(`"${javacPath}" "${tempFile}" -d "${tempDir}"`, {
                timeout: 10000
            });
            const {
                stdout
            } = await execAsync(`"${javaPath}" -cp "${tempDir}" ${className}`, {
                timeout: 5000
            });
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            const classFile = path.join(tempDir, `${className}.class`);
            if (fs.existsSync(classFile)) fs.unlinkSync(classFile);

            const out = stdout.trim();
            let result;
            try {
                result = JSON.parse(out);
            } catch (e) {
                // attempt to convert Java-friendly output to JSON
                const normalized = out
                    .replace(/true/g, 'true')
                    .replace(/false/g, 'false')
                    .replace(/null/g, 'null');
                result = JSON.parse(normalized);
            }
            const passed = JSON.stringify(result) === JSON.stringify(testcase.output);
            results.push({
                passed,
                output: result,
                expected: testcase.output,
                error: passed ? null : `Expected ${JSON.stringify(testcase.output)}, got ${JSON.stringify(result)}`
            });
        } catch (error) {
            if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
            results.push({
                passed: false,
                error: error.message
            });
        }
    }

    return {
        results,
        allPassed: results.every(r => r.passed)
    };
};

const executeCode = async (code, language, problemId, testcases) => {
    try {
        if (language === 'javascript') return await executeJavaScript(code, testcases, problemId);
        if (language === 'python') return await executePython(code, testcases, problemId);
        if (language === 'c') return await executeC(code, testcases, problemId);
        if (language === 'cpp') return await executeCPP(code, testcases, problemId);
        if (language === 'java') return await executeJava(code, testcases, problemId);
        throw new Error('Unsupported language');
    } catch (error) {
        return {
            error: error.message,
            allPassed: false,
            results: []
        };
    }
};

module.exports = {
    executeCode
};