# Business Orbit Campus Clubs (BOCC) - System Architecture

This document describes the high-level architecture of the **Business Orbit Campus Clubs (BOCC)** platform, covering system topology, core subsystems, data modeling, real-time messaging, security controls, and cross-cutting concerns.

---

## 1. Executive Overview

**Business Orbit Campus Clubs (BOCC)** is an ecosystem platform that connects student entrepreneurs with mentors, investors, corporate hiring partners, incubators, and campus chapter administrators. The platform guides student ventures through a structured **5-Stage Startup Journey** (Idea, Validation, Prototype, Launch, Scale/Growth).

### Key System Characteristics
* **Architecture Pattern:** Multi-Frontend Single-Backend Model (6 Specialized Web Portals + Unified Monolithic REST/WebSocket API Server).
* **Backend Stack:** Node.js, Express.js (v5), MongoDB (via Mongoose v9), Socket.IO (v4) for real-time capabilities.
* **Frontend Stack:** React 18, Vite 6, Tailwind CSS, Radix UI / Shadcn primitives, TanStack Query / Router, Framer Motion.
* **Security & Auth:** JWT-based stateless session handling with refresh tokens, Argon2 password hashing, fine-grained Role-Based Access Control (RBAC).

---

## 2. System Architecture Topology

The overall system architecture separates user-facing applications by target role while sharing a single centralized backend server and MongoDB database.

```mermaid
flowchart TD
    subgraph Frontend Applications [React / Vite Web Apps]
        MainPortal["BOCC Main\n(Public Landing & Marketing)"]
        StudentPortal["BOCC Student\n(Student & Founder Portal)"]
        MentorPortal["BOCC Mentor\n(Mentor Portal)"]
        CompanyPortal["BOCC Companies\n(Recruiter & Corporate Portal)"]
        InvestorPortal["BOCC Investor\n(Investor Discovery Portal)"]
        IncubatorPortal["BOCC Incubator\n(Incubator Portal)"]
    end

    subgraph API Gateway & Server Layer [Node.js / Express]
        ExpressServer["Express.js Server (Port 4000)"]
        CorsMW["CORS & JSON Body Parser"]
        AuthMW["Auth Middleware\n(JWT & RBAC Checkers)"]
        ValidationMW["Zod Request Validation"]
        SocketServer["Socket.IO WebSockets Server"]
    end

    subgraph API Route Modules [Express Controllers & Routes]
        AuthRoutes["/api/auth & /api/onboarding"]
        ProfileRoutes["/api/*/profile"]
        StartupRoutes["/api/startup & /api/student"]
        MentorRoutes["/api/mentor & /api/meetings"]
        InvestorRoutes["/api/investor"]
        CompanyRoutes["/api/company"]
        AdminRoutes["/api/admin & /api/public"]
        ChatRoutes["/api/chat"]
    end

    subgraph Backend Services & Utilities
        CascadeService["Cascade Service\n(Dependency Cleanups)"]
        UploadService["Upload Service\n(Multer Storage)"]
        EmailService["Email Utility\n(Nodemailer)"]
    end

    subgraph Database Layer [Persistence]
        MongoDB[("MongoDB Database\n(41 Mongoose Models)")]
    end

    %% Client Connections
    Frontend Applications -->|HTTP REST / HTTPS| ExpressServer
    StudentPortal <-->|WebSockets| SocketServer
    MentorPortal <-->|WebSockets| SocketServer
    InvestorPortal <-->|WebSockets| SocketServer

    %% Server Middleware Processing
    ExpressServer --> CorsMW
    CorsMW --> AuthMW
    AuthMW --> ValidationMW
    ValidationMW --> API Route Modules

    %% Route to Service/Model Mapping
    API Route Modules --> CascadeService
    API Route Modules --> UploadService
    API Route Modules --> EmailService
    API Route Modules --> MongoDB
    SocketServer --> MongoDB
```

---

## 3. Core Subsystems & Business Workflows

