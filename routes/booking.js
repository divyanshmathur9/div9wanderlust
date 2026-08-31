const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const bookings = require("../controllers/bookings");

router.post("/", isLoggedIn, wrapAsync(bookings.create));
router.post("/:bookingId/cancel", isLoggedIn, wrapAsync(bookings.cancel));

module.exports = router;
