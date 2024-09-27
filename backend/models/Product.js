const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name_product: {
    type: String,
    required: [true, "Nama produk harus diisi"],
  },
  price_product: {
    type: Number,
    required: [true, "Harga produk harus diisi"],
  },
  category_product: {
    type: String,
    required: [true, "Kategori produk harus diisi"],
  },
  description_product: {
    type: String,
    required: [true, "Deskripsi produk harus diisi"],
  },
  composition_product: String,

  dose_product: String,
  sideeffects_product: String,
  group_product: String,
  manufacture_product: String,
  stock_product: {
    type: Number,
    required: [true, "Stok produk harus diisi"],
  },
  expiry_date_product: {
    type: String,
    required: [true, "Tanggal kadaluarsa produk harus diisi"],
  },
  image_product: {
    type: String,
    required: true,
  },
  discount_product: { 
    type: Number, 
    default: 0 
  },
});

productSchema.index({
  description_product: "text",
  category_product: "text",
  composition_product: "text",
  dose_product: "text",
  manufacture_product: "text",
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
