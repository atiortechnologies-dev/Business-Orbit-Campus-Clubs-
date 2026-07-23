# Contributing to BOCC-Shared-App

This is the shared frontend for **every** BOCC role (Student, Incubator,
Auth) — one Vite + React app, not one project per role. Read this before
adding a new screen, especially if someone else might be building a
different screen of the *same* portal at the same time as you.

## 1. Where things live

```
index.html                 Entry HTML — favicons, theme-init script (don't
                            touch unless you're changing something global)

src/
  main.jsx                 App entry point — ThemeProvider + RouterProvider
  router.jsx                Every route in the app lives in this one table
  index.css                 ALL design tokens (colors, type scale, spacing,
                             radius) — light values in @theme, dark
                             overrides in .dark. No tailwind.config.js.

  layouts/
    AuthLayout.jsx           Wraps /login, /forgot-password,
                              /reset-password, /role-selection, /signup/*

  pages/                     One file per screen. This is almost always
                              where YOUR new work goes.
    auth/                    Login.jsx, ForgotPassword.jsx, ResetPassword.jsx,
                              RoleSelection.jsx, StudentSignup.jsx,
                              CompanySignup.jsx, InvestorSignup.jsx,
                              MentorSignup.jsx, IncubatorSignup.jsx (the 5
                              signup pages are thin config files — see
                              components/auth/RoleSignupForm.jsx)
    Dashboard.jsx             Student portal
    Notifications.jsx
    BuildStartupJourney.jsx   5-stage overview; Ideation/Validation/MVP
                               circles link into journey/ below once that
                               stage's review-result unlocks it
    Settings.jsx               Student account settings
    journey/                  Sub-flows for BuildStartupJourney's stages,
                               one folder per stage, only Student-facing
                               screens (nothing here overlaps admin/'s
                               review pipelines — see INTEGRATION.md if
                               that's ever unclear for a new screen)
      ideation/                IdeationOverview → IdeaSubmission →
                               SubmissionConfirmation, ReviewMeeting,
                               ReviewResult, TemplatesResources
      validation/              ValidationOverview → SurveyTracker →
                               EvidenceUpload → ReportSubmission →
                               SubmissionConfirmation, ReviewMeeting,
                               ReviewResult
      mvp/                     MvpOverview → ChooseProductType →
                               MvpSubmission → SubmissionSuccess →
                               IncubationProofSubmission
    incubator/                Incubator.jsx, Applications.jsx,
                               ApplicationReview.jsx, Messages.jsx, Settings.jsx
    admin/                    Admin.jsx (dashboard), VerificationQueue.jsx →
                               VerificationDetail.jsx → VerificationDecision.jsx
                               (one pipeline), ReviewQueue.jsx → ReviewDetail.jsx
                               → ReviewWorkspace.jsx → ReviewOutcome.jsx (a
                               second pipeline, with ScheduleMeeting.jsx
                               branching off ReviewDetail), AuditLog.jsx
    legal/PrivacyPolicy.jsx

  components/
    ui/          Generic, reusable anywhere: Button, Card, Input, Logo,
                 ComingSoon, ThemeToggle, ThemeProvider, Badge, StatCard,
                 DataTable, Modal
    layout/      PublicNav (shared top nav for all public/auth pages),
                 Sidebar (shared side panel for Student + Incubator + Admin)
    auth/        RoleCard, PasswordStrengthMeter, RoleSignupForm (shared
                 shell behind all 5 /signup/<role> pages — see §3)
    dashboard/   DashboardShell — the Student portal's page wrapper
    incubator/   IncubatorShell — the Incubator portal's page wrapper
    admin/       AdminShell — the Admin portal's page wrapper

  hooks/
    useDocumentTitle.js      Call this at the top of a page to set the tab title
    useSidebarCollapsed.js   Backs the desktop sidebar's collapse/expand
                              toggle; localStorage-persisted, shared by all
                              three shells so the state survives navigation

public/
  logos/       Brand logo PNGs — don't add new logo assets without checking
               with design first, filenames follow a strict convention
               (see Logo.jsx's own doc comment)
```

## 2. Adding a new page — the standard pattern

1. **Create the file** under `src/pages/`, matching the existing
   organization: student-portal pages sit flat in `pages/`, Incubator pages
   go in `pages/incubator/`, auth pages in `pages/auth/`, public pages in
   their own subfolder (see `pages/legal/`). PascalCase filename matching
   the page's purpose (`Settings.jsx`, not `settings-page.jsx`).
