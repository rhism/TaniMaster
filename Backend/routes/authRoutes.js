const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.get('/me', authenticateToken, authController.getMe);
router.put('/profile', authenticateToken, authController.updateProfile);

router.put('/profile-picture', authenticateToken, authController.upload.single('profile_picture'), authController.updateProfilePicture);
router.get('/profile-picture', authenticateToken, authController.getProfilePicture);

module.exports = router;
