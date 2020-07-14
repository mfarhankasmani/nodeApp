const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

// .get will do exact match but .use will handle any incoming method
router.get("/", (req, res, next) => {
  // we have set the location globally, hence there is no need to provide full path now
  // we can pass parameter to pug file as js object
  res.render("shop", {
    products: adminData.products,
    pageTitle: "My Shop",
    path: "/",
    hasProduct: adminData.products.length > 0,
    activeShop: true,
    productCss: true,
  });
});

module.exports = router;
