#!/usr/bin/env node
// progress_update.js - Atomic progress tracker updater
// Usage: node progress_update.js <group> <file> <status> [note]
// group: "frontend" or "backend"
// status: "IN_PROGRESS" | "DONE_RESTORED" | "DONE_KEPT_MAIN" | "DONE_MERGED" | "DONE_NO_ACTION" | "ERROR"
// note: optional override note

const fs = require('fs');
const path = require('path');
const PROGRESS_FILE = path.join(__dirname, 'progress.json');

const [,, group, file, status, note] = process.argv;

if (!group || !file || !status) {
  console.error('Usage: node progress_update.js <group> <file> <status> [note]');
  process.exit(1);
}

// Retry loop for file locking
let attempts = 0;
while (attempts < 10) {
  try {
    const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    if (!data[group] || !data[group].files) {
      console.error(`Group "${group}" not found in progress.json`);
      process.exit(1);
    }
    if (!data[group].files[file]) {
      // Allow new files to be added if needed
      data[group].files[file] = {};
    }
    const prev = data[group].files[file].status;
    data[group].files[file].status = status;
    data[group].files[file].updated_at = new Date().toISOString();
    if (note) data[group].files[file].note = note;

    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
    console.log(`[progress] ${file}: ${prev} -> ${status}${note ? ' | ' + note : ''}`);
    process.exit(0);
  } catch (e) {
    attempts++;
    // Small sleep before retry
    const start = Date.now();
    while (Date.now() - start < 100) {}
  }
}
console.error('Failed to update progress after 10 attempts');
process.exit(1);
