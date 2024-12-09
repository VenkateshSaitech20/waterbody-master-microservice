const { formatErrors } = require("../utils/helper");

const validateMiddleware = (model) => async (req, res, next) => {
    try {
        const { error } = model.validate(req.body, { abortEarly: false });
        if (error) {
            const formattedErrors = formatErrors(error);
            return res.json({ result: false, message: formattedErrors });
        } else {
            next();
        }
    } catch (err) {
        res.json({ result: false, message: 'Something went wrong' });
    }
};

module.exports = { validateMiddleware };
