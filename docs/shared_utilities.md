# Shared Utilities (Batch 3)

## 1. Audit Logger Service
A centralized logging utility to emit records to the `AuditLog` table.
- Function signature: `logAudit(actor, module, action, targetEntityId, targetEntityName, status, ipAddress, details)`
- Ensures immutability (no delete/update functions provided).
- Should be used across all controllers in Batch 3.

## 2. Maintenance Mode Middleware
An Express middleware to check the `PlatformSetting.maintenance_mode` toggle.
- If true, blocks all non-admin routes with a 503 Service Unavailable response.

## 3. RBAC Middleware (ADMIN vs SUPER_ADMIN)
Role-based access control middleware to restrict certain routes to SUPER_ADMIN only.
- e.g., `requireRole(['SUPER_ADMIN'])` vs `requireRole(['ADMIN', 'SUPER_ADMIN'])`

## 4. Session Revocation Utility
A function to invalidate or delete sessions from `UserSession` table, used during logout, sign-out all devices, and password changes.
