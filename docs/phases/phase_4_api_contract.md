# Phase 4 API Contract: Logout All Devices (Preserving Current Session)

## POST /api/admin/settings/logout-all-devices
- **Auth required**: Yes (JWT Bearer Token, SUPER_ADMIN / ADMIN)
- **Headers**:
  - `Authorization`: `Bearer <jwt_token>` (required)
- **Request Body**: `{}` (None required)
- **Behavior**:
  - Identifies target user from `req.user.id` or `req.user._id`.
  - Obtains current token/session from `req.headers.authorization` or `req.token` or current session identifier.
  - Revokes/deletes all active `UserSession` records for the user EXCEPT the current session token.
  - Logs audit entry `ALL_SESSIONS_REVOKED` in `AuditLog`.
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "All other devices logged out successfully",
    "data": {
      "revokedCount": 2
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: `{ "success": false, "message": "Unauthorized access" }`
  - `403 Forbidden`: `{ "success": false, "message": "Requires SUPER_ADMIN role" }`
  - `500 Internal Server Error`: `{ "success": false, "message": "Failed to logout all devices", "error": "..." }`
