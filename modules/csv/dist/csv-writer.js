"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSVWriter = void 0;
const encode_csv_1 = require("./lib/encoders/encode-csv");
const DEFAULT_WRITER_OPTIONS = {
    csv: {
        useDisplayNames: false
    },
    useDisplayNames: false
};
exports.CSVWriter = {
    id: 'csv',
    version: 'latest',
    module: 'csv',
    name: 'CSV',
    extensions: ['csv'],
    mimeTypes: ['text/csv'],
    options: DEFAULT_WRITER_OPTIONS,
    text: true,
    encode: async (table, options) => new TextEncoder().encode((0, encode_csv_1.encodeTableAsCSV)(table, options)).buffer,
    encodeText: (table, options) => (0, encode_csv_1.encodeTableAsCSV)(table, options)
};
