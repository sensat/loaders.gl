"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _core = require("@loaders.gl/core");
var _textures = require("@loaders.gl/textures");
var _i3sNodePageLoader = require("../../i3s-node-page-loader");
var _parseI3s = require("../parsers/parse-i3s");
var _urlUtils = require("../utils/url-utils");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var I3SNodePagesTiles = function () {
  function I3SNodePagesTiles(tileset, options) {
    var _tileset$nodePages, _tileset$nodePages2;
    (0, _classCallCheck2.default)(this, I3SNodePagesTiles);
    (0, _defineProperty2.default)(this, "tileset", void 0);
    (0, _defineProperty2.default)(this, "nodePages", []);
    (0, _defineProperty2.default)(this, "pendingNodePages", []);
    (0, _defineProperty2.default)(this, "nodesPerPage", void 0);
    (0, _defineProperty2.default)(this, "options", void 0);
    (0, _defineProperty2.default)(this, "lodSelectionMetricType", void 0);
    (0, _defineProperty2.default)(this, "textureDefinitionsSelectedFormats", []);
    (0, _defineProperty2.default)(this, "nodesInNodePages", void 0);
    (0, _defineProperty2.default)(this, "textureLoaderOptions", {});
    this.tileset = _objectSpread({}, tileset);
    this.nodesPerPage = ((_tileset$nodePages = tileset.nodePages) === null || _tileset$nodePages === void 0 ? void 0 : _tileset$nodePages.nodesPerPage) || 64;
    this.lodSelectionMetricType = (_tileset$nodePages2 = tileset.nodePages) === null || _tileset$nodePages2 === void 0 ? void 0 : _tileset$nodePages2.lodSelectionMetricType;
    this.options = options;
    this.nodesInNodePages = 0;
    this.initSelectedFormatsForTextureDefinitions(tileset);
  }
  (0, _createClass2.default)(I3SNodePagesTiles, [{
    key: "getNodeById",
    value: function () {
      var _getNodeById = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(id) {
        var pageIndex, _this$options$i3s, nodePageUrl, nodeIndex;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              pageIndex = Math.floor(id / this.nodesPerPage);
              if (!(!this.nodePages[pageIndex] && !this.pendingNodePages[pageIndex])) {
                _context.next = 9;
                break;
              }
              nodePageUrl = (0, _urlUtils.getUrlWithToken)("".concat(this.tileset.url, "/nodepages/").concat(pageIndex), (_this$options$i3s = this.options.i3s) === null || _this$options$i3s === void 0 ? void 0 : _this$options$i3s.token);
              this.pendingNodePages[pageIndex] = {
                status: 'Pending',
                promise: (0, _core.load)(nodePageUrl, _i3sNodePageLoader.I3SNodePageLoader, this.options)
              };
              _context.next = 6;
              return this.pendingNodePages[pageIndex].promise;
            case 6:
              this.nodePages[pageIndex] = _context.sent;
              this.nodesInNodePages += this.nodePages[pageIndex].nodes.length;
              this.pendingNodePages[pageIndex].status = 'Done';
            case 9:
              if (!(this.pendingNodePages[pageIndex].status === 'Pending')) {
                _context.next = 13;
                break;
              }
              _context.next = 12;
              return this.pendingNodePages[pageIndex].promise;
            case 12:
              this.nodePages[pageIndex] = _context.sent;
            case 13:
              nodeIndex = id % this.nodesPerPage;
              return _context.abrupt("return", this.nodePages[pageIndex].nodes[nodeIndex]);
            case 15:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function getNodeById(_x) {
        return _getNodeById.apply(this, arguments);
      }
      return getNodeById;
    }()
  }, {
    key: "formTileFromNodePages",
    value: function () {
      var _formTileFromNodePages = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(id) {
        var node, children, childNodesPromises, _iterator, _step, child, childNodes, _iterator2, _step2, childNode, contentUrl, textureUrl, materialDefinition, textureFormat, attributeUrls, isDracoGeometry, _ref, url, isDracoGeometryResult, _this$getInformationF, textureData, nodeMaterialDefinition, lodSelection;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return this.getNodeById(id);
            case 2:
              node = _context2.sent;
              children = [];
              childNodesPromises = [];
              _iterator = _createForOfIteratorHelper(node.children || []);
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  child = _step.value;
                  childNodesPromises.push(this.getNodeById(child));
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              _context2.next = 9;
              return Promise.all(childNodesPromises);
            case 9:
              childNodes = _context2.sent;
              _iterator2 = _createForOfIteratorHelper(childNodes);
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  childNode = _step2.value;
                  children.push({
                    id: childNode.index.toString(),
                    obb: childNode.obb
                  });
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }
              textureFormat = 'jpg';
              attributeUrls = [];
              isDracoGeometry = false;
              if (node && node.mesh) {
                _ref = node.mesh.geometry && this.getContentUrl(node.mesh.geometry) || {
                  isDracoGeometry: false
                }, url = _ref.url, isDracoGeometryResult = _ref.isDracoGeometry;
                contentUrl = url;
                isDracoGeometry = isDracoGeometryResult;
                _this$getInformationF = this.getInformationFromMaterial(node.mesh.material), textureData = _this$getInformationF.textureData, nodeMaterialDefinition = _this$getInformationF.materialDefinition;
                materialDefinition = nodeMaterialDefinition;
                textureFormat = textureData.format || textureFormat;
                if (textureData.name) {
                  textureUrl = "".concat(this.tileset.url, "/nodes/").concat(node.mesh.material.resource, "/textures/").concat(textureData.name);
                }
                if (this.tileset.attributeStorageInfo) {
                  attributeUrls = (0, _urlUtils.generateTilesetAttributeUrls)(this.tileset, node.mesh.attribute.resource);
                }
              }
              lodSelection = this.getLodSelection(node);
              return _context2.abrupt("return", (0, _parseI3s.normalizeTileNonUrlData)({
                id: id.toString(),
                lodSelection: lodSelection,
                obb: node.obb,
                contentUrl: contentUrl,
                textureUrl: textureUrl,
                attributeUrls: attributeUrls,
                materialDefinition: materialDefinition,
                textureFormat: textureFormat,
                textureLoaderOptions: this.textureLoaderOptions,
                children: children,
                isDracoGeometry: isDracoGeometry
              }));
            case 18:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function formTileFromNodePages(_x2) {
        return _formTileFromNodePages.apply(this, arguments);
      }
      return formTileFromNodePages;
    }()
  }, {
    key: "getContentUrl",
    value: function getContentUrl(meshGeometryData) {
      var result = null;
      var geometryDefinition = this.tileset.geometryDefinitions[meshGeometryData.definition];
      var geometryIndex = -1;
      if (this.options.i3s && this.options.i3s.useDracoGeometry) {
        geometryIndex = geometryDefinition.geometryBuffers.findIndex(function (buffer) {
          return buffer.compressedAttributes && buffer.compressedAttributes.encoding === 'draco';
        });
      }
      if (geometryIndex === -1) {
        geometryIndex = geometryDefinition.geometryBuffers.findIndex(function (buffer) {
          return !buffer.compressedAttributes;
        });
      }
      if (geometryIndex !== -1) {
        var isDracoGeometry = Boolean(geometryDefinition.geometryBuffers[geometryIndex].compressedAttributes);
        result = {
          url: "".concat(this.tileset.url, "/nodes/").concat(meshGeometryData.resource, "/geometries/").concat(geometryIndex),
          isDracoGeometry: isDracoGeometry
        };
      }
      return result;
    }
  }, {
    key: "getLodSelection",
    value: function getLodSelection(node) {
      var lodSelection = [];
      if (this.lodSelectionMetricType === 'maxScreenThresholdSQ') {
        lodSelection.push({
          metricType: 'maxScreenThreshold',
          maxError: Math.sqrt(node.lodThreshold / (Math.PI * 0.25))
        });
      }
      lodSelection.push({
        metricType: this.lodSelectionMetricType,
        maxError: node.lodThreshold
      });
      return lodSelection;
    }
  }, {
    key: "getInformationFromMaterial",
    value: function getInformationFromMaterial(material) {
      var informationFromMaterial = {
        textureData: {
          name: null
        }
      };
      if (material) {
        var _this$tileset$materia;
        var materialDefinition = (_this$tileset$materia = this.tileset.materialDefinitions) === null || _this$tileset$materia === void 0 ? void 0 : _this$tileset$materia[material.definition];
        if (materialDefinition) {
          var _materialDefinition$p, _materialDefinition$p2;
          informationFromMaterial.materialDefinition = materialDefinition;
          var textureSetDefinitionIndex = materialDefinition === null || materialDefinition === void 0 ? void 0 : (_materialDefinition$p = materialDefinition.pbrMetallicRoughness) === null || _materialDefinition$p === void 0 ? void 0 : (_materialDefinition$p2 = _materialDefinition$p.baseColorTexture) === null || _materialDefinition$p2 === void 0 ? void 0 : _materialDefinition$p2.textureSetDefinitionId;
          if (typeof textureSetDefinitionIndex === 'number') {
            informationFromMaterial.textureData = this.textureDefinitionsSelectedFormats[textureSetDefinitionIndex] || informationFromMaterial.textureData;
          }
        }
      }
      return informationFromMaterial;
    }
  }, {
    key: "initSelectedFormatsForTextureDefinitions",
    value: function initSelectedFormatsForTextureDefinitions(tileset) {
      this.textureDefinitionsSelectedFormats = [];
      var possibleI3sFormats = this.getSupportedTextureFormats();
      var textureSetDefinitions = tileset.textureSetDefinitions || [];
      var _iterator3 = _createForOfIteratorHelper(textureSetDefinitions),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var textureSetDefinition = _step3.value;
          var formats = textureSetDefinition && textureSetDefinition.formats || [];
          var selectedFormat = null;
          var _iterator4 = _createForOfIteratorHelper(possibleI3sFormats),
            _step4;
          try {
            var _loop = function _loop() {
              var i3sFormat = _step4.value;
              var format = formats.find(function (value) {
                return value.format === i3sFormat;
              });
              if (format) {
                selectedFormat = format;
                return "break";
              }
            };
            for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
              var _ret = _loop();
              if (_ret === "break") break;
            }
          } catch (err) {
            _iterator4.e(err);
          } finally {
            _iterator4.f();
          }
          if (selectedFormat && selectedFormat.format === 'ktx2') {
            this.textureLoaderOptions.basis = {
              format: (0, _textures.selectSupportedBasisFormat)(),
              containerFormat: 'ktx2',
              module: 'encoder'
            };
          }
          this.textureDefinitionsSelectedFormats.push(selectedFormat);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "getSupportedTextureFormats",
    value: function getSupportedTextureFormats() {
      var formats = [];
      if (!this.options.i3s || this.options.i3s.useCompressedTextures) {
        var supportedCompressedFormats = (0, _textures.getSupportedGPUTextureFormats)();
        if (supportedCompressedFormats.has('etc2')) {
          formats.push('ktx-etc2');
        }
        if (supportedCompressedFormats.has('dxt')) {
          formats.push('dds');
        }
        formats.push('ktx2');
      }
      formats.push('jpg');
      formats.push('png');
      return formats;
    }
  }]);
  return I3SNodePagesTiles;
}();
exports.default = I3SNodePagesTiles;
//# sourceMappingURL=i3s-nodepages-tiles.js.map