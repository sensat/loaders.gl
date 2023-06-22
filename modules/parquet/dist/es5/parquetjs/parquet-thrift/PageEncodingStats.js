"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageEncodingStats = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var PageEncodingStats = function () {
  function PageEncodingStats(args) {
    (0, _classCallCheck2.default)(this, PageEncodingStats);
    (0, _defineProperty2.default)(this, "page_type", void 0);
    (0, _defineProperty2.default)(this, "encoding", void 0);
    (0, _defineProperty2.default)(this, "count", void 0);
    if (args != null && args.page_type != null) {
      this.page_type = args.page_type;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[page_type] is unset!');
    }
    if (args != null && args.encoding != null) {
      this.encoding = args.encoding;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[encoding] is unset!');
    }
    if (args != null && args.count != null) {
      this.count = args.count;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[count] is unset!');
    }
  }
  (0, _createClass2.default)(PageEncodingStats, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('PageEncodingStats');
      if (this.page_type != null) {
        output.writeFieldBegin('page_type', thrift.Thrift.Type.I32, 1);
        output.writeI32(this.page_type);
        output.writeFieldEnd();
      }
      if (this.encoding != null) {
        output.writeFieldBegin('encoding', thrift.Thrift.Type.I32, 2);
        output.writeI32(this.encoding);
        output.writeFieldEnd();
      }
      if (this.count != null) {
        output.writeFieldBegin('count', thrift.Thrift.Type.I32, 3);
        output.writeI32(this.count);
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
              _args.page_type = value_1;
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
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_3 = input.readI32();
              _args.count = value_3;
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
      if (_args.page_type !== undefined && _args.encoding !== undefined && _args.count !== undefined) {
        return new PageEncodingStats(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read PageEncodingStats from input');
      }
    }
  }]);
  return PageEncodingStats;
}();
exports.PageEncodingStats = PageEncodingStats;
//# sourceMappingURL=PageEncodingStats.js.map