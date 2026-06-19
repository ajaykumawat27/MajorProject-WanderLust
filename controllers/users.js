const User = require("../models/user.js");
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

        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "User Registered Successfully!");
            res.redirect("/listings");
        });

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
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
