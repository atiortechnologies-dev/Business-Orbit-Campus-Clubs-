# Business Orbit Campus Clubs (BOCC) - Project Structure & Directory Layout

This document describes the directory structure, module boundaries, component responsibilities, and file organization of the **Business Orbit Campus Clubs (BOCC)** repository.

---

## 1. Repository Layout Overview

The codebase is organized as a monorepo containing a shared Node.js/Express backend server and six (6) distinct React frontend applications.

```
Business-Orbit-Campus-Clubs-/
├── Backend/                    # Express.js REST & WebSocket API Backend
├── Frontend/                   # 6 Specialized Frontend React Applications
│   ├── BOCC Main/              # Public Marketing & Platform Portal
│   ├── BOCC Student/           # Student & Founder Portal
│   ├── BOCC Mentor/            # Mentor Workspace Portal
│   ├── BOCC Companies/         # Corporate & Recruiter Portal
│   ├── BOCC Investor/          # Investor Discovery & Portfolio Portal
│   └── BOCC Incubator/         # Incubator Cohort Portal
├── docs/                       # Project Product Requirement Documents (PRD)
├── ui_wireframes/              # UI Wireframe designs and assets
├── assets/                     # Shared root assets
└── .planning/                  # Project planning and codebase documentation
```

---

## 2. Backend Directory Structure (`Backend/`)

The Backend is structured as a layered Express.js application following MVC principles, augmented by dedicated service layers for complex operations like cascading deletions.

