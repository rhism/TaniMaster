const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/profile_picture'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });

const register = async (req, res) => {
    const { email, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [existingUser] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [email, username]
        );
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email atau username sudah digunakan' });
        }
        await pool.query(
            'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
            [email, username, hashedPassword]
        );
        res.status(201).json({ message: 'User berhasil diregistrasi' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Gagal registrasi' });
    }
};

const login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    try {
        const [user] = await pool.query(
            'SELECT * FROM users WHERE email = ? OR username = ?',
            [usernameOrEmail, usernameOrEmail]
        );
        if (user.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }
        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Password salah' });
        }
        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, message: 'Login berhasil' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Gagal login' });
    }
};

const getMe = async (req, res) => {
    const { id } = req.user;
    try {
        const [user] = await pool.query(
            'SELECT id, username, email, full_name, phone, business_name FROM users WHERE id = ?',
            [id]
        );
        if (user.length === 0) return res.status(404).json({ message: 'User tidak ditemukan' });
        res.json(user[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Gagal mengambil data user' });
    }
};

const updateProfile = async (req, res) => {
    const { id } = req.user;
    const { full_name, phone, business_name, username } = req.body;
    try {
        await pool.query(
            'UPDATE users SET full_name = ?, phone = ?, business_name = ?, username = ? WHERE id = ?',
            [full_name || null, phone || null, business_name || null, username || null, id]
        );
        res.json({ message: 'Profil berhasil diperbarui' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Gagal memperbarui profil' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(200).json({ message: 'Jika email terdaftar, instruksi reset telah dikirim.' });
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await pool.query('DELETE FROM password_resets WHERE user_id = ?', [user[0].id]);
        await pool.query(
            'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user[0].id, token, expiresAt.toISOString()]
        );
        console.log(`[RESET PASSWORD] Token untuk ${email}: ${token}`);
        res.status(200).json({ message: 'Instruksi reset password telah dikirim ke email Anda.', dev_token: token });
    } catch (error) {
        console.error('Error forgot password:', error);
        res.status(500).json({ message: 'Gagal memproses permintaan' });
    }
};

const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM password_resets WHERE token = ? AND used = FALSE AND expires_at > NOW()',
            [token]
        );
        if (rows.length === 0) {
            return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, rows[0].user_id]);
        await pool.query('UPDATE password_resets SET used = TRUE WHERE token = ?', [token]);
        res.json({ message: 'Password berhasil diperbarui. Silakan login.' });
    } catch (error) {
        console.error('Error reset password:', error);
        res.status(500).json({ message: 'Gagal mereset password' });
    }
};

const googleLogin = async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;
        const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        let userId;
        if (existing.length > 0) {
            userId = existing[0].id;
        } else {
            const username = name.replace(/\s+/g, '_').toLowerCase() + '_' + googleId.slice(-4);
            const [result] = await pool.query(
                'INSERT INTO users (email, username, password, full_name) VALUES (?, ?, ?, ?)',
                [email, username, '', name]
            );
            userId = result.insertId;
        }
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, message: 'Login Google berhasil' });
    } catch (error) {
        console.error('Error during Google login:', error);
        res.status(401).json({ message: 'Token Google tidak valid' });
    }
};

const updateProfilePicture = async (req, res) => {
    const userId = req.user.id;
    const profilePicture = req.file ? req.file.filename : null;
    try {
        if (!profilePicture) return res.status(400).json({ message: 'Tidak ada file yang diupload' });
        await pool.query('UPDATE users SET profile_picture = ? WHERE id = ?', [profilePicture, userId]);
        res.status(200).json({ message: 'Foto profil berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui foto profil' });
    }
};

const getProfilePicture = async (req, res) => {
    const userId = req.user.id;
    try {
        const [user] = await pool.query('SELECT profile_picture FROM users WHERE id = ?', [userId]);
        if (user.length > 0 && user[0].profile_picture) {
            const filePath = path.join(__dirname, '..', 'uploads', 'profile_picture', user[0].profile_picture);
            res.status(200).sendFile(filePath);
        } else {
            res.status(404).json({ message: 'Foto profil tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Gagal mendapatkan foto profil' });
    }
};

module.exports = {
    register, login, googleLogin, getMe, updateProfile,
    forgotPassword, resetPassword,
    updateProfilePicture, getProfilePicture, upload,
};
