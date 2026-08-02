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

## Global — Cookie Consent Banner — `src/components/ui/CookieBanner.jsx`

Mounted once in `src/main.jsx` as a sibling of `<RouterProvider>`, so it
shows on every route regardless of login state (there's no shared root
layout in the router — dashboard routes compose their own Shells
directly, so `main.jsx` is the only true whole-app wrapper).

- **Real:** reads/writes a `localStorage` key (`bocc_cookie_consent`) on
  mount and on each button click — this is the correct real
  implementation, not a stub standing in for one, since no consent-
  logging endpoint exists anywhere in this app yet.
- **Stub:** none — `// TODO(backend)` in the file just notes where a
  `POST` would go if a consent-logging endpoint is ever added.

---

## API Surface (quick reference for backend integration)

Every screen-by-screen section below has its own `TODO(backend)` markers
at the exact call site. This section rolls all ~40 of them up into one
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
- Traction: `pages/journey/traction/{UserAcquisitionTracker,CustomerFeedbackUpload,TractionProductSubmission}.jsx`
- Launch: `pages/journey/launch/{LaunchSubmission,FinalPitchDeckUpload,LaunchProofUpload}.jsx`

**Incubator review pipeline:**

- `pages/incubator/ApplicationReview.jsx` — save draft, submit decision
- `pages/incubator/Messages.jsx` — send message / attachment

**Admin — two review pipelines + one dashboard action:**

- Verification: `pages/admin/{VerificationDetail,VerificationDecision}.jsx`
- Startup review: `pages/admin/{ReviewWorkspace,ReviewOutcome,ScheduleMeeting}.jsx`
- `pages/admin/Admin.jsx` — dismiss a Critical Action

**Admin — Announcements (list → create → preview → publish):**

- `pages/admin/CreateAnnouncement.jsx` — save as draft
- `pages/admin/PreviewAnnouncement.jsx` — save draft; publish (create or
  update the record, then fan out notifications per selected audience)

**Admin — Chapters:**

- `pages/admin/{ChapterManagement,ChapterDetail}.jsx` — read-only for now,
  no save/submit action exists yet (every mutating action on
  `ChapterDetail.jsx` — Edit, Assign Lead, Verify, Approve Funding — is
  still `ComingSoon`, not stubbed, since none of them have a defined
  operation yet)

**Admin — Opportunity moderation:**

- `pages/admin/OpportunityReview.jsx` — Approve / Reject / Request
  Changes decision, plus reviewer notes

**Admin — Settings:**

- `pages/admin/AdminSettings.jsx` — save profile, platform config, and
  notification preferences in one call

**Investor:**

- `pages/investor/PitchDeck.jsx` — save due-diligence notes

**Mentor:**

- `pages/mentor/{Mentor,Requests}.jsx` — accept/decline a mentorship request
- `pages/mentor/Meetings.jsx` — save session notes/outcome
- `pages/mentor/Chats.jsx` — send message

**Student — Incubator Marketplace & Freelancing:**

- `pages/incubators/IncubatorApplicationForm.jsx` — submit application
- `pages/freelancing/FreelancingApplicationForm.jsx` — submit application

**Student — Mentor & Investor Network:**

- `pages/mentors/MentorshipRequest.jsx` — submit request
  (`POST /api/mentors/:id/requests`)
- `pages/investors/SendPitchDeck.jsx` — submit pitch
  (`POST /api/investors/:id/pitches`)
- `pages/mentors/ChatConversation.jsx`, `pages/investors/InvestorConversation.jsx` — send message (real-time chat service)

**Student — Support Center:**

- `pages/support/RaiseSupportTicket.jsx` — create ticket
  (`POST /api/support/tickets`)
- `pages/support/TicketDetail.jsx` — post reply
  (`POST /api/support/tickets/:id/replies`)

**Company — Post Opportunity & Applicants:**

- `pages/company/PostOpportunityStep{1..4}.jsx` — save draft, publish
  (`POST /api/opportunities`)
- `pages/company/ApplicantDetail.jsx` — update application status, save
  internal notes

**Shared:**

- `components/layout/Sidebar.jsx` — the hardcoded name/initials/role
  footer card mentioned in earlier revisions of this doc has been removed
  entirely (it visually read as a clickable profile button but wasn't
  one — real profile access now lives at the header avatar on every
  shell instead). The "Log Out" row is fully real — calls
  `useAuth().logout()` then navigates to `/login`, one place for all six
  portal shells.

**Known frontend gap — dead "Save Draft" controls (not a backend TODO):**
Found during a pass auditing every save/submit button for false-success
states (most of that pass just added missing validation gating — see the
per-screen sections below). These 5 "Save Draft" buttons have no `onClick`
at all, not just a missing backend call — clicking them does nothing:
`pages/journey/ideation/IdeaSubmission.jsx`,
`pages/journey/mvp/MvpSubmission.jsx`,
`pages/journey/validation/EvidenceUpload.jsx`,
`pages/journey/validation/SurveyTracker.jsx`,
`pages/journey/mvp/IncubationProofSubmission.jsx`. Left unwired
deliberately here — giving them real behavior is new scope (a draft-save
flow), not a fix for the false-success problem this pass targeted.

No env vars, API base URL, or auth/session provider are configured in
this frontend yet — see Cross-cutting at the bottom of this file.

---

## Public Landing Pages

