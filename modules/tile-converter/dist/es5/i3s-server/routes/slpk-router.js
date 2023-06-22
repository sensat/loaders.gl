"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var express = require('express');
var _require = require('../controllers/slpk-controller'),
  getFileByUrl = _require.getFileByUrl;
var createSceneServer = require('../utils/create-scene-server');
var sceneServerRouter = express.Router();
sceneServerRouter.get('*', function () {
  var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(req, res, next) {
    var file, layer, sceneServerResponse;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return getFileByUrl('/');
        case 2:
          file = _context.sent;
          if (file) {
            layer = JSON.parse(file.toString());
            sceneServerResponse = createSceneServer(layer.name, layer);
            res.send(sceneServerResponse);
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
var router = express.Router();
router.get('*', function () {
  var _ref2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(req, res, next) {
    var file;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req.path);
          _context2.next = 3;
          return getFileByUrl(req.path);
        case 3:
          file = _context2.sent;
          if (file) {
            res.send(file);
          } else {
            res.status(404);
            res.send('File not found');
          }
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
module.exports = {
  sceneServerRouter: sceneServerRouter,
  router: router
};
//# sourceMappingURL=slpk-router.js.map