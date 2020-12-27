// import dependencies
const electron = require("electron");
const path = require("path");
const fs = require("fs");

// define class
class Store {
  constructor(options) {
    console.log("Store was created");
    // 2 options incase we are using this from the renderer process or the main process
    const userDataPath = (electron.app || electron.remote.app).getPath(
      "userData"
    );

    this.path = path.join(userDataPath, options.configName + ".json");
    this.data = parseDataFile(this.path, options.defaults);
  }
  get(key) {
    // key is a string to pull the associated value from the JSON structure
    return this.data[key];
  }
  set(key, val) {
    this.data[key] = val;
    // using synchronus version because we're just working locally
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

// define functions
function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath));
  } catch (err) {
    return defaults;
  }
}

module.exports = Store; // don't forget this line otherwise you can't import it into another module!
