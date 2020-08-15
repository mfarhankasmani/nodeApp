const isLoggedIn = require("../util/isLoggedIn");

exports.getLogin = (req, res, next) => {
  // console.log(isLoggedIn());
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn(req),
  });
};

exports.postLogin = (req, res, next) => {
  // Setting login to true for successful login on cookie
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
