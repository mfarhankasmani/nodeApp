const { ObjectId } = require("mongodb");
const { getDb } = require("../util/database");

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new ObjectId(id) : undefined;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // then update the record
      dbOp = db
        .collection("products")
        // update operation in mongoDb
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // insert the record
      dbOp = db.collection("products").insertOne(this);
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
    const db = getDb();
    // fetching all the products -- suitable for small amount of data
    return db
      .collection("products")
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
    const db = getDb();
    return (
      db
        .collection("products")
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
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(prodId) })
      .then(() => {
        console.log("Successfully deleted");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Product;
