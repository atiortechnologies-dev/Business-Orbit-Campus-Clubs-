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

## API Surface (quick reference for backend integration)

Every screen-by-screen section below has its own `TODO(backend)` markers
at the exact call site. This section rolls all ~35 of them up into one
endpoint-oriented list, so a backend engineer doesn't have to walk every
file to reconstruct what's needed. Grouped by resource, not by screen.

**Already real, in `Backend/`** (see `Backend/routes/authRoute.js`):
- `POST /api/auth/register` — implemented, validated by
  `Backend/utils/validators.js`'s `registerSchema`. **Not wired up from
  this frontend yet** — see `components/auth/RoleSignupForm.jsx`'s
  `TODO(backend)` for the exact field-name mismatches per role (3 of the
  5 signup forms are missing fields the schema requires outright, not
  just naming differences — Investor, Incubator, and Company signups
  need new fields added before this endpoint can register those roles).
- `GET /api/auth/check-email` — implemented, unused by this frontend.

**Auth — not yet built on the backend:**
- `POST /api/auth/login` (`pages/auth/Login.jsx`)
- `POST /api/auth/forgot-password` (`pages/auth/ForgotPassword.jsx`)
- `POST /api/auth/reset-password` (`pages/auth/ResetPassword.jsx`)

**Profile / settings (PATCH, one per role + Student's own settings):**
- Student: `pages/Settings.jsx` (profile, password, delete account)
- Onboarding complete-profile, one per role: `pages/onboarding/complete-profile/{Student,Mentor,Investor,Incubator,Company}.jsx`
- Incubator: `pages/incubator/Settings.jsx`
- Mentor: `pages/mentor/Profile.jsx`

**Student journey submissions (one POST per gated stage):**
- Ideation: `pages/journey/ideation/IdeaSubmission.jsx`
- Validation: `pages/journey/validation/{SurveyTracker,EvidenceUpload,ReportSubmission}.jsx`
- MVP: `pages/journey/mvp/{ChooseProductType,MvpSubmission,IncubationProofSubmission}.jsx`

**Incubator review pipeline:**
- `pages/incubator/ApplicationReview.jsx` — save draft, submit decision
- `pages/incubator/Messages.jsx` — send message / attachment

**Admin — two review pipelines + one dashboard action:**
- Verification: `pages/admin/{VerificationDetail,VerificationDecision}.jsx`
- Startup review: `pages/admin/{ReviewWorkspace,ReviewOutcome,ScheduleMeeting}.jsx`
- `pages/admin/Admin.jsx` — dismiss a Critical Action

**Investor:**
- `pages/investor/PitchDeck.jsx` — save due-diligence notes

**Mentor:**
- `pages/mentor/{Mentor,Requests}.jsx` — accept/decline a mentorship request
- `pages/mentor/Meetings.jsx` — save session notes/outcome
- `pages/mentor/Chats.jsx` — send message

**Shared:**
- `components/layout/Sidebar.jsx` — every portal's sidebar footer shows a
  hardcoded name/initials/role; needs real authenticated-user data once
  a session exists, one place for all six portal shells.

No env vars, API base URL, or auth/session provider are configured in
this frontend yet — see Cross-cutting at the bottom of this file.

---

## Public Landing Pages

Six public marketing pages, `src/pages/landing/*.jsx` — no auth required,
reachable before `/login`. Rebuilt from an intern's (Shivom's) original
`framer-motion` implementation onto this app's existing design-token/
component system and CSS-transition convention; see `CONTRIBUTING.md` §8
for the animation-library decision this left deferred. All "photo" slots
across all 6 pages use the `.placeholder-box` CSS utility — zero hotlinked
or stock images anywhere in this section.

### `/landing` — `src/pages/landing/Home.jsx`
- **Real:** Navbar's 5 in-page anchors (About/Startup Stories/Community/FAQ/
  Contact), Login/Explore, Roles section → real `/signup/<role>` for all 5
  roles, FAQ accordion, CTA section's Register Now/Become a Partner,
  Footer's Privacy Policy link.
- **Stub:** LogoStrip's 6 partner-logo slots are empty placeholders
  (deliberately genericized — the original hardcoded real institution names
  like Stanford/MIT/Y Combinator, which falsely implied real partnerships).
  Stories section's 3 testimonials (Alex Chen/PixelForge, Sarah Miller/
  GreenLoop, James Rodrigues/KinetiStack) are draft placeholder copy, not
  real customer quotes — kept as-is per the "working draft" call on this
  integration pass, but not sourced from any real founder. Contact
  section's email/address are static text, not a real `mailto:`/map link.
- **Coming Soon:** Footer's Company/Resources columns (About Us, Careers,
  Press, Events, Stories, Blog, Support — note "Contact" and "Stories" here
  are `ComingSoon` even though real `#contact`/`#stories` anchors exist
  elsewhere on this same page; the footer copies don't reuse them, worth
  fixing if this file is touched again), Contact section's "Follow us",
  Footer's Cookie Policy. Footer's "Terms of Service" points at
  `/legal/privacy-policy` — same destination as "Privacy Policy," no
  distinct terms page exists yet.

