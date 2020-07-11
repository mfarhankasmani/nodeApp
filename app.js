const express = require("express");

const app = express();

// middleware

app.use("/", (req, res, next) => {
  console.log("this always runs");
  next(); // Allows to execute next middleware
});

app.use("/add-product", (req, res, next) => {
  console.log("In the next middleware");
  res.send(`<h1>The "Add product" Page </h1>`);
});

app.use("/", (req, res, next) => {
  console.log("In the next middleware");
  res.send("<h1>Hello from express</h1>");
});

app.listen(3000);
