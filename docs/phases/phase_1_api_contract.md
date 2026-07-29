# Phase 1 API Contract: Database Setup and Core Opportunities API

## GET /api/student/freelancing/opportunities
- Auth required: Yes (Student)
- Query parameters: page, limit
- Success: 200 { data: { opportunities: [ { _id, title, company_id, type, work_mode, experience_level, location, salary_range, created_at, application_deadline, description } ], pagination: { total, page, pages } } }
- Errors: 401 (Unauthorized), 500 (Server Error)

## GET /api/student/freelancing/opportunities/search
- Auth required: Yes (Student)
- Query parameters: q (search string), page, limit
- Success: 200 { data: { opportunities: [...], pagination: {...} } }
- Errors: 401, 500

## POST /api/student/freelancing/opportunities/filter
- Auth required: Yes (Student)
- Request body: { type: [string] (optional), work_mode: [string] (optional), industry: [string] (optional), experience_level: [string] (optional), sort: string (latest, deadline, relevance) (optional), page: number (optional), limit: number (optional) }
- Success: 200 { data: { opportunities: [...], pagination: {...} } }
- Errors: 400 (Bad Request), 401, 500

## GET /api/student/freelancing/opportunities/{opportunityId}/details
- Auth required: Yes (Student)
- Path parameters: opportunityId
- Success: 200 { data: { opportunity: { _id, title, description, responsibilities, required_skills, eligibility_criteria, preferred_qualifications, location, duration, salary_stipend, application_deadline, company_id: { _id, companyName, logo, industry, websiteUrl, description } } } }
- Errors: 401, 404 (Not Found), 500

## POST /api/student/freelancing/opportunities/{opportunityId}/save
- Auth required: Yes (Student)
- Path parameters: opportunityId
- Success: 200 { message: "Opportunity saved successfully" }
- Errors: 400, 401, 404, 409 (Already saved), 500

## DELETE /api/student/freelancing/opportunities/{opportunityId}/save
- Auth required: Yes (Student)
- Path parameters: opportunityId
- Success: 200 { message: "Opportunity unsaved successfully" }
- Errors: 401, 404, 500