```
Backend/
├── server.js                   # Application entry point, Express server & Socket.IO setup
├── config/                     # Core system configurations
│   ├── db.js                   # MongoDB connection lifecycle management
│   └── cors.js                 # CORS security configuration
├── constants/                  # System-wide enum constants
│   └── statusConstants.js      # Account statuses, stage states, meeting statuses
├── controllers/                # Request handlers and business logic execution (21 controllers)
│   ├── admin.controller.js            # Platform administration endpoints
│   ├── auth.controller.js             # User login, registration, token refresh
│   ├── chapter.controller.js          # Campus chapter statistics and management
│   ├── chat.controller.js             # Direct messaging endpoints
│   ├── companyApplication.controller.js# Job postings and applicant management
│   ├── dashboard.controller.js        # Student/Founder aggregated metrics
│   ├── investorDiscovery.controller.js# Pitch decks and investor interactions
│   ├── meeting.controller.js          # Founder review meeting operations
│   ├── mentorDashboard.controller.js  # Mentor statistics and overview
│   ├── mentorMeeting.controller.js    # Mentor-founder advisory meetings
│   ├── mentorProfile.controller.js    # Mentor profile creation & updates
│   ├── mentorRequest.controller.js    # Mentorship connection workflows
│   ├── onboarding.controller.js       # User role onboarding workflows
│   ├── profile.controller.js          # Dynamic profile router logic
│   ├── public.controller.js           # Public landing content & statistics
│   ├── resource.controller.js         # Educational material management
│   ├── review.controller.js           # Stage review and evaluation logic
│   ├── startup.controller.js          # Venture creation & profile management
│   ├── startupProgress.controller.js   # 5-stage progress tracking
│   ├── student.controller.js          # Student management & operations
│   └── submission.controller.js       # Stage submission upload & reviews
├── middlewares/                # Custom Express middlewares
│   ├── adminAuth.js            # Admin-only access guard
│   ├── asyncHandler.js         # Async error wrapper for Express routes
│   ├── authMiddleware.js       # General JWT verification
│   ├── errorHandler.js         # Global 404 & 500 error handlers
│   ├── requireAuth.js          # Strict JWT auth & role authorization guards
│   ├── validateRequest.js      # Request body validator middleware using Zod
│   └── validators/             # Domain-specific validation rules
│       └── mentorValidators.js # Mentor request validation schemas
├── models/                     # Mongoose Schema Definitions (41 Models)
│   ├── ActivityLog.js          # User action logging
│   ├── ApplicantStatus.js      # Job application state history
│   ├── Application.js          # Student job/internship applications
│   ├── ApplicationInterview.js # Recruiter interview schedules
│   ├── Chapter.js              # Institution chapter records
│   ├── ChapterChangeRequest.js # Transfer requests between chapters
│   ├── ChatRoom.js             # Student-Mentor chat room metadata
│   ├── CompanyProfile.js       # Recruiter profile schema
│   ├── ContactEnquiry.js       # Public contact form submissions
│   ├── EmailVerification.js    # OTP email verification tokens
│   ├── FAQ.js                  # Platform FAQ questions and answers
│   ├── FeaturedStartup.js      # Highlighted startups on landing page
│   ├── IncubatorProfile.js     # Incubator profile schema
│   ├── InvestorChatRoom.js     # Investor-Founder deal-flow chat metadata
│   ├── InvestorMessage.js      # Investor-Founder chat messages
│   ├── InvestorNote.js         # Private investor notes on startups
│   ├── InvestorProfile.js      # Investor profile schema
│   ├── InvestorWatchlist.js    # Bookmarked startups by investors
│   ├── Meeting.js              # Formal stage evaluation meetings
│   ├── MeetingNotes.js         # Meeting summary and action points
│   ├── MentorAssignment.js     # Assigned student-mentor pairings
│   ├── MentorMeeting.js        # Advisory meeting bookings
│   ├── MentorProfile.js        # Mentor profile schema
│   ├── MentorRequest.js        # Mentorship connection requests
│   ├── Message.js              # Student-Mentor chat messages
│   ├── Notification.js         # User notifications
│   ├── Opportunity.js          # Job/Internship postings
│   ├── PartnerLogo.js          # Partner company logos for showcase
│   ├── PasswordReset.js        # Password reset tokens
│   ├── PitchView.js            # Analytics on startup pitch deck views
│   ├── RecruiterNote.js        # Private notes by recruiters on applicants
│   ├── Resource.js             # Educational tools and guidelines
│   ├── Review.js               # Formal startup stage review feedback
│   ├── StageSubmission.js      # Artifact submissions per startup stage
│   ├── Startup.js              # Core startup venture entity
│   ├── StartupPitch.js         # Startup pitch decks & details
│   ├── StartupStage.js         # Tracked progress per stage (1 to 5)
│   ├── Statistic.js            # Platform statistics
│   ├── StudentProfile.js       # Student profile schema
│   ├── SuccessStory.js         # Featured success stories
│   └── User.js                 # Unified User account identity model
├── routes/                     # Express Router Definitions (17 Routers)
│   ├── admin.routes.js         # Protected admin endpoints
│   ├── auth.routes.js          # Authentication & token endpoints
│   ├── chapter.routes.js       # Chapter stats & transfer routes
│   ├── chat.routes.js          # Real-time chat history endpoints
│   ├── company.routes.js        # Corporate opportunities & applicants
│   ├── dashboard.routes.js      # Aggregated dashboard metrics
│   ├── investor.routes.js       # Investor discovery & pitch routes
│   ├── meeting.routes.js        # Review meeting endpoints
│   ├── mentor.routes.js        # Mentor workflows & workspace
│   ├── onboarding.routes.js     # User profile onboarding setup
│   ├── profile.routes.js       # Polymorphic profile management routes
│   ├── public.routes.js        # Unauthenticated landing data
│   ├── resource.routes.js      # Resource hub endpoints
│   ├── review.routes.js        # Stage evaluation routes
│   ├── startup.routes.js       # Startup CRUD endpoints
│   ├── student.routes.js       # Student workspace endpoints
│   └── submission.routes.js    # Stage submission uploads
├── services/                   # Business domain services
│   ├── cascadeService.js       # Multi-model cascading deletion orchestrator
│   └── chatRoomService.js      # Chat room creation & participant validation
├── utils/                      # Helper modules and utilities
│   ├── adminValidators.js      # Zod schemas for admin operations
│   ├── email.js                # Nodemailer email transport logic
│   ├── password.js             # Argon2 password hashing & verification
│   ├── reviewProcessing.js     # Calculations for stage pass/fail scores
│   ├── roleConfig.js           # Role mapping and permission flags
│   ├── socket.js               # Socket.IO connection handling & events
│   ├── stageDefinitions.js     # 5-stage metadata definitions
│   ├── startupJourney.js       # Progress calculations across 5 stages
│   ├── token.js                # JWT sign, verify, and decode helpers
│   ├── uploadService.js        # Multer disk storage engine configuration
│   └── validators.js           # Zod validation schemas for request bodies
├── seeds/                      # Seed scripts
│   └── adminSeed.js            # Super-admin initial provisioning script
├── tests/                      # Jest test suites
│   ├── admin.test.js
│   ├── auth.test.js
│   ├── setup.js
│   └── ...
└── package.json                # Backend dependency configuration
```

---

## 3. Frontend Micro-Portals (`Frontend/`)

The frontend is divided into six separate Vite-powered React applications, each tailored to a specific ecosystem persona:

### 3.1 `BOCC Main` (Public Marketing & Platform Site)
* **Purpose:** Public landing page showcasing BOCC programs, partner institution logos, success stories, roadmap, and contact forms.
* **Tech Stack:** React 18, Vite 6, TypeScript, TanStack Router, Tailwind CSS, Radix UI.
* **Key Directories:**
  * `src/components/landing/`: Landing sections (Hero, Advantage, Ecosystem, Roadmap, Stories, Contact, Navbar, Footer).
  * `src/components/ui/`: Radix UI primitive wrappers (Button, Dialog, Sheet, Carousel, Accordion, Card).
  * `src/routes/`: TanStack Router file-based route definitions (`__root.tsx`, `index.tsx`).

