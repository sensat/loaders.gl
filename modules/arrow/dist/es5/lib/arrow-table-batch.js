"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _apacheArrow = require("apache-arrow");
var _schema = require("@loaders.gl/schema");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ArrowTableBatchAggregator = function (_ColumnarTableBatchAg) {
  (0, _inherits2.default)(ArrowTableBatchAggregator, _ColumnarTableBatchAg);
  var _super = _createSuper(ArrowTableBatchAggregator);
  function ArrowTableBatchAggregator(schema, options) {
    var _this;
    (0, _classCallCheck2.default)(this, ArrowTableBatchAggregator);
    _this = _super.call(this, schema, options);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "arrowSchema", void 0);
    _this.arrowSchema = null;
    return _this;
  }
  (0, _createClass2.default)(ArrowTableBatchAggregator, [{
    key: "getBatch",
    value: function getBatch() {
      var batch = (0, _get2.default)((0, _getPrototypeOf2.default)(ArrowTableBatchAggregator.prototype), "getBatch", this).call(this);
      if (batch) {
        this.arrowSchema = this.arrowSchema || getArrowSchema(batch.schema);
        var arrowVectors = getArrowVectors(this.arrowSchema, batch.data);
        var recordBatch = new _apacheArrow.RecordBatch(this.arrowSchema, (0, _apacheArrow.makeData)({
          type: new _apacheArrow.Struct(this.arrowSchema.fields),
          children: arrowVectors.map(function (_ref) {
            var data = _ref.data;
            return data[0];
          })
        }));
        return {
          shape: 'arrow-table',
          batchType: 'data',
          data: recordBatch,
          length: batch.length
        };
      }
      return null;
    }
  }]);
  return ArrowTableBatchAggregator;
}(_schema.ColumnarTableBatchAggregator);
exports.default = ArrowTableBatchAggregator;
function getArrowSchema(schema) {
  var arrowFields = [];
  for (var key in schema) {
    var field = schema[key];
    if (field.type === Float32Array) {
      var metadata = new Map();
      var arrowField = new _apacheArrow.Field(field.name, new _apacheArrow.Float32(), field.nullable, metadata);
      arrowFields.push(arrowField);
    }
  }
  if (arrowFields.length === 0) {
    throw new Error('No arrow convertible fields');
  }
  return new _apacheArrow.Schema(arrowFields);
}
function getArrowVectors(arrowSchema, data) {
  var arrowVectors = [];
  var _iterator = _createForOfIteratorHelper(arrowSchema.fields),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var field = _step.value;
      var vector = data[field.name];
      if (vector instanceof Float32Array) {
        var arrowVector = (0, _apacheArrow.makeVector)(vector);
        arrowVectors.push(arrowVector);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (arrowSchema.fields.length !== arrowVectors.length) {
    throw new Error('Some columns not arrow convertible');
  }
  return arrowVectors;
}
//# sourceMappingURL=arrow-table-batch.js.map