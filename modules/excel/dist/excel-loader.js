"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckLoader = exports.ExcelLoader = void 0;
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const DEFAULT_EXCEL_LOADER_OPTIONS = {
    excel: {
        shape: 'object-row-table',
        sheet: undefined // Load default Sheet
    }
};
/**
 * Worker Loader for Excel files
 */
exports.ExcelLoader = {
    name: 'Excel',
    id: 'excel',
    module: 'excel',
    version: VERSION,
    worker: true,
    extensions: ['xls', 'xlsb', 'xlsm', 'xlsx'],
    mimeTypes: [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ],
    category: 'table',
    binary: true,
    options: DEFAULT_EXCEL_LOADER_OPTIONS
};
exports._typecheckLoader = exports.ExcelLoader;
