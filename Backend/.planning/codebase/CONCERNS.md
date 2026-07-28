# Codebase Concerns & Architectural Vulnerabilities

This document outlines key technical debt, security risks, missing features, hardcoded values, and architectural concerns within the Backend codebase, with a specific focus on the **Mentorship Module** (`student.controller.js`, `mentorRequest.controller.js`, and `chat.controller.js`).

---

## 1. Mentorship Module Specific Concerns

### A. Authentication & Access Control Flaws

* **Permissive Student Profile Access (`mentorRequest.controller.js`)**
  * **Issue**: `viewStudentProfile` checks `MentorRequest.findOne({ mentor_id: mentorId, student_id: studentId })`.
  * **Risk**: If a student submitted a mentorship request to a mentor in the past—even if that request was **declined** or **cancelled**—that mentor retains permanent access to view the student's full profile, pitch deck, MVP details, and startup progress. Access is not restricted to active mentorship assignments (`MentorAssignment`).
* **Chat Room Listing vs. Access Discrepancy (`chat.controller.js` & `chatRoomService.js`)**
  * **Issue**: `getChatMessages` and `sendMessage` correctly enforce active mentorship status via `verifyChatAccess()` (checking for `MentorAssignment.status === 'active'`). However, `getChatRooms()` (`GET /api/chat/conversations`) fetches all historical `ChatRoom` records via `getHydratedChatRooms` without filtering out terminated or inactive assignments.
  * **Impact**: Inactive or revoked mentorship conversations continue to populate users' chat list, allowing former mentees/mentors to see chat metadata even when messaging access has been revoked.
* **Lack of Request Ownership Validation (`student.controller.js`)**
  * **Issue**: `requestMentor` extracts `mentorId` from `req.params.mentorId || req.body.mentorId`. The route supports both `/mentorship/request` and `/mentors/:mentorId/request`. If supplied via request body without strict ID validation, unvalidated strings can cause MongoDB `CastError` exceptions, causing 500 server errors rather than clean 400 validation responses.

---

### B. Security & Data Integrity Risks

* **Unrestricted File Uploads in Chat (`chat.routes.js` & `chat.controller.js`)**
  * **Issue**: `uploadAttachment` uses a default Multer configuration (`multer({ dest: "assets/uploads/" })`).
  * **Vulnerabilities**:
    * **No File Type Filtering**: Allows uploading arbitrary file types (e.g., executable `.exe`, `.sh`, or malicious script files).
    * **No File Size Limit**: Susceptible to Denial of Service (DoS) via disk exhaustion from large payloads.
    * **Local Disk Storage**: Files are stored locally on the app server filesystem (`/assets/uploads/`) rather than an isolated object storage service (S3/GCS), exposing static paths.
* **Uncaught Exception in Transaction Flow (`mentorRequest.controller.js`)**
  * **Issue**: In `declineRequest`, the `catch` block executes `throw error;` instead of passing the error to Express error middleware (`next(error)`).
  * **Impact**: Can lead to unhandled promise rejections or inconsistent HTTP error response formats compared to rest of the API.
* **$text Index Dependency Crash Hazard (`chat.controller.js`)**
  * **Issue**: `searchChats` executes `$text` searches on `User` (`{ $text: { $search: q } }`) and `Startup`.
  * **Risk**: MongoDB `$text` queries require an explicit text index on target fields (`full_name`, `startup_name`). If the `Startup` model lacks a text index, MongoDB throws a `MongoServerError: text index required for $text query`, causing 500 errors during search queries.

---

### C. Missing Features & Hardcoded Stubs

* **Hardcoded Mentor Reviews Stub (`student.controller.js`)**
  * **Issue**: `getMentorReviews` returns a hardcoded response (`{ count: 0, data: [], message: "Mentor reviews are not yet implemented." }`).
  * **Impact**: Frontend components attempting to fetch mentor feedback receive empty data; no `MentorReview` schema or rating submission endpoints exist.
