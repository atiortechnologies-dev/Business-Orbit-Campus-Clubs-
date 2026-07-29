# Phase 1 Context: Phase 2: Admin Profile, Security & Notifications

## Global Project Guidelines
- Access to `/api/admin/settings/*` is strictly restricted to authenticated users with `ADMIN` or `SUPER_ADMIN` roles.
- Destructive/Critical settings (e.g., logout-all-devices) require explicit `SUPER_ADMIN` privileges.

## Phase-Specific Requirements
### Settings & Platform Configuration
**Purpose:** Manage administrator profiles, global platform configuration toggles, system notification channels, security parameters, active sessions, and system maintenance actions.

**Backend Logic:**
- Updates system settings across 4 distinct domains: Administrator Profile, Platform Configuration, Admin Notifications, and Security & Access.

**Data to Save:**
- `PUT /api/admin/settings/profile` — Update admin name, phone, designation.
- `PUT /api/admin/settings/notifications` — Update event notification channel preferences.
- `POST /api/admin/settings/change-password` — Change password.
- `POST /api/admin/settings/logout-all-devices` — Revoke active sessions.

**Database Structure:**
### AdminNotificationSetting
- `user_id` (ObjectId, ref: User)
- `event_category` (String)
- `in_app_enabled` (Boolean)
- `email_enabled` (Boolean)

### UserSession
- `user_id` (ObjectId, ref: User)
- `device_name` (String)
- `os_browser` (String)
- `ip_address` (String)
- `refresh_token_hash` (String)
- `is_current` (Boolean)
- `last_active_at` (Date)

## Resolved Clarifications (Relevant to This Phase)
- Only `logout-all-devices` requires `SUPER_ADMIN`.

## Schema Context
Schema map not yet generated. This phase will create it.

## Shared Utilities Available
No shared utilities registered yet.

## API Contracts from Previous Phases
None
