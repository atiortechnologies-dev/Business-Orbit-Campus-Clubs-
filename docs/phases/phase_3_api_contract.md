# Phase 3 API Contract: System Audit Logging Engine

## GET /api/admin/audit-log
- Auth required: Yes (ADMIN or SUPER_ADMIN)
- Request query: { page: number (optional, default: 1), limit: number (optional, default: 10), timeframe: string (optional, e.g., '24h', '7d', '30d'), module: string (optional), user: string (optional ObjectId) }
- Success: 200 { data: { auditLogs: [ { _id: ObjectId, timestamp: Date, actor_id: ObjectId, actor_name: string, module: string, action: string, target_entity_id: string, target_entity_name: string, status: string, ip_address: string, details: object } ], total: number, page: number, totalPages: number } }
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## GET /api/admin/audit-log/pulse
- Auth required: Yes (ADMIN or SUPER_ADMIN)
- Request query: { limit: number (optional, default: 10) }
- Success: 200 { data: { pulse: [ { _id: ObjectId, timestamp: Date, actor_name: string, action: string, module: string } ] } }
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## GET /api/admin/audit-log/volume-trend
- Auth required: Yes (ADMIN or SUPER_ADMIN)
- Request query: None
- Success: 200 { data: { trend: [ { time: string, count: number } ] } }
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## GET /api/admin/audit-log/export
- Auth required: Yes (SUPER_ADMIN)
- Request query: { timeframe: string (optional), module: string (optional), user: string (optional) }
- Success: 200 (Returns a CSV file download, Content-Type: text/csv)
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)
