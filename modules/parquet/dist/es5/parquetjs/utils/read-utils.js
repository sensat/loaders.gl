"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeFileMetadata = decodeFileMetadata;
exports.decodePageHeader = decodePageHeader;
exports.decodeThrift = decodeThrift;
exports.fieldIndexOf = fieldIndexOf;
exports.getBitWidth = getBitWidth;
exports.getThriftEnum = getThriftEnum;
exports.serializeThrift = serializeThrift;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _thrift = require("thrift");
var _parquetThrift = require("../parquet-thrift");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var UFramedTransport = function (_TFramedTransport) {
  (0, _inherits2.default)(UFramedTransport, _TFramedTransport);
  var _super = _createSuper(UFramedTransport);
  function UFramedTransport() {
    var _this;
    (0, _classCallCheck2.default)(this, UFramedTransport);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "readPos", 0);
    return _this;
  }
  return (0, _createClass2.default)(UFramedTransport);
}(_thrift.TFramedTransport);
function serializeThrift(obj) {
  var output = [];
  var transport = new _thrift.TBufferedTransport(undefined, function (buf) {
    output.push(buf);
  });
  var protocol = new _thrift.TCompactProtocol(transport);
  obj.write(protocol);
  transport.flush();
  return Buffer.concat(output);
}
function decodeThrift(obj, buf, offset) {
  if (!offset) {
    offset = 0;
  }
  var transport = new UFramedTransport(buf);
  transport.readPos = offset;
  var protocol = new _thrift.TCompactProtocol(transport);
  obj.read(protocol);
  return transport.readPos - offset;
}
function getThriftEnum(klass, value) {
  for (var k in klass) {
    if (klass[k] === value) {
      return k;
    }
  }
  throw new Error('Invalid ENUM value');
}
function decodeFileMetadata(buf, offset) {
  if (!offset) {
    offset = 0;
  }
  var transport = new UFramedTransport(buf);
  transport.readPos = offset;
  var protocol = new _thrift.TCompactProtocol(transport);
  var metadata = _parquetThrift.FileMetaData.read(protocol);
  return {
    length: transport.readPos - offset,
    metadata: metadata
  };
}
function decodePageHeader(buf, offset) {
  if (!offset) {
    offset = 0;
  }
  var transport = new UFramedTransport(buf);
  transport.readPos = offset;
  var protocol = new _thrift.TCompactProtocol(transport);
  var pageHeader = _parquetThrift.PageHeader.read(protocol);
  return {
    length: transport.readPos - offset,
    pageHeader: pageHeader
  };
}
function getBitWidth(val) {
  if (val === 0) {
    return 0;
  }
  return Math.ceil(Math.log2(val + 1));
}
function fieldIndexOf(arr, elem) {
  for (var j = 0; j < arr.length; j++) {
    if (arr[j].length > elem.length) {
      continue;
    }
    var m = true;
    for (var i = 0; i < elem.length; i++) {
      if (arr[j][i] === elem[i] || arr[j][i] === '+' || arr[j][i] === '#') {
        continue;
      }
      if (i >= arr[j].length && arr[j][arr[j].length - 1] === '#') {
        continue;
      }
      m = false;
      break;
    }
    if (m) return j;
  }
  return -1;
}
//# sourceMappingURL=read-utils.js.map