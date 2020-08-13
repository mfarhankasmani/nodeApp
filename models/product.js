const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

const productsCollection = () => {
  const db = getDb();
  return db.collection("products");
};
class Product {
  // storing user id reference to product model
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new ObjectId(id) : undefined;
    this.userId = userId;
  }

  save() {
    let dbOp;
    if (this._id) {
      // then update the record
      dbOp = productsCollection()
        // update operation in mongoDb
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // insert the record
      dbOp = productsCollection().insertOne(this);
    }
    return dbOp
      .then(() => {
        console.log("Successfully saved");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    // fetching all the products -- suitable for small amount of data
    return productsCollection()
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        throw err;
      });
  }

  static findByPk(prodId) {
    return (
      productsCollection()
        // id's are not stored in string format
        .find({ _id: new ObjectId(prodId) })
        .next()
        .then((product) => {
          return product;
        })
        .catch((err) => {
          throw err;
        })
    );
  }

  static deleteById(prodId) {
    return productsCollection
      .deleteOne({ _id: new ObjectId(prodId) })
      .then(() => {
        console.log("Successfully deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

exports.productsCollection = productsCollection;
exports.Product = Product;
