const Listing = require("../models/listing");
const path = require("path");

//Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//New Route 
module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};

//show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;// grab the id from URL
    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author", } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing You are requesting not exist!");
        return res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
}

//Create Route
module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing You are requesting not exist!");
        return res.redirect("/listings");
    }
    // make Cloudinary resized preview URL
    let originalImageUrl = listing.image.url.replace("/upload", "/upload/w_250")
    res.render("listings/edit.ejs", { listing, originalImageUrl});
}

// update route
module.exports.updateListing = async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "send valid data for listing")
    }

    let { id } = req.params; // grab the id from URL
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, {new: true});

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;

        listing.image = { url, filename };
        await listing.save();
    }
        // await listing.save();
        req.flash("success", "Listing Updated!")
        res.redirect(`/listings/${id}`);
}

//Delete route controllers
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    // console.log(deletedListing);
    res.redirect("/listings");
}