"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeType = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
var TimeUnit = _interopRequireWildcard(require("./TimeUnit"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var TimeType = function () {
  function TimeType(args) {
    (0, _classCallCheck2.default)(this, TimeType);
    (0, _defineProperty2.default)(this, "isAdjustedToUTC", void 0);
    (0, _defineProperty2.default)(this, "unit", void 0);
    if (args != null && args.isAdjustedToUTC != null) {
      this.isAdjustedToUTC = args.isAdjustedToUTC;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[isAdjustedToUTC] is unset!');
    }
    if (args != null && args.unit != null) {
      this.unit = args.unit;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[unit] is unset!');
    }
  }
  (0, _createClass2.default)(TimeType, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('TimeType');
      if (this.isAdjustedToUTC != null) {
        output.writeFieldBegin('isAdjustedToUTC', thrift.Thrift.Type.BOOL, 1);
        output.writeBool(this.isAdjustedToUTC);
        output.writeFieldEnd();
      }
      if (this.unit != null) {
        output.writeFieldBegin('unit', thrift.Thrift.Type.STRUCT, 2);
        this.unit.write(output);
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
            if (fieldType === thrift.Thrift.Type.BOOL) {
              var value_1 = input.readBool();
              _args.isAdjustedToUTC = value_1;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              var value_2 = TimeUnit.TimeUnit.read(input);
              _args.unit = value_2;
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
      if (_args.isAdjustedToUTC !== undefined && _args.unit !== undefined) {
        return new TimeType(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read TimeType from input');
      }
    }
  }]);
  return TimeType;
}();
exports.TimeType = TimeType;
//# sourceMappingURL=TimeType.js.map