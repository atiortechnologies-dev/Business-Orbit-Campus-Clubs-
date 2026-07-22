/**
 * @file test_socket.js
 * @description Standalone test script for verifying Socket.IO authentication middleware.
 * @architecture Uses dependency injection and mocked objects to test socket events and JWT verification.
 */

const assert = require("assert");

// 1. Mock Socket.IO Server
class MockServer {
  constructor(server, options) {
    this.server = server;
    this.options = options;
    this.middlewares = [];
    this.events = {};
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  on(event, handler) {
    this.events[event] = handler;
  }
}

// 2. Mock jwt
const mockJwt = {
  verify: (token) => {
    if (token === "valid_token") return { id: "user123" };
    throw new Error("Invalid token");
  },
};

// 3. Dependency Injection Simulation
// Since proxyquire might not be installed, we will just manually test the logic by injecting mocks.

// Let's just simulate the logic of socket.js to verify we didn't make syntax errors.

// Overriding require cache for socket.io and jsonwebtoken
const Module = require("module");
const originalRequire = Module.prototype.require;
Module.prototype.require = function () {
  if (arguments[0] === "socket.io") return { Server: MockServer };
  if (arguments[0] === "jsonwebtoken") return mockJwt;
  return originalRequire.apply(this, arguments);
};

// Now re-require to pick up mocks
delete require.cache[require.resolve("../utils/socket")];
const socketModule = require("../utils/socket");

console.log("Running Socket.IO logic test...\n");

try {
  const io = socketModule.configureSocket({});
  assert.ok(io, "Should return an io instance");
  assert.strictEqual(
    io.middlewares.length,
    1,
    "Should have 1 middleware registered (auth)",
  );
  assert.ok(io.events["connection"], "Should register connection event");

  // Test Middleware logic
  const middleware = io.middlewares[0];

  // No token
  middleware({ handshake: { auth: {} } }, (err) => {
    assert.strictEqual(
      err.message,
      "Authentication error: Token missing",
      "Should fail if no token",
    );
  });

  // Invalid token
  middleware({ handshake: { auth: { token: "invalid" } } }, (err) => {
    assert.strictEqual(
      err.message,
      "Authentication error: Invalid token",
      "Should fail if invalid token",
    );
  });

  // Valid token
  const mockSocket = { handshake: { auth: { token: "valid_token" } } };
  middleware(mockSocket, (err) => {
    assert.strictEqual(err, undefined, "Should pass with valid token");
    assert.strictEqual(
      mockSocket.user.id,
      "user123",
      "Should attach decoded user to socket",
    );
  });

  console.log("✅ Middleware auth tests passed");

  // We verified the auth and event registration.
  console.log("\n✅ All Socket logic tests passed");
} catch (err) {
  console.error("❌ Test failed:", err.message);
  process.exit(1);
} finally {
  Module.prototype.require = originalRequire; // restore
}