Six public marketing pages, `src/pages/landing/*.jsx` — no auth required,
reachable before `/login`. Rebuilt from an intern's (Shivom's) original
`framer-motion` implementation onto this app's existing design-token/
component system and CSS-transition convention; see `CONTRIBUTING.md` §8
for the animation-library decision this left deferred. All "photo" slots
across all 6 pages use the shared `components/ui/PlaceholderGraphic.jsx`
component (dashed border, a contextual lucide icon, short caption) —
zero hotlinked or stock images anywhere in this section. This replaced
the old flat `.placeholder-box` diagonal-hatch style, which has been
removed from `index.css` now that nothing references it.

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
  The Quick Actions card labeled "Settings" (was mislabeled "Profile"
  before this pass — its own copy already said "Manage your account" /
  "Edit →", which is Settings behavior, not a public-profile view) →
  `/settings`. Header Settings icon (in `DashboardShell`) → `/settings`;
  header avatar → the new `/profile` (see below), not `/settings`.
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

**Access control — `components/journey/StageGuard.jsx` (new):** wraps the
Validation/MVP/Traction/Launch route groups in `router.jsx` (Ideation and
this hub page stay ungated). On mount, calls the existing real
`getStartupStages()` (`src/api/startup/startupApi.js`) and checks the
target stage's `status`; anything other than `active`/`approved`/
`completed` (including an API error) redirects back to this hub rather
than rendering the page — fails closed by design, not just on the happy
path. Frontend-only route gating; does not touch or replace
`ProtectedRoute.jsx`, which still isn't wired into `router.jsx` anywhere.

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

Seven screens: `MvpOverview` → `ChooseProductType` → `MvpSubmission` →
`SubmissionSuccess` → `IncubationProofSubmission` → `IncubationVerificationReview`
→ `IncubationVerificationApproved`.

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
  `IncubationProofSubmission`'s real drag-and-drop file state.
- **Stub:** every submit/save button has a `// TODO(backend)` — most
  notably `MvpSubmission`'s Submit MVP and `IncubationProofSubmission`'s
  Submit for Verification, which now navigates on to
  `IncubationVerificationReview` instead of just flipping an inline
  "Submitted" banner with nowhere to go — that follow-up screen didn't
  exist yet when the inline-banner version was built.
  `SubmissionSuccess`'s submission ID and dates are hardcoded placeholders.
- **Coming Soon:** `MvpSubmission`'s document-upload dropzone action.
  `SubmissionSuccess`'s Add to Calendar is now **real** — generates a
  `.ics` file client-side, same pattern as `Notifications.jsx`.
- `IncubationVerificationReview` and `IncubationVerificationApproved` are
  read-only status screens (review stepper + documents table; approval
  summary + feedback) — all sample data, nothing tied to a real reviewer
  decision. `IncubationVerificationApproved`'s "Start Traction Stage" CTA
  is a real link now, since Traction exists to link to — it was a
  `ComingSoon` wrapper in the source file, built before that stage did.
- Note: `IncubationProofSubmission` was deliberately renamed from the
  source wireframe's "Incubation Verification" — it's a student
  self-service upload (proof of incubator acceptance), unrelated to and
  not overlapping with Admin's identity-verification pipeline below,
  which the original name would have implied.

### Startup Journey — Traction Stage — `src/pages/journey/traction/*.jsx`

Seven screens: `TractionStage` → `UserAcquisitionTracker` →
`CustomerFeedbackUpload` → `TractionProductSubmission` → `TractionReview` →
`TractionReviewMeeting` → `TractionApproved`.

- **Real:** `UserAcquisitionTracker`'s and `CustomerFeedbackUpload`'s full
  controlled form state; `TractionProductSubmission`'s Submit is genuinely
  gated on the product URL and release notes both being filled in (the
  source file let it submit with an empty form).
- **Stub:** every submit/save button has a `// TODO(backend)` —
  `UserAcquisitionTracker`'s Save Draft, `TractionProductSubmission`'s
  Submit. `CustomerFeedbackUpload`'s Save Feedback navigates straight to
  Product Submission without a backend call. `TractionReview`,
  `TractionReviewMeeting`, and `TractionApproved` are read-only
  status/summary screens — nothing to submit, all sample data.
- **Coming Soon:** `UserAcquisitionTracker`'s Upload Testimonials and View
  All, `CustomerFeedbackUpload`'s Upload Evidence dropzone, `TractionReview`'s
  View Submission, `TractionReviewMeeting`'s Send a Message.
- Brought in from the same source batch as MVP (a second intern's screens,
  written slightly ahead of a couple of token/route changes already made
  elsewhere in this app) — fixed 6 breadcrumb links that pointed at a bare
  `/journey/traction` instead of `/build-startup/journey/traction`, a
  handful of leftover `text-headline-md` classes (mapped to `text-card`,
  same fix as the MVP section above), and the last of the old
  `.placeholder-box` spots (stage visual, product snapshot, reviewer
  avatar, achievement badge, launch-stage teaser) — now initials or
  `PlaceholderGraphic`, matching the rest of the app.
- `TractionProductSubmission` replaces the source batch's
  `Updatedproductsubmission.jsx`, which was the same screen with the same
  fields but no real navigation wired in — kept the one that worked.

### Startup Journey — Launch Stage — `src/pages/journey/launch/*.jsx`

Five screens: `LaunchStage` → `LaunchSubmission` → `FinalPitchDeckUpload` →
`LaunchProofUpload` → `LaunchVerificationReview`.

- **Real:** `LaunchSubmission`'s and `LaunchProofUpload`'s full controlled
  form state across every section (general info, links, descriptions,
  social proof). `LaunchStage`'s overview now has the same icon-tile
  header every other stage overview has (`text-accent-neon` icon in a
  `bg-brand-black` tile) — the source file was missing it.
- **Stub:** every submit/save button has a `// TODO(backend)` —
  `LaunchSubmission`'s Submit/Save Draft, `LaunchProofUpload`'s
  Submit/Save Draft. `LaunchVerificationReview` is a read-only
  pending-status screen, all sample data.
