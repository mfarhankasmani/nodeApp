const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

// get route param ':' - specifies the dynamic segment
// specific routes should come first, then dynamic routes

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);
router.post("/cart", shopController.postCart);

router.post("/cart-delete-item", shopController.postCardDeleteProduct);

router.post("/create-order", shopController.postOrders);
router.get("/orders", shopController.getOrders);

// router.get("/checkout", shopController.getCheckout);

module.exports = router;
