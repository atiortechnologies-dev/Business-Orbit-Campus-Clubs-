const fs = require('fs');
const file = '/home/jimfleax/Business-Orbit-Campus-Clubs-/Frontend/src/pages/admin/AuditLog.jsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

let tagStack = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const divOpens = (line.match(/<div(?=\s|>)(?![^>]*\/>)/g) || []).length;
  const divCloses = (line.match(/<\/div>/g) || []).length;
  
  for (let k = 0; k < divOpens; k++) tagStack.push(i + 1);
  for (let k = 0; k < divCloses; k++) {
    if (tagStack.length > 0) tagStack.pop();
    else console.log(`Unmatched </div> at line ${i + 1}`);
  }
}

if (tagStack.length > 0) {
  console.log(`Unmatched <div> at lines: ${tagStack.join(', ')}`);
} else {
  console.log('All <div> tags match!');
}
