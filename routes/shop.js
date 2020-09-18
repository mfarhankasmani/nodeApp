const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");

//using middleware for auth check
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

// get route param ':' - specifies the dynamic segment
// specific routes should come first, then dynamic routes

router.get("/products/:productId", shopController.getProduct);

router.get("/cart", isAuth, shopController.getCart);
router.post("/cart", isAuth, shopController.postCart);

router.post("/cart-delete-item", isAuth, shopController.postCardDeleteProduct);

router.post("/create-order", isAuth, shopController.postOrders);
router.get("/orders", isAuth, shopController.getOrders);

router.get("/orders/:orderId", isAuth, shopController.getInvoice);
// router.get("/checkout", shopController.getCheckout);

module.exports = router;
