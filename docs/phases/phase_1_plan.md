# Phase 1: Admin Profile, Security & Notifications

## Context
- The codebase already contains models for `PlatformSetting`, `AdminNotificationSetting`, and `UserSession`.
- `settings.controller.js` and `settings.routes.js` exist with partial implementations.
- A `cascadeService.js` handles user deletion cascades for Admin Notification Settings and User Sessions.
- `maintenanceMode.js` middleware is implemented.

## Dependency Map
- `settings.controller.js` → imports → `PlatformSetting`, `UserSession`, `AdminNotificationSetting`
- `settings.routes.js` → imports → `settings.controller.js`, `authMiddleware.js`
- `admin.routes.js` → mounts → `settings.routes.js`

## Proposed Changes

### Settings & Configuration Module

#### [MODIFY] Backend/controllers/admin/settings.controller.js
- What: Add `updateProfile` (PUT /profile), `updateNotifications` (PUT /notifications), `getLoginHistory` (GET /login-history), `logoutAllDevices` (POST /logout-all-devices), `downloadSystemLogs` (GET /download-system-logs), and `changePassword` (POST /change-password).
- Why: Required for Screen 16 Admin controls.
- Impact: Extends existing settings controller. 

#### [MODIFY] Backend/routes/admin/settings.routes.js
- What: Register new routes for profile, notifications, login history, logout all devices, download system logs, and change password.
- Why: Expose the new controller methods.
- Impact: Modifies existing route mappings. Includes necessary validation and auth middlewares.

#### [MODIFY] Backend/controllers/auth.controller.js
- What: Ensure login process registers a `UserSession` record when an admin signs in.
- Why: `UserSession` is required to list login history and to support multi-device sign-out.
- Impact: Login creates a session token record.

## DRY Context
- Re-use existing `requireRole` middleware in `authMiddleware.js`.
- Re-use `maintenanceMode.js` where applicable.
- Re-use `asyncHandler` for all new controller methods.

## Risks & Edge Cases
- Change password logic must re-hash password and invalidate old `UserSession` records.
- Proper test coverage is required for all new controller methods.
