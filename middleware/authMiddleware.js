const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next ) => {
    const token = req.header('Authorization');

    if(!token || !token.startsWith('bearer')) {
        return res.status(401).json({ message: "NO token, Authorization denied"});
    }

    try {
        const extractedToken = token.split(' ')[1];
        const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Authorization error:', err);
        res.status(401).json({ message: 'Token is not Valid', error: err.message});
    }
};

module.exports = authMiddleware;