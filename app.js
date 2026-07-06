const express = require("express");
const app = express();

const mongoose = require("mongoose");
const path = require("path");

//used to support PUT, PATCH, and DELETE requests from HTML forms
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const MongoStore= require("connect-mongo");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

app.set("view engine", "ejs");

//this sets the folder where Express should look for your .ejs files
app.set("views", path.join(__dirname, "views"));

//this middleware is used to parse incoming data (form ke raw data ko req.body object me convert) and is defined before method-override
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
//to Serve Static files
app.use(express.static(path.join(__dirname, "/public")));
const { listingSchema, reviewSchema } = require("./schema.js");

const dburl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust"

main()
    .then(() => console.log("Database connected successfully!"))
    .catch(err => console.log(err));

async function main() {
    //Atlas Database url or connect with local db wanderlust
    return await mongoose.connect(dburl);
}

// method to create new MongoStore for sessions
const store = MongoStore.create({
    mongoUrl:dburl,
    // client: mongoose.connection.getClient(),
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 1*60*60 //in seconds (1 hour)
});

store.on("error", (err) =>{
    console.log("ERR_IN_MONGO_SESSION_STORE",err)
})

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,//1 week
        httpOnly: true,
    }
};

// session middleware
app.use(session(sessionOptions));
app.use(flash());

//authentication middleware, after session ->  authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

// root route 
app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// 404 handler
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
    if (res.headersSent){
        return next(err);
    }
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server listening on http://localhost:8080/listings");
});
