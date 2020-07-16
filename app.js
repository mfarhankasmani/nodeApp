const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

//setting global template to ejs
app.set("view engine", "ejs");
//set view folder. by default it is set to src/views
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRouter = require("./routes/shop");
const rootDir = require("./util/path");
const errorController = require("./controllers/error");

// middleware
app.use(bodyParser.urlencoded()); // parse body of the response (it will not parse files)
app.use(express.static(path.join(rootDir, "public"))); // it will serves static files

// common path can be added on top level
app.use("/admin", adminRoutes);
app.use(shopRouter);

app.use(errorController.get404Page);

app.listen(3000);
