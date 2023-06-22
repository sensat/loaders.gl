import JSZip from 'jszip';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const ZipLoader = {
  id: 'zip',
  module: 'zip',
  name: 'Zip Archive',
  version: VERSION,
  extensions: ['zip'],
  mimeTypes: ['application/zip'],
  category: 'archive',
  tests: ['PK'],
  options: {},
  parse: parseZipAsync
};
async function parseZipAsync(data) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const promises = [];
  const fileMap = {};
  try {
    const jsZip = new JSZip();
    const zip = await jsZip.loadAsync(data, options);
    zip.forEach((relativePath, zipEntry) => {
      const subFilename = zipEntry.name;
      const promise = loadZipEntry(jsZip, subFilename, options).then(arrayBufferOrError => {
        fileMap[relativePath] = arrayBufferOrError;
      });
      promises.push(promise);
    });
    await Promise.all(promises);
    return fileMap;
  } catch (error) {
    options.log.error("Unable to read zip archive: ".concat(error));
    throw error;
  }
}
async function loadZipEntry(jsZip, subFilename) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  try {
    const arrayBuffer = await jsZip.file(subFilename).async(options.dataType || 'arraybuffer');
    return arrayBuffer;
  } catch (error) {
    options.log.error("Unable to read ".concat(subFilename, " from zip archive: ").concat(error));
    return error;
  }
}
export const _typecheckZipLoader = ZipLoader;
//# sourceMappingURL=zip-loader.js.map