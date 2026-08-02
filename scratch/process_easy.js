const fs = require('fs');
const { execSync } = require('child_process');

const progressFile = '/home/jimfleax/Business-Orbit-Campus-Clubs-/scratch/progress.json';
const data = JSON.parse(fs.readFileSync(progressFile, 'utf8'));

const updateStatus = (file, status, note) => {
    data.backend.files[file].status = status;
    data.backend.files[file].updated_at = new Date().toISOString();
    // we also want to keep the note field roughly or append to it if we want.
    // just write directly to the json
    fs.writeFileSync(progressFile, JSON.stringify(data, null, 2));
};

for (const [file, info] of Object.entries(data.backend.files)) {
    if (info.status === 'PENDING') {
        if (info.verdict === 'KEEP_MAIN') {
            updateStatus(file, 'DONE_KEPT_MAIN', 'Kept main branch version');
            console.log(`Processed ${file} -> KEEP_MAIN`);
        } else if (info.verdict === 'RESTORE_YOURS') {
            try {
                execSync(`git checkout b34b524 -- "${file}"`, { cwd: '/home/jimfleax/Business-Orbit-Campus-Clubs-' });
                updateStatus(file, 'DONE_RESTORED', 'Restored from b34b524');
                console.log(`Processed ${file} -> RESTORE_YOURS`);
            } catch (e) {
                updateStatus(file, 'ERROR', e.message.substring(0, 50));
                console.log(`Failed to process ${file} -> RESTORE_YOURS`);
            }
        }
    }
}
