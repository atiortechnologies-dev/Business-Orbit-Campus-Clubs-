# Phase 4 API Contract

## Overview
Phase 4 ("Integrate Notifications & Activity Logs for Opportunities and Chapters") does not introduce new HTTP API routes. Instead, it involves adding hooks, middlewares, or service calls to existing endpoints (from Phases 1, 2, and 3) to log activity and trigger notifications upon specific state transitions.

## Modified Existing Endpoints

### POST /api/admin/opportunities/{id}/approve
- **Added Behavior**: 
  - Writes to `AuditLog` (action: `OPPORTUNITY_APPROVED`, module: `OPPORTUNITIES`).
  - Triggers notification to the Company (via email/in-app).

### POST /api/admin/opportunities/{id}/reject
- **Added Behavior**: 
  - Triggers notification to the Company with feedback details.

### POST /api/admin/opportunities/{id}/request-changes
- **Added Behavior**: 
  - Writes to `AuditLog` (action: `OPPORTUNITY_CHANGES_REQUESTED`, module: `OPPORTUNITIES`).
  - Triggers notification to the Company with admin notes.

### PUT /api/admin/chapters/{id}/assign-lead
- **Added Behavior**:
  - Writes to `AuditLog` (action: `CHAPTER_LEAD_ASSIGNED`, module: `CHAPTERS`).

### POST /api/admin/chapters/{id}/events
- **Added Behavior**:
  - Writes to `AuditLog` (action: `CHAPTER_EVENT_CREATED`, module: `CHAPTERS`).
  - Triggers notification to all students in the chapter.

## New API Endpoints
- **None**.
