const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;
// Connect to clould mongoDB instance
const mongoConnect = (callback) => {
  MongoClient.connect(
    // mongo will connect to provided database <dbname>, if db is not available then it will create it.
    "mongodb+srv://farhan:MX5XOhPW8MYkaND1@cluster0.mtvre.mongodb.net/shop?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  )
    .then((client) => {
      console.log("Connected");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// Instance of connected database
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
