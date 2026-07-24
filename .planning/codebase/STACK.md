# Tech Stack (STACK.md)

## System Overview
**Business Orbit Campus Clubs (BOCC)** is a comprehensive, multi-portal web platform designed to connect and empower student entrepreneurs, campus clubs, startup founders, mentors, incubators, investors, and corporate partners. The codebase is organized as a micro-frontend suite backed by a centralized Node.js/Express REST and Socket.IO API server connected to MongoDB.

---

## 1. Backend Technology Stack

### Runtime & Language
- **Language**: JavaScript (Node.js ES6+ / CommonJS standard)
- **Runtime Environment**: Node.js (v18+ / v20+ recommended)
- **Module System**: CommonJS (`"type": "commonjs"`)

### Server Framework & Real-Time Engine
- **Web Server Framework**: **Express.js** (`express` `^5.2.1`)
  - Main Entry Point: `server.js`
  - Modular route handling for authentication, onboarding, profiles, startups, stage submissions, meetings, resources, reviews, chat, and admin functions.
  - Middlewares: Custom CORS configuration (`config/cors.js`), auth and role-based access control (`middlewares/requireAuth.js`), centralized 404 & error handlers (`middlewares/errorHandler.js`).
- **HTTP Server Engine**: Native Node.js `http` module (`http.createServer(app)`), wrapping Express to share network ports with WebSocket listeners.
- **Real-Time WebSockets**: **Socket.IO** (`socket.io` `^4.8.3`)
  - Utility Module: `utils/socket.js`
  - Real-time event-driven messaging across multi-role chat rooms (`joinChat`, `sendMessage`, `receiveMessage`, `markMessagesRead`, `messagesRead`).
  - Authenticated via JWT handshake middleware (`socket.handshake.auth.token`).

### Database & Persistence Layer
- **Database Engine**: **MongoDB** (v6.0+)
- **ODM (Object Data Modeling)**: **Mongoose** (`mongoose` `^9.7.4`)
- **Connection Lifecycle Management**: `config/db.js` handles environment URI binding (`MONGODB_URI`) and graceful connection shutdown traps (`SIGINT`).
- **Database Schema Models (41 Collections)**:
  - **Core User & Profiles**: `User`, `StudentProfile`, `MentorProfile`, `InvestorProfile`, `IncubatorProfile`, `CompanyProfile`.
  - **Startups & Submissions**: `Startup`, `StartupStage`, `StageSubmission`, `StartupPitch`, `PitchView`, `FeaturedStartup`.
  - **Mentorship & Scheduling**: `MentorProfile`, `MentorAssignment`, `MentorRequest`, `MentorMeeting`, `Meeting`, `MeetingNotes`.
  - **Communication & Chat**: `ChatRoom`, `Message`, `InvestorChatRoom`, `InvestorMessage`.
  - **Administration & Governance**: `Chapter`, `ChapterChangeRequest`, `ActivityLog`, `Statistic`, `Review`.
  - **Utilities & Operations**: `EmailVerification`, `PasswordReset`, `ContactEnquiry`, `Notification`, `Opportunity`, `Resource`, `PartnerLogo`, `SuccessStory`, `FAQ`, `ApplicantStatus`, `Application`, `ApplicationInterview`, `InvestorNote`, `InvestorWatchlist`, `RecruiterNote`.

### Security, Hashing & Validation
- **Token Authentication**: Dual JSON Web Token strategy (`jsonwebtoken` `^9.0.3`) featuring short-lived Access Tokens (`7d` default) and long-lived Refresh Tokens (`30d` default). Access control via `middlewares/requireAuth.js`.
- **Password Security**: **Argon2** (`argon2` `^0.44.0`) implementing `argon2id` key derivation algorithm with 64MB memory cost and 3 iterations.
- **Validation Engine**: **Zod** (`zod` `^4.4.3`) for schema validation across user registration (discriminated unions), profile onboarding, idea submissions, and meeting requests.
- **CORS Management**: **CORS** (`cors` `^2.8.6`) with dynamic origin verification configured in `config/cors.js`.

### Media & Upload Handling
- **File Upload Middleware**: **Multer** (`multer` `^2.2.0`) in `utils/uploadService.js`.
- **Storage Target**: Local disk storage (`assets/uploads/`) with 10MB file limit and MIME type filtering (JPEG, PNG, GIF, PDF, PPT, DOCX).

