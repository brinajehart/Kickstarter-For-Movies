const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "kfm-key-420", async function(err, decodedToken) {
            if (err) res.status(401).json({ message: "Authentication failed!" });
            else {
                req.USER_ID = await decodedToken.userId;
                next();
            }
        });
        
    } catch (error) {
        res.status(401).json({ message: "Authentication failed!" });
    }
};