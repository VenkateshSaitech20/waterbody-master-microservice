const Joi = require('joi');
const { patterns } = require('../../utils/pattern');

const surplusWeirsParameterModel = Joi.object({
    id: Joi.number(),
    name: Joi.string().trim().pattern(patterns.numberString).required().messages({
        'string.pattern.base': 'Name can only contain numaric values.',
        'string.min': 'Name must contain at least 3 characters.',
        'string.max': 'Name cannot exceed 50 characters.',
        'any.required': 'Name is required.',
        'string.empty': 'Name is required.'
    }),
});

module.exports = surplusWeirsParameterModel;
