"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IntType = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var IntType = function () {
  function IntType(args) {
    (0, _classCallCheck2.default)(this, IntType);
    (0, _defineProperty2.default)(this, "bitWidth", void 0);
    (0, _defineProperty2.default)(this, "isSigned", void 0);
    if (args != null && args.bitWidth != null) {
      this.bitWidth = args.bitWidth;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[bitWidth] is unset!');
    }
    if (args != null && args.isSigned != null) {
      this.isSigned = args.isSigned;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[isSigned] is unset!');
    }
  }
  (0, _createClass2.default)(IntType, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('IntType');
      if (this.bitWidth != null) {
        output.writeFieldBegin('bitWidth', thrift.Thrift.Type.BYTE, 1);
        output.writeByte(this.bitWidth);
        output.writeFieldEnd();
      }
      if (this.isSigned != null) {
        output.writeFieldBegin('isSigned', thrift.Thrift.Type.BOOL, 2);
        output.writeBool(this.isSigned);
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
            if (fieldType === thrift.Thrift.Type.BYTE) {
              var value_1 = input.readByte();
              _args.bitWidth = value_1;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.BOOL) {
              var value_2 = input.readBool();
              _args.isSigned = value_2;
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
      if (_args.bitWidth !== undefined && _args.isSigned !== undefined) {
        return new IntType(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read IntType from input');
      }
    }
  }]);
  return IntType;
}();
exports.IntType = IntType;
//# sourceMappingURL=IntType.js.map