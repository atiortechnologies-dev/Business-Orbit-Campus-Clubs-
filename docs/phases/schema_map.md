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
