const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Mengambil token dari header

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan user ID dalam request untuk digunakan di controller
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token tidak valid.' });
    }
};

module.exports = authenticateToken;
