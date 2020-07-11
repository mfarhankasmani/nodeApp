const express = require ("express");

const router = express.Router();

// .get will do exact match but .use will handle any incoming method
router.get("/", (req, res, next) => {
  res.send("<h1>Hello from express</h1>");
});

module.exports = router;
