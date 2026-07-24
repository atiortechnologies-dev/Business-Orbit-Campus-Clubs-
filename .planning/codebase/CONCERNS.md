# Codebase Concerns & Technical Debt

This document provides a comprehensive analysis of technical debt, missing implementations, architectural flaws, security risks, and frontend-backend disconnects within the **Business Orbit Campus Clubs (BOCC)** repository.

---

## 1. High-Priority Missing Implementations & Stubs

### 1.1 `MentorReview` Model & Controller Stub
- **File**: `Backend/controllers/student.controller.js` (Line 274)
- **Issue**: The `getMentorReviews` endpoint is currently a stub returning `count: 0`, `data: []`, and the message `"Mentor reviews are not yet implemented."`
- **Impact**: Students cannot view mentor ratings, performance history, or reviews before submitting mentorship requests.
- **Action Required**: Create the `MentorReview` schema (`models/MentorReview.js`), build CRUD endpoints in `controllers/review.controller.js` or `student.controller.js`, and wire ratings calculations into `MentorProfile`.

### 1.2 Bypassed Endpoints in Integration Tests (501 / Direct DB Seeding)
- **File**: `Backend/tests/fullJourney.integration.test.js` (Line 188)
- **Issue**: The integration test suite directly inserts data into MongoDB (`Startup.create`, `User.create`, `MentorRequest.create`) under the comment `"Seed Data directly to MongoDB (Bypassing 501 Endpoints)"`.
- **Impact**: Endpoints for creating startups or seeding mentors during student onboarding are either unexposed or unvalidated via standard HTTP flows, hiding gaps in student journey APIs.
- **Action Required**: Ensure all resource creation flows have fully functional, tested HTTP endpoints (`POST /api/startup`, `POST /api/mentor/register`).

### 1.3 Hardcoded & Mocked Frontend Password Reset Flows
- **Files**:
  - `Frontend/BOCC Companies/src/pages/ForgotPassword.jsx` (Line 21)
  - `Frontend/BOCC Incubator/src/pages/ForgotPassword.jsx` (Line 21)
  - `Frontend/BOCC Mentor/src/pages/ForgotPassword.jsx` (Line 21)
  - `Frontend/BOCC Student/src/pages/ForgotPassword.jsx`
- **Issue**: All frontend `ForgotPassword` forms simulate password reset using a `setTimeout(1500)` or `console.log("Password reset requested for:", email)` without connecting to backend APIs.
- **Impact**: Users requesting password resets on frontend sub-apps receive false confirmation, but no OTP or email is generated.
- **Action Required**: Wire `ForgotPassword.jsx` and `ResetPassword.jsx` across all frontend apps to the existing backend endpoints `/api/auth/forgot-password` and `/api/auth/reset-password`.

---

## 2. Frontend-Backend Disconnect & Missing Portals

### 2.1 Complete Absence of Role-Specific Dashboards
- **Scope**: Entire `Frontend/` directory
- **Issue**: While `Backend/` exposes comprehensive controllers and routes for 5 distinct roles (`/api/student/*`, `/api/mentor/*`, `/api/incubator/*`, `/api/company/*`, `/api/investor/*`), the frontend applications (`BOCC Mentor`, `BOCC Incubator`, `BOCC Companies`, `BOCC Investor`) contain **only marketing landing pages and static auth screens**.
- **Breakdown**:
  - **BOCC Mentor**: Has `Home.jsx` (landing) and auth pages (`Login`, `Register`, `ForgotPassword`). Missing: Mentor Dashboard, Request Management UI, Student Profile inspection UI, Meeting Scheduler UI, Chat UI.
  - **BOCC Incubator**: Has `Home.jsx` and auth pages. Missing: Incubator Dashboard, Startup Application Review UI, Verification/Approval pipeline.
  - **BOCC Companies**: Has `Home.jsx` and auth pages. Missing: Corporate Portal, Opportunity/Internship Posting UI, Applicant Review UI.
  - **BOCC Investor**: Has **only `App.tsx` (static landing page)**. Missing: Investor Dashboard, Startup Discovery UI, Watchlist UI, Investor Chat UI, Investment Notes UI.
  - **BOCC Student**: Has landing and auth pages, but no dashboard or stage submission UI.

---

## 3. Auth State Management & Runtime Failures

