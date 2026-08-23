/**
 * @file ecosystem.config.js
 * @description PM2 process manager configuration for the BOCC backend.
 *
 * Production: cluster mode across CPU cores, auto-restart on crash,
 * log rotation-friendly output, graceful reload support.
 *
 * Usage:
 *   pm2 start ecosystem.config.js --env production
 *   pm2 reload bocc-backend          # zero-downtime restart
 *   pm2 logs bocc-backend
 */

module.exports = {
  apps: [
    {
      name: "bocc-backend",
      script: "./server.js",
      cwd: __dirname,

      // Cluster mode: defaults to 1 instance unless PM2_INSTANCES is set
      instances: parseInt(process.env.PM2_INSTANCES) || 1,
      exec_mode: "cluster",

      // Restart policy
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 2000,

      // Memory guard — restart if a worker exceeds this
      max_memory_restart: "400M",

      // Don't watch files in production (use `pm2 reload` instead)
      watch: false,

      // Environment variables
      env: {
        NODE_ENV: "development",
        PORT: 5000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000,
      },

      // Logs
      out_file: "./logs/pm2-out.log",
      error_file: "./logs/pm2-error.log",
      merge_logs: true,
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 10000,

      // Source .env automatically (dotenv is loaded in server.js, but this
      // ensures PM2 picks up PORT for --wait-ready if needed)
      node_args: "--max-old-space-size=512",
    },
  ],
};
