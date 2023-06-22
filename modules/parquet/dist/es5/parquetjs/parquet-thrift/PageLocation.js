"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageLocation = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _nodeInt = _interopRequireDefault(require("node-int64"));
var thrift = _interopRequireWildcard(require("thrift"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var PageLocation = function () {
  function PageLocation(args) {
    (0, _classCallCheck2.default)(this, PageLocation);
    (0, _defineProperty2.default)(this, "offset", void 0);
    (0, _defineProperty2.default)(this, "compressed_page_size", void 0);
    (0, _defineProperty2.default)(this, "first_row_index", void 0);
    if (args != null && args.offset != null) {
      if (typeof args.offset === 'number') {
        this.offset = new _nodeInt.default(args.offset);
      } else {
        this.offset = args.offset;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[offset] is unset!');
    }
    if (args != null && args.compressed_page_size != null) {
      this.compressed_page_size = args.compressed_page_size;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[compressed_page_size] is unset!');
    }
    if (args != null && args.first_row_index != null) {
      if (typeof args.first_row_index === 'number') {
        this.first_row_index = new _nodeInt.default(args.first_row_index);
      } else {
        this.first_row_index = args.first_row_index;
      }
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[first_row_index] is unset!');
    }
  }
  (0, _createClass2.default)(PageLocation, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('PageLocation');
      if (this.offset != null) {
        output.writeFieldBegin('offset', thrift.Thrift.Type.I64, 1);
        output.writeI64(this.offset);
        output.writeFieldEnd();
      }
      if (this.compressed_page_size != null) {
        output.writeFieldBegin('compressed_page_size', thrift.Thrift.Type.I32, 2);
        output.writeI32(this.compressed_page_size);
        output.writeFieldEnd();
      }
      if (this.first_row_index != null) {
        output.writeFieldBegin('first_row_index', thrift.Thrift.Type.I64, 3);
        output.writeI64(this.first_row_index);
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
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_1 = input.readI64();
              _args.offset = value_1;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_2 = input.readI32();
              _args.compressed_page_size = value_2;
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.I64) {
              var value_3 = input.readI64();
              _args.first_row_index = value_3;
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
      if (_args.offset !== undefined && _args.compressed_page_size !== undefined && _args.first_row_index !== undefined) {
        return new PageLocation(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read PageLocation from input');
      }
    }
  }]);
  return PageLocation;
}();
exports.PageLocation = PageLocation;
//# sourceMappingURL=PageLocation.js.map