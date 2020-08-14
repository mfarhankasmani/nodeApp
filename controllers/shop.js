const { Product } = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log("getProducts", err));
};

exports.getProduct = (req, res, next) => {
  // param name should same as the name used in route
  const prodId = req.params.productId;
  //find all always returns an array
  Product.findById(prodId)
    .then((products) => {
      res.render("shop/product-detail.ejs", {
        pageTitle: products.title,
        path: `/products`,
        product: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log("getIndex", err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  // name used in html (on input)
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product._id);
    })
    .then(() => {
      console.log("Product added to cart");
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCardDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(() => {
      console.log("Item deleted");
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrders = (req, res, next) => {
  let fetchCart;
  req.user
    .addOrder()
    .then(() => res.redirect("/orders"))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders() 
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