2. **Wrap it in the right shell** — don't build your own header/sidebar:
   - Student portal page → wrap your content in `<DashboardShell>` (see
     `pages/Dashboard.jsx` for the pattern).
   - Incubator portal page → wrap in `<IncubatorShell>` (see
     `pages/incubator/Incubator.jsx`).
   - Admin portal page → wrap in `<AdminShell>` (see `pages/admin/Admin.jsx`).
   - Public/auth page → these already get wrapped by `AuthLayout` via the
     router (see step 3), you don't add anything yourself.
3. **Add the route** in `src/router.jsx`. Follow the existing pattern —
   add one line to the route array with your path and element. This file
   is the one place every new page touches, see [Section 4](#4-avoiding-conflicts-when-multiple-people-build-the-same-portal)
   for how to keep that low-risk.
4. **Set the page title** with `useDocumentTitle('Your Title — BOCC')` at
   the top of the component (see `pages/Dashboard.jsx`).
5. **Not building the real thing yet?** Wrap the not-ready part in
   `<ComingSoon label="...">` — never a dead link, never a fake working
   button. See any existing page for the pattern.

## 3. Reuse before you build

Before writing a new component, check `components/ui/` and
`components/layout/` — most of what a new screen needs already exists:

| Need | Use |
|---|---|
| A button | `components/ui/Button.jsx` |
| A card/panel | `components/ui/Card.jsx` |
| A text input | `components/ui/Input.jsx` |
| The BOCC logo | `components/ui/Logo.jsx` — **never** a raw `<img src="/logos/...">`, the sizing/theme-switching logic lives in this component |
| A "not built yet" marker | `components/ui/ComingSoon.jsx` |
| Light/dark toggle | `components/ui/ThemeToggle.jsx` |
| Reading/toggling theme | `useTheme()` from `components/ui/ThemeProvider.jsx` |
| Top nav on a public/auth page | `components/layout/PublicNav.jsx` — already wired into `AuthLayout`, only import it directly if you're building a new *public* page outside that layout |
| Dashboard side panel | `components/layout/Sidebar.jsx` — already wired into all three shells, you should never need to import this directly |
| A status/category pill | `components/ui/Badge.jsx` — `variant="success\|warning\|error\|info\|neutral\|brand"`, Title Case content (not uppercase — the component doesn't force a case, older screens' own inline badges predate this and are uppercase, don't "fix" them to match unless you're already touching that file) |
| A metric tile (label + big number + trend) | `components/ui/StatCard.jsx` |
| A dense list/queue with columns | `components/ui/DataTable.jsx` — desktop grid, auto-collapses to stacked cards below `md`. Read the component's own doc comment before adding a 6+ column table; see the gotcha in §6 about column count vs. container width |
| A confirmation/decision dialog | `components/ui/Modal.jsx` — Escape-to-close, backdrop-click-to-close, already wired for `role="dialog"` |
| A role-specific signup form | `components/auth/RoleSignupForm.jsx` — owns password/confirm/strength/terms/submit for all 5 `/signup/<role>` pages; a new page just passes `fields` (its own field list) + copy, see `pages/auth/StudentSignup.jsx` for the ~25-line pattern. Don't build a 6th copy of the password/terms handling by hand |

The design guide (ask whoever's tracking `Frontend/Working/` for the
current copy — that folder is a scratch space that gets cleared out, so
don't rely on a specific path there staying valid) explicitly says: **don't
create a custom one-off variation of a button/input/card for a single
screen.** If an existing component doesn't fit, that's a real conversation
to have before writing a new one, not a silent workaround.

## 4. Avoiding conflicts when multiple people build the same portal

Since pages are one-file-per-screen, two people building *different*
screens of the same portal (e.g. one person on Student Notifications,
another on Student Journey) essentially never touch the same file — normal
git merges handle that with zero manual work.

The few files everyone shares, and how to keep them low-conflict:

- **`src/router.jsx`** — every new page adds one line here. Keep your
  addition to a single line/entry, don't reformat the whole file, and pull
  the latest `router.jsx` right before you add your line so you're not
  resolving against a stale copy.
- **`components/dashboard/DashboardShell.jsx` / `incubator/IncubatorShell.jsx`
  / `admin/AdminShell.jsx` `NAV_ITEMS` array** — if your new page needs a new
  sidebar entry, you're adding one object to this array. Same rule: pull
  first, add your one entry, don't touch surrounding entries. A nav item
  needs `real: false` and `href: '#'` instead of a route if the page behind
  it doesn't exist yet — it renders as a `ComingSoon` automatically, see
  `Sidebar.jsx`.
- **`src/index.css`** — only touch this if you're adding a genuinely new
  design token that doesn't exist yet (check first, most things you need
  already exist — see `Working/design-tokens-reference.md` or the design
  guide for the full token list). Don't add one-off hardcoded colors here
  or in your page.

If you do hit a merge conflict in one of these, it's almost always two
people's single-line additions sitting next to each other — keep both
lines, don't take "theirs" or "mine."

## 5. Design token rules (the part most likely to bite you)

- **Never hardcode a hex color or an arbitrary pixel value** (`text-[14px]`,
  `#0B0B0B`) when a token already covers it. Use the Tailwind classes
  already wired to `src/index.css`'s tokens: `bg-brand-black`,
  `bg-canvas-bg`, `text-text-heading`, `text-text-body`, `text-text-muted`,
  `border-border-subtle`, `text-body`, `text-small`, `text-caption`, etc.
- **Watch which tokens are theme-reactive vs fixed.** Most tokens
  (`canvas-bg`, `surface-white`, `text-heading`, `text-body`, `text-muted`,
  `border-subtle`, `divider-line`) flip value between light and dark mode —
  that's the point of them. `brand-black` and `accent-neon` are the two
  *fixed* tokens, identical in both themes.
  **The bug this causes:** if you put an element on a surface that is
  itself always one fixed color (like the dashboard `Sidebar`, which is
  always `bg-brand-black` regardless of theme) and then color its text
  with a theme-reactive token like `text-canvas-bg`, it looks fine in
  light mode and goes **nearly invisible in dark mode** — because
  `canvas-bg` itself flips to a near-black value in dark mode, and you'd
  be rendering near-black text on a permanently-black background. This
  exact bug shipped in `Sidebar.jsx` once already (inactive nav labels
  were unreadable in dark mode) and was fixed by switching to fixed
  `white/70`-style values. **Rule of thumb:** if the surface you're
  styling never changes with the theme, none of the colors on top of it
  should be theme-reactive tokens either — use `white`/`black` at whatever
  opacity you need instead.
- **Fonts:** Poppins for headings/buttons/nav labels, Inter for body text/
  forms/tables/captions — this is enforced by which `font-*` class you use
  with which `text-*` size token, check an existing similar element rather
  than guessing.

## 6. Gotchas we've already hit (read this before you rediscover them)

- **`dark:` utility classes require the custom variant registered in
  `src/index.css`.** Tailwind v4 defaults `dark:*` to
  `@media (prefers-color-scheme: dark)` — the OS setting — unless a custom
  variant is declared. This app's theme toggle is class-based (`.dark` on
  `<html>`, via `ThemeProvider`), completely independent of the OS. The line
  `@custom-variant dark (&:where(.dark, .dark *));` near the top of
  `src/index.css` is what makes `dark:*` actually track the in-app toggle
  instead of silently tracking the OS setting regardless of what the user
  clicked. **Do not delete that line.** Before this was added, ~12 `dark:*`
  usages across the Incubator pages looked like they worked (because dev
  machines often have OS dark mode on) but were completely disconnected
  from the actual toggle — confirmed by testing with the OS in dark mode
  and the in-app toggle in light mode, where they still applied.
