# Code Prix: The Ultimate Lap

A fully functional F1-themed challenge web application where users compete in a championship-style coding competition through 5 racing circuits with reactive UI elements, multi-language autograder, and cinematic F1 story modals.

## 🆕 Latest Updates (v3.0)

### 🏎️ **F1 Racing Theme Transformation**
- ✨ **Complete visual overhaul** from robot theme to Formula 1 racing
- 🏁 **F1 Driver Avatar** with team colors and racing numbers  
- 🏆 **Racing terminology** throughout the application
- ⚡ **F1 animations** and speed effects
- 🏁 **Championship progression** system
- 🏎️ **Racing circuit backgrounds** and track elements

### 💻 **Technical Enhancements**
- ✨ **Full Multi-Language Support**: JavaScript, Python, C, C++, and Java
- 🔧 **Complete Compiler Integration** with proper struct/class definitions
- 🎯 **Simplified Problem Set** with easier, more approachable challenges
- 🌳 **Data Structure Problems** including Linked Lists and Binary Trees
- 🐛 **Bug Fixes** for C compilation issues and struct redefinitions

## Features

### 🎨 UI/UX
- **Modern F1 racing interface** with red, yellow, and black F1 palette
- **Racing-themed glow effects** and speed elements
- **Cursor-reactive elements**:
  - Cursor-hover glow on cards and tiles
  - Particle trail following cursor
  - Parallax background layers
  - Element tilt on hover (3D transform)
  - Ripple effects on button clicks
- **F1 Driver Avatar** with team colors and racing numbers
- **Accessibility**: Motion reduction toggle
- **Fully responsive** design

### 🏁 Gameplay
- **5 racing circuits** with increasing difficulty
- **28 coding challenges** total across all circuits
- **No login required** - progress stored in localStorage
- **F1 story modals** after each circuit completion
- **Championship clue collection** system (T-R-A-C-E)
- **Final championship password challenge**

### 💻 Code Editor
- **Monaco editor** integration
- **5 Programming Languages**: JavaScript, Python, C, C++, Java
- **Language-specific syntax highlighting**
- **Visible and hidden testcases**
- **Real-time autograding** for all languages
- **Hint system** with penalties
- **Proper struct/class definitions** for data structure problems

### 🔧 Technical
- **React** + **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Express** backend for code execution
- **Multi-language compiler support**: GCC, G++, Python, Java, Node.js
- **localStorage** for progress persistence
- **Export/Import** progress as JSON

## Installation

### Prerequisites

#### Required
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or yarn (comes with Node.js)

