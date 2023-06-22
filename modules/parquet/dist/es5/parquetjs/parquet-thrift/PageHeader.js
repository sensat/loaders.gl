"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageHeader = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var thrift = _interopRequireWildcard(require("thrift"));
var DataPageHeader = _interopRequireWildcard(require("./DataPageHeader"));
var DataPageHeaderV2 = _interopRequireWildcard(require("./DataPageHeaderV2"));
var DictionaryPageHeader = _interopRequireWildcard(require("./DictionaryPageHeader"));
var IndexPageHeader = _interopRequireWildcard(require("./IndexPageHeader"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var PageHeader = function () {
  function PageHeader(args) {
    (0, _classCallCheck2.default)(this, PageHeader);
    (0, _defineProperty2.default)(this, "type", void 0);
    (0, _defineProperty2.default)(this, "uncompressed_page_size", void 0);
    (0, _defineProperty2.default)(this, "compressed_page_size", void 0);
    (0, _defineProperty2.default)(this, "crc", void 0);
    (0, _defineProperty2.default)(this, "data_page_header", void 0);
    (0, _defineProperty2.default)(this, "index_page_header", void 0);
    (0, _defineProperty2.default)(this, "dictionary_page_header", void 0);
    (0, _defineProperty2.default)(this, "data_page_header_v2", void 0);
    if (args != null && args.type != null) {
      this.type = args.type;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[type] is unset!');
    }
    if (args != null && args.uncompressed_page_size != null) {
      this.uncompressed_page_size = args.uncompressed_page_size;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[uncompressed_page_size] is unset!');
    }
    if (args != null && args.compressed_page_size != null) {
      this.compressed_page_size = args.compressed_page_size;
    } else {
      throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Required field[compressed_page_size] is unset!');
    }
    if (args != null && args.crc != null) {
      this.crc = args.crc;
    }
    if (args != null && args.data_page_header != null) {
      this.data_page_header = args.data_page_header;
    }
    if (args != null && args.index_page_header != null) {
      this.index_page_header = args.index_page_header;
    }
    if (args != null && args.dictionary_page_header != null) {
      this.dictionary_page_header = args.dictionary_page_header;
    }
    if (args != null && args.data_page_header_v2 != null) {
      this.data_page_header_v2 = args.data_page_header_v2;
    }
  }
  (0, _createClass2.default)(PageHeader, [{
    key: "write",
    value: function write(output) {
      output.writeStructBegin('PageHeader');
      if (this.type != null) {
        output.writeFieldBegin('type', thrift.Thrift.Type.I32, 1);
        output.writeI32(this.type);
        output.writeFieldEnd();
      }
      if (this.uncompressed_page_size != null) {
        output.writeFieldBegin('uncompressed_page_size', thrift.Thrift.Type.I32, 2);
        output.writeI32(this.uncompressed_page_size);
        output.writeFieldEnd();
      }
      if (this.compressed_page_size != null) {
        output.writeFieldBegin('compressed_page_size', thrift.Thrift.Type.I32, 3);
        output.writeI32(this.compressed_page_size);
        output.writeFieldEnd();
      }
      if (this.crc != null) {
        output.writeFieldBegin('crc', thrift.Thrift.Type.I32, 4);
        output.writeI32(this.crc);
        output.writeFieldEnd();
      }
      if (this.data_page_header != null) {
        output.writeFieldBegin('data_page_header', thrift.Thrift.Type.STRUCT, 5);
        this.data_page_header.write(output);
        output.writeFieldEnd();
      }
      if (this.index_page_header != null) {
        output.writeFieldBegin('index_page_header', thrift.Thrift.Type.STRUCT, 6);
        this.index_page_header.write(output);
        output.writeFieldEnd();
      }
      if (this.dictionary_page_header != null) {
        output.writeFieldBegin('dictionary_page_header', thrift.Thrift.Type.STRUCT, 7);
        this.dictionary_page_header.write(output);
        output.writeFieldEnd();
      }
      if (this.data_page_header_v2 != null) {
        output.writeFieldBegin('data_page_header_v2', thrift.Thrift.Type.STRUCT, 8);
        this.data_page_header_v2.write(output);
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
              _args.type = value_1;
            } else {
              input.skip(fieldType);
            }
            break;
          case 2:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_2 = input.readI32();
              _args.uncompressed_page_size = value_2;
            } else {
              input.skip(fieldType);
            }
            break;
          case 3:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_3 = input.readI32();
              _args.compressed_page_size = value_3;
            } else {
              input.skip(fieldType);
            }
            break;
          case 4:
            if (fieldType === thrift.Thrift.Type.I32) {
              var value_4 = input.readI32();
              _args.crc = value_4;
            } else {
              input.skip(fieldType);
            }
            break;
          case 5:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              var value_5 = DataPageHeader.DataPageHeader.read(input);
              _args.data_page_header = value_5;
            } else {
              input.skip(fieldType);
            }
            break;
          case 6:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              var value_6 = IndexPageHeader.IndexPageHeader.read(input);
              _args.index_page_header = value_6;
            } else {
              input.skip(fieldType);
            }
            break;
          case 7:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              var value_7 = DictionaryPageHeader.DictionaryPageHeader.read(input);
              _args.dictionary_page_header = value_7;
            } else {
              input.skip(fieldType);
            }
            break;
          case 8:
            if (fieldType === thrift.Thrift.Type.STRUCT) {
              var value_8 = DataPageHeaderV2.DataPageHeaderV2.read(input);
              _args.data_page_header_v2 = value_8;
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
      if (_args.type !== undefined && _args.uncompressed_page_size !== undefined && _args.compressed_page_size !== undefined) {
        return new PageHeader(_args);
      } else {
        throw new thrift.Thrift.TProtocolException(thrift.Thrift.TProtocolExceptionType.UNKNOWN, 'Unable to read PageHeader from input');
      }
    }
  }]);
  return PageHeader;
}();
exports.PageHeader = PageHeader;
//# sourceMappingURL=PageHeader.js.map