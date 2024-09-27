const express = require("express");
const {
  getAllProduct,
  addProduct,
  editProduct,
  deleteProduct,
  getProductById,
  recommendProducts,
} = require("../controllers/productController");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/img/product");
  },
  filename: function (req, file, cb) {
    const originalName = file.originalname;
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const timestamp = new Date().getTime();
    const uniqueFileName = `${date}${timestamp}-${originalName}`;
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage });

router.get("/product", getAllProduct);
router.post("/product", upload.single("image_product"), addProduct);
router.get("/product/:id", getProductById);
router.put("/product/:id", upload.single("image_product"), editProduct);
router.delete("/product/:id", deleteProduct);
router.post("/uploadNewImageProduct", upload.single("image"), (req, res) => {
  try {
    const imageUrl = req.file.filename;
    res.status(200).json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.delete("/deleteImage", (req, res) => {
  try {
    const imageUrl = req.query.url;
    fs.unlinkSync(`public/img/product/${imageUrl}`);
    res.status(200).json({ success: true, message: "Gambar berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get("/recommend", recommendProducts);
module.exports = router;
