const jwt = require('jsonwebtoken');
const respMsg = require('../utils/message');

const verifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return res.json({ result: false, message: respMsg.noToken });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.userDetail;
        next();
    } catch (error) {
        return res.json({ result: false, message: respMsg.invExpToken });
    }
}

module.exports = { verifyToken };