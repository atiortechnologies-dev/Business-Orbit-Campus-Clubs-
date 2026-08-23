# BOCC — Deployment Runbook

Production deployment for **Business Orbit Campus Clubs** on VPS using **Nginx + PM2 + GitHub Actions CI/CD**.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  AIC Cloud VPS (148.113.8.82:20011)                             │
│  Ubuntu 24.04 · 4 vCPU · 8 GB RAM · 80 GB SSD                  │
│                                                                 │
│  ┌─────────────────────────────────────────┐                    │
│  │  Hosting Provider Caddy (SSL termination)│                    │
│  └──────────────────┬──────────────────────┘                    │
│                     │ port 80                                    │
│  ┌──────────────────▼──────────────────────┐                    │
│  │  Nginx (port 80, Host-based routing)    │                    │
│  │  ├── janki.care        → :4000 (exists) │                    │
│  │  ├── businessorbit.org → :5000 (BOCC)   │                    │
│  │  │   ├── /             → Frontend/dist  │                    │
│  │  │   ├── /api/         → proxy:5000     │                    │
│  │  │   ├── /api/auth/    → proxy:5000     │                    │
│  │  │   └── /socket.io/   → proxy:5000(ws) │                    │
│  │  └── byrg-demo         → (exists)       │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                 │
│  PM2 Processes:                                                  │
│  ├── janki-backend   :4000 (existing, DO NOT TOUCH)             │
│  └── bocc-backend    :5000 (new)                                │
│                                                                 │
│  /var/www/                                                      │
│  ├── janki/          (existing, DO NOT TOUCH)                   │
│  ├── byrg-demo/      (existing, DO NOT TOUCH)                   │
│  └── bocc/           (new — this project)                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 0. Required GitHub Secrets

Go to **GitHub → Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|--------|-------|
| `VPS_HOST` | `148.113.8.82` |
| `VPS_SSH_PORT` | `20011` |
| `VPS_SSH_PRIVATE_KEY` | SSH private key (add public key to VPS `~/.ssh/authorized_keys`) |
| `MONGODB_URI` | Full MongoDB connection string |
| `FRONTEND_URL` | `https://businessorbit.org` |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `JWT_REFRESH_SECRET` | Different from JWT_SECRET |
| `JWT_EXPIRES_IN` | `7d` |
| `JWT_REFRESH_EXPIRES_IN` | `30d` |
| `OTP_EXPIRY_MINUTES` | `10` |
| `SMTP_HOST` | SMTP server |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | `no-reply@businessorbit.org` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_EMAIL` | First admin email |
| `ADMIN_PASSWORD` | First admin password |
| `ADMIN_NAME` | First admin name |
| `PM2_INSTANCES` | Optional (default: `max`) |

---

## 1. One-time VPS Setup

```bash
ssh root@148.113.8.82 -p 20011

# Clone repo (Node.js & PM2 already installed from janki setup)
git clone https://github.com/YOUR_ORG/Business-Orbit-Campus-Clubs-.git /var/www/bocc
cd /var/www/bocc
mkdir -p Backend/logs
```

That's it. The CI/CD handles everything else on first push to `main`.

---

## 2. Domain Setup

Add `businessorbit.org` and `www.businessorbit.org` domains in the AIC Cloud panel pointing to port `:80`. The hosting provider's Caddy will handle SSL termination automatically (same as janki.care).

---

## 3. How Deployments Work (Automatic)

1. Push to `main` branch
2. GitHub Actions triggers `.github/workflows/deploy.yml`
3. Action SSHs into VPS (port 20011) and inline:
   - Pulls latest code
   - Writes `Backend/.env` from GitHub Secrets
   - `npm ci` for Backend & Frontend
   - Seeds admin user
   - Builds frontend with `VITE_API_BASE_URL=/api`
   - Restarts `bocc-backend` PM2 process on port 5000
   - Copies `bocc.conf` to nginx sites (doesn't touch janki/byrg configs)
   - Reloads nginx
   - Health check
4. Retries up to 3 times on transient SSH failures

**Zero interference with janki.care** — separate PM2 process, separate port, separate nginx config file, separate directory.

---

## 4. Manual Deploy

```bash
ssh root@148.113.8.82 -p 20011
cd /var/www/bocc
git pull origin main

npm ci --prefix Backend --no-audit --no-fund
npm ci --prefix Frontend --no-audit --no-fund

# Write Backend/.env (see Backend/.env.example)
cp Backend/.env.example Backend/.env
# Edit with real values...

npm run seed --prefix Backend
VITE_API_BASE_URL=/api npm run build --prefix Frontend

cd Backend && mkdir -p logs
pm2 stop bocc-backend 2>/dev/null || true
pm2 delete bocc-backend 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
cd ..

cp deploy/nginx/bocc.conf /etc/nginx/sites-available/bocc.conf
ln -sf /etc/nginx/sites-available/bocc.conf /etc/nginx/sites-enabled/bocc.conf
nginx -t && systemctl reload nginx
```

---

## 5. PM2 Operations

```bash
pm2 status                    # see all processes (janki + bocc)
pm2 logs bocc-backend         # bocc logs only
pm2 reload bocc-backend       # zero-downtime restart
pm2 restart bocc-backend      # hard restart
```

---

## 6. Post-deploy Checklist

- [ ] `curl http://localhost:5000/api/health` on VPS returns healthy
- [ ] `https://businessorbit.org` loads the frontend
- [ ] `https://businessorbit.org/api/health` returns healthy through nginx
- [ ] PM2 shows both `janki-backend` and `bocc-backend` running
- [ ] janki.care still works (no interference)
- [ ] Admin login works
- [ ] Socket.IO connects (101 Switching Protocols on `/socket.io/`)

---

## 7. Troubleshooting

```bash
# BOCC backend not starting?
pm2 logs bocc-backend --lines 50

# Port conflict?
ss -tlnp | grep 5000
fuser -k 5000/tcp && pm2 restart bocc-backend

# Nginx config error?
nginx -t

# Check all sites still working
curl -H "Host: businessorbit.org" http://localhost/
curl -H "Host: janki.care" http://localhost/
```
