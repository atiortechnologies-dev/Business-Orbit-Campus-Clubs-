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
