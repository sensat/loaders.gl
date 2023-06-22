"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeDataPages = decodeDataPages;
exports.decodePage = decodePage;
exports.decodeSchema = decodeSchema;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _codecs = require("../codecs");
var _parquetThrift = require("../parquet-thrift");
var _compression = require("../compression");
var _constants = require("../../constants");
var _readUtils = require("../utils/read-utils");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function decodeDataPages(_x, _x2) {
  return _decodeDataPages.apply(this, arguments);
}
function _decodeDataPages() {
  _decodeDataPages = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(buffer, options) {
    var cursor, data, dictionary, page, index, value;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          cursor = {
            buffer: buffer,
            offset: 0,
            size: buffer.length
          };
          data = {
            rlevels: [],
            dlevels: [],
            values: [],
            pageHeaders: [],
            count: 0
          };
          dictionary = options.dictionary || [];
        case 3:
          if (!(cursor.offset < cursor.size && (!options.numValues || data.dlevels.length < Number(options.numValues)))) {
            _context.next = 16;
            break;
          }
          _context.next = 6;
          return decodePage(cursor, options);
        case 6:
          page = _context.sent;
          if (!page.dictionary) {
            _context.next = 10;
            break;
          }
          dictionary = page.dictionary;
          return _context.abrupt("continue", 3);
        case 10:
          if (dictionary.length) {
            page.values = page.values.map(function (value) {
              return dictionary[value];
            });
          }
          for (index = 0; index < page.rlevels.length; index++) {
            data.rlevels.push(page.rlevels[index]);
            data.dlevels.push(page.dlevels[index]);
            value = page.values[index];
            if (value !== undefined) {
              data.values.push(value);
            }
          }
          data.count += page.count;
          data.pageHeaders.push(page.pageHeader);
          _context.next = 3;
          break;
        case 16:
          return _context.abrupt("return", data);
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _decodeDataPages.apply(this, arguments);
}
function decodePage(_x3, _x4) {
  return _decodePage.apply(this, arguments);
}
function _decodePage() {
  _decodePage = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(cursor, options) {
    var page, _decodePageHeader, pageHeader, length, pageType;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _decodePageHeader = (0, _readUtils.decodePageHeader)(cursor.buffer, cursor.offset), pageHeader = _decodePageHeader.pageHeader, length = _decodePageHeader.length;
          cursor.offset += length;
          pageType = (0, _readUtils.getThriftEnum)(_parquetThrift.PageType, pageHeader.type);
          _context2.t0 = pageType;
          _context2.next = _context2.t0 === 'DATA_PAGE' ? 6 : _context2.t0 === 'DATA_PAGE_V2' ? 10 : _context2.t0 === 'DICTIONARY_PAGE' ? 14 : 20;
          break;
        case 6:
          _context2.next = 8;
          return decodeDataPage(cursor, pageHeader, options);
        case 8:
          page = _context2.sent;
          return _context2.abrupt("break", 21);
        case 10:
          _context2.next = 12;
          return decodeDataPageV2(cursor, pageHeader, options);
        case 12:
          page = _context2.sent;
          return _context2.abrupt("break", 21);
        case 14:
          _context2.next = 16;
          return decodeDictionaryPage(cursor, pageHeader, options);
        case 16:
          _context2.t1 = _context2.sent;
          _context2.t2 = pageHeader;
          page = {
            dictionary: _context2.t1,
            pageHeader: _context2.t2
          };
          return _context2.abrupt("break", 21);
        case 20:
          throw new Error("invalid page type: ".concat(pageType));
        case 21:
          return _context2.abrupt("return", page);
        case 22:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _decodePage.apply(this, arguments);
}
function decodeSchema(schemaElements, offset, len) {
  var schema = {};
  var next = offset;
  for (var i = 0; i < len; i++) {
    var schemaElement = schemaElements[next];
    var repetitionType = next > 0 ? (0, _readUtils.getThriftEnum)(_parquetThrift.FieldRepetitionType, schemaElement.repetition_type) : 'ROOT';
    var optional = false;
    var repeated = false;
    switch (repetitionType) {
      case 'REQUIRED':
        break;
      case 'OPTIONAL':
        optional = true;
        break;
      case 'REPEATED':
        repeated = true;
        break;
      default:
        throw new Error('parquet: unknown repetition type');
    }
    if (schemaElement.num_children > 0) {
      var res = decodeSchema(schemaElements, next + 1, schemaElement.num_children);
      next = res.next;
      schema[schemaElement.name] = {
        optional: optional,
        repeated: repeated,
        fields: res.schema
      };
    } else {
      var type = (0, _readUtils.getThriftEnum)(_parquetThrift.Type, schemaElement.type);
      var logicalType = type;
      if (schemaElement.converted_type) {
        logicalType = (0, _readUtils.getThriftEnum)(_parquetThrift.ConvertedType, schemaElement.converted_type);
      }
      switch (logicalType) {
        case 'DECIMAL':
          logicalType = "".concat(logicalType, "_").concat(type);
          break;
        default:
      }
      schema[schemaElement.name] = {
        type: logicalType,
        typeLength: schemaElement.type_length,
        presision: schemaElement.precision,
        scale: schemaElement.scale,
        optional: optional,
        repeated: repeated
      };
      next++;
    }
  }
  return {
    schema: schema,
    offset: offset,
    next: next
  };
}
function decodeValues(type, encoding, cursor, count, opts) {
  if (!(encoding in _codecs.PARQUET_CODECS)) {
    throw new Error("invalid encoding: ".concat(encoding));
  }
  return _codecs.PARQUET_CODECS[encoding].decodeValues(type, cursor, count, opts);
}
function decodeDataPage(_x5, _x6, _x7) {
  return _decodeDataPage.apply(this, arguments);
}
function _decodeDataPage() {
  _decodeDataPage = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(cursor, header, options) {
    var _header$data_page_hea, _header$data_page_hea2, _header$data_page_hea3, _header$data_page_hea4;
    var cursorEnd, valueCount, dataCursor, valuesBuf, rLevelEncoding, rLevels, dLevelEncoding, dLevels, valueCountNonNull, _iterator, _step, dlvl, valueEncoding, decodeOptions, values;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          cursorEnd = cursor.offset + header.compressed_page_size;
          valueCount = (_header$data_page_hea = header.data_page_header) === null || _header$data_page_hea === void 0 ? void 0 : _header$data_page_hea.num_values;
          dataCursor = cursor;
          if (!(options.compression !== 'UNCOMPRESSED')) {
            _context3.next = 9;
            break;
          }
          _context3.next = 6;
          return (0, _compression.decompress)(options.compression, cursor.buffer.slice(cursor.offset, cursorEnd), header.uncompressed_page_size);
        case 6:
          valuesBuf = _context3.sent;
          dataCursor = {
            buffer: valuesBuf,
            offset: 0,
            size: valuesBuf.length
          };
          cursor.offset = cursorEnd;
        case 9:
          rLevelEncoding = (0, _readUtils.getThriftEnum)(_parquetThrift.Encoding, (_header$data_page_hea2 = header.data_page_header) === null || _header$data_page_hea2 === void 0 ? void 0 : _header$data_page_hea2.repetition_level_encoding);
          rLevels = new Array(valueCount);
          if (options.column.rLevelMax > 0) {
            rLevels = decodeValues(_constants.PARQUET_RDLVL_TYPE, rLevelEncoding, dataCursor, valueCount, {
              bitWidth: (0, _readUtils.getBitWidth)(options.column.rLevelMax),
              disableEnvelope: false
            });
          } else {
            rLevels.fill(0);
          }
          dLevelEncoding = (0, _readUtils.getThriftEnum)(_parquetThrift.Encoding, (_header$data_page_hea3 = header.data_page_header) === null || _header$data_page_hea3 === void 0 ? void 0 : _header$data_page_hea3.definition_level_encoding);
          dLevels = new Array(valueCount);
          if (options.column.dLevelMax > 0) {
            dLevels = decodeValues(_constants.PARQUET_RDLVL_TYPE, dLevelEncoding, dataCursor, valueCount, {
              bitWidth: (0, _readUtils.getBitWidth)(options.column.dLevelMax),
              disableEnvelope: false
            });
          } else {
            dLevels.fill(0);
          }
          valueCountNonNull = 0;
          _iterator = _createForOfIteratorHelper(dLevels);
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              dlvl = _step.value;
              if (dlvl === options.column.dLevelMax) {
                valueCountNonNull++;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          valueEncoding = (0, _readUtils.getThriftEnum)(_parquetThrift.Encoding, (_header$data_page_hea4 = header.data_page_header) === null || _header$data_page_hea4 === void 0 ? void 0 : _header$data_page_hea4.encoding);
          decodeOptions = {
            typeLength: options.column.typeLength,
            bitWidth: options.column.typeLength
          };
          values = decodeValues(options.column.primitiveType, valueEncoding, dataCursor, valueCountNonNull, decodeOptions);
          return _context3.abrupt("return", {
            dlevels: dLevels,
            rlevels: rLevels,
            values: values,
            count: valueCount,
            pageHeader: header
          });
        case 22:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _decodeDataPage.apply(this, arguments);
}
function decodeDataPageV2(_x8, _x9, _x10) {
  return _decodeDataPageV.apply(this, arguments);
}
function _decodeDataPageV() {
  _decodeDataPageV = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4(cursor, header, opts) {
    var _header$data_page_hea5, _header$data_page_hea6, _header$data_page_hea7, _header$data_page_hea8;
    var cursorEnd, valueCount, valueCountNonNull, valueEncoding, rLevels, dLevels, valuesBufCursor, valuesBuf, decodeOptions, values;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          cursorEnd = cursor.offset + header.compressed_page_size;
          valueCount = (_header$data_page_hea5 = header.data_page_header_v2) === null || _header$data_page_hea5 === void 0 ? void 0 : _header$data_page_hea5.num_values;
          valueCountNonNull = valueCount - ((_header$data_page_hea6 = header.data_page_header_v2) === null || _header$data_page_hea6 === void 0 ? void 0 : _header$data_page_hea6.num_nulls);
          valueEncoding = (0, _readUtils.getThriftEnum)(_parquetThrift.Encoding, (_header$data_page_hea7 = header.data_page_header_v2) === null || _header$data_page_hea7 === void 0 ? void 0 : _header$data_page_hea7.encoding);
          rLevels = new Array(valueCount);
          if (opts.column.rLevelMax > 0) {
            rLevels = decodeValues(_constants.PARQUET_RDLVL_TYPE, _constants.PARQUET_RDLVL_ENCODING, cursor, valueCount, {
              bitWidth: (0, _readUtils.getBitWidth)(opts.column.rLevelMax),
              disableEnvelope: true
            });
          } else {
            rLevels.fill(0);
          }
          dLevels = new Array(valueCount);
          if (opts.column.dLevelMax > 0) {
            dLevels = decodeValues(_constants.PARQUET_RDLVL_TYPE, _constants.PARQUET_RDLVL_ENCODING, cursor, valueCount, {
              bitWidth: (0, _readUtils.getBitWidth)(opts.column.dLevelMax),
              disableEnvelope: true
            });
          } else {
            dLevels.fill(0);
          }
          valuesBufCursor = cursor;
          if (!((_header$data_page_hea8 = header.data_page_header_v2) !== null && _header$data_page_hea8 !== void 0 && _header$data_page_hea8.is_compressed)) {
            _context4.next = 15;
            break;
          }
          _context4.next = 12;
          return (0, _compression.decompress)(opts.compression, cursor.buffer.slice(cursor.offset, cursorEnd), header.uncompressed_page_size);
        case 12:
          valuesBuf = _context4.sent;
          valuesBufCursor = {
            buffer: valuesBuf,
            offset: 0,
            size: valuesBuf.length
          };
          cursor.offset = cursorEnd;
        case 15:
          decodeOptions = {
            typeLength: opts.column.typeLength,
            bitWidth: opts.column.typeLength
          };
          values = decodeValues(opts.column.primitiveType, valueEncoding, valuesBufCursor, valueCountNonNull, decodeOptions);
          return _context4.abrupt("return", {
            dlevels: dLevels,
            rlevels: rLevels,
            values: values,
            count: valueCount,
            pageHeader: header
          });
        case 18:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _decodeDataPageV.apply(this, arguments);
}
function decodeDictionaryPage(_x11, _x12, _x13) {
  return _decodeDictionaryPage.apply(this, arguments);
}
function _decodeDictionaryPage() {
  _decodeDictionaryPage = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5(cursor, pageHeader, options) {
    var _pageHeader$dictionar;
    var cursorEnd, dictCursor, valuesBuf, numValues;
    return _regenerator.default.wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          cursorEnd = cursor.offset + pageHeader.compressed_page_size;
          dictCursor = {
            offset: 0,
            buffer: cursor.buffer.slice(cursor.offset, cursorEnd),
            size: cursorEnd - cursor.offset
          };
          cursor.offset = cursorEnd;
          if (!(options.compression !== 'UNCOMPRESSED')) {
            _context5.next = 9;
            break;
          }
          _context5.next = 6;
          return (0, _compression.decompress)(options.compression, dictCursor.buffer.slice(dictCursor.offset, cursorEnd), pageHeader.uncompressed_page_size);
        case 6:
          valuesBuf = _context5.sent;
          dictCursor = {
            buffer: valuesBuf,
            offset: 0,
            size: valuesBuf.length
          };
          cursor.offset = cursorEnd;
        case 9:
          numValues = (pageHeader === null || pageHeader === void 0 ? void 0 : (_pageHeader$dictionar = pageHeader.dictionary_page_header) === null || _pageHeader$dictionar === void 0 ? void 0 : _pageHeader$dictionar.num_values) || 0;
          return _context5.abrupt("return", decodeValues(options.column.primitiveType, options.column.encoding, dictCursor, numValues, options).map(function (d) {
            return d.toString();
          }));
        case 11:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _decodeDictionaryPage.apply(this, arguments);
}
//# sourceMappingURL=decoders.js.map