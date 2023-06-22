"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.load = load;
exports.osclose = osclose;
exports.osopen = osopen;
exports.oswrite = oswrite;
var _loaderUtils = require("@loaders.gl/loader-utils");
function load(name) {
  return (module || global).require(name);
}
function oswrite(os, buf) {
  return new Promise(function (resolve, reject) {
    os.write(buf, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
function osclose(os) {
  return new Promise(function (resolve, reject) {
    os.close(function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
function osopen(path, opts) {
  return new Promise(function (resolve, reject) {
    var outputStream = _loaderUtils.fs.createWriteStream(path, opts);
    outputStream.once('open', function (fd) {
      return resolve(outputStream);
    });
    outputStream.once('error', function (err) {
      return reject(err);
    });
  });
}
//# sourceMappingURL=file-utils.js.map