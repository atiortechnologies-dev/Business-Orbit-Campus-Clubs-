# Phase 1: Core Platform Configuration & Toggles (PlatformSetting, GET/PUT settings, Maintenance Mode Middleware)

## Context
- The system requires a central configuration for platform-wide settings (PlatformSetting), a middleware to enforce maintenance mode, and an RBAC middleware for admin authorization.
- Relevant files found: `Backend/models/PlatformSetting.js` (scaffolded), `Backend/middlewares/authMiddleware.js`.

## Dependency Map
- `Backend/routes/admin/settings.routes.js` -> imports -> `Backend/controllers/admin/settings.controller.js`
- `Backend/routes/admin/settings.routes.js` -> imports -> `Backend/middlewares/authMiddleware.js` (for authentication and role check)
- `Backend/controllers/admin/settings.controller.js` -> imports -> `Backend/models/PlatformSetting.js`
- `Backend/server.js` or main router -> imports -> `Backend/middlewares/maintenanceMode.js`

## Proposed Changes

### Maintenance Mode Middleware

#### [NEW] Backend/middlewares/maintenanceMode.js
- What: Create a middleware that checks `PlatformSetting.findOne()`. If `maintenance_mode` is true, and the user is not an admin (or route is not under `/api/admin`), return 503.
- Why: Enforce maintenance mode locking for non-admin platform login requests and routes.
- Impact: Will be applied globally or to non-admin routes.

### Admin Settings Controller

#### [NEW] Backend/controllers/admin/settings.controller.js
- What: Implement `getSettings` and `updatePlatformSettings` methods.
- Why: Fulfill the API contract for `GET /api/admin/settings` and `PUT /api/admin/settings/platform`.
- Impact: Handles platform configuration changes.

### Admin Settings Routes

#### [NEW] Backend/routes/admin/settings.routes.js
- What: Define the routes for the settings APIs using `requireRole` middleware.
- Why: Expose the controller logic.
- Impact: Will need to be mounted in `Backend/server.js`.

### RBAC Middleware

#### [MODIFY] Backend/middlewares/authMiddleware.js
- What: Ensure `requireRole` function exists and supports passing an array of allowed roles (e.g. `['SUPER_ADMIN']`).
- Why: Route protection requirement.
- Impact: All protected routes using `requireRole`.

### Server / App

#### [MODIFY] Backend/server.js
- What: Mount `/api/admin/settings` and apply `maintenanceMode` middleware where appropriate.
- Why: Expose new endpoints and enforce maintenance mode.
- Impact: Global routing.

## DRY Context
- Reuse existing authentication middleware for `GET` and `PUT` endpoints.
- Check `docs/shared_utilities.md` for shared implementations (e.g., RBAC).

## Risks & Edge Cases
- Concurrency: Addressed by last-write-wins (default Mongoose behavior).
- Missing test coverage: Need to verify 503 response when maintenance mode is active.
- Ensure SUPER_ADMIN vs ADMIN is properly validated.
