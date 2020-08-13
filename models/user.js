const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(username, email) {
    (this.name = username), (this.email = email);
  }

  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  static findByPk(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
