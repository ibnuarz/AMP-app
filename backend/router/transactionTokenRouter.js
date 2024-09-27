const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authenticateToken');
const { saveTransactionToken, getTransactionTokens, checkTransactionStatus, cancelTransaction } = require('../controllers/transactionTokenController');
router.post('/save-token', authenticateToken, saveTransactionToken);
router.get('/view-tokens', authenticateToken, getTransactionTokens);
router.get('/check-status/:transaction_code', authenticateToken, checkTransactionStatus);
router.post('/cancel-transaction/:transaction_code', authenticateToken, cancelTransaction);

module.exports = router;
