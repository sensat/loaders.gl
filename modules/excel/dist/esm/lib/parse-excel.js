import { utils, read } from 'xlsx';
const dataTableNamesMap = {};
export function parseExcel(arrayBuffer, options) {
  const dataUrl = 'dummy';
  const workbook = read(arrayBuffer, {
    type: 'array'
  });
  let dataRows = [];
  dataTableNamesMap[dataUrl] = [];
  if (workbook.SheetNames.length > 0) {
    var _options$excel, _options$excel2;
    if (workbook.SheetNames.length > 1) {
      dataTableNamesMap[dataUrl] = workbook.SheetNames;
    }
    let sheetName = workbook.SheetNames[0];
    if (options !== null && options !== void 0 && (_options$excel = options.excel) !== null && _options$excel !== void 0 && _options$excel.sheet && workbook.SheetNames.indexOf(options === null || options === void 0 ? void 0 : (_options$excel2 = options.excel) === null || _options$excel2 === void 0 ? void 0 : _options$excel2.sheet) >= 0) {
      var _options$excel3;
      sheetName = options === null || options === void 0 ? void 0 : (_options$excel3 = options.excel) === null || _options$excel3 === void 0 ? void 0 : _options$excel3.sheet;
    }
    const worksheet = workbook.Sheets[sheetName];
    dataRows = utils.sheet_to_json(worksheet);
  }
  return dataRows;
}
//# sourceMappingURL=parse-excel.js.map