## GET /api/admin/chapters/:id/events
- Auth required: ADMIN or SUPER_ADMIN
- Request params: `id` (ObjectId)
- Request query: `page` (number, default 1), `limit` (number, default 10)
- Success: 200 { message: string, data: { events: [ChapterEvent], page: number, limit: number, total_records: number, total_pages: number, metrics: { upcoming: number, completed: number, total_registrations: number, average_attendance_pct: number } } }
- Errors: 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

## POST /api/admin/chapters/:id/events
- Auth required: ADMIN or SUPER_ADMIN
- Request params: `id` (ObjectId)
- Request body: { title: string (required), description: string (required), category: string (required), event_date: string (required, future date), location_venue: string (required), max_capacity: number (required, > 0) }
- Success: 201 { message: string, data: { event: ChapterEvent } }
- Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
