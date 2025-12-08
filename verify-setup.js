#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Chitti Challenge - Setup Verification\n');
console.log('========================================\n');

let errors = 0;
let warnings = 0;

// Check Node.js version
console.log('📦 Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion >= 16) {
    console.log(`✅ Node.js ${nodeVersion} (OK)\n`);
} else {
    console.log(`❌ Node.js ${nodeVersion} (Need v16+)\n`);
    errors++;
}

// Check required files
console.log('📁 Checking required files...');
const requiredFiles = [
    'package.json',
    'index.html',
    'vite.config.js',
    'tailwind.config.js',
    'src/main.jsx',
    'src/App.jsx',
    'src/index.css',
    'server/index.js',
    'server/executor.js',
];

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} (Missing)`);
        errors++;
    }
});
console.log('');

// Check components
console.log('🧩 Checking components...');
const components = [
    'src/components/ChittiAvatar.jsx',
    'src/components/CodeEditor.jsx',
    'src/components/CursorTrail.jsx',
    'src/components/FinalPasswordModal.jsx',
    'src/components/ParallaxBackground.jsx',
    'src/components/RippleButton.jsx',
    'src/components/StoryModal.jsx',
    'src/components/TiltCard.jsx',
];

components.forEach(comp => {
    if (fs.existsSync(comp)) {
        console.log(`✅ ${path.basename(comp)}`);
    } else {
        console.log(`❌ ${path.basename(comp)} (Missing)`);
        errors++;
    }
});
console.log('');

// Check pages
console.log('📄 Checking pages...');
const pages = [
    'src/pages/LandingPage.jsx',
    'src/pages/Dashboard.jsx',
    'src/pages/LevelPage.jsx',
    'src/pages/AdminCMS.jsx',
];

pages.forEach(page => {
    if (fs.existsSync(page)) {
        console.log(`✅ ${path.basename(page)}`);
    } else {
        console.log(`❌ ${path.basename(page)} (Missing)`);
        errors++;
    }
});
console.log('');

// Check data files
console.log('💾 Checking data files...');
const dataFiles = [
    'src/data/problems.js',
    'src/data/testcases.js',
];

dataFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${path.basename(file)}`);
    } else {
        console.log(`❌ ${path.basename(file)} (Missing)`);
        errors++;
    }
});
console.log('');

// Check node_modules
console.log('📚 Checking dependencies...');
if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules exists');

    // Check key dependencies
    const keyDeps = [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        '@monaco-editor/react',
        'express',
    ];

    keyDeps.forEach(dep => {
        if (fs.existsSync(`node_modules/${dep}`)) {
            console.log(`✅ ${dep}`);
        } else {
            console.log(`⚠️  ${dep} (Not installed)`);
            warnings++;
        }
    });
} else {
    console.log('❌ node_modules not found (Run: npm install)');
    errors++;
}
console.log('');

// Check documentation
console.log('📖 Checking documentation...');
const docs = [
    'README.md',
    'SETUP.md',
    'QUICKSTART.md',
    'ARCHITECTURE.md',
    'ANIMATIONS.md',
    'FEATURES.md',
];

docs.forEach(doc => {
    if (fs.existsSync(doc)) {
        console.log(`✅ ${doc}`);
    } else {
        console.log(`⚠️  ${doc} (Missing)`);
        warnings++;
    }
});
console.log('');

// Summary
console.log('========================================\n');
console.log('📊 Summary:\n');

if (errors === 0 && warnings === 0) {
    console.log('✅ All checks passed!');
    console.log('🚀 Ready to start the application\n');
    console.log('Run: npm run server (Terminal 1)');
    console.log('Run: npm run dev (Terminal 2)');
    console.log('Open: http://localhost:3000\n');
    process.exit(0);
} else {
    if (errors > 0) {
        console.log(`❌ ${errors} error(s) found`);
    }
    if (warnings > 0) {
        console.log(`⚠️  ${warnings} warning(s) found`);
    }
    console.log('');

    if (errors > 0) {
        console.log('🔧 Fix errors before running the app');
        if (!fs.existsSync('node_modules')) {
            console.log('   → Run: npm install');
        }
    }
    console.log('');
    process.exit(errors > 0 ? 1 : 0);
}