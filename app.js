const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// middleware

app.use(bodyParser.urlencoded()); // parse body of the response (it will not parse files)

app.use("/add-product", (req, res, next) => {
  res.send(
    `<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add product</button></form>`
  );
});

app.use("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

app.use("/", (req, res, next) => {
  res.send("<h1>Hello from express</h1>");
});

app.listen(3000);