### `/landing/student` — `src/pages/landing/Student.jsx`
- **Real:** Header's scroll-reactive background + mobile menu, Login/Sign
  Up, Hero's "Book Discovery Call" (routes to the real `/signup/student`
  form, not an actual scheduling flow — label is aspirational), FAQ
  accordion (same shared component/content as Home's), BottomCTA's "Apply
  Now", Footer's "Explore by Role" cross-links to all 4 other role landing
  pages, Footer's real `mailto:hello@bocc.co` (this page's Footer is
  bespoke, distinct from the shared one — its Contact is a working link
  where Home's is plain text).
- **Stub:** Header's "Study"/"Mentors" nav labels both point at the same
  `#journey` anchor, not distinct sections. SuccessStories' 3 testimonials
  (Aisha K./Lumen, Marcus T./Cadence, Priya R./Strata) are draft placeholder
  copy, same caveat as Home's Stories.
- **Coming Soon:** StartupJourney's "Book 1:1 Consultation", Features' two
  CTAs ("Meet the mentors"/"See investor network"), Partners' two CTAs,
  BottomCTA's "View Events", Footer's Startup Guide/Investor Deck/Events.

### `/landing/mentor` — `src/pages/landing/Mentor.jsx`
- **Real:** Navbar's 4 in-page anchors, Hero's "View Ecosystem" anchor, FAQ
  accordion (mentor-specific content), CTA section's "Apply Now" →
  `/signup/mentor`.
- **Stub:** Hero's "Apply to Mentor" is styled as the primary action but
  only scrolls to the on-page CTA section (`#cta`) rather than going
  straight to `/signup/mentor` — functionally fine (the real signup link is
  one scroll away) but worth knowing if someone expects it to submit
  directly. Hero's "1,700+ members" stat card is static text, not wired to
  any counter. ImpactStories' 3 testimonials (Sarah Chen/Vertex Capital,
  Marcus Reid/Nuvola Systems, Aisha Patel/ex-Google) are the most specific
  placeholder-attribution instance across all 6 pages — named individuals,
  named firms, presented with no draft/illustrative disclaimer. Kept as-is
  per the working-draft call, but flagged clearly here since these read the
  most like real people.
- **Coming Soon:** none on this page beyond the shared Footer's usual items
  (see Home's entry).

### `/landing/investor` — `src/pages/landing/Investor.jsx`
- **Real:** Navbar's 4 in-page anchors, Hero's "Join as an Investor" →
  `/signup/investor`, Statistics section's count-up animation (genuine
  `IntersectionObserver`-gated `requestAnimationFrame` count, fires once on
  scroll into view — the animation mechanism is real even though the 4
  target numbers it counts to are hardcoded constants), FAQ accordion
  (investor-specific, 6 Q&A), CTA section's "Join as an Investor".
- **Stub:** Hero's 3-stat row and Statistics' 4 target values are
  hardcoded, not fetched. SuccessStories' 3 startup cards (EcoStream AI,
  BioPulse Health, Nexus Logistics) carry specific fabricated financial/
  traction metrics (revenue growth %, seed amount, MAU) under a "Featured
  Success Stories" heading — the strongest placeholder-content case in this
  pass, flagged the same way as Mentor's ImpactStories.
- **Coming Soon:** Hero's "View Startup Directory", SuccessStories' "View
  All Success Stories" and each card's "Investor Details →", CTA's "Contact
  Investment Team".

### `/landing/companies` — `src/pages/landing/Companies.jsx`
- **Real:** Navbar's 4 in-page anchors, Hero's "Partner with BOCC" →
  `/signup/company`, FAQ accordion (companies-specific, 5 Q&A), FinalCTA's
  "Partner with BOCC" (same destination as Hero's).
- **Stub:** Hero's 2-stat row is static text. CoInnovation's
  `#startup-journey` section exists but isn't linked from this page's own
  nav — reachable only by direct scroll or a manual anchor.
- **Coming Soon:** Hero's "View Talent Pool", FinalCTA's "Talk to Our
  Team".
- No testimonial/success-story section on this page — the only one of the
  6 with none, so no placeholder-attribution concern here.

### `/landing/incubator` — `src/pages/landing/Incubator.jsx`
- **Real:** Navbar's 4 in-page anchors (Why BOCC/Framework/Benefits/FAQ),
  Hero's "Become a Partner" → `/signup/incubator`, Stats section (fixed
  `bg-brand-black` panel, matches the pattern used elsewhere for
  permanently-dark sections), FAQ accordion (incubator-specific, 5 Q&A),
  FinalCTA's "Become a Partner" (same destination as Hero's).
