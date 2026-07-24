# Testing Frameworks, Practices, and Coverage

This document describes the testing architecture, configurations, test execution workflows, and testing conventions across the Business Orbit Campus Clubs (BOCC) codebase.

---

## 1. Overview & Current Testing Status

| Scope | Testing Framework | Status | Summary |
| :--- | :--- | :--- | :--- |
| **Backend** (`Backend/`) | **Jest** + **Supertest** | **Fully Configured & Automated** | Includes 30+ test suites covering controllers, Mongoose transactions, cascading deletes, API routes, and full user integration flows. |
| **Frontend** (`Frontend/`) | None | **Not Configured** | Frontend apps currently rely on manual verification. No Vitest, Jest, or E2E frameworks installed. |

---

## 2. Backend Testing Stack & Configuration

### Framework & Tooling

- **Test Runner**: Jest (`^30.4.2`)
- **HTTP/API Assertion**: Supertest (`^7.2.2`)
- **Environment Management**: `cross-env` (`^10.1.0`)
- **Database**: MongoDB / Mongoose (Connects to a dedicated isolated test database `mongodb://127.0.0.1:27017/project_test_db` or dynamically appends `_test` to `MONGODB_URI`).

### Execution Commands

All backend tests are run from the `Backend/` directory:

```bash
cd Backend

# Execute the complete automated test suite with coverage
npm test

# Run a specific test file
npx jest tests/admin.test.js

# Run tests matching a specific pattern
npx jest tests/controllers/auth.test.js
```

### Test Command Breakdown

The `package.json` test script executes:

```bash
cross-env NODE_ENV=test JWT_SECRET=testsecret JWT_REFRESH_SECRET=testrefreshsecret jest --detectOpenHandles --coverage --runInBand
```

Key flags explained:
- `cross-env`: Sets test environment variables (`NODE_ENV=test`, test secret keys) across OS environments.
- `--detectOpenHandles`: Identifies async operations or sockets that failed to close properly during test execution.
- `--coverage`: Collects line, branch, and function code coverage.
- `--runInBand`: Executes test suites serially in a single worker process. This is **critical** to prevent race conditions and transaction conflicts when executing Mongoose database operations against MongoDB.

---

## 3. Jest Configuration (`Backend/jest.config.js`)

```javascript
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  collectCoverageFrom: [
    "controllers/**/*.js",
    "utils/**/*.js",
    "middlewares/**/*.js",
  ],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 30000,
};
```

---

## 4. Test Lifecycle & Setup (`Backend/tests/setup.js`)

Database state and connection teardown are managed globally before and after test runs:

1. **Before All Tests (`beforeAll`)**:
   - Disconnects any active Mongoose instance.
   - Computes isolated test database URI (`*_test`).
   - Drops any existing test database (`dropDatabase()`).
   - Re-builds all schema indexes (`model.init()`) across registered Mongoose models to prevent MongoDB `WriteConflict` errors during transactional tests.
2. **After All Tests (`afterAll`)**:
   - Drops the test database.
   - Closes the Mongoose connection cleanly.

---

## 5. Test Suite Directory Layout & Categories

Backend tests are organized under `Backend/tests/`:

```
Backend/tests/
├── setup.js                                 # Global DB setup & teardown
├── admin.test.js                            # Admin route & API key tests
├── auth.test.js                             # Auth flows (register, login, OTP)
├── cascadeDelete.comprehensive.test.js      # Full graph cascading delete tests
├── cascadeDelete.integration.test.js        # Mongoose post-hook cascade tests
├── fullJourney.integration.test.js          # Multi-role workflow tests
├── integration.test.js                      # Core route integration suite
├── models.test.js                           # Model validation & schema tests
├── public.test.js                           # Public landing page route tests
├── test_models_standalone.js                # Standalone model verification
├── test_socket.js                           # Socket.io connection checks
└── controllers/                             # Controller-specific unit/integration tests
    ├── chapter.test.js
    ├── companyApplication.test.js
    ├── companyApplication.transactions.test.js
    ├── dashboard.test.js
    ├── investorDiscovery.test.js
    ├── investorDiscovery.transactions.test.js
    ├── meeting.test.js
    ├── mentorDashboard.test.js
    ├── mentorMeeting.test.js
    ├── mentorProfile.test.js
    ├── mentorRequest.test.js
    ├── mentorRequest.transactions.test.js
    ├── onboarding.test.js
    ├── profile.test.js
    ├── resource.test.js
    ├── review.test.js
    ├── startup.test.js
    ├── startupProgress.test.js
    ├── submission.test.js
    └── submission.transactions.test.js
```

### Key Test Categories

#### A. Controller Tests (`tests/controllers/*.test.js`)
Tests individual controller endpoints, request validation rules (Zod schemas), and HTTP status response codes using Supertest.

#### B. Transaction Tests (`*.transactions.test.js`)
Specifically test Mongoose session transactions. They verify that if an error occurs mid-operation (e.g. invalid profile payload during user registration), the transaction aborts and rolls back all database modifications atomically.

#### C. Cascading Deletion Tests (`cascadeDelete.*.test.js`)
Validates that deleting a parent entity (`User` or `Startup`) automatically cleans up dependent models (e.g., student profiles, chat rooms, pitch views, recruiter notes, applications) via `cascadeService`.

#### D. Full Journey Integration Tests (`fullJourney.integration.test.js`)
Executes realistic user journeys across multiple roles (Student -> Mentor -> Investor -> Admin) to ensure end-to-end compatibility across services.

---

## 6. Testing Practices & Conventions

### Express App Instantiation in Tests
Tests instantiate a dedicated lightweight Express server instance per suite:

```javascript
const request = require("supertest");
const express = require("express");
const adminRoutes = require("../routes/admin.routes");
require("./setup");

const app = express();
app.use(express.json());
app.use("/api/admin", adminRoutes);
```

### Standard Test Structure
Suites use standard Jest `describe`, `it` / `test`, `beforeEach`, and `afterEach` blocks:

```javascript
describe("POST /api/admin/faqs", () => {
  it("should fail with invalid payload (missing answer)", async () => {
    const payload = { question: "Test Q?", pageType: "Student" };
    const res = await request(app)
      .post("/api/admin/faqs")
      .set("x-api-key", "test-secret-key")
      .send(payload);

    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });
});
```

---

## 7. Frontend Testing Gap & Roadmap

### Current Status
The Frontend applications (`BOCC Companies`, `BOCC Incubator`, `BOCC Investor`, `BOCC Main`, `BOCC Mentor`, `BOCC Student`) currently lack automated test frameworks.

### Recommended Implementation Roadmap
1. **Unit & Component Testing**: Integrate **Vitest** and **React Testing Library** (`@testing-library/react`) into Vite applications.
2. **E2E Integration Testing**: Introduce **Playwright** or **Cypress** for automated end-to-end user flow testing across portals.
