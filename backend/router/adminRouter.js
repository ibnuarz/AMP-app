const express = require('express');
const { authenticateTokenAdmin } = require('../middleware/authenticateToken');
const { registerAdmin, loginAdmin, logoutAdmin, updateAdminProfile } = require('../controllers/adminControllers');
const { getAllUsers, getUserById, editUser, deleteUser } = require('../controllers/adminControllers');
const { getAllAdmins, getAdminById, editAdmin, deleteAdmin } = require('../controllers/adminControllers');
const { getAllTransactions, getAllDetailTransaction, getTransactionById, updateTransaction } = require('../controllers/adminControllers');
const { getAllTransactionTokens, checkTransactionTokesStatus, deleteTransactionToken} = require('../controllers/adminControllers');
const router = express.Router();

router.post('/regist', registerAdmin);
router.post('/login', loginAdmin);
router.get('/logoutAdmin', logoutAdmin);

router.put('/update-profile', authenticateTokenAdmin, updateAdminProfile);
router.get('/dataUsers', authenticateTokenAdmin, getAllUsers);
router.get('/dataUsers/:id', authenticateTokenAdmin, getUserById);
router.put('/dataUsers/:id', authenticateTokenAdmin, editUser);

router.delete('/dataUsers/:id', authenticateTokenAdmin, deleteUser);
router.get('/dataAdmins', authenticateTokenAdmin, getAllAdmins);
router.get('/dataAdmins/:id', authenticateTokenAdmin, getAdminById);
router.put('/dataAdmins/:id', authenticateTokenAdmin, editAdmin);
router.delete('/dataAdmins/:id', authenticateTokenAdmin, deleteAdmin);

router.get('/transactions', authenticateTokenAdmin, getAllTransactions);
router.get('/transactions/detail/:transaction_code', authenticateTokenAdmin, getAllDetailTransaction);
router.get('/transactions/:id', authenticateTokenAdmin, getTransactionById);
router.put('/transactions/:id', authenticateTokenAdmin, updateTransaction);

router.get('/dataTransactionTokens', authenticateTokenAdmin, getAllTransactionTokens);
router.get('/transactionStatus/:transaction_code', authenticateTokenAdmin, checkTransactionTokesStatus);
router.delete('/dataTransactionTokens/:transaction_code', authenticateTokenAdmin, deleteTransactionToken);


module.exports = router;