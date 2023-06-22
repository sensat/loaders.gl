"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExcel = void 0;
const xlsx_1 = require("xlsx");
// import {convertToArrayRow} from '@loaders.gl/schema';
// local table names cache with dataUrl/tableNames array key/values
const dataTableNamesMap = {};
/**
 * Gets local or remote Excel file data.
 * @param arrayBuffer Loaded data
 * @param options Data parse options.
 */
function parseExcel(arrayBuffer, options) {
    const dataUrl = 'dummy';
    // const dataFileType: string = dataUrl.substr(dataUrl.lastIndexOf('.')); // file extension
    // create Excel 'workbook'
    const workbook = (0, xlsx_1.read)(arrayBuffer, {
        type: 'array'
        // cellDates: true
    });
    // load data sheets
    let dataRows = [];
    dataTableNamesMap[dataUrl] = [];
    if (workbook.SheetNames.length > 0) {
        if (workbook.SheetNames.length > 1) {
            // cache sheet names
            dataTableNamesMap[dataUrl] = workbook.SheetNames;
            // eslint-ignore-next-line
            // console.debug(`getData(): file:  sheetNames:`, workbook.SheetNames);
        }
        // determine spreadsheet to load
        let sheetName = workbook.SheetNames[0];
        if (options?.excel?.sheet && workbook.SheetNames.indexOf(options?.excel?.sheet) >= 0) {
            // reset to requested table name
            sheetName = options?.excel?.sheet;
        }
        // get worksheet data row objects array
        const worksheet = workbook.Sheets[sheetName];
        dataRows = xlsx_1.utils.sheet_to_json(worksheet);
        // const headers = dataRows.length ? Object.keys(dataRows[0]) : [];
        // if (options?.excel?.type === 'array-row-table') {
        //   dataRows = dataRows.map(row => convertToArrayRow(row, headers))
        // }
    }
    return dataRows;
}
exports.parseExcel = parseExcel;
