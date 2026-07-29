# Phase 2 Context: Implement Chapter Governance Core (Chapter Data Models, APIs for Overview, Students, Startups, Assign Lead)

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

### Screen 11: Chapter Detail – Overview Tab
- **Purpose**: Central command center for a single college chapter showing high-level stats, active review stages, chapter health, recent activity, and quick administrative actions. 
- **Backend Logic**:
  - Aggregates chapter metrics: Total Students, Active Startups, Mentors count, Upcoming Events count. 
  - Computes Chapter Health score % based on active student participation and report timeliness. 
  - Loads active review stage indicators and recent chapter activity feed. 

### Screen 12: Chapter Detail – Students Tab
- **Purpose**: Manage and filter all registered students belonging to this specific college chapter. 
- **Backend Logic**:
  - Retrieves paginated students filtered by `chapter_id`. 
  - Calculates top summary metrics: Total Students, Active Startups, Completion Rate %, Pending Reviews. 

### Screen 13: Chapter Detail – Startups Tab
- **Purpose**: Display a list of startups originating strictly from this chapter. Clicking a startup acts as a navigation trigger to open the main Startups module for full stage progress. 
- **Backend Logic**:
  - Retrieves paginated list of startups where `chapter_id = current_chapter_id`. 
  - Computes chapter startup metrics: Total Startups, Active Startups, Incubated count, Launched count. 

### Database Structure
**Table 3: Chapter**
- `id` (UUID, Primary Key)
- `name` (VARCHAR) 
- `institution_name` (VARCHAR) 
- `location` (VARCHAR) 
- `chapter_lead_id` (UUID, Foreign Key -> User.id, Nullable) 
- `status` (ENUM: PENDING, ACTIVE, INACTIVE) 
- `health_score` (INT, Default 100) 
- `founded_date` (DATE) 
- `created_at` (TIMESTAMP)

### Business Rules
- **Chapter Data Filtering**: When viewing Chapter Startups, the system strictly filters startups by `startup.chapter_id = chapter.id`. 
- **Startup Redirection**: Clicking a startup row inside a Chapter view MUST pass the startupId as a route parameter to redirect to the primary `/admin/startups/{startupId}` module. 

### Validation Rules
- Chapter Lead: Assigned user must possess ACTIVE account status. 

### Activity Logs
- `CHAPTER_LEAD_ASSIGNED`: Logged when a lead is assigned to a chapter. 

### APIs Required
**Chapter Management APIs**
- `GET /api/admin/chapters/{id}/overview` — Get chapter overview and high-level stats. 
- `GET /api/admin/chapters/{id}/students` — List students filtered by chapter. 
- `GET /api/admin/chapters/{id}/startups` — List startups filtered by chapter. 
- `PUT /api/admin/chapters/{id}/assign-lead` — Update chapter lead. 

## Resolved Clarifications (Relevant to This Phase)
2. **Cascade Deletion**: The PRD did not specify the cascade behaviour when a `Chapter` or `CompanyProfile` is deleted.
   - *Question:* What should happen to associated records (e.g. `ChapterEvent`, `FreelanceOpportunity`)?
   - *Resolution:* Use soft deletes (mark as `is_deleted`) for chapters and companies to preserve audit history, and soft-delete related records.

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

## Shared Utilities Available
# Shared Utilities (Backend Batch 2)

## 1. RBAC Middleware
- `isAdmin`: Middleware to check if the user has `ADMIN` or `SUPER_ADMIN` privileges. Ensure this is applied to all `/api/admin/opportunities/*` and `/api/admin/chapters/*` routes.

## 2. Pagination Formatter
- `formatPaginatedResponse(data, page, limit, totalRecords)`: Utility to standardize the response envelope across all list endpoints:
  ```json
  {
    "data": [...],
    "page": 1,
    "limit": 10,
    "total_records": 100,
    "total_pages": 10
  }
  ```

## 3. Database Transaction Helper
- `withTransaction`: A helper to wrap database operations in a Mongoose session/transaction, especially critical for incrementing `total_registrations` with capacity checks.

## 4. Query Builder / Filters
- `buildSearchAndFilterQuery(req.query)`: Helper to extract common filters like `company_id`, `type`, `status`, `chapter_id`, and `date ranges` to build Mongoose query objects.

## API Contracts from Previous Phases
No existing API contracts from previous phases found.
