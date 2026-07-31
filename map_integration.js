const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Get backend routes
const mapData = JSON.parse(fs.readFileSync('codebase_map.json', 'utf8'));
const backendRoutes = mapData.routes.map(r => ({ method: r.method.toUpperCase(), path: r.path }));

// 2. Extract api strings from Frontend
let frontendStrings = [];
try {
  // Find all strings starting with a slash, e.g., '/api/v1/...' or similar
  const output = execSync('grep -rhEo "[\'\\\"]/[a-zA-Z0-9_/-]+[\'\\\"]" Frontend/src', { encoding: 'utf8', maxBuffer: 1024*1024*10 });
  frontendStrings = output.split('\n').map(s => s.replace(/['"]/g, '').trim()).filter(Boolean);
} catch (e) {
  console.log("No exact strings found or error:", e.message);
}

const uniqueFrontendPaths = [...new Set(frontendStrings)];

// Also check for axios/fetch calls to see which ones are actually used
let apiCalls = [];
try {
  const output = execSync('grep -rnEo "(axios|fetch)\\.[a-z]+\\([^\)]+\\)" Frontend/src', { encoding: 'utf8', maxBuffer: 1024*1024*10 });
  apiCalls = output.split('\n').filter(Boolean);
} catch (e) {
  // Ignore
}
try {
  const output2 = execSync('grep -rnE "(axios|fetch)" Frontend/src', { encoding: 'utf8', maxBuffer: 1024*1024*10 });
  apiCalls = apiCalls.concat(output2.split('\n').filter(Boolean));
} catch (e) {
  // Ignore
}

// Map backend vs frontend
const integrated = [];
const missingInFrontend = [];
const possiblyWrong = [];

// A simple path matching (ignoring path params like :id for a naive match, or converting them)
function matchPath(backendPath, frontendPath) {
  // e.g. backend: /users/:id, frontend: /users/123 or /users/${id}
  // This is a naive check. We will just check if frontend path includes the base of backend path.
  const baseB = backendPath.split('/:')[0];
  if (baseB === '/' || baseB === '') return false;
  return frontendPath.includes(baseB);
}

backendRoutes.forEach(br => {
  const isUsed = uniqueFrontendPaths.some(fp => matchPath(br.path, fp)) || apiCalls.some(call => call.includes(br.path.split('/:')[0]));
  if (isUsed) {
    integrated.push(br);
  } else {
    missingInFrontend.push(br);
  }
});

const report = {
  totalBackendRoutes: backendRoutes.length,
  totalFrontendStrings: uniqueFrontendPaths.length,
  integratedRoutesCount: integrated.length,
  missingInFrontendCount: missingInFrontend.length,
  integratedRoutes: integrated,
  missingInFrontend: missingInFrontend,
  uniqueFrontendPaths,
  apiCallsSample: apiCalls.slice(0, 50)
};

fs.writeFileSync('integration_report.json', JSON.stringify(report, null, 2));
console.log("Report generated at integration_report.json");
