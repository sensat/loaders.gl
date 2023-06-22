"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseArrowSync;
var _apacheArrow = require("apache-arrow");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function parseArrowSync(arrayBuffer, options) {
  var _options$arrow;
  var arrowTable = (0, _apacheArrow.tableFromIPC)([new Uint8Array(arrayBuffer)]);
  var columnarTable = {};
  var _iterator = _createForOfIteratorHelper(arrowTable.schema.fields),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var field = _step.value;
      var arrowColumn = arrowTable.getChild(field.name);
      var values = arrowColumn === null || arrowColumn === void 0 ? void 0 : arrowColumn.toArray();
      columnarTable[field.name] = values;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  switch (options === null || options === void 0 ? void 0 : (_options$arrow = options.arrow) === null || _options$arrow === void 0 ? void 0 : _options$arrow.shape) {
    case 'arrow-table':
      return arrowTable;
    case 'object-row-table':
      return convertColumnarToRowFormatTable(columnarTable);
    case 'columnar-table':
    default:
      return columnarTable;
  }
}
function convertColumnarToRowFormatTable(columnarTable) {
  var tableKeys = Object.keys(columnarTable);
  var tableRowsCount = columnarTable[tableKeys[0]].length;
  var rowFormatTable = [];
  for (var index = 0; index < tableRowsCount; index++) {
    var tableItem = {};
    for (var keyIndex = 0; keyIndex < tableKeys.length; keyIndex++) {
      var fieldName = tableKeys[keyIndex];
      tableItem[fieldName] = columnarTable[fieldName][index];
    }
    rowFormatTable.push(tableItem);
  }
  return rowFormatTable;
}
//# sourceMappingURL=parse-arrow-sync.js.map