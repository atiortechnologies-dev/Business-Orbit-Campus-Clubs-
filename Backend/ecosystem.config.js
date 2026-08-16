/**
 * @file ecosystem.config.js
 * @description PM2 process manager configuration for running the backend in
 *              production: cluster mode across all CPU cores, auto-restart on
 *              crash, log rotation-friendly output, graceful reload support.
 */

module.exports = {
  apps: [
    {
      name: "bocc-backend",
      script: "./server.js",
      cwd: __dirname,

      instances: process.env.PM2_INSTANCES,
      exec_mode: "cluster",

      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 2000,

      max_memory_restart: "400M",

      watch: false,

      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },

      out_file: "./logs/pm2-out.log",
      error_file: "./logs/pm2-error.log",
      merge_logs: true,
      time: true,
    },
  ],
};
