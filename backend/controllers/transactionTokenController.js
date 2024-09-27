const TransactionToken = require('../models/Token');
const Transaction = require('../models/Transaction');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const fetch = require('node-fetch');
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const authString = Buffer.from(process.env.MIDTRANS_SERVER_KEY+':').toString('base64');
const transactionDate = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');

const saveTransactionToken = async (req, res) => {
  const { id_transaction, transaction_code, transaction_token } = req.body;
  
  const userId = req.user.id;  

  if (!userId) {
    return res.status(401).send("User not authenticated");
  }

  if (!id_transaction || !transaction_code || !transaction_token) {
    return res.status(400).send("All fields are required");
  }

  try {
    const transaction = await Transaction.findById(id_transaction);
    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    const newTransactionToken = new TransactionToken({
      id_user: userId,
      id_transaction,
      transaction_code,
      transaction_token,
      date: transactionDate
    });

    await newTransactionToken.save();
    res.status(201).send({
      message: "Transaction token saved successfully",
      data: newTransactionToken
    });
  } catch (error) {
    console.error("Error saving transaction token:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getTransactionTokens = async (req, res) => {
  const userId = req.user.id; 

  if (!userId) {
    return res.status(401).send("User not authenticated");
  }

  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const transactionTokens = await TransactionToken.find({ id_user: objectId });
    if (!transactionTokens || transactionTokens.length === 0) {
      return res.status(204).send("No transaction tokens found for the user");
    }
    res.status(200).send(transactionTokens);
  } catch (error) {
    console.error("Error retrieving transaction tokens:", error);
    res.status(500).send("Internal Server Error");
  }
};

const checkTransactionStatus = async (req, res) => {
  const { transaction_code } = req.params;

  if (!transaction_code) {
    return res.status(400).send("Transaction code is required");
  }
  
  try {
    const response = await fetch(`https://api.sandbox.midtrans.com/v2/${transaction_code}/status`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      }
    });

    const statusData = await response.json();

    if (response.ok) {
      res.status(200).send(statusData);
    } else {
      res.status(response.status).send(statusData);
    }
  } catch (error) {
    console.error("Error checking transaction status:", error);
    res.status(500).send("Internal Server Error");
  }
};

const cancelTransaction = async (req, res) => {
  const { transaction_code } = req.params;

  if (!transaction_code) {
    return res.status(400).json({ message: "Transaction code is required" });
  }

  try {
    const response = await fetch(`https://api.sandbox.midtrans.com/v2/${transaction_code}/cancel`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      }
    });

    const cancelData = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: cancelData.status_message || 'Failed to cancel transaction',
        cancelData
      });
    }

    const cartItems = await Cart.find({ transaction_code });
    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'No cart items found for this transaction' });
    }

    for (let cartItem of cartItems) {
      const product = await Product.findById(cartItem.id_product);
      if (product) {
        product.stock_product += cartItem.quantity;
        await product.save();
      }
    }
    
    const transaction = await Transaction.findOne({ transaction_code });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    transaction.status_code = 3;
    await transaction.save();

    res.status(200).json({
      message: 'Transaction successfully canceled, product stock restored, and transaction status updated.',
      cancelData
    });
  } catch (error) {
    console.error("Error canceling transaction:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


module.exports = {
  saveTransactionToken,
  getTransactionTokens,
  checkTransactionStatus,
  cancelTransaction
};
