const trimRequestBody = (req, res, next) => {
    for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        } else if (Array.isArray(req.body[key])) {
            req.body[key] = req.body[key].map(item => {
                if (typeof item === 'object') {
                    for (const subKey in item) {
                        if (typeof item[subKey] === 'string') {
                            item[subKey] = item[subKey].trim();
                        }
                    }
                }
                return item;
            });
        }
    }
    next();
};

module.exports = { trimRequestBody }