### Backend Tooling & Testing
- **Test Suite**: **Jest** (`jest` `^30.4.2`), **Supertest** (`supertest` `^7.2.2`), and **Cross-env** (`cross-env` `^10.1.0`).
- **Linting & Code Quality**: **ESLint** (`eslint` `^10.7.0`), `@eslint/js` (`^10.0.1`), `globals` (`^17.7.0`).
- **Development Process Manager**: **Nodemon** (`nodemon` `^3.1.14`) configured via `nodemon.json`.

---

## 2. Frontend Technology Stack

The frontend architecture consists of 6 distinct React Vite applications housed under the `Frontend/` root directory:

### Multi-Application Micro-Frontend Breakdown

1. **BOCC Main (`Frontend/BOCC Main`)**
   - **Package Name**: `base44-app`
   - **Purpose**: Public portal, ecosystem showcase, landing pages, roadmap, stories, and contact inquiries.
   - **Core Stack**: React 18 (`react` `^18.2.0`), Vite 6 (`vite` `^6.1.0`), TypeScript 5 (`typescript` `^5.9.3`), TanStack Router (`@tanstack/react-router` `^1.170.17`).
   - **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss` `^4.3.2`, `tailwindcss` `^4.3.2`), PostCSS 8, Lucide React icons, Framer Motion, Radix UI.

2. **BOCC Student (`Frontend/BOCC Student`)**
   - **Package Name**: `student-app`
   - **Purpose**: Student entrepreneur portal, campus club hub, startup stage progression, resource library, and mentorship requests.
   - **Core Stack**: React 18, Vite 6, JavaScript/JSX (`jsconfig.json`), React Router DOM (`react-router-dom` `^6.26.0`).
   - **Styling**: Tailwind CSS v3 (`tailwindcss` `^3.4.19`, `autoprefixer`), Radix UI primitive suite.

3. **BOCC Mentor (`Frontend/BOCC Mentor`)**
   - **Package Name**: `bocc-incubator` (Mentor App)
   - **Purpose**: Interface for mentors to manage sessions, review startup submissions, provide evaluations, and track assignments.
   - **Core Stack**: React 18, Vite 6, React Router DOM (`^6.26.0`), JavaScript/JSX.
   - **Styling**: Tailwind CSS v3 (`tailwindcss` `^3.4.17`), Radix UI primitive suite.

4. **BOCC Incubator (`Frontend/BOCC Incubator`)**
   - **Package Name**: `Incubator-app`
   - **Purpose**: Administration portal for incubator managers to track startup cohorts, manage stage gate reviews, and schedule cohort meetings.
   - **Core Stack**: React 18, Vite 6, React Router DOM (`^6.26.0`), JavaScript/JSX.
   - **Styling**: Tailwind CSS v3 (`tailwindcss` `^3.4.17`), Radix UI primitive suite.

5. **BOCC Companies (`Frontend/BOCC Companies`)**
   - **Package Name**: `BOCC Copmany-app`
   - **Purpose**: Corporate partner portal for managing corporate challenges, sponsorships, resource postings, and student recruiting.
   - **Core Stack**: React 18, Vite 6, React Router DOM (`^6.30.4`), JavaScript/JSX.
   - **Styling**: Tailwind CSS v3 (`tailwindcss` `^3.4.17`), Radix UI primitive suite.

6. **BOCC Investor (`Frontend/BOCC Investor`)**
   - **Package Name**: `bocc-investor`
   - **Purpose**: Investor portal for venture capitalists and angel investors to review pitch decks, track watchlists, evaluate startups, and initiate chat connections.
   - **Core Stack**: React 18/19 ecosystem (`@types/react` `^19.2.17`), Vite 8 (`vite` `^8.1.4`), TypeScript 7 (`typescript` `^7.0.2`), React Router DOM v7 (`react-router-dom` `^7.18.1`).
   - **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` `^4.3.2`, `tailwindcss` `^4.3.2`), Framer Motion v12.

---

### Shared Frontend Libraries & Ecosystem Standards

Across all 6 frontend web applications, common libraries and standards are shared:

