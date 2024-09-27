const express = require('express');
const router = express.Router();
const { createMidtransTransaction } = require('../controllers/midtransControllers');

router.post('/pay', createMidtransTransaction);

module.exports = router;
