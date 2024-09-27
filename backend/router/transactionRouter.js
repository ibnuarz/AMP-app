const express = require("express");
const router = express.Router();
const { checkoutCartItems, viewUserTransactions } = require("../controllers/transactionController");
const { authenticateToken } = require("../middleware/authenticateToken");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/img/receipt");
    },
    filename: function (req, file, cb) {
      const originalName = file.originalname;
      const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const timestamp = new Date().getTime();
      const uniqueFileName = `RCP-${date}${timestamp}-${originalName}`;
      cb(null, uniqueFileName);
    },
});
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype) {
            return cb(null, true);
        } else {
            return cb(new Error('Only images are allowed'));
        }
    }
});


router.post("/checkout", authenticateToken, upload.single("image_receipt"), checkoutCartItems);
router.get("/transactions", authenticateToken, viewUserTransactions);

module.exports = router;
