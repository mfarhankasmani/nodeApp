const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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",
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message,
  });
};
exports.postLogin = (req, res, next) => {
  // signIn using email address
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
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
          req.flash("error", "Invalid email or password");
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
        req.flash("error", "Email is already registered");
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
        .then(() => {
          res.redirect("/login");
          // sending email is an async task, either we can wait by using then, or we can just continue
          return transporter.sendMail({
            to: email,
            from: "farhan.kasmani@gmail.com",
            subject: "Signup succeeded!",
            html: "<h1>Sign up is successfully completed!!</h1>",
          });
        });
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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        //expiration after one hour
        user.resetTokenExpiration = Date.now() + 3600000;
        user.save().then(() => {
          res.redirect("/");
          transporter.sendMail({
            to: req.body.email,
            from: "farhan.kasmani@gmail.com",
            subject: "Password reset",
            html: `
            <p>You requested a password reser</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
            `,
          });
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      return bcrypt.hash(newPassword, 12).then((hashPassword) => {
        user.password = hashPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        return user.save();
      });
    })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