- **Stub:** Hero's 3-stat trust row and Stats section's 4 values are
  hardcoded, not fetched. SuccessStories' 3 quotes are attributed
  generically ("Director, University Incubator," "Head of Innovation, Tech
  Campus," "Program Manager, Seed Hub") rather than to named individuals/
  institutions — the one testimonial section across all 6 pages that avoids
  the specific-fake-attribution issue by design.
- **Coming Soon:** Hero's "View Partnership Deck", InstitutionalValue's
  "Download Partnership Brochure", FinalCTA's "Book a Demo".
- This page resolves a real structural bug, not just a rebuild: the
  original commit put its landing components directly in
  `src/components/incubator/`, the same folder as the real authenticated
  `IncubatorShell.jsx` — now split into `components/landing/incubator/`
  (marketing) vs. `components/incubator/` (just the real shell), matching
  the folder-per-portal convention used everywhere else. Also: every one of
  this page's original components imported a hook (`useScrollReveal`) that
  never existed anywhere in the codebase — the page was fully broken
  (blank/crashing) before this rebuild, independent of anything else
  changed here.

### Shared across all 6 (Navbar/Footer)
- `src/components/landing/Navbar.jsx` and `Footer.jsx` are reused as-is by
  Home, Mentor, Investor, Companies, and Incubator (each passing its own
  `links` prop for the in-page anchors). Student alone has a bespoke
  Header/Footer, built for its scroll-reactive nav behavior.
- Footer's Company/Resources columns are unconditionally `ComingSoon` on
  every page that uses the shared Footer; its "Terms of Service" resolves
  to the same route as "Privacy Policy" everywhere it appears — no separate
  terms page exists in `router.jsx` yet.
- No page in this section has any `<form>`/`<input>` — every CTA is either
  real navigation or `ComingSoon`, there's no lead-capture or contact form
  anywhere yet.

---

## Auth

### `/login` — `src/pages/auth/Login.jsx`
- **Real:** email/password format validation, password show/hide, remember-me
  checkbox (visual toggle, not persisted). The illustration placeholder is
  gone — replaced with a custom inline SVG (an abstract "orbit" motif, hub +
  campus-club nodes) built entirely from design tokens. The small decorative
  mark above "Welcome Back" is now the real `<Logo variant="mark" />`.
- **Stub:** `handleSubmit` — any validly-formatted email/password redirects
  straight to `/dashboard`. No real authentication happens; anyone can "log
  in" as anyone. Replace with a real `POST /api/auth/login`, keep the
  redirect on success, surface API errors via the existing `errors` state
  on failure.

### `/forgot-password` — `src/pages/auth/ForgotPassword.jsx`
- **Real:** email validation, submit swaps the card to a confirmation view
  (client state only). Illustration placeholder replaced with a custom
  inline SVG specific to this screen's moment in the flow — an envelope
  with a key riding along ("your recovery request is in flight"). Not the
  same orbit motif as `/login`: that reuse read as generic/irrelevant on a
  password-recovery screen, so each auth screen now gets its own motif.
- **Stub:** no email is ever sent. The confirmation view is cosmetic.
- **Coming Soon:** Support Center link.

### `/reset-password` — `src/pages/auth/ResetPassword.jsx`
- **Real:** live password-strength calculation, confirm-password match
  validation, two independent eye toggles. Illustration placeholder
  replaced with a custom inline SVG — a shield with a keyhole ("your
  account is secured"), the deliberate "end state" counterpart to
  ForgotPassword's "request in flight" envelope.
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
  "Profile" quick action → real navigation to `/settings`. Header Settings
  icon and avatar (in `DashboardShell`) → real navigation to `/settings`.
  The hero's illustration placeholder is now a custom inline SVG ("idea
  spark" motif — radiating rays around a central hub, fitting the
  student's current Ideation stage), same geometric line-art language as
  the other custom illustrations across the app.
- **Coming Soon:** Investors/Incubators/Freelancing quick actions, all 4
  Resources cards, sidebar Mentors/Investors/Incubators/Freelancing/Help,
  header Search — all genuinely blocked on directory/marketplace screens
  that don't exist yet, not just an unwired button.

### `/notifications` — `src/pages/Notifications.jsx`
- **Real:** fully rebuilt around real local state — search (filters
  title/body), tab filtering (All/Unread/category, all backed by an actual
  `category` field), Mark all as read, Clear All, per-card Dismiss, View
  Details (opens a real `Modal`), Add to Calendar (generates a real `.ics`
  file client-side via `Blob`/`URL.createObjectURL`, no backend needed for
  a single manual event). Empty states are real, not hidden.
- **Stub:** the notifications themselves are still 3 hardcoded seed entries
  — `// TODO(backend)`-equivalent: replace `INITIAL_NOTIFICATIONS` with a
  real fetch, everything downstream (filtering, dismiss, mark-read) already
  operates on whatever's in state so it doesn't need to change.
- No more "Coming Soon" items on this page — pagination was removed rather
  than stubbed, since the honest count (3 notifications) never needed more
  than one page; don't reintroduce fake "48 notifications" pagination when
  wiring the real fetch, size the UI to the real count instead.

### `/build-startup/journey` — `src/pages/BuildStartupJourney.jsx`
- **Stub:** stats and achievements are static; stage progression (which
  stage is "current" vs "locked") is hardcoded to Ideation, not derived
  from any real per-student state.
- **Real:** breadcrumb "Dashboard" and "Back to Dashboard" → real
  navigation. Both "Start Your Journey" CTAs and the active Ideation stage
  circle → real navigation into `journey/ideation/`. The illustration
  placeholder is now a custom inline SVG — a "5-stage ascending path" motif
  (waypoints rising to a flag) matching the STAGES list below it.

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
- **Coming Soon:** `ValidationOverview`'s 3 resource downloads (real files
  that were never uploaded anywhere).
- `SurveyTracker`'s Add Survey Responses and Upload Results are now
  **real**: Add Survey Responses opens a `Modal` form that appends a real
  entry to local state (and updates the response/sentiment counts); Upload
  Results is a real file picker whose selected files show as a removable
  "queued" list — honestly not pretending to parse or import them, since
  there's no backend to send them to yet.

### Startup Journey — MVP Stage — `src/pages/journey/mvp/*.jsx`
Five screens: `MvpOverview` → `ChooseProductType` → `MvpSubmission` →
`SubmissionSuccess` → `IncubationProofSubmission`.
- `MvpOverview`'s Development Roadmap illustration placeholder is now a
  custom inline SVG — an "assembling blocks" motif on a fixed-black
  surface. See `CONTRIBUTING.md` §6 for a real dark-mode token bug this
  illustration shipped with and how it was fixed (fixed-black container
  needs literal `white`, not the `surface-white` token).
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
- **Coming Soon:** `MvpSubmission`'s document-upload dropzone action.
  `SubmissionSuccess`'s Add to Calendar is now **real** — generates a
  `.ics` file client-side, same pattern as `Notifications.jsx`.
- Note: `IncubationProofSubmission` was deliberately renamed from the
  source wireframe's "Incubation Verification" — it's a student
  self-service upload (proof of incubator acceptance), unrelated to and
  not overlapping with Admin's identity-verification pipeline below,
  which the original name would have implied.

### `/settings` — `src/pages/Settings.jsx`
- **Real:** every field is a controlled input, Skills & Interests add/remove
  chips, Save Changes shows a real transient confirmation (2s auto-dismiss,
  same pattern as `incubator/Settings.jsx`'s Save Changes). Change Photo is
  a real file picker with an instant local preview (`URL.createObjectURL`,
  never uploaded). Change Password expands into a real form with client
  validation (length + confirm match) and a transient success state. Delete
  Account opens a real confirm `Modal` requiring the user to type "DELETE";
  confirming shows an honest "Deletion requested" banner rather than
  actually deleting anything.
- **Stub:** Save Changes persists nothing — reload and every edit is gone.
  Change Password's `// TODO(backend)` is at `handlePasswordSubmit` in
  `Settings.jsx`; Delete Account's is at `handleDeleteConfirm`.
- No more "Coming Soon" items on this page.

### `/legal/privacy-policy` — `src/pages/legal/PrivacyPolicy.jsx`
- **Real:** in-page anchor navigation (left sub-nav → legal sections,
  including "Contact Support" which was previously wrapped in `ComingSoon`
  despite pointing at a real, already-built section — just an unwired
  link, now fixed), `legal@bocc.edu` is a genuine `mailto:` link,
  "Login"/"Register"/"Accept & Continue" → real navigation. Download PDF
  now opens the browser print dialog (`window.print()`) — same
  "PDF-via-print" pattern as `ApplicationReview.jsx`'s Print PDF, no PDF
  library needed.
- **Coming Soon:** top nav Clubs/Events/Partners, most footer links —
  genuinely blocked on marketing/content pages that don't exist yet. Top
  nav's About is now **real** (`PublicNav.jsx` → `/landing`), now that the
  general landing page it points to actually exists — see "Public Landing
  Pages" above.

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
  looked functional). Export now generates a real CSV of whatever rows are
  currently visible (`src/utils/csv.js`, shared with the Admin tables).
  The header's separate "Filter" button was removed rather than wired —
  it was a dead duplicate of the always-visible filter strip below it, not
  a real second control.
- **Stub:** filtering only operates on these 5 hardcoded rows, not a real
  dataset. Clicking any row navigates to the **same** single review page
  regardless of which startup was clicked — there's only one seeded
  application (NeuralPath AI) in this repo. Pagination controls are real
  (not `ComingSoon`-wrapped) but honestly disabled, since 5 rows never
  need a second page — don't reintroduce fake "142 applications" copy when
  wiring a real paginated fetch, size the count to what's actually loaded.

### `/incubator/applications/review` — `src/pages/incubator/ApplicationReview.jsx`
- **Real:** Reviewer Notes textarea (typing works, not persisted),
  Approve/Request Revisions/Reject single-select, Save Draft and Submit
  Decision both show real transient confirmation UI. Print PDF now calls
  `window.print()` — a real action, not a stub.
- **Stub:** none of the above persists anywhere — reload the page and it's
  gone. Submit Decision needs a real `POST` once there's somewhere for a
  decision to go.
- **Coming Soon:** both document downloads — real files that were never
  uploaded anywhere.

### `/incubator/messages` — `src/pages/incubator/Messages.jsx`
- **Real:** switching conversations, typing and sending a message (appends
  to that conversation's local state immediately, Enter-to-send with
  Shift+Enter for newline). Attach File and Insert Image are now real file
  pickers — the picked file's actual bytes are attached via
  `URL.createObjectURL` and rendered as a genuinely downloadable/viewable
  attachment on the sent message (this is different from the pre-seeded
  `Q3_Acme_Robotics_Deck.pdf` attachment, which stays `ComingSoon` since
  those bytes never existed). Add Emoji opens a real small emoji picker
  that inserts into the message text.
- **Stub:** sent messages (and their attachments) live only in React state
  — reload and they're gone, and the "other party" never actually receives
  anything. This is the most visually convincing stub in the app and the
  one most likely to be mistaken for real — it needs an actual transport
  (websocket/polling) and persistence layer (including real file upload
  for attachments, not just a local blob URL), not just a bigger mock.
  Only the Acme Robotics thread has real seeded message history; the other
  3 conversations show their preview line as a single static message with
  a visible "seeded demo channel" notice.
- **Coming Soon:** New Message, video/voice/options icons, all 4
  right-panel Quick Actions — all genuinely blocked on a contacts
  directory, real calling infra, or screens that don't exist yet.

### `/incubator/settings` — `src/pages/incubator/Settings.jsx`
- **Real:** every field is a genuine controlled input (typing works),
  Focus Industries chip add/remove (Add Industry now works the same way
  Student Settings' Skills chips do), Working Hours day toggles, Email
  Notifications toggle, Cancel Changes (resets the form to defaults).
  Update Organization Logo is a real file picker with instant local
  preview. Update Password expands into a real form with client
  validation. Deactivate Account opens a real confirm `Modal` requiring
  the user to type "DEACTIVATE"; confirming shows an honest "Deactivation
  requested" banner rather than actually deactivating anything.
- **Stub:** Save Changes shows a real transient confirmation but persists
  nothing — reload and every edit is gone. Update Password's
  `// TODO(backend)` is at `handlePasswordSubmit`; Deactivate Account's is
  at `handleDeactivateConfirm`.
- **Coming Soon:** View Public Profile (no public profile page exists yet),
  Download Data Audit (a real file that was never generated anywhere).

---

## Admin Portal

*(Built in an earlier session; missing from this file until now — added
retroactively rather than assumed complete just because the screens look
finished.)*

### `/admin` — `src/pages/admin/Admin.jsx`
- **Stub:** every stat card and the Activity Stream are static snapshots,
  not tied to any real data source. The Startup Journey Funnel's Daily vs.
  Monthly toggle is real (switches between two real local datasets), but
  both datasets are still hardcoded mocks, not fetched.
- **Real:** every link in the Critical Actions panel → real navigation
  into the Verification/Review pipelines below. "Ignore" on a Critical
  Action now really dismisses that card from local state (shows a genuine
  "all caught up" empty state once all 3 are cleared) — `// TODO(backend)`
  equivalent: a real dismiss should also acknowledge it server-side so it
  doesn't reappear on next load.
- **Coming Soon:** Demographic Map, "View detailed drop-off report" — both
  need real analytics data that doesn't exist yet.

### `/admin/verification` — `VerificationQueue.jsx`
- **Real:** Role/Status/Chapter filters genuinely filter the visible rows
  client-side. Export CSV downloads a real CSV of the currently-filtered
  rows. Date Range is now a real popover with From/To date inputs that
  filter by each user's actual `regDate`.
- **Stub:** filtering only operates on 3 hardcoded rows; row click always
  navigates to the same single detail page ("Alexander Vance") regardless
  of which row was clicked.
- **Coming Soon:** Bulk Action (no defined bulk operation to wire — needs a
  product decision on what it actually does before it can be built, not
  just a selection checkbox), Download Audit Trail (a real file that was
  never generated anywhere).

### `/admin/verification/detail` — `VerificationDetail.jsx`
- **Real:** Internal Command Notes — typing and adding a note appends to
  local state immediately. Request More Info opens a real `Modal` with a
  textarea; sending appends a note recording the request and shows a
  transient success banner.
- **Stub:** added notes (including Request More Info's) vanish on reload —
  no `POST` anywhere; `// TODO(backend)` is at `handleAddNote` and
  `handleSendRequestInfo`. Document flag states and the checklist are
  hardcoded, not derived from the (also hardcoded) documents array.
- **Coming Soon:** Download All, per-document Download, Replace document —
  all real files that were never uploaded anywhere.

### `/admin/verification/decision` — `VerificationDecision.jsx`
- **Real:** Approve/Reject/Request Documents each open a real `Modal`;
  confirming shows an instant inline banner (no fake delay).
- **Stub:** none of the 3 decisions persist anywhere — reload and the
  banner is gone, the user is still "pending."

### `/admin/reviews` — `ReviewQueue.jsx`
- **Real:** Export CSV downloads a real CSV of the table's rows.
- **Stub:** all 4 stat cards and the table's 4 rows are hardcoded.
- **Coming Soon:** Bulk Action (same "no defined operation yet" reasoning
  as `VerificationQueue.jsx`'s).

### `/admin/reviews/detail` — `ReviewDetail.jsx`
- **Real:** "Schedule Meeting" → real navigation to
  `/admin/reviews/schedule-meeting`. "Begin Evaluation" → real navigation
  to `/admin/reviews/workspace`. "Request Revision" shows an instant inline
  state banner. "View Previous Reviews" opens a real `Modal` with mock
  past-review entries (this is display-only content, not a file — no
  reason to stub something that's just showing text).
- **Stub:** the 60% progress ring, Progress Timeline, and Evidence Files
  list are hardcoded — reflect nothing about the actual startup.
- **Coming Soon:** MVP Links card, Pitch Deck card, Download All (evidence
  files), per-file Download, Download All Files — all real files that were
  never uploaded anywhere.

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
  exact button). Revision Actions checkboxes are functional. "Return to
  Queue" → real navigation to `/admin/reviews`.
- **Stub:** the 94/100 score, Approved badge, Series A Pathway badge, and
  Maturity Progress tracker are hardcoded.
- **Coming Soon:** Notify Founder — sending a real notification needs a
  backend.

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
  (via `useMemo`) — Date range is now a real popover with From/To date
  inputs against each entry's actual `date`. Export .CSV downloads a real
  CSV of the currently-filtered rows.
- **Stub:** the underlying log (5 entries) is hardcoded, not fetched.
  Pagination controls are real (not `ComingSoon`-wrapped) but honestly
  disabled, and the count line reads the real array length instead of the
  previous hardcoded "12,482 logs" — don't reintroduce a fake total when
  wiring a real paginated fetch, size the copy to what's actually loaded.

---

## Investor Portal

*(Ported from a second intern's — Madhu's — separate repo onto this app's
shell/token/component system; see `CONTRIBUTING.md` §9 for the integration
notes. Only one seeded pitch deck and one seeded submission set exist, same
"honest single example" pattern as Incubator's `ApplicationReview.jsx`.)*

### `/investor` — `src/pages/investor/Investor.jsx`
- **Stub:** all 4 stat cards, the Recent Startup Submissions table, and the
  Pitch Deck Alerts feed are hardcoded snapshots, not tied to any real data
  source.
- **Real:** "View Pitch Decks" → real navigation to `/investor/pitch-decks`.
- **Coming Soon:** "Browse Startups," "Open Conversations" quick actions,
  submissions table's "View All," alerts panel's "See all notifications" —
  all genuinely blocked on a startup directory/messaging system that
  doesn't exist yet.

### `/investor/pitch-decks` — `src/pages/investor/IncomingPitchDecks.jsx`
- **Real:** search genuinely filters the 6 seeded decks client-side (by
  name, founder, or tag), grid/list view toggle.
- **Stub:** filtering only operates on 6 hardcoded decks, not a real
  dataset. Pagination controls are real (not `ComingSoon`-wrapped) but
  honestly disabled, and the "Showing N of 6" count reflects the real
  filtered/total counts — same honest-count convention used throughout
  Admin/Incubator; don't reintroduce a fake total when wiring a real fetch.
- **Coming Soon:** header "Filter" button, each card's quick-preview (eye
  icon) — no preview modal exists yet.

### `/investor/pitch-decks/review` — `src/pages/investor/PitchDeck.jsx`
- **Real:** slide-list navigation (Previous/Next and direct slide-select,
  8 real slide labels), Investor Notes textarea (typing works, not
  persisted).
- **Stub:** this viewer always shows the same seeded example (AeroFlow
  Dynamics) regardless of which deck card was clicked from the incoming
  list — there's only one seeded pitch deck in this app, not a real
  multi-deck dataset. Same honest-stub pattern already used by Incubator's
  `ApplicationReview.jsx`.
- **Coming Soon:** "Start Conversation," "Request Pitch Meeting" — both
  need a messaging/scheduling system that doesn't exist yet.

---

## Mentor Portal

*(Ported from the same second intern's repo; persona consolidated to one
consistent "Priya Anand, Senior Mentor" across all 5 screens — her source
had 3 different names for the mentor's own identity across her 5 files,
one of which collided with this app's real Admin persona, "Alex Rivera.")*

### `/mentor` — `src/pages/mentor/Mentor.jsx`
- **Real:** Accept/Decline on the Recent Mentorship Requests list removes
  the request from local state immediately (shows a real empty state once
  cleared).
- **Stub:** all 4 stat cards, Upcoming Meetings, and Recent Conversations
  are hardcoded snapshots, not tied to a real data source. Accept/Decline
  doesn't persist anywhere — reload and the 3 seeded requests are back.
- **Coming Soon:** none on this page — "Open Chats" and "View Requests"
  both route to real built pages.

### `/mentor/requests` — `src/pages/mentor/Requests.jsx`
- **Real:** Newest First/Oldest First sort genuinely reverses the list
  order. Accept/Decline removes a request from local state (shows a real
  empty state once all 3 are cleared).
- **Stub:** the 3 seeded requests are hardcoded; Accept/Decline doesn't
  persist — reload and they're back. `// TODO(backend)` equivalent: wire
  both actions to a real endpoint once one exists.
- **Coming Soon:** header "Filter" button, each card's "View Profile" — no
  mentor-facing student-profile page exists yet.

### `/mentor/chats` — `src/pages/mentor/Chats.jsx`
- **Real:** switching threads, thread search (filters by name), typing and
  sending a message (Enter-to-send, appends to that thread's local state
  immediately).
- **Stub:** sent messages live only in React state — reload and they're
  gone, the "other party" never receives anything, same category of stub
  as Incubator's `Messages.jsx`. Only the Sarah Chen thread has real seeded
  message history; the other 3 show a single static preview line.
- **Coming Soon:** "Schedule Meeting" (thread header), Attach file, "Pitch
  Deck"/"Financials" quick links in the student-context side panel — all
  genuinely blocked on scheduling/file-upload infra that doesn't exist yet.

### `/mentor/meetings` — `src/pages/mentor/Meetings.jsx`
- **Real:** search genuinely filters the 2 seeded meetings (by student or
  startup name), meeting-list selection, Mentor Notes textarea and Meeting
  Outcome select, Save Notes shows a real transient confirmation (2s
  auto-dismiss, same pattern as `incubator/Settings.jsx`'s Save Changes).
- **Stub:** Save Notes persists nothing — reload and the notes/outcome are
  gone; `// TODO(backend)` is at `handleSaveNotes`. The 2 seeded meetings
  themselves are hardcoded.
- **Coming Soon:** "Calendar View," "Schedule Meeting," each meeting card's
  "Join Meeting," detail panel's "Profile"/"Chat" quick links, "Schedule
  Follow-up" — all genuinely blocked on calendar/video-call infra or
  cross-linking that doesn't exist yet.

### `/mentor/profile` — `src/pages/mentor/Profile.jsx`
- **Real:** every field is a controlled input, Areas of Expertise chip
  add/remove (Enter to add, click × to remove — same pattern as Student
  Settings' Skills chips), Ideal Startup Stages checkboxes, Meeting
  Preference select, Change Photo is a real file picker with instant local
  preview (`URL.createObjectURL`, never uploaded), Save Changes shows a
  real transient confirmation (2s auto-dismiss).
- **Stub:** Save Changes persists nothing — reload and every edit is gone;
  `// TODO(backend)` is at `handleSaveChanges`. Profile Completion (88%) is
  a hardcoded constant, not derived from which fields are actually filled.
- **Coming Soon:** "Preview Public Profile," all 4 Account Settings rows
  (Change Password, Notification Settings, Privacy & Security, Deactivate
  Account) — genuinely blocked on auth/account infra that doesn't exist
  yet, unlike Student Settings' equivalent flows which have a real backing
  `Modal` (there's no reason to duplicate that work here without a shared
  account-settings component to reuse first).

---

## Company Portal

*(Originally added by a different contributor directly to `main`, outside
the usual branch/PR process this doc otherwise assumes. Fully remediated
— rebuilt on the same shell/token/component conventions as every other
portal. `components/company/CompanyShell.jsx` is the fifth instance of
the shared three-piece shell pattern (Dashboard/Incubator/Admin/
Investor/Mentor before it); the old `layouts/CompanyDashboardShell.jsx`
and `components/bocc/*` are gone.)*

### `/company/dashboard` — `src/pages/company/Dashboard.jsx`
- **Stub:** all 4 stat cards, the Recent Applicant Activity table, and
  the Latest Postings list are hardcoded snapshots — same as every other
  portal's dashboard at this stage.
- **Real:** "Manage Opportunities" and "SEE ALL JOB POSTS" → real
  navigation to `/company/my-opportunities`.
- **Coming Soon:** "Post New Opportunity," "View Applicants," "View all"
  (applicant activity) — all genuinely blocked on screens that don't
  exist yet (a create-opportunity form, an applicants directory).

### `/company/my-opportunities` — `src/pages/company/MyOpportunities.jsx`
- **Real:** search genuinely filters the 4 seeded opportunities
  client-side (by title or ref), using the shared `DataTable` component
  (desktop grid → stacked mobile cards, same as every other table in the
  app).
- **Stub:** filtering only operates on 4 hardcoded rows. Pagination is
  real (not `ComingSoon`-wrapped) but honestly disabled, and "Showing N
  of 4" reflects the real filtered/total counts — same honest-count
  convention as Admin/Investor's tables.
- **Coming Soon:** "New Opportunity," each row's Actions (kebab) menu —
  both blocked on screens that don't exist yet.

### Shell — `components/company/CompanyShell.jsx`
Sidebar nav: Dashboard and My Opportunities are real; Post Opportunity,
Applicants, Profile, and Settings are `real: false` (render as
`ComingSoon` automatically via the shared `Sidebar.jsx`) since none of
those screens exist yet. Header search and notifications are
`ComingSoon`, matching every other portal shell's header.

---

## Onboarding & Verification Flow

*(Ported from the same second intern's repo — the pre-dashboard steps
between signup and a working portal. Nested under the existing
`AuthLayout` since these are pre-auth screens structurally identical in
kind to Login/ForgotPassword, not a new bespoke shell.)*

### `/onboarding/welcome` — `src/pages/onboarding/Welcome.jsx`
- **Real:** "Continue to Email Verification" → real navigation to
  `/onboarding/verify-email`. "Back" → real navigation to `/role-selection`.
- **Stub:** the chapter stats (524 members, 12 active startups, etc.) and
  "STATUS: ACTIVE" badge are hardcoded, not tied to a real chapter record.
- **Coming Soon:** "Request Chapter Change" — needs a real chapter-directory/
  request flow that doesn't exist yet.
- The chapter name was genericized from the source's real institution
  ("UIET Chandigarh Chapter, Panjab University") to a fictional "Riverside
  Tech Chapter" — same category of fix as the landing pages' LogoStrip
  issue in `CONTRIBUTING.md` §8; never imply a real institutional
  partnership from placeholder content.

### `/onboarding/verify-email` — `src/pages/onboarding/VerifyEmail.jsx`
- **Real:** 6-digit OTP input (auto-advance/backspace-to-previous-box),
  Resend Code cooldown timer, Verify button genuinely gated on all 6 digits
  being filled.
- **Stub:** no code is ever actually sent or checked — any complete 6-digit
  code proceeds to `/onboarding/verification-progress`. `// TODO(backend)`
  is at `handleVerify`, noting it should branch to
  `/onboarding/application-rejected` only on a real failure response.
  **Fixed a real bug during this integration**: the source version
  hardcoded the Verify button to always link to `/application-rejected`
  regardless of what was entered — every user, even with a correct code,
  was routed to a rejection screen. Rewired to the honest default (proceed
  to the next real step) since there's no backend yet to determine
  success/failure.

### `/onboarding/verification-progress` — `src/pages/onboarding/VerificationProgress.jsx`
- **Real:** "Return to Home" → real navigation to `/login`.
- **Stub:** the 5-step progress tracker (fixed at "Review" as the active
  step), 80% progress bar, and "24–48 business hours" estimate are all
  hardcoded, not tied to any real review-queue state.
- **Coming Soon:** "Contact Support" — no support-ticket flow exists yet.

### `/onboarding/application-rejected` — `src/pages/onboarding/ApplicationRejected.jsx`
- **Real:** "Back to Dashboard" → real navigation to `/login`.
- **Stub:** the "Reason for review" text is a hardcoded generic message,
  not tied to any real rejection reason.
- **Coming Soon:** "Contact Support" — same as above.

### `/onboarding/complete-profile/{student,mentor,investor,incubator,company}`
— `src/pages/onboarding/complete-profile/*.jsx`, shared chrome in
`src/components/onboarding/CompleteProfileShell.jsx`
- **Real:** every field is a controlled input; photo/logo upload is a real
  file picker with instant local preview (`URL.createObjectURL`, never
  uploaded); tag fields (Skills, Areas of Expertise, Industry Focus, etc.)
  support real add-on-Enter/remove-on-click via the shared `TagInput`;
  checkbox-pill and radio-pill fields (Startup Interests, Investment Stage,
  Mentoring Mode, etc.) are real toggles via shared `CheckboxPills`/
  `RadioPills`; Save & Finish shows a real transient "Saved" confirmation.
- **Stub:** Save & Finish persists nothing — reload and every edit is gone.
  Each page's `handleSave` has a `// TODO(backend)` describing the exact
  `PATCH` payload shape for that role.
- **Coming Soon:** "Skip for now" — intentionally left unwired; skipping
  a required onboarding step needs a product decision on what "skipped"
  means for verification status, not just a client-side no-op.
- Architectural note: the source repo had 5 separate hand-rolled page
  files (plus a 6th, superseded draft of the Student variant) sharing
  ~80% identical chrome. Rebuilt as **one** shared shell +
  small reusable field components (`TagInput`, `CheckboxPills`,
  `RadioPills`, `SelectField`, `TextAreaField`) + 5 thin per-role pages
  that just supply field content — mirroring the exact pattern
  `RoleSignupForm.jsx` already established in this codebase for the 5
  signup pages. Wiring real persistence means changing each page's
  `handleSave`, not the shared shell.

---

## Cross-cutting

- **Dark mode** is fully real and complete — no backend dependency, nothing
  to integrate.
- **`ComingSoon`** (`src/components/ui/ComingSoon.jsx`) is the single shared
  marker for anything not built. To turn a feature on: replace the
  `<ComingSoon>` wrapper with a real `<Link>`/button and wire the action —
  don't build a second "not ready" pattern elsewhere. As of this pass,
  every remaining `ComingSoon` in the app is genuinely blocked on a
  backend, a real file that was never uploaded, or a screen that doesn't
  exist yet — not just an unwired button. If you find one that turns out
  to be buildable client-side (a filter, a local-state toggle, a
  client-generated file like a `.csv`/`.ics`), build it rather than
  leaving it stubbed; that was the rule applied throughout this pass.
- **`src/utils/csv.js`** — `downloadCsv(filename, columns, rows)` turns
  whatever's currently in a table's local state into a real downloadable
  `.csv` via `Blob`. Shared by every "Export CSV" action (Admin's Review
  Queue/Verification Queue/Audit Log, Incubator's Applications) — reuse
  this instead of writing CSV serialization again.
- **Honest counts/pagination:** several pages used to show a page-1-of-1
  table alongside copy claiming a much larger total ("Showing 1-4 of 42",
  "12,482 logs", "142 applications") with `ComingSoon`-wrapped Next/Prev
  buttons. These were rewritten to state the real count of what's actually
  loaded, with Prev/Next present but honestly `disabled` rather than
  `ComingSoon` (there's really only one page of mock data). When wiring a
  real paginated fetch, keep the displayed count accurate to what the API
  actually returns — don't reintroduce a placeholder total.
- **`RoleSignupForm`** (`src/components/auth/RoleSignupForm.jsx`) owns the
  submit flow for all 5 `/signup/<role>` pages. Wiring real registration
  means changing `handleSubmit` in this **one** file, not each of the 5
  page files individually.
- No environment variables are read anywhere yet (see `.env.example`).
- No API base URL, auth provider, or database of any kind is wired in.
