const { Product } = require("../models/product");
const { validationResult } = require("express-validator");

exports.getAddProduct = (req, res, next) => {
  //route protection
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);
  if (!errors.isEmpty() || !image) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: !image
        ? "Attatched file is not an image."
        : errors.array()[0].msg,
      validationErrors: !image ? [] : errors.array(),
    });
  }

  const imageUrl = image.path;
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user,
  });
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
      console.log("Create product");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      // telling node about the error, so that execution can directly go to error handling middleware
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  // query params
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Add Product",
        path: "/admin/edit-product",
        editing: editMode,
        hasError: false,
        product,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

// update the product in product.json - post call because we will have product details in the request
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: true,
      hasError: true,
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if(image){
        product.imageUrl = image.path;
      }
      return product.save().then((result) => {
        console.log("UPDATED PRODUCT!");
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      console.log("UPDATE Failed!", { err });
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    // .select('title price -_id') // select only provided fields from the product collection (-_id - removes id for returned result)
    //.populate('userId', 'name') // populate details from user collection
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const pId = req.body.productId;
  Product.deleteOne({ _id: pId, userId: req.user._id })
    .then(() => {
      res.redirect("/products");
      console.log("PRODUCT DELETED");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
