const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookings = require("../controllers/bookings");
const { createRateLimiter } = require("../utils/security");
const bookingLimiter = createRateLimiter({ windowMs: 60 * 1000, limit: 10, message: "Too many reservation attempts. Please wait a moment." });

router.post("/", bookingLimiter, isLoggedIn, wrapAsync(bookings.create));
router.post("/:bookingId/cancel", isLoggedIn, wrapAsync(bookings.cancel));

module.exports = router;
