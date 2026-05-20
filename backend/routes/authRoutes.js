const express = require('express');
const { register, login, getMe, updateProfile, uploadProfilePic, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/profile', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/profile/picture', protect, upload.single('profilePic'), uploadProfilePic);

module.exports = router;
