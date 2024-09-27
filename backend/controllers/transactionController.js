const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const moment = require("moment-timezone");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

const transactionDate = moment().tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
function getUserIdFromToken(req) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    return decoded.id;
  } catch (error) {
    console.error("Error getting user ID from token:", error);
    return null;
  }
}


const checkoutCartItems = async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { cartItemIds, name_user, phone_user, shipping_cost, shipping_method, shipping_address, status_code } = req.body;

  if (!Array.isArray(cartItemIds) || cartItemIds.some(id => typeof id !== 'string')) {
    return res.status(400).json({ message: "Invalid or missing cart item IDs" });
  }

  const shippingCost = Number(shipping_cost) || 0;
  const statusCode = status_code || 1;
  const image_receipt = req.file ? req.file.filename : null; 

  try {
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const cartItems = await Cart.find({
      _id: { $in: cartItemIds.map(id => new mongoose.Types.ObjectId(id)) },
      id_user: objectIdUserId,
      status: false,
    }).populate("id_product");

    if (cartItems.length !== cartItemIds.length) {
      return res.status(400).json({ message: "Some items are already checked out, do not belong to the user, or do not exist." });
    }

    for (let item of cartItems) {
      const product = await Product.findById(item.id_product);
      if (product.stock_product < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product: ${product.name_product}` });
      }
    }

    for (let item of cartItems) {
      await Product.updateOne(
        { _id: item.id_product },
        { $inc: { stock_product: -item.quantity } }
      );
    }

    const transactionCode = await generateUniqueTransactionCode(objectIdUserId);
    await Cart.updateMany(
      {
        _id: { $in: cartItemIds.map(id => new mongoose.Types.ObjectId(id)) },
      },
      { $set: { status: true, transaction_code: transactionCode } }
    );

    const totalPriceItem = cartItems.reduce((total, item) => {
      const productPrice = item.id_product.price_product;
      const discountAmount = item.id_product.discount_product > 0 ? productPrice * (item.id_product.discount_product / 100) : 0;
      const priceAfterDiscount = productPrice - discountAmount;
      return total + (priceAfterDiscount * item.quantity);
    }, 0);

    const totalBill = totalPriceItem + shippingCost; 

    const newTransaction = new Transaction({
      id_user: objectIdUserId,
      name_user: name_user,
      phone_user: phone_user,
      id_cart: cartItemIds,
      transaction_code: transactionCode,
      transaction_date: transactionDate,
      status_code: statusCode,
      total_price_item: totalPriceItem,
      shipping_method:shipping_method,
      shipping_address: shipping_address,
      shipping_cost: shippingCost,
      total_bill: totalBill,
      image_receipt: image_receipt,
    });

    await newTransaction.save();

    res.status(201).json({
      message: "Checkout successful",
      id_transaction: newTransaction._id,
      transaction_code: transactionCode,
      total_price_item: totalPriceItem,
      shipping_cost: shippingCost,
      total_bill: totalBill,
    });
  } catch (error) {
    console.error("Error during checkout:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

async function generateUniqueTransactionCode(userId) {
  const date = new Date();
  const dateString = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date
    .getHours()
    .toString()
    .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}`;
  const transactionPrefix = `AMP${dateString}`;
  let transactionCode;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 5) {
    const transactionCount = await Cart.countDocuments({
      transaction_code: { $regex: `^${transactionPrefix}` },
    });
    transactionCode = `${transactionPrefix}${(transactionCount + 1)
      .toString()
      .padStart(3, "0")}`;
    const existingTransaction = await Transaction.findOne({
      transaction_code: transactionCode,
    });
    if (!existingTransaction) {
      isUnique = true;
    }
    attempts++;
  }

  return transactionCode;
}

async function calculateTotalBill(cartItemIds, userId) {
  const cartItemsWithDetails = await Cart.aggregate([
    {
      $match: {
        _id: { $in: cartItemIds.map((id) => new mongoose.Types.ObjectId(id)) },
        id_user: userId,
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "id_product",
        foreignField: "_id",
        as: "product_info",
      },
    },
    { $unwind: "$product_info" },
    {
      $project: {
        quantity: 1,
        price: "$product_info.price_product",
      },
    },
  ]);

  return cartItemsWithDetails.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
}

const viewUserTransactions = async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const transactions = await Transaction.find({ id_user: userId }).sort({ transaction_date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error retrieving user transactions:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  checkoutCartItems,
  generateUniqueTransactionCode,
  calculateTotalBill,
  viewUserTransactions
};
