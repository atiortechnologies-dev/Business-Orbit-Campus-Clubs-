# Tech Stack (STACK.md)

## System Overview
**Business Orbit Campus Clubs (BOCC)** is a web-based platform supporting student entrepreneurs, startup founders, mentors, incubators, investors, and companies. The backend service provides a RESTful API and real-time WebSocket communication for multi-role user management, startup incubation workflows, mentorship scheduling, and real-time chat.

---

## Core Technologies

### 1. Runtime & Language
- **Language**: JavaScript (Node.js ES6+ / CommonJS standard)
- **Runtime Environment**: Node.js (v18+ / v20+ recommended)
- **Module System**: CommonJS (`"type": "commonjs"`)

### 2. Application Framework
- **Web Framework**: **Express.js** (`express` `^5.2.1`)
  - Handles routing, middleware execution, HTTP request/response lifecycles, and error handling.
- **HTTP Server**: Node.js native `http` module
  - Wraps the Express application instance to share the port with Socket.IO.

### 3. Real-Time Engine
- **WebSocket Framework**: **Socket.IO** (`socket.io` `^4.8.3`)
  - Enables real-time bi-directional event-driven communication.
  - Used for real-time messaging across user roles (`joinChat`, `sendMessage`, `receiveMessage`, `markMessagesRead`).
  - Secured via JWT handshake authentication middleware (`socket.handshake.auth.token`).

---

## Database & Persistence Layer

### 1. Database System
- **Database**: **MongoDB** (v6.0+)
- **Object Data Modeling (ODM)**: **Mongoose** (`mongoose` `^9.7.4`)

### 2. Configuration & Connection Lifecycle
- **Connection Module**: `config/db.js`
- **URI Configuration**: Reads `process.env.MONGODB_URI` (defaults to `mongodb://localhost:27017/bocc` or `registration_db`).
- **Connection Lifecycle Management**: Includes connection event logging and graceful shutdown (`SIGINT` process signal trap to close DB connections cleanly).

### 3. Data Models (41 Collections/Schemas)
- **Core User & Profiles**: `User`, `StudentProfile`, `MentorProfile`, `InvestorProfile`, `IncubatorProfile`, `CompanyProfile`.
- **Startups & Submissions**: `Startup`, `StartupStage`, `StageSubmission`, `StartupPitch`, `PitchView`, `FeaturedStartup`.
- **Mentorship & Meetings**: `MentorProfile`, `MentorAssignment`, `MentorRequest`, `MentorMeeting`, `Meeting`, `MeetingNotes`.
- **Communication & Chat**: `ChatRoom`, `Message`, `InvestorChatRoom`, `InvestorMessage`.
- **Administration & Governance**: `Chapter`, `ChapterChangeRequest`, `ActivityLog`, `Statistic`, `Review`.
- **Utilities & Verification**: `EmailVerification`, `PasswordReset`, `ContactEnquiry`, `Notification`, `Opportunity`, `Resource`, `PartnerLogo`, `SuccessStory`, `FAQ`, `ApplicantStatus`, `Application`, `ApplicationInterview`, `InvestorNote`, `InvestorWatchlist`, `RecruiterNote`.

---

## Security & Authentication

### 1. Token-Based Authentication
- **Library**: **JSONWebToken** (`jsonwebtoken` `^9.0.3`)
- **Strategy**: Dual JWT Token Strategy (Access + Refresh)
  - **Access Token**: Short-lived (default `7d`), includes user ID, role, and email (`issuer: "bcoc-backend"`).
  - **Refresh Token**: Long-lived (default `30d`), includes user ID, role, and type claim (`type: "refresh"`).
- **Access Control Middleware**: `middlewares/requireAuth.js` with role-based authorization (`authorizeRoles`).

### 2. Password Security
- **Hashing Library**: **Argon2** (`argon2` `^0.44.0`)
- **Variant**: `argon2id`
- **Cost Parameters**:
  - Memory cost: `65536 KB` (64 MB)
  - Time cost: `3` iterations
  - Parallelism: `1` thread

### 3. Request Validation
- **Library**: **Zod** (`zod` `^4.4.3`)
- **Usage**: Strongly-typed schema validation for request payloads.
- **Key Schemas**:
  - Discriminated union user registration (`registerSchema`) for `student`, `mentor`, `investor`, `incubator`, `company`.
  - Password complexity enforcement (uppercase, lowercase, number, special char, min 8 chars).
  - Onboarding profile completion, idea submission, and meeting requests.

### 4. Cross-Origin Resource Sharing (CORS)
- **Library**: **CORS** (`cors` `^2.8.6`)
- **Config File**: `config/cors.js`
- **Allowed Origins**: `http://localhost:5173`, `process.env.FRONTEND_URL` with dynamic origin verification and credentials support (`credentials: true`).

---

## Media & File Processing

- **Upload Handler**: **Multer** (`multer` `^2.2.0`)
- **Storage Target**: Local Disk Storage (`assets/uploads/`) via `utils/uploadService.js`.
- **Limits & Constraints**: Max 10MB file size per request.
- **Supported MIME Types**: `image/jpeg`, `image/png`, `image/gif`, `application/pdf`, `application/vnd.ms-powerpoint`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

---

## Configuration & Environment Management

- **Environment Loader**: **Dotenv** (`dotenv` `^17.4.2`)
- **Config Files**: `.env` (runtime config), `.env.example` (template reference).

---

## Development, Testing & Code Quality

### 1. Test Framework
- **Test Runner**: **Jest** (`jest` `^30.4.2`)
- **HTTP Assertion Library**: **Supertest** (`supertest` `^7.2.2`)
- **Environment Management**: **Cross-env** (`cross-env` `^10.1.0`)
- **Test Command**: `npm test` (`cross-env NODE_ENV=test JWT_SECRET=testsecret JWT_REFRESH_SECRET=testrefreshsecret jest --detectOpenHandles --coverage --runInBand`)

### 2. Code Quality & Linting
- **Linter**: **ESLint** (`eslint` `^10.7.0`)
- **Preset Rules**: `@eslint/js` (`^10.0.1`)
- **Globals Support**: `globals` (`^17.7.0`)
- **Lint Command**: `npm run lint`

### 3. Development Server
- **Process Manager**: **Nodemon** (`nodemon` `^3.1.14`) configured via `nodemon.json`.
- **Dev Command**: `npm run dev`

---

## Summary Stack Table

| Category | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | v18+ | JavaScript Server Runtime |
| **Framework** | Express.js | ^5.2.1 | REST API Web Server |
| **Real-time** | Socket.IO | ^4.8.3 | WebSocket Engine for Real-time Messaging |
| **Database** | MongoDB | v6.0+ | Document-oriented Database |
| **ODM** | Mongoose | ^9.7.4 | Data Modeling & DB Driver |
| **Authentication** | jsonwebtoken | ^9.0.3 | JWT Generation & Verification |
| **Password Hashing** | argon2 | ^0.44.0 | Key Derivation & Hashing (argon2id) |
| **Validation** | Zod | ^4.4.3 | Data Schema & Payload Validation |
| **File Uploads** | Multer | ^2.2.0 | Multipart form-data File Upload handling |
| **Email Delivery** | Nodemailer | ^9.0.3 | Transactional SMTP Email Delivery |
| **Testing** | Jest + Supertest | ^30.4.2 / ^7.2.2 | Unit & Integration Testing |
| **Linting** | ESLint | ^10.7.0 | Static Code Analysis |
