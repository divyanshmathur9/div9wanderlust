const crypto = require("crypto");
const ExpressError = require("./ExpressError");

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);

const verifyCsrfToken = (req, res, next) => {
  const supplied = req.body?._csrf || req.get("x-csrf-token");
  const expected = req.session.csrfToken;
  if (!supplied || supplied.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
    return next(new ExpressError(403, "Your session expired. Refresh the page and try again."));
  }
  next();
};

const csrfProtection = (req, res, next) => {
  if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  res.locals.csrfToken = req.session.csrfToken;
  if (safeMethods.has(req.method)) return next();
  // Multer parses multipart fields inside listing routes, so validate those there.
  if (req.is?.("multipart/form-data")) return next();
  verifyCsrfToken(req, res, next);
};

const createRateLimiter = ({ windowMs, limit, message }) => {
  const attempts = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    const current = attempts.get(key);
    if (!current || current.resetAt <= now) {
      attempts.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    current.count += 1;
    if (current.count > limit) {
      res.set("Retry-After", String(Math.ceil((current.resetAt - now) / 1000)));
      return next(new ExpressError(429, message));
    }
    next();
  };
};

module.exports = { createRateLimiter, csrfProtection, verifyCsrfToken };
