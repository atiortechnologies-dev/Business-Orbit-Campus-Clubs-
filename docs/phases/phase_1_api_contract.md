# Phase 1 API Contract

## PUT /api/admin/settings/profile
- Auth required: ADMIN or SUPER_ADMIN
- Request body: { name: string, phone: string, designation: string }
- Success: 200 { message: "Profile updated successfully", data: { ... } }
- Errors: 400, 401, 500

## PUT /api/admin/settings/notifications
- Auth required: ADMIN or SUPER_ADMIN
- Request body: { notifications: [{ event_category: string, in_app_enabled: boolean, email_enabled: boolean }] }
- Success: 200 { message: "Notifications updated successfully", data: { ... } }
- Errors: 400, 401, 500

## GET /api/admin/settings/login-history
- Auth required: ADMIN or SUPER_ADMIN
- Request body: none
- Success: 200 { message: "Login history retrieved", data: { history: [...] } }
- Errors: 401, 500

## POST /api/admin/settings/logout-all-devices
- Auth required: SUPER_ADMIN
- Request body: none
- Success: 200 { message: "Successfully logged out of all other devices" }
- Errors: 401, 403, 500

## GET /api/admin/settings/download-system-logs
- Auth required: SUPER_ADMIN
- Request body: none
- Success: 200 stream/file download
- Errors: 401, 403, 500

## POST /api/admin/settings/change-password
- Auth required: ADMIN or SUPER_ADMIN
- Request body: { currentPassword: string (required), newPassword: string (required) }
- Success: 200 { message: "Password changed successfully" }
- Errors: 400, 401, 500
