# BOCC — Deployment Runbook

Two supported ways to run this in production. Pick one.

- **Path A — Docker Compose** (recommended: one host, reproducible, easiest to redeploy)
- **Path B — Classic VPS** (PM2 for the backend process, system nginx as reverse proxy)

Both terminate at nginx, both need the env vars in the table below, and both
need `npm run seed` run once to create the first admin account.

---

## 0. Required environment variables

Copy `Backend/.env.example` → `Backend/.env` and fill in real values. Every
one of these is required in production; the app now fails fast (refuses to
boot, or in the SMTP case refuses to send) if the relevant ones are missing.

| Variable                                                               | Notes                                                                                                                              |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                                                                 | e.g. `5000`. Keep it consistent with nginx's `proxy_pass` target.                                                                  |
| `NODE_ENV`                                                             | `production`                                                                                                                       |
| `MONGODB_URI`                                                          | Full connection string (Atlas or self-hosted). No default — boot fails without it.                                                 |
| `FRONTEND_URL`                                                         | Exact public origin of your site, e.g. `https://yourdomain.com`. Used for CORS and Socket.IO origin checks.                        |
| `JWT_SECRET`, `JWT_REFRESH_SECRET`                                     | Generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. Unique per environment, never committed. |
| `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`                             | e.g. `7d` / `30d`                                                                                                                  |
| `OTP_EXPIRY_MINUTES`                                                   | e.g. `10`                                                                                                                          |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`        | Real transactional SMTP provider (not a sandbox). Boot fails in production without these.                                          |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Used for user uploads.                                                                                                             |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`                          | Used once by `npm run seed` to create the first admin account.                                                                     |

Frontend: copy `Frontend/.env.example` → `Frontend/.env.production` and set
`VITE_API_BASE_URL`. This is a **build-time** value (Vite bakes it into the
JS bundle) — see Path A vs B below for what to set it to.

---

## Path A — Docker Compose

```bash
cp Backend/.env.example Backend/.env
# edit Backend/.env with real values

docker compose build
docker compose up -d

docker compose exec backend npm run seed   # one-time: creates the admin user
docker compose logs -f
```

What this gives you:

- `backend` container: Node app run under **PM2** in cluster mode inside the
  container (`Backend/Dockerfile` + `Backend/ecosystem.config.js`), auto-restarts
  on crash, not exposed to the public internet directly.
- `frontend` container: the Vite build served by **nginx** (`Frontend/Dockerfile`
  - `Frontend/nginx.conf`), which also reverse-proxies `/api` and `/socket.io`
    to the backend container over the internal Docker network, with **rate
    limiting** at the nginx layer (`limit_req_zone`) as a second line of defense
    in front of the app-level rate limiting.
- `VITE_API_BASE_URL` is set to the relative path `/api` in `docker-compose.yml`
  so the browser only ever talks to one origin (your domain) — no CORS
  headaches, nginx does the proxying internally.

Put this whole stack behind TLS: either add a `443` listener + certs to
`Frontend/nginx.conf` and mount your cert files into the frontend container,
or (simpler) put a TLS-terminating reverse proxy / load balancer (Caddy,
Cloudflare, your cloud provider's LB) in front of port 80 on this host.

To redeploy after a code change: `docker compose build && docker compose up -d`.
PM2 inside the backend container and the container `restart: unless-stopped`
policy both provide crash recovery; `docker compose up -d` gives you a clean
rolling replacement of the containers.

---

## Path B — Classic VPS (PM2 + system nginx, no Docker)

```bash
# On the server, as a deploy user (not root):
git clone <your-repo> /var/www/bocc
cd /var/www/bocc

# --- Backend ---
cd Backend
cp .env.example .env        # fill in real values, see table above
npm ci --omit=dev
npm run seed                # one-time: creates the admin user

npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup                 # follow the printed instructions to enable on boot

# --- Frontend ---
cd ../Frontend
cp .env.example .env.production
# set VITE_API_BASE_URL=https://yourdomain.com/api   (absolute, since nginx
# here serves the frontend as static files and separately proxies /api —
# either an absolute URL or a relative "/api" both work as long as nginx's
# server_name matches the origin the frontend was built for)
npm ci
npm run build                # outputs Frontend/dist
```

Then wire up nginx:

```bash
sudo cp /var/www/bocc/deploy/nginx/bocc.conf /etc/nginx/sites-available/bocc.conf
# edit server_name and the /var/www/bocc/Frontend/dist root path to match your setup
sudo ln -s /etc/nginx/sites-available/bocc.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# TLS:
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

`deploy/nginx/bocc.conf` serves `Frontend/dist` as static files, proxies
`/api/*` and `/socket.io/*` (with websocket upgrade headers) to the PM2-managed
Node process on `127.0.0.1:<PORT>`, and applies nginx-level rate limiting on
top of the app-level limits in `Backend/middlewares/rateLimiters.js`.

Redeploying: `git pull`, `npm ci --omit=dev` (backend) / `npm ci && npm run build`
(frontend), then `pm2 reload bocc-backend` for a zero-downtime backend restart.
Static frontend files are picked up by nginx immediately (no reload needed
unless you changed the nginx config itself).

---

## Post-deploy checklist

- [ ] `curl https://yourdomain.com/api/health` returns `{"status":"healthy", "database":"connected", ...}`
- [ ] `docker compose exec backend npm run seed` (Path A) or `npm run seed` (Path B) ran once and you can log in as the seeded admin at `/api/auth/login`
- [ ] Register a test account end-to-end and confirm the OTP email actually arrives (real SMTP, not a sandbox)
- [ ] Confirm login persists across a page refresh (cookie + refresh-token flow), and that it survives an access-token expiry (waits out `JWT_EXPIRES_IN` or shorten it temporarily to test)
- [ ] Confirm file/image uploads round-trip through Cloudinary and are visible afterward
- [ ] Confirm the admin dashboard (`/api/admin/*`) is reachable when logged in as the seeded admin, and 403s for non-admin roles
- [ ] Confirm real-time chat (Socket.IO) connects through nginx — check the browser network tab for a `101 Switching Protocols` on `/socket.io/`
- [ ] Hit `/api/auth/login` more than 10 times quickly and confirm you get a `429` (rate limiting is active)
- [ ] `NODE_ENV=production` everywhere — a 500 error should return a generic message, not a stack trace
