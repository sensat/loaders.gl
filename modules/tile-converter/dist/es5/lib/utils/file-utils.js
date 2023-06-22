"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAbsoluteFilePath = getAbsoluteFilePath;
exports.isFileExists = isFileExists;
exports.openJson = openJson;
exports.removeDir = removeDir;
exports.removeFile = removeFile;
exports.writeFile = writeFile;
exports.writeFileForSlpk = writeFileForSlpk;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _core = require("@loaders.gl/core");
var _loaderUtils = require("@loaders.gl/loader-utils");
var _fs = require("fs");
var _path = require("path");
var _compressUtil = require("./compress-util");
function writeFile(_x, _x2) {
  return _writeFile.apply(this, arguments);
}
function _writeFile() {
  _writeFile = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(path, data) {
    var fileName,
      toWriteData,
      pathFile,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          fileName = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'index.json';
          if (!(data instanceof Promise)) {
            _context.next = 9;
            break;
          }
          _context.t0 = Uint8Array;
          _context.next = 5;
          return data;
        case 5:
          _context.t1 = _context.sent;
          toWriteData = new _context.t0(_context.t1);
          _context.next = 10;
          break;
        case 9:
          if (data instanceof ArrayBuffer) {
            toWriteData = new Uint8Array(data);
          } else {
            toWriteData = data;
          }
        case 10:
          _context.next = 12;
          return _fs.promises.mkdir(path, {
            recursive: true
          });
        case 12:
          pathFile = (0, _path.join)(path, fileName);
          _context.prev = 13;
          _context.next = 16;
          return _fs.promises.writeFile(pathFile, toWriteData);
        case 16:
          _context.next = 21;
          break;
        case 18:
          _context.prev = 18;
          _context.t2 = _context["catch"](13);
          throw _context.t2;
        case 21:
          console.log("".concat(pathFile, " saved."));
          return _context.abrupt("return", pathFile);
        case 23:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[13, 18]]);
  }));
  return _writeFile.apply(this, arguments);
}
function writeFileForSlpk(_x3, _x4) {
  return _writeFileForSlpk.apply(this, arguments);
}
function _writeFileForSlpk() {
  _writeFileForSlpk = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(path, data) {
    var fileName,
      compress,
      compressList,
      pathFile,
      pathGzFile,
      _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          fileName = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 'index.json';
          compress = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : true;
          compressList = _args2.length > 4 ? _args2[4] : undefined;
          _context2.next = 5;
          return writeFile(path, data, fileName);
        case 5:
          pathFile = _context2.sent;
          if (!compress) {
            _context2.next = 22;
            break;
          }
          if (!compressList) {
            _context2.next = 16;
            break;
          }
          if (compressList.includes(pathFile)) {
            _context2.next = 13;
            break;
          }
          compressList.push(pathFile);
          return _context2.abrupt("return", "".concat(pathFile, ".gz"));
        case 13:
          return _context2.abrupt("return", null);
        case 14:
          _context2.next = 22;
          break;
        case 16:
          _context2.next = 18;
          return (0, _compressUtil.compressFileWithGzip)(pathFile);
        case 18:
          pathGzFile = _context2.sent;
          _context2.next = 21;
          return removeFile(pathFile);
        case 21:
          return _context2.abrupt("return", pathGzFile);
        case 22:
          return _context2.abrupt("return", pathFile);
        case 23:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _writeFileForSlpk.apply(this, arguments);
}
function openJson(_x5, _x6) {
  return _openJson.apply(this, arguments);
}
function _openJson() {
  _openJson = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(path, fileName) {
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", new Promise(function (resolve, reject) {
            var count = 0;
            console.log("load ".concat(path, "/").concat(fileName, "."));
            var intervalId = setInterval(function () {
              var pathFile = (0, _path.join)(path, fileName);
              (0, _core.load)(pathFile, _loaderUtils.JSONLoader).then(function (result) {
                clearInterval(intervalId);
                resolve(result);
              }).catch(function () {
                count++;
                if (count > 100) {
                  clearInterval(intervalId);
                  reject(new Error("Cannon load ".concat(path, "/").concat(fileName, ".")));
                }
              });
            }, 200);
          }));
        case 1:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _openJson.apply(this, arguments);
}
function isFileExists(_x7) {
  return _isFileExists.apply(this, arguments);
}
function _isFileExists() {
  _isFileExists = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4(fileName) {
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return _fs.promises.stat(fileName);
        case 3:
          return _context4.abrupt("return", true);
        case 6:
          _context4.prev = 6;
          _context4.t0 = _context4["catch"](0);
          return _context4.abrupt("return", false);
        case 9:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[0, 6]]);
  }));
  return _isFileExists.apply(this, arguments);
}
function removeDir(path) {
  return _fs.promises.rm(path, {
    recursive: true
  });
}
function removeFile(path) {
  return _fs.promises.unlink(path);
}
function getAbsoluteFilePath(filePath) {
  return (0, _path.isAbsolute)(filePath) ? filePath : (0, _path.join)(process.cwd(), filePath);
}
//# sourceMappingURL=file-utils.js.map