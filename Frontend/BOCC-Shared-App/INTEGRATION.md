# Integration Guide

What's real versus what's a visual stub, screen by screen — verified by
reading the actual code, not assumed from what it looks like. Each stub
lists the exact file/function to replace.

**How to read "Real" vs "Stub":**
- **Real** — genuine client-side logic. Works today, needs no backend to
  keep working (validation, local UI state, toggles, etc.).
- **Stub** — looks finished, does nothing persistent. Has a `// TODO(backend)`
  comment at the exact line where a real API call belongs.
- **Coming Soon** — visibly marked as not built (hover/focus tooltip,
  `aria-disabled`), not hidden or broken. No action needed to make these
  "honest" — they already are. Action needed only to actually build them.

---

## Auth

### `/login` — `app/(auth)/login/page.jsx`
- **Real:** email/password format validation, password show/hide, remember-me
  checkbox (visual toggle, not persisted).
- **Stub:** `handleSubmit` — any validly-formatted email/password redirects
  straight to `/dashboard`. No real authentication happens; anyone can "log
  in" as anyone. Replace with a real `POST /api/auth/login`, keep the
  redirect on success, surface API errors via the existing `errors` state
  on failure.

### `/forgot-password` — `app/(auth)/forgot-password/page.jsx`
- **Real:** email validation, submit swaps the card to a confirmation view
  (client state only).
- **Stub:** no email is ever sent. The confirmation view is cosmetic.
- **Coming Soon:** Support Center link.

### `/reset-password` — `app/(auth)/reset-password/page.jsx`
- **Real:** live password-strength calculation, confirm-password match
  validation, two independent eye toggles.
- **Stub:** `handleSubmit` — redirects to `/login` without ever changing a
  password anywhere. Replace with `POST /api/auth/reset-password`.

### `/role-selection` — `app/(auth)/role-selection/page.jsx`
- **Real:** native radio-group role selection (full keyboard support).
  "Student" → real navigation to `/dashboard`.
- **Coming Soon:** Mentor/Investor/Incubator/Company — show an inline
  message instead of navigating (those portals don't exist in this repo).

---

## Student Portal

### `/dashboard` — `app/dashboard/page.jsx`
- **Stub:** everything is a static snapshot — "Welcome back, Alex," all 4
  stat numbers, the 5-stage tracker, all 3 notification previews. None of it
  is tied to a real logged-in user; there's no per-user state anywhere yet.
- **Real:** "Start Your Journey" / "Begin" → real navigation to
  `/build-startup/journey`. "View All" → real navigation to `/notifications`.
- **Coming Soon:** Investors/Incubators/Freelancing/Profile quick actions,
  all 4 Resources cards, sidebar Mentors/Investors/Incubators/Freelancing/
  Profile/Help, header Search/Settings.

### `/notifications` — `app/notifications/page.jsx`
- **Stub:** 3 hardcoded notification cards, not fetched from anywhere.
- **Coming Soon:** Search, filter tabs (all except "All," which is just a
  static current-view indicator), View Details, Dismiss, Add to Calendar,
  Mark all as read, Delete, pagination pages 2/3 and next.
- **Real:** "Review Progress" → real navigation to `/build-startup/journey`.

### `/build-startup/journey` — `app/build-startup/journey/page.jsx`
- **Stub:** entire page is static — roadmap, stats, achievements.
- **Real:** breadcrumb "Dashboard" and "Back to Dashboard" → real navigation.
- **Coming Soon:** both "Start Your Journey" CTAs, the active Ideation stage
  circle (no stage-detail page exists yet).

### `/legal/privacy-policy` — `app/legal/privacy-policy/page.jsx`
- **Real:** in-page anchor navigation (left sub-nav → legal sections),
  `legal@bocc.edu` is a genuine `mailto:` link, "Login"/"Register"/
  "Accept & Continue" → real navigation.
- **Coming Soon:** top nav (Clubs/Events/Partners/About), Download PDF,
  most footer links.

---

## Incubator Portal

### `/incubator` — `app/incubator/page.jsx`
- **Stub:** all stats, activity, and lists are hardcoded.
- **Real:** "Review Applications" and every "Review" button → real
  navigation to `/incubator/applications`.
- **Coming Soon:** "View Startup Tracker," "Schedule Reviews."

### `/incubator/applications` — `app/incubator/applications/page.jsx`
- **Real:** Stage/Industry/Status filters — genuinely filter the 5 visible
  rows client-side (fixed during this audit; the dropdown options
  previously didn't match the actual row data at all, so most filter
  combinations silently returned zero results even though the controls
  looked functional).
- **Stub:** filtering only operates on these 5 hardcoded rows, not a real
  dataset. Clicking any row navigates to the **same** single review page
  regardless of which startup was clicked — there's only one seeded
  application (NeuralPath AI) in this repo.
- **Coming Soon:** Filter, Export, pagination.

### `/incubator/applications/review` — `app/incubator/applications/review/page.jsx`
- **Real:** Reviewer Notes textarea (typing works, not persisted),
  Approve/Request Revisions/Reject single-select, Save Draft and Submit
  Decision both show real transient confirmation UI.
- **Stub:** none of the above persists anywhere — reload the page and it's
  gone. Submit Decision needs a real `POST` once there's somewhere for a
  decision to go.
- **Coming Soon:** Print PDF, both document downloads.

### `/incubator/messages` — `app/incubator/messages/page.jsx`
- **Real:** switching conversations, typing and sending a message (appends
  to that conversation's local state immediately, Enter-to-send with
  Shift+Enter for newline).
- **Stub:** sent messages live only in React state — reload and they're
  gone, and the "other party" never actually receives anything. This is
  the most visually convincing stub in the app and the one most likely to
  be mistaken for real — it needs an actual transport (websocket/polling)
  and persistence layer, not just a bigger mock. Only the Acme Robotics
  thread has real seeded message history; the other 3 conversations show
  their preview line as a single static message with a visible "seeded
  demo channel" notice.
- **Coming Soon:** New Message, video/voice/options icons, attach/emoji/
  image icons in the composer, all 4 right-panel Quick Actions.

### `/incubator/settings` — `app/incubator/settings/page.jsx`
- **Real:** every field is a genuine controlled input (typing works),
  Focus Industries chip removal, Working Hours day toggles, Email
  Notifications toggle, Cancel Changes (resets the form to defaults).
- **Stub:** Save Changes shows a real transient confirmation but persists
  nothing — reload and every edit is gone.
- **Coming Soon:** View Public Profile, Download Data Audit, Update
  Organization Logo, Update Password, Deactivate Account.

---

## Cross-cutting

- **Dark mode** is fully real and complete — no backend dependency, nothing
  to integrate.
- **`ComingSoon`** (`components/ui/ComingSoon.jsx`) is the single shared
  marker for anything not built. To turn a feature on: replace the
  `<ComingSoon>` wrapper with a real `<Link>`/button and wire the action —
  don't build a second "not ready" pattern elsewhere.
- No environment variables are read anywhere yet (see `.env.example`).
- No API base URL, auth provider, or database of any kind is wired in.
