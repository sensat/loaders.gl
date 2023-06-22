"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetCDFReader = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _iobuffer = require("../iobuffer/iobuffer");
var _readHeader = require("./read-header");
var _readData = require("./read-data");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var NetCDFReader = function () {
  function NetCDFReader(data) {
    (0, _classCallCheck2.default)(this, NetCDFReader);
    (0, _defineProperty2.default)(this, "header", void 0);
    (0, _defineProperty2.default)(this, "buffer", void 0);
    var buffer = new _iobuffer.IOBuffer(data);
    buffer.setBigEndian();
    var magic = buffer.readChars(3);
    if (magic !== 'CDF') {
      throw new Error("NetCDF: file should start with 'CDF', found ".concat(magic));
    }
    var version = buffer.readByte();
    if (version > 2) {
      throw new Error("NetCDF: unsupported version ".concat(version));
    }
    this.header = (0, _readHeader.readNetCDFHeader)(buffer, version);
    this.buffer = buffer;
  }
  (0, _createClass2.default)(NetCDFReader, [{
    key: "version",
    get: function get() {
      if (this.header.version === 1) {
        return 'classic format';
      }
      return '64-bit offset format';
    }
  }, {
    key: "recordDimension",
    get: function get() {
      return this.header.recordDimension;
    }
  }, {
    key: "dimensions",
    get: function get() {
      return this.header.dimensions;
    }
  }, {
    key: "attributes",
    get: function get() {
      return this.header.attributes;
    }
  }, {
    key: "variables",
    get: function get() {
      return this.header.variables;
    }
  }, {
    key: "attributeExists",
    value: function attributeExists(attributeName) {
      var attribute = this.attributes.find(function (val) {
        return val.name === attributeName;
      });
      return attribute !== undefined;
    }
  }, {
    key: "getAttribute",
    value: function getAttribute(attributeName) {
      var attribute = this.attributes.find(function (val) {
        return val.name === attributeName;
      });
      if (attribute) return attribute.value;
      return null;
    }
  }, {
    key: "dataVariableExists",
    value: function dataVariableExists(variableName) {
      var variable = this.header.variables.find(function (val) {
        return val.name === variableName;
      });
      return variable !== undefined;
    }
  }, {
    key: "getDataVariableAsString",
    value: function getDataVariableAsString(variableName) {
      var variable = this.getDataVariable(variableName);
      if (variable) return variable.join('');
      return null;
    }
  }, {
    key: "getDataVariable",
    value: function getDataVariable(variableName) {
      var variable;
      if (typeof variableName === 'string') {
        variable = this.header.variables.find(function (val) {
          return val.name === variableName;
        });
      } else {
        variable = variableName;
      }
      if (variable === undefined) {
        throw new Error("NetCDF: variable not found: ".concat(variableName));
      }
      this.buffer.seek(variable.offset);
      if (variable.record) {
        return (0, _readData.readRecord)(this.buffer, variable, this.header.recordDimension);
      }
      return (0, _readData.readNonRecord)(this.buffer, variable);
    }
  }, {
    key: "toString",
    value: function toString() {
      var result = [];
      result.push('DIMENSIONS');
      var _iterator = _createForOfIteratorHelper(this.dimensions),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var dimension = _step.value;
          result.push("  ".concat(dimension.name.padEnd(30), " = size: ").concat(dimension.size));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      result.push('');
      result.push('GLOBAL ATTRIBUTES');
      var _iterator2 = _createForOfIteratorHelper(this.attributes),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var attribute = _step2.value;
          result.push("  ".concat(attribute.name.padEnd(30), " = ").concat(attribute.value));
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var variables = JSON.parse(JSON.stringify(this.variables));
      result.push('');
      result.push('VARIABLES:');
      var _iterator3 = _createForOfIteratorHelper(variables),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var variable = _step3.value;
          variable.value = this.getDataVariable(variable);
          var stringify = JSON.stringify(variable.value);
          if (stringify.length > 50) stringify = stringify.substring(0, 50);
          if (!isNaN(variable.value.length)) {
            stringify += " (length: ".concat(variable.value.length, ")");
          }
          result.push("  ".concat(variable.name.padEnd(30), " = ").concat(stringify));
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      return result.join('\n');
    }
  }]);
  return NetCDFReader;
}();
exports.NetCDFReader = NetCDFReader;
//# sourceMappingURL=netcdf-reader.js.map