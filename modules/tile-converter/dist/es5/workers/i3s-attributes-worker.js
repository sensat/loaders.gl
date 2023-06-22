"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _workerUtils = require("@loaders.gl/worker-utils");
var _geometryConverter = require("../i3s-converter/helpers/geometry-converter");
(0, _workerUtils.createWorker)(function () {
  var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data) {
    var options,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          _context.next = 3;
          return (0, _geometryConverter.convertAttributes)(data, options.materialAndTextureList, options.useCartesianPositions);
        case 3:
          return _context.abrupt("return", _context.sent);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=i3s-attributes-worker.js.map