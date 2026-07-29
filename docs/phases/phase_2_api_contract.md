# Phase 2 API Contract

## GET /api/admin/chapters/:id/overview
- Auth required: Yes (ADMIN or SUPER_ADMIN)
- Request query: None
- Success: 200 { message: string, data: { chapter: { id: ObjectId, chapter_name: string, college_name: string, status: string, health_score: number, location: string, chapter_lead_id: ObjectId }, metrics: { total_students: number, active_startups: number, mentors_count: number, upcoming_events: number } } }
- Errors: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)

## GET /api/admin/chapters/:id/students
- Auth required: Yes (ADMIN or SUPER_ADMIN)
- Request query: { page: number (default 1), limit: number (default 10) }
- Success: 200 { message: string, data: [ { id: ObjectId, name: string, email: string, ... } ], page: number, limit: number, total_records: number, total_pages: number, metrics: { total_students: number, active_startups: number, completion_rate: number, pending_reviews: number } }
- Errors: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)

## GET /api/admin/chapters/:id/startups
- Auth required: Yes (ADMIN or SUPER_ADMIN)
- Request query: { page: number (default 1), limit: number (default 10) }
- Success: 200 { message: string, data: [ { id: ObjectId, name: string, stage: string, ... } ], page: number, limit: number, total_records: number, total_pages: number, metrics: { total_startups: number, active_startups: number, incubated_count: number, launched_count: number } }
- Errors: 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)

## PUT /api/admin/chapters/:id/assign-lead
- Auth required: Yes (ADMIN or SUPER_ADMIN)
- Request body: { chapter_lead_id: string (required, valid ObjectId) }
- Success: 200 { message: string, data: { chapter: { id: ObjectId, chapter_lead_id: ObjectId } } }
- Errors: 400 (Validation Error), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)