### 3.1 0-Byte Empty `AuthContext.jsx` in `BOCC Student` (Runtime Crash)
- **File**: `Frontend/BOCC Student/src/lib/AuthContext.jsx` (0 bytes)
- **Issue**: `BOCC Student/src/components/ProtectedRoute.jsx` imports `useAuth` from `@/lib/AuthContext`. Because `AuthContext.jsx` is completely empty, rendering any protected route in `BOCC Student` throws an unhandled JS import error and crashes the app.
- **Action Required**: Implement a proper `AuthProvider` and `useAuth` hook in `BOCC Student/src/lib/AuthContext.jsx`.

### 3.2 Hardcoded Unauthenticated State in `BOCC Mentor`
- **File**: `Frontend/BOCC Mentor/src/lib/AuthContext.jsx` (Line 19)
- **Issue**: `AuthProvider` returns a context value with static defaults: `user: null`, `isAuthenticated: false`, and no state handlers or `login` function.
- **Impact**: Mentors who log in can never be marked as authenticated in React state; protected routes instantly redirect to `/login`.

### 3.3 Raw `localStorage` User Storage without Token Validation
- **Files**: `Frontend/BOCC Incubator/src/lib/AuthContext.jsx`, `Frontend/BOCC Companies/src/lib/AuthContext.jsx`
- **Issue**: Auth state reads `JSON.parse(localStorage.getItem("user"))` on mount without validating JWT access tokens with `/api/auth/me` or handling token expiry/refresh.
- **Impact**: Stale or manually edited `localStorage` user objects bypass frontend client checks; expired tokens cause unexpected API request failures.

### 3.4 Missing `AuthContext` in `BOCC Investor`
- **Directory**: `Frontend/BOCC Investor/src/lib/`
- **Issue**: `BOCC Investor` lacks any authentication context or state provider.

---

## 4. Architectural & Middleware Flaws

### 4.1 Dual & Inconsistent Auth Middlewares
- **Files**:
  - `Backend/middlewares/authMiddleware.js` (Exports `protect`, `requireRole`, `verifyRefreshTokenMiddleware`)
  - `Backend/middlewares/requireAuth.js` (Exports `requireAuth`, `authorizeRoles`, `requireActiveAccount`)
- **Flaw**:
  - `protect` injects a plain JavaScript object into `req.user` (`req.user = { _id, id, role, email, ... }`).
  - `requireAuth` injects a full Mongoose `User` document into `req.user` (`req.user = user`).
  - Routes across the codebase inconsistently mix these two middlewares (`chat.routes.js`, `company.routes.js`, `investor.routes.js`, `student.routes.js` use `requireAuth`, while `auth.routes.js`, `chapter.routes.js`, `dashboard.routes.js`, `meeting.routes.js`, `profile.routes.js`, `startup.routes.js`, `submission.routes.js` use `protect`).
- **Action Required**: Unify authentication into a single standard middleware module.

### 4.2 Static Header Admin Authentication without Audit Context
- **File**: `Backend/middlewares/adminAuth.js`
- **Flaw**: `adminAuth` validates requests solely against an `x-api-key` header (`apiKey !== process.env.ADMIN_API_KEY`). It does NOT verify JWT tokens or populate `req.user`.
- **Impact**: Any client with the API key can perform administrative actions anonymously; there is no audit log or user trace for CMS edits or approvals.

### 4.3 Double Middleware Invocations
- **File**: `Backend/server.js` (Lines 78–79) vs `Backend/routes/student.routes.js`
- **Flaw**: `server.js` mounts `studentRoutes` with `app.use("/api/student", requireAuth, authorizeRoles("student"), studentRoutes)`. Inside `student.routes.js`, individual routes (e.g. `listMentors`, `searchMentors`) re-apply `requireAuth` and `authorizeRoles("student")`, triggering redundant DB queries and JWT verifications per request.

### 4.4 Framework & Stack Fragmentation Across Frontends
- **Flaw**:
  - `BOCC Main` and `BOCC Investor` are configured with **TypeScript + Vite** (with `BOCC Main` using TanStack Router and custom server entry scripts `server.ts`, `start.ts`).
  - `BOCC Student`, `BOCC Mentor`, `BOCC Incubator`, and `BOCC Companies` use **JavaScript + Vite + React Router DOM**.
