const { User } = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};
exports.postLogin = (req, res, next) => {
  // signIn using email address
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      // comparing password from ui with password in database
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            // only redirect if data is saved succesfully
            return req.session.save(() => {
              console.log("Login Successful");
              res.redirect("/");
            });
          }
          console.log("Incorrect Password!!");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err, "incorrect password!!");
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

// on post sign up we will add the new user to the database
exports.postSignup = (req, res, next) => {
  //values are retriev from req, value name is initiated in views
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  // TODO - validate above values

  // check for email is already registered - can be done using index in mongoDB or by finding email in database
  // checking email in db
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      // encrypting password using bcrytjs hash method
      bcrypt
        .hash(password, 12)
        .then((hashPassword) => {
          if (password === confirmPassword) {
            const user = new User({
              email,
              password: hashPassword,
              cart: { item: [] },
            });
            return user.save();
          }
        })
        .then(() => res.redirect("/login"));
    })
    .catch((err) => console.log(err, "error checking email address"));
};

exports.postLogout = (req, res, next) => {
  // delete the session
  req.session.destroy(() => {
    console.log("Logout Successful");
    res.redirect("/");
  });
};
