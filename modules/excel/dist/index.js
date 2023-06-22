"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelLoader = exports.ExcelWorkerLoader = void 0;
const excel_loader_1 = require("./excel-loader");
Object.defineProperty(exports, "ExcelWorkerLoader", { enumerable: true, get: function () { return excel_loader_1.ExcelLoader; } });
const parse_excel_1 = require("./lib/parse-excel");
/**
 * Loader for Excel files
 */
exports.ExcelLoader = {
    ...excel_loader_1.ExcelLoader,
    async parse(arrayBuffer, options) {
        const data = (0, parse_excel_1.parseExcel)(arrayBuffer, options);
        return { shape: 'object-row-table', data };
    }
};
