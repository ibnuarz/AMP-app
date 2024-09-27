const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token otentikasi tidak tersedia' });
    }
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token otentikasi tidak valid' });
        }
        req.user = user;
        next();
    });
};

const authenticateTokenAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token otentikasi tidak tersedia' });
    }
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token otentikasi tidak valid' });
        }
        if (!user.id || !user.role) {
            return res.status(403).json({ success: false, message: 'Token otentikasi tidak mengandung id atau role' });
        }
        if (user.role !== 'admin' && user.role !== 'superadmin') {
            return res.status(403).json({ success: false, message: 'Akses hanya untuk admin atau superadmin' });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken, authenticateTokenAdmin };