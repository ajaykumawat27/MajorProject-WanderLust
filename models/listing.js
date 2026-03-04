const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
         url: {
            type: String,
            default: "https://media.gettyimages.com/id/1304020215/photo/blue-sports-car-about-to-travel-through-tunnel-at-speed.jpg?s=612x612&w=0&k=20&c=_py5hUAshJPz2UKKhjcKcTzQIyk41u6ysniiOrx6VeA="
        }
    },
    price: Number,
    location: String,
    country: String,
     reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing) {
        await review.deleteMany({_id : { $in : listing.reviews}})
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;