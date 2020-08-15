exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  //Setting session data - this will store session in memory
  req.session.isLoggedIn = true;
  res.redirect("/");
};
