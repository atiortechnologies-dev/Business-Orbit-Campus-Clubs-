# Backend Testing Strategy & Standards

This document outlines the testing architecture, framework configuration, suite organization, and execution patterns in the Backend codebase.

---

## 1. Framework & Tooling Stack

- **Testing Framework**: Jest (`v30.4.2`).
- **HTTP Assertion Library**: Supertest (`v7.2.2`).
- **Environment Management**: `cross-env` (`v10.1.0`) for cross-platform environment variable configuration.
- **Database Engine**: Standalone MongoDB test database instance (dynamic URI derivation with `_test` database naming).

---

## 2. Test Configuration & Scripts

### Configuration File (`jest.config.js`)
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

### NPM Test Script (`package.json`)
```json
"test": "cross-env NODE_ENV=test JWT_SECRET=testsecret JWT_REFRESH_SECRET=testrefreshsecret jest --detectOpenHandles --coverage --runInBand"
```

- `--detectOpenHandles`: Identifies unclosed sockets, database connections, or timers preventing clean process exit.
- `--coverage`: Automatically generates test coverage reports on each test run.
- `--runInBand`: Executes test suites sequentially in a single process to prevent database race conditions across isolated test files.

---

## 3. Global Setup & Teardown Lifecycle (`tests/setup.js`)

Test database setup and isolation are managed centrally in `tests/setup.js`:

```javascript
beforeAll(async () => {
  // 1. Ensure existing connections are closed
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  // 2. Derive isolated test database URI
  let uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project_test_db";
  if (uri.includes("mongodb+srv")) {
    uri = uri.replace(/\/([^/?]+)(\?|$)/, "/$1_test$2");
  } else if (!uri.includes("test")) {
    const parts = uri.split("/");
    const dbName = parts.pop();
    uri = [...parts, dbName + "_test"].join("/");
  }

  await mongoose.connect(uri);

  // 3. Drop existing test database
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
  }

  // 4. Initialize schema indexes to prevent WriteConflicts during transactions
  await Promise.all(
    Object.values(mongoose.models).map((model) => model.init())
  );
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
}, 15000);
```

---

## 4. Test Suite Organization & Directory Layout

Tests are grouped into root integration tests and controller-level unit/integration suites.

```
tests/
├── admin.test.js                             # Admin endpoints & FAQ management
├── auth.test.js                              # Registration, login, OTP verification
├── public.test.js                            # Public FAQs, stats, contact form
├── models.test.js                            # Mongoose schema validations
├── cascadeDelete.integration.test.js         # Integration test for cascade deletion service
├── cascadeDelete.comprehensive.test.js        # Deep cascade graph assertions
├── fullJourney.integration.test.js           # End-to-end user lifecycle verification
├── integration.test.js                       # Cross-cutting integration tests
├── setup.js                                  # Global Jest setup/teardown hook
└── controllers/                              # Controller unit & integration tests
    ├── chapter.test.js
    ├── companyApplication.test.js
    ├── companyApplication.transactions.test.js  # Isolation test for multi-doc rollbacks
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

---

## 5. Core Testing Patterns & Strategies

### 1. HTTP Endpoint Testing (Supertest)
Routes and controllers are tested end-to-end using `supertest`, mounting the Express application stack along with middleware:

```javascript
const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/auth.routes");
const { errorHandler } = require("../middlewares/errorHandler");

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

it("should register a student successfully", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      full_name: "John Doe",
      email: "newstudent@example.com",
      password: "Password123!",
      confirm_password: "Password123!",
      role: "student",
      college: "Tech University",
      degree: "B.Sc Computer Science",
      graduation_year: 2026,
    });
  expect(res.statusCode).toBe(201);
  expect(res.body.success).toBe(true);
});
```

### 2. External Dependency Mocking
External integrations such as email sending (`nodemailer`) are mocked using `jest.mock()` to prevent side effects during testing:

```javascript
jest.mock("../utils/email", () => ({
  generateOTP: jest.fn(() => "123456"),
  sendOTPEmail: jest.fn().mockResolvedValue(true),
  sendEmail: jest.fn().mockResolvedValue(true),
}));
```

### 3. Mongoose Transaction Rollback Verification
Transaction-focused tests (`*.transactions.test.js`) verify that multi-document updates roll back state completely if any step fails.

#### Pre-Creating Collections
To prevent MongoDB catalog change errors (`Cannot run transaction on non-existing collection`), required collections are created explicitly in `beforeAll`:

```javascript
beforeAll(async () => {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const names = collections.map((c) => c.name);
  const required = ["applications", "applicantstatuses", "notifications", "opportunities"];
  for (const name of required) {
    if (!names.includes(name)) {
      await db.createCollection(name);
    }
  }
});
```

#### Simulating Failure & Verifying Rollback
```javascript
it("should rollback application status if notification creation fails", async () => {
  // Mock downstream notification failure
  jest.spyOn(Notification, "create").mockRejectedValueOnce(new Error("Simulated Failure"));

  await companyApplicationController.updateApplicationStatus(req, res, mockNext);

  // Assert error passed to error handler
  expect(mockNext).toHaveBeenCalled();

  // Assert target document remained in original state (rolled back)
  const reloadedApplication = await Application.findById(application._id);
  expect(reloadedApplication.application_status).toBe("applied");

  // Assert dependent document was not persisted
  const statuses = await ApplicantStatus.find({ application_id: application._id });
  expect(statuses.length).toBe(0);
});
```

### 4. Cascading Deletion Testing
Integration tests (`cascadeDelete.integration.test.js`) construct complex entity trees (User -> Profile -> Startup -> Stage -> Submission -> ChatRoom -> Message) and delete the root document to assert that all leaf documents are deleted.

```javascript
it("should cascade delete all dependencies when a User is deleted", async () => {
  await User.findByIdAndDelete(studentUser._id);

  expect(await User.findById(studentUser._id)).toBeNull();
  expect(await StudentProfile.findOne({ user_id: studentUser._id })).toBeNull();
  expect(await Startup.findOne({ student_id: studentUser._id })).toBeNull();
  expect(await StartupStage.findOne({ startup_id: startup._id })).toBeNull();
  expect(await ChatRoom.findOne({ student_id: studentUser._id })).toBeNull();
  expect(await Message.findOne({ chat_id: chatRoom._id })).toBeNull();
});
```

---

## 6. Coverage Targets & Metrics

The test suite covers:
- **Controllers**: Logic for application management, auth, startup workflows, mentor sessions, admin actions.
- **Middlewares**: Auth token verification, role permissions, payload validation, global error handling.
- **Utilities**: Token generation/verification, Zod schemas, review processors, stage definitions.

Coverage data is saved to `coverage/` in multiple standard formats (`lcov`, `clover`, `json`, HTML).
