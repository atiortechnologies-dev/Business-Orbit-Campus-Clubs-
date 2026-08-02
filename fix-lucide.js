const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g;
      let modified = false;
      
      content = content.replace(importRegex, (match, group1) => {
        if (group1.includes('_')) {
           modified = true;
           const newGroup = group1.replace(/\b_([A-Z][a-zA-Z0-9]*)\b/g, '$1');
           // Also, we need to replace the usage in the file if it was imported as _Icon
           // But wait, did they import `_ChevronRight` and use it as `_ChevronRight` in the JSX?
           // Yes, probably `<_ChevronRight />`. We must replace usages too.
           return `import {${newGroup}} from "lucide-react"`;
        }
        return match;
      });

      if (modified) {
        // Replace all usages of the bad names
        content = content.replace(/<_([A-Z][a-zA-Z0-9]*)/g, '<$1');
        content = content.replace(/\b_([A-Z][a-zA-Z0-9]*)\b/g, '$1'); // any remaining variables
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Fixed:", fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'Frontend/src'));
