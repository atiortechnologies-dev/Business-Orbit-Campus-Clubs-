# Phase 2: Implement Chapter Governance Core

## Context
- The project has existing models for `Chapter`, `StudentProfile`, `Startup`, and `AuditLog`.
- `admin.routes.js` groups admin actions and requires `adminAuth` middleware.
- New endpoints for chapter governance (overview, students, startups, assign-lead) are required for the admin module.

## Dependency Map
- `Backend/routes/admin.routes.js` → imports → `Backend/routes/admin/chapter.routes.js`
- `Backend/routes/admin/chapter.routes.js` → calls → `Backend/controllers/admin/chapter.controller.js`

## Proposed Changes

### Routes
#### [NEW] Backend/routes/admin/chapter.routes.js
- What: Create route definitions for chapter governance.
- Why: Segregate chapter-specific admin routes for modularity.
- Impact: None on existing, provides new endpoints.

#### [MODIFY] Backend/routes/admin.routes.js
- What: Import and mount `admin/chapter.routes.js` at `/chapters`.
- Why: Expose the chapter governance endpoints to the admin router.
- Impact: Expands available admin endpoints.

### Controllers
#### [NEW] Backend/controllers/admin/chapter.controller.js
- What: Implement `getChapterOverview`, `getChapterStudents`, `getChapterStartups`, and `assignChapterLead`.
- Why: Business logic for chapter governance.
- Details: 
  - `getChapterOverview`: Aggregate chapter info and metrics (total students, active startups, etc).
  - `getChapterStudents`: Query `StudentProfile` filtered by chapter_id with pagination (`formatPaginatedResponse`).
  - `getChapterStartups`: Query `Startup` filtered by chapter_id with pagination.
  - `assignChapterLead`: Update `chapter_lead_id` and write an `AuditLog` entry.
- Impact: Resolves all API requirements for this phase.

### Models
#### [MODIFY] Backend/models/AuditLog.js
- What: Add `CHAPTER_LEAD_ASSIGNED` to action enum if missing.
- Why: Required by PRD for tracking lead assignment.
- Impact: Validates new audit logs.

## DRY Context
- Use `formatPaginatedResponse` for list endpoints.
- Use `buildSearchAndFilterQuery` if applicable.

## Risks & Edge Cases
- Missing test coverage for the new admin controller functions. Need to ensure `assignChapterLead` handles invalid user IDs properly.
- Ensure `StudentProfile` and `Startup` pagination is properly indexed by `chapter_id`.
