## GET /api/admin/opportunities
- Auth required: ADMIN or SUPER_ADMIN
- Request query: `page` (number, default 1), `limit` (number, default 10), `company_id` (string), `type` (string), `status` (string), `date_from` (string), `date_to` (string)
- Success: 200 { message: string, data: { opportunities: [FreelanceOpportunity], page: number, limit: number, total_records: number, total_pages: number, queueVelocity: object, metricCards: object } }
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## GET /api/admin/opportunities/:id
- Auth required: ADMIN or SUPER_ADMIN
- Request params: `id` (ObjectId)
- Success: 200 { message: string, data: { opportunity: FreelanceOpportunity, companyProfile: User, notes: [OpportunityNote], auditHistory: [AuditLog] } }
- Errors: 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)

## POST /api/admin/opportunities/:id/approve
- Auth required: ADMIN or SUPER_ADMIN
- Request params: `id` (ObjectId)
- Request body: None (or optional notes)
- Success: 200 { message: string, data: { opportunity: FreelanceOpportunity } }
- Errors: 401, 403, 404, 500

## POST /api/admin/opportunities/:id/reject
- Auth required: ADMIN or SUPER_ADMIN
- Request params: `id` (ObjectId)
- Request body: { reason: string (required) }
- Success: 200 { message: string, data: { opportunity: FreelanceOpportunity } }
- Errors: 400 (validation), 401, 403, 404, 500

## POST /api/admin/opportunities/:id/request-changes
- Auth required: ADMIN or SUPER_ADMIN
- Request params: `id` (ObjectId)
- Request body: { changes_requested: string (required) }
- Success: 200 { message: string, data: { opportunity: FreelanceOpportunity } }
- Errors: 400 (validation), 401, 403, 404, 500

## POST /api/admin/opportunities/:id/notes
- Auth required: ADMIN or SUPER_ADMIN
- Request params: `id` (ObjectId)
- Request body: { note_text: string (required) }
- Success: 201 { message: string, data: { note: OpportunityNote } }
- Errors: 400 (validation), 401, 403, 404, 500

## POST /api/admin/opportunities/bulk-approve
- Auth required: ADMIN or SUPER_ADMIN
- Request body: { opportunity_ids: [ObjectId] (required) }
- Success: 200 { message: string, data: { approved_count: number } }
- Errors: 400 (validation), 401, 403, 500
