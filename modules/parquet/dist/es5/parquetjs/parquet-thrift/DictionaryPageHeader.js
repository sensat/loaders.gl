"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DictionaryPageHeader = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var DictionaryPageHeader = function () {
  function DictionaryPageHeader(args) {
    (0, _classCallCheck2.default)(this, DictionaryPageHeader);
    (0, _defineProperty2.default)(this, "num_values", void 0);
    (0, _defineProperty2.default)(this, "encoding", void 0);
    (0, _defineProperty2.default)(this, "is_sorted", void 0);
    if (args != null && args.num_values != null) {
      this.num_values = args.num_values;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[num_values] is unset!');
    }
    if (args != null && args.encoding != null) {
      this.encoding = args.encoding;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[encoding] is unset!');
    }
    if (args != null && args.is_sorted != null) {
      this.is_sorted = args.is_sorted;
    }
  }
  (0, _createClass2.default)(DictionaryPageHeader, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('DictionaryPageHeader');
      if (this.num_values != null) {
        output.writeFieldBegin('num_values', thrift.Thrift.Type.I32, 1);
        output.writeI32(this.num_values);
        output.writeFieldEnd();
      }
      if (this.encoding != null) {
        output.writeFieldBegin('encoding', thrift.Thrift.Type.I32, 2);
        output.writeI32(this.encoding);
        output.writeFieldEnd();
      }
      if (this.is_sorted != null) {
        output.writeFieldBegin('is_sorted', thrift.Thrift.Type.BOOL, 3);
        output.writeBool(this.is_sorted);
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
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_1 = input.readI32();
              _args.num_values = value_1;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_2 = input.readI32();
              _args.encoding = value_2;
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.BOOL) {
              var value_3 = input.readBool();
              _args.is_sorted = value_3;
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
      if (_args.num_values !== undefined && _args.encoding !== undefined) {
        return new DictionaryPageHeader(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read DictionaryPageHeader from input');
      }
    }
  }]);
  return DictionaryPageHeader;
}();
exports.DictionaryPageHeader = DictionaryPageHeader;
//# sourceMappingURL=DictionaryPageHeader.js.map