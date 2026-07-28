# Backend Coding Conventions & Standards

This document summarizes the coding conventions, architectural standards, and implementation patterns observed across the Backend codebase.

---

## 1. Overview & Architectural Stack

- **Runtime & Framework**: Node.js with Express 5 (`v5.2.1`).
- **Database / ODM**: MongoDB managed via Mongoose (`v9.7.4`).
- **Module System**: CommonJS (`"type": "commonjs"`, using `require`/`module.exports`).
- **Validation**: Zod schema validation (`v4.4.3`).
- **Security & Auth**: Argon2 for password hashing (`argon2`), JWT for authentication (`jsonwebtoken`).
- **Architecture Style**: Layered architecture separating concerns across Routes, Middlewares, Controllers, Models, Services, and Utilities.

```
Routes  ──>  Middlewares (Auth, Validation)  ──>  Controllers  ──>  Services / Models
```

---

## 2. File Documentation & Header Standard

All source code files strictly follow a standard JSDoc header annotation structure:

```javascript
/**
 * @file filename.js
 * @description Concise explanation of the module's core purpose.
 * @architecture Architectural role within the application design.
 */
```

### In-Code Documentation
- **Controllers**: Documented with `@desc`, `@route`, `@access` (e.g., `Private (Admin)`, `Public`), and `@param`.
- **Middlewares**: Function-level JSDoc explaining input parameters and injected context.
- **Utils/Services**: Function-level JSDoc detailing utility contracts and side-effects.

---

## 3. Asynchronous Code & Error Handling

### Asynchronous Handler Pattern (`asyncHandler`)
Async controller methods are wrapped using the `asyncHandler` utility (`middlewares/asyncHandler.js`). This eliminates repetitive `try/catch` blocks by catching rejected promises and passing errors directly to `next(err)`.

```javascript
// Function wrapper pattern
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage in controllers
exports.getApplicants = asyncHandler(async (req, res) => {
  // Async operations proceed cleanly without manual try/catch
});
```

### Manual `try/catch` Exception Handling
Explicit `try/catch` blocks are reserved for operations requiring specific error intercepting:
- **Zod Validation Interception**: Intercepting `ZodError` to format field-level validation responses.
- **Database Transactions**: Catching errors inside transaction blocks to execute `session.abortTransaction()` before forwarding the error with `throw error` or `next(error)`.

### Global Error Handler (`middlewares/errorHandler.js`)
Centralized error middleware handles and formats all operational and unhandled exceptions:
- **Duplicate Key Error (`err.code === 11000`)**: Formats error into HTTP `409 Conflict` returning `{ success: false, message: "<field> already exists" }`.
- **Mongoose `ValidationError`**: Formats schema validation failures into HTTP `400 Bad Request` with an array of error messages.
- **Default Error Handling**: Returns `err.statusCode || 500` with `{ success: false, message: err.message || "Internal Server Error" }`.
- **404 Route Handler**: Fallback middleware `notFound` handles undefined endpoints with HTTP `404 Not Found`.

---

## 4. Request Validation Patterns

Validation rules are decoupled from route handlers and declared using Zod schemas (`utils/validators.js`, `utils/adminValidators.js`).

### Interceptor Middleware (`middlewares/validateRequest.js`)
Request payloads are validated prior to reaching controllers using `validateRequest(schema, source)`:

```javascript
const validateRequest = (schema, source = "body") => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "root",
      message: issue.message,
    }));
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }
  req.validatedData = result.data;
  next();
};
```

### Schema Features
- **Discriminated Unions**: Used for role-based registration (`student`, `mentor`, `investor`, `incubator`, `company`), enabling strict, role-specific field requirements.
- **Custom Preprocessing & Refinements**: String preprocessing (e.g., splitting comma-separated arrays or parsing JSON arrays) and custom match refinements (e.g., checking matching passwords or LinkedIn URL domains).

---

## 5. API Response Formatting

All API endpoints maintain a uniform response structure across success and error states.

### Success Format
```json
{
  "success": true,
  "data": { ... },
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10
  }
}
```

### Error Format
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

---

## 6. Authentication & Authorization Patterns

- **JWT Authentication (`middlewares/authMiddleware.js`)**:
  - `protect` middleware parses `Authorization: Bearer <token>`.
  - Verifies token via `utils/token.js` and injects user profile context into `req.user`.
- **Role-Based Access Control (RBAC)**:
  - `requireRole(role)` higher-order middleware checks `req.user.role` against required permission levels.
- **Password Security (`utils/password.js`)**:
  - Hashing and verification performed via `argon2`.
- **Token Refresh Flow**:
  - `verifyRefreshTokenMiddleware` validates refresh tokens and re-issues access tokens.

---

## 7. Data Modeling & Database Conventions

### Schema Design
- **Field Naming**: Strict `snake_case` (e.g., `full_name`, `password_hash`, `email_verified`, `student_id`).
- **Timestamps**: Explicit Mongoose timestamp mapping: `{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }`.
- **Field Hiding**: Sensitive fields (`password_hash`, `otp_code_hash`, `otp_expires_at`) use `select: false` by default.
- **Indexes**: Full-text search indexes (`userSchema.index({ full_name: "text" })`) and sparse unique indexes (`phone`).

### Mongoose Transactions
Multi-document database mutations (such as updating application status and generating notifications) use explicit Mongoose sessions and transactions:

```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  // Multi-document writes passed { session }
  await application.save({ session });
  await ApplicantStatus.create([{ ... }], { session });
  await Notification.create([{ ... }], { session });
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

### Cascading Deletions (`services/cascadeService.js`)
Mongoose middleware hooks on model deletion (`findOneAndDelete`, `deleteOne`) automatically invoke the central `cascadeService` to maintain referential integrity across related documents (profiles, applications, stages, chat rooms, messages).

---

## 8. Code Modularity & DRY Patterns

- **Generic Resource Controllers**: Generic factory functions (`createResource`, `updateResource`, `deleteResource`) in `admin.controller.js` eliminate redundant CRUD implementation across dynamic administrative entities.
- **Centralized Service Layer**: Core business logic spans dedicated services (`cascadeService.js`, `chatRoomService.js`).
- **Constants**: Domain enums and stage metadata are centralized in `constants/statusConstants.js`, `utils/roleConfig.js`, and `utils/stageDefinitions.js`.
