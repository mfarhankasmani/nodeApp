const path = require('path');
const express = require("express");

const rootDir = require('../util/path')

const router = express.Router();
// implicitly /admin is prefixed to both the routes

router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "add-product.html"));
});

router.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

module.exports = router;