### 3.2 `BOCC Student` (Student & Founder Workspace)
* **Purpose:** Dashboard for student founders to manage their venture, complete 5-stage journey tasks, request mentors, apply for corporate jobs, and view chapter stats.
* **Tech Stack:** React 18, Vite 6, React Router v6, Tailwind CSS, TanStack Query, Radix UI.
* **Key Directories:**
  * `src/pages/`: Main page components (`Home`, `Login`, `Register`, `ForgotPassword`, `ResetPassword`).
  * `src/components/`: Reusable UI elements, auth layout wrappers, landing summaries, and protected route handlers.
  * `src/lib/`: `AuthContext.jsx` for global user session state, custom QueryClient setup.

### 3.3 `BOCC Mentor` (Mentor Portal)
* **Purpose:** Portal for assigned mentors to review student venture submissions, schedule advisory sessions, conduct chat discussions, and log meeting notes.
* **Tech Stack:** React 18, Vite 6, React Router v6, Tailwind CSS, Framer Motion, Radix UI, TanStack Query.
* **Key Directories:**
  * `src/components/mentor-landing/`: Specialized mentor onboarding and metrics widgets.
  * `src/components/motion/`: Framer Motion animation helpers.
  * `src/pages/`: Authentication & main dashboard views.

### 3.4 `BOCC Companies` (Recruiter & Corporate Portal)
* **Purpose:** Portal for corporate hiring managers to publish job postings/internships, manage candidate pipelines, schedule candidate interviews, and add recruiter notes.
* **Tech Stack:** React 18, Vite 6, React Router v6, Tailwind CSS, Radix UI, TanStack Query.
* **Key Directories:**
  * `src/components/bocc/`: Corporate dashboards and applicant pipeline cards.
  * `src/lib/AuthContext.jsx`: Auth context provider supporting corporate user validation.

### 3.5 `BOCC Investor` (Investor Discovery Portal)
* **Purpose:** Platform for angel investors and VCs to search startup pitch decks, maintain watchlists, track pitch views, and engage founders in deal-flow chats.
* **Tech Stack:** React 18, Vite 6, TypeScript, Tailwind CSS, Radix UI.
* **Key Directories:**
  * `src/components/landing/`: Pitch deck showcases, statistics, investment workflows.
  * `src/App.tsx`: Main investor portal root component.

### 3.6 `BOCC Incubator` (Incubator Portal)
* **Purpose:** Workspace for incubator managers to track startup cohorts, manage stage reviews, and facilitate resource allocation.
* **Tech Stack:** React 18, Vite 6, React Router v6, Tailwind CSS, Framer Motion.
* **Key Directories:**
  * `src/components/bocc/`: Cohort monitoring and incubation status widgets.
  * `src/hooks/useScrollReveal.js`: Motion and reveal animation hooks.

---

## 4. Module Boundaries & Layering Rules

```
+-----------------------------------------------------------------------+
|                           HTTP / WebSocket Layer                       |
|        (server.js, utils/socket.js, Express Router definitions)        |
+-----------------------------------------------------------------------+
                                    │
                                    ▼
+-----------------------------------------------------------------------+
|                          Middleware Layer                             |
|    (authMiddleware, requireAuth, adminAuth, validateRequest, Zod)     |
+-----------------------------------------------------------------------+
                                    │
                                    ▼
+-----------------------------------------------------------------------+
|                          Controller Layer                             |
| (admin.controller, auth.controller, startupProgress.controller, etc.) |
+-----------------------------------------------------------------------+
                                    │
                                    ▼
+-----------------------------------------------------------------------+
|                           Service Layer                               |
|        (cascadeService.js, chatRoomService.js, uploadService.js)      |
+-----------------------------------------------------------------------+
                                    │
                                    ▼
+-----------------------------------------------------------------------+
|                       Persistence / Model Layer                       |
|           (Mongoose Models: User, Startup, StageSubmission...)        |
+-----------------------------------------------------------------------+
```

### Architectural Layering Guidelines:
1. **Controllers must not call database operations directly when complex cascades are involved:** All multi-model deletions and dependency cleanups MUST be delegated to `services/cascadeService.js`.
2. **Strict Middleware Isolation:** Controllers assume that `req.user` is present and valid if the route is wrapped with `requireAuth`.
3. **No Direct Inter-Frontend Imports:** Each frontend in `Frontend/` is isolated with its own `package.json`, build pipeline, and component tree.
4. **Validation Separation:** All API payload validation logic resides in `utils/validators.js` and `middlewares/validateRequest.js`, keeping controllers focused strictly on orchestration and HTTP response formatting.

---

## 5. Summary of Configuration & Tooling Files

* `Backend/package.json`: Manages backend dependencies (`express`, `mongoose`, `argon2`, `jsonwebtoken`, `socket.io`, `zod`, `multer`, `nodemailer`).
* `Backend/jest.config.js`: Configuration for backend integration and unit test execution.
* `Backend/eslint.config.js`: Linter rules for backend JavaScript code.
* `Frontend/*/vite.config.js`: Port configs, path aliases (`@/`), and React plugins for each frontend portal.
* `Frontend/*/tailwind.config.js`: Custom styling theme tokens and animation plugins for Tailwind CSS.