- **Impact**: Code duplication across components (e.g., duplicated UI library primitives in `components/ui`), disjointed developer experience, and inconsistent state/routing patterns.

---

## 5. Security Risks & Data Safety Gaps

### 5.1 Socket.IO Room Join Authorization Bypass
- **File**: `Backend/utils/socket.js` (Line 43)
- **Vulnerability**: `socket.on("joinChat", ({ chatId }) => socket.join(chatId))` joins the socket to any `chatId` room without verifying if `socket.user.id` is a participant in that conversation or has an active mentorship/investor assignment.
- **Risk**: Any authenticated user can listen to real-time chat messages sent across room boundaries.

### 5.2 Socket.IO Real-Time Messages Bypass Database Persistence
- **File**: `Backend/utils/socket.js` (Line 51)
- **Flaw**: `socket.on("sendMessage")` emits real-time payloads directly to room sockets via `socket.to(chatId).emit("receiveMessage")` without saving the message to the `Message` collection in MongoDB.
- **Risk**: Messages sent via direct socket calls will be lost when the page reloads, creating inconsistency with HTTP `POST /api/chat/send/:chatId`.

### 5.3 Unescaped Regular Expressions in Search Queries (ReDoS & Crash Risk)
- **Files**:
  - `Backend/controllers/companyApplication.controller.js` (Lines 46, 144, 145)
  - `Backend/controllers/investorDiscovery.controller.js` (Lines 103, 158)
- **Vulnerability**: `search`, `college`, `degree`, and `startup_name` input strings are passed directly into `{ $regex: param, $options: "i" }` without sanitization.
- **Risk**:
  - Input strings containing regex special characters (e.g. `(`, `[`, `?`) trigger unhandled MongoDB query syntax exceptions (500 error).
  - Malicious inputs can cause Regular Expression Denial of Service (ReDoS) CPU exhaustion.
- **Fix**: Use `escapeRegex` utility on all user-supplied search parameters before constructing `$regex` queries.

### 5.4 Missing Rate Limiting & Security Headers
- **File**: `Backend/server.js`
- **Flaw**: The application does not use `express-rate-limit` or `helmet`.
- **Risk**: Sensitive endpoints (e.g. `/api/auth/login`, `/api/auth/send-otp`, `/api/auth/forgot-password`) are vulnerable to brute-force credential stuffing and email/OTP flooding attacks.

---

## 6. Summary Matrix of Concerns

| Area | Issue Description | Severity | Target Location |
| :--- | :--- | :--- | :--- |
| **Missing Model** | `MentorReview` model missing; endpoint returns empty stub | **High** | `Backend/models/`, `student.controller.js` |
| **Test Bypass** | Integration test seeds DB directly to bypass missing/501 endpoints | **Medium** | `Backend/tests/fullJourney.integration.test.js` |
| **Frontend Auth** | `BOCC Student` `AuthContext.jsx` is an empty 0-byte file (causes runtime crash) | **Critical** | `Frontend/BOCC Student/src/lib/AuthContext.jsx` |
| **Frontend Auth** | `BOCC Mentor` `AuthContext.jsx` hardcodes unauthenticated state | **High** | `Frontend/BOCC Mentor/src/lib/AuthContext.jsx` |
| **Missing Portals**| 4 frontend apps lack role dashboards (Mentor, Incubator, Company, Investor) | **Critical** | `Frontend/BOCC *` sub-apps |
| **Password Reset**| Frontends mock password reset with `setTimeout` instead of calling backend APIs | **High** | `Frontend/BOCC */src/pages/ForgotPassword.jsx` |
| **Architecture** | Dual auth middlewares (`protect` vs `requireAuth`) return different `req.user` formats | **High** | `Backend/middlewares/` |
| **Security** | Socket.IO `joinChat` lacks room access authorization checks | **High** | `Backend/utils/socket.js` |
| **Security** | Unescaped `$regex` parameters in company & investor search controllers | **High** | `Backend/controllers/` |
| **Security** | Admin authentication relies on static `x-api-key` header without user audit | **Medium** | `Backend/middlewares/adminAuth.js` |
| **Security** | Missing rate limiting (`express-rate-limit`) and security headers (`helmet`) | **Medium** | `Backend/server.js` |
