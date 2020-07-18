const path = require('path');

// this gives us the path to the file that is responsible for the path that our application
// is running and this file name is what we put into dir name to get a path to that directory.
module.exports = path.dirname(process.mainModule.filename)