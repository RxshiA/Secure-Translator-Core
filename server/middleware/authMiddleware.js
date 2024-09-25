/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    const token = req.header("x-auth-token");

    if (!token) {
        return res.status(401).json({ msg: "No authentication token, authorization denied" });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token verification failed, authorization denied" });
    }
};

module.exports = authMiddleware;