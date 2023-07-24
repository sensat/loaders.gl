"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loaders.gl/core");
const constants_1 = require("../constants");
const file_handle_provider_1 = require("./helpers/file-handle-provider");
const i3s_1 = require("@loaders.gl/i3s");
const loader_utils_1 = require("@loaders.gl/loader-utils");
const compression_1 = require("@loaders.gl/compression");
const file_utils_1 = require("../lib/utils/file-utils");
/**
 * names of files that should be changed to index
 */
const indexNames = [
    '3dSceneLayer.json.gz',
    '3dNodeIndexDocument.json.gz',
    'sharedResource.json.gz'
];
/**
 * Converter from slpk to i3s
 */
class SLPKExtractor {
    /**
     * extract slpk to i3s
     * @param options
     * @param options.inputUrl the url to read SLPK file
     * @param options.outputPath the output filename
     */
    async extract(options) {
        if (core_1.isBrowser) {
            console.log(constants_1.BROWSER_ERROR_MESSAGE);
            return constants_1.BROWSER_ERROR_MESSAGE;
        }
        const { inputUrl } = options;
        const provider = await file_handle_provider_1.FileHandleProvider.from(inputUrl);
        let localHeader = await (0, i3s_1.parseZipLocalFileHeader)(0, provider);
        while (localHeader) {
            await this.writeFile(await this.unGzip({
                name: this.correctIndexNames(localHeader.fileName),
                data: await provider.slice(localHeader.fileDataOffset, localHeader.fileDataOffset + localHeader.compressedSize)
            }), options.outputPath);
            localHeader = await (0, i3s_1.parseZipLocalFileHeader)(localHeader?.fileDataOffset + localHeader?.compressedSize, provider);
        }
        return 'success';
    }
    /**
     * Defines file name and path for i3s format
     * @param fileName initial file name and path
     */
    correctIndexNames(fileName) {
        if (indexNames.includes(loader_utils_1.path.filename(loader_utils_1.path.join('/', fileName)))) {
            return loader_utils_1.path.join(loader_utils_1.path.dirname(fileName), 'index.json.gz');
        }
        // finds path with name part and extention part
        let parts = /^(.*\/[^\/\.]*)(\..+)$/.exec(fileName);
        if (!parts) {
            return null;
        }
        return `${parts?.at(1)}/index${parts?.at(2)}`;
    }
    async unGzip(file) {
        if (/\.gz$/.test(file.name ?? '')) {
            const compression = new compression_1.GZipCompression();
            const decompressedData = await compression.decompress(file.data);
            return { data: decompressedData, name: (file.name ?? '').slice(0, -3) };
        }
        return Promise.resolve(file);
    }
    async writeFile(options, outputPath) {
        if (!options.name) {
            return;
        }
        const finalPath = loader_utils_1.path.join(outputPath, options.name);
        const dirName = loader_utils_1.path.dirname(finalPath);
        const fileName = loader_utils_1.path.filename(finalPath);
        await (0, file_utils_1.writeFile)(dirName, options.data, fileName);
    }
}
exports.default = SLPKExtractor;
