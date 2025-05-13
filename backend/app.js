const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const ErrorHandler = require("./middleware/error");

const app = express();

// Load environment variables (Only in development mode)
if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "config/.env" });
}

// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Test Route
app.get("/test", (req, res) => {
  res.status(200).send("Hello World!");
});

// Import Routes
const userRoutes = require("./controller/user");
const shopRoutes = require("./controller/shop");
const productRoutes = require("./controller/product");
const eventRoutes = require("./controller/event");
const couponRoutes = require("./controller/coupounCode");
const paymentRoutes = require("./controller/payment");
const orderRoutes = require("./controller/order");
const conversationRoutes = require("./controller/conversation");
const messageRoutes = require("./controller/message");
const withdrawRoutes = require("./controller/withdraw");

// Route Usage
app.use("/api/v2/user", userRoutes);
app.use("/api/v2/conversation", conversationRoutes);
app.use("/api/v2/message", messageRoutes);
app.use("/api/v2/order", orderRoutes);
app.use("/api/v2/shop", shopRoutes);
app.use("/api/v2/product", productRoutes);
app.use("/api/v2/event", eventRoutes);
app.use("/api/v2/coupon", couponRoutes);
app.use("/api/v2/payment", paymentRoutes);
app.use("/api/v2/withdraw", withdrawRoutes);

// Global Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;
