const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    // Read jwt from header
    const token = req.header("x-auth-token");

    // Verify if there is no jwt
    if (!token) {
        return res.status(401).json({msg: "There is no token."});
    }

    // Verify jwt
    try {
        const encryption = jwt.verify(token, process.env.SECRET);
        req.user = encryption.user;
        next();
    } catch (e) {
        res.status(401).json({msg: "Invalid token."});
    }
}