"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParquetEnvelopeWriter = exports.ParquetEncoder = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _codecs = require("../codecs");
var Compression = _interopRequireWildcard(require("../compression"));
var Shred = _interopRequireWildcard(require("../schema/shred"));
var _parquetThrift = require("../parquet-thrift");
var _fileUtils = require("../utils/file-utils");
var _readUtils = require("../utils/read-utils");
var _nodeInt = _interopRequireDefault(require("node-int64"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var PARQUET_MAGIC = 'PAR1';
var PARQUET_VERSION = 1;
var PARQUET_DEFAULT_PAGE_SIZE = 8192;
var PARQUET_DEFAULT_ROW_GROUP_SIZE = 4096;
var PARQUET_RDLVL_TYPE = 'INT32';
var PARQUET_RDLVL_ENCODING = 'RLE';
var ParquetEncoder = function () {
  function ParquetEncoder(schema, envelopeWriter, opts) {
    (0, _classCallCheck2.default)(this, ParquetEncoder);
    (0, _defineProperty2.default)(this, "schema", void 0);
    (0, _defineProperty2.default)(this, "envelopeWriter", void 0);
    (0, _defineProperty2.default)(this, "rowBuffer", void 0);
    (0, _defineProperty2.default)(this, "rowGroupSize", void 0);
    (0, _defineProperty2.default)(this, "closed", void 0);
    (0, _defineProperty2.default)(this, "userMetadata", void 0);
    this.schema = schema;
    this.envelopeWriter = envelopeWriter;
    this.rowBuffer = {};
    this.rowGroupSize = opts.rowGroupSize || PARQUET_DEFAULT_ROW_GROUP_SIZE;
    this.closed = false;
    this.userMetadata = {};
    this.writeHeader();
  }
  (0, _createClass2.default)(ParquetEncoder, [{
    key: "writeHeader",
    value: function () {
      var _writeHeader = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return this.envelopeWriter.writeHeader();
            case 3:
              _context.next = 10;
              break;
            case 5:
              _context.prev = 5;
              _context.t0 = _context["catch"](0);
              _context.next = 9;
              return this.envelopeWriter.close();
            case 9:
              throw _context.t0;
            case 10:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 5]]);
      }));
      function writeHeader() {
        return _writeHeader.apply(this, arguments);
      }
      return writeHeader;
    }()
  }, {
    key: "appendRow",
    value: function () {
      var _appendRow = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(row) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!this.closed) {
                _context2.next = 2;
                break;
              }
              throw new Error('writer was closed');
            case 2:
              Shred.shredRecord(this.schema, row, this.rowBuffer);
              if (this.rowBuffer.rowCount >= this.rowGroupSize) {
                this.rowBuffer = {};
              }
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function appendRow(_x) {
        return _appendRow.apply(this, arguments);
      }
      return appendRow;
    }()
  }, {
    key: "close",
    value: function () {
      var _close = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(callback) {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!this.closed) {
                _context3.next = 2;
                break;
              }
              throw new Error('writer was closed');
            case 2:
              this.closed = true;
              if (this.rowBuffer.rowCount > 0 || this.rowBuffer.rowCount >= this.rowGroupSize) {
                this.rowBuffer = {};
              }
              _context3.next = 6;
              return this.envelopeWriter.writeFooter(this.userMetadata);
            case 6:
              _context3.next = 8;
              return this.envelopeWriter.close();
            case 8:
              if (callback) {
                callback();
              }
            case 9:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function close(_x2) {
        return _close.apply(this, arguments);
      }
      return close;
    }()
  }, {
    key: "setMetadata",
    value: function setMetadata(key, value) {
      this.userMetadata[String(key)] = String(value);
    }
  }, {
    key: "setRowGroupSize",
    value: function setRowGroupSize(cnt) {
      this.rowGroupSize = cnt;
    }
  }, {
    key: "setPageSize",
    value: function setPageSize(cnt) {
      this.envelopeWriter.setPageSize(cnt);
    }
  }], [{
    key: "openFile",
    value: function () {
      var _openFile = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4(schema, path, opts) {
        var outputStream;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _fileUtils.osopen)(path, opts);
            case 2:
              outputStream = _context4.sent;
              return _context4.abrupt("return", ParquetEncoder.openStream(schema, outputStream, opts));
            case 4:
            case "end":
              return _context4.stop();
          }
        }, _callee4);
      }));
      function openFile(_x3, _x4, _x5) {
        return _openFile.apply(this, arguments);
      }
      return openFile;
    }()
  }, {
    key: "openStream",
    value: function () {
      var _openStream = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5(schema, outputStream) {
        var opts,
          envelopeWriter,
          _args5 = arguments;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              opts = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : {};
              _context5.next = 3;
              return ParquetEnvelopeWriter.openStream(schema, outputStream, opts);
            case 3:
              envelopeWriter = _context5.sent;
              return _context5.abrupt("return", new ParquetEncoder(schema, envelopeWriter, opts));
            case 5:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      function openStream(_x6, _x7) {
        return _openStream.apply(this, arguments);
      }
      return openStream;
    }()
  }]);
  return ParquetEncoder;
}();
exports.ParquetEncoder = ParquetEncoder;
var ParquetEnvelopeWriter = function () {
  function ParquetEnvelopeWriter(schema, writeFn, closeFn, fileOffset, opts) {
    (0, _classCallCheck2.default)(this, ParquetEnvelopeWriter);
    (0, _defineProperty2.default)(this, "schema", void 0);
    (0, _defineProperty2.default)(this, "write", void 0);
    (0, _defineProperty2.default)(this, "close", void 0);
    (0, _defineProperty2.default)(this, "offset", void 0);
    (0, _defineProperty2.default)(this, "rowCount", void 0);
    (0, _defineProperty2.default)(this, "rowGroups", void 0);
    (0, _defineProperty2.default)(this, "pageSize", void 0);
    (0, _defineProperty2.default)(this, "useDataPageV2", void 0);
    this.schema = schema;
    this.write = writeFn;
    this.close = closeFn;
    this.offset = fileOffset;
    this.rowCount = 0;
    this.rowGroups = [];
    this.pageSize = opts.pageSize || PARQUET_DEFAULT_PAGE_SIZE;
    this.useDataPageV2 = 'useDataPageV2' in opts ? Boolean(opts.useDataPageV2) : false;
  }
  (0, _createClass2.default)(ParquetEnvelopeWriter, [{
    key: "writeSection",
    value: function writeSection(buf) {
      this.offset += buf.length;
      return this.write(buf);
    }
  }, {
    key: "writeHeader",
    value: function writeHeader() {
      return this.writeSection(Buffer.from(PARQUET_MAGIC));
    }
  }, {
    key: "writeRowGroup",
    value: function () {
      var _writeRowGroup = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee6(records) {
        var rgroup;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return encodeRowGroup(this.schema, records, {
                baseOffset: this.offset,
                pageSize: this.pageSize,
                useDataPageV2: this.useDataPageV2
              });
            case 2:
              rgroup = _context6.sent;
              this.rowCount += records.rowCount;
              this.rowGroups.push(rgroup.metadata);
              _context6.next = 7;
              return this.writeSection(rgroup.body);
            case 7:
              return _context6.abrupt("return", _context6.sent);
            case 8:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function writeRowGroup(_x8) {
        return _writeRowGroup.apply(this, arguments);
      }
      return writeRowGroup;
    }()
  }, {
    key: "writeFooter",
    value: function writeFooter(userMetadata) {
      if (!userMetadata) {
        userMetadata = {};
      }
      return this.writeSection(encodeFooter(this.schema, this.rowCount, this.rowGroups, userMetadata));
    }
  }, {
    key: "setPageSize",
    value: function setPageSize(cnt) {
      this.pageSize = cnt;
    }
  }], [{
    key: "openStream",
    value: function () {
      var _openStream2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee7(schema, outputStream, opts) {
        var writeFn, closeFn;
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              writeFn = _fileUtils.oswrite.bind(undefined, outputStream);
              closeFn = _fileUtils.osclose.bind(undefined, outputStream);
              return _context7.abrupt("return", new ParquetEnvelopeWriter(schema, writeFn, closeFn, 0, opts));
            case 3:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function openStream(_x9, _x10, _x11) {
        return _openStream2.apply(this, arguments);
      }
      return openStream;
    }()
  }]);
  return ParquetEnvelopeWriter;
}();
exports.ParquetEnvelopeWriter = ParquetEnvelopeWriter;
function encodeValues(type, encoding, values, opts) {
  if (!(encoding in _codecs.PARQUET_CODECS)) {
    throw new Error("invalid encoding: ".concat(encoding));
  }
  return _codecs.PARQUET_CODECS[encoding].encodeValues(type, values, opts);
}
function encodeDataPage(_x12, _x13) {
  return _encodeDataPage.apply(this, arguments);
}
function _encodeDataPage() {
  _encodeDataPage = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee8(column, data) {
    var rLevelsBuf, dLevelsBuf, valuesBuf, dataBuf, compressedBuf, header, headerBuf, page;
    return _regenerator.default.wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          rLevelsBuf = Buffer.alloc(0);
          if (column.rLevelMax > 0) {
            rLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.rlevels, {
              bitWidth: (0, _readUtils.getBitWidth)(column.rLevelMax)
            });
          }
          dLevelsBuf = Buffer.alloc(0);
          if (column.dLevelMax > 0) {
            dLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.dlevels, {
              bitWidth: (0, _readUtils.getBitWidth)(column.dLevelMax)
            });
          }
          valuesBuf = encodeValues(column.primitiveType, column.encoding, data.values, {
            typeLength: column.typeLength,
            bitWidth: column.typeLength
          });
          dataBuf = Buffer.concat([rLevelsBuf, dLevelsBuf, valuesBuf]);
          _context8.next = 8;
          return Compression.deflate(column.compression, dataBuf);
        case 8:
          compressedBuf = _context8.sent;
          header = new _parquetThrift.PageHeader({
            type: _parquetThrift.PageType.DATA_PAGE,
            data_page_header: new _parquetThrift.DataPageHeader({
              num_values: data.count,
              encoding: _parquetThrift.Encoding[column.encoding],
              definition_level_encoding: _parquetThrift.Encoding[PARQUET_RDLVL_ENCODING],
              repetition_level_encoding: _parquetThrift.Encoding[PARQUET_RDLVL_ENCODING]
            }),
            uncompressed_page_size: dataBuf.length,
            compressed_page_size: compressedBuf.length
          });
          headerBuf = (0, _readUtils.serializeThrift)(header);
          page = Buffer.concat([headerBuf, compressedBuf]);
          return _context8.abrupt("return", {
            header: header,
            headerSize: headerBuf.length,
            page: page
          });
        case 13:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  }));
  return _encodeDataPage.apply(this, arguments);
}
function encodeDataPageV2(_x14, _x15, _x16) {
  return _encodeDataPageV.apply(this, arguments);
}
function _encodeDataPageV() {
  _encodeDataPageV = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee9(column, data, rowCount) {
    var valuesBuf, compressedBuf, rLevelsBuf, dLevelsBuf, header, headerBuf, page;
    return _regenerator.default.wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          valuesBuf = encodeValues(column.primitiveType, column.encoding, data.values, {
            typeLength: column.typeLength,
            bitWidth: column.typeLength
          });
          _context9.next = 3;
          return Compression.deflate(column.compression, valuesBuf);
        case 3:
          compressedBuf = _context9.sent;
          rLevelsBuf = Buffer.alloc(0);
          if (column.rLevelMax > 0) {
            rLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.rlevels, {
              bitWidth: (0, _readUtils.getBitWidth)(column.rLevelMax),
              disableEnvelope: true
            });
          }
          dLevelsBuf = Buffer.alloc(0);
          if (column.dLevelMax > 0) {
            dLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.dlevels, {
              bitWidth: (0, _readUtils.getBitWidth)(column.dLevelMax),
              disableEnvelope: true
            });
          }
          header = new _parquetThrift.PageHeader({
            type: _parquetThrift.PageType.DATA_PAGE_V2,
            data_page_header_v2: new _parquetThrift.DataPageHeaderV2({
              num_values: data.count,
              num_nulls: data.count - data.values.length,
              num_rows: rowCount,
              encoding: _parquetThrift.Encoding[column.encoding],
              definition_levels_byte_length: dLevelsBuf.length,
              repetition_levels_byte_length: rLevelsBuf.length,
              is_compressed: column.compression !== 'UNCOMPRESSED'
            }),
            uncompressed_page_size: rLevelsBuf.length + dLevelsBuf.length + valuesBuf.length,
            compressed_page_size: rLevelsBuf.length + dLevelsBuf.length + compressedBuf.length
          });
          headerBuf = (0, _readUtils.serializeThrift)(header);
          page = Buffer.concat([headerBuf, rLevelsBuf, dLevelsBuf, compressedBuf]);
          return _context9.abrupt("return", {
            header: header,
            headerSize: headerBuf.length,
            page: page
          });
        case 12:
        case "end":
          return _context9.stop();
      }
    }, _callee9);
  }));
  return _encodeDataPageV.apply(this, arguments);
}
function encodeColumnChunk(_x17, _x18, _x19, _x20) {
  return _encodeColumnChunk.apply(this, arguments);
}
function _encodeColumnChunk() {
  _encodeColumnChunk = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee10(column, buffer, offset, opts) {
    var data, baseOffset, pageBuf, total_uncompressed_size, total_compressed_size, result, metadata, metadataOffset, body;
    return _regenerator.default.wrap(function _callee10$(_context10) {
      while (1) switch (_context10.prev = _context10.next) {
        case 0:
          data = buffer.columnData[column.path.join()];
          baseOffset = (opts.baseOffset || 0) + offset;
          total_uncompressed_size = 0;
          total_compressed_size = 0;
          if (!opts.useDataPageV2) {
            _context10.next = 10;
            break;
          }
          _context10.next = 7;
          return encodeDataPageV2(column, data, buffer.rowCount);
        case 7:
          _context10.t0 = _context10.sent;
          _context10.next = 13;
          break;
        case 10:
          _context10.next = 12;
          return encodeDataPage(column, data);
        case 12:
          _context10.t0 = _context10.sent;
        case 13:
          result = _context10.t0;
          pageBuf = result.page;
          total_uncompressed_size += result.header.uncompressed_page_size + result.headerSize;
          total_compressed_size += result.header.compressed_page_size + result.headerSize;
          metadata = new _parquetThrift.ColumnMetaData({
            path_in_schema: column.path,
            num_values: data.count,
            data_page_offset: baseOffset,
            encodings: [],
            total_uncompressed_size: total_uncompressed_size,
            total_compressed_size: total_compressed_size,
            type: _parquetThrift.Type[column.primitiveType],
            codec: _parquetThrift.CompressionCodec[column.compression]
          });
          metadata.encodings.push(_parquetThrift.Encoding[PARQUET_RDLVL_ENCODING]);
          metadata.encodings.push(_parquetThrift.Encoding[column.encoding]);
          metadataOffset = baseOffset + pageBuf.length;
          body = Buffer.concat([pageBuf, (0, _readUtils.serializeThrift)(metadata)]);
          return _context10.abrupt("return", {
            body: body,
            metadata: metadata,
            metadataOffset: metadataOffset
          });
        case 23:
        case "end":
          return _context10.stop();
      }
    }, _callee10);
  }));
  return _encodeColumnChunk.apply(this, arguments);
}
function encodeRowGroup(_x21, _x22, _x23) {
  return _encodeRowGroup.apply(this, arguments);
}
function _encodeRowGroup() {
  _encodeRowGroup = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee11(schema, data, opts) {
    var metadata, body, _iterator2, _step2, field, cchunkData, cchunk;
    return _regenerator.default.wrap(function _callee11$(_context11) {
      while (1) switch (_context11.prev = _context11.next) {
        case 0:
          metadata = new _parquetThrift.RowGroup({
            num_rows: data.rowCount,
            columns: [],
            total_byte_size: 0
          });
          body = Buffer.alloc(0);
          _iterator2 = _createForOfIteratorHelper(schema.fieldList);
          _context11.prev = 3;
          _iterator2.s();
        case 5:
          if ((_step2 = _iterator2.n()).done) {
            _context11.next = 18;
            break;
          }
          field = _step2.value;
          if (!field.isNested) {
            _context11.next = 9;
            break;
          }
          return _context11.abrupt("continue", 16);
        case 9:
          _context11.next = 11;
          return encodeColumnChunk(field, data, body.length, opts);
        case 11:
          cchunkData = _context11.sent;
          cchunk = new _parquetThrift.ColumnChunk({
            file_offset: cchunkData.metadataOffset,
            meta_data: cchunkData.metadata
          });
          metadata.columns.push(cchunk);
          metadata.total_byte_size = new _nodeInt.default(Number(metadata.total_byte_size) + cchunkData.body.length);
          body = Buffer.concat([body, cchunkData.body]);
        case 16:
          _context11.next = 5;
          break;
        case 18:
          _context11.next = 23;
          break;
        case 20:
          _context11.prev = 20;
          _context11.t0 = _context11["catch"](3);
          _iterator2.e(_context11.t0);
        case 23:
          _context11.prev = 23;
          _iterator2.f();
          return _context11.finish(23);
        case 26:
          return _context11.abrupt("return", {
            body: body,
            metadata: metadata
          });
        case 27:
        case "end":
          return _context11.stop();
      }
    }, _callee11, null, [[3, 20, 23, 26]]);
  }));
  return _encodeRowGroup.apply(this, arguments);
}
function encodeFooter(schema, rowCount, rowGroups, userMetadata) {
  var metadata = new _parquetThrift.FileMetaData({
    version: PARQUET_VERSION,
    created_by: 'parquets',
    num_rows: rowCount,
    row_groups: rowGroups,
    schema: [],
    key_value_metadata: []
  });
  for (var key in userMetadata) {
    var _metadata$key_value_m, _metadata$key_value_m2, _metadata$key_value_m3;
    var kv = new _parquetThrift.KeyValue({
      key: key,
      value: userMetadata[key]
    });
    (_metadata$key_value_m = metadata.key_value_metadata) === null || _metadata$key_value_m === void 0 ? void 0 : (_metadata$key_value_m2 = (_metadata$key_value_m3 = _metadata$key_value_m).push) === null || _metadata$key_value_m2 === void 0 ? void 0 : _metadata$key_value_m2.call(_metadata$key_value_m3, kv);
  }
  {
    var schemaRoot = new _parquetThrift.SchemaElement({
      name: 'root',
      num_children: Object.keys(schema.fields).length
    });
    metadata.schema.push(schemaRoot);
  }
  var _iterator = _createForOfIteratorHelper(schema.fieldList),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var field = _step.value;
      var relt = _parquetThrift.FieldRepetitionType[field.repetitionType];
      var schemaElem = new _parquetThrift.SchemaElement({
        name: field.name,
        repetition_type: relt
      });
      if (field.isNested) {
        schemaElem.num_children = field.fieldCount;
      } else {
        schemaElem.type = _parquetThrift.Type[field.primitiveType];
      }
      if (field.originalType) {
        schemaElem.converted_type = _parquetThrift.ConvertedType[field.originalType];
      }
      schemaElem.type_length = field.typeLength;
      metadata.schema.push(schemaElem);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var metadataEncoded = (0, _readUtils.serializeThrift)(metadata);
  var footerEncoded = Buffer.alloc(metadataEncoded.length + 8);
  metadataEncoded.copy(footerEncoded);
  footerEncoded.writeUInt32LE(metadataEncoded.length, metadataEncoded.length);
  footerEncoded.write(PARQUET_MAGIC, metadataEncoded.length + 4);
  return footerEncoded;
}
//# sourceMappingURL=parquet-encoder.js.map