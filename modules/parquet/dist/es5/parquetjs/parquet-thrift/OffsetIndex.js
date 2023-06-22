"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OffsetIndex = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
var PageLocation = _interopRequireWildcard(require("./PageLocation"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var OffsetIndex = function () {
  function OffsetIndex(args) {
    (0, _classCallCheck2.default)(this, OffsetIndex);
    (0, _defineProperty2.default)(this, "page_locations", void 0);
    if (args != null && args.page_locations != null) {
      this.page_locations = args.page_locations;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[page_locations] is unset!');
    }
  }
  (0, _createClass2.default)(OffsetIndex, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('OffsetIndex');
      if (this.page_locations != null) {
        output.writeFieldBegin('page_locations', thrift.Thrift.Type.LIST, 1);
        output.writeListBegin(thrift.Thrift.Type.STRUCT, this.page_locations.length);
        this.page_locations.forEach(function (value_1) {
          value_1.write(output);
        });
        output.writeListEnd();
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
            if (fieldType === thrift.Thrift.Type.LIST) {
              var value_2 = new Array();
              var metadata_1 = input.readListBegin();
              var size_1 = metadata_1.size;
              for (var i_1 = 0; i_1 < size_1; i_1++) {
                var value_3 = PageLocation.PageLocation.read(input);
                value_2.push(value_3);
              }
              input.readListEnd();
              _args.page_locations = value_2;
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
      if (_args.page_locations !== undefined) {
        return new OffsetIndex(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read OffsetIndex from input');
      }
    }
  }]);
  return OffsetIndex;
}();
exports.OffsetIndex = OffsetIndex;
//# sourceMappingURL=OffsetIndex.js.map