const test = require("node:test");
const assert = require("node:assert/strict");
const { csrfProtection, createRateLimiter } = require("../utils/security");

const response = () => ({ locals: {}, headers: {}, set(name, value) { this.headers[name] = value; } });

test("creates a CSRF token on safe requests", () => {
  const req = { method: "GET", session: {}, get: () => undefined };
  const res = response();
  let error;
  csrfProtection(req, res, (value) => { error = value; });
  assert.equal(error, undefined);
  assert.equal(req.session.csrfToken.length, 64);
  assert.equal(res.locals.csrfToken, req.session.csrfToken);
});

test("rejects unsafe requests without a matching CSRF token", () => {
  const req = { method: "POST", session: { csrfToken: "a".repeat(64) }, body: {}, get: () => undefined };
  let error;
  csrfProtection(req, response(), (value) => { error = value; });
  assert.equal(error.statusCode, 403);
});

test("rate limiter rejects requests beyond the configured limit", () => {
  const limiter = createRateLimiter({ windowMs: 1000, limit: 1, message: "Slow down" });
  const req = { ip: "127.0.0.1" };
  const res = response();
  let firstError;
  let secondError;
  limiter(req, res, (value) => { firstError = value; });
  limiter(req, res, (value) => { secondError = value; });
  assert.equal(firstError, undefined);
  assert.equal(secondError.statusCode, 429);
  assert.ok(res.headers["Retry-After"]);
});
