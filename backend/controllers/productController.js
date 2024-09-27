const Product = require("../models/Product");
const fs = require("fs");

const getAllProduct = async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    let productList;

    if (!searchQuery) {
      productList = await Product.find();
    } else {
      const words = searchQuery.split(" ").filter((word) => word);
      const regexArray = words.map((word) => new RegExp(word, "i"));

      productList = await Product.find({
        $and: regexArray.map((regex) => ({
          $or: [
            { name_product: { $regex: regex } },
            { category_product: { $regex: regex } },
            { description_product: { $regex: regex } },
            { composition_product: { $regex: regex } },
          ],
        })),
      });
    }

    res.status(200).json({
      success: true,
      data: productList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Produk tidak ditemukan" });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      name_product,
      price_product,
      category_product,
      description_product,
      composition_product,
      dose_product,
      sideeffects_product,
      group_product,
      manufacture_product,
      stock_product,
      expiry_date_product,
    } = req.body;

    const image_product = req.file.filename;

    const newProduct = await Product.create({
      name_product,
      price_product,
      category_product,
      description_product,
      composition_product,
      dose_product,
      sideeffects_product,
      group_product,
      manufacture_product,
      stock_product,
      expiry_date_product,
      image_product,
    });

    res.status(201).json({
      success: true,
      data: newProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const editProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const updateProduct = await Product.findByIdAndUpdate(productID, req.body, {
      new: true,
    });
    res.status(200).json({ success: true, data: updateProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productID = req.params.id;
    const product = await Product.findById(productID);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Produk tidak ditemukan" });
    }
    fs.unlinkSync(`public/img/product/${product.image_product}`);
    await Product.findByIdAndDelete(productID);
    res.status(200).json({ success: true, message: "Produk berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const recommendProducts = async (req, res) => {
  const { searchQuery } = req.query;

  try {
    const products = await Product.find(
      {
        $text: { $search: searchQuery },
      },
      {
        score: { $meta: "textScore" },
      }
    ).sort({
      score: { $meta: "textScore" },
    });

    if (products.length === 0) {
      return res.status(404).send("No products found matching the criteria");
    }

    res.status(200).send(products);
  } catch (error) {
    console.error("Error in recommending products:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

module.exports = {
  getAllProduct,
  addProduct,
  editProduct,
  deleteProduct,
  getProductById,
  recommendProducts,
};
