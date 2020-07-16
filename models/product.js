const products = [];

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    products.push(this);
  }

  // static methods can directly be called on class object, no need for instantiate the class (new key word)
  static fetchAll() {
    return products;
  }
};
