"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipWriter = void 0;
const jszip_1 = __importDefault(require("jszip"));
/**
 * Zip exporter
 */
exports.ZipWriter = {
    name: 'Zip Archive',
    extensions: ['zip'],
    category: 'archive',
    mimeTypes: ['application/zip'],
    // @ts-ignore
    encode: encodeZipAsync
};
async function encodeZipAsync(fileMap, options = {}) {
    const jsZip = new jszip_1.default();
    // add files to the zip
    for (const subFileName in fileMap) {
        const subFileData = fileMap[subFileName];
        // jszip supports both arraybuffer and string data (the main loaders.gl types)
        // https://stuk.github.io/jszip/documentation/api_zipobject/async.html
        jsZip.file(subFileName, subFileData, options);
    }
    // always generate the full zip as an arraybuffer
    options = Object.assign({}, options, {
        type: 'arraybuffer'
    });
    const { onUpdate = () => { } } = options;
    return jsZip.generateAsync(options, onUpdate).catch((error) => {
        options.log.error(`Unable to write zip archive: ${error}`);
        throw error;
    });
}
