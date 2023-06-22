"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _path = require("path");
var _process = _interopRequireDefault(require("process"));
var _jsonMapTransform = _interopRequireDefault(require("json-map-transform"));
var _core = require("@loaders.gl/core");
var _i3s = require("@loaders.gl/i3s");
var _tiles = require("@loaders.gl/tiles");
var _pgmLoader = require("../pgm-loader");
var _i3sObbTo3dTilesObb = require("./helpers/i3s-obb-to-3d-tiles-obb");
var _lodConversionUtils = require("../lib/utils/lod-conversion-utils");
var _fileUtils = require("../lib/utils/file-utils");
var _statisticUtills = require("../lib/utils/statistic-utills");
var _tileset = require("./json-templates/tileset");
var _coordinateConverter = require("../i3s-converter/helpers/coordinate-converter");
var _dTilesAttributesWorker = require("../3d-tiles-attributes-worker");
var _workerUtils = require("@loaders.gl/worker-utils");
var _constants = require("../constants");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var I3S = 'I3S';
var Tiles3DConverter = function () {
  function Tiles3DConverter() {
    (0, _classCallCheck2.default)(this, Tiles3DConverter);
    (0, _defineProperty2.default)(this, "options", void 0);
    (0, _defineProperty2.default)(this, "tilesetPath", void 0);
    (0, _defineProperty2.default)(this, "vertexCounter", void 0);
    (0, _defineProperty2.default)(this, "conversionStartTime", void 0);
    (0, _defineProperty2.default)(this, "geoidHeightModel", void 0);
    (0, _defineProperty2.default)(this, "sourceTileset", void 0);
    (0, _defineProperty2.default)(this, "attributeStorageInfo", void 0);
    (0, _defineProperty2.default)(this, "workerSource", {});
    this.options = {};
    this.tilesetPath = '';
    this.vertexCounter = 0;
    this.conversionStartTime = [0, 0];
    this.geoidHeightModel = null;
    this.sourceTileset = null;
    this.attributeStorageInfo = null;
    this.workerSource = {};
  }
  (0, _createClass2.default)(Tiles3DConverter, [{
    key: "convert",
    value: function () {
      var _convert = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(options) {
        var inputUrl, outputPath, tilesetName, maxDepth, egmFilePath, sourceTilesetJson, rootNode, rootTile, tileset, workerFarm;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!_core.isBrowser) {
                _context.next = 3;
                break;
              }
              console.log(_constants.BROWSER_ERROR_MESSAGE);
              return _context.abrupt("return", _constants.BROWSER_ERROR_MESSAGE);
            case 3:
              inputUrl = options.inputUrl, outputPath = options.outputPath, tilesetName = options.tilesetName, maxDepth = options.maxDepth, egmFilePath = options.egmFilePath;
              this.conversionStartTime = _process.default.hrtime();
              this.options = {
                maxDepth: maxDepth
              };
              console.log('Loading egm file...');
              _context.next = 9;
              return (0, _core.load)(egmFilePath, _pgmLoader.PGMLoader);
            case 9:
              this.geoidHeightModel = _context.sent;
              console.log('Loading egm file completed!');
              _context.next = 13;
              return this.loadWorkers();
            case 13:
              _context.next = 15;
              return (0, _core.load)(inputUrl, _i3s.I3SLoader, {});
            case 15:
              sourceTilesetJson = _context.sent;
              this.sourceTileset = new _tiles.Tileset3D(sourceTilesetJson, {
                loadOptions: {
                  _nodeWorkers: true,
                  reuseWorkers: true,
                  i3s: {
                    coordinateSystem: _i3s.COORDINATE_SYSTEM.LNGLAT_OFFSETS,
                    decodeTextures: false
                  }
                }
              });
              _context.next = 19;
              return this.sourceTileset.tilesetInitializationPromise;
            case 19:
              rootNode = this.sourceTileset.root;
              if (!rootNode.header.obb) {
                rootNode.header.obb = (0, _coordinateConverter.createObbFromMbs)(rootNode.header.mbs);
              }
              this.tilesetPath = (0, _path.join)("".concat(outputPath), "".concat(tilesetName));
              this.attributeStorageInfo = sourceTilesetJson.attributeStorageInfo;
              _context.prev = 23;
              _context.next = 26;
              return (0, _fileUtils.removeDir)(this.tilesetPath);
            case 26:
              _context.next = 30;
              break;
            case 28:
              _context.prev = 28;
              _context.t0 = _context["catch"](23);
            case 30:
              rootTile = {
                boundingVolume: {
                  box: (0, _i3sObbTo3dTilesObb.i3sObbTo3dTilesObb)(rootNode.header.obb, this.geoidHeightModel)
                },
                geometricError: (0, _lodConversionUtils.convertScreenThresholdToGeometricError)(rootNode),
                children: []
              };
              _context.next = 33;
              return this._addChildren(rootNode, rootTile, 1);
            case 33:
              tileset = (0, _jsonMapTransform.default)({
                root: rootTile
              }, (0, _tileset.TILESET)());
              _context.next = 36;
              return (0, _fileUtils.writeFile)(this.tilesetPath, JSON.stringify(tileset), 'tileset.json');
            case 36:
              this._finishConversion({
                slpk: false,
                outputPath: outputPath,
                tilesetName: tilesetName
              });
              workerFarm = _workerUtils.WorkerFarm.getWorkerFarm({});
              workerFarm.destroy();
            case 39:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[23, 28]]);
      }));
      function convert(_x) {
        return _convert.apply(this, arguments);
      }
      return convert;
    }()
  }, {
    key: "convertChildNode",
    value: function () {
      var _convertChildNode = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(parentSourceNode, parentNode, level, childNodeInfo) {
        var sourceChild, _sourceChild$header, featureAttributes, boundingVolume, child, i3sAttributesData, b3dm;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this._loadChildNode(parentSourceNode, childNodeInfo);
            case 2:
              sourceChild = _context2.sent;
              parentSourceNode.children.push(sourceChild);
              if (!sourceChild.contentUrl) {
                _context2.next = 29;
                break;
              }
              _context2.next = 7;
              return this.sourceTileset._loadTile(sourceChild);
            case 7:
              this.vertexCounter += sourceChild.content.vertexCount;
              featureAttributes = null;
              if (!this.attributeStorageInfo) {
                _context2.next = 13;
                break;
              }
              _context2.next = 12;
              return this._loadChildAttributes(sourceChild, this.attributeStorageInfo);
            case 12:
              featureAttributes = _context2.sent;
            case 13:
              if (!sourceChild.header.obb) {
                sourceChild.header.obb = (0, _coordinateConverter.createObbFromMbs)(sourceChild.header.mbs);
              }
              boundingVolume = {
                box: (0, _i3sObbTo3dTilesObb.i3sObbTo3dTilesObb)(sourceChild.header.obb, this.geoidHeightModel)
              };
              child = {
                boundingVolume: boundingVolume,
                geometricError: (0, _lodConversionUtils.convertScreenThresholdToGeometricError)(sourceChild),
                children: []
              };
              i3sAttributesData = {
                tileContent: sourceChild.content,
                textureFormat: sourceChild === null || sourceChild === void 0 ? void 0 : (_sourceChild$header = sourceChild.header) === null || _sourceChild$header === void 0 ? void 0 : _sourceChild$header.textureFormat
              };
              _context2.next = 19;
              return (0, _dTilesAttributesWorker.transform3DTilesAttributesOnWorker)(i3sAttributesData, {
                source: this.workerSource.tile3dWorkerSource,
                featureAttributes: featureAttributes
              });
            case 19:
              b3dm = _context2.sent;
              child.content = {
                uri: "".concat(sourceChild.id, ".b3dm"),
                boundingVolume: boundingVolume
              };
              _context2.next = 23;
              return (0, _fileUtils.writeFile)(this.tilesetPath, new Uint8Array(b3dm), "".concat(sourceChild.id, ".b3dm"));
            case 23:
              parentNode.children.push(child);
              sourceChild.unloadContent();
              _context2.next = 27;
              return this._addChildren(sourceChild, child, level + 1);
            case 27:
              _context2.next = 31;
              break;
            case 29:
              _context2.next = 31;
              return this._addChildren(sourceChild, parentNode, level + 1);
            case 31:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function convertChildNode(_x2, _x3, _x4, _x5) {
        return _convertChildNode.apply(this, arguments);
      }
      return convertChildNode;
    }()
  }, {
    key: "_addChildren",
    value: function () {
      var _addChildren2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(parentSourceNode, parentNode, level) {
        var promises, _iterator, _step, childNodeInfo;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!(this.options.maxDepth && level > this.options.maxDepth)) {
                _context3.next = 2;
                break;
              }
              return _context3.abrupt("return");
            case 2:
              promises = [];
              _iterator = _createForOfIteratorHelper(parentSourceNode.header.children || []);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  childNodeInfo = _step.value;
                  promises.push(this.convertChildNode(parentSourceNode, parentNode, level, childNodeInfo));
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              _context3.next = 7;
              return Promise.all(promises);
            case 7:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function _addChildren(_x6, _x7, _x8) {
        return _addChildren2.apply(this, arguments);
      }
      return _addChildren;
    }()
  }, {
    key: "_loadChildNode",
    value: function () {
      var _loadChildNode2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4(parentNode, childNodeInfo) {
        var header, _ref, loader, nodeUrl, options;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!this.sourceTileset.tileset.nodePages) {
                _context4.next = 7;
                break;
              }
              console.log("Node conversion: ".concat(childNodeInfo.id));
              _context4.next = 4;
              return this.sourceTileset.tileset.nodePagesTile.formTileFromNodePages(childNodeInfo.id);
            case 4:
              header = _context4.sent;
              _context4.next = 14;
              break;
            case 7:
              _ref = this.sourceTileset, loader = _ref.loader;
              nodeUrl = this._relativeUrlToFullUrl(parentNode.url, childNodeInfo.href);
              options = {
                i3s: _objectSpread(_objectSpread({}, this.sourceTileset.loadOptions), {}, {
                  isTileHeader: true,
                  loadContent: false
                })
              };
              console.log("Node conversion: ".concat(nodeUrl));
              _context4.next = 13;
              return (0, _core.load)(nodeUrl, loader, options);
            case 13:
              header = _context4.sent;
            case 14:
              return _context4.abrupt("return", new _tiles.Tile3D(this.sourceTileset, header, parentNode));
            case 15:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function _loadChildNode(_x9, _x10) {
        return _loadChildNode2.apply(this, arguments);
      }
      return _loadChildNode;
    }()
  }, {
    key: "_relativeUrlToFullUrl",
    value: function _relativeUrlToFullUrl(baseUrl, relativeUrl) {
      var resultArray = baseUrl.split('/');
      var relativeUrlArray = relativeUrl.split('/');
      var _iterator2 = _createForOfIteratorHelper(relativeUrlArray),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var folder = _step2.value;
          switch (folder) {
            case '.':
              continue;
            case '..':
              resultArray = resultArray.slice(0, -1);
              break;
            default:
              resultArray.push(folder);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      return resultArray.join('/');
    }
  }, {
    key: "_loadChildAttributes",
    value: function () {
      var _loadChildAttributes2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5(sourceChild, attributeStorageInfo) {
        var promises, attributeUrls, index, inputUrl, attribute, options, attributesList;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              promises = [];
              attributeUrls = sourceChild.header.attributeUrls;
              for (index = 0; index < attributeUrls.length; index++) {
                inputUrl = attributeUrls[index];
                attribute = attributeStorageInfo[index];
                options = {
                  attributeName: attribute.name,
                  attributeType: this._getAttributeType(attribute)
                };
                promises.push((0, _core.load)(inputUrl, _i3s.I3SAttributeLoader, options));
              }
              _context5.next = 5;
              return Promise.all(promises);
            case 5:
              attributesList = _context5.sent;
              this._replaceNestedArrays(attributesList);
              return _context5.abrupt("return", Object.assign.apply(Object, [{}].concat((0, _toConsumableArray2.default)(attributesList))));
            case 8:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function _loadChildAttributes(_x11, _x12) {
        return _loadChildAttributes2.apply(this, arguments);
      }
      return _loadChildAttributes;
    }()
  }, {
    key: "_getAttributeType",
    value: function _getAttributeType(attribute) {
      if (attribute.attributeValues) {
        return attribute.attributeValues.valueType;
      } else if (attribute.objectIds) {
        return 'Oid32';
      }
      return '';
    }
  }, {
    key: "_replaceNestedArrays",
    value: function _replaceNestedArrays(attributesList) {
      for (var index = 0; index < attributesList.length; index++) {
        var attributeObject = attributesList[index];
        for (var _key in attributeObject) {
          attributeObject[_key] = Array.from(attributeObject[_key]);
        }
      }
    }
  }, {
    key: "_finishConversion",
    value: function () {
      var _finishConversion2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee6(params) {
        var filesSize, diff, conversionTime;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return (0, _statisticUtills.calculateFilesSize)(params);
            case 2:
              filesSize = _context6.sent;
              diff = _process.default.hrtime(this.conversionStartTime);
              conversionTime = (0, _statisticUtills.timeConverter)(diff);
              console.log("------------------------------------------------");
              console.log("Finish conversion of ".concat(I3S));
              console.log("Total conversion time: ".concat(conversionTime));
              console.log("Vertex count: ", this.vertexCounter);
              console.log("File(s) size: ", filesSize, ' bytes');
              console.log("------------------------------------------------");
            case 11:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function _finishConversion(_x13) {
        return _finishConversion2.apply(this, arguments);
      }
      return _finishConversion;
    }()
  }, {
    key: "loadWorkers",
    value: function () {
      var _loadWorkers = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee7() {
        var tile3dAttributesWorkerUrl, sourceResponse, source;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              console.log("Loading workers source...");
              tile3dAttributesWorkerUrl = (0, _workerUtils.getWorkerURL)(_dTilesAttributesWorker.Tile3dAttributesWorker, _objectSpread({}, (0, _core.getLoaderOptions)()));
              _context7.next = 4;
              return (0, _core.fetchFile)(tile3dAttributesWorkerUrl);
            case 4:
              sourceResponse = _context7.sent;
              _context7.next = 7;
              return sourceResponse.text();
            case 7:
              source = _context7.sent;
              this.workerSource.tile3dWorkerSource = source;
              console.log("Loading workers source completed!");
            case 10:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function loadWorkers() {
        return _loadWorkers.apply(this, arguments);
      }
      return loadWorkers;
    }()
  }]);
  return Tiles3DConverter;
}();
exports.default = Tiles3DConverter;
//# sourceMappingURL=3d-tiles-converter.js.map