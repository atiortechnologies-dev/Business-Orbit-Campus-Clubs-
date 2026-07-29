# Phase 4 Context: Notifications and Activity Logging API

## Global Project Guidelines
### Authorization & RBAC
- Access to `/api/admin/audit-log/*` and `/api/admin/settings/*` is strictly restricted to authenticated users with `ADMIN` or `SUPER_ADMIN` roles.
- Destructive/Critical settings (e.g., Sign Out of All Devices, Maintenance Mode, Export Config JSON) require explicit `SUPER_ADMIN` privileges.

### Search & Audit Query Engine
- High-performance, indexed full-text searching across log metadata, IP addresses, actors, and target entities.
- Real-time streaming for system activity updates (e.g., via WebSockets or Server-Sent Events for the "Recent Pulse" feed).

### Security & Session Management
- Multi-device session revocation invalidates all issued JWT refresh tokens for the targeting user account.
- Password rotation policies enforce expiration tracking and logging of security changes.

## Phase-Specific Requirements
### Screen 15: System Audit Log
**Purpose:** Track, inspect, filter, stream, and export immutable operational audit records across all administrative actions and system events.

**Backend Logic:**
- Queries `AuditLog` table with support for timeframe filtering (Last 24 Hours, Last 7 Days, Last 30 Days), module scope (Security, Clubs, Auth, System, Content), and user attribution.
- Calculates log volume metrics (hourly/daily distribution for the Volume Trend chart).
- Streams real-time timeline feeds for the "Recent Pulse" sidebar widget.
- Generates on-demand CSV export files of audit records.

**Data to Load:**
- Summary filter parameters.
- Paginated Audit Log table: Timestamp, Admin/User Avatar & Name, Module tag, Action summary, Target Entity ID/Name, Status badge (Success, Rejected, Pending), IP Address.
- "Recent Pulse" real-time activity feed.
- 24-hour log volume trend histogram chart data.

**Data to Save:** 
- None (Read-only module except for export generation).

**User Actions:** 
- Filter by timeframe/module/user, search across command center, click Export .CSV, paginate log table, click + New Request.

**State Changes:** 
- Triggers streaming CSV file download.

**Navigation Triggers:** 
- Clicking + New Request opens system request modal.

### Screen 16: Settings & Platform Configuration
**Purpose:** Manage administrator profiles, global platform configuration toggles, system notification channels, security parameters, active sessions, and system maintenance actions.

**Backend Logic:**
- Retrieves administrator profile details, system metadata (version, DB/Server status, last backup time, current build hash), and storage usage percentages.
- Updates system settings across 4 distinct domains: Administrator Profile, Platform Configuration, Admin Notifications, and Security & Access.
- Handles image upload for avatar and platform logo (validates image mime-type, max size 5MB, uploads to S3/storage).

**Data to Load:**
- Administrator Profile: Avatar, Full Name, Email Address, Phone Number, Designation, Role, Two-Factor Authentication toggle status.
- Platform Configuration: Platform Name, Logo URL, Support Email, Time Zone, Functional Toggles (New Registrations, Email Verification Required, Maintenance Mode, Public Profiles Visible).
- Admin Notifications: Grid matrix of toggles for In-App and Email alerts across key operational categories.
- Security & Access: Password last changed date, Active session count, Login activity history list (Device, IP, Relative time, Current tag).
- System Information Widget: Platform Version, DB Status, Last Backup, Build Hash, Storage Usage (Used GB / Max GB, %).

**Data to Save:**
- `PUT /api/admin/settings/profile` — Update admin name, phone, designation.
- `PUT /api/admin/settings/platform` — Update platform name, logo, support email, timezone, and functional toggles.
- `PUT /api/admin/settings/notifications` — Update event notification channel preferences.
- `POST /api/admin/settings/change-password` — Change password.
- `POST /api/admin/settings/logout-all-devices` — Revoke active sessions.

**User Actions:** 
- Edit profile fields, toggle switches, click Change Password, click Replace logo, toggle functional & notification checkboxes, click View Login History, click Sign Out of All Devices, click Download System Logs, Export Config (JSON), Backup Settings, or Save Changes / Cancel.

**State Changes:** 
- Mutates global `PlatformSetting` records and updates logged-in user preferences.

**Navigation Triggers:** 
- Clicking Save Changes executes batch updates and presents a success notification.

### Business Rules
- **Immutable Audit Trail:** Audit log entries are strictly append-only. No API or user action (including `SUPER_ADMIN`) can modify or delete existing records in the `AuditLog` table.
- **Maintenance Mode Locking:** When `maintenance_mode` is set to true, non-admin platform login requests are blocked and return a 503 Service Unavailable response.
- **Session Revocation:** Triggering Sign Out of All Devices immediately invalidates all active sessions for the target admin except for the current session token.
- **Log Retention & Archiving:** System keeps 30 days of active audit logs available for instant querying, automatically archiving older logs to cold storage.

### Validation Rules
- **Platform Name:** Required, 3 to 50 characters.
- **Support Email:** Required, valid email format.
- **Time Zone:** Must be a valid IANA timezone string.
- **Logo Upload:** Supported formats (.png, .svg, .jpg), max size 5MB.
- **Phone Number:** Valid international phone number format.

### Notifications
- **Maintenance Mode Toggled:** Instant alert broadcast to all online administrative users when Maintenance Mode state changes.
- **Security Alert / Session Revocation:** Email notification sent to admin when password is changed or sessions are revoked.

### Activity Logs
- `SYSTEM_SETTING_UPDATED`: Logged when platform configuration or functional toggles are modified.
- `MAINTENANCE_MODE_TOGGLED`: Logged when system maintenance mode state is changed.
- `ALL_SESSIONS_REVOKED`: Logged when an admin signs out of all active devices.
- `AUDIT_LOG_EXPORTED`: Logged when an audit log CSV report is generated.