### 3.1 Authentication & User Lifecycle Management
* **Role Taxonomy:** `student`, `mentor`, `investor`, `incubator`, `company`, `admin`.
* **Credential Protection:** Passwords are hashed using **Argon2** (`argon2` npm package) before insertion.
* **Token Mechanism:** Dual-token mechanism using JWTs:
  * **Access Token:** Short-lived JWT attached via `Authorization: Bearer <token>`.
  * **Refresh Token:** Stored for token rotation during authentication sessions.
* **Account Status Pipeline:** `pending` -> `active` (upon admin verification or email confirmation) -> `suspended`/`rejected`.

### 3.2 Startup Journey & Stage Progression Subsystem
Students submit their startups through a 5-Stage incubation engine:
1. **Stage 1 - Idea:** Initial vision, problem statement, target audience.
2. **Stage 2 - Validation:** Market research, survey results, user feedback.
3. **Stage 3 - Prototype:** MVP link, architecture breakdown, demo video.
4. **Stage 4 - Launch:** GTM strategy, early metrics, pitch deck.
5. **Stage 5 - Scale/Growth:** Revenue stats, scaling plan, funding request.

**Submission & Review Loop:**
* Students submit evidence and documents via `/api/startup/submit-stage`.
* Reviewers/Admins evaluate submissions via `/api/review`, assigning scores/feedback.
* Approval unlocks progress to the next stage and updates `StartupStage` status.

### 3.3 Mentorship & Scheduling Subsystem
* **Request & Assignment:** Students submit mentorship requests targeting specific expertise domains. Mentors accept or reject via `mentorRequest.controller.js`.
* **Meeting Pipeline:** Mentors and founders schedule advisory sessions via `meeting.controller.js` and `mentorMeeting.controller.js`.
* **Feedback Loop:** Session notes and ratings are logged in `MeetingNotes` and `Review`.

### 3.4 Investor Ecosystem & Deal-Flow Subsystem
* **Pitch Deck Distribution:** Founders publish pitch decks tracked in `StartupPitch`.
* **Analytics & Watchlist:** Investors view pitches (tracked in `PitchView`), bookmark startups (`InvestorWatchlist`), and record internal notes (`InvestorNote`).
* **Direct Deal-Flow Messaging:** Dedicated communication channels created via `InvestorChatRoom` and `InvestorMessage`.

### 3.5 Corporate & Talent Recruitment Subsystem
* **Opportunity Posting:** Companies post jobs, internships, and project bounties (`Opportunity` model).
* **Application Tracking (ATS):** Students apply to postings. Applications progress through statuses (`Applied`, `Shortlisted`, `Interviewing`, `Hired`, `Rejected`) tracked via `ApplicantStatus`.
* **Recruiter Notes & Interviews:** Recruiters record internal candidate ratings (`RecruiterNote`) and schedule interviews (`ApplicationInterview`).

### 3.6 Campus Chapters & Club Governance
* **Chapter Network:** Managed via `Chapter` model (representing physical/virtual campus clubs).
* **Stats & Analytics:** `chapterStatsRouter` summarizes participation, active startups, and mentorship hours per campus.
* **Chapter Transfers:** `ChapterChangeRequest` handles student transfers between institution chapters.

### 3.7 Real-Time Communication Subsystem
* Powered by **Socket.IO** mounted on the primary Node HTTP server (`utils/socket.js`).
* **Socket Handshake Auth:** Validates JWTs passed during handshake (`socket.handshake.auth.token`).
* **Events Supported:**
  * `joinChat`: Binds socket client to a room (`chatId`).
  * `sendMessage`: Broadcasts real-time messages to room members via `receiveMessage`.
  * `markMessagesRead`: Broadcasts read status updates (`messagesRead`).

