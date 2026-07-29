# Phase 4: Notifications and Activity Logging API

## Context
- The codebase already contains models for `AuditLog`, `PlatformSetting`, `AdminNotificationSetting`, and `UserSession`.
- `settings.controller.js` and `settings.routes.js` exist with partial implementations for `getSettings`, `updatePlatformSettings`, and `exportConfig`.
- A `cascadeService.js` exists and was updated to handle user deletion cascades for Admin Notification Settings and User Sessions, and to nullify AuditLog actor_id.
- `maintenanceMode.js` middleware is implemented.

## Dependency Map
- `settings.controller.js` → imports → `PlatformSetting`, `UserSession`, `AdminNotificationSetting`, `AuditLog`, `auditLoggerService`
- `settings.routes.js` → imports → `settings.controller.js`, `authMiddleware.js`
- `auditLog.controller.js` → imports → `AuditLog`, `asyncHandler`
- `auditLog.routes.js` → imports → `auditLog.controller.js`, `authMiddleware.js`
- `admin.routes.js` → mounts → `settings.routes.js`, `auditLog.routes.js`

## Proposed Changes

### Audit Logger Service

#### [NEW] Backend/services/auditLoggerService.js
- What: Create a service with a `logAudit` function.
- Why: DRY reusable function to write to the `AuditLog` table.
- Impact: Will be used by controllers across the app to log administrative and system actions.

### Audit Log Module

#### [NEW] Backend/controllers/admin/auditLog.controller.js
- What: Implement `getAuditLogs` (with pagination, timeframe, module, user filters), `getPulse` (SSE stream for recent logs), `getVolumeTrend` (histogram data), and `exportLogs` (CSV generation).
- Why: Required by PRD for Screen 15.
- Impact: Provides the backend for the Audit Log dashboard.

#### [NEW] Backend/routes/admin/auditLog.routes.js
- What: Define routes for `GET /`, `GET /pulse`, `GET /volume-trend`, `GET /export`.
- Why: Route audit log endpoints.
- Impact: Mounts on `/api/admin/audit-log`. Uses `protect` and `requireRole(['admin', 'super_admin'])` auth/validation middlewares.

### Settings & Configuration Module

#### [MODIFY] Backend/controllers/admin/settings.controller.js
- What: Add `updateProfile` (PUT /profile), `updateNotifications` (PUT /notifications), `getLoginHistory` (GET /login-history), `logoutAllDevices` (POST /logout-all-devices), `downloadSystemLogs` (GET /download-system-logs), and `changePassword` (POST /change-password).
- Why: Required for Screen 16.
- Impact: Extends existing settings controller to handle complete Platform Admin settings suite. Integrates with `auditLoggerService`.

#### [MODIFY] Backend/routes/admin/settings.routes.js
- What: Register new routes for profile, notifications, login history, logout all devices, download system logs, and change password.
- Why: Expose the new controller methods.
- Impact: Modifies existing route mappings. Includes necessary validation and auth middlewares.

#### [MODIFY] Backend/routes/admin/admin.routes.js
- What: Mount `auditLog.routes.js` if not already mounted.
- Why: Make audit logs accessible at `/api/admin/audit-log`.
- Impact: Extends main admin router.

#### [MODIFY] Backend/controllers/auth.controller.js
- What: Ensure login process registers a `UserSession` record when an admin signs in.
- Why: `UserSession` is required to list login history and to support multi-device sign-out.
- Impact: Login creates a session token record. Cascade delete is handled by cascadeService.js on User delete.

## DRY Context
- Re-use existing `requireRole` middleware in `authMiddleware.js`.
- Re-use `maintenanceMode.js` where applicable.
- Re-use `asyncHandler` for all new controller methods.
- Import `auditLoggerService` into `settings.controller.js` to log events like `SYSTEM_SETTING_UPDATED`, `ALL_SESSIONS_REVOKED`, etc.

## Risks & Edge Cases
- SSE stream in `getPulse` needs proper client disconnect handling to prevent memory leaks.
- CSV export for Audit Logs needs to handle potentially large datasets (streams).
- Change password logic must re-hash password and invalidate old `UserSession` records.
- Missing Companion Added: Need test targets for `auditLog.controller.js`, `settings.controller.js` additions, `auditLoggerService.js`, and the modification in `auth.controller.js`.

## Scope Validation Notes
- Added auth/validation middleware reference to `auditLog.routes.js` to fix MISSING_COMPANION.
- Added cascade delete reference to `auth.controller.js` change to fix MISSING_COMPANION.
- Added test targets in Risks & Edge Cases to fix MISSING_COMPANION for new controllers/services.
