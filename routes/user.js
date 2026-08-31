const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js")
const { createRateLimiter } = require("../utils/security.js");
const authLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, limit: 12, message: "Too many sign-in attempts. Please try again later." });

router
.route("/signup")
.get( userController.renderSignupForm)
.post(authLimiter, wrapAsync(userController.signup));

router
.route("/login")
.get(userController.renderLoginForm)
.post(authLimiter, saveRedirectUrl, passport.authenticate("local" ,{failureRedirect:'/login', failureFlash:true}),userController.login);


router.post("/logout", userController.logout);
router.get("/dashboard", isLoggedIn, wrapAsync(userController.dashboard));
router.post("/favorites/:id", isLoggedIn, wrapAsync(userController.toggleFavorite));

router.get("/privacy", (req, res) => res.render("legal.ejs", { page: "privacy" }));
router.get("/terms", (req, res) => res.render("legal.ejs", { page: "terms" }));



module.exports = router;