- **UI Component Primitives**: **Radix UI** primitives (`accordion`, `alert-dialog`, `aspect-ratio`, `avatar`, `checkbox`, `collapsible`, `context-menu`, `dialog`, `dropdown-menu`, `hover-card`, `label`, `menubar`, `navigation-menu`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `slider`, `slot`, `switch`, `tabs`, `toast`, `toggle`, `toggle-group`, `tooltip`).
- **Styling & Animation**: **Tailwind CSS**, `class-variance-authority` (cva), `clsx`, `tailwind-merge`, `tailwindcss-animate`, `tw-animate-css`, **Framer Motion** (`framer-motion`).
- **Iconography**: **Lucide React** (`lucide-react`) and **React Icons** (`react-icons`).
- **Form Management & Validation**: **React Hook Form** (`react-hook-form`), **Zod** (`zod`), `@hookform/resolvers`.
- **Data Fetching & State Management**: **TanStack Query** (`@tanstack/react-query` `v5`).
- **Data Visualization & Analytics**: **Recharts** (`recharts` `^2.15.4`).
- **3D Graphics & Animations**: **Three.js** (`three` `^0.171.0`), **Canvas Confetti** (`canvas-confetti`).
- **Maps & GIS Integration**: **React Leaflet** (`react-leaflet` `^4.2.1`) & Leaflet.
- **Drag & Drop Interactivity**: **@hello-pangea/dnd** (`^17.0.0`) for Kanban boards and list reordering.
- **Document & Content Processing**: **jsPDF** (`jspdf` `^4.2.1`), **html2canvas** (`html2canvas` `^1.4.1`), **React Quill** (`react-quill` `^2.0.0`) for rich text editing, **React Markdown** (`react-markdown` `^9.0.1`).
- **Toast Notifications**: **Sonner** (`sonner` `^2.0.1`), **React Hot Toast** (`react-hot-toast` `^2.6.0`).
- **Date & Utility Libraries**: `date-fns`, `moment`, `lodash`, `input-otp`, `vaul` (drawer UI), `cmdk` (command menu), `embla-carousel-react`.

---

## Unified Summary Stack Table

| Category | Component / Library | Location | Version | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Backend Runtime** | Node.js | Backend | v18+ / v20+ | Server-side JavaScript execution environment |
| **Backend Framework** | Express.js | Backend | ^5.2.1 | HTTP web server and REST API routing framework |
| **Real-Time Engine** | Socket.IO | Backend / Frontend | ^4.8.3 | Bi-directional WebSocket real-time communication |
| **Database Engine** | MongoDB | Backend | v6.0+ | Primary NoSQL document database |
| **Database ODM** | Mongoose | Backend | ^9.7.4 | Schema definitions, validation & database driver |
| **Authentication** | jsonwebtoken | Backend | ^9.0.3 | JWT access and refresh token management |
| **Password Hashing** | Argon2 | Backend | ^0.44.0 | Key derivation algorithm (`argon2id`) |
| **Data Validation** | Zod | Backend & Frontend | ^4.4.3 / ^3.24.2 | Strongly-typed schema validation |
| **File Processing** | Multer | Backend | ^2.2.0 | Multipart form-data file upload handler |
| **Email Delivery** | Nodemailer | Backend | ^9.0.3 | Transactional SMTP email dispatch |
| **Testing** | Jest & Supertest | Backend | ^30.4.2 / ^7.2.2 | Automated unit and integration testing |
| **Frontend Framework** | React | Frontend (All 6 Apps) | ^18.2.0 / ^19 | Client UI component framework |
| **Build System** | Vite | Frontend (All 6 Apps) | ^6.1.0 / ^8.1.4 | High-performance bundler and dev server |
| **Routing** | TanStack Router / React Router DOM | Frontend | ^1.170 / ^6.26 / ^7.18 | Client-side routing across applications |
| **Styling & UI** | Tailwind CSS & Radix UI | Frontend (All 6 Apps) | v3 / v4 | Design system, responsive layout & UI primitives |
| **State & Query** | TanStack Query | Frontend (All 6 Apps) | ^5.84.1 | Asynchronous state management and caching |
| **Analytics/Charts** | Recharts | Frontend | ^2.15.4 | Interactive dashboard charts and data analytics |
| **Payment SDK** | Stripe JS SDK | Frontend (All 6 Apps) | ^5.2.0 / ^3.0.0 | Client-side payment integration readiness |
