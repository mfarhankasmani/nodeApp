const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl);
  product
    .save()
    .then(() => {
      res.redirect("/admin/products");
      console.log("Create product");
    })
    .catch((err) => console.log(err));
};

// exports.getEditProduct = (req, res, next) => {
//   // query params
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect("/");
//   }
//   const prodId = req.params.productId;
//   req.user
//     .getProducts({ where: { id: prodId } }) // this returns an array
//     //Product.findByPk(prodId) // this returns a single obj
//     .then((products) => {
//       if (products.length < 1) {
//         return res.redirect("/");
//       }
//       res.render("admin/edit-product", {
//         pageTitle: "Add Product",
//         path: "/admin/edit-product",
//         editing: editMode,
//         product: products[0],
//       });
//     })
//     .catch((err) => console.log(err));
// };

// update the product in product.json - post call because we will have product details in the request
exports.postEditProduct = (req, res, next) => {
  const reqData = req.body;
  const pId = reqData.productId;
  const title = reqData.title;
  const imageUrl = reqData.imageUrl;
  const description = reqData.description;
  const price = reqData.price;

  Product.findByPk(pId)
    .then((prod) => {
      prod.title = title;
      prod.imageUrl = imageUrl;
      prod.description = description;
      prod.price = price;
      // return a promise which is handle in below then block, catch will catch error for both the promise
      return prod.save();
    })
    .then(() => {
      res.redirect("/products");
      console.log("PRODUCT EDITED");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    //Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const pId = req.body.productId;
  Product.findByPk(pId)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      res.redirect("/products");
      console.log("PRODUCT DELETED");
    })
    .catch((e) => console.log(e));
};
