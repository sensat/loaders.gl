"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckLoader = exports.ExcelLoader = void 0;
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var DEFAULT_EXCEL_LOADER_OPTIONS = {
  excel: {
    shape: 'object-row-table',
    sheet: undefined
  }
};
var ExcelLoader = {
  name: 'Excel',
  id: 'excel',
  module: 'excel',
  version: VERSION,
  worker: true,
  extensions: ['xls', 'xlsb', 'xlsm', 'xlsx'],
  mimeTypes: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
  category: 'table',
  binary: true,
  options: DEFAULT_EXCEL_LOADER_OPTIONS
};
exports.ExcelLoader = ExcelLoader;
var _typecheckLoader = ExcelLoader;
exports._typecheckLoader = _typecheckLoader;
//# sourceMappingURL=excel-loader.js.map