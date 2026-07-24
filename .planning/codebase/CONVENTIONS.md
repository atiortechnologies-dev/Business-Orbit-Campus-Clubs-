# Codebase Conventions & Standards

This document outlines the coding standards, architectural patterns, naming conventions, formatting rules, and quality practices enforced across the Business Orbit Campus Clubs (BOCC) codebase (Backend and Frontend applications).

---

## 1. Codebase Architecture & Modular Organization

The repository is structured into a Node.js/Express backend service and six specialized React web applications built with Vite.

```
/
├── Backend/                    # Node.js/Express REST API (CommonJS)
│   ├── config/                 # DB & CORS configuration
│   ├── constants/              # System-wide status & enum constants
│   ├── controllers/            # Request handlers (named *.controller.js)
│   ├── middlewares/            # Auth, Zod validation, error handling
│   ├── models/                 # Mongoose schemas (PascalCase *.js)
│   ├── routes/                 # Express router declarations (*.routes.js)
│   ├── services/               # Core business logic & cascade deletions
│   ├── tests/                  # Jest & Supertest integration suite
│   ├── utils/                  # Utility modules (token, email, hash, etc.)
│   ├── eslint.config.js        # ESLint 10 Flat Configuration
│   └── jest.config.js          # Jest test runner setup
└── Frontend/                   # Web Applications (ES Modules)
    ├── BOCC Companies/         # Company / Corporate Portal (JS/Vite/Tailwind)
    ├── BOCC Incubator/         # Incubator / Accelerator Portal (JS/Vite)
    ├── BOCC Investor/          # Investor Platform (TS/Vite/Tailwind v4)
    ├── BOCC Main/              # Main Landing & Platform (JS/TS/Vite)
    ├── BOCC Mentor/            # Mentor Management System (JS/Vite)
    └── BOCC Student/           # Student & Startup Portal (JS/Vite)
```

### Module Systems
- **Backend**: Uses **CommonJS** (`require` / `module.exports`).
- **Frontend Apps**: Use **ES Modules** (`import` / `export`).

---

## 2. Naming Conventions

### File & Directory Naming

| Layer / Scope | Convention | Examples |
| :--- | :--- | :--- |
| **Backend Controllers** | `camelCase.controller.js` | `auth.controller.js`, `companyApplication.controller.js`, `investorDiscovery.controller.js` |
| **Backend Models** | `PascalCase.js` | `User.js`, `StudentProfile.js`, `StageSubmission.js`, `ActivityLog.js` |
| **Backend Routes** | `camelCase.routes.js` | `auth.routes.js`, `student.routes.js`, `mentor.routes.js`, `admin.routes.js` |
| **Backend Middlewares** | `camelCase.js` | `authMiddleware.js`, `validateRequest.js`, `asyncHandler.js`, `errorHandler.js` |
| **Backend Services / Utils**| `camelCase.js` | `cascadeService.js`, `roleConfig.js`, `password.js`, `validators.js` |
| **Backend Tests** | `*.test.js`, `*.transactions.test.js` | `admin.test.js`, `auth.test.js`, `submission.transactions.test.js` |
| **Frontend Components** | `PascalCase.jsx` / `PascalCase.tsx` | `Hero.jsx`, `ProtectedRoute.jsx`, `Accordion.jsx`, `FAQ.tsx` |
| **Frontend Hooks** | `usePascalCase.js` or `useCamelCase.js` | `use-toast.js`, `useAuth.js` |
| **Frontend Utilities** | `camelCase.js` or `kebab-case.js` | `utils.js`, `cn.js` |

### Code Identifiers & Schemas

