// Joi ek data validation 
// Yeh ensure karta hai ki user se jo data aa raha hai (form ya API se),
// wo valid, complete, aur expected format me ho
//used when request is sent through hoppscotch
const Joi = require('joi');
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
    })
        .required() // hamare paas listing to hone he chahiye reference models>>listing.js

});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
})