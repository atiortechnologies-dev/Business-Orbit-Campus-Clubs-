const fs = require('fs');
const file = '/home/jimfleax/Business-Orbit-Campus-Clubs-/Frontend/src/pages/admin/AuditLog.jsx';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

let tagStack = [];
for (let i = 0; i < lines.length; i++) {
  const divOpens = (lines[i].match(/<div[^>]*>/g) || []).length;
  const divCloses = (lines[i].match(/<\/div>/g) || []).length;
  
  if (divOpens > divCloses) {
    for (let k = 0; k < divOpens - divCloses; k++) tagStack.push(i + 1);
  } else if (divCloses > divOpens) {
    for (let k = 0; k < divCloses - divOpens; k++) {
      if (tagStack.length > 0) tagStack.pop();
      else console.log(`Unmatched </div> at line ${i + 1}`);
    }
  }
}

if (tagStack.length > 0) {
  console.log(`Unmatched <div> at lines: ${tagStack.join(', ')}`);
} else {
  console.log('All <div> tags match!');
}
