# Integrations & External Services (INTEGRATIONS.md)

## Integration Architecture Overview
The **Business Orbit Campus Clubs (BOCC)** system integrates a backend service (Node.js REST API + Socket.IO real-time WebSockets) with 6 role-based frontend web applications. The integration layer includes transactional email services via SMTP, real-time WebSocket contracts, client-side payment gateway SDKs, map tile providers, local file upload handling, and cloud storage migration paths.

---

## 1. Active Backend Third-Party & Service Integrations

### SMTP Email Delivery Service (Nodemailer)
- **Library**: `nodemailer` (`^9.0.3`)
- **Location**: `Backend/utils/email.js`
- **Protocol**: Standard SMTP (Simple Mail Transfer Protocol) over TLS / STARTTLS.
- **Development SMTP Sandbox Provider**: **Mailtrap Sandbox** (`sandbox.smtp.mailtrap.io:2525`)
- **Default Sender Identity**: `BOCC Auth System (Test)` (`hello@demomailtrap.co`).
- **Configuration Variables**:
  - `SMTP_HOST`: Hostname of the SMTP server (e.g., `sandbox.smtp.mailtrap.io` or `smtp.gmail.com`).
  - `SMTP_PORT`: Port number (e.g., `2525`, `587`, `465`).
  - `SMTP_SECURE`: Boolean flag (`true` for port 465, `false` for 587/2525).
  - `SMTP_USER`: Authentication username.
  - `SMTP_PASS`: Authentication password.
  - `SMTP_FROM`: Default sender email address (e.g., `no-reply@bocc.com`).
- **Use Cases**:
  - **OTP Email Verification**: Generates a 6-digit cryptographically secure OTP (`crypto.randomInt`) valid for 15 minutes to verify user identity upon registration (`sendOTPEmail`).
  - **Transactional Notifications**: Sends HTML-formatted system notifications (`sendEmail`).

---

## 2. Inter-System & Protocol Integrations

### Real-Time WebSockets (Socket.IO)
- **Backend Component**: `socket.io` (`^4.8.3`) in `Backend/utils/socket.js` integrated with HTTP server in `Backend/server.js`.
- **Protocol**: WebSockets with automatic fallback to HTTP long-polling.
- **Handshake Authentication**: JWT token verification middleware (`socket.handshake.auth.token`) validating access tokens against `JWT_SECRET`.
- **CORS Allowed Origins**: Governed by `process.env.FRONTEND_URL` (defaults to `*`).
- **Event Contracts**:
  - `joinChat`: Client joins a role-based or startup chat room (`chatId`).
  - `sendMessage`: Client transmits a new message (`chatId`, `message`, `attachment`).
  - `receiveMessage`: Server broadcasts message to room participants (`chatId`, `senderId`, `message`, `attachment`, `createdAt`).
  - `markMessagesRead`: Client signals that messages in a room have been read.
  - `messagesRead`: Server broadcasts read receipts to room members (`chatId`, `readerId`).

---

## 3. Frontend Client-Side Integrations & External SDKs

### Payment Gateway Client SDK (Stripe Integration)
- **Libraries**: `@stripe/stripe-js` (`^5.2.0`) and `@stripe/react-stripe-js` (`^3.0.0`).
- **Installed Components**: Included in dependencies across all 6 frontend applications (`BOCC Main`, `BOCC Student`, `BOCC Mentor`, `BOCC Incubator`, `BOCC Companies`, `BOCC Investor`).
- **Purpose**: Provides pre-configured client-side SDK wrappers for credit/debit card processing, subscription billing, cohort fee payments, and investment/sponsorship checkouts.
- **Integration Readiness**: Frontend packages are integrated into application dependencies. Backend endpoints and webhook handlers are architected for activation when payment gateway merchant credentials are configured.

### Interactive Maps & Geolocation (Leaflet / OpenStreetMap)
- **Libraries**: `react-leaflet` (`^4.2.1`) and `leaflet`.
- **Installed Components**: Integrated into frontend applications (`BOCC Main`, `BOCC Student`, `BOCC Mentor`, `BOCC Incubator`, `BOCC Companies`).
- **Purpose**: Displays interactive map interfaces for visualizing university chapter locations, regional campus club events, incubator centers, and geographically distributed startups.

---

## 4. Media & Asset Storage Integration Architecture

### Current Local Storage Implementation
- **Library**: `multer` (`^2.2.0`) in `Backend/utils/uploadService.js`.
- **Storage Target**: Local filesystem (`assets/uploads/`).
- **Upload Constraints**: 10MB maximum file size limit.
- **Allowed MIME Types**: Images (JPEG, PNG, GIF), PDF documents, Microsoft PowerPoint (PPT, PPTX), Microsoft Word (DOC, DOCX).

### Cloud Storage Migration Blueprint
- **Target Providers**: AWS S3, Cloudinary, or Google Cloud Storage.
- **Migration Strategy** (documented in `utils/uploadService.js`):
  1. Add `@aws-sdk/client-s3` and `multer-s3` dependencies.
  2. Replace `multer.diskStorage` with `multerS3` configured using AWS environment credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME`).
  3. Controllers consume `req.file.location` (public CDN URL) instead of `req.file.path`.

---

## 5. Third-Party OAuth & Authentication Status

- **Native Authentication System**: BOCC relies on native email/password authentication using Argon2id password hashing and SMTP OTP verification.
- **Third-Party OAuth** (Google, GitHub, LinkedIn): Not currently connected. Google Icon components (`GoogleIcon.jsx`) exist in frontends for UI preparation, but federated OAuth authentication routes are not active on the backend.

---

## 6. Comprehensive Environment Variable Configuration Matrix

| Environment Variable | Target Component | Default / Example Value | Description & Operational Impact |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend Server | `5000` (or `4000`) | Network port for HTTP server and Socket.IO real-time engine |
| `NODE_ENV` | Backend Server | `development` | Application mode (`development`, `production`, `test`) |
| `MONGODB_URI` | Database | `mongodb://localhost:27017/registration_db` | MongoDB connection URI string |
| `FRONTEND_URL` | CORS / Security | `http://localhost:5173` | Allowed origin for CORS headers and Socket.IO connections |
| `SMTP_HOST` | Email Delivery | `sandbox.smtp.mailtrap.io` | SMTP server host for transactional emails |
| `SMTP_PORT` | Email Delivery | `2525` / `587` | Connection port for SMTP service |
| `SMTP_SECURE` | Email Delivery | `false` | SSL/TLS connection flag |
| `SMTP_USER` | Email Delivery | `<mailtrap_user>` | Username for SMTP server authentication |
| `SMTP_PASS` | Email Delivery | `<mailtrap_pass>` | Password for SMTP server authentication |
| `SMTP_FROM` | Email Delivery | `no-reply@bocc.com` | Standard "From" address for outgoing system emails |
| `OTP_EXPIRY_MINUTES` | Auth Service | `10` / `15` | Expiration window (in minutes) for account verification OTPs |
| `JWT_SECRET` | Auth Service | `<secret_key>` | Secret key used to sign Access Tokens |
| `JWT_REFRESH_SECRET` | Auth Service | `<refresh_secret_key>` | Secret key used to sign Refresh Tokens |
| `JWT_EXPIRES_IN` | Auth Service | `7d` | Access Token lifespan |
| `JWT_REFRESH_EXPIRES_IN` | Auth Service | `30d` | Refresh Token lifespan |
| `ADMIN_EMAIL` | Database Seed | `admin@bocc.com` | Superadmin email address for initial database seeding |
| `ADMIN_PASSWORD` | Database Seed | `securepassword123` | Superadmin password for initial database seeding |
