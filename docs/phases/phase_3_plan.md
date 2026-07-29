# Phase 3: System Audit Logging Engine

## Context
- The backend has `protect` and `requireRole` in `authMiddleware.js` for role-based access control.
- `AuditLog` model already exists from Data Modeling phase.
- We need to implement AuditLog APIs: paginated list, pulse stream, volume trend, and CSV export.

## Dependency Map
- `auditLog.routes.js` → imports → `auditLog.controller.js`
- `auditLog.controller.js` → uses → `AuditLog` model
- `server.js` → mounts → `auditLog.routes.js`

## Proposed Changes

### Backend/controllers/auditLog.controller.js

#### [NEW] Backend/controllers/auditLog.controller.js
- What: Implement four controller functions: `getLogs` (with pagination and filtering by timeframe, module, user), `getPulse` (returns recent activity), `getVolumeTrend` (returns 24-hour log volume histogram), and `exportLogs` (returns CSV output of filtered logs).
- Why: To satisfy the Audit Log APIs defined in the API contract.
- Impact: Core logic for the Audit Log module.

### Backend/routes/auditLog.routes.js

#### [NEW] Backend/routes/auditLog.routes.js
- What: Define the routes for the audit log endpoints, using `protect` and `requireRole(['admin', 'super_admin'])` for most, and `requireRole(['super_admin'])` for `/export`.
- Why: To map the endpoints defined in the API contract to their controller functions.
- Impact: Exposes `/api/admin/audit-log` endpoints. Requires mounting in `server.js`.

### Backend/server.js

#### [MODIFY] Backend/server.js
- What: Import and mount `auditLog.routes.js` at `/api/admin/audit-log`.
- Why: To make the new routes accessible.
- Impact: Global routing layer.

## DRY Context
- Reuse `protect` and `requireRole` from `Backend/middlewares/authMiddleware.js`.
- Reuse `asyncHandler` from `Backend/middlewares/asyncHandler.js`.

## Risks & Edge Cases
- Test coverage needs to ensure that the CSV export endpoint is covered and works correctly.
- Need to parse `timeframe` (e.g. 24h, 7d, 30d) safely in the controllers.
