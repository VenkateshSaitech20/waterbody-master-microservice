const setCSPHeaders = (req, res, next) => {
    res.setHeader('X-Powered-By', 'My Custom Server');
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
};
module.exports = setCSPHeaders;