const User = require("../models/user.js");
const {sendVerificationCode} = require("../utils/SendVerificationCode.js");
module.exports.renderSignupForm = async (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        if(!email || !username || !password){
            return res.status(400).json({success:false,message:"All fields are required"})
        }

        const ExistingUser = await User.findOne({email});
        if(ExistingUser){
            req.flash("error","User already exist");
            return res.redirect("/login");
        }

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Send OTP email and wait for it
        await sendVerificationCode(email, verificationCode);
        
        // it temporarily holds the signup info in session while the user is redirected to the OTP page.
        req.session.tempUser = {
            username,
            email,
            password,
            verificationCode
        };
        
        // Redirect to OTP verification page
        req.flash("success", "OTP sent to your email!");
        res.redirect("/verify-otp");

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.verifyOtp = async (req, res,next) => {
    try {
        const { otp } = req.body;
        const tempUser = req.session.tempUser;
    //    console.log(tempUser);
        if (!tempUser) {
            req.flash("error", "Session expired. Please signup again.");
            return res.redirect("/signup");
        }

        if (otp !== tempUser.verificationCode) {
            req.flash("error", "Invalid OTP!");
            return res.redirect("/verify-otp");
        }

        // OTP verified, now register user
        const newUser = new User({
            email: tempUser.email,
            username: tempUser.username,
            isVerified:true,
            verificationCode: null
        });
        const registeredUser = await User.register(newUser, tempUser.password);
        // clear the temp data
        delete req.session.tempUser; 

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "User Registered Successfully!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/verify-otp");
    }
};

module.exports.renderVerifyOtpForm = async (req, res) => {
    res.render("users/otp.ejs");
};

module.exports.renderLoginForm = async (req, res) => {
    res.render("users/login.ejs");
};


module.exports.successLogin = async (req, res) => {
    req.flash("success", "Welcome to wanderlust!, You are Logged In!");
    const redirectUrl = res.locals.redirect;
    //Reason to write :-   ?? "/listings"   :- if user directly access login page then redirectUrl = undefined then
    //  user will redirect to /listings 
    res.redirect(redirectUrl ?? "/listings");

};

module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) { return next(err); }

        req.flash("success", "you are logged out now");
        res.redirect("/listings");
    })

};
