"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseExcel = parseExcel;
var _xlsx = require("xlsx");
var dataTableNamesMap = {};
function parseExcel(arrayBuffer, options) {
  var dataUrl = 'dummy';
  var workbook = (0, _xlsx.read)(arrayBuffer, {
    type: 'array'
  });
  var dataRows = [];
  dataTableNamesMap[dataUrl] = [];
  if (workbook.SheetNames.length > 0) {
    var _options$excel, _options$excel2;
    if (workbook.SheetNames.length > 1) {
      dataTableNamesMap[dataUrl] = workbook.SheetNames;
    }
    var sheetName = workbook.SheetNames[0];
    if (options !== null && options !== void 0 && (_options$excel = options.excel) !== null && _options$excel !== void 0 && _options$excel.sheet && workbook.SheetNames.indexOf(options === null || options === void 0 ? void 0 : (_options$excel2 = options.excel) === null || _options$excel2 === void 0 ? void 0 : _options$excel2.sheet) >= 0) {
      var _options$excel3;
      sheetName = options === null || options === void 0 ? void 0 : (_options$excel3 = options.excel) === null || _options$excel3 === void 0 ? void 0 : _options$excel3.sheet;
    }
    var worksheet = workbook.Sheets[sheetName];
    dataRows = _xlsx.utils.sheet_to_json(worksheet);
  }
  return dataRows;
}
//# sourceMappingURL=parse-excel.js.map