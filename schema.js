const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().trim().min(3).max(100).required(),
        description: Joi.string().trim().min(20).max(2000).required(),
        location: Joi.string().trim().min(2).max(120).required(),
        country: Joi.string().trim().min(2).max(80).required(),
        price: Joi.number().required().min(0),
        category: Joi.string().valid("trending", "beach", "mountains", "cities", "unique").required(),
        maxGuests: Joi.number().integer().min(1).max(30).required(),
        amenities: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
        image: Joi.string().allow("", null)
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().trim().min(3).max(1000).required(),
    }).required(),
});
