#!/usr/bin/env node
// deep_analyze.js - Deep per-file analysis comparing b34b524 vs HEAD
// Usage: node deep_analyze.js
// Outputs structured JSON results

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO = '/home/jimfleax/Business-Orbit-Campus-Clubs-';
const BEFORE = 'b34b524';

function run(cmd) {
  try {
    return execSync(cmd, { cwd: REPO, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } catch(e) {
    return e.stdout || '';
  }
}

function getBeforeContent(file) {
  try {
    return execSync(`git show ${BEFORE}:"${file}"`, { cwd: REPO, encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 });
  } catch(e) { return null; }
}

function getCurrentContent(file) {
  try {
    const fullPath = path.join(REPO, file);
    if (fs.existsSync(fullPath)) return fs.readFileSync(fullPath, 'utf8');
    return null;
  } catch(e) { return null; }
}

function countApiCalls(content) {
  if (!content) return 0;
  const patterns = [
    /import\s+\{[^}]*\}\s+from\s+['"][^'"]*[Aa]pi[^'"]*['"]/g,
    /import\s+\w+\s+from\s+['"][^'"]*[Aa]pi[^'"]*['"]/g,
    /useContext\s*\(/g,
    /axiosInstance\./g,
    /\.\s*get\s*\(/g,
    /\.\s*post\s*\(/g,
    /\.\s*put\s*\(/g,
    /\.\s*delete\s*\(/g,
    /\.\s*patch\s*\(/g,
    /fetch\s*\(/g,
    /await\s+\w+Api\./g,
    /from\s+['"]@\/api\//g,
    /from\s+['"]\.\.\/.*api/gi,
  ];
  let count = 0;
  for (const p of patterns) {
    const matches = content.match(p);
    if (matches) count += matches.length;
  }
  return count;
}

function isHardcoded(content) {
  if (!content) return false;
  const patterns = [
    /const\s+\w*[Dd]ata\w*\s*=\s*\[/,
    /const\s+\w*[Mm]ock\w*\s*=/,
    /\/\/\s*(TODO|FIXME)\s*[:]\s*(fetch|get|load|connect)/i,
    /\/\/\s*(fake|mock|hardcoded|placeholder)\s/i,
    /useState\s*\(\s*\[[\s\S]{0,50}\{/,  // useState([{ - likely hardcoded initial data
  ];
  return patterns.some(p => p.test(content));
}

function countLines(content) {
  if (!content) return 0;
  return content.split('\n').length;
}

function getImports(content) {
  if (!content) return [];
  const lines = content.split('\n');
  return lines.filter(l => l.trim().startsWith('import ')).slice(0, 30);
}

function categorize(file) {
  if (file.includes('/api/')) return 'API_MODULE';
  if (file.includes('/context/')) return 'CONTEXT';
  if (file.includes('/hooks/')) return 'HOOK';
  if (file.includes('/pages/landing/')) return 'LANDING_PAGE';
  if (file.includes('/components/landing/')) return 'LANDING_COMPONENT';
  if (file.includes('/pages/')) return 'PAGE';
  if (file.includes('/components/')) return 'COMPONENT';
  if (file.includes('/layouts/')) return 'LAYOUT';
  if (file.includes('/utils/')) return 'UTIL';
  if (file.includes('/router')) return 'ROUTER';
  if (file.includes('/index.css')) return 'STYLES';
  if (file.includes('/main.jsx')) return 'ENTRY';
  if (file.includes('Backend/controllers/')) return 'BACKEND_CONTROLLER';
  if (file.includes('Backend/routes/')) return 'BACKEND_ROUTE';
  if (file.includes('Backend/models/')) return 'BACKEND_MODEL';
  if (file.includes('Backend/middlewares/')) return 'BACKEND_MIDDLEWARE';
  if (file.includes('Backend/services/')) return 'BACKEND_SERVICE';
  if (file.includes('Backend/tests/')) return 'BACKEND_TEST';
  if (file.includes('Backend/utils/')) return 'BACKEND_UTIL';
  if (file.includes('Backend/')) return 'BACKEND_OTHER';
  return 'OTHER';
}

function analyzeFile(file) {
  const beforeContent = getBeforeContent(file);
  const currentContent = getCurrentContent(file);
  const category = categorize(file);

  const beforeExists = beforeContent !== null;
  const afterExists = currentContent !== null;

  if (!beforeExists && afterExists) {
    return { file, category, verdict: 'KEEP_MAIN_NEW', reason: 'New file from main - did not exist in your branch', beforeLines: 0, afterLines: countLines(currentContent), beforeApi: 0, afterApi: 0 };
  }
  if (beforeExists && !afterExists) {
    return { file, category, verdict: 'RESTORE_YOURS', reason: 'Your file was deleted by merge - must restore', beforeLines: countLines(beforeContent), afterLines: 0, beforeApi: 0, afterApi: 0 };
  }
  if (!beforeExists && !afterExists) {
    return { file, category, verdict: 'SKIP', reason: 'Does not exist in either version', beforeLines: 0, afterLines: 0, beforeApi: 0, afterApi: 0 };
  }

  if (beforeContent === currentContent) {
    return { file, category, verdict: 'IDENTICAL', reason: 'Files are identical', beforeLines: countLines(beforeContent), afterLines: countLines(currentContent), beforeApi: 0, afterApi: 0 };
  }

  const beforeLines = countLines(beforeContent);
  const afterLines = countLines(currentContent);
  const beforeApi = countApiCalls(beforeContent);
  const afterApi = countApiCalls(currentContent);
  const beforeHardcoded = isHardcoded(beforeContent);
  const afterHardcoded = isHardcoded(currentContent);
  const lineDiff = afterLines - beforeLines;
  const lineDiffPct = Math.round((lineDiff / beforeLines) * 100);

  const beforeImports = getImports(beforeContent).join('\n');
  const afterImports = getImports(currentContent).join('\n');

  let verdict, reason;

  // Frontend pages and components
  if (category === 'PAGE' || category === 'COMPONENT' || category === 'LAYOUT') {
    if (beforeApi > afterApi && beforeApi >= 3) {
      verdict = 'RESTORE_YOURS';
      reason = `Your version had ${beforeApi} API calls, current has ${afterApi} - main stripped API integration`;
    } else if (afterApi > beforeApi && afterApi >= 3) {
      verdict = 'KEEP_MAIN';
      reason = `Main version improved API integration: ${beforeApi} → ${afterApi} calls`;
    } else if (beforeApi === afterApi && beforeApi >= 2) {
      // Similar API usage - prefer the longer one (more complete) or check specific diff
      if (lineDiffPct < -30) {
        verdict = 'RESTORE_YOURS';
        reason = `Your version is ${Math.abs(lineDiffPct)}% longer with same API count (${beforeApi}) - main may have stripped features`;
      } else if (lineDiffPct > 30) {
        verdict = 'KEEP_MAIN';
        reason = `Main version is ${lineDiffPct}% longer with same API count (${afterApi}) - likely added improvements`;
      } else {
        verdict = 'MANUAL_REVIEW';
        reason = `Similar API usage (${beforeApi}/${afterApi}) and line count - needs targeted diff review`;
      }
    } else if (beforeApi === 0 && afterApi === 0) {
      // No API calls in either - compare by line count changes
      if (lineDiffPct < -20) {
        verdict = 'RESTORE_YOURS';
        reason = `No API calls but your version is ${Math.abs(lineDiffPct)}% longer - main may have simplified/broken UI`;
      } else if (lineDiffPct > 20) {
        verdict = 'KEEP_MAIN';
        reason = `No API calls, main added ${lineDiffPct}% more content - likely UI improvements`;
      } else {
        verdict = 'MANUAL_REVIEW';
        reason = `No API calls, similar line counts (${beforeLines} vs ${afterLines}) - minor differences, check for prop/style changes`;
      }
    } else {
      verdict = 'MANUAL_REVIEW';
      reason = `Before API: ${beforeApi}, After API: ${afterApi} - borderline case`;
    }
  } else if (category === 'API_MODULE') {
    // API modules - your version should be preferred (you built these)
    if (beforeLines >= afterLines) {
      verdict = 'RESTORE_YOURS';
      reason = `API module: your version is more complete (${beforeLines} vs ${afterLines} lines)`;
    } else {
      verdict = 'KEEP_MAIN';
      reason = `API module: main version is larger (${afterLines} vs ${beforeLines} lines) - may have more endpoints`;
    }
  } else if (category === 'CONTEXT' || category === 'HOOK') {
    if (beforeLines > afterLines && beforeApi >= afterApi) {
      verdict = 'RESTORE_YOURS';
      reason = `Context/Hook: your version is fuller (${beforeLines} vs ${afterLines} lines, API: ${beforeApi}/${afterApi})`;
    } else if (afterLines > beforeLines) {
      verdict = 'KEEP_MAIN';
      reason = `Context/Hook: main version is fuller (${afterLines} vs ${beforeLines} lines)`;
    } else {
      verdict = 'MANUAL_REVIEW';
      reason = `Context/Hook: similar sizes (${beforeLines}/${afterLines})`;
    }
  } else if (category === 'LANDING_PAGE' || category === 'LANDING_COMPONENT') {
    // Landing pages - check if they import API modules
    const beforeHasApi = beforeImports.includes('Api') || beforeImports.includes('api');
    const afterHasApi = afterImports.includes('Api') || afterImports.includes('api');
    if (beforeHasApi && !afterHasApi) {
      verdict = 'RESTORE_YOURS';
      reason = `Landing: your version imports API, current doesn't - main stripped dynamic data`;
    } else if (!beforeHasApi && afterHasApi) {
      verdict = 'KEEP_MAIN';
      reason = `Landing: main added API integration`;
    } else if (lineDiffPct < -25) {
      verdict = 'RESTORE_YOURS';
      reason = `Landing: your version is ${Math.abs(lineDiffPct)}% longer - main may have stripped content`;
    } else {
      verdict = 'KEEP_MAIN';
      reason = `Landing: main version is fine (${beforeLines} → ${afterLines} lines, no API regression)`;
    }
  } else if (category === 'ROUTER') {
    verdict = 'MANUAL_REVIEW';
    reason = `Router: critical file - needs careful inspection of route additions/removals`;
  } else if (category === 'ENTRY' || category === 'STYLES') {
    if (lineDiffPct < -15) {
      verdict = 'RESTORE_YOURS';
      reason = `Entry/Styles: your version is ${Math.abs(lineDiffPct)}% longer - check for missing imports or styles`;
    } else {
      verdict = 'KEEP_MAIN';
      reason = `Entry/Styles: main version OK`;
    }
  } else if (category.startsWith('BACKEND_')) {
    // Backend files - check if main consolidated (adminDashboard) or stripped
    if (beforeLines > afterLines * 1.5) {
      verdict = 'RESTORE_YOURS';
      reason = `Backend: your version is much larger (${beforeLines} vs ${afterLines}) - main may have stripped logic`;
    } else if (afterLines > beforeLines * 1.5) {
      verdict = 'KEEP_MAIN';
      reason = `Backend: main version is much larger (${afterLines} vs ${beforeLines}) - main added functionality`;
    } else {
      verdict = 'MANUAL_REVIEW';
      reason = `Backend: similar sizes (${beforeLines}/${afterLines}) - check for auth changes, bug fixes`;
    }
  } else if (category === 'UTIL') {
    if (beforeLines > afterLines) {
      verdict = 'RESTORE_YOURS';
      reason = `Util: your version is longer (${beforeLines} vs ${afterLines})`;
    } else {
      verdict = 'KEEP_MAIN';
      reason = `Util: main version is longer or equal (${afterLines} vs ${beforeLines})`;
    }
  } else {
    verdict = 'MANUAL_REVIEW';
    reason = `Unknown category (${category}): ${beforeLines} → ${afterLines} lines`;
  }

  return { file, category, verdict, reason, beforeLines, afterLines, beforeApi, afterApi, lineDiffPct };
}

// Read file lists
const frontendFiles = fs.readFileSync('/tmp/frontend_changed_head.txt', 'utf8')
  .split('\n').map(f => f.trim().replace('\r', '')).filter(Boolean);
const backendFiles = fs.readFileSync('/tmp/backend_changed_head.txt', 'utf8')
  .split('\n').map(f => f.trim().replace('\r', '')).filter(Boolean);

const allFiles = [...frontendFiles, ...backendFiles];
const results = [];

console.log(`Analyzing ${allFiles.length} files...`);

for (const file of allFiles) {
  process.stdout.write(`  [${results.length+1}/${allFiles.length}] ${file}\r`);
  const result = analyzeFile(file);
  results.push(result);
}

console.log('\nDone!');

// Save results as JSON
fs.writeFileSync('/home/jimfleax/Business-Orbit-Campus-Clubs-/scratch/deep_analysis.json', JSON.stringify(results, null, 2));

// Print summary
const groups = {};
for (const r of results) {
  groups[r.verdict] = (groups[r.verdict] || []);
  groups[r.verdict].push(r);
}

console.log('\n=== SUMMARY ===');
for (const [v, files] of Object.entries(groups).sort()) {
  console.log(`\n${v} (${files.length} files):`);
  for (const f of files) {
    console.log(`  ${f.file} [${f.category}] ${f.beforeLines}→${f.afterLines} lines`);
    console.log(`    Reason: ${f.reason}`);
  }
}
