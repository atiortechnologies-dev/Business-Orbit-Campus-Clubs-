# Phase 4 Plan: Update logoutAllDevices Controller to Preserve Current Session Token

## Context
- Phase Objective: Update logoutAllDevices controller to preserve the current session token instead of deleting all sessions.
- Affected Controller: `Backend/controllers/admin/settings.controller.js`
- Affected Auth Controller (for session management consistency): `Backend/controllers/auth.controller.js`
- Affected Tests: `Backend/tests/controllers/settings.test.js`

## Dependency Map
- `Backend/routes/admin/settings.routes.js` -> imports `logoutAllDevices` from `Backend/controllers/admin/settings.controller.js`
- `Backend/controllers/admin/settings.controller.js` -> uses `UserSession` model from `Backend/models/UserSession.js` & `logAudit` service
- `Backend/controllers/auth.controller.js` -> updates/creates `UserSession` records on login

## Proposed Changes

### Settings Controller
#### [MODIFY] [Backend/controllers/admin/settings.controller.js](file:///home/jimfleax/Business-Orbit-Campus-Clubs-/Backend/controllers/admin/settings.controller.js)
- What: Ensure `logoutAllDevices` preserves the active/current session token (`is_current: true`) while revoking all other session records (`is_current: { $ne: true }`). Include response metadata with `revokedCount`.
- Why: Fulfills business rule requiring session revocation to invalidate all active sessions except for the current session token.
- Impact: Fixes session revocation behavior for multi-device admins.

### Auth Controller
#### [MODIFY] [Backend/controllers/auth.controller.js](file:///home/jimfleax/Business-Orbit-Campus-Clubs-/Backend/controllers/auth.controller.js)
- What: On successful admin login, before creating a new `UserSession` with `is_current: true`, execute `UserSession.updateMany({ user_id: user._id }, { is_current: false })` to ensure only the newly created session is marked as current.
- Why: Maintains accurate `is_current` state across multiple logins on different devices so `logoutAllDevices` can properly differentiate current vs non-current sessions.
- Impact: Ensures multi-device logins set proper flags.

### Unit Tests
#### [MODIFY] [Backend/tests/controllers/settings.test.js](file:///home/jimfleax/Business-Orbit-Campus-Clubs-/Backend/tests/controllers/settings.test.js)
- What: Verify unit test coverage for `logoutAllDevices` to ensure that non-current sessions are deleted, the current session (`is_current: true`) is retained, and audit logging succeeds.
- Why: Ensures quality and prevents regression.

## DRY Context
- Reuses `logAudit` service for audit logging `ALL_SESSIONS_REVOKED`.
- Reuses Mongoose `UserSession` model.

## Risks & Edge Cases
- If no session has `is_current: true`, `deleteMany` will retain all sessions if we use `$ne: true`. Ensuring login updates previous sessions to `is_current: false` prevents stale flags.

## Scope Validation Notes
- Scope checked: All proposed changes target only `logoutAllDevices` and `UserSession` flag management.
- PRD check: Fully aligns with Section 7 Business Rules ("Sign Out of All Devices immediately invalidates all active sessions for the target admin except for the current session token").
