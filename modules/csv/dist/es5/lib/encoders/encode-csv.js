"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeTableAsCSV = encodeTableAsCSV;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _schema = require("@loaders.gl/schema");
var _d3Dsv = require("d3-dsv");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function encodeTableAsCSV(table) {
  var _options$csv, _table$schema;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    csv: {
      useDisplayNames: true
    }
  };
  var useDisplayNames = options.useDisplayNames || ((_options$csv = options.csv) === null || _options$csv === void 0 ? void 0 : _options$csv.useDisplayNames);
  var fields = ((_table$schema = table.schema) === null || _table$schema === void 0 ? void 0 : _table$schema.fields) || [];
  var columnNames = fields.map(function (f) {
    var _f$metadata;
    var displayName = (_f$metadata = f.metadata) === null || _f$metadata === void 0 ? void 0 : _f$metadata.displayName;
    return useDisplayNames && typeof displayName === 'string' ? displayName : f.name;
  });
  var formattedData = [columnNames];
  var _iterator = _createForOfIteratorHelper((0, _schema.makeArrayRowIterator)(table)),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var row = _step.value;
      var formattedRow = [];
      for (var columnIndex = 0; columnIndex < (0, _schema.getTableNumCols)(table); ++columnIndex) {
        var value = row[columnIndex];
        formattedRow[columnIndex] = preformatFieldValue(value);
      }
      formattedData.push(formattedRow);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return (0, _d3Dsv.csvFormatRows)(formattedData);
}
var preformatFieldValue = function preformatFieldValue(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if ((0, _typeof2.default)(value) === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};
//# sourceMappingURL=encode-csv.js.map