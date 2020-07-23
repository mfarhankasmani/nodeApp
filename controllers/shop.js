const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {

      res.render("shop/product-list", {
        prods: rows,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res, next) => {
  // param name should same as the name used in route
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([rows]) => {
      res.render("shop/product-detail.ejs", {
        pageTitle: rows[0].title,
        path: `/products`,
        product: rows[0],
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("shop/index", {
        prods: rows,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((cart) => {
    Product.fetchAll((products) => {
      const cartProduct = [];
      products.forEach((product) => {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProduct.push({ productData: product, qty: cartProductData.qty });
        }
      });
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProduct,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  // name used in html (on input)
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(([rows]) => {
      Cart.addProduct(prodId, rows[0].price);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postCardDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then(([rows]) => {
      Cart.deleteProduct(prodId, rows[0].price);
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
