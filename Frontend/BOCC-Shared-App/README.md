# BOCC Frontend

Frontend for **BOCC (Business Orbit Campus Clubs)** — a platform that guides
college students from a startup idea to a working business over ~12 months,
through 5 gated stages reviewed by mentors, incubators, and investors.

This repository covers the **Student**, **Incubator**, and **Admin**
portals. It is a frontend-only build — see [`INTEGRATION.md`](./INTEGRATION.md)
for exactly what still needs a real backend before this is a working
product, not just a working UI.

## Tech Stack

- **[Vite](https://vitejs.dev)** — build tool and dev server
- **React 19**
- **[react-router-dom](https://reactrouter.com)** — client-side routing
- **Tailwind CSS v4** — CSS-first config via `@tailwindcss/vite`, design
  tokens live in [`src/index.css`](./src/index.css), not a `tailwind.config.js`
- **[lucide-react](https://lucide.dev)** — the only icon library used
- **Fonts:** Inter (body) + Poppins (headings), self-hosted via `@fontsource`

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
npm run build     # production build (outputs to dist/)
npm run preview   # serve the production build locally
```

## Project Structure

```
index.html                 Vite entry HTML — favicons, theme-init script

src/
  main.jsx                 Entry point — ThemeProvider + RouterProvider
  router.jsx                Route table (all routes, incl. the auth layout group)
  index.css                 All design tokens (light + dark mode)
  layouts/
    AuthLayout.jsx           Shared shell for Login, Forgot/Reset Password, Role Selection
  pages/
    auth/                    Login, ForgotPassword, ResetPassword, RoleSelection
    Dashboard.jsx             Student dashboard
    Notifications.jsx         Student notifications
    BuildStartupJourney.jsx   Student's 5-stage startup journey
    legal/PrivacyPolicy.jsx   Public Terms of Service & Privacy Policy
    incubator/                Incubator portal (dashboard, applications,
                               application review, messages, settings)
    admin/                    Admin portal — dashboard, a user-verification
                               pipeline (queue → detail → decision), a
                               startup-review pipeline (queue → detail →
                               evaluation workspace → outcome, plus a
                               meeting-scheduler branch), and an audit log
  components/
    ui/          Shared primitives (Button, Card, Input, Logo, ComingSoon,
                 ThemeToggle, ThemeProvider, Badge, StatCard, DataTable, Modal)
    auth/        Auth-specific components (RoleCard, PasswordStrengthMeter)
    layout/      PublicNav (shared top nav), Sidebar (shared dashboard side
                 panel — used by all three portals, mobile drawer + desktop
                 collapse built in)
    dashboard/   DashboardShell — header/content shell for the Student portal
    incubator/   IncubatorShell — header/content shell for the Incubator portal
    admin/       AdminShell — header/content shell for the Admin portal
  hooks/
    useDocumentTitle.js     Sets document.title per route
    useSidebarCollapsed.js  Persists the sidebar's collapsed/expanded state

public/
  logos/       Brand logo assets (light/dark × mark/horizontal/stacked variants)
```

## Design System

Monochrome base (black / white / gray) with a single neon-yellow accent
(`--color-accent-neon`) reserved for interactive signals — selection states,
unread indicators, active-step markers. Never used as a background fill.

Full light/dark token pairs are defined once in `src/index.css`. Dark mode
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
| `/admin`, `/admin/verification(/detail\|/decision)`, `/admin/reviews(/detail\|/workspace\|/outcome\|/schedule-meeting)`, `/admin/audit-log` | Admin |
| `/legal/privacy-policy` | Public |

## Before Deploying / Integrating

Read [`INTEGRATION.md`](./INTEGRATION.md) — it lists, screen by screen,
exactly what's real (genuine client-side logic) versus what's a visual stub
waiting on a backend, with the specific file/function to replace for each.

## Building a New Screen

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) first — where new pages go per
portal, which shared components to reuse instead of rebuilding, the design
token rules, and how to avoid stepping on other people's work when several
people are building screens in the same portal at once.
