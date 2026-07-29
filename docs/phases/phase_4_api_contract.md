# Phase 4 API Contract: Notifications and Activity Logging API

## GET /api/admin/audit-log
- Auth required: Yes (ADMIN, SUPER_ADMIN)
- Query parameters: timeframe (string), module (string), user (string), page (number), limit (number)
- Success: 200 { success: boolean, data: { auditLogs: [...], pagination: {...} } }
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## GET /api/admin/audit-log/pulse
- Auth required: Yes (ADMIN, SUPER_ADMIN)
- Request body: None
- Success: 200 { success: boolean, data: { pulse: [...] } } / SSE stream
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## GET /api/admin/audit-log/volume-trend
- Auth required: Yes (ADMIN, SUPER_ADMIN)
- Request body: None
- Success: 200 { success: boolean, data: { trend: [...] } }
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## GET /api/admin/audit-log/export
- Auth required: Yes (ADMIN, SUPER_ADMIN)
- Request body: None
- Success: 200 (CSV File Stream)
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## PUT /api/admin/settings/profile
- Auth required: Yes (ADMIN, SUPER_ADMIN)
- Request body: { full_name: string, phone: string, designation: string }
- Success: 200 { success: boolean, message: string, data: { profile: object } }
- Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 500 (server error)

## PUT /api/admin/settings/notifications
- Auth required: Yes (ADMIN, SUPER_ADMIN)
- Request body: { notifications: [ { event_category: string, in_app_enabled: boolean, email_enabled: boolean } ] }
- Success: 200 { success: boolean, message: string, data: { notifications: [...] } }
- Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 500 (server error)

## GET /api/admin/settings/login-history
- Auth required: Yes (ADMIN, SUPER_ADMIN)
- Request body: None
- Success: 200 { success: boolean, data: { sessions: [...] } }
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## POST /api/admin/settings/logout-all-devices
- Auth required: Yes (SUPER_ADMIN)
- Request body: None
- Success: 200 { success: boolean, message: string }
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## GET /api/admin/settings/download-system-logs
- Auth required: Yes (SUPER_ADMIN)
- Request body: None
- Success: 200 (File Stream)
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## POST /api/admin/settings/change-password
- Auth required: Yes (ADMIN, SUPER_ADMIN)
- Request body: { current_password: string, new_password: string }
- Success: 200 { success: boolean, message: string }
- Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 500 (server error)
