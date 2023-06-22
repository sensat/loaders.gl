"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColumnOrder = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
var TypeDefinedOrder = _interopRequireWildcard(require("./TypeDefinedOrder"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var ColumnOrder = function () {
  function ColumnOrder(args) {
    (0, _classCallCheck2.default)(this, ColumnOrder);
    (0, _defineProperty2.default)(this, "TYPE_ORDER", void 0);
    var _fieldsSet = 0;
    if (args != null) {
      if (args.TYPE_ORDER != null) {
        _fieldsSet++;
        this.TYPE_ORDER = args.TYPE_ORDER;
      }
      if (_fieldsSet > 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with more than one set value!');
      } else if (_fieldsSet < 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with no set value!');
      }
    }
  }
  (0, _createClass2.default)(ColumnOrder, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('ColumnOrder');
      if (this.TYPE_ORDER != null) {
        output.writeFieldBegin('TYPE_ORDER', thrift.Thrift.Type.STRUCT, 1);
        this.TYPE_ORDER.write(output);
        output.writeFieldEnd();
      }
      output.writeFieldStop();
      output.writeStructEnd();
      return;
    }
  }], [{
    key: "fromTYPE_ORDER",
    value: function fromTYPE_ORDER(TYPE_ORDER) {
      return new ColumnOrder({
        TYPE_ORDER: TYPE_ORDER
      });
    }
  }, {
    key: "read",
    value: function read(input) {
      var _fieldsSet = 0;
      var _returnValue = null;
      input.readStructBegin();
      while (true) {
        var ret = input.readFieldBegin();
        var fieldType = ret.ftype;
        var fieldId = ret.fid;
        if (fieldType === thrift.Thrift.Type.STOP) {
          break;
        }
        switch (fieldId) {
          case 1:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_1 = TypeDefinedOrder.TypeDefinedOrder.read(input);
              _returnValue = ColumnOrder.fromTYPE_ORDER(value_1);
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
      if (_fieldsSet > 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with more than one set value!');
      } else if (_fieldsSet < 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with no set value!');
      }
      if (_returnValue !== null) {
        return _returnValue;
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read data for TUnion');
      }
    }
  }]);
  return ColumnOrder;
}();
exports.ColumnOrder = ColumnOrder;
//# sourceMappingURL=ColumnOrder.js.map