const path = require('path');

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const adminRouter = require('./routes/admin')
const shopRouter = require('./routes/shop')

// middleware

app.use(bodyParser.urlencoded()); // parse body of the response (it will not parse files)

// common path can be added on top level
app.use('/admin',adminRouter);
app.use(shopRouter)

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
})

app.listen(3000);
