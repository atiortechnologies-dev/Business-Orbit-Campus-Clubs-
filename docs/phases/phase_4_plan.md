# Phase 4: Integrate Notifications & Activity Logs for Opportunities and Chapters

## Context
- The phase adds logging and notifications for Opportunity approval/rejection and Chapter event/lead assignment workflows.
- `AuditLog` model already has the `OPPORTUNITIES` and `CHAPTERS` modules added.
- `auditLoggerService.js` provides `logAudit` utility.
- Notification sending can be handled via existing `notification.controller.js` logic or a new service method.

## Dependency Map
- `opportunity.controller.js` → `AuditLog`, `Notification`
- `chapter.controller.js` → `AuditLog`, `Notification`

## Proposed Changes

### Backend/controllers/admin/opportunity.controller.js
- **What**: In `approveOpportunity`, `rejectOpportunity`, and `requestChanges`, import `logAudit` and write logs to `OPPORTUNITIES` module. Import notification service to notify the opportunity's `company_id`.
- **Why**: PRD Section 9 and 10 require audit logging and company notification on moderation.
- **Impact**: Modifies moderation endpoints.

### Backend/controllers/admin/chapter.controller.js
- **What**: In `assignChapterLead`, add `logAudit` for `CHAPTERS` module (`CHAPTER_LEAD_ASSIGNED`). In `createChapterEvent`, add `logAudit` (`CHAPTER_EVENT_CREATED`) and trigger notification to chapter students.
- **Why**: PRD Sections 9 and 10 require chapter lead and event creation to be logged and students to be notified.
- **Impact**: Modifies chapter management endpoints.

## DRY Context
- Re-use `logAudit` from `Backend/services/auditLoggerService.js`.

## Risks & Edge Cases
- Make sure notification creation is non-blocking (don't fail the API if notification fails).
- Make sure `auditLoggerService` correctly maps the actor/admin making the request.
