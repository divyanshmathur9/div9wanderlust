const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js")

router
.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync(userController.signup));

router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local" ,{failureRedirect:'/login', failureFlash:true}),userController.login);


router.post("/logout", userController.logout);
router.get("/dashboard", isLoggedIn, wrapAsync(userController.dashboard));
router.post("/favorites/:id", isLoggedIn, wrapAsync(userController.toggleFavorite));

router.get("/privacy", (req, res) => res.render("legal.ejs", { page: "privacy" }));
router.get("/terms", (req, res) => res.render("legal.ejs", { page: "terms" }));



module.exports = router;