### 3.8 Referential Integrity & Cascading Deletions
* Mongoose lacks native relational cascading deletes. BOCC implements a dedicated **`cascadeService.js`**.
* **Startup Deletion Graph:** Automatically cleans up `StartupStage`, `StageSubmission`, `Meeting`, `Review`, `MentorRequest`, `MentorAssignment`, `MentorMeeting`, `ChatRoom`, `Message`, `InvestorWatchlist`, `InvestorNote`, `StartupPitch`, and `PitchView`.
* **User Deletion Graph:** Cascades deletion across all 5 profile types (`StudentProfile`, `MentorProfile`, `InvestorProfile`, `IncubatorProfile`, `CompanyProfile`), auth metadata, active applications, recruiter notes, and owned startups.

---

## 4. Data Layer Architecture

The database is built on **MongoDB**, accessed through **Mongoose ORM schemas**. The model architecture consists of 41 specialized collections grouped into logical domains:

```
+-----------------------------------------------------------------------------------+
|                                   MONGODB DATA MODEL                              |
+----------------------------------------+------------------------------------------+
| Domain                                 | Models                                   |
+----------------------------------------+------------------------------------------+
| Core Identity & Profiles               | User, StudentProfile, MentorProfile,     |
|                                        | InvestorProfile, IncubatorProfile,       |
|                                        | CompanyProfile                           |
| Auth & Meta Security                   | EmailVerification, PasswordReset,        |
|                                        | ActivityLog, Notification                |
| Startup & Progression                  | Startup, StartupStage, StageSubmission,  |
|                                        | FeaturedStartup                          |
| Mentorship                             | MentorRequest, MentorAssignment,         |
|                                        | MentorMeeting, MeetingNotes              |
| Review & Evaluation                    | Meeting, Review                          |
| Investor Ecosystem                     | StartupPitch, PitchView,                 |
|                                        | InvestorWatchlist, InvestorNote,         |
|                                        | InvestorChatRoom, InvestorMessage        |
| Opportunity & ATS                      | Opportunity, Application,                |
|                                        | ApplicantStatus, ApplicationInterview,   |
|                                        | RecruiterNote                            |
| Campus Chapters                        | Chapter, ChapterChangeRequest            |
| Messaging                              | ChatRoom, Message                        |
| Platform Metrics & Content             | FAQ, ContactEnquiry, PartnerLogo,        |
|                                        | Statistic, SuccessStory                  |
+----------------------------------------+------------------------------------------+
```

---

## 5. Security Architecture & Controls

```
[ Incoming HTTP Request ]
          │
          ▼
[ 1. CORS Configuration ] ──► Allowed origins validated from process.env.FRONTEND_URL
          │
          ▼
[ 2. Authentication Middleware ] ──► Bearer JWT token verified with JWT_SECRET
          │
          ▼
[ 3. Role Authorization ] ──► Role matched against allowed list via authorizeRoles(...)
          │
          ▼
[ 4. Account Status Check ] ──► Enforces active status via requireActiveAccount
          │
          ▼
[ 5. Input Validation ] ──► Request body validated against Zod Schemas
          │
          ▼
[ Controller Execution ]
```

1. **Token Hygiene:** JWT secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`) are mandated via environment variables.
2. **Role Enforcers:**
   * `requireAuth`: Verifies token and attaches user document to `req.user`.
   * `authorizeRoles(...roles)`: Denies access with 403 Forbidden if `req.user.role` is not permitted.
   * `adminAuth`: Dedicated check for system administrative operations.
3. **Validation Layer:** Zod schemas in `utils/validators.js` and `utils/adminValidators.js` sanitize and validate inputs before controller processing.
4. **File Storage Security:** `uploadService.js` wraps Multer with filename sanitization and explicit file type filters (e.g. PDF/Images only).

---

## 6. Cross-Cutting Concerns

* **Async Error Handling:** Controllers use an `asyncHandler` wrapper to eliminate repetitive `try-catch` blocks and pass uncaught rejections directly to Express error handling middleware (`middlewares/errorHandler.js`).
* **Environment Configuration:** Configured via `dotenv` supporting multi-environment switches (`development`, `test`, `production`). In `test` mode, database autoconnect is suppressed to allow Jest test isolation.
* **Email Dispatcher:** Centralized in `utils/email.js` using `nodemailer` for account verification, password resets, and status notifications.