#### Optional (for multi-language support)
- **GCC/G++** (for C/C++ support)
  - Windows: [MinGW](https://sourceforge.net/projects/mingw/) or [MSYS2](https://www.msys2.org/)
  - Linux: `sudo apt install build-essential`
  - Mac: `xcode-select --install`
- **Python** (v3.x) - [Download](https://www.python.org/downloads/)
- **Java JDK** (v8 or higher) - [Download](https://www.oracle.com/java/technologies/downloads/)

**Note**: JavaScript works out of the box. Other languages are optional but recommended for full experience.

### Quick Setup

**Option 1: Automated Setup (Recommended)**
```bash
npm install
npm start
```
This will start both frontend and backend servers automatically.

**Option 2: Manual Setup**

1. **Install dependencies**:
```bash
npm install
```

2. **Verify compiler setup** (optional):
```bash
node verify-setup.js
```

3. **Start the servers**:

Using the start script (Windows):
```bash
start.bat
```

Using the start script (Linux/Mac):
```bash
./start.sh
```

Or manually in separate terminals:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

4. **Open the application**:
Navigate to `http://localhost:5173` in your browser

## Project Structure

```
code-prix/
├── src/
│   ├── components/
│   │   ├── F1DriverAvatar.jsx      # F1 racing driver avatar
│   │   ├── CodeEditor.jsx         # Monaco editor integration
│   │   ├── CursorTrail.jsx        # Cursor particle effects
│   │   ├── FinalPasswordModal.jsx # Final challenge modal
│   │   ├── ParallaxBackground.jsx # Reactive background
│   │   ├── RippleButton.jsx       # Button with ripple effect
│   │   ├── StoryModal.jsx         # Level completion story
│   │   └── TiltCard.jsx           # 3D tilt card effect
│   ├── context/
│   │   ├── MotionContext.jsx      # Motion preferences
│   │   └── ProgressContext.jsx    # Progress management
│   ├── data/
│   │   ├── problems.js            # Problem definitions
│   │   └── testcases.js           # Test cases
│   ├── pages/
│   │   ├── AdminCMS.jsx           # Admin interface
│   │   ├── Dashboard.jsx          # Level selection
│   │   ├── LandingPage.jsx        # Entry point
│   │   └── LevelPage.jsx          # Problem solving
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── server/
│   ├── executor.js                # Code execution engine
│   ├── index.js                   # Express server
│   └── solutions.js               # Reference solutions
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## Problems by Level

### Level 1: The Awakening (1 question)
- **Two Sum** - Array, Hash Map

### Level 2: Pattern Recognition (2 questions)
- **Valid Anagram** - String, Hash Map
- **First Unique Character in a String** - String, Hash Map

### Level 3: Data Structures (3 questions)
- **Merge Two Sorted Lists** - Linked List, Two Pointers
- **Reverse Linked List** - Linked List, Pointers
- **Remove Duplicates From Sorted List** - Linked List

### Level 4: Algorithm Mastery (4 questions)
- **Valid Parentheses** - Stack, String
- **Climbing Stairs** - Dynamic Programming, Fibonacci
- **Binary Search** - Array, Binary Search
- **Maximum Depth of Binary Tree** - Tree, Recursion, DFS

### Level 5: The Final Test (5 questions)
- **Majority Element** - Array, Hash Map, Boyer-Moore
- **Contains Duplicate** - Array, Hash Set
- **Maximum Sum Subarray** - Array, Sliding Window
- **Coin Change** - Dynamic Programming
- **Longest Substring Without Repeating Characters** - String, Sliding Window, Hash Set

**All problems support JavaScript, Python, C, C++, and Java!**

## Story Progression

Each level reveals a clue letter after completion:
- Level 1: **T** (The Awakening)
- Level 2: **R** (Pattern Recognition)
- Level 3: **A** (Data Structures)
- Level 4: **C** (Algorithm Mastery)
- Level 5: **E** (The Final Test)

Final password: **TRACE**

## Key Features & Fixes

### Data Structure Support
- **Linked Lists**: Automatic struct definition and helper functions (build, print, free)
- **Binary Trees**: Complete tree building from array representation
- **Proper Memory Management**: Automatic cleanup in C/C++

### C/C++ Improvements
- Fixed struct redefinition errors
- Added `limits.h` for INT_MIN/INT_MAX constants
- Proper header includes for each problem type
- Struct definitions provided before user code

### Problem Simplification
- Replaced complex problems with easier alternatives
- "Climbing Stairs" instead of "Queue Using Stacks"
- "Maximum Depth of Binary Tree" instead of "Flood Fill"
- "Majority Element" instead of "Top K Frequent Elements"

### Multi-Language Consistency
- All 15 problems work in all 5 languages
- Consistent input/output formatting
- Language-specific starter code with proper syntax

## Autograder

The autograder executes user code in a sandboxed environment with full multi-language support:

### JavaScript Execution
- Uses Node.js `Function` constructor for isolation
- Timeout protection (5 seconds per test)
- Runs visible and hidden testcases
- Returns detailed results per testcase

### Python Execution
- Requires Python 3.x runtime on server
- Executes code in subprocess with timeout
- JSON-based input/output handling
- Automatic cleanup of temporary files

### C Execution
- Requires GCC compiler
- Compiles code with proper headers and struct definitions
- Automatic memory management for data structures
- Includes `limits.h` for INT_MIN/INT_MAX constants
- Proper handling of linked lists and binary trees

### C++ Execution
- Requires G++ compiler
- Compiles with C++17 standard
- STL support (vector, stack, queue, etc.)
- Automatic struct/class definitions for data structures

### Java Execution
- Requires Java JDK (javac and java)
- Compiles and executes in separate steps
- Proper class structure with Solution wrapper
- Automatic cleanup of .class files

### Security Considerations
- Code runs on backend server (not client-side)
- Limited execution time (5-10 seconds)
- Temporary file cleanup after execution
- No network access
- Isolated execution context
- Compiler error messages returned to user

## Customization

### Adding New Problems

1. **Add problem definition** in `src/data/problems.js`:
```javascript
{
  id: 'problem-id',
  title: 'Problem Title',
  difficulty: 'Easy',
  description: '...',
  constraints: [...],
  examples: [...],
  hints: [...],
  starterCode: {
    javascript: '...',
    python: '...',
    c: '...',
    cpp: '...',
    java: '...'
  }
}
```

2. **Add testcases** in `src/data/testcases.js`:
```javascript
'problem-id': {
  visible: [
    { input: {...}, output: ... }
  ],
  hidden: [
    { input: {...}, output: ... }
  ]
}
```

3. **Add executor support** in `server/executor.js`:
   - Add wrapper code for C, C++, and Java
   - Handle input/output formatting
   - Include necessary headers/imports

4. **Add reference solution** in `server/solutions.js` for all languages

### Modifying Story Segments

Edit `storySegments` in `src/data/problems.js`:
```javascript
{
  title: 'Story Title',
  content: 'Narrative text...',
  clue: 'T',
  animation: 'hologram-flicker'
}
```

### Customizing UI Theme

Edit colors in `tailwind.config.js`:
```javascript
colors: {
  neon: {
    purple: '#a855f7',
    pink: '#ec4899',
    blue: '#3b82f6',
  }
}
```

## Accessibility

- **Reduce Motion toggle**: Disables animations and cursor effects
- **Keyboard navigation**: All interactive elements are keyboard accessible
- **Screen reader support**: Semantic HTML and ARIA labels
- **High contrast**: Neon colors on dark background

## Progress Management

### localStorage Keys
- `code-prix-progress`: Stores all championship progress data
- `code-prix-reduced-motion`: Motion preference setting
- `code-prix-f1-theme`: F1 theme customization settings
- `chitti-reduced-motion`: Motion preference

### Export/Import
- Export progress as JSON file
- Import previously saved progress
- Useful for backup or transferring between devices

### Reset Progress
- Confirmation dialog before reset
- Clears all solved questions and collected clues
- Cannot be undone

## Development

### Available Scripts

- `npm start` - Start both frontend and backend servers (recommended)
- `npm run dev` - Start Vite development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run server` - Start Express autograder server (port 3001)
- `node verify-setup.js` - Verify compiler installations
- `node test-compilers.js` - Test all language compilers

### Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Editor**: Monaco Editor (VS Code editor)
- **Backend**: Express.js, Node.js
- **Routing**: React Router v6
- **State**: React Context API

## Troubleshooting

### Compiler Not Found
- **C/C++**: Install MinGW (Windows) or gcc/g++ (Linux/Mac)
- **Python**: Install Python 3.x and add to PATH
- **Java**: Install JDK and add javac/java to PATH
- Run `node verify-setup.js` to check compiler availability

### Server Connection Error
- Ensure backend server is running on port 3001
- Check `http://localhost:3001/api/execute` is accessible
- Verify no firewall blocking the connection
- Restart both frontend and backend servers

### C/C++ Compilation Errors
- Check for missing semicolons or brackets
- Ensure struct definitions are not duplicated
- For linked lists: struct is already defined in wrapper
- For trees: struct is already defined in wrapper
- Check that `limits.h` is included for INT_MIN/INT_MAX

### Code Not Executing
- Check browser console for errors
- Ensure function name matches problem requirements
- Verify syntax is correct for the selected language
- Check compiler error messages in the output

### Progress Not Saving
- Check browser localStorage is enabled
- Clear browser cache and try again
- Use export/import as backup

### Animations Laggy
- Enable "Reduce Motion" toggle
- Close other browser tabs
- Check GPU acceleration is enableds

## Language Support Status

| Language   | Status | Compiler Required |
|------------|--------|-------------------|
| JavaScript | ✅ Full | Node.js (built-in) |
| Python     | ✅ Full | Python 3.x |
| C          | ✅ Full | GCC |
| C++        | ✅ Full | G++ |
| Java       | ✅ Full | JDK (javac + java) |

## Future Enhancements

- [ ] Leaderboard system
- [ ] Time tracking per problem
- [ ] More DSA problems (graphs, heaps, tries)
- [ ] Code submission history
- [ ] Social sharing
- [ ] Mobile app version
- [ ] Code complexity analysis
- [ ] Multiple test case batches

## License

MIT License - Feel free to use and modify

## Credits

Created as a comprehensive DSA challenge platform with cinematic UI and reactive elements.
