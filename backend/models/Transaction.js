const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true],
    ref: "User",
  },
  name_user: {
    type: String,
    required: true,
  },
  phone_user: {
    type: String,
    required: true,
  },
  id_cart:[{ 
    type: mongoose.Schema.Types.ObjectId,
    required: [true],
    ref: "Cart", 
    }],
  transaction_code: {
    type: String,
    required: true,
    unique: true,
  },
  transaction_date: {
    type: String,
    required: true,
  },
  shipping_cost: {
    type: Number,
    required: false,
    default: 0,
  },
  total_price_item: {
    type: Number,
    required: true,
  },
  shipping_cost: {
    type: Number,
    required: false,
    default: 0,
  },
  shipping_method: {
    type: String,
  },
  shipping_address: {
    type: String,
    required: true,
  },
  total_bill: {
    type: Number,
    required: true,
  },
  status_code: {
    type: Number,
    required: false,
  },
  message: {
    type: String,
  },
  image_receipt: {
    type: String,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
