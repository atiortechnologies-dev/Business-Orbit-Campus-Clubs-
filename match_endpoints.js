const fs = require('fs');
const path = require('path');

const mapData = JSON.parse(fs.readFileSync('codebase_map.json', 'utf8'));
const backendRoutes = mapData.routes.map(r => ({ method: r.method.toUpperCase(), path: r.path }));

// We need to scan frontend source files
const { execSync } = require('child_process');

try {
  const grepResult = execSync(`grep -rnE "(axios\\.|fetch\\(|api\\.)" Frontend/src`, { encoding: 'utf8', maxBuffer: 1024*1024*10 });
  fs.writeFileSync('frontend_usages.txt', grepResult);
} catch (e) {
  // If grep fails (e.g. no matches), it throws
  fs.writeFileSync('frontend_usages.txt', e.stdout || '');
}

// Let's also extract string literals that look like endpoints from frontend
try {
  const endpointsResult = execSync(`grep -rnoE "['\"][/a-zA-Z0-9_-]+['\"]" Frontend/src`, { encoding: 'utf8', maxBuffer: 1024*1024*10 });
  fs.writeFileSync('frontend_strings.txt', endpointsResult);
} catch (e) {
  fs.writeFileSync('frontend_strings.txt', e.stdout || '');
}

console.log("Extracted frontend strings and usages.");
