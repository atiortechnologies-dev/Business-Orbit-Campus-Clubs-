# Phase 3 Context: System Audit Logging Engine (AuditLog, filtering, export, pulse, volume-trend)

## Global Project Guidelines
- Access to `/api/admin/audit-log/*` and `/api/admin/settings/*` is strictly restricted to authenticated users with `ADMIN` or `SUPER_ADMIN` roles.
- Immutable Audit Trail: Audit log entries are strictly append-only. No API or user action (including `SUPER_ADMIN`) can modify or delete existing records in the `AuditLog` table.
- Log Retention & Archiving: System keeps 30 days of active audit logs available for instant querying, automatically archiving older logs to cold storage.

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

### Audit Log APIs
- `GET /api/admin/audit-log` — Fetch paginated list of system audit logs with filters.
- `GET /api/admin/audit-log/pulse` — Fetch recent activity pulse stream.
- `GET /api/admin/audit-log/volume-trend` — Fetch 24-hour log volume histogram data.
- `GET /api/admin/audit-log/export` — Download audit logs as CSV file.

## Resolved Clarifications (Relevant to This Phase)
**Q1:** The PRD does not specify the cascade deletion behavior for an Admin user. What happens to `AuditLog`, `UserSession`, and `AdminNotificationSetting` records if an Admin user is deleted?
**A:** (Assumed Default) `UserSession` and `AdminNotificationSetting` are deleted, but `actor_id` in `AuditLog` is set to NULL (to preserve immutable logs).

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
- `GET /api/admin/settings` (Phase 1)
- `PUT /api/admin/settings/platform` (Phase 1)
- `GET /api/admin/settings/download-system-logs` (Phase 1)
- `GET /api/admin/settings/export-config` (Phase 1)
- `PUT /api/admin/settings/profile` (Phase 2)
- `PUT /api/admin/settings/notifications` (Phase 2)
- `POST /api/admin/settings/change-password` (Phase 2)
- `GET /api/admin/settings/login-history` (Phase 2)
- `POST /api/admin/settings/logout-all-devices` (Phase 2)
