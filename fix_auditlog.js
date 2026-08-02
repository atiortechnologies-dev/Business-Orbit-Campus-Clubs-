const fs = require('fs');
const file = '/home/jimfleax/Business-Orbit-Campus-Clubs-/Frontend/src/pages/admin/AuditLog.jsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Find the index of <aside and remove the extra </div>s right before it
const asideIdx = lines.findIndex(l => l.includes('<aside'));
let i = asideIdx - 1;
let removed = 0;
while (i >= 0 && lines[i].trim() === '</div>' && removed < 3) {
  lines.splice(i, 1);
  i--;
  removed++;
}

fs.writeFileSync(file, lines.join('\n'));
