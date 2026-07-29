# Phase 3: Implement Chapter Events Management (ChapterEvent, EventRegistration, APIs for listing and creating events)

## Context
- `Backend/models/ChapterEvent.js` and `Backend/models/EventRegistration.js` were updated/created to support events for Chapters.
- `Backend/controllers/admin/chapter.controller.js` handles chapter admin operations and needs `getChapterEvents` and `createChapterEvent`.
- `Backend/routes/admin/chapter.routes.js` maps `/api/admin/chapters` endpoints and needs routes for events.

## Dependency Map
- `Backend/controllers/admin/chapter.controller.js` → imports → `Backend/models/ChapterEvent.js`, `Backend/models/EventRegistration.js`, `Backend/models/AuditLog.js`
- `Backend/routes/admin/chapter.routes.js` → calls → `getChapterEvents`, `createChapterEvent` from `Backend/controllers/admin/chapter.controller.js`

## Proposed Changes

### Chapter Event Controllers

#### [MODIFY] /home/jimfleax/Business-Orbit-Campus-Clubs-/Backend/controllers/admin/chapter.controller.js
- What: Add `getChapterEvents` and `createChapterEvent` controller functions.
- Why: To list events scheduled by a chapter and to create new chapter events as required by the PRD.
- Impact: Extends chapter API surface. 

#### [MODIFY] /home/jimfleax/Business-Orbit-Campus-Clubs-/Backend/routes/admin/chapter.routes.js
- What: Add `GET /:id/events` mapped to `getChapterEvents` and `POST /:id/events` mapped to `createChapterEvent`.
- Why: To expose the new event functionalities via the API.
- Impact: Adds new API routes under `/api/admin/chapters`.

## DRY Context
- Use `asyncHandler` middleware for controller functions.
- Use `formatPaginatedResponse` utility in `chapter.controller.js` for pagination.
- Use existing `AuditLog` creation pattern for `CHAPTER_EVENT_CREATED`.

## Risks & Edge Cases
- `createChapterEvent` must validate that `max_capacity` > 0.
- Ensure event creation adds an AuditLog.
- Missing test coverage areas: need Jest tests for these new endpoints.
