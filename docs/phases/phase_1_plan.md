# Phase 1: Database Setup and Core Opportunities API

## Context
- The `Opportunity` and `SavedOpportunity` models are scaffolded and exist in `Backend/models/`.
- The `studentFreelancing.routes.js` and `studentFreelancing.controller.js` files are already implemented and cover the required Phase 1 APIs.
- The controller uses `asyncHandler` for error handling.

## Dependency Map
- `Backend/routes/studentFreelancing.routes.js` → imports → `Backend/controllers/studentFreelancing.controller.js`
- `Backend/controllers/studentFreelancing.controller.js` → imports → `Opportunity`, `SavedOpportunity`, `User`, `CompanyProfile` models.

## Proposed Changes

### studentFreelancing.controller.js

#### MODIFY Backend/controllers/studentFreelancing.controller.js
- What: Add `.lean()` to Mongoose `find` and `findOne` queries that only return data (e.g., `listOpportunities`, `searchOpportunities`, `filterOpportunities`, `getOpportunityDetails`).
- Why: Performance optimization. `.lean()` skips instantiating full Mongoose documents, reducing memory usage and CPU time for read-only queries.
- Impact: Affects the API response generation, but keeps the output format identical.

## DRY Context
- Reusing `asyncHandler` from `../middlewares/asyncHandler` for try/catch wrapping.
- Reusing `getActiveCompanyIds()` helper inside the controller.

## Risks & Edge Cases
- None identified; the queries are read-only and adding `.lean()` is non-breaking.
