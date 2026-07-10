const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'src/components');

function walk(directory) {
  let results = [];
  const list = fs.readdirSync(directory);
  list.forEach(file => {
    file = path.join(directory, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(dir);
let modifiedCount = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  if (content.includes('useReducedMotion')) {
    console.log('Patching', file);
    
    // Remove useReducedMotion import from framer-motion
    content = content.replace(/useReducedMotion,\s*/g, '');
    content = content.replace(/,\s*useReducedMotion/g, '');
    content = content.replace(/useReducedMotion/g, '');
    
    // Remove const reduce = ...
    content = content.replace(/const reduce = \(\);\s*/g, '');
    
    // Replace reduce ? false : { ... } with just { ... }
    content = content.replace(/reduce \? false : /g, '');
    content = content.replace(/reduce \? 0 : /g, '');
    
    // Fix edge case in seasonal-cycle.tsx: const pinned = desktop && !reduce;
    content = content.replace(/const pinned = desktop && !reduce;/g, 'const pinned = desktop;');
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      modifiedCount++;
    }
  }
});
console.log('Modified', modifiedCount, 'files.');
