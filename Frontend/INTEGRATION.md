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

### `/login` — `src/pages/auth/Login.jsx`
- **Real:** email/password format validation, password show/hide, remember-me
  checkbox (visual toggle, not persisted).
- **Stub:** `handleSubmit` — any validly-formatted email/password redirects
  straight to `/dashboard`. No real authentication happens; anyone can "log
  in" as anyone. Replace with a real `POST /api/auth/login`, keep the
  redirect on success, surface API errors via the existing `errors` state
  on failure.

### `/forgot-password` — `src/pages/auth/ForgotPassword.jsx`
- **Real:** email validation, submit swaps the card to a confirmation view
  (client state only).
- **Stub:** no email is ever sent. The confirmation view is cosmetic.
- **Coming Soon:** Support Center link.

### `/reset-password` — `src/pages/auth/ResetPassword.jsx`
- **Real:** live password-strength calculation, confirm-password match
  validation, two independent eye toggles.
- **Stub:** `handleSubmit` — redirects to `/login` without ever changing a
  password anywhere. Replace with `POST /api/auth/reset-password`.

### `/role-selection` — `src/pages/auth/RoleSelection.jsx`
- **Real:** native radio-group role selection (full keyboard support).
  Continue → real navigation to `/signup/<role>` for all 5 roles.

### `/signup/student`, `/signup/company`, `/signup/investor`, `/signup/mentor`, `/signup/incubator`
— `src/pages/auth/{Student,Company,Investor,Mentor,Incubator}Signup.jsx`,
shared logic in `src/components/auth/RoleSignupForm.jsx`
- **Real:** every field is a controlled input, password-match validation,
  terms-required validation, live password-strength meter (reuses
  `PasswordStrengthMeter`), show/hide password toggle.
- **Stub:** `handleSubmit` — on success shows an inline "Account Created"
  card (client state only) with a link to `/login`. Nothing is persisted;
  no account exists after a refresh. Replace with a real
  `POST /api/auth/register`, keep the success card on success, surface API
  errors via the existing `error` state on failure.
- Note: only Student's portal (`/dashboard`) actually exists past signup.
  Company/Investor/Mentor/Incubator can create an "account" and see the
  confirmation card, but there's no real destination for them to log into
  yet — that's a product scope question for the team, not something this
  frontend can resolve on its own.

---

## Student Portal

### `/dashboard` — `src/pages/Dashboard.jsx`
- **Stub:** everything is a static snapshot — "Welcome back, Alex," all 4
  stat numbers, the 5-stage tracker, all 3 notification previews. None of it
  is tied to a real logged-in user; there's no per-user state anywhere yet.
- **Real:** "Start Your Journey" / "Begin" → real navigation to
  `/build-startup/journey`. "View All" → real navigation to `/notifications`.
- **Coming Soon:** Investors/Incubators/Freelancing/Profile quick actions,
  all 4 Resources cards, sidebar Mentors/Investors/Incubators/Freelancing/
  Profile/Help, header Search/Settings.

### `/notifications` — `src/pages/Notifications.jsx`
- **Stub:** 3 hardcoded notification cards, not fetched from anywhere.
- **Coming Soon:** Search, filter tabs (all except "All," which is just a
  static current-view indicator), View Details, Dismiss, Add to Calendar,
  Mark all as read, Delete, pagination pages 2/3 and next.
- **Real:** "Review Progress" → real navigation to `/build-startup/journey`.

### `/build-startup/journey` — `src/pages/BuildStartupJourney.jsx`
- **Stub:** stats and achievements are static; stage progression (which
  stage is "current" vs "locked") is hardcoded to Ideation, not derived
  from any real per-student state.
- **Real:** breadcrumb "Dashboard" and "Back to Dashboard" → real
  navigation. Both "Start Your Journey" CTAs and the active Ideation stage
  circle → real navigation into `journey/ideation/`.

### Startup Journey — Ideation Stage — `src/pages/journey/ideation/*.jsx`
Six screens: `IdeationOverview` → `IdeaSubmission` → `SubmissionConfirmation`,
plus `ReviewMeeting`, `ReviewResult`, `TemplatesResources`.
- **Real:** `IdeaSubmission`'s full form (controlled inputs, file select),
  `ReviewMeeting`'s prep checklist + Confirm/Reschedule (instant inline
  banner state), `ReviewResult`'s content is fully real (single determined
  outcome, not a toggle).
- **Stub:** every submit/save button — `IdeaSubmission`'s Submit and Save
  Draft, `ReviewMeeting`'s Confirm/Reschedule — all have a
  `// TODO(backend)` at the exact line a real call belongs. `ReviewResult`'s
  feedback text and stats are hardcoded, not tied to a real reviewer
  decision anywhere.
- **Coming Soon:** all 4 resource cards' download/preview actions in
  `TemplatesResources`.

