# Phase 4 Context: Update logoutAllDevices Controller to Preserve Current Session Token

## Global Project Guidelines
### Authorization & RBAC
- Access to `/api/admin/audit-log/*` and `/api/admin/settings/*` is strictly restricted to authenticated users with `ADMIN` or `SUPER_ADMIN` roles.
- Destructive/Critical settings (e.g., Sign Out of All Devices, Maintenance Mode, Export Config JSON) require explicit `SUPER_ADMIN` privileges.

### Security & Session Management
- Multi-device session revocation invalidates all issued JWT refresh tokens / active sessions for the targeting user account except for the current session token.

## Phase-Specific Requirements
### Screen 16: Settings & Platform Configuration
**Backend Logic:**
- `POST /api/admin/settings/logout-all-devices` — Revoke active sessions.

### Business Rules
- **Session Revocation:** Triggering Sign Out of All Devices immediately invalidates all active sessions for the target admin except for the current session token.

### Notifications & Activity Logs
- `ALL_SESSIONS_REVOKED`: Logged when an admin signs out of all active devices.

## Resolved Clarifications (Relevant to This Phase)
**Q2:** The PRD states 'Destructive/Critical settings require SUPER_ADMIN privileges' but doesn't map them explicitly to the Settings APIs. Which endpoints require SUPER_ADMIN vs standard ADMIN?
**A:** Only `export-config`, `download-system-logs`, `logout-all-devices`, and updating `platform` config require `SUPER_ADMIN`. Other APIs are accessible to standard `ADMIN`.

## Schema Context
# Database Schema Map

## Entity Relationship Overview
- `AuditLog` -> `User` (actor_id)
- `AdminNotificationSetting` -> `User` (user_id)
- `UserSession` -> `User` (user_id)

## Models Scaffolded
| Model | File | Fields | References | Status Enum |
|-------|------|--------|------------|-------------|
| UserSession | Backend/models/UserSession.js | user_id, device_name, os_browser, ip_address, refresh_token_hash, is_current, last_active_at | User (user_id) | — |
| AuditLog | Backend/models/AuditLog.js | actor_id, actor_name, module, action, target_entity_id, target_entity_name, status, ip_address, details | User (actor_id) | SUCCESS, REJECTED, PENDING |
| PlatformSetting | Backend/models/PlatformSetting.js | platform_name, logo_url, support_email, timezone, allow_new_registrations, require_email_verification, maintenance_mode, public_profiles_visible | — | — |

## Shared Utilities Available
# Shared Utilities (Backend)
- `isAdmin`: RBAC Middleware checking `ADMIN` or `SUPER_ADMIN`.
- `requireRole`: RBAC Middleware checking specific roles e.g. `['SUPER_ADMIN']`.
- `logAudit`: Audit Logger Service.

## API Contracts from Previous Phases
Phase 1:
- PUT /api/admin/settings/platform
- GET /api/admin/settings
- GET /api/admin/settings/export-config

Phase 2 & 3:
- Applications & Freelancing endpoints.