- **Never hardcode a hover/disabled color on an `action-bg`/`action-text`
  button.** `action-bg` inverts between themes (black-on-white in light,
  light-fill-on-dark in dark — see `src/index.css`). A hardcoded hover like
  `hover:bg-[#1F2937]` only reads correctly in whichever theme it was
  designed against; in the other theme it makes the button's text
  illegible on hover. Use `hover:opacity-90` instead — it dims/brightens
  whatever the current theme's real colors already are, so it's correct in
  both automatically. This shipped broken on 10 different buttons across
  the app before being caught.
- **Never ship a `grid-cols-N` (N > 1) with no responsive prefix on a
  content page.** `grid-cols-5` with nothing else forces 5 columns at
  *every* viewport, including a 375px phone. Always give it a mobile-safe
  base and scale up: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-5` (or
  whatever fits the content) — see `pages/auth/RoleSelection.jsx` for the
  fixed version of exactly this bug.
- **The Sidebar has a mobile drawer built in — use it, don't build a
  second one.** `Sidebar.jsx` takes `isOpen`/`onClose` props for its
  below-`lg` slide-in behavior; each shell (`DashboardShell`,
  `IncubatorShell`) owns a small `useState` for this and wires it to a
  `<Menu>` button in its own header (since that button lives in the shell,
  not in `Sidebar`). If you're adding a third portal shell later, copy that
  same three-piece pattern (state in the shell, `Menu` button in the
  shell's header, `isOpen`/`onClose` passed down to `Sidebar`) instead of
  inventing a new mobile-nav mechanism.
- **A multi-panel layout (list + detail, like `incubator/Messages.jsx`)
  needs an explicit "which panel is showing" state on mobile, not just
  `flex-col` stacking.** Two full-height panels stacked vertically inside a
  fixed-viewport-height container just buries the second panel below a
  scroll, it doesn't make either one usable. Look at `Messages.jsx`'s
  `mobileView` state (`'list' | 'thread'`) for the pattern: both panels
  render `hidden lg:flex` and only one of `flex`/`hidden` is toggled by
  state below `lg`, with a back button in the detail view to return.
- **A bare `Nfr` CSS Grid track will not shrink below its content's
  min-content width — it blows out the container instead.** `DataTable.jsx`
  builds its column grid from a `--cols` CSS variable; every track is
  wrapped in `minmax(0, Nfr)`, not a bare `Nfr`, specifically so a cell with
  unbreakable content (a `Badge`, an IP address, a long id) shrinks to its
  allotted share and truncates/wraps instead of pushing the whole table past
  its rounded border. This is invisible on a 4-5 column table and only shows
  up once you're past ~6-7 columns in a narrower container (it shipped
  broken on the 7-column Audit Log table, sitting in a 9/12-width column
  next to a sidebar panel). If you add a wide table, also add `truncate`
  (plus a `title={fullValue}` for hover access to the untruncated text) to
  any cell whose content is a single unbreakable string — the header row
  already truncates by default, data cells don't unless you opt in, since
  some columns (like a wrapping description) want to wrap instead.
- **The Sidebar's desktop collapse (icon-only ↔ full width) is shared state,
  not per-shell.** `useSidebarCollapsed.js` is a small localStorage-backed
  hook; all three shells call it and pass `collapsed`/`onToggleCollapse`
  down to `Sidebar`, and each shell's own `<main>` margin
  (`lg:pl-20` vs `lg:pl-[264px]`) has to agree with whatever `Sidebar` is
  currently rendering — copy the exact ternary from an existing shell
  rather than hardcoding one width.
- **If a `computer` screenshot in this project's browser tool ever shows a
  large blank/black band above real content that has otherwise rendered
  correctly** (confirmed via `getComputedStyle`/`getBoundingClientRect` in
  `javascript_tool`, or just by taking a second screenshot), that's a
  transient capture glitch in the tool itself, not a CSS bug — it showed up
  once after a `scroll` action mid-session with zero console errors and a
  `position: sticky; top: 0` header whose real `rectTop` was `0`. Don't
  "fix" real code chasing a screenshot artifact; re-screenshot or verify via
  JS first.
- **A `computer` click at a coordinate captured before a DOM change (a
  disabled→enabled button, a re-rendered list) can silently land on the
  wrong element** — the click "succeeds" with no error, but nothing
  happens, because the page reflowed between the coordinate capture and
  the click. Don't conclude the underlying code is broken from a single
  failed automated click. Re-run `read_page` for a fresh ref immediately
  before clicking, or verify by dispatching the click via
  `javascript_tool` (`document.querySelector(...).click()`) — if that
  makes it work, the component was fine all along.
- **`lucide-react` does not export brand/logo icons like `Github`** — only
  generic UI icons (this version's git-related set is `GitFork`,
  `GitBranch`, `GitCommit`, etc., no literal GitHub mark). Importing a
  nonexistent icon name doesn't fail at build time — Vite's dev server
  throws a runtime `SyntaxError` on first load instead, which renders as a
  fully blank page with no visible React error. If a route renders
  completely blank with an empty `#root` and no console error, check the
  actual terminal running `npm run dev` for an "Unhandled error" line
  before assuming it's a logic bug.

## 7. Before calling a screen "done"

- Test it in **both light and dark theme**.
- Test it at **desktop (≥1024px) and mobile (<768px)** widths — the
  sidebar/nav collapse differently at each.
- Check the browser console for errors on the route.
- If you touched `Logo`, `Sidebar`, or `PublicNav`, check every place that
  uses it, not just your own page — they're shared.
- Run `npm run build` — it must complete with 0 errors before you consider
  the work finished, even though there's no CI enforcing this yet.
