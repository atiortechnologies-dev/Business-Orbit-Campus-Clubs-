# BOCC Frontend

Frontend for **BOCC (Business Orbit Campus Clubs)** — a platform that guides
college students from a startup idea to a working business over ~12 months,
through 5 gated stages reviewed by mentors, incubators, and investors.

This repository is the shared frontend for every role: public landing
pages, auth + onboarding/verification, and the **Student**, **Incubator**,
**Admin**, **Investor**, **Mentor**, and **Company** portals. It is a
frontend-only build — see [`INTEGRATION.md`](./INTEGRATION.md) for
exactly what still needs a real backend before this is a working product,
not just a working UI. A `Backend/` directory alongside this one has
started scaffolding real endpoints (auth registration, per-role profile
models) — nothing in this frontend calls them yet.

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
    AuthLayout.jsx           Shared shell for Login, Forgot/Reset Password,
                               Role Selection, all Signup pages, and the
                               whole onboarding/verification flow
    CompanyDashboardShell.jsx Company portal's shell (wraps DashboardShell)
  pages/
    auth/                    Login, ForgotPassword, ResetPassword,
                               RoleSelection, and a Signup page per role
                               (Student/Company/Investor/Mentor/Incubator)
    onboarding/              Post-signup flow: Welcome, VerifyEmail,
                               VerificationProgress, ApplicationRejected,
                               plus complete-profile/ (one page per role,
                               all backed by one shared shell component)
    landing/                 Public marketing pages: Home + one per role
                               (Student/Mentor/Investor/Companies/Incubator)
    Dashboard.jsx             Student dashboard
    Notifications.jsx         Student notifications
    Settings.jsx               Student account settings
    BuildStartupJourney.jsx   Student's 5-stage startup journey overview
    journey/                  Real sub-flows for 3 of those 5 stages —
                               ideation/, validation/, mvp/ — each a
                               multi-screen pipeline (submit → review
                               meeting → review result, roughly)
    legal/PrivacyPolicy.jsx   Public Terms of Service & Privacy Policy
    incubator/                Incubator portal (dashboard, applications,
                               application review, messages, settings)
    admin/                    Admin portal — dashboard, a user-verification
                               pipeline (queue → detail → decision), a
                               startup-review pipeline (queue → detail →
                               evaluation workspace → outcome, plus a
                               meeting-scheduler branch), and an audit log
    investor/                Investor portal (dashboard, incoming pitch
                               decks, single pitch-deck viewer)
    mentor/                  Mentor portal (dashboard, requests, chats,
                               meetings, profile)
    company/                 Company portal (dashboard, my opportunities) —
                               added by a different contributor; currently
                               being brought up to this app's conventions,
                               see INTEGRATION.md for exact status
  components/
    ui/          Shared primitives (Button, Card, Input, Logo, ComingSoon,
                 ThemeToggle, ThemeProvider, Badge, StatCard, DataTable, Modal)
    auth/        Auth-specific components (RoleCard, PasswordStrengthMeter,
                 RoleSignupForm — the one shared component behind all 5
                 signup pages)
    onboarding/  CompleteProfileShell + shared field components (TagInput,
                 CheckboxPills, RadioPills, SelectField, TextAreaField)
                 behind the 5 complete-profile pages
    landing/     Shared Navbar/Footer plus one subfolder per landing page
                 (student/, mentor/, investor/, companies/, incubator/)
    layout/      PublicNav (shared top nav), Sidebar (shared dashboard side
                 panel — used by every portal shell, mobile drawer + desktop
                 collapse built in)
    dashboard/   DashboardShell — header/content shell for the Student
                 portal, also reused by the Company portal
    incubator/   IncubatorShell — header/content shell for the Incubator portal
    admin/       AdminShell — header/content shell for the Admin portal
    investor/    InvestorShell — header/content shell for the Investor portal
    mentor/      MentorShell — header/content shell for the Mentor portal
    bocc/        Company portal's page-content components (dashboard stats,
                 applicant table, etc.) — see INTEGRATION.md, this folder
                 doesn't follow the rest of the app's conventions yet
  hooks/
    useDocumentTitle.js     Sets document.title per route
    useSidebarCollapsed.js  Persists the sidebar's collapsed/expanded state
  utils/
    csv.js                  Turns local table state into a real downloadable
                             .csv — shared by every "Export CSV" action

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
| `/login`, `/forgot-password`, `/reset-password`, `/role-selection`, `/signup/{student\|company\|investor\|mentor\|incubator}` | Auth |
| `/onboarding/welcome`, `/onboarding/verify-email`, `/onboarding/verification-progress`, `/onboarding/application-rejected`, `/onboarding/complete-profile/{student\|mentor\|investor\|incubator\|company}` | Onboarding / verification |
| `/landing`, `/landing/{student\|mentor\|investor\|incubator\|companies}` | Public landing |
| `/dashboard`, `/notifications`, `/settings`, `/build-startup/journey` | Student |
| `/build-startup/journey/ideation` (+ `/submit`, `/confirmation`, `/review-meeting`, `/review-result`, `/resources`) | Student — Ideation stage |
| `/build-startup/journey/validation` (+ `/survey-tracker`, `/evidence-upload`, `/report-submission`, `/confirmation`, `/review-meeting`, `/review-result`) | Student — Validation stage |
| `/build-startup/journey/mvp` (+ `/choose-product-type`, `/submit`, `/success`, `/incubation-proof`) | Student — MVP stage |
| `/incubator`, `/incubator/applications`, `/incubator/applications/review`, `/incubator/messages`, `/incubator/settings` | Incubator |
| `/admin`, `/admin/verification(/detail\|/decision)`, `/admin/reviews(/detail\|/workspace\|/outcome\|/schedule-meeting)`, `/admin/audit-log` | Admin |
| `/investor`, `/investor/pitch-decks`, `/investor/pitch-decks/review` | Investor |
| `/mentor`, `/mentor/requests`, `/mentor/chats`, `/mentor/meetings`, `/mentor/profile` | Mentor |
| `/company/dashboard`, `/company/my-opportunities` | Company |
| `/legal/privacy-policy` | Public |

73 routes total. `src/router.jsx` is the single source of truth — if this
table and that file ever disagree, the file wins; update this table to
match.

## Before Deploying / Integrating

Read [`INTEGRATION.md`](./INTEGRATION.md) — it lists, screen by screen,
exactly what's real (genuine client-side logic) versus what's a visual stub
waiting on a backend, with the specific file/function to replace for each.

## Building a New Screen

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) first — where new pages go per
portal, which shared components to reuse instead of rebuilding, the design
token rules, and how to avoid stepping on other people's work when several
people are building screens in the same portal at once.
