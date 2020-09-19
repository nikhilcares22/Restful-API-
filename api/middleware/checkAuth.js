const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log("body", req.body);
        const decoded = jwt.verify(req.body.token, process.env.JWT_KEY);
        // req.userData = decoded;
        console.log(decoded);
        next();
    } catch (error) {
        console.log("hereee");
        return res.status(401).json({
            message: 'Auth Faileed'
        });
    }
}