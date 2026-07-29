# Database Schema Map

## Entity Relationship Overview
PlatformSetting -> No foreign keys. It acts as a singleton for system-wide configs.

## Models Scaffolded
| Model | File | Fields | References | Status Enum |
|-------|------|--------|------------|-------------|
| PlatformSetting | Backend/models/PlatformSetting.js | platform_name, logo_url, support_email, timezone, allow_new_registrations, require_email_verification, maintenance_mode, public_profiles_visible | — | — |

## Cascade Rules
- None needed for PlatformSetting.
