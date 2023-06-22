"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
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
var _core = require("@loaders.gl/core");
var _tiles = require("@loaders.gl/tiles");
var _dTiles = require("@loaders.gl/3d-tiles");
var _path = require("path");
var _uuid = require("uuid");
var _process = _interopRequireDefault(require("process"));
var _jsonMapTransform = _interopRequireDefault(require("json-map-transform"));
var _md = _interopRequireDefault(require("md5"));
var _nodePages = _interopRequireDefault(require("./helpers/node-pages"));
var _fileUtils = require("../lib/utils/file-utils");
var _compressUtil = require("../lib/utils/compress-util");
var _statisticUtills = require("../lib/utils/statistic-utills");
var _geometryConverter = _interopRequireWildcard(require("./helpers/geometry-converter"));
var _coordinateConverter = require("./helpers/coordinate-converter");
var _createSceneServerPath = require("./helpers/create-scene-server-path");
var _lodConversionUtils = require("../lib/utils/lod-conversion-utils");
var _pgmLoader = require("../pgm-loader");
var _layers = require("./json-templates/layers");
var _geometryDefinitions = require("./json-templates/geometry-definitions");
var _sharedResources = require("./json-templates/shared-resources");
var _nodeDebug = require("./helpers/node-debug");
var _textures = require("@loaders.gl/textures");
var _images = require("@loaders.gl/images");
var _workerUtils = require("@loaders.gl/worker-utils");
var _draco = require("@loaders.gl/draco");
var _writeQueue = _interopRequireDefault(require("../lib/utils/write-queue"));
var _i3sAttributesWorker = require("../i3s-attributes-worker");
var _constants = require("../constants");
var _featureAttributes = require("./helpers/feature-attributes");
var _nodeIndexDocument = require("./helpers/node-index-document");
var _process$env;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var ION_DEFAULT_TOKEN = ((_process$env = _process.default.env) === null || _process$env === void 0 ? void 0 : _process$env.IonToken) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWMxMzcyYy0zZjJkLTQwODctODNlNi01MDRkZmMzMjIxOWIiLCJpZCI6OTYyMCwic2NvcGVzIjpbImFzbCIsImFzciIsImdjIl0sImlhdCI6MTU2Mjg2NjI3M30.1FNiClUyk00YH_nWfSGpiQAjR5V2OvREDq1PJ5QMjWQ';
var HARDCODED_NODES_PER_PAGE = 64;
var _3D_TILES = '3DTILES';
var _3D_OBJECT_LAYER_TYPE = '3DObject';
var REFRESH_TOKEN_TIMEOUT = 1800;
var CESIUM_DATASET_PREFIX = 'https://';
var I3SConverter = function () {
  function I3SConverter() {
    (0, _classCallCheck2.default)(this, I3SConverter);
    (0, _defineProperty2.default)(this, "nodePages", void 0);
    (0, _defineProperty2.default)(this, "options", void 0);
    (0, _defineProperty2.default)(this, "layers0Path", void 0);
    (0, _defineProperty2.default)(this, "materialMap", void 0);
    (0, _defineProperty2.default)(this, "materialDefinitions", void 0);
    (0, _defineProperty2.default)(this, "geometryMap", void 0);
    (0, _defineProperty2.default)(this, "geometryConfigs", void 0);
    (0, _defineProperty2.default)(this, "vertexCounter", void 0);
    (0, _defineProperty2.default)(this, "layers0", void 0);
    (0, _defineProperty2.default)(this, "featuresHashArray", void 0);
    (0, _defineProperty2.default)(this, "refinementCounter", void 0);
    (0, _defineProperty2.default)(this, "validate", void 0);
    (0, _defineProperty2.default)(this, "boundingVolumeWarnings", []);
    (0, _defineProperty2.default)(this, "conversionStartTime", [0, 0]);
    (0, _defineProperty2.default)(this, "refreshTokenTime", [0, 0]);
    (0, _defineProperty2.default)(this, "sourceTileset", null);
    (0, _defineProperty2.default)(this, "geoidHeightModel", null);
    (0, _defineProperty2.default)(this, "Loader", _dTiles.Tiles3DLoader);
    (0, _defineProperty2.default)(this, "generateTextures", void 0);
    (0, _defineProperty2.default)(this, "generateBoundingVolumes", void 0);
    (0, _defineProperty2.default)(this, "layersHasTexture", void 0);
    (0, _defineProperty2.default)(this, "workerSource", {});
    (0, _defineProperty2.default)(this, "writeQueue", new _writeQueue.default());
    (0, _defineProperty2.default)(this, "compressList", null);
    this.nodePages = new _nodePages.default(_fileUtils.writeFile, HARDCODED_NODES_PER_PAGE, this);
    this.options = {};
    this.layers0Path = '';
    this.materialMap = new Map();
    this.materialDefinitions = [];
    this.geometryMap = new Map();
    this.geometryConfigs = [];
    this.vertexCounter = 0;
    this.layers0 = null;
    this.featuresHashArray = [];
    this.refinementCounter = {
      tilesCount: 0,
      tilesWithAddRefineCount: 0
    };
    this.validate = false;
    this.generateTextures = false;
    this.generateBoundingVolumes = false;
    this.layersHasTexture = false;
    this.compressList = null;
  }
  (0, _createClass2.default)(I3SConverter, [{
    key: "convert",
    value: function () {
      var _convert = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(options) {
        var tilesetName, slpk, egmFilePath, inputUrl, validate, outputPath, _options$draco, draco, sevenZipExe, maxDepth, token, generateTextures, generateBoundingVolumes, _options$instantNodeW, instantNodeWriting, _options$mergeMateria, mergeMaterials, _sourceTilesetJson$ro, _sourceTilesetJson$ro2, preloadOptions, tilesetOptions, sourceTilesetJson, workerFarm;
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
              this.conversionStartTime = _process.default.hrtime();
              tilesetName = options.tilesetName, slpk = options.slpk, egmFilePath = options.egmFilePath, inputUrl = options.inputUrl, validate = options.validate, outputPath = options.outputPath, _options$draco = options.draco, draco = _options$draco === void 0 ? true : _options$draco, sevenZipExe = options.sevenZipExe, maxDepth = options.maxDepth, token = options.token, generateTextures = options.generateTextures, generateBoundingVolumes = options.generateBoundingVolumes, _options$instantNodeW = options.instantNodeWriting, instantNodeWriting = _options$instantNodeW === void 0 ? false : _options$instantNodeW, _options$mergeMateria = options.mergeMaterials, mergeMaterials = _options$mergeMateria === void 0 ? true : _options$mergeMateria;
              this.options = {
                maxDepth: maxDepth,
                slpk: slpk,
                sevenZipExe: sevenZipExe,
                egmFilePath: egmFilePath,
                draco: draco,
                token: token,
                inputUrl: inputUrl,
                instantNodeWriting: instantNodeWriting,
                mergeMaterials: mergeMaterials
              };
              this.compressList = this.options.instantNodeWriting && [] || null;
              this.validate = Boolean(validate);
              this.Loader = inputUrl.indexOf(CESIUM_DATASET_PREFIX) !== -1 ? _dTiles.CesiumIonLoader : _dTiles.Tiles3DLoader;
              this.generateTextures = Boolean(generateTextures);
              this.generateBoundingVolumes = Boolean(generateBoundingVolumes);
              this.writeQueue = new _writeQueue.default();
              this.writeQueue.startListening();
              console.log('Loading egm file...');
              _context.next = 16;
              return (0, _core.load)(egmFilePath, _pgmLoader.PGMLoader);
            case 16:
              this.geoidHeightModel = _context.sent;
              console.log('Loading egm file completed!');
              if (slpk) {
                this.nodePages.useWriteFunction(_fileUtils.writeFileForSlpk);
              }
              _context.next = 21;
              return this.loadWorkers();
            case 21:
              _context.prev = 21;
              _context.next = 24;
              return this._fetchPreloadOptions();
            case 24:
              preloadOptions = _context.sent;
              tilesetOptions = {
                loadOptions: {
                  _nodeWorkers: true,
                  reuseWorkers: true,
                  basis: {
                    format: 'rgba32',
                    workerUrl: './modules/textures/dist/basis-worker-node.js'
                  },
                  draco: {
                    workerUrl: './modules/draco/dist/draco-worker-node.js'
                  }
                }
              };
              if (preloadOptions.headers) {
                tilesetOptions.loadOptions.fetch = {
                  headers: preloadOptions.headers
                };
              }
              Object.assign(tilesetOptions, preloadOptions);
              _context.next = 30;
              return (0, _core.load)(inputUrl, this.Loader, tilesetOptions.loadOptions);
            case 30:
              sourceTilesetJson = _context.sent;
              this.sourceTileset = new _tiles.Tileset3D(sourceTilesetJson, tilesetOptions);
              _context.next = 34;
              return this._createAndSaveTileset(outputPath, tilesetName, sourceTilesetJson === null || sourceTilesetJson === void 0 ? void 0 : (_sourceTilesetJson$ro = sourceTilesetJson.root) === null || _sourceTilesetJson$ro === void 0 ? void 0 : (_sourceTilesetJson$ro2 = _sourceTilesetJson$ro.boundingVolume) === null || _sourceTilesetJson$ro2 === void 0 ? void 0 : _sourceTilesetJson$ro2.region);
            case 34:
              _context.next = 36;
              return this._finishConversion({
                slpk: Boolean(slpk),
                outputPath: outputPath,
                tilesetName: tilesetName
              });
            case 36:
              return _context.abrupt("return", sourceTilesetJson);
            case 39:
              _context.prev = 39;
              _context.t0 = _context["catch"](21);
              throw _context.t0;
            case 42:
              _context.prev = 42;
              workerFarm = _workerUtils.WorkerFarm.getWorkerFarm({});
              workerFarm.destroy();
              return _context.finish(42);
            case 46:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[21, 39, 42, 46]]);
      }));
      function convert(_x) {
        return _convert.apply(this, arguments);
      }
      return convert;
    }()
  }, {
    key: "_createAndSaveTileset",
    value: function () {
      var _createAndSaveTileset2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(outputPath, tilesetName, boundingVolumeRegion) {
        var _this = this;
        var tilesetPath, sourceRootTile, boundingVolumes, rootNode, _iterator, _step, filePath;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              tilesetPath = (0, _path.join)("".concat(outputPath), "".concat(tilesetName));
              _context2.prev = 1;
              _context2.next = 4;
              return (0, _fileUtils.removeDir)(tilesetPath);
            case 4:
              _context2.next = 8;
              break;
            case 6:
              _context2.prev = 6;
              _context2.t0 = _context2["catch"](1);
            case 8:
              this.layers0Path = (0, _path.join)(tilesetPath, 'SceneServer', 'layers', '0');
              this._formLayers0(tilesetName, boundingVolumeRegion);
              this.materialDefinitions = [];
              this.materialMap = new Map();
              sourceRootTile = this.sourceTileset.root;
              boundingVolumes = (0, _coordinateConverter.createBoundingVolumes)(sourceRootTile, this.geoidHeightModel);
              _context2.next = 16;
              return this.nodePages.push({
                index: 0,
                lodThreshold: 0,
                obb: boundingVolumes.obb,
                children: []
              });
            case 16:
              _context2.next = 18;
              return _nodeIndexDocument.NodeIndexDocument.createRootNode(boundingVolumes, this);
            case 18:
              rootNode = _context2.sent;
              _context2.next = 21;
              return this._convertNodesTree(rootNode, sourceRootTile);
            case 21:
              this.layers0.materialDefinitions = this.materialDefinitions;
              this.layers0.geometryDefinitions = (0, _jsonMapTransform.default)(this.geometryConfigs.map(function (config) {
                return {
                  geometryConfig: _objectSpread(_objectSpread({}, config), {}, {
                    draco: _this.options.draco
                  })
                };
              }), (0, _geometryDefinitions.GEOMETRY_DEFINITION)());
              if (this.layersHasTexture === false) {
                this.layers0.store.defaultGeometrySchema.ordering = this.layers0.store.defaultGeometrySchema.ordering.filter(function (attribute) {
                  return attribute !== 'uv0';
                });
              }
              _context2.next = 26;
              return this._writeLayers0();
            case 26:
              (0, _createSceneServerPath.createSceneServerPath)(tilesetName, this.layers0, tilesetPath);
              _iterator = _createForOfIteratorHelper(this.compressList || []);
              _context2.prev = 28;
              _iterator.s();
            case 30:
              if ((_step = _iterator.n()).done) {
                _context2.next = 38;
                break;
              }
              filePath = _step.value;
              _context2.next = 34;
              return (0, _compressUtil.compressFileWithGzip)(filePath);
            case 34:
              _context2.next = 36;
              return (0, _fileUtils.removeFile)(filePath);
            case 36:
              _context2.next = 30;
              break;
            case 38:
              _context2.next = 43;
              break;
            case 40:
              _context2.prev = 40;
              _context2.t1 = _context2["catch"](28);
              _iterator.e(_context2.t1);
            case 43:
              _context2.prev = 43;
              _iterator.f();
              return _context2.finish(43);
            case 46:
              _context2.next = 48;
              return this.nodePages.save();
            case 48:
              _context2.next = 50;
              return this.writeQueue.finalize();
            case 50:
              _context2.next = 52;
              return this._createSlpk(tilesetPath);
            case 52:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[1, 6], [28, 40, 43, 46]]);
      }));
      function _createAndSaveTileset(_x2, _x3, _x4) {
        return _createAndSaveTileset2.apply(this, arguments);
      }
      return _createAndSaveTileset;
    }()
  }, {
    key: "_formLayers0",
    value: function _formLayers0(tilesetName, boundingVolumeRegion) {
      var _this$sourceTileset, _this$sourceTileset2, _this$sourceTileset2$;
      var fullExtent = (0, _coordinateConverter.convertBoundingVolumeToI3SFullExtent)(((_this$sourceTileset = this.sourceTileset) === null || _this$sourceTileset === void 0 ? void 0 : _this$sourceTileset.boundingVolume) || ((_this$sourceTileset2 = this.sourceTileset) === null || _this$sourceTileset2 === void 0 ? void 0 : (_this$sourceTileset2$ = _this$sourceTileset2.root) === null || _this$sourceTileset2$ === void 0 ? void 0 : _this$sourceTileset2$.boundingVolume));
      if (boundingVolumeRegion) {
        fullExtent.zmin = boundingVolumeRegion[4];
        fullExtent.zmax = boundingVolumeRegion[5];
      }
      var extent = [fullExtent.xmin, fullExtent.ymin, fullExtent.xmax, fullExtent.ymax];
      var layers0data = {
        version: "{".concat((0, _uuid.v4)().toUpperCase(), "}"),
        id: 0,
        name: tilesetName,
        href: './layers/0',
        store: {
          id: "{".concat((0, _uuid.v4)().toUpperCase(), "}"),
          extent: extent
        },
        nodePages: {
          nodesPerPage: HARDCODED_NODES_PER_PAGE
        },
        compressGeometry: this.options.draco,
        fullExtent: fullExtent
      };
      this.layers0 = (0, _jsonMapTransform.default)(layers0data, (0, _layers.LAYERS)());
    }
  }, {
    key: "_convertNodesTree",
    value: function () {
      var _convertNodesTree2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(rootNode, sourceRootTile) {
        var childNodes, _iterator2, _step2, childNode;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return this.sourceTileset._loadTile(sourceRootTile);
            case 2:
              if (!this.isContentSupported(sourceRootTile)) {
                _context3.next = 27;
                break;
              }
              _context3.next = 5;
              return this._createNode(rootNode, sourceRootTile, 0);
            case 5:
              childNodes = _context3.sent;
              _iterator2 = _createForOfIteratorHelper(childNodes);
              _context3.prev = 7;
              _iterator2.s();
            case 9:
              if ((_step2 = _iterator2.n()).done) {
                _context3.next = 15;
                break;
              }
              childNode = _step2.value;
              _context3.next = 13;
              return childNode.save();
            case 13:
              _context3.next = 9;
              break;
            case 15:
              _context3.next = 20;
              break;
            case 17:
              _context3.prev = 17;
              _context3.t0 = _context3["catch"](7);
              _iterator2.e(_context3.t0);
            case 20:
              _context3.prev = 20;
              _iterator2.f();
              return _context3.finish(20);
            case 23:
              _context3.next = 25;
              return rootNode.addChildren(childNodes);
            case 25:
              _context3.next = 29;
              break;
            case 27:
              _context3.next = 29;
              return this._addChildrenWithNeighborsAndWriteFile({
                parentNode: rootNode,
                sourceTiles: sourceRootTile.children,
                level: 1
              });
            case 29:
              _context3.next = 31;
              return sourceRootTile.unloadContent();
            case 31:
              _context3.next = 33;
              return rootNode.save();
            case 33:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[7, 17, 20, 23]]);
      }));
      function _convertNodesTree(_x5, _x6) {
        return _convertNodesTree2.apply(this, arguments);
      }
      return _convertNodesTree;
    }()
  }, {
    key: "_writeLayers0",
    value: function () {
      var _writeLayers = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4() {
        var _this2 = this;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              if (!this.options.slpk) {
                _context4.next = 5;
                break;
              }
              _context4.next = 3;
              return this.writeQueue.enqueue({
                archiveKey: '3dSceneLayer.json.gz',
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFileForSlpk)(_this2.layers0Path, JSON.stringify(_this2.layers0), '3dSceneLayer.json');
                }
              });
            case 3:
              _context4.next = 7;
              break;
            case 5:
              _context4.next = 7;
              return this.writeQueue.enqueue({
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFile)(_this2.layers0Path, JSON.stringify(_this2.layers0));
                }
              });
            case 7:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function _writeLayers0() {
        return _writeLayers.apply(this, arguments);
      }
      return _writeLayers0;
    }()
  }, {
    key: "_createSlpk",
    value: function () {
      var _createSlpk2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5(tilesetPath) {
        var slpkTilesetPath, slpkFileName;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              if (!this.options.slpk) {
                _context5.next = 12;
                break;
              }
              slpkTilesetPath = (0, _path.join)(tilesetPath, 'SceneServer', 'layers', '0');
              slpkFileName = "".concat(tilesetPath, ".slpk");
              _context5.next = 5;
              return (0, _compressUtil.compressWithChildProcess)(slpkTilesetPath, slpkFileName, 0, '.', this.options.sevenZipExe);
            case 5:
              _context5.prev = 5;
              _context5.next = 8;
              return (0, _fileUtils.removeDir)(tilesetPath);
            case 8:
              _context5.next = 12;
              break;
            case 10:
              _context5.prev = 10;
              _context5.t0 = _context5["catch"](5);
            case 12:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this, [[5, 10]]);
      }));
      function _createSlpk(_x7) {
        return _createSlpk2.apply(this, arguments);
      }
      return _createSlpk;
    }()
  }, {
    key: "_addChildrenWithNeighborsAndWriteFile",
    value: function () {
      var _addChildrenWithNeighborsAndWriteFile2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee6(data) {
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return this._addChildren(data);
            case 2:
              _context6.next = 4;
              return data.parentNode.addNeighbors();
            case 4:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function _addChildrenWithNeighborsAndWriteFile(_x8) {
        return _addChildrenWithNeighborsAndWriteFile2.apply(this, arguments);
      }
      return _addChildrenWithNeighborsAndWriteFile;
    }()
  }, {
    key: "convertNestedTileset",
    value: function () {
      var _convertNestedTileset = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee7(_ref) {
        var parentNode, sourceTile, level;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              parentNode = _ref.parentNode, sourceTile = _ref.sourceTile, level = _ref.level;
              _context7.next = 3;
              return this.sourceTileset._loadTile(sourceTile);
            case 3:
              _context7.next = 5;
              return this._addChildren({
                parentNode: parentNode,
                sourceTiles: sourceTile.children,
                level: level + 1
              });
            case 5:
              _context7.next = 7;
              return sourceTile.unloadContent();
            case 7:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function convertNestedTileset(_x9) {
        return _convertNestedTileset.apply(this, arguments);
      }
      return convertNestedTileset;
    }()
  }, {
    key: "convertNode",
    value: function () {
      var _convertNode = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee8(_ref2) {
        var parentNode, sourceTile, level, childNodes;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              parentNode = _ref2.parentNode, sourceTile = _ref2.sourceTile, level = _ref2.level;
              _context8.next = 3;
              return this._createNode(parentNode, sourceTile, level);
            case 3:
              childNodes = _context8.sent;
              _context8.next = 6;
              return parentNode.addChildren(childNodes);
            case 6:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function convertNode(_x10) {
        return _convertNode.apply(this, arguments);
      }
      return convertNode;
    }()
  }, {
    key: "_addChildren",
    value: function () {
      var _addChildren2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee9(data) {
        var sourceTiles, parentNode, level, _iterator3, _step3, sourceTile;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              sourceTiles = data.sourceTiles, parentNode = data.parentNode, level = data.level;
              if (!(this.options.maxDepth && level > this.options.maxDepth)) {
                _context9.next = 3;
                break;
              }
              return _context9.abrupt("return");
            case 3:
              _iterator3 = _createForOfIteratorHelper(sourceTiles);
              _context9.prev = 4;
              _iterator3.s();
            case 6:
              if ((_step3 = _iterator3.n()).done) {
                _context9.next = 18;
                break;
              }
              sourceTile = _step3.value;
              if (!(sourceTile.type === 'json')) {
                _context9.next = 13;
                break;
              }
              _context9.next = 11;
              return this.convertNestedTileset({
                parentNode: parentNode,
                sourceTile: sourceTile,
                level: level
              });
            case 11:
              _context9.next = 15;
              break;
            case 13:
              _context9.next = 15;
              return this.convertNode({
                parentNode: parentNode,
                sourceTile: sourceTile,
                level: level
              });
            case 15:
              if (sourceTile.id) {
                console.log(sourceTile.id);
              }
            case 16:
              _context9.next = 6;
              break;
            case 18:
              _context9.next = 23;
              break;
            case 20:
              _context9.prev = 20;
              _context9.t0 = _context9["catch"](4);
              _iterator3.e(_context9.t0);
            case 23:
              _context9.prev = 23;
              _iterator3.f();
              return _context9.finish(23);
            case 26:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this, [[4, 20, 23, 26]]);
      }));
      function _addChildren(_x11) {
        return _addChildren2.apply(this, arguments);
      }
      return _addChildren;
    }()
  }, {
    key: "_createNode",
    value: function () {
      var _createNode2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee10(parentNode, sourceTile, level) {
        var _this$layers, _this$layers$attribut;
        var boundingVolumes, propertyTable, resourcesData, nodes, nodeIds, nodesInPage, emptyResources, _iterator4, _step4, resources, lodSelection, maxScreenThresholdSQ, nodeInPage, nodeData, node, _console;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              this._checkAddRefinementTypeForTile(sourceTile);
              _context10.next = 3;
              return this._updateTilesetOptions();
            case 3:
              _context10.next = 5;
              return this.sourceTileset._loadTile(sourceTile);
            case 5:
              boundingVolumes = (0, _coordinateConverter.createBoundingVolumes)(sourceTile, this.geoidHeightModel);
              propertyTable = (0, _geometryConverter.getPropertyTable)(sourceTile.content);
              if (propertyTable && !((_this$layers = this.layers0) !== null && _this$layers !== void 0 && (_this$layers$attribut = _this$layers.attributeStorageInfo) !== null && _this$layers$attribut !== void 0 && _this$layers$attribut.length)) {
                this._convertPropertyTableToNodeAttributes(propertyTable);
              }
              _context10.next = 10;
              return this._convertResources(sourceTile, parentNode.inPageId, propertyTable);
            case 10:
              resourcesData = _context10.sent;
              nodes = [];
              nodeIds = [];
              nodesInPage = [];
              emptyResources = {
                geometry: null,
                compressedGeometry: null,
                texture: null,
                hasUvRegions: false,
                sharedResources: null,
                meshMaterial: null,
                vertexCount: null,
                attributes: null,
                featureCount: null,
                boundingVolumes: null
              };
              _iterator4 = _createForOfIteratorHelper(resourcesData || [emptyResources]);
              _context10.prev = 16;
              _iterator4.s();
            case 18:
              if ((_step4 = _iterator4.n()).done) {
                _context10.next = 42;
                break;
              }
              resources = _step4.value;
              this.layersHasTexture = this.layersHasTexture || Boolean(resources.texture);
              if (this.generateBoundingVolumes && resources.boundingVolumes) {
                boundingVolumes = resources.boundingVolumes;
              }
              lodSelection = (0, _lodConversionUtils.convertGeometricErrorToScreenThreshold)(sourceTile, boundingVolumes);
              maxScreenThresholdSQ = lodSelection.find(function (val) {
                return val.metricType === 'maxScreenThresholdSQ';
              }) || {
                maxError: 0
              };
              _context10.next = 26;
              return this._updateNodeInNodePages(maxScreenThresholdSQ, boundingVolumes, sourceTile, parentNode.inPageId, resources);
            case 26:
              nodeInPage = _context10.sent;
              _context10.next = 29;
              return _nodeIndexDocument.NodeIndexDocument.createNodeIndexDocument(parentNode, boundingVolumes, lodSelection, nodeInPage, resources);
            case 29:
              nodeData = _context10.sent;
              _context10.next = 32;
              return new _nodeIndexDocument.NodeIndexDocument(nodeInPage.index, this).addData(nodeData);
            case 32:
              node = _context10.sent;
              nodes.push(node);
              if (!nodeInPage.mesh) {
                _context10.next = 37;
                break;
              }
              _context10.next = 37;
              return this._writeResources(resources, node.id);
            case 37:
              if (this.validate) {
                this.boundingVolumeWarnings = (0, _nodeDebug.validateNodeBoundingVolumes)(nodeData);
                if (this.boundingVolumeWarnings && this.boundingVolumeWarnings.length) {
                  (_console = console).warn.apply(_console, ['Bounding Volume Warnings: '].concat((0, _toConsumableArray2.default)(this.boundingVolumeWarnings)));
                }
              }
              nodeIds.push(nodeInPage.index);
              nodesInPage.push(nodeInPage);
            case 40:
              _context10.next = 18;
              break;
            case 42:
              _context10.next = 47;
              break;
            case 44:
              _context10.prev = 44;
              _context10.t0 = _context10["catch"](16);
              _iterator4.e(_context10.t0);
            case 47:
              _context10.prev = 47;
              _iterator4.f();
              return _context10.finish(47);
            case 50:
              sourceTile.unloadContent();
              _context10.next = 53;
              return this._addChildrenWithNeighborsAndWriteFile({
                parentNode: nodes[0],
                sourceTiles: sourceTile.children,
                level: level + 1
              });
            case 53:
              return _context10.abrupt("return", nodes);
            case 54:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this, [[16, 44, 47, 50]]);
      }));
      function _createNode(_x12, _x13, _x14) {
        return _createNode2.apply(this, arguments);
      }
      return _createNode;
    }()
  }, {
    key: "_convertResources",
    value: function () {
      var _convertResources2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee12(sourceTile, parentId, propertyTable) {
        var _this3 = this,
          _this$layers2;
        var draftObb, resourcesData;
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              if (this.isContentSupported(sourceTile)) {
                _context12.next = 2;
                break;
              }
              return _context12.abrupt("return", null);
            case 2:
              draftObb = {
                center: [],
                halfSize: [],
                quaternion: []
              };
              _context12.next = 5;
              return (0, _geometryConverter.default)(sourceTile.content, (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee11() {
                return _regenerator.default.wrap(function _callee11$(_context11) {
                  while (1) switch (_context11.prev = _context11.next) {
                    case 0:
                      _context11.next = 2;
                      return _this3.nodePages.push({
                        index: 0,
                        obb: draftObb
                      }, parentId);
                    case 2:
                      return _context11.abrupt("return", _context11.sent.index);
                    case 3:
                    case "end":
                      return _context11.stop();
                  }
                }, _callee11);
              })), propertyTable, this.featuresHashArray, (_this$layers2 = this.layers0) === null || _this$layers2 === void 0 ? void 0 : _this$layers2.attributeStorageInfo, this.options.draco, this.generateBoundingVolumes, this.options.mergeMaterials, this.geoidHeightModel, this.workerSource);
            case 5:
              resourcesData = _context12.sent;
              return _context12.abrupt("return", resourcesData);
            case 7:
            case "end":
              return _context12.stop();
          }
        }, _callee12, this);
      }));
      function _convertResources(_x15, _x16, _x17) {
        return _convertResources2.apply(this, arguments);
      }
      return _convertResources;
    }()
  }, {
    key: "_updateNodeInNodePages",
    value: function () {
      var _updateNodeInNodePages2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee13(maxScreenThresholdSQ, boundingVolumes, sourceTile, parentId, resources) {
        var meshMaterial, texture, vertexCount, featureCount, geometry, hasUvRegions, nodeInPage, nodeId, node, texelCountHint;
        return _regenerator.default.wrap(function _callee13$(_context13) {
          while (1) switch (_context13.prev = _context13.next) {
            case 0:
              meshMaterial = resources.meshMaterial, texture = resources.texture, vertexCount = resources.vertexCount, featureCount = resources.featureCount, geometry = resources.geometry, hasUvRegions = resources.hasUvRegions;
              nodeInPage = {
                index: 0,
                lodThreshold: maxScreenThresholdSQ.maxError,
                obb: boundingVolumes.obb,
                children: []
              };
              if (geometry && this.isContentSupported(sourceTile)) {
                nodeInPage.mesh = {
                  geometry: {
                    definition: this.findOrCreateGeometryDefinition(Boolean(texture), hasUvRegions),
                    resource: 0
                  },
                  attribute: {
                    resource: 0
                  },
                  material: {
                    definition: 0
                  }
                };
              }
              nodeId = resources.nodeId;
              if (nodeId) {
                _context13.next = 10;
                break;
              }
              _context13.next = 7;
              return this.nodePages.push(nodeInPage, parentId);
            case 7:
              node = _context13.sent;
              _context13.next = 13;
              break;
            case 10:
              _context13.next = 12;
              return this.nodePages.getNodeById(nodeId);
            case 12:
              node = _context13.sent;
            case 13:
              _nodePages.default.updateAll(node, nodeInPage);
              if (meshMaterial) {
                _nodePages.default.updateMaterialByNodeId(node, this._findOrCreateMaterial(meshMaterial));
              }
              if (texture) {
                texelCountHint = texture.image.height * texture.image.width;
                _nodePages.default.updateTexelCountHintByNodeId(node, texelCountHint);
              }
              if (vertexCount) {
                this.vertexCounter += vertexCount;
                _nodePages.default.updateVertexCountByNodeId(node, vertexCount);
              }
              _nodePages.default.updateNodeAttributeByNodeId(node);
              if (featureCount) {
                _nodePages.default.updateFeatureCountByNodeId(node, featureCount);
              }
              this.nodePages.saveNode(node);
              return _context13.abrupt("return", node);
            case 21:
            case "end":
              return _context13.stop();
          }
        }, _callee13, this);
      }));
      function _updateNodeInNodePages(_x18, _x19, _x20, _x21, _x22) {
        return _updateNodeInNodePages2.apply(this, arguments);
      }
      return _updateNodeInNodePages;
    }()
  }, {
    key: "_writeResources",
    value: function () {
      var _writeResources2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee14(resources, nodePath) {
        var geometryBuffer, compressedGeometry, texture, sharedResources, attributes, childPath, slpkChildPath;
        return _regenerator.default.wrap(function _callee14$(_context14) {
          while (1) switch (_context14.prev = _context14.next) {
            case 0:
              geometryBuffer = resources.geometry, compressedGeometry = resources.compressedGeometry, texture = resources.texture, sharedResources = resources.sharedResources, attributes = resources.attributes;
              childPath = (0, _path.join)(this.layers0Path, 'nodes', nodePath);
              slpkChildPath = (0, _path.join)('nodes', nodePath);
              _context14.next = 5;
              return this._writeGeometries(geometryBuffer, compressedGeometry, childPath, slpkChildPath);
            case 5:
              _context14.next = 7;
              return this._writeShared(sharedResources, childPath, slpkChildPath, nodePath);
            case 7:
              _context14.next = 9;
              return this._writeTexture(texture, childPath, slpkChildPath);
            case 9:
              _context14.next = 11;
              return this._writeAttributes(attributes, childPath, slpkChildPath);
            case 11:
            case "end":
              return _context14.stop();
          }
        }, _callee14, this);
      }));
      function _writeResources(_x23, _x24) {
        return _writeResources2.apply(this, arguments);
      }
      return _writeResources;
    }()
  }, {
    key: "_writeGeometries",
    value: function () {
      var _writeGeometries2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee15(geometryBuffer, compressedGeometry, childPath, slpkChildPath) {
        var slpkGeometryPath, geometryPath, slpkCompressedGeometryPath, compressedGeometryPath;
        return _regenerator.default.wrap(function _callee15$(_context15) {
          while (1) switch (_context15.prev = _context15.next) {
            case 0:
              if (!this.options.slpk) {
                _context15.next = 6;
                break;
              }
              slpkGeometryPath = (0, _path.join)(childPath, 'geometries');
              _context15.next = 4;
              return this.writeQueue.enqueue({
                archiveKey: "".concat(slpkChildPath, "/geometries/0.bin.gz"),
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFileForSlpk)(slpkGeometryPath, geometryBuffer, '0.bin');
                }
              });
            case 4:
              _context15.next = 9;
              break;
            case 6:
              geometryPath = (0, _path.join)(childPath, 'geometries/0/');
              _context15.next = 9;
              return this.writeQueue.enqueue({
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFile)(geometryPath, geometryBuffer, 'index.bin');
                }
              });
            case 9:
              if (!this.options.draco) {
                _context15.next = 19;
                break;
              }
              if (!this.options.slpk) {
                _context15.next = 16;
                break;
              }
              slpkCompressedGeometryPath = (0, _path.join)(childPath, 'geometries');
              _context15.next = 14;
              return this.writeQueue.enqueue({
                archiveKey: "".concat(slpkChildPath, "/geometries/1.bin.gz"),
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFileForSlpk)(slpkCompressedGeometryPath, compressedGeometry, '1.bin');
                }
              });
            case 14:
              _context15.next = 19;
              break;
            case 16:
              compressedGeometryPath = (0, _path.join)(childPath, 'geometries/1/');
              _context15.next = 19;
              return this.writeQueue.enqueue({
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFile)(compressedGeometryPath, compressedGeometry, 'index.bin');
                }
              });
            case 19:
            case "end":
              return _context15.stop();
          }
        }, _callee15, this);
      }));
      function _writeGeometries(_x25, _x26, _x27, _x28) {
        return _writeGeometries2.apply(this, arguments);
      }
      return _writeGeometries;
    }()
  }, {
    key: "_writeShared",
    value: function () {
      var _writeShared2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee16(sharedResources, childPath, slpkChildPath, nodePath) {
        var sharedData, sharedDataStr, slpkSharedPath, sharedPath;
        return _regenerator.default.wrap(function _callee16$(_context16) {
          while (1) switch (_context16.prev = _context16.next) {
            case 0:
              if (sharedResources) {
                _context16.next = 2;
                break;
              }
              return _context16.abrupt("return");
            case 2:
              sharedResources.nodePath = nodePath;
              sharedData = (0, _jsonMapTransform.default)(sharedResources, (0, _sharedResources.SHARED_RESOURCES)());
              sharedDataStr = JSON.stringify(sharedData);
              if (!this.options.slpk) {
                _context16.next = 11;
                break;
              }
              slpkSharedPath = (0, _path.join)(childPath, 'shared');
              _context16.next = 9;
              return this.writeQueue.enqueue({
                archiveKey: "".concat(slpkChildPath, "/shared/sharedResource.json.gz"),
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFileForSlpk)(slpkSharedPath, sharedDataStr, 'sharedResource.json');
                }
              });
            case 9:
              _context16.next = 14;
              break;
            case 11:
              sharedPath = (0, _path.join)(childPath, 'shared/');
              _context16.next = 14;
              return this.writeQueue.enqueue({
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFile)(sharedPath, sharedDataStr);
                }
              });
            case 14:
            case "end":
              return _context16.stop();
          }
        }, _callee16, this);
      }));
      function _writeShared(_x29, _x30, _x31, _x32) {
        return _writeShared2.apply(this, arguments);
      }
      return _writeShared;
    }()
  }, {
    key: "_writeTexture",
    value: function () {
      var _writeTexture2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee17(texture, childPath, slpkChildPath) {
        var format, formats, textureData, copyArrayBuffer, arrayToEncode, ktx2TextureData, decodedFromKTX2TextureData;
        return _regenerator.default.wrap(function _callee17$(_context17) {
          while (1) switch (_context17.prev = _context17.next) {
            case 0:
              if (!texture) {
                _context17.next = 27;
                break;
              }
              format = this._getFormatByMimeType(texture === null || texture === void 0 ? void 0 : texture.mimeType);
              formats = [];
              textureData = texture.bufferView.data;
              _context17.t0 = format;
              _context17.next = _context17.t0 === 'jpg' ? 7 : _context17.t0 === 'png' ? 7 : _context17.t0 === 'ktx2' ? 18 : 26;
              break;
            case 7:
              formats.push({
                name: '0',
                format: format
              });
              _context17.next = 10;
              return this.writeTextureFile(textureData, '0', format, childPath, slpkChildPath);
            case 10:
              if (!this.generateTextures) {
                _context17.next = 17;
                break;
              }
              formats.push({
                name: '1',
                format: 'ktx2'
              });
              copyArrayBuffer = texture.image.data.subarray();
              arrayToEncode = new Uint8Array(copyArrayBuffer);
              ktx2TextureData = (0, _core.encode)(_objectSpread(_objectSpread({}, texture.image), {}, {
                data: arrayToEncode
              }), _textures.KTX2BasisWriterWorker, _objectSpread(_objectSpread({}, _textures.KTX2BasisWriterWorker.options), {}, {
                source: this.workerSource.ktx2,
                reuseWorkers: true,
                _nodeWorkers: true
              }));
              _context17.next = 17;
              return this.writeTextureFile(ktx2TextureData, '1', 'ktx2', childPath, slpkChildPath);
            case 17:
              return _context17.abrupt("break", 26);
            case 18:
              formats.push({
                name: '1',
                format: format
              });
              _context17.next = 21;
              return this.writeTextureFile(textureData, '1', format, childPath, slpkChildPath);
            case 21:
              if (!this.generateTextures) {
                _context17.next = 26;
                break;
              }
              formats.push({
                name: '0',
                format: 'jpg'
              });
              decodedFromKTX2TextureData = (0, _core.encode)(texture.image.data[0], _images.ImageWriter);
              _context17.next = 26;
              return this.writeTextureFile(decodedFromKTX2TextureData, '0', 'jpg', childPath, slpkChildPath);
            case 26:
              if (!this.layers0.textureSetDefinitions.length) {
                this.layers0.textureSetDefinitions.push({
                  formats: formats
                });
                this.layers0.textureSetDefinitions.push({
                  formats: formats,
                  atlas: true
                });
              }
            case 27:
            case "end":
              return _context17.stop();
          }
        }, _callee17, this);
      }));
      function _writeTexture(_x33, _x34, _x35) {
        return _writeTexture2.apply(this, arguments);
      }
      return _writeTexture;
    }()
  }, {
    key: "writeTextureFile",
    value: function () {
      var _writeTextureFile = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee18(textureData, name, format, childPath, slpkChildPath) {
        var slpkTexturePath, compress, texturePath;
        return _regenerator.default.wrap(function _callee18$(_context18) {
          while (1) switch (_context18.prev = _context18.next) {
            case 0:
              if (!this.options.slpk) {
                _context18.next = 7;
                break;
              }
              slpkTexturePath = (0, _path.join)(childPath, 'textures');
              compress = false;
              _context18.next = 5;
              return this.writeQueue.enqueue({
                archiveKey: "".concat(slpkChildPath, "/textures/").concat(name, ".").concat(format),
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFileForSlpk)(slpkTexturePath, textureData, "".concat(name, ".").concat(format), compress);
                }
              });
            case 5:
              _context18.next = 10;
              break;
            case 7:
              texturePath = (0, _path.join)(childPath, "textures/".concat(name, "/"));
              _context18.next = 10;
              return this.writeQueue.enqueue({
                writePromise: function writePromise() {
                  return (0, _fileUtils.writeFile)(texturePath, textureData, "index.".concat(format));
                }
              });
            case 10:
            case "end":
              return _context18.stop();
          }
        }, _callee18, this);
      }));
      function writeTextureFile(_x36, _x37, _x38, _x39, _x40) {
        return _writeTextureFile.apply(this, arguments);
      }
      return writeTextureFile;
    }()
  }, {
    key: "_writeAttributes",
    value: function () {
      var _writeAttributes2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee19() {
        var _this$layers3,
          _this$layers3$attribu,
          _this4 = this;
        var attributes,
          childPath,
          slpkChildPath,
          _loop,
          index,
          _args20 = arguments;
        return _regenerator.default.wrap(function _callee19$(_context20) {
          while (1) switch (_context20.prev = _context20.next) {
            case 0:
              attributes = _args20.length > 0 && _args20[0] !== undefined ? _args20[0] : [];
              childPath = _args20.length > 1 ? _args20[1] : undefined;
              slpkChildPath = _args20.length > 2 ? _args20[2] : undefined;
              if (!(attributes !== null && attributes !== void 0 && attributes.length && (_this$layers3 = this.layers0) !== null && _this$layers3 !== void 0 && (_this$layers3$attribu = _this$layers3.attributeStorageInfo) !== null && _this$layers3$attribu !== void 0 && _this$layers3$attribu.length)) {
                _context20.next = 11;
                break;
              }
              _loop = _regenerator.default.mark(function _loop() {
                var folderName, fileBuffer, slpkAttributesPath, attributesPath;
                return _regenerator.default.wrap(function _loop$(_context19) {
                  while (1) switch (_context19.prev = _context19.next) {
                    case 0:
                      folderName = _this4.layers0.attributeStorageInfo[index].key;
                      fileBuffer = new Uint8Array(attributes[index]);
                      if (!_this4.options.slpk) {
                        _context19.next = 8;
                        break;
                      }
                      slpkAttributesPath = (0, _path.join)(childPath, 'attributes', folderName);
                      _context19.next = 6;
                      return _this4.writeQueue.enqueue({
                        archiveKey: "".concat(slpkChildPath, "/attributes/").concat(folderName, ".bin.gz"),
                        writePromise: function writePromise() {
                          return (0, _fileUtils.writeFileForSlpk)(slpkAttributesPath, fileBuffer, '0.bin');
                        }
                      });
                    case 6:
                      _context19.next = 11;
                      break;
                    case 8:
                      attributesPath = (0, _path.join)(childPath, "attributes/".concat(folderName, "/0"));
                      _context19.next = 11;
                      return _this4.writeQueue.enqueue({
                        writePromise: function writePromise() {
                          return (0, _fileUtils.writeFile)(attributesPath, fileBuffer, 'index.bin');
                        }
                      });
                    case 11:
                    case "end":
                      return _context19.stop();
                  }
                }, _loop);
              });
              index = 0;
            case 6:
              if (!(index < attributes.length)) {
                _context20.next = 11;
                break;
              }
              return _context20.delegateYield(_loop(), "t0", 8);
            case 8:
              index++;
              _context20.next = 6;
              break;
            case 11:
            case "end":
              return _context20.stop();
          }
        }, _callee19, this);
      }));
      function _writeAttributes() {
        return _writeAttributes2.apply(this, arguments);
      }
      return _writeAttributes;
    }()
  }, {
    key: "_getFormatByMimeType",
    value: function _getFormatByMimeType(mimeType) {
      switch (mimeType) {
        case 'image/jpeg':
          return 'jpg';
        case 'image/png':
          return 'png';
        case 'image/ktx2':
          return 'ktx2';
        default:
          return 'jpg';
      }
    }
  }, {
    key: "_findOrCreateMaterial",
    value: function _findOrCreateMaterial(material) {
      var hash = (0, _md.default)(JSON.stringify(material));
      if (this.materialMap.has(hash)) {
        return this.materialMap.get(hash) || 0;
      }
      var newMaterialId = this.materialDefinitions.push(material) - 1;
      this.materialMap.set(hash, newMaterialId);
      return newMaterialId;
    }
  }, {
    key: "findOrCreateGeometryDefinition",
    value: function findOrCreateGeometryDefinition(hasTexture, hasUvRegions) {
      var geometryConfig = {
        hasTexture: hasTexture,
        hasUvRegions: hasUvRegions
      };
      var hash = (0, _md.default)(JSON.stringify(geometryConfig));
      if (this.geometryMap.has(hash)) {
        return this.geometryMap.get(hash) || 0;
      }
      var newGeometryId = this.geometryConfigs.push(geometryConfig) - 1;
      this.geometryMap.set(hash, newGeometryId);
      return newGeometryId;
    }
  }, {
    key: "_convertPropertyTableToNodeAttributes",
    value: function _convertPropertyTableToNodeAttributes(propertyTable) {
      var attributeIndex = 0;
      var propertyTableWithObjectId = _objectSpread({
        OBJECTID: [0]
      }, propertyTable);
      for (var _key in propertyTableWithObjectId) {
        var firstAttribute = propertyTableWithObjectId[_key][0];
        var attributeType = (0, _featureAttributes.getAttributeType)(_key, firstAttribute);
        var storageAttribute = (0, _featureAttributes.createdStorageAttribute)(attributeIndex, _key, attributeType);
        var fieldAttributeType = (0, _featureAttributes.getFieldAttributeType)(attributeType);
        var fieldAttribute = (0, _featureAttributes.createFieldAttribute)(_key, fieldAttributeType);
        var popupInfo = (0, _featureAttributes.createPopupInfo)(propertyTableWithObjectId);
        this.layers0.attributeStorageInfo.push(storageAttribute);
        this.layers0.fields.push(fieldAttribute);
        this.layers0.popupInfo = popupInfo;
        this.layers0.layerType = _3D_OBJECT_LAYER_TYPE;
        attributeIndex += 1;
      }
    }
  }, {
    key: "_finishConversion",
    value: function () {
      var _finishConversion2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee20(params) {
        var _this$refinementCount, tilesCount, tilesWithAddRefineCount, addRefinementPercentage, filesSize, diff, conversionTime;
        return _regenerator.default.wrap(function _callee20$(_context21) {
          while (1) switch (_context21.prev = _context21.next) {
            case 0:
              _this$refinementCount = this.refinementCounter, tilesCount = _this$refinementCount.tilesCount, tilesWithAddRefineCount = _this$refinementCount.tilesWithAddRefineCount;
              addRefinementPercentage = tilesWithAddRefineCount ? tilesWithAddRefineCount / tilesCount * 100 : 0;
              _context21.next = 4;
              return (0, _statisticUtills.calculateFilesSize)(params);
            case 4:
              filesSize = _context21.sent;
              diff = _process.default.hrtime(this.conversionStartTime);
              conversionTime = (0, _statisticUtills.timeConverter)(diff);
              console.log("------------------------------------------------");
              console.log("Finishing conversion of ".concat(_3D_TILES));
              console.log("Total conversion time: ".concat(conversionTime));
              console.log("Vertex count: ", this.vertexCounter);
              console.log("File(s) size: ", filesSize, ' bytes');
              console.log("Percentage of tiles with \"ADD\" refinement type:", addRefinementPercentage, '%');
              console.log("------------------------------------------------");
            case 14:
            case "end":
              return _context21.stop();
          }
        }, _callee20, this);
      }));
      function _finishConversion(_x41) {
        return _finishConversion2.apply(this, arguments);
      }
      return _finishConversion;
    }()
  }, {
    key: "_fetchPreloadOptions",
    value: function () {
      var _fetchPreloadOptions2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee21() {
        var options, preloadOptions;
        return _regenerator.default.wrap(function _callee21$(_context22) {
          while (1) switch (_context22.prev = _context22.next) {
            case 0:
              if (this.Loader.preload) {
                _context22.next = 2;
                break;
              }
              return _context22.abrupt("return", {});
            case 2:
              options = {
                'cesium-ion': {
                  accessToken: this.options.token || ION_DEFAULT_TOKEN
                }
              };
              _context22.next = 5;
              return this.Loader.preload(this.options.inputUrl, options);
            case 5:
              preloadOptions = _context22.sent;
              this.refreshTokenTime = _process.default.hrtime();
              return _context22.abrupt("return", _objectSpread(_objectSpread({}, options), preloadOptions));
            case 8:
            case "end":
              return _context22.stop();
          }
        }, _callee21, this);
      }));
      function _fetchPreloadOptions() {
        return _fetchPreloadOptions2.apply(this, arguments);
      }
      return _fetchPreloadOptions;
    }()
  }, {
    key: "_updateTilesetOptions",
    value: function () {
      var _updateTilesetOptions2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee22() {
        var diff, preloadOptions;
        return _regenerator.default.wrap(function _callee22$(_context23) {
          while (1) switch (_context23.prev = _context23.next) {
            case 0:
              diff = _process.default.hrtime(this.refreshTokenTime);
              if (!(diff[0] < REFRESH_TOKEN_TIMEOUT)) {
                _context23.next = 3;
                break;
              }
              return _context23.abrupt("return");
            case 3:
              this.refreshTokenTime = _process.default.hrtime();
              _context23.next = 6;
              return this._fetchPreloadOptions();
            case 6:
              preloadOptions = _context23.sent;
              this.sourceTileset.options = _objectSpread(_objectSpread({}, this.sourceTileset.options), preloadOptions);
              if (preloadOptions.headers) {
                this.sourceTileset.loadOptions.fetch = _objectSpread(_objectSpread({}, this.sourceTileset.loadOptions.fetch), {}, {
                  headers: preloadOptions.headers
                });
                console.log('Authorization Bearer token has been updated');
              }
            case 9:
            case "end":
              return _context23.stop();
          }
        }, _callee22, this);
      }));
      function _updateTilesetOptions() {
        return _updateTilesetOptions2.apply(this, arguments);
      }
      return _updateTilesetOptions;
    }()
  }, {
    key: "_checkAddRefinementTypeForTile",
    value: function _checkAddRefinementTypeForTile(tile) {
      var ADD_TILE_REFINEMENT = 1;
      if (tile.refine === ADD_TILE_REFINEMENT) {
        this.refinementCounter.tilesWithAddRefineCount += 1;
        console.warn('This tile uses "ADD" type of refinement');
      }
      this.refinementCounter.tilesCount += 1;
    }
  }, {
    key: "isContentSupported",
    value: function isContentSupported(sourceRootTile) {
      var _sourceRootTile$conte;
      return ['b3dm', 'glTF'].includes(sourceRootTile === null || sourceRootTile === void 0 ? void 0 : (_sourceRootTile$conte = sourceRootTile.content) === null || _sourceRootTile$conte === void 0 ? void 0 : _sourceRootTile$conte.type);
    }
  }, {
    key: "loadWorkers",
    value: function () {
      var _loadWorkers = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee23() {
        var url, _sourceResponse, _source, _url, _sourceResponse2, _source2, i3sAttributesWorkerUrl, sourceResponse, source;
        return _regenerator.default.wrap(function _callee23$(_context24) {
          while (1) switch (_context24.prev = _context24.next) {
            case 0:
              console.log("Loading workers source...");
              if (!this.options.draco) {
                _context24.next = 10;
                break;
              }
              url = (0, _workerUtils.getWorkerURL)(_draco.DracoWriterWorker, _objectSpread({}, (0, _core.getLoaderOptions)()));
              _context24.next = 5;
              return (0, _core.fetchFile)(url);
            case 5:
              _sourceResponse = _context24.sent;
              _context24.next = 8;
              return _sourceResponse.text();
            case 8:
              _source = _context24.sent;
              this.workerSource.draco = _source;
            case 10:
              if (!this.generateTextures) {
                _context24.next = 19;
                break;
              }
              _url = (0, _workerUtils.getWorkerURL)(_textures.KTX2BasisWriterWorker, _objectSpread({}, (0, _core.getLoaderOptions)()));
              _context24.next = 14;
              return (0, _core.fetchFile)(_url);
            case 14:
              _sourceResponse2 = _context24.sent;
              _context24.next = 17;
              return _sourceResponse2.text();
            case 17:
              _source2 = _context24.sent;
              this.workerSource.ktx2 = _source2;
            case 19:
              i3sAttributesWorkerUrl = (0, _workerUtils.getWorkerURL)(_i3sAttributesWorker.I3SAttributesWorker, _objectSpread({}, (0, _core.getLoaderOptions)()));
              _context24.next = 22;
              return (0, _core.fetchFile)(i3sAttributesWorkerUrl);
            case 22:
              sourceResponse = _context24.sent;
              _context24.next = 25;
              return sourceResponse.text();
            case 25:
              source = _context24.sent;
              this.workerSource.I3SAttributes = source;
              console.log("Loading workers source completed!");
            case 28:
            case "end":
              return _context24.stop();
          }
        }, _callee23, this);
      }));
      function loadWorkers() {
        return _loadWorkers.apply(this, arguments);
      }
      return loadWorkers;
    }()
  }]);
  return I3SConverter;
}();
exports.default = I3SConverter;
//# sourceMappingURL=i3s-converter.js.map