const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
// passing session to returned a constructor fuction
const MongoDBStore = require("connect-mongodb-session")(session);

//token lib
const csrf = require("csurf");

//import connect flash
const flash = require("connect-flash");
const multer = require("multer");

const errorController = require("./controllers/error");
const { User } = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://farhan:MX5XOhPW8MYkaND1@cluster0.mtvre.mongodb.net/shop?retryWrites=true&w=majority";

const app = express();
// create a store
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { collection } = require("./models/order");

// multer file storage configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  },
});

//multer file filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// bodyParser is used for extracting values from html page (URL encoded) - it can only extract text, file will not be supported.
app.use(bodyParser.urlencoded({ extended: false }));

//initialling multer for single file - this will store the images in images folder with a unique name
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use(express.static(path.join(__dirname, "public")));
// Creating session middleware - secret : client secret, resave : false (save only when something is changed on the session),
// saveUninitialized: false (ensures that session is not stored where it is not required)
// cookie can also be configured
// pass mongodb store to store session details into db
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
// after the session is created, add csrf protection
// for all the post req, this package will look for the token
app.use(csrfProtection);
// add flash to middleware, so that it can be used any where in the application
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn; // res.locals is use for passing local value to each views
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      // throwing error for sync functionality
      next(new Error(err));
    });
});

// adding middle ware for passing isAuthenticated, csrfToken to all the routes/views

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);
// error handling middleware -- incase of multiple error handling middleware, node will execute them sequencially
app.use((error, req, res, next) => {
  //res.redirect("/500");
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});
mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => app.listen(3000))
  .catch((err) => console.log(err));