* **Stubbed Data in Student Profile View (`mentorRequest.controller.js`)**
  * **Issue**: `viewStudentProfile` hardcodes empty placeholders:
    ```javascript
    skills: [], // Could be fetched from a skills model if exists
    previousMentorNotes: "", // Placeholder for future implementation
    ```
  * **Impact**: Mentors cannot view student skills or historical feedback from previous mentors.

---

### D. Performance & Scalability Concerns

* **In-Memory Pagination Filtering Bug (`student.controller.js`)**
  * **Issue**: In `listMentors` and `searchMentors`, queries filter `MentorProfile` by `profile_status: "completed"` and count total documents BEFORE populating `user_id` with `match: { account_status: "active" }`. Afterwards, inactive mentor profiles are filtered out in Node.js memory (`mentors.filter(m => m.user_id !== null)`).
  * **Impact**: Total count in pagination metadata (`pagination.total`) is inaccurate whenever inactive mentors exist. Furthermore, page size (`limit`) fluctuates unpredictably per response.
* **Unpaginated Aggregations (`mentorRequest.controller.js`)**
  * **Issue**: `getAllPendingRequests` executes an aggregation pipeline matching all requests for a mentor without `$skip` or `$limit` stages.
  * **Impact**: As mentor request volume grows, fetching unpaginated list objects places excessive load on MongoDB and backend memory.

---

## 2. General Codebase Concerns & Technical Debt

### A. Critical Security Leak in Auth Controller
* **OTP Leaked in API Response (`auth.controller.js`)**
  * **Location**: `sendOtp` endpoint (Line 208).
  * **Issue**: The generated OTP is returned directly in the JSON response body:
    ```javascript
    return res.status(200).json({
      success: true,
      message: "If an account exists, an OTP has been sent.",
      otp: otp, // TEMPORARY LEAK
    });
    ```
  * **Severity**: **HIGH**. Anyone calling `/api/auth/send-otp` receives the plain-text OTP in the response, bypassing email verification entirely.

---

### B. Architectural & Transaction Vulnerabilities
* **Non-Transactional Cascade Deletions (`services/cascadeService.js`)**
  * **Issue**: `deleteUserDependencies` and `deleteStartupDependencies` execute numerous sequential `deleteMany` calls across ~15 models without wrapping them in a MongoDB transaction session.
  * **Risk**: If the server crashes or network drops mid-operation, the database is left in a corrupted, partially deleted state with orphaned document references.
* **Missing Foreign Key Indexes**
  * **Issue**: Models such as `MentorRequest`, `MentorAssignment`, `ChatRoom`, and `Message` do not systematically define compound indexes on frequently queried combinations (e.g., `{ mentor_id: 1, student_id: 1 }` or `{ chat_id: 1, created_at: -1 }`).
  * **Impact**: Causes high database CPU utilization and slow query execution times as data scales.

---

## Summary Priority Matrix

| Issue | Category | Severity | File Location |
| :--- | :--- | :--- | :--- |
| **OTP Leaked in Response** | Security | **CRITICAL** | `auth.controller.js` |
| **Unrestricted File Uploads in Chat** | Security | **HIGH** | `chat.routes.js`, `chat.controller.js` |
| **Overly Permissive Profile View** | Access Control | **HIGH** | `mentorRequest.controller.js` |
| **In-Memory Pagination Calculation Bug** | Logic / Bug | **MEDIUM** | `student.controller.js` |
| **Missing Text Index Crash Hazard** | Stability | **MEDIUM** | `chat.controller.js`, `Startup.js` |
| **Non-Transactional Cascading Deletions** | Data Integrity | **MEDIUM** | `cascadeService.js` |
| **Unpaginated Pending Requests** | Performance | **LOW** | `mentorRequest.controller.js` |
| **Stubbed Reviews & Skills** | Missing Feature | **LOW** | `student.controller.js`, `mentorRequest.controller.js` |