- **Database Fields & API Schemas**: `snake_case` is strictly enforced for MongoDB document schemas and returned API objects (e.g. `full_name`, `password_hash`, `account_status`, `email_verified`, `created_at`, `updated_at`, `startup_id`, `user_id`).
- **JavaScript Variables & Functions**: `camelCase` for functions, local variables, instance variables, and parameter names (e.g. `testFaq`, `validApiKey`, `deleteUserDependencies`).
- **React Components & Types**: `PascalCase` for React functional components, TypeScript interfaces, and types (e.g. `AuthLayout`, `UserNotRegisteredError`).
- **Constants**: `UPPER_SNAKE_CASE` for global configuration values and constants (e.g. `ADMIN_API_KEY`, `STATUS_CONSTANTS`).

---

## 3. Code Style, Documentation, & Metadata Headers

### Top-of-File JSDoc Header Block
Every major backend file (`controller`, `model`, `route`, `middleware`, `service`, `test`) starts with a top-level `@file`, `@description`, and `@architecture` block:

```javascript
/**
 * @file auth.controller.js
 * @description Manages user authentication and registration flows including OTP, JWT generation, and profile initialization.
 * @architecture Relies on transactional operations to create User and profile records simultaneously.
 */
```

### Route Docstrings
Controllers decorate each handler function with concise `@desc`, `@route`, and `@access` metadata:

```javascript
/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => { ... });
```

---

## 4. Linting & Formatting Standards

### Backend ESLint Configuration (`eslint.config.js`)
- Uses ESLint flat configuration format (`@eslint/js`).
- ECMAScript version set to `2022`, source type `commonjs`.
- Environment globals include `globals.node` and `globals.jest`.
- Unused variables rule requires leading underscores for ignored parameters (`varsIgnorePattern: "^_"`, `argsIgnorePattern: "^_"`).

### Frontend ESLint Configurations
- Uses ESLint 9 flat configs with `eslint-plugin-react`, `eslint-plugin-react-hooks`, and `eslint-plugin-unused-imports`.
- Ignores UI component primitives (`src/components/ui/**/*`, `src/lib/**/*`) to allow third-party utility flexibility.
- Standard React rules enabled: `react-hooks/rules-of-hooks: "error"`, `unused-imports/no-unused-imports: "error"`.

---

## 5. Architectural & Design Patterns

### 1. Controller Request Handling (`asyncHandler`)
Controllers avoid repetitive `try-catch` blocks by wrapping async middleware in `asyncHandler`:

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

### 2. Request Payload Validation (`zod` + `validateRequest`)
Incoming request payloads (body, query, params) are validated using Zod schemas via `validateRequest(schema)` middleware. Validated data is attached to `req.validatedData`:

```javascript
router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register
);
```

### 3. Uniform API Response Format
All HTTP responses return standardized JSON payloads:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses match the standard format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email address" }
  ]
}
```

### 4. Mongoose Multi-Document Transactions
Operations that create or update multiple related models (such as `User` creation alongside a role-specific profile like `StudentProfile`) are wrapped in Mongoose sessions with explicit commit/abort lifecycle management:

```javascript
const session = await mongoose.startSession();
session.startTransaction();
try {
  await user.save({ session });
  await new StudentProfile({ user_id: user._id, ...profileData }).save({ session });
  await session.commitTransaction();
  session.endSession();
} catch (error) {
  await session.abortTransaction();
  session.endSession();
  throw error;
}
```

### 5. Cascading Deletions (`cascadeService`)
To maintain referential integrity without orphan records, Mongoose `post` middleware hooks trigger centralized dependency wipes via `cascadeService`:

```javascript
userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await cascadeService.deleteUserDependencies(doc._id);
  }
});
```

---

## 6. Security & Authentication Standards

- **Password Hashing**: Uses `argon2` (`hashPassword` / `comparePassword`).
- **Tokens**: Dual JWT implementation with short-lived `accessToken` and `refreshToken`.
- **Protected Routes**: Enforced via `authMiddleware` / `requireAuth` and API key headers (`x-api-key` via `adminAuth`).
- **Hidden Fields**: Sensitive fields (`password_hash`, `otp_code_hash`, `otp_expires_at`) are configured with `{ select: false }` in Mongoose schemas.
