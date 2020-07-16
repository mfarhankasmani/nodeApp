const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const router = express.Router();

const productsController = require("../controllers/products");

router.get("/", productsController.getProducts);

module.exports = router;
