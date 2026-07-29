# Shared Utilities (Backend Batch 2)

## 1. RBAC Middleware
- `isAdmin`: Middleware to check if the user has `ADMIN` or `SUPER_ADMIN` privileges. Ensure this is applied to all `/api/admin/opportunities/*` and `/api/admin/chapters/*` routes.

## 2. Pagination Formatter
- `formatPaginatedResponse(data, page, limit, totalRecords)`: Utility to standardize the response envelope across all list endpoints:
  ```json
  {
    "data": [...],
    "page": 1,
    "limit": 10,
    "total_records": 100,
    "total_pages": 10
  }
  ```

## 3. Database Transaction Helper
- `withTransaction`: A helper to wrap database operations in a Mongoose session/transaction, especially critical for incrementing `total_registrations` with capacity checks.

## 4. Query Builder / Filters
- `buildSearchAndFilterQuery(req.query)`: Helper to extract common filters like `company_id`, `type`, `status`, `chapter_id`, and `date ranges` to build Mongoose query objects.
