const fs = require('fs');
const file = '/home/jimfleax/Business-Orbit-Campus-Clubs-/Frontend/src/pages/admin/AuditLog.jsx';
const content = fs.readFileSync(file, 'utf8');

// A very naive check for opening and closing tags in JSX
const getCounts = (str, regex) => (str.match(regex) || []).length;

console.log('<div> count:', getCounts(content, /<div/g));
console.log('</div> count:', getCounts(content, /<\/div>/g));
console.log('<AdminShell> count:', getCounts(content, /<AdminShell>/g));
console.log('</AdminShell> count:', getCounts(content, /<\/AdminShell>/g));
