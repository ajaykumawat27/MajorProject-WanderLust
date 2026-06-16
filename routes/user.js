const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectedUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");
// const renderVerifyOtpForm = require("../controllers/users.js");
// const verifyOtp = require("../controllers/users.js");

router
.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup)

router
.route("/verify-otp")
.get(userController.renderVerifyOtpForm)
.post(userController.verifyOtp)


router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectedUrl, passport.authenticate("local",{failureRedirect : "/login", failureFlash: true}), userController.successLogin);

router.get('/logout',userController.logout);

module.exports = router;