const http = require("http");

const express = require("express");

const app = express();

//below func is middleware
app.use((req, res, next) => {
  console.log("In the middleware");
  next();
});

//without next function in above middleware, below middleware will not be called
app.use((req, res, next) => {
  console.log("In the next middleware");
});

const server = http.createServer(app);
server.listen(3000);
