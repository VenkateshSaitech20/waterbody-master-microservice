const Joi = require('joi');
const { patterns } = require('../../utils/pattern');

const waterSpreadAreaModel = Joi.object({
    id: Joi.number(),
    name: Joi.string().trim().pattern(patterns.percentage).required().messages({
        'string.pattern.base': 'Percentage can only contain some spacial charactors.',
        'any.required': 'Percentage is required.',
        'string.empty': 'Percentage is required.'
    }),
});

module.exports = waterSpreadAreaModel;
