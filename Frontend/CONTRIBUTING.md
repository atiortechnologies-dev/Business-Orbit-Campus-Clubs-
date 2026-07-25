# Contributing to BOCC-Shared-App

This is the shared frontend for **every** BOCC role (Student, Incubator,
Admin, Investor, Mentor, Company, plus Auth/Onboarding and public
Landing) — one Vite + React app, not one project per role. Read this
before adding a new screen, especially if someone else might be building
a different screen of the *same* portal at the same time as you.

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
                              /reset-password, /role-selection, /signup/*,
                              and every /onboarding/* route

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
    landing/                  Public marketing pages, no auth required —
                               Home.jsx, Student.jsx, Mentor.jsx,
                               Investor.jsx, Companies.jsx, Incubator.jsx —
                               see INTEGRATION.md's "Public Landing Pages"
                               section for what's real vs. stub on each
    onboarding/               Post-signup flow, wrapped in AuthLayout:
                               Welcome.jsx → VerifyEmail.jsx →
                               VerificationProgress.jsx (or
                               ApplicationRejected.jsx), then
                               complete-profile/{Student,Mentor,Investor,
                               Incubator,Company}.jsx — 5 thin pages behind
                               components/onboarding/CompleteProfileShell.jsx
    investor/                 Investor.jsx (dashboard), IncomingPitchDecks.jsx,
                               PitchDeck.jsx
    mentor/                   Mentor.jsx (dashboard), Requests.jsx, Chats.jsx,
                               Meetings.jsx, Profile.jsx
    company/                  Dashboard.jsx, MyOpportunities.jsx — originally
                               added by a different contributor directly to
                               main; fully remediated onto this file's
                               conventions, see components/company/ below

  components/
    ui/          Generic, reusable anywhere: Button, Card, Input, Logo,
                 ComingSoon, ThemeToggle, ThemeProvider, Badge, StatCard,
                 DataTable, Modal
    layout/      PublicNav (shared top nav for all public/auth pages),
                 Sidebar (shared side panel — used by every authenticated
                 portal's shell: Student, Incubator, Admin, Investor,
                 Mentor, Company)
    auth/        RoleCard, PasswordStrengthMeter, RoleSignupForm (shared
                 shell behind all 5 /signup/<role> pages — see §3)
    onboarding/  CompleteProfileShell (shared shell behind all 5
                 complete-profile/<role> pages, same pattern as
                 RoleSignupForm above) + shared field components: TagInput,
                 CheckboxPills, RadioPills, SelectField, TextAreaField
    dashboard/   DashboardShell — the Student portal's page wrapper
    incubator/   IncubatorShell — the Incubator portal's page wrapper
    admin/       AdminShell — the Admin portal's page wrapper
    investor/    InvestorShell — the Investor portal's page wrapper
    mentor/      MentorShell — the Mentor portal's page wrapper
    company/     CompanyShell (the fifth instance of the same shell
                 pattern) — the Company portal's page wrapper, plus its
                 page-content components (ApplicantTable, RightPanel,
                 StatsRow, OpportunitiesTable)
    landing/     Public marketing-page sections — landing/{Navbar,Footer,
                 FAQ,...}.jsx shared across pages, plus one subfolder per
                 role (landing/student/, landing/mentor/, etc.) for
                 page-specific sections. Kept fully separate from
                 components/{dashboard,incubator,admin}/ even where a name
                 collides — landing/incubator/ (marketing sections) and
                 incubator/ (IncubatorShell, the real authenticated shell)
                 are deliberately different folders; the original commit
                 mixed them into one and it's not repeating that mistake.

  hooks/
    useDocumentTitle.js      Call this at the top of a page to set the tab title
    useSidebarCollapsed.js   Backs the desktop sidebar's collapse/expand
                              toggle; localStorage-persisted, shared by all
                              portal shells so the state survives navigation

  utils/
    csv.js                   downloadCsv(filename, columns, rows) — turns
                              local table state into a real .csv download,
                              shared by every "Export CSV" action

public/
  logos/       Brand logo PNGs — don't add new logo assets without checking
               with design first, filenames follow a strict convention
               (see Logo.jsx's own doc comment)
```

## 2. Adding a new page — the standard pattern

1. **Create the file** under `src/pages/`, matching the existing
   organization: student-portal pages sit flat in `pages/`, Incubator pages
   go in `pages/incubator/`, auth pages in `pages/auth/`, public pages in
   their own subfolder (see `pages/legal/`, `pages/landing/`). PascalCase
   filename matching the page's purpose (`Settings.jsx`, not
   `settings-page.jsx`).
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
- **The `computer` tool's `key` action for Enter/Return does not reliably
  populate `KeyboardEvent.key`.** Verified directly: attaching a capturing
  `keydown` listener and pressing "Return" via `computer` produced
  `e.key === ''` (empty string), not `'Enter'` — so any `onKeyDown`
  handler written the normal way (`if (e.key !== 'Enter') return;`, the
  same pattern used by `TagInput.jsx`'s add-tag-on-Enter and
  `Chats.jsx`'s send-on-Enter) will silently no-op when driven by this
  tool, even though a real keyboard's Enter key works fine. Also: a prior
  `form_input` call that sets a controlled input's value does not
  reliably fire React's `onChange`, so `draft`/similar state can stay
  stale even though the DOM's `.value` looks correct in a screenshot. To
  verify an Enter-to-submit interaction actually works, don't trust a
  `computer key: "Return"` press alone — either use `computer type` to
  enter real per-character keystrokes (those fire real `input` events)
  followed by the key press and confirm the *result*, or dispatch a
  spec-correct event directly for verification purposes: `el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))`
  after setting `.value` via the native setter. If that makes it work,
  the component was fine all along — this is a tool-dispatch gap, not an
  app bug.
- **`lucide-react` does not export brand/logo icons like `Github`** — only
  generic UI icons (this version's git-related set is `GitFork`,
  `GitBranch`, `GitCommit`, etc., no literal GitHub mark). Importing a
  nonexistent icon name doesn't fail at build time — Vite's dev server
  throws a runtime `SyntaxError` on first load instead, which renders as a
  fully blank page with no visible React error. If a route renders
  completely blank with an empty `#root` and no console error, check the
  actual terminal running `npm run dev` for an "Unhandled error" line
  before assuming it's a logic bug.
- **Not every `ComingSoon` deserves to stay one — check whether it's
  actually self-contained before reaching for the stub.** The rule applied
  across the whole app in the pass that added this note: a `ComingSoon`
  stays if it needs a backend, a real uploaded file, or a screen that
  doesn't exist yet; it gets built if it's a client-side interaction
  operating on data already on the page (a filter, a local add/remove, a
  modal showing text, a client-generated file). Three small utilities
  exist specifically so you don't have to stub these:
  - **CSV export** — `downloadCsv(filename, columns, rows)` in
    `src/utils/csv.js`. Serializes whatever's in local state to a real
    `.csv` via `Blob` + `URL.createObjectURL`. No backend needed for
    "export what's on screen right now."
  - **Calendar events** — build a minimal `.ics` string by hand and
    download it the same `Blob`/`URL.createObjectURL` way (see
    `downloadIcs` in `pages/Notifications.jsx` or
    `downloadReviewMeetingIcs` in `journey/mvp/SubmissionSuccess.jsx`).
    Don't reach for a calendar-API integration for a single "add this one
    event" button.
  - **File attachments the user just picked** — if a user selects a file
    in *this* session (a chat attachment, a photo, a logo), you already
    have its real bytes. `URL.createObjectURL(file)` gives a real,
    downloadable/viewable blob URL — render it as an actual `<a
    download>`/`<img>`, don't wrap it in `ComingSoon`. That's different
    from a *pre-seeded mock* attachment (a filename/size with no
    underlying `File` object) — those stay `ComingSoon` since the bytes
    genuinely never existed. See `pages/incubator/Messages.jsx`'s
    attachment rendering for both cases side by side.
  - Also watch for **dishonest counts riding along with a stub**
    ("Showing 1-4 of 142", "12,482 logs") — when you unstub the real rows,
    fix the count to match what's actually loaded rather than leaving an
    old placeholder total next to real data.
- **Custom SVG illustrations inside a fixed-black container need literal
  `white`, not the `surface-white` token.** Same root cause as the
  Sidebar's own fixed-vs-reactive rule above, but it bit an inline SVG
  this time: `journey/mvp/MvpOverview.jsx`'s "assembling blocks"
  illustration sits inside its own `fill="var(--color-brand-black)"` rect
  (a fixed-black surface, like the sidebar), but the blocks inside it were
  first written with `var(--color-surface-white)` — which flips to a dark
  color in dark mode and went nearly invisible against a background that
  never inverts. Caught by an actual dark-mode screenshot, not by reading
  the code. Fixed by using the literal string `"white"` (optionally with
  `fillOpacity`/`strokeOpacity`) for anything drawn on that fixed surface.
  Contrast with `Dashboard.jsx`'s "idea spark" SVG, which correctly uses
  `var(--color-border-subtle)` for its rings — that illustration has no
  background fill of its own, it sits directly on the page's own
  theme-reactive canvas, so the reactive token is the right call there.
  Rule of thumb: the token choice depends on what's *behind* the shape,
  not on what the shape depicts.

## 7. Before calling a screen "done"

- Test it in **both light and dark theme**.
- Test it at **desktop (≥1024px) and mobile (<768px)** widths — the
  sidebar/nav collapse differently at each.
- Check the browser console for errors on the route.
- If you touched `Logo`, `Sidebar`, or `PublicNav`, check every place that
  uses it, not just your own page — they're shared.
- Run `npm run build` — it must complete with 0 errors before you consider
  the work finished, even though there's no CI enforcing this yet.

## 8. Deferred: a motion/animation pattern worth a team decision

The public landing pages (`pages/landing/*`) were originally built by Shivom
with `framer-motion` — a staggered entrance animation on page load, plus
scroll-triggered fades further down each page. Every other screen in this
app does motion with plain CSS transitions (`transition-all duration-200`,
the `animate-fade-in`/`animate-slide-in` utilities in `index.css`), so
adding an animation *library* is a real, app-wide decision — not something
to slip in through one feature. The landing pages were rebuilt on the CSS-
transition convention to stay consistent with the rest of the app, and
`framer-motion` was removed from `package.json` accordingly.

The original pattern is preserved here rather than left buried in git
history, in case the team wants to evaluate adopting it more broadly later:

```jsx
// Page-load stagger — wrap a section, then each direct child gets its own
// entrance timing automatically via variants propagation.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { y: 28, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 22, stiffness: 120 } },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.h1 variants={itemVariants}>...</motion.h1>
  <motion.p variants={itemVariants}>...</motion.p>
</motion.div>

// Scroll-triggered fade-in further down a long page — fires once, when the
// element enters the viewport, instead of on initial mount.
<motion.div
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  ...
</motion.div>
```

The full original implementation (before the rebuild) is preserved in git
history on `main` at commit `1c74d81` — every file under
`src/components/{student,mentor,investor,companies,landing}/` and the old
`src/components/incubator/{Hero,FAQ,Footer,...}.jsx` at that commit shows
the pattern applied across a whole page, not just the snippet above.
`git show 1c74d81:Frontend/src/components/student/Hero.jsx` is a good
starting point.

**Not currently applied anywhere in the shipping app.** If the team decides
to adopt it: add `framer-motion` back to `package.json`, and apply it
consistently everywhere rather than only on the pages that happen to have
had it first — the whole point of this note is to avoid exactly that kind
of one-off inconsistency.

## 9. Integrating a second intern's repo (Investor/Mentor portals + onboarding)

The Investor portal, Mentor portal, and onboarding/verification flow (see
`INTEGRATION.md`'s corresponding sections) were ported from a second
intern's (Madhu's) separate repo — a different, older codebase (React 18,
Tailwind v3 with a real `tailwind.config.js`, `react-router-dom` v6) rather
than a branch of this one. Notes specific to that kind of integration,
distinct from the Shivom landing-page pass documented above:

- **A case-only import mismatch (`./MentorChats` vs. actual folder
  `Mentorchats`) built and ran fine in the source repo on macOS but would
  hard-fail on any case-sensitive filesystem (Linux CI, Vercel).** macOS's
  default filesystem is case-insensitive, so `import from
  './pages/MentorChats/MentorChats'` resolved against a real folder named
  `Mentorchats` without complaint locally. If you're ever pulling in
  another contributor's repo and it's macOS-only tested, don't trust a
  clean local build as proof the imports are actually correct — grep for
  import paths against real `ls` output of the target folders, or build
  once on a case-sensitive filesystem/CI runner before trusting it.
- **A source repo with role-specific near-duplicate pages (5 files sharing
  ~80% identical chrome, differing only in field content) is a signal to
  build one shared shell + thin per-role pages, not port 5 near-duplicate
  files.** This codebase already had exactly this pattern solved once
  (`RoleSignupForm.jsx` + 5 thin `*Signup.jsx` pages) — the CompleteProfile
  step reused that same shape rather than reinventing it. Before porting a
  batch of similar-looking source files 1:1, check whether an existing
  shared-component pattern in *this* repo already covers the shape.
- **Cross-checked persona names across a source repo's own files before
  trusting any single one.** Madhu's source had 3 different names for the
  Mentor's own identity across her 5 Mentor files (an internal
  inconsistency in her repo, not intentional), one of which ("Alex
  Rivera") collided with this app's real Admin persona. Consolidated to
  one name (Priya Anand) used consistently across all 5 rebuilt Mentor
  screens, and renamed the one incidental third-party data collision
  found in seed data too. When porting authenticated-portal content from
  an external source, grep the *whole* source folder for the persona name
  before picking one, not just the first file you read — and check it
  against this app's own existing personas (Alex Chen/Student, Sarah
  Jenkins/Incubator, Alex Rivera/Admin) for collisions.
- Same "genericize real institution names" rule as `CONTRIBUTING.md` §8's
  LogoStrip note applied again here: the onboarding Welcome screen's
  chapter card named a real institution ("UIET Chandigarh Chapter, Panjab
  University") — genericized to a fictional "Riverside Tech Chapter."
