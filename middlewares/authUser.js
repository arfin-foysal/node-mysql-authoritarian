const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
    const { authorization } = req.headers;
    try {
        const token = authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.TOKEN);
        req.user = decoded;
        next()
    } catch (error) {
        res.status(400).json({messages:"invalated token"})
    }
}

module.exports = auth;