const mongoose = require('mongoose');

const transactionTokenSchema = new mongoose.Schema({
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  id_transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
  },
  transaction_code: {
    type: String,
    required: true,
  },
  transaction_token: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const transactionToken = mongoose.model('TransactionToken', transactionTokenSchema);

module.exports = transactionToken;
