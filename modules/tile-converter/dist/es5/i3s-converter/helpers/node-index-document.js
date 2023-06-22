"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NodeIndexDocument = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _path = require("path");
var _jsonMapTransform = _interopRequireDefault(require("json-map-transform"));
var _uuid = require("uuid");
var _fileUtils = require("../../lib/utils/file-utils");
var _node = require("../json-templates/node");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var NodeIndexDocument = function () {
  function NodeIndexDocument(id, converter) {
    (0, _classCallCheck2.default)(this, NodeIndexDocument);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "inPageId", void 0);
    (0, _defineProperty2.default)(this, "data", null);
    (0, _defineProperty2.default)(this, "children", []);
    (0, _defineProperty2.default)(this, "converter", void 0);
    this.inPageId = id;
    this.id = id === 0 ? 'root' : id.toString();
    this.converter = converter;
  }
  (0, _createClass2.default)(NodeIndexDocument, [{
    key: "addData",
    value: function () {
      var _addData = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!this.converter.options.instantNodeWriting) {
                _context.next = 5;
                break;
              }
              _context.next = 3;
              return this.write(data);
            case 3:
              _context.next = 6;
              break;
            case 5:
              this.data = data;
            case 6:
              return _context.abrupt("return", this);
            case 7:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function addData(_x) {
        return _addData.apply(this, arguments);
      }
      return addData;
    }()
  }, {
    key: "addChildren",
    value: function () {
      var _addChildren = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(childNodes) {
        var newChildren, _iterator, _step, node, nodeData, data, _data$children;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              newChildren = [];
              _iterator = _createForOfIteratorHelper(childNodes);
              _context2.prev = 2;
              _iterator.s();
            case 4:
              if ((_step = _iterator.n()).done) {
                _context2.next = 12;
                break;
              }
              node = _step.value;
              _context2.next = 8;
              return node.load();
            case 8:
              nodeData = _context2.sent;
              newChildren.push({
                id: node.id,
                href: "../".concat(node.id),
                obb: nodeData.obb,
                mbs: nodeData.mbs
              });
            case 10:
              _context2.next = 4;
              break;
            case 12:
              _context2.next = 17;
              break;
            case 14:
              _context2.prev = 14;
              _context2.t0 = _context2["catch"](2);
              _iterator.e(_context2.t0);
            case 17:
              _context2.prev = 17;
              _iterator.f();
              return _context2.finish(17);
            case 20:
              this.children = this.children.concat(childNodes);
              data = this.data;
              if (!this.converter.options.instantNodeWriting) {
                _context2.next = 26;
                break;
              }
              _context2.next = 25;
              return this.load();
            case 25:
              data = _context2.sent;
            case 26:
              if (data) {
                data.children = (_data$children = data.children) !== null && _data$children !== void 0 ? _data$children : [];
                data.children = data.children.concat(newChildren);
              }
              if (!(this.converter.options.instantNodeWriting && data)) {
                _context2.next = 30;
                break;
              }
              _context2.next = 30;
              return this.write(data);
            case 30:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[2, 14, 17, 20]]);
      }));
      function addChildren(_x2) {
        return _addChildren.apply(this, arguments);
      }
      return addChildren;
    }()
  }, {
    key: "addNeighbors",
    value: function () {
      var _addNeighbors = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3() {
        var nodeData, _iterator2, _step2, _childNodeData$neighb, _nodeData$children, childNode, childNodeData, _iterator3, _step3, neighbor;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.load();
            case 2:
              nodeData = _context3.sent;
              _iterator2 = _createForOfIteratorHelper(this.children);
              _context3.prev = 4;
              _iterator2.s();
            case 6:
              if ((_step2 = _iterator2.n()).done) {
                _context3.next = 43;
                break;
              }
              childNode = _step2.value;
              _context3.next = 10;
              return childNode.load();
            case 10:
              childNodeData = _context3.sent;
              childNodeData.neighbors = (_childNodeData$neighb = childNodeData.neighbors) !== null && _childNodeData$neighb !== void 0 ? _childNodeData$neighb : [];
              if (!(Number(nodeData === null || nodeData === void 0 ? void 0 : (_nodeData$children = nodeData.children) === null || _nodeData$children === void 0 ? void 0 : _nodeData$children.length) < 1000)) {
                _context3.next = 33;
                break;
              }
              _iterator3 = _createForOfIteratorHelper(nodeData.children || []);
              _context3.prev = 14;
              _iterator3.s();
            case 16:
              if ((_step3 = _iterator3.n()).done) {
                _context3.next = 23;
                break;
              }
              neighbor = _step3.value;
              if (!(childNode.id === neighbor.id)) {
                _context3.next = 20;
                break;
              }
              return _context3.abrupt("continue", 21);
            case 20:
              childNodeData.neighbors.push(_objectSpread({}, neighbor));
            case 21:
              _context3.next = 16;
              break;
            case 23:
              _context3.next = 28;
              break;
            case 25:
              _context3.prev = 25;
              _context3.t0 = _context3["catch"](14);
              _iterator3.e(_context3.t0);
            case 28:
              _context3.prev = 28;
              _iterator3.f();
              return _context3.finish(28);
            case 31:
              _context3.next = 35;
              break;
            case 33:
              console.warn("Node ".concat(childNode.id, ": neighbors attribute is omited because of large number of neigbors"));
              delete childNodeData.neighbors;
            case 35:
              if (!(this.converter.options.instantNodeWriting && childNodeData)) {
                _context3.next = 38;
                break;
              }
              _context3.next = 38;
              return childNode.write(childNodeData);
            case 38:
              _context3.next = 40;
              return childNode.save();
            case 40:
              childNode.flush();
            case 41:
              _context3.next = 6;
              break;
            case 43:
              _context3.next = 48;
              break;
            case 45:
              _context3.prev = 45;
              _context3.t1 = _context3["catch"](4);
              _iterator2.e(_context3.t1);
            case 48:
              _context3.prev = 48;
              _iterator2.f();
              return _context3.finish(48);
            case 51:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[4, 45, 48, 51], [14, 25, 28, 31]]);
      }));
      function addNeighbors() {
        return _addNeighbors.apply(this, arguments);
      }
      return addNeighbors;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4() {
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!this.data) {
                _context4.next = 3;
                break;
              }
              _context4.next = 3;
              return this.write(this.data);
            case 3:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function save() {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }, {
    key: "write",
    value: function () {
      var _write = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5(node) {
        var _this = this;
        var path;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              path = (0, _path.join)(this.converter.layers0Path, 'nodes', this.id);
              if (!this.converter.options.slpk) {
                _context5.next = 6;
                break;
              }
              _context5.next = 4;
              return this.converter.writeQueue.enqueue({
                archiveKey: "nodes/".concat(this.id, "/3dNodeIndexDocument.json.gz"),
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFileForSlpk)(path, JSON.stringify(node), '3dNodeIndexDocument.json', true, _this.converter.compressList);
                }
              }, true);
            case 4:
              _context5.next = 8;
              break;
            case 6:
              _context5.next = 8;
              return this.converter.writeQueue.enqueue({
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFile)(path, JSON.stringify(node));
                }
              }, true);
            case 8:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function write(_x3) {
        return _write.apply(this, arguments);
      }
      return write;
    }()
  }, {
    key: "load",
    value: function () {
      var _load = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee6() {
        var path, parentNodePath, parentNodeFileName;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (!this.data) {
                _context6.next = 2;
                break;
              }
              return _context6.abrupt("return", this.data);
            case 2:
              path = this.id;
              parentNodePath = (0, _path.join)(this.converter.layers0Path, 'nodes', path);
              parentNodeFileName = 'index.json';
              if (this.converter.options.slpk) {
                parentNodeFileName = '3dNodeIndexDocument.json';
              }
              _context6.next = 8;
              return (0, _fileUtils.openJson)(parentNodePath, parentNodeFileName);
            case 8:
              return _context6.abrupt("return", _context6.sent);
            case 9:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function load() {
        return _load.apply(this, arguments);
      }
      return load;
    }()
  }, {
    key: "flush",
    value: function flush() {
      this.data = null;
    }
  }], [{
    key: "createRootNode",
    value: function () {
      var _createRootNode = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee7(boundingVolumes, converter) {
        var rootData, rootNode;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              rootData = NodeIndexDocument.createRootNodeIndexDocument(boundingVolumes);
              _context7.next = 3;
              return new NodeIndexDocument(0, converter).addData(rootData);
            case 3:
              rootNode = _context7.sent;
              return _context7.abrupt("return", rootNode);
            case 5:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function createRootNode(_x4, _x5) {
        return _createRootNode.apply(this, arguments);
      }
      return createRootNode;
    }()
  }, {
    key: "createNode",
    value: function () {
      var _createNode = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee8(parentNode, boundingVolumes, lodSelection, nodeInPage, resources, converter) {
        var data, node;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return NodeIndexDocument.createNodeIndexDocument(parentNode, boundingVolumes, lodSelection, nodeInPage, resources);
            case 2:
              data = _context8.sent;
              _context8.next = 5;
              return new NodeIndexDocument(nodeInPage.index, converter).addData(data);
            case 5:
              node = _context8.sent;
              return _context8.abrupt("return", node);
            case 7:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      function createNode(_x6, _x7, _x8, _x9, _x10, _x11) {
        return _createNode.apply(this, arguments);
      }
      return createNode;
    }()
  }, {
    key: "createRootNodeIndexDocument",
    value: function createRootNodeIndexDocument(boundingVolumes) {
      var root0data = _objectSpread(_objectSpread({
        version: "{".concat((0, _uuid.v4)().toUpperCase(), "}"),
        id: 'root',
        level: 0,
        lodSelection: [{
          metricType: 'maxScreenThresholdSQ',
          maxError: 0
        }, {
          metricType: 'maxScreenThreshold',
          maxError: 0
        }]
      }, boundingVolumes), {}, {
        children: []
      });
      return (0, _jsonMapTransform.default)(root0data, (0, _node.NODE)());
    }
  }, {
    key: "createNodeIndexDocument",
    value: function () {
      var _createNodeIndexDocument = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee9(parentNode, boundingVolumes, lodSelection, nodeInPage, resources) {
        var texture, attributes, nodeId, parentNodeData, nodeData, node, _parentNode$converter, _parentNode$converter2, index, folderName;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              texture = resources.texture, attributes = resources.attributes;
              nodeId = nodeInPage.index;
              _context9.next = 4;
              return parentNode.load();
            case 4:
              parentNodeData = _context9.sent;
              nodeData = _objectSpread(_objectSpread({
                version: parentNodeData.version,
                id: nodeId.toString(),
                level: parentNodeData.level + 1
              }, boundingVolumes), {}, {
                lodSelection: lodSelection,
                parentNode: {
                  id: parentNode.id,
                  href: "../".concat(parentNode.id),
                  mbs: parentNodeData.mbs,
                  obb: parentNodeData.obb
                },
                children: [],
                neighbors: []
              });
              node = (0, _jsonMapTransform.default)(nodeData, (0, _node.NODE)());
              if (nodeInPage.mesh) {
                node.geometryData = [{
                  href: './geometries/0'
                }];
                node.sharedResource = {
                  href: './shared'
                };
                if (texture) {
                  node.textureData = [{
                    href: './textures/0'
                  }, {
                    href: './textures/1'
                  }];
                }
                if (attributes && attributes.length && (_parentNode$converter = parentNode.converter.layers0) !== null && _parentNode$converter !== void 0 && (_parentNode$converter2 = _parentNode$converter.attributeStorageInfo) !== null && _parentNode$converter2 !== void 0 && _parentNode$converter2.length) {
                  node.attributeData = [];
                  for (index = 0; index < attributes.length; index++) {
                    folderName = parentNode.converter.layers0.attributeStorageInfo[index].key;
                    node.attributeData.push({
                      href: "./attributes/".concat(folderName, "/0")
                    });
                  }
                }
              }
              return _context9.abrupt("return", node);
            case 9:
            case "end":
              return _context9.stop();
          }
        }, _callee9);
      }));
      function createNodeIndexDocument(_x12, _x13, _x14, _x15, _x16) {
        return _createNodeIndexDocument.apply(this, arguments);
      }
      return createNodeIndexDocument;
    }()
  }]);
  return NodeIndexDocument;
}();
exports.NodeIndexDocument = NodeIndexDocument;
//# sourceMappingURL=node-index-document.js.map