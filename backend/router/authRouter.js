const express = require('express');
const { authenticateToken } = require('../middleware/authenticateToken');
const { registerUser, loginUser, logoutUser, getUser, updateProfile, updatePassword } = require('../controllers/authControllers');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.get('/getUser', getUser);
router.put('/update-profile', authenticateToken, updateProfile);
router.put('/update-password', authenticateToken, updatePassword);


module.exports = router;

