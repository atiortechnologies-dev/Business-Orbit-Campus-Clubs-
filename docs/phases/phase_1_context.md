# Phase 1 Context: Implement Opportunity Moderation Core (Models, APIs for Queue, Review, State Transitions, Private Notes)

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
### Screen 9: Opportunity Approval Queue
- **Purpose**: High-level dashboard to search, filter, export, and review submitted opportunities awaiting moderation. 
- **Backend Logic**:
  - Fetches counts for metric cards: Pending Reviews, Approved, Rejected (with reported issues counter), and Drafts. 
  - Returns paginated listings with search and filter conditions. 
  - Calculates Queue Velocity (review throughput by day of the week). 
- **Data to Load**:
  - Metric summary cards. 
  - Opportunity Queue table: Title, ID, Company Name, Type Badge (Job, Internship, Collaboration, Project), Posted Date, Deadline, Status, Assigned Reviewer, Action links. 
  - Queue Velocity daily chart data. 
  - Recent activity feed. 
- **Data to Save**: Bulk approval selections. 
- **User Actions**: Filter by Company, Opportunity Type, Status, Date Range; Click Export List, Bulk Approve, or click an individual opportunity row. 
- **State Changes**: Bulk approve updates status of selected opportunities from PENDING to ACTIVE. 
- **Navigation Triggers**: Clicking an opportunity row opens Screen 10 (`/admin/opportunities/{opportunityId}`). 

### Screen 10: Opportunity Review
- **Purpose**: In-depth verification of a single submitted opportunity including company profile, job details, skill requirements, compensation, revision history, and admin decisions. 
- **Backend Logic**:
  - Fetches complete opportunity listing details and associated company profile. 
  - Fetches audit revision history and private internal notes. 
  - Handles actions: Message Startup/Company, Reject Opportunity, Request Changes, or Approve Opportunity. 
- **Data to Save**:
  - Admin internal notes (`POST /api/admin/opportunities/{id}/notes`). 
  - Change status payload on Reject, Request Changes, or Approve. 
- **State Changes**:
  - Approve -> Updates status to ACTIVE (visible in public listings). 
  - Reject -> Updates status to REJECTED. 
  - Request Changes -> Updates status to CHANGES_REQUESTED and notifies company. 

**Table 1: FreelanceOpportunity**
- `id` (UUID, Primary Key)
- `company_id` (UUID, Foreign Key -> CompanyProfile.id) 
- `title` (VARCHAR) 
- `opportunity_type` (ENUM: JOB, INTERNSHIP, COLLABORATION, PROJECT) 
- `category` (VARCHAR: ENGINEERING, DESIGN, etc.) 
- `work_mode` (ENUM: REMOTE, ON_SITE, HYBRID) 
- `description` (TEXT) 
- `responsibilities` (TEXT) 
- `required_skills` (ARRAY/JSON) 
- `eligibility` (VARCHAR) 
- `duration` (VARCHAR) 
- `compensation` (VARCHAR) 
- `deadline` (DATE) 
- `status` (ENUM: DRAFT, PENDING, CHANGES_REQUESTED, ACTIVE, REJECTED, EXPIRED) 
- `assigned_reviewer_id` (UUID, Foreign Key -> User.id, Nullable) 
- `created_at` (TIMESTAMP)

**Table 2: OpportunityNote**
- `id` (UUID, Primary Key)
- `opportunity_id` (UUID, Foreign Key -> FreelanceOpportunity.id) 
- `author_id` (UUID, Foreign Key -> User.id) 
- `note_text` (TEXT) 
- `created_at` (TIMESTAMP) 

## Resolved Clarifications (Relevant to This Phase)
- **Opportunity Approval Mandatory**: Opportunities posted by companies must be explicitly approved by an admin before becoming visible to students in the freelance portal. 
- **Draft Lock & Deadline Enforcement**: Expired or rejected opportunities cannot accept new student applications. 
- Validation Rules: Opportunity Title: Required, 5 to 100 characters. Required Skills: Minimum 1 skill tag required. Opportunity Deadline: Must be a future date.
- Activity Logs: `OPPORTUNITY_APPROVED`: Logged when an admin approves a company job post. `OPPORTUNITY_CHANGES_REQUESTED`: Logged when an admin requests listing edits. 
- Notifications: Opportunity Approved: Sent to Company via Email/In-App when opportunity is set to ACTIVE. Changes Requested: Sent to Company with admin notes when modifications are required. Opportunity Rejected: Sent to Company with feedback details.

## Schema Context
Schema map not yet generated. This phase will create it.

## Shared Utilities Available
1. Audit Logger Service: `logAudit(actor, module, action, targetEntityId, targetEntityName, status, ipAddress, details)`
2. Maintenance Mode Middleware
3. RBAC Middleware: `requireRole(['ADMIN', 'SUPER_ADMIN'])`
4. Session Revocation Utility

## API Contracts from Previous Phases
No previous phase contracts relevant.
