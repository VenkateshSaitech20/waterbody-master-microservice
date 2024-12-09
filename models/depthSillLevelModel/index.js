const Joi = require('joi');
const { patterns } = require('../../utils/pattern');

const depthSillLevelModel = Joi.object({
    id: Joi.number(),
    name: Joi.string().trim().pattern(patterns.nameWithAlphaNumeric).min(1).max(50).required().messages({
        'string.pattern.base': 'Name can only contain alphabets and spaces.',
        'string.min': 'Name must contain at least 3 characters.',
        'string.max': 'Name cannot exceed 50 characters.',
        'any.required': 'Name is required.',
        'string.empty': 'Name is required.'
    }),
});

module.exports = depthSillLevelModel;
