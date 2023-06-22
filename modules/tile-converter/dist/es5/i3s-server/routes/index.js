"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var express = require('express');
var router = express.Router();
var _require = require('../controllers/index-controller'),
  getFileNameByUrl = _require.getFileNameByUrl;
router.get('*', function () {
  var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(req, res, next) {
    var fileName;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return getFileNameByUrl(req.path);
        case 2:
          fileName = _context.sent;
          if (fileName) {
            res.sendFile(fileName);
          } else {
            res.status(404);
            res.send('File not found');
          }
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());
module.exports = router;
//# sourceMappingURL=index.js.map