# Phase 1: Implement Opportunity Moderation Core

## Context
- The codebase already contains basic Admin routing in `Backend/routes/admin.routes.js`.
- The `FreelanceOpportunity` and `OpportunityNote` models have been scaffolded with the new batch 2 requirements.
- We need to create a dedicated controller and router for opportunity moderation.
- A centralized Audit Logger service exists but we must also ensure audit logs are created for state transitions.

## Dependency Map
- `Backend/routes/admin.routes.js` -> imports -> `opportunity.routes.js`
- `Backend/routes/admin/opportunity.routes.js` -> imports -> `opportunity.controller.js`, `authMiddleware.js`
- `Backend/controllers/admin/opportunity.controller.js` -> imports -> `FreelanceOpportunity`, `OpportunityNote`, `AuditLog`, etc.

## Proposed Changes

### Opportunity Moderation API

#### [NEW] Backend/controllers/admin/opportunity.controller.js
- What: Implement API logic for `getOpportunities` (GET /api/admin/opportunities), `getOpportunityDetails` (GET /api/admin/opportunities/:id), `approveOpportunity` (POST /api/admin/opportunities/:id/approve), `rejectOpportunity` (POST /api/admin/opportunities/:id/reject), `requestChanges` (POST /api/admin/opportunities/:id/request-changes), `addNote` (POST /api/admin/opportunities/:id/notes), and `bulkApprove` (POST /api/admin/opportunities/bulk-approve).
- Why: Full CRUD and state transition logic required by Screen 9 and 10 of PRD.
- Impact: Creates new controller.

#### [NEW] Backend/routes/admin/opportunity.routes.js
- What: Register routes mapped to `opportunity.controller.js`.
- Why: Provide the HTTP endpoints.
- Impact: Creates new routes file.

#### [MODIFY] Backend/routes/admin.routes.js
- What: Mount `opportunity.routes.js` under `/opportunities`.
- Why: Make the new endpoints accessible via `/api/admin/opportunities`.
- Impact: Adds router middleware.

## DRY Context
- Use existing `adminAuth` middleware.
- Create `AuditLog` records for `OPPORTUNITY_APPROVED`, `OPPORTUNITY_CHANGES_REQUESTED`, `OPPORTUNITY_REJECTED`.

## Risks & Edge Cases
- Test coverage must mock the database responses and verify pagination, audit logging, and correct status changes.
- Ensure only valid enum transitions occur (DRAFT -> PENDING -> ACTIVE, etc).
