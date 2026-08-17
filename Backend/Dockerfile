# syntax=docker/dockerfile:1

# ---- deps: install only production dependencies -----------------------------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ---- runtime ------------------------------------------------------------------
FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

# Run as a non-root user
RUN addgroup -S bocc && adduser -S bocc -G bocc

# PM2 gives us cluster mode + auto-restart-on-crash inside the container,
# same as the bare-metal PM2 deployment path documented in DEPLOYMENT.md.
RUN npm install -g pm2@latest

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p logs assets/uploads && chown -R bocc:bocc /app
USER bocc

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||5000)+'/api/health', r => process.exit(r.statusCode===200?0:1)).on('error', () => process.exit(1))"

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
