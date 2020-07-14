const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router();

// .get will do exact match but .use will handle any incoming method
router.get("/", (req, res, next) => {
  // array product holds the data on node server level. hence data is shared between all the user and requests
  console.log(adminData.products);
  // __dirname is a variable provided by node, it hold the absolute path this file - always use it instead of absolute path
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
