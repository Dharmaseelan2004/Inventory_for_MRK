const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("📌 Received Request Body:", req.body); // Debugging step

      let { shopId, images } = req.body;

      // ✅ Check if shopId exists
      if (!shopId) {
        return next(new ErrorHandler("❌ shopId is missing in the request!", 400));
      }

      // ✅ Validate shopId format
      if (!mongoose.Types.ObjectId.isValid(shopId)) {
        return next(new ErrorHandler(`❌ Invalid Shop ID format: ${shopId}`, 400));
      }

      // Convert to ObjectId
      shopId = new mongoose.Types.ObjectId(shopId);

      // ✅ Fetch shop from DB
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("❌ Shop not found in database!", 404));
      }

      let imageList = [];
      if (typeof images === "string") {
        imageList.push(images);
      } else {
        imageList = images || [];
      }

      const imagesLinks = [];
      for (let i = 0; i < imageList.length; i++) {
        const result = await cloudinary.v2.uploader.upload(imageList[i], {
          folder: "products",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      const productData = {
        ...req.body,
        shopId,
        images: imagesLinks,
        shop,
      };

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


// ✅ GET ALL PRODUCTS OF A SHOP
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { id } = req.params;

      // ✅ Validate Shop ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid Shop ID format!", 400));
      }

      // ✅ Find Products for the Shop
      const products = await Product.find({ shop: id });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// ✅ DELETE PRODUCT
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { id } = req.params;

      // ✅ Validate Product ID
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid Product ID format!", 400));
      }

      const product = await Product.findById(id);

      if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
      }

      // ✅ Delete Images from Cloudinary
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id);
      }

      await product.deleteOne();

      res.status(200).json({
        success: true,
        message: "Product deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// ✅ GET ALL PRODUCTS
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// ✅ CREATE NEW REVIEW
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      // ✅ Validate Product ID
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return next(new ErrorHandler("Invalid Product ID format!", 400));
      }

      // ✅ Validate Order ID
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return next(new ErrorHandler("Invalid Order ID format!", 400));
      }

      const product = await Product.findById(productId);
      if (!product) {
        return next(new ErrorHandler("Product not found!", 404));
      }

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      // ✅ Check if User Already Reviewed
      const isReviewed = product.reviews.find(
        (rev) => rev.user._id.toString() === req.user._id.toString()
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id.toString() === req.user._id.toString()) {
            rev.rating = rating;
            rev.comment = comment;
            rev.user = user;
          }
        });
      } else {
        product.reviews.push(review);
      }

      // ✅ Calculate Average Rating
      let avg = 0;
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;
      await product.save({ validateBeforeSave: false });

      // ✅ Mark Order as Reviewed
      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviewed successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// ✅ GET ALL PRODUCTS FOR ADMIN
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
