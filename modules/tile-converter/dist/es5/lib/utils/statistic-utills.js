"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateFilesSize = calculateFilesSize;
exports.timeConverter = timeConverter;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _path = require("path");
var _fs = require("fs");
var _fileUtils = require("./file-utils");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function timeConverter(time) {
  var nanoSecondsInMillisecond = 1e6;
  var timeInSeconds = time[0];
  var hours = Math.floor(timeInSeconds / 3600);
  timeInSeconds = timeInSeconds - hours * 3600;
  var minutes = Math.floor(timeInSeconds / 60);
  timeInSeconds = timeInSeconds - minutes * 60;
  var seconds = Math.floor(timeInSeconds);
  var milliseconds = time[1] / nanoSecondsInMillisecond;
  var result = '';
  if (hours) {
    result += "".concat(hours, "h ");
  }
  if (minutes) {
    result += "".concat(minutes, "m ");
  }
  if (seconds) {
    result += "".concat(seconds, "s");
  }
  if (!result) {
    result += "".concat(milliseconds, "ms");
  }
  return result;
}
function calculateFilesSize(_x) {
  return _calculateFilesSize.apply(this, arguments);
}
function _calculateFilesSize() {
  _calculateFilesSize = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(params) {
    var slpk, outputPath, tilesetName, fullOutputPath, slpkPath, stat, directoryPath, totalSize;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          slpk = params.slpk, outputPath = params.outputPath, tilesetName = params.tilesetName;
          fullOutputPath = (0, _fileUtils.getAbsoluteFilePath)(outputPath);
          _context.prev = 2;
          if (!slpk) {
            _context.next = 9;
            break;
          }
          slpkPath = (0, _path.join)(fullOutputPath, "".concat(tilesetName, ".slpk"));
          _context.next = 7;
          return _fs.promises.stat(slpkPath);
        case 7:
          stat = _context.sent;
          return _context.abrupt("return", stat.size);
        case 9:
          directoryPath = (0, _path.join)(fullOutputPath, tilesetName);
          _context.next = 12;
          return getTotalFilesSize(directoryPath);
        case 12:
          totalSize = _context.sent;
          return _context.abrupt("return", totalSize);
        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](2);
          console.log('Calculate file sizes error: ', _context.t0);
          return _context.abrupt("return", null);
        case 20:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[2, 16]]);
  }));
  return _calculateFilesSize.apply(this, arguments);
}
function getTotalFilesSize(_x2) {
  return _getTotalFilesSize.apply(this, arguments);
}
function _getTotalFilesSize() {
  _getTotalFilesSize = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(dirPath) {
    var totalFileSize, files, _iterator, _step, file, fileStat;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          totalFileSize = 0;
          _context2.next = 3;
          return _fs.promises.readdir(dirPath);
        case 3:
          files = _context2.sent;
          _iterator = _createForOfIteratorHelper(files);
          _context2.prev = 5;
          _iterator.s();
        case 7:
          if ((_step = _iterator.n()).done) {
            _context2.next = 22;
            break;
          }
          file = _step.value;
          _context2.next = 11;
          return _fs.promises.stat((0, _path.join)(dirPath, file));
        case 11:
          fileStat = _context2.sent;
          if (!fileStat.isDirectory()) {
            _context2.next = 19;
            break;
          }
          _context2.t0 = totalFileSize;
          _context2.next = 16;
          return getTotalFilesSize((0, _path.join)(dirPath, file));
        case 16:
          totalFileSize = _context2.t0 += _context2.sent;
          _context2.next = 20;
          break;
        case 19:
          totalFileSize += fileStat.size;
        case 20:
          _context2.next = 7;
          break;
        case 22:
          _context2.next = 27;
          break;
        case 24:
          _context2.prev = 24;
          _context2.t1 = _context2["catch"](5);
          _iterator.e(_context2.t1);
        case 27:
          _context2.prev = 27;
          _iterator.f();
          return _context2.finish(27);
        case 30:
          return _context2.abrupt("return", totalFileSize);
        case 31:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[5, 24, 27, 30]]);
  }));
  return _getTotalFilesSize.apply(this, arguments);
}
//# sourceMappingURL=statistic-utills.js.map