### Startup Journey — Validation Stage — `src/pages/journey/validation/*.jsx`
Seven screens: `ValidationOverview` → `SurveyTracker` → `EvidenceUpload` →
`ReportSubmission` → `SubmissionConfirmation`, plus `ReviewMeeting`,
`ReviewResult`.
- **Real:** `ValidationOverview`'s action checklist (toggles, drives the
  progress bar), `EvidenceUpload`'s real file-select state (no fake
  progress bars — deliberately not replicating the source wireframe's
  static 100%/65% upload rows), `ReportSubmission`'s declaration checkbox
  genuinely gates the Submit button, `ReviewMeeting`'s add-note thread
  (real local state, not persisted), `ReviewResult`'s tab-switching
  between Approved/Revision Required/Rejected (all 3 are real, wired
  states — not a mockup showing two side by side).
- **Stub:** every submit/save button has a `// TODO(backend)` at the exact
  call site — `SurveyTracker`'s response counts, `ReportSubmission`'s
  submit, `ReviewMeeting`'s Confirm/Reschedule/add-note. None of it
  survives a reload.
- **Coming Soon:** `ValidationOverview`'s 3 resource downloads,
  `SurveyTracker`'s Add Survey Responses / Upload Results.

### Startup Journey — MVP Stage — `src/pages/journey/mvp/*.jsx`
Five screens: `MvpOverview` → `ChooseProductType` → `MvpSubmission` →
`SubmissionSuccess` → `IncubationProofSubmission`.
- **Real:** `ChooseProductType`'s 2-card selection gates Continue,
  `MvpSubmission`'s 9-field form with a **live-updating preview panel**
  (title/description reflect as you type — this is the one place in the
  app with a real-time preview, worth knowing about if you're building
  something similar elsewhere), `MvpSubmission`'s checklist,
  `IncubationProofSubmission`'s real drag-and-drop file state and inline
  "Submitted for verification" banner (no navigation away, matching the
  honest-stub pattern used in Admin's `ReviewOutcome.jsx`).
- **Stub:** every submit/save button has a `// TODO(backend)` — most
  notably `MvpSubmission`'s Submit MVP and `IncubationProofSubmission`'s
  Submit for Verification. `SubmissionSuccess`'s submission ID and dates
  are hardcoded placeholders.
- **Coming Soon:** `MvpSubmission`'s document-upload dropzone action,
  `SubmissionSuccess`'s Add to Calendar.
- Note: `IncubationProofSubmission` was deliberately renamed from the
  source wireframe's "Incubation Verification" — it's a student
  self-service upload (proof of incubator acceptance), unrelated to and
  not overlapping with Admin's identity-verification pipeline below,
  which the original name would have implied.

### `/settings` — `src/pages/Settings.jsx`
- **Real:** every field is a controlled input, Skills & Interests add/remove
  chips, Save Changes shows a real transient confirmation (2s auto-dismiss,
  same pattern as `incubator/Settings.jsx`'s Save Changes).
- **Stub:** Save Changes persists nothing — reload and every edit is gone.
- **Coming Soon:** Change Photo, Change Password, Delete Account.

### `/legal/privacy-policy` — `src/pages/legal/PrivacyPolicy.jsx`
- **Real:** in-page anchor navigation (left sub-nav → legal sections),
  `legal@bocc.edu` is a genuine `mailto:` link, "Login"/"Register"/
  "Accept & Continue" → real navigation.
- **Coming Soon:** top nav (Clubs/Events/Partners/About), Download PDF,
  most footer links.

---

## Incubator Portal

### `/incubator` — `src/pages/incubator/Incubator.jsx`
- **Stub:** all stats, activity, and lists are hardcoded.
- **Real:** "Review Applications" and every "Review" button → real
  navigation to `/incubator/applications`.
- **Coming Soon:** "View Startup Tracker," "Schedule Reviews."

### `/incubator/applications` — `src/pages/incubator/Applications.jsx`
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

### `/incubator/applications/review` — `src/pages/incubator/ApplicationReview.jsx`
- **Real:** Reviewer Notes textarea (typing works, not persisted),
  Approve/Request Revisions/Reject single-select, Save Draft and Submit
  Decision both show real transient confirmation UI.
- **Stub:** none of the above persists anywhere — reload the page and it's
  gone. Submit Decision needs a real `POST` once there's somewhere for a
  decision to go.
- **Coming Soon:** Print PDF, both document downloads.

### `/incubator/messages` — `src/pages/incubator/Messages.jsx`
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

### `/incubator/settings` — `src/pages/incubator/Settings.jsx`
- **Real:** every field is a genuine controlled input (typing works),
  Focus Industries chip removal, Working Hours day toggles, Email
  Notifications toggle, Cancel Changes (resets the form to defaults).
- **Stub:** Save Changes shows a real transient confirmation but persists
  nothing — reload and every edit is gone.
- **Coming Soon:** View Public Profile, Download Data Audit, Update
  Organization Logo, Update Password, Deactivate Account.

---

## Admin Portal

*(Built in an earlier session; missing from this file until now — added
retroactively rather than assumed complete just because the screens look
finished.)*

### `/admin` — `src/pages/admin/Admin.jsx`
- **Stub:** every stat card, the User Distribution bars, the Startup
  Journey Funnel chart, and the Activity Stream are static snapshots, not
  tied to any real data source.
- **Real:** every link in the Critical Actions panel → real navigation
  into the Verification/Review pipelines below.

### `/admin/verification` — `VerificationQueue.jsx`
- **Real:** Role/Status/Chapter filters genuinely filter the visible rows
  client-side.
- **Stub:** filtering only operates on 3 hardcoded rows; row click always
  navigates to the same single detail page ("Alexander Vance") regardless
  of which row was clicked.
- **Coming Soon:** Export CSV, Bulk Action, Download Audit Trail.

### `/admin/verification/detail` — `VerificationDetail.jsx`
- **Real:** Internal Command Notes — typing and adding a note appends to
  local state immediately.
- **Stub:** added notes vanish on reload — no `POST` anywhere. Document
  flag states and the checklist are hardcoded, not derived from the
  (also hardcoded) documents array.

### `/admin/verification/decision` — `VerificationDecision.jsx`
- **Real:** Approve/Reject/Request Documents each open a real `Modal`;
  confirming shows an instant inline banner (no fake delay).
- **Stub:** none of the 3 decisions persist anywhere — reload and the
  banner is gone, the user is still "pending."

### `/admin/reviews` — `ReviewQueue.jsx`
- **Stub:** all 4 stat cards and the table's 3 rows are hardcoded.
- **Coming Soon:** Bulk Action, Export CSV.

### `/admin/reviews/detail` — `ReviewDetail.jsx`
- **Real:** "Schedule Meeting" → real navigation to
  `/admin/reviews/schedule-meeting`. "Begin Evaluation" → real navigation
  to `/admin/reviews/workspace`. "Request Revision" shows an instant inline
  state banner.
- **Stub:** the 60% progress ring, Progress Timeline, and Evidence Files
  list are hardcoded — reflect nothing about the actual startup.
- **Coming Soon:** MVP Links card, Pitch Deck card.

### `/admin/reviews/workspace` — `ReviewWorkspace.jsx`
- **Real:** Evaluation Checklist (5 real checkboxes), Reviewer Notes
  textarea (typing works), Metrics Scorecard's 4 sliders with a **live
  consensus score** recalculated via `useMemo` as you drag, Decision
  Summary's 3 exclusive toggle buttons, Save Draft (real 2s transient
  confirmation, same honest pattern as `incubator/Settings.jsx` — not a
  fake network delay, the state change is instant, only the confirmation
  banner auto-dismisses after 2s).
- **Stub:** nothing in the checklist/notes/scorecard/decision persists —
  reload and it's gone. Submit Review → real navigation to
  `/admin/reviews/outcome`, but doesn't actually submit anything anywhere.
- **Coming Soon:** Submission Preview placeholder.

### `/admin/reviews/outcome` — `ReviewOutcome.jsx`
- **Real:** "Publish Result" — instant state change to a published banner
  (`// TODO(backend)` at the exact line, deliberately not the fake
  `setTimeout` "Publishing…" spinner the source wireframe used for this
  exact button). Revision Actions checkboxes are functional.
- **Stub:** the 94/100 score, Approved badge, Series A Pathway badge, and
  Maturity Progress tracker are hardcoded.

### `/admin/reviews/schedule-meeting` — `ScheduleMeeting.jsx`
- **Real:** Reviewer select, Meeting Date/Time, Duration, Platform selects,
  Agenda textarea — all controlled inputs.
- **Stub:** Startup Name / Primary Founder are prefilled and disabled
  (nothing to wire yet — no real "current startup" context passed in).
  The October 2024 calendar grid is **decorative only**, not wired to the
  date field — don't assume clicking a calendar day sets the Meeting Date
  input, it doesn't.
- **Coming Soon:** Generate Meeting Link, View Protocol Docs, Check
  Financials.

### `/admin/audit-log` — `AuditLog.jsx`
- **Real:** Date/Module/User filters genuinely filter the log client-side
  (via `useMemo`).
- **Stub:** the underlying log (7 entries) is hardcoded, not fetched.

---

## Cross-cutting

- **Dark mode** is fully real and complete — no backend dependency, nothing
  to integrate.
- **`ComingSoon`** (`src/components/ui/ComingSoon.jsx`) is the single shared
  marker for anything not built. To turn a feature on: replace the
  `<ComingSoon>` wrapper with a real `<Link>`/button and wire the action —
  don't build a second "not ready" pattern elsewhere.
- **`RoleSignupForm`** (`src/components/auth/RoleSignupForm.jsx`) owns the
  submit flow for all 5 `/signup/<role>` pages. Wiring real registration
  means changing `handleSubmit` in this **one** file, not each of the 5
  page files individually.
- No environment variables are read anywhere yet (see `.env.example`).
- No API base URL, auth provider, or database of any kind is wired in.
