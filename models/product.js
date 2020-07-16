const fs = require("fs");
const path = require("path");

const rootDir = require("../util/path");

const p = path.join(rootDir, "data", "products.json");
module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    fs.readFile(p, (err, fileContent) => {
      let products = [];
      // no error then copy the content of file into product array
      if (!err) {
        products = JSON.parse(fileContent);
      }
      // push the current title to product array
      products.push(this);
      // save product array into the file
      fs.writeFile(p, JSON.stringify(products), (err) => {
        console.log({ err });
      });
    });
  }

  // static methods can directly be called on class object, no need for instantiate the class (new key word)
  static fetchAll(callBack) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        callBack([]);
      }
      callBack(JSON.parse(fileContent));
    });
  }
};
