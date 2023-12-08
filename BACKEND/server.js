const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
//reading url in .env file
require("dotenv").config();

//Define port
const PORT = process.env.PORT || 8070;

// Enable CORS for a single origin
const corsOptions = {
  origin: "https://www.shop.foodiehubofficial.art",
  credentials: true, // Enable credentials (cookies, authorization headers) for cross-origin requests
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

//Connect database

const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
//open created database connection
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongodb Connection success");
});
//access to product.js
const productRouter = require("./routes/product.js");
app.use("/product",productRouter);

const cartRouter = require("./routes/cart.js");
app.use("/cart",cartRouter);

const orderRouter = require("./routes/order.js");
app.use("/order",orderRouter);

const userRouter = require("./routes/user.js");
app.use("/user", userRouter);


//running port 8970
app.listen(PORT, () => {
  console.log(`Server is up and running on port no: ${PORT}`);
});