- **Coming Soon:** `FinalPitchDeckUpload`'s 4 upload dropzones and Cancel
  Upload, `LaunchProofUpload`'s 6 evidence-upload dropzones,
  `LaunchVerificationReview`'s per-file View/Download, View Submission Full
  Details, Contact Admin, and View FAQ.
- `FinalPitchDeckUpload`'s Continue used to route back to the Traction
  stage instead of forward — fixed to
  `/build-startup/journey/launch/proof-upload`. Folded Launch Proof Upload
  into the required pre-launch gate as a third step on `LaunchStage`'s
  overview (Submission → Pitch Deck → Proof Upload) rather than leaving it
  as an unlisted fourth screen only reachable by direct link.
- Same source batch as Traction — fixed one leftover `text-headline-md`
  (mapped to `text-card`) and `LaunchStage`'s own header, which said
  "Stage 4" even though every other Launch screen's own breadcrumb already
  said "Stage 5."

### Startup Journey — Complete — `src/pages/journey/JourneyComplete.jsx`

The graduation screen after all 5 stages: journey stats, 4 achievement
badges, 4 "next opportunity" cards (Alumni/Investors/Mentor/Showcase), and
a certificate CTA — all sample data, nothing tied to a real record of
progress.

- **Real:** the Return to Dashboard link.
- **Coming Soon:** all 4 opportunity-card CTAs, View Certificate.
- Fixed 2 leftover `text-headline-md` occurrences (the 100%/A+ stats),
  missed on the first pass over this file and caught during the final
  verification sweep.
- Reachable directly at `/build-startup/journey/complete`; not linked to
  from `LaunchVerificationReview`, since that screen shows a pending
  review and no screen in this batch shows Launch actually being
  approved — linking forward from there would fake a state that hasn't
  happened.

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
- No more "Coming Soon" items on this page. Header now includes a "View
  Public Profile" link to the new `/profile` below.

### `/profile` — `src/pages/Profile.jsx`

_(New — read-only "what mentors/investors/incubators see" view, same
split every other portal got this pass. Header avatar now points here
instead of `/settings`; the gear icon still goes to `/settings`.)_

- **Real:** fetches via the existing `getStudentProfile()`
  (`src/api/dashboardApi.js`, same call `Settings.jsx` already makes) and
  renders Name, College, Branch/Degree, Graduation Year, LinkedIn/
  Portfolio links, and Skills read-only, plus an "Edit Settings" link
  back to `/settings`. Email/phone are intentionally left off — account
  details, not part of the public profile.
- **Stub:** none — this is a real fetch of the same data Settings.jsx
  already loads, just rendered without inputs.

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

### Incubator Marketplace — `src/pages/incubators/*.jsx`

_(Student-facing — discovering and applying to incubation programs, not
the Incubator role's own portal below. Also gated by
`IdeationAccessGate` — see Mentor Network below.)_

- **Real:** `IncubatorApplicationForm.jsx`'s Startup Name/Problem
  Statement/Proposed Solution gate a real "Submit Application" button
  (same `canSubmit` pattern as every other gated form in this app);
  submitting navigates to `IncubationConfirmed.jsx`, which links forward
  into the already-built MVP journey step
  `journey/mvp/IncubationProofSubmission.jsx` — accepting into a program
  is the real trigger for that step, not a dead end.
- **Stub:** `DiscoverIncubators.jsx`'s Industry/Stage filters and 3 listed
  incubators are hardcoded; `MyIncubation.jsx`'s application tracker
  (status timeline, documents, updates feed) is a static snapshot.
  `// TODO(backend)` at `IncubatorApplicationForm.jsx`'s `handleSubmit`:
  `POST /api/incubators/:id/applications`.
- **Coming Soon:** resume/document uploads, Save Draft, Withdraw, Open
  Conversation, Download Documents.

### `/freelancing` — `src/pages/freelancing/Freelancing.jsx`

