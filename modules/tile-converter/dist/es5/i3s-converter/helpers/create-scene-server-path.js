"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSceneServerPath = createSceneServerPath;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _uuid = require("uuid");
var _jsonMapTransform = _interopRequireDefault(require("json-map-transform"));
var _path = require("path");
var _sceneServer = require("../json-templates/scene-server");
var _fileUtils = require("../../lib/utils/file-utils");
function createSceneServerPath(_x, _x2, _x3) {
  return _createSceneServerPath.apply(this, arguments);
}
function _createSceneServerPath() {
  _createSceneServerPath = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(layerName, layers0, rootPath) {
    var sceneServerData, sceneServer, nodePagePath;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          sceneServerData = {
            serviceItemId: (0, _uuid.v4)().replace(/-/gi, ''),
            layerName: layerName,
            layers0: layers0
          };
          sceneServer = (0, _jsonMapTransform.default)(sceneServerData, (0, _sceneServer.SCENE_SERVER)());
          nodePagePath = (0, _path.join)(rootPath, 'SceneServer');
          _context.next = 5;
          return (0, _fileUtils.writeFile)(nodePagePath, JSON.stringify(sceneServer));
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _createSceneServerPath.apply(this, arguments);
}
//# sourceMappingURL=create-scene-server-path.js.map