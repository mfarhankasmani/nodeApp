const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});
// extend mangoose schema with custom methods
userSchema.methods.addToCart = function (productId) {
  const updateCartItems = [...this.cart.items];

  const cartProductIndex = this.cart.items.findIndex((cp) => {
    return cp.productId.toString() == productId.toString();
  });

  if (cartProductIndex >= 0) {
    updateCartItems[cartProductIndex].quantity =
      this.cart.items[cartProductIndex].quantity + 1;
  } else {
    updateCartItems.push({ productId: productId, quantity: 1 });
  }
  this.cart = { items: updateCartItems };
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updateCartItems = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  this.cart.items = updateCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};

// const { getDb } = require("../util/database");
// const { ObjectId } = require("mongodb");
// const { productsCollection } = require("./product");

// const usersCollection = () => {
//   const db = getDb();
//   return db.collection("users");
// };

// const ordersCollection = () => {
//   const db = getDb();
//   return db.collection("orders");
// };

// // adding cart to user
// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // it is an object with items array {items:[]}
//     this._id = id ? new ObjectId(id) : undefined;
//   }

//   save() {
//     return usersCollection().insertOne(this);
//   }

//   updateCart = (updateCartItems = []) => {
//     return usersCollection().updateOne(
//       { _id: this._id },
//       { $set: { cart: { items: updateCartItems } } }
//     );
//   };

//   addToCart(productId) {
//     const updateCartItems = [...this.cart.items];

//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() == productId.toString();
//     });

//     if (cartProductIndex >= 0) {
//       updateCartItems[cartProductIndex].quantity =
//         this.cart.items[cartProductIndex].quantity + 1;
//     } else {
//       updateCartItems.push({ productId: new ObjectId(productId), quantity: 1 });
//     }

//     return this.updateCart(updateCartItems);
//   }

//   getCart() {
//     // this.cart is only have productIds. hence we need to transform the data to populate product details
//     const productIds = this.cart.items.map((item) => item.productId);
//     return productsCollection()
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         // merging data from products and users collection
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(
//               (item) => item.productId.toString() === product._id.toString()
//             ).quantity,
//           };
//         });
//       })
//       .catch((err) => console.log("Unable to getCart", { err }));
//   }

//   deleteItemFromCart(productId) {
//     const updateCartItems = this.cart.items.filter(
//       (item) => item.productId.toString() !== productId.toString()
//     );

//     return this.updateCart(updateCartItems);
//   }

//   addOrder() {
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: this._id,
//             name: this.name,
//             email: this.email,
//           },
//         };
//         return ordersCollection().insertOne(order);
//       })
//       .then(() => {
//         console.log("order created");
//         // clearing the cart data in class
//         this.cart = { items: [] };
//         // clear cart in database
//         return this.updateCart();
//       });
//   }

//   getOrders() {
//     return ordersCollection().find({ "user._id": this._id }).toArray();
//   }

//   static findByPk(userId) {
//     return usersCollection().findOne({ _id: new ObjectId(userId) });
//   }
// }

// exports.usersCollection = usersCollection;
// exports.ordersCollection = ordersCollection;
exports.User = mongoose.model("User", userSchema);
