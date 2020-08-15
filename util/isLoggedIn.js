const isLoggedIn = (req) => {
  if (req && req.get("Cookie")) {
    // returning true if loggedIn = true
    return req.get("Cookie").split(";")[0].trim().split("=")[1] === "true"
      ? true
      : false;
  }
  return false;
};

module.exports = isLoggedIn;
