# Phase 3 API Contract: Application Tracking & Management API

## GET /api/student/freelancing/applications/status
- Auth required: Yes (Student)
- Success: 200 { data: { counts: { active: number, interviews: number, selected: number, rejected: number, archived: number } } }
- Errors: 401 (Unauthorized), 500 (server error)

## GET /api/student/freelancing/applications/{applicationId}/timeline
- Auth required: Yes (Student)
- Path parameters: applicationId
- Success: 200 { data: { timeline: [ { _id, status, remarks, updated_at, updated_by: { _id, name } } ] } }
- Errors: 401, 403, 404, 500

## GET /api/student/freelancing/applications/interviews
- Auth required: Yes (Student)
- Success: 200 { data: { interviews: [ { _id, opportunity_id, application_status, opportunity: { title, company_name }, updated_at } ] } }
- Errors: 401, 500
