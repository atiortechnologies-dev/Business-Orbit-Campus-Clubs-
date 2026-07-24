# Codebase Structure

## Root Layout

```
Backend/
├── assets/                  # File uploads storage & static assets
├── config/                  # Server & database connection setup
├── constants/               # Global enumerations & system constants
├── controllers/             # Request handlers & domain business logic
├── coverage/                # Jest code coverage reports
├── docs/                    # Architectural docs & CHANGELOG
├── middlewares/             # Express request pipeline & security middlewares
├── models/                  # Mongoose data schemas (41 MongoDB collections)
├── routes/                  # Express route definitions & endpoint mapping
├── seeds/                   # Database initial seed scripts
├── services/                # Specialized domain orchestration & cascade logic
├── tests/                   # Jest test suites (unit, integration, transactions)
├── utils/                   # Shared helpers, validators, state machines & socket
├── .env.example             # Template for environment variable configurations
├── eslint.config.js         # ESLint code quality rules configuration
├── jest.config.js           # Jest runner configuration
├── nodemon.json             # Live-reload configuration for development
├── package.json             # Dependencies, scripts, and project metadata
└── server.js                # Main application entry point & server bootstrap
```

---

## Directory & File Detail

### 1. Root Configuration & Entry Point

- **`server.js`**: Core entry point. Initializes Express application, connects to MongoDB via `config/db.js`, mounts CORS middleware, binds static uploads, registers API routes, mounts global 404 & error handlers, creates HTTP server, and attaches Socket.IO via `utils/socket.js`.
- **`package.json`**: Package configuration specifying standard dependencies (`express`, `mongoose`, `argon2`, `jsonwebtoken`, `socket.io`, `zod`, `nodemailer`, `multer`) and dev dependencies (`jest`, `supertest`, `eslint`).
- **`.env.example`**: Environment variable contract specifying `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `SMTP_*` parameters, and `FRONTEND_URL`.
- **`jest.config.js`**: Specifies test environment (`node`), coverage thresholds, match patterns (`*.test.js`), and test setup hooks (`tests/setup.js`).
- **`eslint.config.js`**: Configuration for code linting and style enforcement.

---

### 2. `config/` — Environment & Connection Setup

Handles low-level application bootstrap and infrastructure connections.

- **`config/db.js`**: Manages MongoDB connection lifecycle via Mongoose. Handles connection retry logic, connection logging, and graceful process shutdown listeners (`SIGINT`).
- **`config/cors.js`**: Configures cross-origin resource sharing headers based on allowed frontend URLs from environment variables.

---

### 3. `constants/` — System Constants & Enumerations

Centralizes static definitions and application-wide status constants.

- **`constants/statusConstants.js`**: Exported status enumerations for accounts (`pending_verification`, `pending_approval`, `active`, `rejected`, `suspended`), startup stages (`ideation`, `validation`, `prototype`, `mvp`, `launch`, `scaling`), meeting statuses, and application states.

---

### 4. `controllers/` — Request Handling & Business Orchestration

Houses 21 controller modules executing business logic for specific domain boundaries:

- **`admin.controller.js`**: System administration actions (user approval/rejection workflows, campus chapter management, platform metrics, public landing page content curation).
- **`auth.controller.js`**: User registration with transactional profile creation, login, email OTP verification, password reset, refresh token issuance, and current user (`/me`) fetching.
- **`chapter.controller.js`**: Campus club/chapter management, chapter stats calculation, member management, and student chapter transfer requests.
- **`chat.controller.js`**: Direct chat room creation, message querying, attachment handling, and real-time event dispatching for student-mentor messaging.
- **`companyApplication.controller.js`**: Recruiter-facing controller for reviewing job/internship applications, scheduling interviews, updating candidate statuses, and adding recruiter notes.
- **`dashboard.controller.js`**: Student dashboard aggregation returning user startup status, pending meetings, upcoming interviews, and notifications.
- **`investorDiscovery.controller.js`**: Investor discovery tools (browsing startups, filtering by stage/sector, pitch deck views, watchlist management, founder note-taking, investor-founder chat creation).
- **`meeting.controller.js`**: Review meeting scheduling, reviewer assignment, meeting room links, and status updates.
- **`mentorDashboard.controller.js`**: Mentor dashboard metrics (assigned startups, upcoming mentorship sessions, pending mentorship requests).
- **`mentorMeeting.controller.js`**: Mentor-student session scheduling, agenda management, link sharing, and session completion logging.
- **`mentorProfile.controller.js`**: Mentor profile CRUD, expertise areas, bio, domain tags, and availability schedules.
- **`mentorRequest.controller.js`**: Student/startup mentorship application processing, mentor approval/rejection logic, and mentorship assignment creation.
- **`onboarding.controller.js`**: Step-by-step user onboarding flow and profile completion check.
- **`profile.controller.js`**: Universal polymorphic profile handler performing CRUD operations across `StudentProfile`, `MentorProfile`, `InvestorProfile`, `IncubatorProfile`, and `CompanyProfile`.
- **`public.controller.js`**: Unauthenticated endpoints for public landing page (platform metrics, featured startups, FAQs, brand logo carousel, success stories, contact form handling).
- **`resource.controller.js`**: Educational resource library CRUD (guides, pitch deck templates, founder toolkits).
- **`review.controller.js`**: Reviewer evaluations, rubric scoring, feedback logging, and approval/rejection of startup stage milestones.
- **`startup.controller.js`**: Startup registration, co-founder management, logo/pitch attachment, profile updates, and startup deletion.
- **`startupProgress.controller.js`**: Stage progression check-ins, milestone evaluation triggers, and stage transition execution.
- **`student.controller.js`**: Student action routes (exploring opportunities, submitting job applications, viewing assigned mentor, requesting chapter changes).
- **`submission.controller.js`**: Stage deliverable submissions (links, documents, descriptions) submitted by student founders.

---

### 5. `middlewares/` — Request Pipeline Guards & Interceptors

Interceptor layers validating requests, verifying security tokens, and handling errors.

- **`requireAuth.js`**: Core authentication and authorization middleware. Includes `requireAuth` (verifies Bearer JWT), `authorizeRoles(...roles)` (enforces RBAC), and `requireActiveAccount` (checks account status).
- **`adminAuth.js`**: Middleware specifically validating `admin` or `superadmin` privileges.
- **`validateRequest.js`**: Generic middleware enforcing Zod schema validation against `req.body`, `req.query`, or `req.params`. Attaches validated result to `req.validatedData`.
- **`asyncHandler.js`**: Higher-order function wrapping async route handlers to catch unhandled Promise rejections and pass them to global error middleware.
- **`errorHandler.js`**: Global 404 handler (`notFound`) and error handler (`errorHandler`) formatting standardized error response payloads.
- **`authMiddleware.js`**: Secondary/legacy authentication middleware module.
- **`validators/mentorValidators.js`**: Specific validation schemas for mentor interactions.

---

### 6. `models/` — Mongoose Data Schemas (41 Models)

Declarative Mongoose schemas defining MongoDB document structure, indexes, and relationships:

| Category | Model Files | Description |
| :--- | :--- | :--- |
| **User & Profiles** | `User.js`, `StudentProfile.js`, `MentorProfile.js`, `InvestorProfile.js`, `IncubatorProfile.js`, `CompanyProfile.js` | Core authentication identity, credential hashes, roles, and role-specific domain profiles. |
| **Authentication & Meta** | `EmailVerification.js`, `PasswordReset.js`, `ActivityLog.js`, `Notification.js` | OTP tokens, password reset hashes, system audit trails, and user notifications. |
| **Campus Chapters** | `Chapter.js`, `ChapterChangeRequest.js`, `Statistic.js` | University chapter information, student transfer requests, and aggregate campus stats. |
| **Startup Ecosystem** | `Startup.js`, `StartupStage.js`, `StageSubmission.js`, `FeaturedStartup.js` | Startup profiles, multi-stage progress tracking, milestone deliverables, and showcase listings. |
| **Review & Evaluation** | `Meeting.js`, `Review.js` | Reviewer meeting schedules, scoring matrices, and stage milestone evaluations. |
| **Mentorship System** | `MentorRequest.js`, `MentorAssignment.js`, `MentorMeeting.js` | Mentorship requests, active pairing records, and 1-on-1 meeting slots. |
| **Investor System** | `StartupPitch.js`, `PitchView.js`, `InvestorWatchlist.js`, `InvestorNote.js`, `InvestorChatRoom.js`, `InvestorMessage.js` | Pitch deck publishing, view analytics, investor saved lists, founder chat rooms, and messaging. |
| **Recruitment Ecosystem**| `Opportunity.js`, `Application.js`, `ApplicantStatus.js`, `ApplicationInterview.js`, `RecruiterNote.js` | Job/internship postings, student applications, state pipelines, interviews, and recruiter notes. |
| **Chat & Messaging** | `ChatRoom.js`, `Message.js` | Student-mentor direct messaging chat rooms and message history. |
| **Public Landing Page** | `FAQ.js`, `PartnerLogo.js`, `SuccessStory.js`, `ContactEnquiry.js`, `Resource.js` | Public FAQs, corporate logos, success stories, contact inquiries, and resource materials. |

---

### 7. `routes/` — Endpoint Route Aggregation

Express Router definitions registering HTTP methods, path patterns, middlewares, and controller handlers:

- **`auth.routes.js`**: `/api/auth/*` (register, login, verify-otp, send-otp, forgot-password, reset-password, refresh-token, me).
- **`onboarding.routes.js`**: `/api/onboarding/*` (onboarding step submission and status check).
- **`profile.routes.js`**: `/api/<role>/profile/*` (dynamic profile router factory).
- **`chapter.routes.js`**: `/api/student/chapter/*` and `/api/chapter/*`.
- **`student.routes.js`**: `/api/student/*` (student action endpoints).
- **`startup.routes.js`**: `/api/startup/*` (startup management and pitch handling).
- **`submission.routes.js`**: `/api/startup/submissions/*` (stage deliverables).
- **`mentor.routes.js`**: `/api/mentor/*` (mentor dashboard, requests, and meetings).
- **`company.routes.js`**: `/api/company/*` (job postings and application candidate management).
- **`investor.routes.js`**: `/api/investor/*` (startup discovery, pitches, and watchlists).
- **`admin.routes.js`**: `/api/admin/*` (superadmin governance endpoints).
- **`dashboard.routes.js`**: `/api/student/dashboard/*` (student metric feeds).
- **`resource.routes.js`**: `/api/resources/*` (resource library access).
- **`meeting.routes.js`**: `/api/meetings/*` (reviewer & startup meetings).
- **`review.routes.js`**: `/api/review/*` (evaluation submissions).
- **`chat.routes.js`**: `/api/chat/*` (chat room initialization and message history).
- **`public.routes.js`**: `/api/public/*` (landing page data feeds).

---

### 8. `services/` — Orchestration & Business Logic Services

Domain services encapsulating logic that spans multiple models or requires specialized execution:

- **`cascadeService.js`**: Orchestrates deep cascading deletions when primary entities (`User` or `Startup`) are deleted. Contains `deleteUserDependencies(userId)` and `deleteStartupDependencies(startupId)` executing cleanup across 25+ dependent Mongoose collections.
- **`chatRoomService.js`**: Service for finding or creating student-mentor chat rooms and initializing room state.

---

### 9. `utils/` — Utility Modules & Integrations

Core utilities supporting authentication, validation, state machines, file management, and WebSockets:

- **`socket.js`**: Configures Socket.IO server, attaches JWT authentication handshake middleware, manages room joining (`joinChat`), real-time message broadcasting (`sendMessage`), and read receipts.
- **`password.js`**: Password security utilities using Argon2 (`hashPassword`, `comparePassword`).
- **`token.js`**: JWT generation and verification for Access Tokens and Refresh Tokens using `jsonwebtoken`.
- **`email.js`**: Email dispatching service using Nodemailer. Formats standardized HTML templates for OTP verification and password resets.
- **`roleConfig.js`**: Role definitions, initial account statuses, redirect rules, and navigation configurations.
- **`stageDefinitions.js`**: Taxonomies and requirements for startup journey stages (*Ideation*, *Validation*, *Prototype*, *MVP*, *Launch*, *Scaling*).
- **`startupJourney.js`**: Evaluates stage completion criteria and executes eligibility transitions for startups.
- **`reviewProcessing.js`**: Algorithms calculating aggregate scores from reviewer evaluations to determine pass/fail criteria.
- **`uploadService.js`**: Multer disk storage engine configuration specifying upload paths (`assets/uploads`), filename generation, and MIME type filters.
- **`validators.js`**: Zod validation schemas for registration, auth, profiles, and startup creation.
- **`adminValidators.js`**: Zod validation schemas for administrative system operations.

---

### 10. `seeds/` — Database Seeding Scripts

Script utilities for bootstrapping development and testing database instances:

- **`adminSeed.js`**: Idempotent script seeding default Super Admin account credentials into MongoDB.
- **`landingPageSeed.js`**: Seeds initial landing page content including FAQs, brand logos, platform stats, and success stories.
- **`seedRequests.js`**: Generates mock mentorship requests and chapter change data for local testing.

---

### 11. `tests/` — Automated Test Suite

Comprehensive test coverage built with Jest and Supertest:

- **Unit Tests**: Model schema validation tests (`models.test.js`, `test_models_standalone.js`).
- **Controller Tests**: Isolated unit tests for individual controllers under `tests/controllers/`.
- **Transaction Tests**: Multi-document transaction rollback tests (`submission.transactions.test.js`, `companyApplication.transactions.test.js`).
- **Cascade Delete Tests**: Comprehensive dependency deletion verification (`cascadeDelete.comprehensive.test.js`, `cascadeDelete.integration.test.js`).
- **Integration & E2E Tests**: Full user journey lifecycle tests (`fullJourney.integration.test.js`, `integration.test.js`).
- **Socket Tests**: WebSocket authentication and real-time message exchange tests (`test_socket.js`).
