# Phase 4 Context: Integrate Notifications & Activity Logs for Opportunities and Chapters

## Global Project Guidelines
**Authorization & RBAC**
All endpoints under `/api/admin/opportunities/*` and `/api/admin/chapters/*` require ADMIN or SUPER_ADMIN privileges. 

**Pagination, Search & Filters**
- Standardized response envelope: `page`, `limit`, `total_records`, `total_pages`.
- Query parameter filtering by `company_id`, `type`, `status`, `chapter_id`, and date ranges. 

**File & Storage Handling**
Pre-signed URLs generated for opportunity attachments, company logos, and chapter documents.

**Audit & System Activity Logging**
Every state transition (Opportunity Approved, Changes Requested, Chapter Lead Assigned, Event Created) writes an immutable record to the AuditLog table. 

## Phase-Specific Requirements
## 9. Notifications
- **Opportunity Approved**: Sent to Company via Email/In-App when opportunity is set to ACTIVE. 
- **Changes Requested**: Sent to Company with admin notes when modifications are required. 
- **Opportunity Rejected**: Sent to Company with feedback details. 
- **Event Published**: Sent to all students in the chapter when a new ACTIVE event is added. 

## 10. Activity Logs
- `OPPORTUNITY_APPROVED`: Logged when an admin approves a company job post. 
- `OPPORTUNITY_CHANGES_REQUESTED`: Logged when an admin requests listing edits. 
- `CHAPTER_LEAD_ASSIGNED`: Logged when a lead is assigned to a chapter. 
- `CHAPTER_EVENT_CREATED`: Logged when a new chapter event is published. 

## Resolved Clarifications (Relevant to This Phase)
- External Services: The PRD mentioned generating pre-signed URLs for file uploads and sending emails, but didn't specify the integrations. Resolution: Assume these are handled by existing internal microservices and just define the interfaces.

## Schema Context
# Database Schema Map

## Entity Relationship Overview
- `FreelanceOpportunity` -> `User` (company_id)
- `FreelanceOpportunity` -> `User` (assigned_reviewer_id)
- `OpportunityNote` -> `FreelanceOpportunity` (opportunity_id)
- `OpportunityNote` -> `User` (author_id)
- `SavedOpportunity` -> `User` (student_id), `Opportunity` (opportunity_id)
- `Application` -> `Opportunity` (opportunity_id), `User` (student_id)
- `ApplicationDocument` -> `Application` (application_id)
- `ApplicationStatusHistory` -> `Application` (application_id), `User` (updated_by)
- `AuditLog` -> `User` (actor_id)
- `AdminNotificationSetting` -> `User` (user_id)
- `UserSession` -> `User` (user_id)
- `Chapter` -> `User` (chapter_lead_id)
- `ChapterEvent` -> `Chapter` (chapter_id)
- `EventRegistration` -> `ChapterEvent` (event_id), `User` (user_id)

## Models Scaffolded
| Model | File | Fields | References | Status Enum |
|-------|------|--------|------------|-------------|
| FreelanceOpportunity | Backend/models/FreelanceOpportunity.js | company_id, title, opportunity_type, category, work_mode, description, responsibilities, required_skills, eligibility, duration, compensation, deadline, status, assigned_reviewer_id | User (company_id), User (assigned_reviewer_id) | DRAFT, PENDING, CHANGES_REQUESTED, ACTIVE, REJECTED, EXPIRED |
| OpportunityNote | Backend/models/OpportunityNote.js | opportunity_id, author_id, note_text | FreelanceOpportunity (opportunity_id), User (author_id) | — |
| Opportunity | Backend/models/Opportunity.js | (legacy) | User (company_id) | draft, open, active, closed |
| SavedOpportunity | Backend/models/SavedOpportunity.js | student_id, opportunity_id | User (student_id), Opportunity (opportunity_id) | — |
| Application | Backend/models/Application.js | opportunity_id, student_id, application_status, resume_url, cover_letter, portfolio_url, availability, joining_date | Opportunity (opportunity_id), User (student_id) | applied, shortlisted, rejected, interviewing, hired, draft, submitted, viewed, interview, selected, withdrawn |
| ApplicationDocument | Backend/models/ApplicationDocument.js | application_id, document_type, file_name, file_url | Application (application_id) | — |
| ApplicationStatusHistory | Backend/models/ApplicationStatusHistory.js | application_id, status, updated_by, remarks | Application (application_id), User (updated_by) | draft, submitted, viewed, shortlisted, interview, selected, rejected, withdrawn |
| AuditLog | Backend/models/AuditLog.js | actor_id, actor_name, module, action, target_entity_id, target_entity_name, status, ip_address, details | User (actor_id) | SUCCESS, REJECTED, PENDING |
| PlatformSetting | Backend/models/PlatformSetting.js | platform_name, logo_url, support_email, timezone, allow_new_registrations, require_email_verification, maintenance_mode, public_profiles_visible | — | — |
| AdminNotificationSetting | Backend/models/AdminNotificationSetting.js | user_id, event_category, in_app_enabled, email_enabled | User (user_id) | — |
| UserSession | Backend/models/UserSession.js | user_id, device_name, os_browser, ip_address, refresh_token_hash, is_current, last_active_at | User (user_id) | — |

## Cascade Rules
- Deleting an Admin user -> `UserSession` and `AdminNotificationSetting` are deleted, but `actor_id` in `AuditLog` is set to NULL.
- Deleting a User -> Deleting a Chapter or CompanyProfile uses soft deletes (`is_deleted`) to preserve audit history.
| Chapter | Backend/models/Chapter.js | chapter_name, college_name, location, chapter_lead_id, status, health_score, founded_date, is_deleted | User (chapter_lead_id) | PENDING, ACTIVE, INACTIVE |
| ChapterEvent | Backend/models/ChapterEvent.js | chapter_id, title, description, category, event_date, location_venue, max_capacity, total_registrations, status | Chapter (chapter_id) | PENDING, ACTIVE, COMPLETED, CANCELLED |
| EventRegistration | Backend/models/EventRegistration.js | event_id, user_id, status | ChapterEvent (event_id), User (user_id) | REGISTERED, ATTENDED, CANCELLED |

## Shared Utilities Available
# Shared Utilities (Batch 3)

## 1. Audit Logger Service
A centralized logging utility to emit records to the `AuditLog` table.
- Function signature: `logAudit(actor, module, action, targetEntityId, targetEntityName, status, ipAddress, details)`
- Ensures immutability (no delete/update functions provided).
- Should be used across all controllers in Batch 3.

## 2. Maintenance Mode Middleware
An Express middleware to check the `PlatformSetting.maintenance_mode` toggle.
- If true, blocks all non-admin routes with a 503 Service Unavailable response.

## 3. RBAC Middleware (ADMIN vs SUPER_ADMIN)
Role-based access control middleware to restrict certain routes to SUPER_ADMIN only.
- e.g., `requireRole(['SUPER_ADMIN'])` vs `requireRole(['ADMIN', 'SUPER_ADMIN'])`

## 4. Session Revocation Utility
A function to invalidate or delete sessions from `UserSession` table, used during logout, sign-out all devices, and password changes.

## API Contracts from Previous Phases
- phase_1_api_contract.md
- phase_2_api_contract.md
- phase_3_api_contract.md
- phase_4_api_contract.md (may be from a previous run)
