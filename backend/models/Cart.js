const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  id_product: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true],
    ref: "Product",
  },
  id_user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true],
    ref: "User",
  },
  transaction_code: {
    type: String,
    required: [false],
  },
  quantity: {
    type: Number,
    required: [true],
  },
  status: {
    type: Boolean,
    required: [true],
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