## Resolved Clarifications (Relevant to This Phase)
**Q1:** The PRD does not specify the cascade deletion behavior for an Admin user. What happens to `AuditLog`, `UserSession`, and `AdminNotificationSetting` records if an Admin user is deleted?
**A:** (Assumed Default) `UserSession` and `AdminNotificationSetting` are deleted, but `actor_id` in `AuditLog` is set to NULL (to preserve immutable logs).

**Q2:** The PRD states 'Destructive/Critical settings require SUPER_ADMIN privileges' but doesn't map them explicitly to the Settings APIs. Which endpoints require SUPER_ADMIN vs standard ADMIN?
**A:** (Assumed Default) Only `export-config`, `download-system-logs`, `logout-all-devices`, and updating `platform` config require `SUPER_ADMIN`. Other APIs are accessible to standard `ADMIN`.

**Q3:** If two administrators attempt to update the Platform Settings simultaneously, how should the system handle concurrency?
**A:** (Assumed Default) Last-write-wins (the last request simply overwrites the previous changes).

## Schema Context
# Database Schema Map

## Entity Relationship Overview
- `Opportunity` -> `User` (company_id)
- `SavedOpportunity` -> `User` (student_id), `Opportunity` (opportunity_id)
- `Application` -> `Opportunity` (opportunity_id), `User` (student_id)
- `ApplicationDocument` -> `Application` (application_id)
- `ApplicationStatusHistory` -> `Application` (application_id), `User` (updated_by)
- `AuditLog` -> `User` (actor_id)
- `AdminNotificationSetting` -> `User` (user_id)
- `UserSession` -> `User` (user_id)

## Models Scaffolded
| Model | File | Fields | References | Status Enum |
|-------|------|--------|------------|-------------|
| Opportunity | Backend/models/Opportunity.js | company_id, title, type, work_mode, industry, experience_level, description, responsibilities, required_skills, eligibility_criteria, preferred_qualifications, location, duration, salary_stipend, salary_range, application_deadline, status | User (company_id) | draft, open, active, closed |
| SavedOpportunity | Backend/models/SavedOpportunity.js | student_id, opportunity_id | User (student_id), Opportunity (opportunity_id) | — |
| Application | Backend/models/Application.js | opportunity_id, student_id, application_status, resume_url, cover_letter, portfolio_url, availability, joining_date | Opportunity (opportunity_id), User (student_id) | applied, shortlisted, rejected, interviewing, hired, draft, submitted, viewed, interview, selected, withdrawn |
| ApplicationDocument | Backend/models/ApplicationDocument.js | application_id, document_type, file_name, file_url | Application (application_id) | — |
| ApplicationStatusHistory | Backend/models/ApplicationStatusHistory.js | application_id, status, updated_by, remarks | Application (application_id), User (updated_by) | draft, submitted, viewed, shortlisted, interview, selected, rejected, withdrawn |
| AuditLog | Backend/models/AuditLog.js | actor_id, actor_name, module, action, target_entity_id, target_entity_name, status, ip_address, details | User (actor_id) | SUCCESS, REJECTED, PENDING |
| PlatformSetting | Backend/models/PlatformSetting.js | platform_name, logo_url, support_email, timezone, allow_new_registrations, require_email_verification, maintenance_mode, public_profiles_visible | — | — |
| AdminNotificationSetting | Backend/models/AdminNotificationSetting.js | user_id, event_category, in_app_enabled, email_enabled | User (user_id) | — |
| UserSession | Backend/models/UserSession.js | user_id, device_name, os_browser, ip_address, refresh_token_hash, is_current, last_active_at | User (user_id) | — |

## Cascade Rules
- Deleting an Admin user -> `UserSession` and `AdminNotificationSetting` are deleted, but `actor_id` in `AuditLog` is set to NULL.

## Shared Utilities Available
# Shared Utilities (Batch 3)

## 1. Audit Logger Service
A centralized logging utility to emit records to the `AuditLog` table.
- Function signature: `logAudit(actor, module, action, targetEntityId, targetEntityName, status, ipAddress, details)`
- Ensures immutability (no delete/update functions provided).
- Should be used across all controllers in Batch 3.

## 2. Maintenance Mode Middleware
An Express middleware to check the `PlatformSetting.maintenance_mode` toggle.
- If true, blocks all non-admin routes with a 503 Service Unavailable response.

## 3. RBAC Middleware (ADMIN vs SUPER_ADMIN)
Role-based access control middleware to restrict certain routes to SUPER_ADMIN only.
- e.g., `requireRole(['SUPER_ADMIN'])` vs `requireRole(['ADMIN', 'SUPER_ADMIN'])`

## 4. Session Revocation Utility
A function to invalidate or delete sessions from `UserSession` table, used during logout, sign-out all devices, and password changes.

## API Contracts from Previous Phases
Phase 1:
- PUT /api/admin/settings/platform
- GET /api/admin/settings
- GET /api/admin/settings/export-config

Phase 2:
- POST /api/student/freelancing/applications
- GET /api/student/freelancing/applications
- GET /api/student/freelancing/applications/{applicationId}
- PUT /api/student/freelancing/applications/{applicationId}
- POST /api/student/freelancing/applications/upload-resume
- POST /api/student/freelancing/applications/upload-document
- POST /api/student/freelancing/applications/{applicationId}/submit
- DELETE /api/student/freelancing/applications/{applicationId}/withdraw

Phase 3:
- GET /api/student/freelancing/applications/status
- GET /api/student/freelancing/applications/{applicationId}/timeline
- GET /api/student/freelancing/applications/interviews
