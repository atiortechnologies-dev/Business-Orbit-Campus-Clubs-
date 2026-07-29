const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const AuditLog = require('../models/AuditLog');

// Check for AWS Credentials to determine if we are in Production (S3) or Local (Disk)
let s3Client = null;
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
  });
}

/**
 * @function archiveOldAuditLogs
 * @description Automatically archives AuditLog entries older than 30 days to cold storage (S3) or local disk.
 * 
 * WHY THIS IS IMPLEMENTED AS A CRON JOB INSTEAD OF A MONGODB TTL INDEX:
 * 1. Compliance: A simple MongoDB TTL (Time-To-Live) index automatically hard-deletes records. 
 *    The PRD specifically mandates "archiving to cold storage" before deletion to ensure an immutable audit trail.
 * 2. Modularity: In local development, it archives to a local `assets/archives/` folder. 
 *    In production (when AWS env vars are present), it uploads compressed logs directly to S3.
 * 3. Data Integrity: Logs are only deleted from MongoDB *after* the archive file is successfully saved/uploaded.
 */
const archiveOldAuditLogs = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find logs older than 30 days
    const oldLogs = await AuditLog.find({ timestamp: { $lt: thirtyDaysAgo } }).lean();

    if (oldLogs.length === 0) {
      console.log('No old audit logs to archive.');
      return;
    }

    // Format logs as JSON and compress them
    const logData = JSON.stringify(oldLogs, null, 2);
    const compressedData = zlib.gzipSync(logData);
    const fileName = `audit-logs-archive-${Date.now()}.json.gz`;

    if (s3Client) {
      // Production Mode: Upload to AWS S3 Cold Storage
      const bucketName = process.env.AWS_S3_BUCKET || 'default-audit-bucket';
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: `archives/audit-logs/${fileName}`,
        Body: compressedData,
        ContentType: 'application/gzip',
      });

      await s3Client.send(command);
      console.log(`[Archive] Successfully uploaded ${oldLogs.length} logs to S3: ${fileName}`);
    } else {
      // Development Mode: Save to local disk
      const archiveDir = path.join(__dirname, '../../assets/archives');
      if (!fs.existsSync(archiveDir)) {
        fs.mkdirSync(archiveDir, { recursive: true });
      }
      const filePath = path.join(archiveDir, fileName);
      fs.writeFileSync(filePath, compressedData);
      console.log(`[Archive] Successfully saved ${oldLogs.length} logs to local disk: ${filePath}`);
    }

    // Once successfully archived (either locally or S3), safely delete them from the hot database
    const logIds = oldLogs.map(log => log._id);
    await AuditLog.deleteMany({ _id: { $in: logIds } });
    console.log(`[Archive] Deleted ${logIds.length} archived logs from MongoDB.`);

  } catch (error) {
    console.error('[Archive] Failed to archive audit logs:', error);
  }
};

// Schedule the cron job to run every day at midnight (00:00)
const initCronJobs = () => {
  cron.schedule('0 0 * * *', () => {
    console.log('[Cron] Running daily audit log archive job...');
    archiveOldAuditLogs();
  });
  console.log('[Cron] Audit log archiving job initialized.');
};

module.exports = { initCronJobs, archiveOldAuditLogs };
