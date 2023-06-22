const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const DEFAULT_EXCEL_LOADER_OPTIONS = {
  excel: {
    shape: 'object-row-table',
    sheet: undefined
  }
};
export const ExcelLoader = {
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
export const _typecheckLoader = ExcelLoader;
//# sourceMappingURL=excel-loader.js.map