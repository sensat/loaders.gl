"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrowLikeSchema = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _arrowLikeField = require("./arrow-like-field");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var ArrowLikeSchema = function () {
  function ArrowLikeSchema(fields) {
    var metadata = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Map();
    (0, _classCallCheck2.default)(this, ArrowLikeSchema);
    (0, _defineProperty2.default)(this, "fields", void 0);
    (0, _defineProperty2.default)(this, "metadata", void 0);
    this.fields = fields.map(function (field) {
      return new _arrowLikeField.ArrowLikeField(field.name, field.type, field.nullable, field.metadata);
    });
    this.metadata = metadata instanceof Map ? metadata : new Map(Object.entries(metadata));
  }
  (0, _createClass2.default)(ArrowLikeSchema, [{
    key: "compareTo",
    value: function compareTo(other) {
      if (this.metadata !== other.metadata) {
        return false;
      }
      if (this.fields.length !== other.fields.length) {
        return false;
      }
      for (var i = 0; i < this.fields.length; ++i) {
        if (!this.fields[i].compareTo(other.fields[i])) {
          return false;
        }
      }
      return true;
    }
  }, {
    key: "select",
    value: function select() {
      var nameMap = Object.create(null);
      for (var _len = arguments.length, columnNames = new Array(_len), _key = 0; _key < _len; _key++) {
        columnNames[_key] = arguments[_key];
      }
      for (var _i = 0, _columnNames = columnNames; _i < _columnNames.length; _i++) {
        var name = _columnNames[_i];
        nameMap[name] = true;
      }
      var selectedFields = this.fields.filter(function (field) {
        return nameMap[field.name];
      });
      return new ArrowLikeSchema(selectedFields, this.metadata);
    }
  }, {
    key: "selectAt",
    value: function selectAt() {
      var _this = this;
      for (var _len2 = arguments.length, columnIndices = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        columnIndices[_key2] = arguments[_key2];
      }
      var selectedFields = columnIndices.map(function (index) {
        return _this.fields[index];
      }).filter(Boolean);
      return new ArrowLikeSchema(selectedFields, this.metadata);
    }
  }, {
    key: "assign",
    value: function assign(schemaOrFields) {
      var fields;
      var metadata = this.metadata;
      if (schemaOrFields instanceof ArrowLikeSchema) {
        var otherArrowLikeSchema = schemaOrFields;
        fields = otherArrowLikeSchema.fields;
        metadata = mergeMaps(mergeMaps(new Map(), this.metadata), otherArrowLikeSchema.metadata);
      } else {
        fields = schemaOrFields;
      }
      var fieldMap = Object.create(null);
      var _iterator = _createForOfIteratorHelper(this.fields),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var field = _step.value;
          fieldMap[field.name] = field;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var _iterator2 = _createForOfIteratorHelper(fields),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _field = _step2.value;
          fieldMap[_field.name] = _field;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var mergedFields = Object.values(fieldMap);
      return new ArrowLikeSchema(mergedFields, metadata);
    }
  }]);
  return ArrowLikeSchema;
}();
exports.ArrowLikeSchema = ArrowLikeSchema;
function mergeMaps(m1, m2) {
  return new Map([].concat((0, _toConsumableArray2.default)(m1 || new Map()), (0, _toConsumableArray2.default)(m2 || new Map())));
}
//# sourceMappingURL=arrow-like-schema.js.map