# Phase 2 Context: Applications & Document Uploads API

## Global Project Guidelines
**Shared Backend Logic**
When a student enters the Freelancing module:
- Verify student authentication.

**Validation Rules**
Implement standard validations:
- Student authentication.
- Opportunity availability check.
- Application deadline validation.
- Resume required.
- Supported document formats (PDF, DOCX).
- Maximum upload size.
- Valid portfolio URL.
- Duplicate application prevention.
- Required application fields.

## Phase-Specific Requirements
**Screen 3 – Apply for Opportunity**
**Backend Logic**
Allow students to submit applications.
Capture:
**Applicant Information**
- Student Name
- Email
- Phone Number
(Pre-filled from student profile)
**Application Details**
- Resume
- Cover Letter
- Portfolio Link (Optional)
- Expected Joining Date
- Availability
- Additional Documents (Optional)

**Actions**
- Save Draft
- Submit Application
When submitted:
- Validate required fields.
- Upload resume and documents.
- Create application record.
- Set application status to Submitted.
- Notify the company.
- Record submission timestamp.
- Prevent duplicate applications for the same opportunity.

**Database Structure**
**Applications**
- application_id
- opportunity_id
- student_id
- resume_url
- cover_letter
- portfolio_url
- availability
- joining_date
- status
- submitted_at

**Application Documents**
- document_id
- application_id
- document_type
- file_name
- file_url
- uploaded_at

**Business Rules**
- One application per student per opportunity.
- Draft applications can be edited.
- Submitted applications become read-only.
- Applications after the deadline are rejected.

**APIs Required**
**Applications**
- POST /api/student/freelancing/applications
- GET /api/student/freelancing/applications
- GET /api/student/freelancing/applications/{applicationId}
- PUT /api/student/freelancing/applications/{applicationId}
- POST /api/student/freelancing/applications/upload-resume
- POST /api/student/freelancing/applications/upload-document
- POST /api/student/freelancing/applications/{applicationId}/submit
- DELETE /api/student/freelancing/applications/{applicationId}/withdraw

## Resolved Clarifications (Relevant to This Phase)
No specific appendix or clarifications exist in the PRD.

## Schema Context
# Database Schema Map

## Entity Relationship Overview
- `Opportunity` -> `User` (company_id)
- `SavedOpportunity` -> `User` (student_id), `Opportunity` (opportunity_id)

## Models Scaffolded
| Model | File | Fields | References | Status Enum |
|-------|------|--------|------------|-------------|
| Opportunity | Backend/models/Opportunity.js | company_id, title, type, work_mode, industry, experience_level, description, responsibilities, required_skills, eligibility_criteria, preferred_qualifications, location, duration, salary_stipend, salary_range, application_deadline, status | User (company_id) | draft, open, active, closed |
| SavedOpportunity | Backend/models/SavedOpportunity.js | student_id, opportunity_id | User (student_id), Opportunity (opportunity_id) | — |

## Cascade Rules
- None defined for Phase 1.

## Shared Utilities Available
No shared utilities registered yet.

## API Contracts from Previous Phases
Phase 1 API Contract: Database Setup and Core Opportunities API
- GET /api/student/freelancing/opportunities
- GET /api/student/freelancing/opportunities/search
- POST /api/student/freelancing/opportunities/filter
- GET /api/student/freelancing/opportunities/{opportunityId}/details
- POST /api/student/freelancing/opportunities/{opportunityId}/save
- DELETE /api/student/freelancing/opportunities/{opportunityId}/save
Response shape is `{ data: { ... } }` and error shape standard HTTP codes.
