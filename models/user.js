const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
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

exports.User = mongoose.model("User", userSchema);
