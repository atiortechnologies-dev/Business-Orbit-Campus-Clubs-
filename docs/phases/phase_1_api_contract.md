## PUT /api/admin/settings/platform
- Auth required: Yes (SUPER_ADMIN)
- Request body: { platform_name: string, logo_url: string, support_email: string, timezone: string, allow_new_registrations: boolean, require_email_verification: boolean, maintenance_mode: boolean, public_profiles_visible: boolean }
- Success: 200 { success: boolean, message: string, data: { platformSetting: object } }
- Errors: 400 (validation), 401 (unauthorized), 403 (forbidden), 500 (server error)

## GET /api/admin/settings
- Auth required: Yes (ADMIN, SUPER_ADMIN)
- Request body: None
- Success: 200 { success: boolean, data: { platformSetting: object } }
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)

## GET /api/admin/settings/export-config
- Auth required: Yes (SUPER_ADMIN)
- Request body: None
- Success: 200 { success: boolean, data: { config: object } }
- Errors: 401 (unauthorized), 403 (forbidden), 500 (server error)
