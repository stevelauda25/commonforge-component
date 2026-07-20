const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
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

const files = walk(srcDir);
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // replace @/components/xxx with ../xxx
  content = content.replace(/from\s+['"]@\/components\/([^'"]+)['"]/g, 'from "../$1"');
  // replace @/lib/utils with ../lib/cn
  content = content.replace(/from\s+['"]@\/lib\/utils['"]/g, 'from "../lib/cn"');
  // replace @/lib/use-media-query with ../lib/use-media-query
  content = content.replace(/from\s+['"]@\/lib\/use-media-query['"]/g, 'from "../lib/use-media-query"');
  
  // replace real-data imports with empty arrays/objects to remove dependencies
  // (We'll manually fix the few components that need data)
  content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]@\/real-data\/[^'"]+['"]/g, 'const {$1} = {} as any;');
  
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Fixed imports in', files.length, 'files');
