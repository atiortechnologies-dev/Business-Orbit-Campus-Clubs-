# BOCC Frontend

Frontend for **BOCC (Business Orbit Campus Clubs)** — a platform that guides
college students from a startup idea to a working business over ~12 months,
through 5 gated stages reviewed by mentors, incubators, and investors.

This repository covers the **Student** and **Incubator** portals. It is a
frontend-only build — see [`INTEGRATION.md`](./INTEGRATION.md) for exactly
what still needs a real backend before this is a working product, not just
a working UI.

## Tech Stack

- **[Next.js 16](https://nextjs.org)** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4** — CSS-first config, design tokens live in
  [`app/globals.css`](./app/globals.css), not a `tailwind.config.js`
- **[lucide-react](https://lucide.dev)** — the only icon library used
- **Fonts:** Inter (body) + Poppins (headings), loaded via `next/font/google`

No backend, no database, no auth provider — everything is client-side
state. See `INTEGRATION.md`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route (`/`)
redirects to `/login`.

```bash
npm run build   # production build
npm run start   # serve the production build locally
```

## Project Structure

```
app/
  (auth)/                 Login, Forgot/Reset Password, Role Selection
  dashboard/               Student dashboard
  notifications/           Student notifications
  build-startup/journey/   Student's 5-stage startup journey
  legal/privacy-policy/    Public Terms of Service & Privacy Policy
  incubator/               Incubator portal (dashboard, applications,
                            application review, messages, settings)
  layout.jsx               Root layout — fonts, theme-init script
  globals.css              All design tokens (light + dark mode)

components/
  ui/          Shared primitives (Button, Card, Input, Logo, ComingSoon,
               ThemeToggle, ThemeProvider)
  auth/        Auth-specific components (RoleCard, PasswordStrengthMeter)
  dashboard/   DashboardShell — sidebar/header shell for the Student portal
  incubator/   IncubatorShell — sidebar/header shell for the Incubator portal

public/
  logos/       Brand logo assets (light/dark × mark/horizontal/stacked variants)
```

## Design System

Monochrome base (black / white / gray) with a single neon-yellow accent
(`--color-accent-neon`) reserved for interactive signals — selection states,
unread indicators, active-step markers. Never used as a background fill.

Full light/dark token pairs are defined once in `app/globals.css`. Dark mode
is class-based (`.dark` on `<html>`), toggled via `ThemeProvider` /
`useTheme()`, not the OS `prefers-color-scheme` media query — though it
defaults to that on first visit.

Not-yet-built features use the shared `<ComingSoon>` component (hover/focus
tooltip, `aria-disabled`) instead of a dead link or a fake page — see
`INTEGRATION.md` for the full list of what that currently covers.

## Routes

| Route | Portal |
|---|---|
| `/login`, `/forgot-password`, `/reset-password`, `/role-selection` | Auth |
| `/dashboard`, `/notifications`, `/build-startup/journey` | Student |
| `/incubator`, `/incubator/applications`, `/incubator/applications/review`, `/incubator/messages`, `/incubator/settings` | Incubator |
| `/legal/privacy-policy` | Public |

## Before Deploying / Integrating

Read [`INTEGRATION.md`](./INTEGRATION.md) — it lists, screen by screen,
exactly what's real (genuine client-side logic) versus what's a visual stub
waiting on a backend, with the specific file/function to replace for each.
