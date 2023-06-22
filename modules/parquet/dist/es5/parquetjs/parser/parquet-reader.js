"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParquetReader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _schema = require("../schema/schema");
var _decoders = require("./decoders");
var _shred = require("../schema/shred");
var _constants = require("../../constants");
var _parquetThrift = require("../parquet-thrift");
var _readUtils = require("../utils/read-utils");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
var DEFAULT_PROPS = {
  defaultDictionarySize: 1e6
};
var ParquetReader = function () {
  function ParquetReader(file, props) {
    (0, _classCallCheck2.default)(this, ParquetReader);
    (0, _defineProperty2.default)(this, "props", void 0);
    (0, _defineProperty2.default)(this, "file", void 0);
    (0, _defineProperty2.default)(this, "metadata", null);
    this.file = file;
    this.props = _objectSpread(_objectSpread({}, DEFAULT_PROPS), props);
  }
  (0, _createClass2.default)(ParquetReader, [{
    key: "close",
    value: function close() {
      this.file.close();
    }
  }, {
    key: "rowIterator",
    value: function rowIterator(props) {
      var _this = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee() {
        var _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, rows, _iterator3, _step3, row;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _iteratorAbruptCompletion = false;
              _didIteratorError = false;
              _context.prev = 2;
              _iterator = _asyncIterator(_this.rowBatchIterator(props));
            case 4:
              _context.next = 6;
              return (0, _awaitAsyncGenerator2.default)(_iterator.next());
            case 6:
              if (!(_iteratorAbruptCompletion = !(_step = _context.sent).done)) {
                _context.next = 28;
                break;
              }
              rows = _step.value;
              _iterator3 = _createForOfIteratorHelper(rows);
              _context.prev = 9;
              _iterator3.s();
            case 11:
              if ((_step3 = _iterator3.n()).done) {
                _context.next = 17;
                break;
              }
              row = _step3.value;
              _context.next = 15;
              return row;
            case 15:
              _context.next = 11;
              break;
            case 17:
              _context.next = 22;
              break;
            case 19:
              _context.prev = 19;
              _context.t0 = _context["catch"](9);
              _iterator3.e(_context.t0);
            case 22:
              _context.prev = 22;
              _iterator3.f();
              return _context.finish(22);
            case 25:
              _iteratorAbruptCompletion = false;
              _context.next = 4;
              break;
            case 28:
              _context.next = 34;
              break;
            case 30:
              _context.prev = 30;
              _context.t1 = _context["catch"](2);
              _didIteratorError = true;
              _iteratorError = _context.t1;
            case 34:
              _context.prev = 34;
              _context.prev = 35;
              if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
                _context.next = 39;
                break;
              }
              _context.next = 39;
              return (0, _awaitAsyncGenerator2.default)(_iterator.return());
            case 39:
              _context.prev = 39;
              if (!_didIteratorError) {
                _context.next = 42;
                break;
              }
              throw _iteratorError;
            case 42:
              return _context.finish(39);
            case 43:
              return _context.finish(34);
            case 44:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[2, 30, 34, 44], [9, 19, 22, 25], [35,, 39, 43]]);
      }))();
    }
  }, {
    key: "rowBatchIterator",
    value: function rowBatchIterator(props) {
      var _this2 = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee2() {
        var schema, _iteratorAbruptCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, rowGroup;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _awaitAsyncGenerator2.default)(_this2.getSchema());
            case 2:
              schema = _context2.sent;
              _iteratorAbruptCompletion2 = false;
              _didIteratorError2 = false;
              _context2.prev = 5;
              _iterator2 = _asyncIterator(_this2.rowGroupIterator(props));
            case 7:
              _context2.next = 9;
              return (0, _awaitAsyncGenerator2.default)(_iterator2.next());
            case 9:
              if (!(_iteratorAbruptCompletion2 = !(_step2 = _context2.sent).done)) {
                _context2.next = 16;
                break;
              }
              rowGroup = _step2.value;
              _context2.next = 13;
              return (0, _shred.materializeRows)(schema, rowGroup);
            case 13:
              _iteratorAbruptCompletion2 = false;
              _context2.next = 7;
              break;
            case 16:
              _context2.next = 22;
              break;
            case 18:
              _context2.prev = 18;
              _context2.t0 = _context2["catch"](5);
              _didIteratorError2 = true;
              _iteratorError2 = _context2.t0;
            case 22:
              _context2.prev = 22;
              _context2.prev = 23;
              if (!(_iteratorAbruptCompletion2 && _iterator2.return != null)) {
                _context2.next = 27;
                break;
              }
              _context2.next = 27;
              return (0, _awaitAsyncGenerator2.default)(_iterator2.return());
            case 27:
              _context2.prev = 27;
              if (!_didIteratorError2) {
                _context2.next = 30;
                break;
              }
              throw _iteratorError2;
            case 30:
              return _context2.finish(27);
            case 31:
              return _context2.finish(22);
            case 32:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[5, 18, 22, 32], [23,, 27, 31]]);
      }))();
    }
  }, {
    key: "rowGroupIterator",
    value: function rowGroupIterator(props) {
      var _this3 = this;
      return (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee3() {
        var columnList, metadata, schema, rowGroupCount, rowGroupIndex, rowGroup;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              columnList = ((props === null || props === void 0 ? void 0 : props.columnList) || []).map(function (x) {
                return Array.isArray(x) ? x : [x];
              });
              _context3.next = 3;
              return (0, _awaitAsyncGenerator2.default)(_this3.getFileMetadata());
            case 3:
              metadata = _context3.sent;
              _context3.next = 6;
              return (0, _awaitAsyncGenerator2.default)(_this3.getSchema());
            case 6:
              schema = _context3.sent;
              rowGroupCount = (metadata === null || metadata === void 0 ? void 0 : metadata.row_groups.length) || 0;
              rowGroupIndex = 0;
            case 9:
              if (!(rowGroupIndex < rowGroupCount)) {
                _context3.next = 18;
                break;
              }
              _context3.next = 12;
              return (0, _awaitAsyncGenerator2.default)(_this3.readRowGroup(schema, metadata.row_groups[rowGroupIndex], columnList));
            case 12:
              rowGroup = _context3.sent;
              _context3.next = 15;
              return rowGroup;
            case 15:
              rowGroupIndex++;
              _context3.next = 9;
              break;
            case 18:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }))();
    }
  }, {
    key: "getRowCount",
    value: function () {
      var _getRowCount = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee4() {
        var metadata;
        return _regenerator.default.wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return this.getFileMetadata();
            case 2:
              metadata = _context4.sent;
              return _context4.abrupt("return", Number(metadata.num_rows));
            case 4:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this);
      }));
      function getRowCount() {
        return _getRowCount.apply(this, arguments);
      }
      return getRowCount;
    }()
  }, {
    key: "getSchema",
    value: function () {
      var _getSchema = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee5() {
        var metadata, root, _decodeSchema, schemaDefinition, schema;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return this.getFileMetadata();
            case 2:
              metadata = _context5.sent;
              root = metadata.schema[0];
              _decodeSchema = (0, _decoders.decodeSchema)(metadata.schema, 1, root.num_children), schemaDefinition = _decodeSchema.schema;
              schema = new _schema.ParquetSchema(schemaDefinition);
              return _context5.abrupt("return", schema);
            case 7:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function getSchema() {
        return _getSchema.apply(this, arguments);
      }
      return getSchema;
    }()
  }, {
    key: "getSchemaMetadata",
    value: function () {
      var _getSchemaMetadata = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee6() {
        var metadata, md, _iterator4, _step4, kv;
        return _regenerator.default.wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return this.getFileMetadata();
            case 2:
              metadata = _context6.sent;
              md = {};
              _iterator4 = _createForOfIteratorHelper(metadata.key_value_metadata);
              try {
                for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                  kv = _step4.value;
                  md[kv.key] = kv.value;
                }
              } catch (err) {
                _iterator4.e(err);
              } finally {
                _iterator4.f();
              }
              return _context6.abrupt("return", md);
            case 7:
            case "end":
              return _context6.stop();
          }
        }, _callee6, this);
      }));
      function getSchemaMetadata() {
        return _getSchemaMetadata.apply(this, arguments);
      }
      return getSchemaMetadata;
    }()
  }, {
    key: "getFileMetadata",
    value: function () {
      var _getFileMetadata = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee7() {
        return _regenerator.default.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              if (this.metadata) {
                _context7.next = 4;
                break;
              }
              _context7.next = 3;
              return this.readHeader();
            case 3:
              this.metadata = this.readFooter();
            case 4:
              return _context7.abrupt("return", this.metadata);
            case 5:
            case "end":
              return _context7.stop();
          }
        }, _callee7, this);
      }));
      function getFileMetadata() {
        return _getFileMetadata.apply(this, arguments);
      }
      return getFileMetadata;
    }()
  }, {
    key: "readHeader",
    value: function () {
      var _readHeader = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee8() {
        var buffer, magic;
        return _regenerator.default.wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return this.file.read(0, _constants.PARQUET_MAGIC.length);
            case 2:
              buffer = _context8.sent;
              magic = buffer.toString();
              _context8.t0 = magic;
              _context8.next = _context8.t0 === _constants.PARQUET_MAGIC ? 7 : _context8.t0 === _constants.PARQUET_MAGIC_ENCRYPTED ? 8 : 9;
              break;
            case 7:
              return _context8.abrupt("break", 10);
            case 8:
              throw new Error('Encrypted parquet file not supported');
            case 9:
              throw new Error("Invalid parquet file (magic=".concat(magic, ")"));
            case 10:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function readHeader() {
        return _readHeader.apply(this, arguments);
      }
      return readHeader;
    }()
  }, {
    key: "readFooter",
    value: function () {
      var _readFooter = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee9() {
        var trailerLen, trailerBuf, magic, metadataSize, metadataOffset, metadataBuf, _decodeFileMetadata, metadata;
        return _regenerator.default.wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              trailerLen = _constants.PARQUET_MAGIC.length + 4;
              _context9.next = 3;
              return this.file.read(this.file.size - trailerLen, trailerLen);
            case 3:
              trailerBuf = _context9.sent;
              magic = trailerBuf.slice(4).toString();
              if (!(magic !== _constants.PARQUET_MAGIC)) {
                _context9.next = 7;
                break;
              }
              throw new Error("Not a valid parquet file (magic=\"".concat(magic, ")"));
            case 7:
              metadataSize = trailerBuf.readUInt32LE(0);
              metadataOffset = this.file.size - metadataSize - trailerLen;
              if (!(metadataOffset < _constants.PARQUET_MAGIC.length)) {
                _context9.next = 11;
                break;
              }
              throw new Error("Invalid metadata size ".concat(metadataOffset));
            case 11:
              _context9.next = 13;
              return this.file.read(metadataOffset, metadataSize);
            case 13:
              metadataBuf = _context9.sent;
              _decodeFileMetadata = (0, _readUtils.decodeFileMetadata)(metadataBuf), metadata = _decodeFileMetadata.metadata;
              return _context9.abrupt("return", metadata);
            case 16:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function readFooter() {
        return _readFooter.apply(this, arguments);
      }
      return readFooter;
    }()
  }, {
    key: "readRowGroup",
    value: function () {
      var _readRowGroup = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee10(schema, rowGroup, columnList) {
        var buffer, _iterator5, _step5, colChunk, colMetadata, colKey;
        return _regenerator.default.wrap(function _callee10$(_context10) {
          while (1) switch (_context10.prev = _context10.next) {
            case 0:
              buffer = {
                rowCount: Number(rowGroup.num_rows),
                columnData: {}
              };
              _iterator5 = _createForOfIteratorHelper(rowGroup.columns);
              _context10.prev = 2;
              _iterator5.s();
            case 4:
              if ((_step5 = _iterator5.n()).done) {
                _context10.next = 15;
                break;
              }
              colChunk = _step5.value;
              colMetadata = colChunk.meta_data;
              colKey = colMetadata === null || colMetadata === void 0 ? void 0 : colMetadata.path_in_schema;
              if (!(columnList.length > 0 && (0, _readUtils.fieldIndexOf)(columnList, colKey) < 0)) {
                _context10.next = 10;
                break;
              }
              return _context10.abrupt("continue", 13);
            case 10:
              _context10.next = 12;
              return this.readColumnChunk(schema, colChunk);
            case 12:
              buffer.columnData[colKey.join()] = _context10.sent;
            case 13:
              _context10.next = 4;
              break;
            case 15:
              _context10.next = 20;
              break;
            case 17:
              _context10.prev = 17;
              _context10.t0 = _context10["catch"](2);
              _iterator5.e(_context10.t0);
            case 20:
              _context10.prev = 20;
              _iterator5.f();
              return _context10.finish(20);
            case 23:
              return _context10.abrupt("return", buffer);
            case 24:
            case "end":
              return _context10.stop();
          }
        }, _callee10, this, [[2, 17, 20, 23]]);
      }));
      function readRowGroup(_x, _x2, _x3) {
        return _readRowGroup.apply(this, arguments);
      }
      return readRowGroup;
    }()
  }, {
    key: "readColumnChunk",
    value: function () {
      var _readColumnChunk = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee11(schema, colChunk) {
        var _colChunk$meta_data, _colChunk$meta_data2, _colChunk$meta_data3, _colChunk$meta_data4, _colChunk$meta_data5, _colChunk$meta_data7, _colChunk$meta_data8, _options$dictionary;
        var field, type, compression, pagesOffset, pagesSize, _colChunk$meta_data6, options, dictionary, dictionaryPageOffset, dictionaryOffset, pagesBuf;
        return _regenerator.default.wrap(function _callee11$(_context11) {
          while (1) switch (_context11.prev = _context11.next) {
            case 0:
              if (!(colChunk.file_path !== undefined && colChunk.file_path !== null)) {
                _context11.next = 2;
                break;
              }
              throw new Error('external references are not supported');
            case 2:
              field = schema.findField((_colChunk$meta_data = colChunk.meta_data) === null || _colChunk$meta_data === void 0 ? void 0 : _colChunk$meta_data.path_in_schema);
              type = (0, _readUtils.getThriftEnum)(_parquetThrift.Type, (_colChunk$meta_data2 = colChunk.meta_data) === null || _colChunk$meta_data2 === void 0 ? void 0 : _colChunk$meta_data2.type);
              if (!(type !== field.primitiveType)) {
                _context11.next = 6;
                break;
              }
              throw new Error("chunk type not matching schema: ".concat(type));
            case 6:
              compression = (0, _readUtils.getThriftEnum)(_parquetThrift.CompressionCodec, (_colChunk$meta_data3 = colChunk.meta_data) === null || _colChunk$meta_data3 === void 0 ? void 0 : _colChunk$meta_data3.codec);
              pagesOffset = Number((_colChunk$meta_data4 = colChunk.meta_data) === null || _colChunk$meta_data4 === void 0 ? void 0 : _colChunk$meta_data4.data_page_offset);
              pagesSize = Number((_colChunk$meta_data5 = colChunk.meta_data) === null || _colChunk$meta_data5 === void 0 ? void 0 : _colChunk$meta_data5.total_compressed_size);
              if (!colChunk.file_path) {
                pagesSize = Math.min(this.file.size - pagesOffset, Number((_colChunk$meta_data6 = colChunk.meta_data) === null || _colChunk$meta_data6 === void 0 ? void 0 : _colChunk$meta_data6.total_compressed_size));
              }
              options = {
                type: type,
                rLevelMax: field.rLevelMax,
                dLevelMax: field.dLevelMax,
                compression: compression,
                column: field,
                numValues: (_colChunk$meta_data7 = colChunk.meta_data) === null || _colChunk$meta_data7 === void 0 ? void 0 : _colChunk$meta_data7.num_values,
                dictionary: []
              };
              dictionaryPageOffset = colChunk === null || colChunk === void 0 ? void 0 : (_colChunk$meta_data8 = colChunk.meta_data) === null || _colChunk$meta_data8 === void 0 ? void 0 : _colChunk$meta_data8.dictionary_page_offset;
              if (!dictionaryPageOffset) {
                _context11.next = 17;
                break;
              }
              dictionaryOffset = Number(dictionaryPageOffset);
              _context11.next = 16;
              return this.getDictionary(dictionaryOffset, options, pagesOffset);
            case 16:
              dictionary = _context11.sent;
            case 17:
              dictionary = (_options$dictionary = options.dictionary) !== null && _options$dictionary !== void 0 && _options$dictionary.length ? options.dictionary : dictionary;
              _context11.next = 20;
              return this.file.read(pagesOffset, pagesSize);
            case 20:
              pagesBuf = _context11.sent;
              _context11.next = 23;
              return (0, _decoders.decodeDataPages)(pagesBuf, _objectSpread(_objectSpread({}, options), {}, {
                dictionary: dictionary
              }));
            case 23:
              return _context11.abrupt("return", _context11.sent);
            case 24:
            case "end":
              return _context11.stop();
          }
        }, _callee11, this);
      }));
      function readColumnChunk(_x4, _x5) {
        return _readColumnChunk.apply(this, arguments);
      }
      return readColumnChunk;
    }()
  }, {
    key: "getDictionary",
    value: function () {
      var _getDictionary = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee12(dictionaryPageOffset, options, pagesOffset) {
        var dictionarySize, pagesBuf, cursor, decodedPage;
        return _regenerator.default.wrap(function _callee12$(_context12) {
          while (1) switch (_context12.prev = _context12.next) {
            case 0:
              if (!(dictionaryPageOffset === 0)) {
                _context12.next = 2;
                break;
              }
              return _context12.abrupt("return", []);
            case 2:
              dictionarySize = Math.min(this.file.size - dictionaryPageOffset, this.props.defaultDictionarySize);
              _context12.next = 5;
              return this.file.read(dictionaryPageOffset, dictionarySize);
            case 5:
              pagesBuf = _context12.sent;
              cursor = {
                buffer: pagesBuf,
                offset: 0,
                size: pagesBuf.length
              };
              _context12.next = 9;
              return (0, _decoders.decodePage)(cursor, options);
            case 9:
              decodedPage = _context12.sent;
              return _context12.abrupt("return", decodedPage.dictionary);
            case 11:
            case "end":
              return _context12.stop();
          }
        }, _callee12, this);
      }));
      function getDictionary(_x6, _x7, _x8) {
        return _getDictionary.apply(this, arguments);
      }
      return getDictionary;
    }()
  }]);
  return ParquetReader;
}();
exports.ParquetReader = ParquetReader;
//# sourceMappingURL=parquet-reader.js.map