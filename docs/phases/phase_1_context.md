# Phase 1 Context: Core Platform Configuration & Toggles (PlatformSetting, GET/PUT settings, Maintenance Mode Middleware)

## Global Project Guidelines
- Access to `/api/admin/audit-log/*` and `/api/admin/settings/*` is strictly restricted to authenticated users with `ADMIN` or `SUPER_ADMIN` roles.
- Destructive/Critical settings (e.g., Sign Out of All Devices, Maintenance Mode, Export Config JSON) require explicit `SUPER_ADMIN` privileges.
- Immutable Audit Trail: Audit log entries are strictly append-only. No API or user action (including `SUPER_ADMIN`) can modify or delete existing records in the `AuditLog` table.
- Maintenance Mode Locking: When `maintenance_mode` is set to true, non-admin platform login requests are blocked and return a 503 Service Unavailable response.

## Phase-Specific Requirements
### Screen 16: Settings & Platform Configuration
**Backend Logic:**
- Updates system settings across 4 distinct domains: Administrator Profile, Platform Configuration, Admin Notifications, and Security & Access.
- Handles image upload for avatar and platform logo (validates image mime-type, max size 5MB, uploads to S3/storage).

**Data to Save:**
- `PUT /api/admin/settings/platform` — Update platform name, logo, support email, timezone, and functional toggles.
- `GET /api/admin/settings` — Fetch all platform configuration, admin profile, and notification settings (we will do platform config part here).
- `GET /api/admin/settings/export-config` — Export platform config as JSON.

**Database Structure:**
### Table 2: PlatformSetting
- `id` (UUID, Primary Key)
- `platform_name` (VARCHAR, Default: 'BOCC Admin Portal')
- `logo_url` (VARCHAR)
- `support_email` (VARCHAR)
- `timezone` (VARCHAR)
- `allow_new_registrations` (BOOLEAN, Default: true)
- `require_email_verification` (BOOLEAN, Default: true)
- `maintenance_mode` (BOOLEAN, Default: false)
- `public_profiles_visible` (BOOLEAN, Default: true)
- `updated_at` (TIMESTAMP)

## Resolved Clarifications (Relevant to This Phase)
**Q2:** The PRD states 'Destructive/Critical settings require SUPER_ADMIN privileges' but doesn't map them explicitly to the Settings APIs. Which endpoints require SUPER_ADMIN vs standard ADMIN?
**A:** (Assumed Default) Only `export-config`, `download-system-logs`, `logout-all-devices`, and updating `platform` config require `SUPER_ADMIN`. Other APIs are accessible to standard `ADMIN`.

**Q3:** If two administrators attempt to update the Platform Settings simultaneously, how should the system handle concurrency?
**A:** (Assumed Default) Last-write-wins (the last request simply overwrites the previous changes).

## Schema Context
Schema map not yet generated. This phase will create it.

## Shared Utilities Available
No shared utilities registered yet.

## API Contracts from Previous Phases
None
