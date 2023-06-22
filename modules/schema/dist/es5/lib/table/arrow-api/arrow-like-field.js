"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrowLikeField = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var ArrowLikeField = function () {
  function ArrowLikeField(name, type) {
    var nullable = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var metadata = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Map();
    (0, _classCallCheck2.default)(this, ArrowLikeField);
    (0, _defineProperty2.default)(this, "name", void 0);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "nullable", void 0);
    (0, _defineProperty2.default)(this, "metadata", void 0);
    this.name = name;
    this.type = type;
    this.nullable = nullable;
    this.metadata = metadata;
  }
  (0, _createClass2.default)(ArrowLikeField, [{
    key: "typeId",
    get: function get() {
      return this.type && this.type.typeId;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new ArrowLikeField(this.name, this.type, this.nullable, this.metadata);
    }
  }, {
    key: "compareTo",
    value: function compareTo(other) {
      return this.name === other.name && this.type === other.type && this.nullable === other.nullable && this.metadata === other.metadata;
    }
  }, {
    key: "toString",
    value: function toString() {
      return "".concat(this.type).concat(this.nullable ? ', nullable' : '').concat(this.metadata ? ", metadata: ".concat(this.metadata) : '');
    }
  }]);
  return ArrowLikeField;
}();
exports.ArrowLikeField = ArrowLikeField;
//# sourceMappingURL=arrow-like-field.js.map