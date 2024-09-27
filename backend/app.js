var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var dotenv = require("dotenv");
var app = express();
var port = 8080;

var authRouter = require("./router/authRouter");
const productRouter = require("./router/productRouter");
const cartRouter = require("./router/cartRouter");
const transactionRouter = require("./router/transactionRouter");
const adminRouter = require("./router/adminRouter");
const midtransRouter = require("./router/midtransRouter");
const transactionTokenRouter = require("./router/transactionTokenRouter");
const { errorHandler } = require("./middleware/errorHandler");
const { notFound } = require("./middleware/notFound");

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(morgan("dev"));
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/admin", adminRouter);
app.use("/api/midtrans", midtransRouter);
app.use("/api/transaction-token", transactionTokenRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`port : ${port}`);
});

mongoose.connect(process.env.DB, {}).then(() => {
  console.log("terkoneksi");
});
