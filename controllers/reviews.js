const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview = async (req, res) => {
        let listing = await Listing.findById(req.params.id);
        let newReview = await new Review(req.body.review);

        newReview.author = req.user._id;
        // console.log(req.user);
        listing.reviews.push(newReview);

        await newReview.save();
        req.flash("success", "New Review Added successfully!")
        await listing.save();
        res.redirect(`/listings/${listing._id}`);
    }

    module.exports.deleteReview = async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });//pull means remove
        await Review.findByIdAndDelete(reviewId);
        req.flash("error", "Review Deleted successfully!")

        res.redirect(`/listings/${id}`);
    }