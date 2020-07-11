const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router();

// .get will do exact match but .use will handle any incoming method
router.get("/", (req, res, next) => {
  // __dirname is a variable provided by node, it hold the absolute path this file - always use it instead of absolute path
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
