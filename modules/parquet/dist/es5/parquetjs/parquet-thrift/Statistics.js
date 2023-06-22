"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Statistics = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _nodeInt = _interopRequireDefault(require("node-int64"));
var thrift = _interopRequireWildcard(require("thrift"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var Statistics = function () {
  function Statistics(args) {
    (0, _classCallCheck2.default)(this, Statistics);
    (0, _defineProperty2.default)(this, "max", void 0);
    (0, _defineProperty2.default)(this, "min", void 0);
    (0, _defineProperty2.default)(this, "null_count", void 0);
    (0, _defineProperty2.default)(this, "distinct_count", void 0);
    (0, _defineProperty2.default)(this, "max_value", void 0);
    (0, _defineProperty2.default)(this, "min_value", void 0);
    if (args != null && args.max != null) {
      this.max = args.max;
    }
    if (args != null && args.min != null) {
      this.min = args.min;
    }
    if (args != null && args.null_count != null) {
      if (typeof args.null_count === 'number') {
        this.null_count = new _nodeInt.default(args.null_count);
      } else {
        this.null_count = args.null_count;
      }
    }
    if (args != null && args.distinct_count != null) {
      if (typeof args.distinct_count === 'number') {
        this.distinct_count = new _nodeInt.default(args.distinct_count);
      } else {
        this.distinct_count = args.distinct_count;
      }
    }
    if (args != null && args.max_value != null) {
      this.max_value = args.max_value;
    }
    if (args != null && args.min_value != null) {
      this.min_value = args.min_value;
    }
  }
  (0, _createClass2.default)(Statistics, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('Statistics');
      if (this.max != null) {
        output.writeFieldBegin('max', thrift.Thrift.Type.STRING, 1);
        output.writeBinary(this.max);
        output.writeFieldEnd();
      }
      if (this.min != null) {
        output.writeFieldBegin('min', thrift.Thrift.Type.STRING, 2);
        output.writeBinary(this.min);
        output.writeFieldEnd();
      }
      if (this.null_count != null) {
        output.writeFieldBegin('null_count', thrift.Thrift.Type.I64, 3);
        output.writeI64(this.null_count);
        output.writeFieldEnd();
      }
      if (this.distinct_count != null) {
        output.writeFieldBegin('distinct_count', thrift.Thrift.Type.I64, 4);
        output.writeI64(this.distinct_count);
        output.writeFieldEnd();
      }
      if (this.max_value != null) {
        output.writeFieldBegin('max_value', thrift.Thrift.Type.STRING, 5);
        output.writeBinary(this.max_value);
        output.writeFieldEnd();
      }
      if (this.min_value != null) {
        output.writeFieldBegin('min_value', thrift.Thrift.Type.STRING, 6);
        output.writeBinary(this.min_value);
        output.writeFieldEnd();
      }
      output.writeFieldStop();
      output.writeStructEnd();
      return;
    }
  }], [{
    key: "read",
    value: function read(input) {
      input.readStructBegin();
      var _args = {};
      while (true) {
        var ret = input.readFieldBegin();
        var fieldType = ret.ftype;
        var fieldId = ret.fid;
        if (fieldType === thrift.Thrift.Type.STOP) {
          break;
        }
        switch (fieldId) {
          case 1:
            if (fieldType === thrift.Thrift.Type.STRING) {
              var value_1 = input.readBinary();
              _args.max = value_1;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.STRING) {
              var value_2 = input.readBinary();
              _args.min = value_2;
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_3 = input.readI64();
              _args.null_count = value_3;
            } else {
              input.skip(fieldType);
            }
            break;
          case 4:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_4 = input.readI64();
              _args.distinct_count = value_4;
            } else {
              input.skip(fieldType);
            }
            break;
          case 5:
            if (fieldType === thrift.Thrift.Type.STRING) {
              var value_5 = input.readBinary();
              _args.max_value = value_5;
            } else {
              input.skip(fieldType);
            }
            break;
          case 6:
            if (fieldType === thrift.Thrift.Type.STRING) {
              var value_6 = input.readBinary();
              _args.min_value = value_6;
            } else {
              input.skip(fieldType);
            }
            break;
          default:
            {
              input.skip(fieldType);
            }
        }
        input.readFieldEnd();
      }
      input.readStructEnd();
      return new Statistics(_args);
    }
  }]);
  return Statistics;
}();
exports.Statistics = Statistics;
//# sourceMappingURL=Statistics.js.map