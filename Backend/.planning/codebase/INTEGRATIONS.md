# Integrations & External Services (INTEGRATIONS.md)

## Integration Architecture Overview
The **Business Orbit Campus Clubs (BOCC)** backend relies primarily on direct SMTP email services and WebSocket connections for real-time interactivity. External cloud services (such as S3 file storage) are architected for seamless drop-in integration as the application scales from local development to production deployment.

---

## Active Third-Party Integrations

### 1. SMTP Email Service (Nodemailer)
- **Library**: `nodemailer` (`^9.0.3`)
- **Module Path**: `utils/email.js`
- **Protocol**: Standard SMTP (Simple Mail Transfer Protocol) over TLS/STARTTLS.
- **Default Development Provider**: **Mailtrap Sandbox** (`sandbox.smtp.mailtrap.io:2525`)
- **Configuration Variables**:
  - `SMTP_HOST`: Hostname of the SMTP server (e.g., `sandbox.smtp.mailtrap.io` or `smtp.gmail.com`).
  - `SMTP_PORT`: Connection port (e.g., `2525`, `587`, `465`).
  - `SMTP_SECURE`: Boolean flag for TLS connection (`true` for port 465, `false` for 587/2525).
  - `SMTP_USER`: Authentication username.
  - `SMTP_PASS`: Authentication password.
  - `SMTP_FROM`: Default sender email address (e.g., `no-reply@bocc.com`).
- **Use Cases**:
  - **OTP Verification**: Dispatches 6-digit cryptographically generated OTPs (`sendOTPEmail`) for user registration and verification. Valid for 15 minutes.
  - **System Notifications**: Generic html email delivery (`sendEmail`).

---

## Inter-System & Protocol Integrations

### 1. Real-Time WebSocket Service (Socket.IO)
- **Library**: `socket.io` (`^4.8.3`)
- **Module Path**: `utils/socket.js`, integrated into `server.js` via HTTP server.
- **Authentication**: JWT token verification via socket connection middleware (`socket.handshake.auth.token`).
- **CORS Allowed Origins**: Configured via `process.env.FRONTEND_URL` (defaults to `*`).
- **Event Contracts**:
  - `joinChat`: Client joins a specific room (`chatId`).
  - `sendMessage`: Client transmits a message object (`chatId`, `message`, `attachment`).
  - `receiveMessage`: Server broadcasts payload to room participants (`chatId`, `senderId`, `message`, `attachment`, `createdAt`).
  - `markMessagesRead`: Emits read status notifications (`chatId`, `readerId`).
  - `messagesRead`: Server broadcasts read status updates to room members.

---

## Data & Asset Storage Integration Architecture

### 1. Current File Upload Implementation
- **Library**: `multer` (`^2.2.0`)
- **Module Path**: `utils/uploadService.js`
- **Current Mode**: Local Disk Storage (`assets/uploads/`)
- **Validation**: Strict file MIME type filtering (JPEG, PNG, GIF, PDF, PPT, DOCX) and 10MB size limit.

### 2. Planned Cloud Storage Migration Architecture
- **Target Providers**: AWS S3 / Cloudinary / Google Cloud Storage.
- **Refactoring Strategy** (documented in `utils/uploadService.js` header):
  1. Add cloud storage SDK dependency (`@aws-sdk/client-s3` + `multer-s3`).
  2. Replace `multer.diskStorage` with `multerS3` configuration using environment credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME`).
  3. Controllers adapt seamlessly by reading `req.file.location` (Cloud URL) instead of `req.file.path`.

---

## Webhooks & Payment Gateways Status

- **Incoming Webhooks**: None currently active.
- **Outgoing Webhooks**: None currently active.
- **Payment Gateways** (e.g. Stripe, Razorpay): Not integrated in current backend implementation.
- **External OAuth Providers** (e.g. Google OAuth, GitHub OAuth): Native email/password authentication with OTP verification is used instead of third-party OAuth federated login.

---

## Environment Configuration Matrix

| Service / Provider | Config Key | Expected Format / Example | Description |
| :--- | :--- | :--- | :--- |
| **Server Runtime** | `PORT` | `5000` | Application listening port |
| **Server Runtime** | `NODE_ENV` | `development` / `production` / `test` | Runtime environment mode |
| **Database** | `MONGODB_URI` | `mongodb://localhost:27017/registration_db` | MongoDB connection URI |
| **Frontend** | `FRONTEND_URL` | `http://localhost:5173` | CORS allowed frontend URL |
| **SMTP Mailer** | `SMTP_HOST` | `sandbox.smtp.mailtrap.io` | Mail server hostname |
| **SMTP Mailer** | `SMTP_PORT` | `2525` / `587` | Mail server port |
| **SMTP Mailer** | `SMTP_USER` | `<string>` | Mail server auth user |
| **SMTP Mailer** | `SMTP_PASS` | `<string>` | Mail server auth password |
| **SMTP Mailer** | `SMTP_FROM` | `no-reply@bocc.com` | Default sender email address |
| **OTP Config** | `OTP_EXPIRY_MINUTES` | `10` / `15` | Expiration time for generated OTPs |
| **Security / JWT** | `JWT_SECRET` | `<secret_key>` | Access token signing key |
| **Security / JWT** | `JWT_REFRESH_SECRET` | `<refresh_secret_key>` | Refresh token signing key |
| **Security / JWT** | `JWT_EXPIRES_IN` | `7d` | Access token lifespan |
| **Security / JWT** | `JWT_REFRESH_EXPIRES_IN` | `30d` | Refresh token lifespan |
| **Admin Seed** | `ADMIN_EMAIL` | `admin@bocc.com` | Default seed administrator email |
| **Admin Seed** | `ADMIN_PASSWORD` | `securepassword123` | Default seed administrator password |
