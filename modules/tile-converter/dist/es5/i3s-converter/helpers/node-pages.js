"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _path = require("path");
var _jsonMapTransform = _interopRequireDefault(require("json-map-transform"));
var _metadata = require("../json-templates/metadata");
var _fileUtils = require("../../lib/utils/file-utils");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var NodePages = function () {
  function NodePages(writeFileFunc, nodesPerPage, converter) {
    (0, _classCallCheck2.default)(this, NodePages);
    (0, _defineProperty2.default)(this, "nodesPerPage", void 0);
    (0, _defineProperty2.default)(this, "nodesCounter", void 0);
    (0, _defineProperty2.default)(this, "writeFile", void 0);
    (0, _defineProperty2.default)(this, "converter", void 0);
    (0, _defineProperty2.default)(this, "nodePages", void 0);
    (0, _defineProperty2.default)(this, "length", 0);
    this.nodesPerPage = nodesPerPage;
    this.nodesCounter = 0;
    this.nodePages = [{}];
    this.nodePages[0].nodes = [];
    this.writeFile = writeFileFunc;
    this.converter = converter;
    this.length = 0;
  }
  (0, _createClass2.default)(NodePages, [{
    key: "useWriteFunction",
    value: function useWriteFunction(func) {
      this.writeFile = func;
    }
  }, {
    key: "getNodePageFileName",
    value: function getNodePageFileName(nodePageId) {
      var filePath;
      var fileName;
      if (this.converter.options.slpk) {
        filePath = (0, _path.join)(this.converter.layers0Path, 'nodepages');
        fileName = "".concat(nodePageId.toString(), ".json");
      } else {
        filePath = (0, _path.join)(this.converter.layers0Path, 'nodepages', nodePageId.toString());
        fileName = 'index.json';
      }
      return {
        filePath: filePath,
        fileName: fileName
      };
    }
  }, {
    key: "loadNodePage",
    value: function () {
      var _loadNodePage = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(nodePageId) {
        var _this$getNodePageFile, filePath, fileName, fullName;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _this$getNodePageFile = this.getNodePageFileName(nodePageId), filePath = _this$getNodePageFile.filePath, fileName = _this$getNodePageFile.fileName;
              fullName = (0, _path.join)(filePath, fileName);
              _context.next = 4;
              return (0, _fileUtils.isFileExists)(fullName);
            case 4:
              if (!_context.sent) {
                _context.next = 11;
                break;
              }
              console.log("load ".concat(fullName, "."));
              _context.next = 8;
              return (0, _fileUtils.openJson)(filePath, fileName);
            case 8:
              return _context.abrupt("return", _context.sent);
            case 11:
              return _context.abrupt("return", {
                nodes: []
              });
            case 12:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function loadNodePage(_x) {
        return _loadNodePage.apply(this, arguments);
      }
      return loadNodePage;
    }()
  }, {
    key: "getPageIndexByNodeId",
    value: function getPageIndexByNodeId(id) {
      return Math.floor(id / this.nodesPerPage);
    }
  }, {
    key: "getPageByNodeId",
    value: function () {
      var _getPageByNodeId = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(id) {
        var pageIndex;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              pageIndex = this.getPageIndexByNodeId(id);
              if (!this.converter.options.instantNodeWriting) {
                _context2.next = 5;
                break;
              }
              _context2.next = 4;
              return this.loadNodePage(pageIndex);
            case 4:
              return _context2.abrupt("return", _context2.sent);
            case 5:
              return _context2.abrupt("return", this.nodePages[pageIndex]);
            case 6:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function getPageByNodeId(_x2) {
        return _getPageByNodeId.apply(this, arguments);
      }
      return getPageByNodeId;
    }()
  }, {
    key: "getNodeById",
    value: function () {
      var _getNodeById = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(id, nodePage) {
        var nodeIndex;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              nodeIndex = id % this.nodesPerPage;
              _context3.t0 = nodePage;
              if (_context3.t0) {
                _context3.next = 6;
                break;
              }
              _context3.next = 5;
              return this.getPageByNodeId(id);
            case 5:
              _context3.t0 = _context3.sent;
            case 6:
              nodePage = _context3.t0;
              return _context3.abrupt("return", nodePage.nodes[nodeIndex]);
            case 8:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function getNodeById(_x3, _x4) {
        return _getNodeById.apply(this, arguments);
      }
      return getNodeById;
    }()
  }, {
    key: "addChildRelation",
    value: function () {
      var _addChildRelation = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4(parentId, childId) {
        var _parentNode$children;
        var parentNode;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!(parentId === null || parentId === undefined)) {
                _context4.next = 2;
                break;
              }
              return _context4.abrupt("return");
            case 2:
              _context4.next = 4;
              return this.getNodeById(parentId);
            case 4:
              parentNode = _context4.sent;
              (_parentNode$children = parentNode.children) === null || _parentNode$children === void 0 ? void 0 : _parentNode$children.push(childId);
              _context4.next = 8;
              return this.saveNode(parentNode);
            case 8:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function addChildRelation(_x5, _x6) {
        return _addChildRelation.apply(this, arguments);
      }
      return addChildRelation;
    }()
  }, {
    key: "push",
    value: function () {
      var _push = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5(node, parentId) {
        var currentNodePage;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              node.index = this.nodesCounter++;
              if (!this.converter.options.instantNodeWriting) {
                currentNodePage = this.nodePages[this.nodePages.length - 1];
                if (currentNodePage.nodes.length === this.nodesPerPage) {
                  currentNodePage = {
                    nodes: []
                  };
                  this.nodePages.push(currentNodePage);
                }
                currentNodePage.nodes.push(node);
              }
              _context5.next = 4;
              return this.addChildRelation(parentId, node.index);
            case 4:
              NodePages.updateResourceInMesh(node);
              _context5.next = 7;
              return this.saveNode(node);
            case 7:
              return _context5.abrupt("return", node);
            case 8:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function push(_x7, _x8) {
        return _push.apply(this, arguments);
      }
      return push;
    }()
  }, {
    key: "saveNode",
    value: function () {
      var _saveNode = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee6(node) {
        var _this = this;
        var nodePageIndex, nodePage, _this$getNodePageFile2, filePath, fileName, nodeToUpdate, nodePageStr;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              if (this.converter.options.instantNodeWriting) {
                _context6.next = 4;
                break;
              }
              return _context6.abrupt("return");
            case 4:
              nodePageIndex = this.getPageIndexByNodeId(node.index);
              _context6.next = 7;
              return this.getPageByNodeId(node.index);
            case 7:
              nodePage = _context6.sent;
              _this$getNodePageFile2 = this.getNodePageFileName(nodePageIndex), filePath = _this$getNodePageFile2.filePath, fileName = _this$getNodePageFile2.fileName;
              _context6.next = 11;
              return this.getNodeById(node.index, nodePage);
            case 11:
              nodeToUpdate = _context6.sent;
              if (nodeToUpdate) {
                NodePages.updateAll(nodeToUpdate, node);
              } else {
                nodePage.nodes.push(node);
              }
              nodePageStr = JSON.stringify(nodePage);
              if (!this.converter.options.slpk) {
                _context6.next = 19;
                break;
              }
              _context6.next = 17;
              return this.converter.writeQueue.enqueue({
                archiveKey: "nodePages/".concat(nodePageIndex.toString(), ".json.gz"),
                writePromise: function writePromise() {
                  return _this.writeFile(filePath, nodePageStr, fileName, true, _this.converter.compressList);
                }
              }, true);
            case 17:
              _context6.next = 21;
              break;
            case 19:
              _context6.next = 21;
              return this.converter.writeQueue.enqueue({
                writePromise: function writePromise() {
                  return _this.writeFile(filePath, nodePageStr);
                }
              }, true);
            case 21:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function saveNode(_x9) {
        return _saveNode.apply(this, arguments);
      }
      return saveNode;
    }()
  }, {
    key: "saveMetadata",
    value: function () {
      var _saveMetadata = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee7() {
        var _this2 = this;
        var metadata, compress;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              metadata = (0, _jsonMapTransform.default)({
                nodeCount: this.nodesCounter
              }, (0, _metadata.METADATA)());
              compress = false;
              _context7.next = 4;
              return this.converter.writeQueue.enqueue({
                archiveKey: 'metadata.json',
                writePromise: function writePromise() {
                  return _this2.writeFile(_this2.converter.layers0Path, JSON.stringify(metadata), 'metadata.json', compress);
                }
              });
            case 4:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function saveMetadata() {
        return _saveMetadata.apply(this, arguments);
      }
      return saveMetadata;
    }()
  }, {
    key: "save",
    value: function () {
      var _save = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee8() {
        var _this3 = this;
        var _iterator, _step, _loop, _iterator2, _step2, _loop2;
        return _regenerator.default.wrap(function _callee8$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              if (!this.converter.options.instantNodeWriting) {
                _context10.next = 4;
                break;
              }
              _context10.next = 3;
              return this.saveMetadata();
            case 3:
              return _context10.abrupt("return");
            case 4:
              if (!this.converter.options.slpk) {
                _context10.next = 25;
                break;
              }
              _iterator = _createForOfIteratorHelper(this.nodePages.entries());
              _context10.prev = 6;
              _loop = _regenerator.default.mark(function _loop() {
                var _step$value, index, nodePage, nodePageStr, slpkPath;
                return _regenerator.default.wrap(function _loop$(_context8) {
                  while (1) switch (_context8.prev = _context8.next) {
                    case 0:
                      _step$value = (0, _slicedToArray2.default)(_step.value, 2), index = _step$value[0], nodePage = _step$value[1];
                      nodePageStr = JSON.stringify(nodePage);
                      slpkPath = (0, _path.join)(_this3.converter.layers0Path, 'nodepages');
                      _context8.next = 5;
                      return _this3.converter.writeQueue.enqueue({
                        archiveKey: "nodePages/".concat(index.toString(), ".json.gz"),
                        writePromise: function writePromise() {
                          return _this3.writeFile(slpkPath, nodePageStr, "".concat(index.toString(), ".json"));
                        }
                      });
                    case 5:
                    case "end":
                      return _context8.stop();
                  }
                }, _loop);
              });
              _iterator.s();
            case 9:
              if ((_step = _iterator.n()).done) {
                _context10.next = 13;
                break;
              }
              return _context10.delegateYield(_loop(), "t0", 11);
            case 11:
              _context10.next = 9;
              break;
            case 13:
              _context10.next = 18;
              break;
            case 15:
              _context10.prev = 15;
              _context10.t1 = _context10["catch"](6);
              _iterator.e(_context10.t1);
            case 18:
              _context10.prev = 18;
              _iterator.f();
              return _context10.finish(18);
            case 21:
              _context10.next = 23;
              return this.saveMetadata();
            case 23:
              _context10.next = 41;
              break;
            case 25:
              _iterator2 = _createForOfIteratorHelper(this.nodePages.entries());
              _context10.prev = 26;
              _loop2 = _regenerator.default.mark(function _loop2() {
                var _step2$value, index, nodePage, nodePageStr, nodePagePath;
                return _regenerator.default.wrap(function _loop2$(_context9) {
                  while (1) switch (_context9.prev = _context9.next) {
                    case 0:
                      _step2$value = (0, _slicedToArray2.default)(_step2.value, 2), index = _step2$value[0], nodePage = _step2$value[1];
                      nodePageStr = JSON.stringify(nodePage);
                      nodePagePath = (0, _path.join)(_this3.converter.layers0Path, 'nodepages', index.toString());
                      _context9.next = 5;
                      return _this3.converter.writeQueue.enqueue({
                        writePromise: function writePromise() {
                          return _this3.writeFile(nodePagePath, nodePageStr);
                        }
                      });
                    case 5:
                    case "end":
                      return _context9.stop();
                  }
                }, _loop2);
              });
              _iterator2.s();
            case 29:
              if ((_step2 = _iterator2.n()).done) {
                _context10.next = 33;
                break;
              }
              return _context10.delegateYield(_loop2(), "t2", 31);
            case 31:
              _context10.next = 29;
              break;
            case 33:
              _context10.next = 38;
              break;
            case 35:
              _context10.prev = 35;
              _context10.t3 = _context10["catch"](26);
              _iterator2.e(_context10.t3);
            case 38:
              _context10.prev = 38;
              _iterator2.f();
              return _context10.finish(38);
            case 41:
            case "end":
              return _context10.stop();
          }
        }, _callee8, this, [[6, 15, 18, 21], [26, 35, 38, 41]]);
      }));
      function save() {
        return _save.apply(this, arguments);
      }
      return save;
    }()
  }], [{
    key: "updateResourceInMesh",
    value: function updateResourceInMesh(node) {
      if (node.mesh && isFinite(node.index)) {
        node.mesh.geometry.resource = node.index;
      }
    }
  }, {
    key: "updateAll",
    value: function updateAll(node, data) {
      Object.assign(node, data, {
        index: node.index
      });
      NodePages.updateResourceInMesh(node);
      return node;
    }
  }, {
    key: "updateMaterialByNodeId",
    value: function updateMaterialByNodeId(node, materialId) {
      if (!node.mesh) {
        return;
      }
      node.mesh.material = {
        definition: materialId,
        resource: node.index
      };
    }
  }, {
    key: "updateVertexCountByNodeId",
    value: function updateVertexCountByNodeId(node, vertexCount) {
      if (!node.mesh) {
        return;
      }
      node.mesh.geometry.vertexCount = vertexCount;
    }
  }, {
    key: "updateNodeAttributeByNodeId",
    value: function updateNodeAttributeByNodeId(node) {
      if (!node.mesh || !node.index) {
        return;
      }
      node.mesh.attribute.resource = node.index;
    }
  }, {
    key: "updateFeatureCountByNodeId",
    value: function updateFeatureCountByNodeId(node, featureCount) {
      if (!node.mesh) {
        return;
      }
      node.mesh.geometry.featureCount = featureCount;
    }
  }, {
    key: "updateTexelCountHintByNodeId",
    value: function updateTexelCountHintByNodeId(node, texelCountHint) {
      if (!node.mesh || !node.mesh.material) {
        return;
      }
      node.mesh.material.texelCountHint = texelCountHint;
    }
  }]);
  return NodePages;
}();
exports.default = NodePages;
//# sourceMappingURL=node-pages.js.map