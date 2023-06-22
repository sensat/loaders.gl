"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _workerUtils = require("@loaders.gl/worker-utils");
var _b3dmConverter = _interopRequireDefault(require("../3d-tiles-converter/helpers/b3dm-converter"));
var b3dmConverter = new _b3dmConverter.default();
(0, _workerUtils.createWorker)(function () {
  var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data) {
    var options,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          return _context.abrupt("return", b3dmConverter.convert(data, options.featureAttributes));
        case 2:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=3d-tiles-attributes-worker.js.map