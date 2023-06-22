"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeUnit = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
var MicroSeconds = _interopRequireWildcard(require("./MicroSeconds"));
var MilliSeconds = _interopRequireWildcard(require("./MilliSeconds"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var TimeUnit = function () {
  function TimeUnit(args) {
    (0, _classCallCheck2.default)(this, TimeUnit);
    (0, _defineProperty2.default)(this, "MILLIS", void 0);
    (0, _defineProperty2.default)(this, "MICROS", void 0);
    var _fieldsSet = 0;
    if (args != null) {
      if (args.MILLIS != null) {
        _fieldsSet++;
        this.MILLIS = args.MILLIS;
      }
      if (args.MICROS != null) {
        _fieldsSet++;
        this.MICROS = args.MICROS;
      }
      if (_fieldsSet > 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with more than one set value!');
      } else if (_fieldsSet < 1) {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.INVALID_DATA, 'Cannot read a TUnion with no set value!');
      }
    }
  }
  (0, _createClass2.default)(TimeUnit, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('TimeUnit');
      if (this.MILLIS != null) {
        output.writeFieldBegin('MILLIS', thrift.Thrift.Type.STRUCT, 1);
        this.MILLIS.write(output);
        output.writeFieldEnd();
      }
      if (this.MICROS != null) {
        output.writeFieldBegin('MICROS', thrift.Thrift.Type.STRUCT, 2);
        this.MICROS.write(output);
        output.writeFieldEnd();
      }
      output.writeFieldStop();
      output.writeStructEnd();
      return;
    }
  }], [{
    key: "fromMILLIS",
    value: function fromMILLIS(MILLIS) {
      return new TimeUnit({
        MILLIS: MILLIS
      });
    }
  }, {
    key: "fromMICROS",
    value: function fromMICROS(MICROS) {
      return new TimeUnit({
        MICROS: MICROS
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
              var value_1 = MilliSeconds.MilliSeconds.read(input);
              _returnValue = TimeUnit.fromMILLIS(value_1);
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              _fieldsSet++;
              var value_2 = MicroSeconds.MicroSeconds.read(input);
              _returnValue = TimeUnit.fromMICROS(value_2);
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
  return TimeUnit;
}();
exports.TimeUnit = TimeUnit;
//# sourceMappingURL=TimeUnit.js.map