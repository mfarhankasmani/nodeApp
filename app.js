const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelise = require("./util/database.js");
const Product = require("./models/product");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      // creating new parameter on req - user we are storing is a sequelize object
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// creating association
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product); // this step is optional - but it creates bidirections association

sequelise
  // never use force in production - we are using it because product schema is already created.
  // it will drop the existing table everytime
  //.sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "farhan",
        email: "test@test.com",
      });
    }
    // user is an obj, hence to be consistant we are returning a promise which resolve to user
    //return Promise.resolve(user)

    return user; // any value return in then block is a promise
  })
  .then((user) => {
    //console.log({ user });
    app.listen(3000);
  })
  .catch((err) => console.log({ err }));
