# Phase 3 Context: Application Tracking & Management API

## Global Project Guidelines
Shared Backend Logic
When a student enters the Freelancing module:
Verify student authentication.
Load published opportunities.
Load student's profile and resume status.
Load previously submitted applications.
Load saved filters and search preferences.
Load notifications related to applications.

## Phase-Specific Requirements
Screen 4 – My Applications

Backend Logic
Display all applications submitted by the student.
Each application should display:
Opportunity Title 
Company Name 
Applied Date 
Current Status 
Hiring Progress Timeline 

Support tabs:
Active 
Interviews 
Selected 
Rejected 
Archived 

Actions
View Application 
Withdraw Application (before interview stage) 
Open Company Chat (if enabled) 
Join Interview (if scheduled) 

Database Structure

Application Status History
history_id 
application_id 
status 
updated_by 
remarks 
updated_at 

Business Rules

Application status flow:
Draft
      │
Submitted
      │
Viewed
      │
Shortlisted
      │
Interview
      │
 ┌────┴─────┐
 │                       │
Selected        Rejected

Companies update application status. 
Students have read-only access to status updates. 
Students can withdraw applications before the interview stage. 
Archived applications remain viewable for record purposes. 

APIs Required

Application Tracking
GET /api/student/freelancing/applications/status
GET /api/student/freelancing/applications/{applicationId}/timeline
GET /api/student/freelancing/applications/interviews

## Resolved Clarifications (Relevant to This Phase)
None.

## Schema Context
# Database Schema Map

## Entity Relationship Overview
- `Opportunity` -> `User` (company_id)
- `SavedOpportunity` -> `User` (student_id), `Opportunity` (opportunity_id)
- `Application` -> `Opportunity` (opportunity_id), `User` (student_id)
- `ApplicationDocument` -> `Application` (application_id)

## Models Scaffolded
| Model | File | Fields | References | Status Enum |
|-------|------|--------|------------|-------------|
| Opportunity | Backend/models/Opportunity.js | company_id, title, type, work_mode, industry, experience_level, description, responsibilities, required_skills, eligibility_criteria, preferred_qualifications, location, duration, salary_stipend, salary_range, application_deadline, status | User (company_id) | draft, open, active, closed |
| SavedOpportunity | Backend/models/SavedOpportunity.js | student_id, opportunity_id | User (student_id), Opportunity (opportunity_id) | — |
| Application | Backend/models/Application.js | opportunity_id, student_id, application_status, resume_url, cover_letter, portfolio_url, availability, joining_date | Opportunity (opportunity_id), User (student_id) | applied, shortlisted, rejected, interviewing, hired, draft, submitted, viewed, interview, selected, withdrawn |
| ApplicationDocument | Backend/models/ApplicationDocument.js | application_id, document_type, file_name, file_url | Application (application_id) | — |

## Cascade Rules
- None defined for Phase 1.

## Shared Utilities Available
No shared utilities registered yet.

## API Contracts from Previous Phases
Phase 1: Database Setup and Core Opportunities API
Phase 2: Applications & Document Uploads API (Handles create, read, update, withdraw, submit application)