_(New — the Student sidebar's "Freelancing" nav item is real again
(`DashboardShell.jsx`'s `NAV_ITEMS`), but `/freelancing` itself now
renders a full-page "coming soon" notice via the shared
`components/ui/FeatureLockedNotice.jsx`, inside the normal `DashboardShell`
— sidebar/header/footer stay intact, unlike the old disabled-tooltip
`ComingSoon` treatment. `FeatureLockedNotice` is also reused by
`IdeationAccessGate` below, since both are "full-page notice inside a
shell" cases with only the copy differing.)_

- **Real:** the notice itself and its navigation — nothing to stub, it's
  an honest "not built yet" page, not a fake feature.
- **Orphaned (pre-existing sub-flow, left as-is):**
  `FreelancingOpportunities.jsx` (the old `/freelancing` landing),
  `OpportunityDetail.jsx`, `FreelancingApplicationForm.jsx`,
  `ApplyConfirmation.jsx`, `MyApplications.jsx` are all still real, built
  screens with their own routes (`/freelancing/opportunity`,
  `/freelancing/apply`, `/freelancing/applied`,
  `/freelancing/applications`) — just no longer linked into from
  `/freelancing` itself, so unreachable by nav now. Not deleted; this
  batch didn't touch their content, only where `/freelancing` points.

### Mentor Network — `src/pages/mentors/*.jsx`

**Access control — `components/journey/IdeationAccessGate.jsx` (new):**
wraps `/mentors/*`, `/investors/*` (below), and `/incubators/*` (the
student-facing Incubator Marketplace, not the Incubator role's own
portal) in `router.jsx`. Until a student's Ideation stage status is
`"approved"` or `"completed"` (the same two-value "cleared" check
`BuildStartupJourney.jsx:235` already uses), visiting any of the three
renders the shared `FeatureLockedNotice` inside `DashboardShell`
explaining it unlocks after Ideation is approved, instead of the real
directory — same fail-closed-on-API-error behavior as `StageGuard`. The
Student sidebar's "Mentors"/"Investors"/"Incubators" nav items
themselves needed no change; they were already real links with no
gating at all before this, which is the bug this fixes.

- **Real:** `MentorshipRequest.jsx` gates Submit Request on Startup Name +
  Problem Statement (same `canSubmit` pattern as every gated form here);
  submitting navigates into `ChatConversation.jsx` — a sent request is the
  start of that conversation, not a dead end. `ChatConversation.jsx`'s
  message thread is real controlled state (send, see it appear, same
  pattern as `mentor/Chats.jsx`'s own real messaging).
- **Stub:** `MentorDirectory.jsx`'s Industry/Expertise filters and 3
  listed mentors are hardcoded; `MentorProfile.jsx`'s reviews and stats
  are a static snapshot. `// TODO(backend)` at `MentorshipRequest.jsx`'s
  `handleSubmit`: `POST /api/mentors/:id/requests`. Chat messages don't
  persist past the tab — `// TODO(backend)` at `handleSend`: send to a
  real-time chat service.
- **Coming Soon:** Save Mentor, Add Branch-equivalents (video/voice call
  buttons), Attach file, shared-file downloads.

### Investor Network — `src/pages/investors/*.jsx`

_(Also gated by `IdeationAccessGate` — see Mentor Network above.)_

- **Real:** `SendPitchDeck.jsx` gates Send Pitch Deck on Startup Name +
  Elevator Pitch; submitting navigates into `InvestorConversation.jsx` —
  same "the real action is the trigger for the next real screen" pattern
  as Mentors' request flow and Incubators' acceptance flow.
  `InvestorConversation.jsx`'s message thread is real controlled state.
  `InvestorProfile.jsx`'s "Start Conversation" stays `ComingSoon`
  (not faked open) — the wireframe itself gates it behind "Marcus
  reviews your pitch or initiates contact," which isn't a real event yet.
- **Stub:** `InvestorDirectory.jsx`'s filters/checkboxes and 3 listed
  investors are hardcoded. `// TODO(backend)` at `SendPitchDeck.jsx`'s
  `handleSubmit`: `POST /api/investors/:id/pitches`.
- **Coming Soon:** Saved Investors, Website/LinkedIn links, View All
  (portfolio), Preview Pitch, pitch-deck/supporting-document uploads.

### Shared — Chat Inbox — `src/pages/mentors/ChatInbox.jsx` (`/mentors/messages`)

One inbox listing both mentor and investor threads together — linked
from both `ChatConversation.jsx`'s and `InvestorConversation.jsx`'s back
arrow. **Real:** the 2 threads with a matching built conversation screen
(Sarah Jenkins → Mentors, Marcus Thorne → Investors) navigate for real.
**Coming Soon:** the other 2 listed threads (Elena Rodriguez, Sarah
Chen) — shown for inbox realism but wrapped honestly since no
conversation screen exists for them.

### Support Center — `src/pages/support/*.jsx`

_(Fills the last `real: false` stub in the Student sidebar — "Help".)_

- **Real:** `RaiseSupportTicket.jsx` gates Submit Ticket on Subject +
  Description (same `canSubmit` pattern as every gated form here);
  submitting navigates to `SupportDashboard.jsx` (`/support/tickets`).
  `SupportDashboard.jsx`'s Open/In Progress/Resolved/Closed tabs are
  genuine client-side filters with real counts (`.filter().length`),
  same pattern as `freelancing/MyApplications.jsx`'s tabs, using the
  shared `DataTable` component like every other list screen in the app.
  `TicketDetail.jsx`'s "Send Reply" is real controlled state — typing
  and sending appends the reply to the visible thread (not persisted),
  same real-send pattern as `mentor/Chats.jsx` and this batch's
  `ChatConversation.jsx`/`InvestorConversation.jsx`. The FAQ accordion
  on `HelpCenter.jsx` is real open/close state.
- **Stub:** the 5 listed tickets and every FAQ/article/update on
  `HelpCenter.jsx` are hardcoded. `// TODO(backend)` at
  `RaiseSupportTicket.jsx`'s `handleSubmit`: `POST /api/support/tickets`;
  at `TicketDetail.jsx`'s `handleSendReply`: `POST
/api/support/tickets/:id/replies`.
- **Coming Soon:** Help Center's 8 category cards and 5 resource "View
  Resource" buttons, Contact Support, file-attachment upload zones (both
  screens), the ticket list's kebab Actions menu, Export Conversation,
  Close Ticket, Related Articles.
- Originally written by a third contributor (Satish) directly against
  this repo's own conventions — unlike the other batches, no stack
  translation was needed. Fixed on integration: the ticket list's
  hand-rolled `<table>` now uses the shared `DataTable` component; 3
  `placeholder-box` avatars (a class removed from this repo earlier)
  now use the initial-letter avatar pattern; the image-attachment
  placeholder now uses `PlaceholderGraphic`; `TicketDetail.jsx`'s two
  message authors had `mine` backwards (the student's own messages were
  rendering as the agent's) — swapped so the student's messages align
  right, matching every other chat screen's convention.

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
  Decision both show real transient confirmation UI — and both are now
  correctly gated (Save Draft requires non-empty notes, Submit Decision
  requires a selected outcome), so neither can report success against an
  empty review. Print PDF now calls `window.print()` — a real action, not
  a stub.
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
- **Coming Soon:** Download Data Audit (a real file that was never
  generated anywhere). "View Public Profile" is no longer Coming Soon —
  wired to the new `/incubator/profile` below.

### `/incubator/profile` — `src/pages/incubator/Profile.jsx`

_(New. Settings.jsx above is local-state-only — no `getMyProfile` wiring,
a pre-existing stub, not something this pass adds — so this reads the
same seeded shape rather than inventing a real fetch this page doesn't
have either. `// TODO(backend)`: once `GET /incubator/profile` exists,
wire both to it. `IncubatorShell` header had no gear icon before this
pass — one was added, pointing at Settings; the avatar now points here
instead of Settings.

**Flag:** the whole Incubator portal remains unreachable from live
navigation — a pre-existing bug from before this pass (no `/incubator`
route is registered at all, only the `/incubators/*` student-facing
marketplace exists; see `router.jsx`'s `_Incubator`, `_Applications`,
etc. lazy imports, none of which are wired to a route). This page's lazy
import follows the same `_` naming so it's not mistaken for reachable
code. Not fixed here — out of scope, flagged previously and again now.)_

- **Real:** renders incubator name, rep name, website, address, about
  text, target stages, max startups, and industries read-only, plus an
  "Edit Settings" link back to `/incubator/settings`.
- **Stub:** same hardcoded seed values Settings.jsx starts with.

---

## Admin Portal

_(Built in an earlier session; missing from this file until now — added
retroactively rather than assumed complete just because the screens look
finished.)_

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

- **Real:** Evaluation Checklist (5 real checkboxes), the "Core Strengths"
  Reviewer Notes textarea is wired to state and gates Save Draft (empty
  notes → button stays disabled, matching `ApplicationReview.jsx`'s
  Submit Decision pattern) — "Required Improvements" and "Internal Admin
  Comments" remain uncontrolled (typing works, not read anywhere) since
  they're not required for a draft to mean something. Metrics Scorecard's
  4 sliders with a **live consensus score** recalculated via `useMemo` as
  you drag, Decision Summary's 3 exclusive toggle buttons, Save Draft
  (real 2s transient confirmation, same honest pattern as
  `incubator/Settings.jsx` — not a fake network delay, the state change
  is instant, only the confirmation banner auto-dismisses after 2s).
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

### Admin nav — `components/admin/AdminShell.jsx`

Completed to the 8-item nav every wireframe in the batch below already
specced (the original `unified_admin_dashboard` wireframe `Admin.jsx`
itself was built from included this same nav, just never fully wired up):
Dashboard, **Announcements**, Users (relabeled from "User Verification" —
same route, `/admin/verification`), Startups (relabeled from "Startup
Reviews" — same route, `/admin/reviews`), **Opportunities**, **Chapters**,
Audit Log, ~~Settings~~. The dead `Analytics` stub (linked to `#`, no
page behind it) is gone. The header's gear icon links to `/admin/settings`
for real. The sidebar's own "Settings" entry was removed in a later
pass — Settings is reachable via the header gear only now, matching
every other portal (the sidebar item was inconsistent: real here, fake
on Company, real on Incubator, absent everywhere else).

### `/admin/announcements` — `AnnouncementsDashboard.jsx`

- **Real:** Status/Audience/Priority filters genuinely filter the table
  client-side.
- **Stub:** the 3 listed announcements and the sidebar stats (Total Views
  Today, Published/Scheduled/Draft counts, System Logs feed) are
  hardcoded, not fetched. `// TODO(backend)`: a real version needs
  `GET /api/admin/announcements` with the same filter params.
- **Coming Soon:** Archived, Drafts, and every row-level action (Edit,
  Preview, Archive) — there's no persisted announcement store yet for
  any of these to act on.

### `/admin/announcements/create` — `CreateAnnouncement.jsx`

- **Real:** the entire form (title, summary, body with live character
  count, audience checkboxes, priority radios, publish-now/schedule radio
  with conditional date/time fields) is a genuine controlled form, not a
  static mock. The Publishing Checklist sidebar reflects real form state.
  "Preview" is real — gated on title + summary + body + at least one
  audience group, then hands the whole draft to the Preview screen via
  router state (`navigate(path, { state: { draft } })`).
- **Stub:** "Save as Draft" — `// TODO(backend)`:
  `POST /api/admin/announcements { ...draft, status: 'draft' }`.
- Audience options intentionally exclude "Coordinators" (present in the
  source wireframe) — not one of this app's 6 actual roles.

### `/admin/announcements/preview` — `PreviewAnnouncement.jsx`

- **Real:** renders whatever was actually typed on the Create screen (via
  router state), not static sample copy — falls back to sample content
  only if the route is opened directly with no draft in hand. "Publish
  Announcement" is real — carries the draft forward and navigates to the
  Published confirmation. "Back to Edit" is a real link back to Create.
- **Stub:** "Save Draft" — `// TODO(backend)`:
  `PATCH /api/admin/announcements/:id { status: 'draft' }`. "Publish
  Announcement" itself — `// TODO(backend)`:
  `PATCH /api/admin/announcements/:id { status: 'published', publishedAt }`
  (or `POST` if the draft was never saved), then fan out notifications to
  every selected audience group.

### `/admin/announcements/published` — `AnnouncementPublished.jsx`

- **Real:** shows the actual published title/audience carried over from
  Preview (falls back to sample copy if reached directly). "Create New
  Announcement" and "Return to Dashboard" are real links.
- **Stub:** Estimated Reach, Delivery Reliability, and the Broadcast
  Manifest's other stats are hardcoded — no real audience size to compute
  from yet.
- **Coming Soon:** View/Edit/Duplicate Announcement — nothing persisted
  yet for any of these to act on.

### `/admin/chapters` — `ChapterManagement.jsx`

- **Real:** State/Status filters genuinely filter the table client-side.
  Row "View" (the people icon) → real navigation to `/admin/chapters/detail`.
- **Stub:** the 5 listed chapters, the 4 stat cards, and the Chapter
  Growth Distribution chart are hardcoded. `// TODO(backend)`: a real
  version needs `GET /api/admin/chapters`.
- **Coming Soon:** Create New Chapter, row-level Edit/Archive, Export,
  Generate Report.

### `/admin/chapters/detail` — `ChapterDetail.jsx`

- One chapter (Stanford Alpha), one internal Overview/Students/Startups/
  Events tab switch (`useState`, not 4 separate routes) — the source
  wireframes shipped 4 independently-Stitch-regenerated "chapter detail"
  files that disagreed with each other on the chapter's own name, lead,
  and even sidebar icon; merged into one consistent chapter across all 4
  tabs instead of reproducing that inconsistency as 4 real pages.
- **Real:** tab switching; the "View Students" quick action switches the
  tab directly (no navigation needed, it's the same page).
- **Stub:** every stat, table row, and the Chapter Health score (94%) on
  all 4 tabs are hardcoded. `// TODO(backend)`:
  `GET /api/admin/chapters/:id` (profile + overview) and
  `GET /api/admin/chapters/:id/{students,startups,events}` per tab.
- **Coming Soon:** Edit Chapter, Assign Lead, Export Data, Verify
  Chapter, Approve Funding, Create Event, and the "View Queue" funding
  shortcut.

### `/admin/opportunities` — `OpportunityApprovalQueue.jsx`

- **Real:** Company/Type/Status filters genuinely filter the table
  client-side. Row "View Details" → real navigation to
  `/admin/opportunities/review`.
- **Stub:** the 4 listed opportunities and the 4 stat cards (Pending/
  Approved/Rejected/Drafts) are hardcoded. `// TODO(backend)`:
  `GET /api/admin/opportunities` with the same filter params.
- **Coming Soon:** Export List, Bulk Approve, and row-level Approve/Reject
  icons — deliberately not wired even as a shortcut, since a real decision
  needs the full opportunity in view (same reasoning as
  `VerificationQueue.jsx` not deciding from a queue row either).

### `/admin/opportunities/review` — `OpportunityReview.jsx`

- **Real:** Approve/Reject/Request Changes each open a real `Modal`
  (mirrors `VerificationDecision.jsx`'s 3-decision pattern exactly);
  confirming any of the three navigates back to the queue. Internal Notes
  textarea is a real controlled field (not persisted).
- **Stub:** none of the 3 decisions persist anywhere — `// TODO(backend)`
  at `confirmDecision`: `PATCH /api/admin/opportunities/:id { decision,
reviewerNotes }`, then notify the posting company of the outcome. The
  company profile, opportunity detail, and Revision History are
  hardcoded.
- **Coming Soon:** Message Startup.
- This screen introduces the only decision state (`Pending Approval`)
  that didn't already exist somewhere in this app before — see the
  Company Portal section below for the matching edit to
  `OpportunitiesTable.jsx`.

### `/admin/settings` — `AdminSettings.jsx`

- **Real:** every field in Administrator Profile, Platform Configuration
  (including its 4 functional toggles), Admin Notifications' 8 per-event
  toggles plus the In-App/Email header checkboxes, and the Two-Factor
  Authentication switch are genuine controlled state. "Save Changes"
  updates local state and shows a real "Changes saved" confirmation
  (auto-dismisses after 3s — same instant-update-then-auto-dismiss
  pattern as `ReviewWorkspace.jsx`'s Save Draft, not a fake network
  delay). `// TODO(backend)` at `handleSaveChanges`:
  `PATCH /api/admin/settings { profile, platform, notifications }`.
- **Stub:** System Information, Storage Usage, and Recent Login Activity
  are hardcoded snapshots, not fetched.
- **Coming Soon:** Upload Avatar, Change Password, View Login History,
  Sign Out of All Devices, Download System Logs, Export Config, Backup
  Settings.
- This is a system-configuration page, not a personal-profile page —
  deliberately not reusing Student/Incubator `Settings.jsx`'s Personal
  Info/Education/Skills layout, since the two screens answer different
  questions for different audiences.
- Unlike every other role, Admin has no separate read-only "Profile"
  page — admins aren't shown to other users the way a Mentor/Investor/
  Company/Student/Incubator profile would be, so the header gear and
  avatar both stay pointed at this one page.

---

## Investor Portal

_(Ported from a second intern's — Madhu's — separate repo onto this app's
shell/token/component system; see `CONTRIBUTING.md` §9 for the integration
notes. Only one seeded pitch deck and one seeded submission set exist, same
"honest single example" pattern as Incubator's `ApplicationReview.jsx`.)_

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

### `/investor/settings` — `src/pages/investor/Settings.jsx`

_(New — Investor had no profile/settings page or route at all before this
pass; the header gear + avatar in `InvestorShell.jsx` were both
`ComingSoon` placeholders. Modeled on `pages/mentor/Profile.jsx`'s shape:
identity fields + an account-settings section, rather than Student's
larger `Settings.jsx`.)_

- **Real:** fetches via the existing generic `getMyProfile("investor")`
  and saves via `updateProfile("investor", data)`
  (`src/api/auth/profileApi.js` — same role-parameterized API Mentor's
  profile page already uses); Save is gated on Full Name + Organization
  being non-empty, same `canSave` pattern used everywhere else.
- **Stub:** no investor profile endpoint has ever been called from this
  screen before, so there's nothing to compare against yet — first real
  usage of this API surface for this role. `// TODO(backend)` isn't
  needed here since the call is already real; it just has nothing to
  fetch until a backend profile exists for this role.
- **Coming Soon:** Change Password, Notification Settings, Privacy &
  Security, Deactivate Account — same account-settings stub pattern as
  every other portal's settings screen.
- Header now includes a "View Public Profile" link to `/investor/profile`
  below — the gear icon still points here.

### `/investor/profile` — `src/pages/investor/Profile.jsx`

_(New — read-only "what students/startups see" view; `InvestorShell`'s
header avatar now points here instead of `/investor/settings` (gear
stays on Settings).)_

- **Real:** fetches via the same `getMyProfile("investor")` Settings.jsx
  uses, renders Full Name, Organization/Fund, Investment Stage, and
  Industry Focus read-only, plus a `ComingSoon`-wrapped "Start
  Conversation" CTA (no messaging system exists yet, same as every other
  contact-a-user CTA in this app) and an "Edit Settings" link back.
  Email/phone intentionally left off, same reasoning as Company/Student's
  new Profile pages.
- **Stub:** none — real fetch of the same data Settings.jsx already
  loads.

---

## Mentor Portal

_(Ported from the same second intern's repo; persona consolidated to one
consistent "Priya Anand, Senior Mentor" across all 5 screens — her source
had 3 different names for the mentor's own identity across her 5 files,
one of which collided with this app's real Admin persona, "Alex Rivera.")_

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

### `/mentor/settings` — `src/pages/mentor/Settings.jsx`

_(New route — this file is what `Profile.jsx` used to be before this
pass split it in two: this is the editable half, `Profile.jsx` below is
now the read-only "what students see" half. Same header gear/avatar
split every other portal now has, and the same reason it needed fixing:
both icons pointed at the same page before.)_

- **Real:** every field is a controlled input, Areas of Expertise chip
  add/remove (Enter to add, click × to remove — same pattern as Student
  Settings' Skills chips), Ideal Startup Stages checkboxes, Meeting
  Preference select, Change Photo is a real file picker with instant local
  preview (`URL.createObjectURL`, never uploaded), Save Changes shows a
  real transient confirmation (2s auto-dismiss), "View Public Profile"
  link → `/mentor/profile`.
- **Stub:** Save Changes persists nothing — reload and every edit is gone;
  `// TODO(backend)` is at `handleSaveChanges`.
- **Coming Soon:** all 4 Account Settings rows (Change Password,
  Notification Settings, Privacy & Security, Deactivate Account) —
  genuinely blocked on auth/account infra that doesn't exist yet, unlike
  Student Settings' equivalent flows which have a real backing `Modal`
  (there's no reason to duplicate that work here without a shared
  account-settings component to reuse first).

### `/mentor/profile` — `src/pages/mentor/Profile.jsx`

_(New — previously this route was the edit form (now moved to
`/mentor/settings` above); this is the read-only "what students and the
BOCC community see" view. No live shared state with Settings yet — both
independently seed the same starting values, matching this codebase's
existing "static snapshot" stub convention rather than inventing a
shared fetch neither page had before. `// TODO(backend)`: once `GET
/mentor/profile` exists, wire both pages to it instead.)_

- **Real:** renders the identity card (avatar, name, role, company/
  industry badges, years experience, verified badge, expertise
  highlights) and Mentorship Preferences (ideal stages, preferred
  industries, availability, meeting preference) read-only, plus an "Edit
  Settings" link back to `/mentor/settings`.
- **Stub:** all shown values are the same hardcoded seed Settings.jsx
  starts with — editing one doesn't update the other until a real fetch
  exists.

---

## Company Portal

_(Originally added by a different contributor directly to `main`, outside
the usual branch/PR process this doc otherwise assumes. Fully remediated
— rebuilt on the same shell/token/component conventions as every other
portal. `components/company/CompanyShell.jsx` is the fifth instance of
the shared three-piece shell pattern (Dashboard/Incubator/Admin/
Investor/Mentor before it); the old `layouts/CompanyDashboardShell.jsx`
and `components/bocc/*` are gone.)_

### `/company/dashboard` — `src/pages/company/Dashboard.jsx`

- **Stub:** all 4 stat cards, the Recent Applicant Activity table, and
  the Latest Postings list are hardcoded snapshots — same as every other
  portal's dashboard at this stage.
- **Real:** "Manage Opportunities," "SEE ALL JOB POSTS," "Post New
  Opportunity," "View Applicants," and "View all" (applicant activity)
  all now navigate to real screens — the last three were `ComingSoon`
  until this batch built the screens they point to.

### `/company/my-opportunities` — `src/pages/company/MyOpportunities.jsx`

- **Real:** search genuinely filters the 4 seeded opportunities
  client-side (by title or ref), using the shared `DataTable` component
  (desktop grid → stacked mobile cards, same as every other table in the
  app). "New Opportunity" now navigates to the Post Opportunity wizard
  (was `ComingSoon` until this batch).
- **Stub:** filtering only operates on 4 hardcoded rows. Pagination is
  real (not `ComingSoon`-wrapped) but honestly disabled, and "Showing N
  of 4" reflects the real filtered/total counts — same honest-count
  convention as Admin/Investor's tables.
- **Coming Soon:** each row's Actions (kebab) menu — no edit/close-
  opportunity screen exists yet.
- One of the 4 seeded rows (`Regional Operations Director`) uses a
  `Pending Approval` status alongside the existing Active/Draft/Closed —
  added when Admin's opportunity moderation queue was built (see Admin
  Portal section below), so a posted opportunity has somewhere to sit
  while that queue is reviewing it. Nothing actually connects the two
  screens live — same as every other queue/portal pair in this app —
  this was just the one place a status genuinely had nowhere to point to
  before.

### `/company/post-opportunity/step-{1..4}` — `src/pages/company/PostOpportunityStep{1..4}.jsx`

_(Fills the "Post Opportunity" nav stub. 4-step wizard —
`PostOpportunityStepper.jsx` is the shared progress header, `Next Step`
gates on each step's required fields exactly like every other gated form
in this app.)_

- **Real:** Step 1's Title, Step 2's Required Skills (add-on-Enter/
  remove chips), and Step 3's Overview/Responsibilities (with live
  character counters against each field's max length) all gate
  progression. A small shared module, `postOpportunityDraft.js`, carries
  Title/Type/Work Mode/Location/Salary/Overview/Skills across the 4 routes
  in memory for the current session only — the one place in this app a
  multi-step flow's later screen (Step 4's Live Preview) needs to reflect
  an earlier screen's real input, so it's not backed by the URL or
  `sessionStorage`, just a plain in-memory object that resets on reload
  like everything else here. Step 4's Visibility Settings radio group is
  real local state. "Publish Opportunity" navigates to My Opportunities.
- **Stub:** nothing persists past the browser tab — `// TODO(backend)` at
  each step's `handleSaveDraft`/`handleNext` and Step 4's `handlePublish`:
  `POST /api/opportunities` (or `/drafts`) with the full wizard state.
- **Coming Soon:** Company Logo upload, Supporting Documents upload, Add
  Branch, Change (deadline).

### `/company/applicants`, `/company/applicants/detail` — `ApplicantsList.jsx`, `ApplicantDetail.jsx`

_(Fills the "Applicants" nav stub.)_

- **Real:** `ApplicantsList.jsx`'s 4 filter selects are genuine controlled
  state (visual filtering, not yet wired to the table — same "filter
  controls are real state, don't filter yet" pattern as
  `DiscoverIncubators.jsx`); "Clear all filters" resets them.
  `ApplicantDetail.jsx`'s Application Status select and Internal Notes
  textarea are real controlled fields.
- **Stub:** the opportunity summary card and 3 listed applicants are
  hardcoded; Internal Notes and Application Status don't persist.
  `// TODO(backend)`: `GET /api/opportunities/:id/applicants`, `PATCH
/api/applicants/:id { status, notes }`.
- **Coming Soon:** Filter, Sort, Export, Edit/Close Opportunity, Resume
  icon, Schedule Interview, Download Resume, Contact Applicant, Reject,
  Share Profile, Portfolio/GitHub links.

### `/company/settings` — `src/pages/company/Settings.jsx`

_(New — Company had no profile/settings page or route at all before this
pass; the sidebar's `real: false` "Profile" stub and the header's
`ComingSoon` avatar have both been replaced by this one real page,
matching the "single profile entry point, top-right" pattern now used by
every portal. Modeled on `pages/mentor/Profile.jsx`'s shape.)_

- **Real:** fetches via `getMyProfile("company")` and saves via
  `updateProfile("company", data)` (`src/api/auth/profileApi.js` — same
  generic role-parameterized API Mentor's profile page already uses);
  Save is gated on Full Name + Company Name being non-empty.
- **Stub:** first real usage of this API surface for the company role —
  nothing to compare against yet, just an empty profile until a backend
  record exists.
- **Coming Soon:** Change Password, Notification Settings, Privacy &
  Security, Deactivate Account.
- Header now includes a "View Public Profile" link to `/company/profile`
  below.

### `/company/profile` — `src/pages/company/Profile.jsx`

_(New — read-only "what applicants see" view. Headlines with the company
name, not the account holder's name, since applicants are evaluating the
company. `CompanyShell` had no header gear icon before this pass — one
was added, pointing at Settings; the avatar now points here instead.)_

- **Real:** fetches via the same `getMyProfile("company")` Settings.jsx
  uses, renders Company Name, Industry, Size, and a clickable Website
  link read-only, plus an "Edit Settings" link back. Email/phone/full
  name intentionally left off — account details, not the public profile.
- **Stub:** none — real fetch of the same data Settings.jsx already
  loads.

### Shell — `components/company/CompanyShell.jsx`

Sidebar nav: Dashboard, My Opportunities, Post Opportunity, and
Applicants are all real. The sidebar's `real: false` "Profile" entry and
(later) the fake `real: false` "Settings" entry have both been removed
(dedup pass — one profile entry point per portal, not two, and Settings
belongs at the header gear, not duplicated in the sidebar). Header now
has both a gear icon → `/company/settings` and an avatar → `/company/profile`
(previously only the avatar existed, pointing at Settings — same fix
every other shell got this pass). Header search and notifications remain
`ComingSoon`, matching every other portal shell's header.

---

## Onboarding & Verification Flow

_(Ported from the same second intern's repo — the pre-dashboard steps
between signup and a working portal. Nested under the existing
`AuthLayout` since these are pre-auth screens structurally identical in
kind to Login/ForgotPassword, not a new bespoke shell.)_

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
- **`npm audit`** currently reports 2 high-severity advisories on
  `react-router`/`react-router-dom` ("RSC Mode CSRF Bypass Allows Action
  Execution Before 400 Response"). Checked whether this app is actually
  exposed: the advisory is specific to React Router's RSC (React Server
  Components) mode with server `action`/`loader` functions — this app
  uses plain `createBrowserRouter` with no `action`/`loader`/RSC usage
  anywhere (`src/router.jsx`), and there's no backend for a CSRF-bypassed
  action to reach in the first place, so the vulnerable code path isn't
  exercised. `npm audit fix --force` would downgrade
  `react-router-dom` to `7.11.0` (a breaking change) to resolve an
  advisory that doesn't apply to how this app uses the library — not
  applied. Worth re-checking `npm audit` once this app adopts
  loaders/actions or gets a real backend to call.
