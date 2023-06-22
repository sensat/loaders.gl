"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeLoaderOptions = void 0;
/**
 *
 * @param baseOptions Can be undefined, in which case a fresh options object will be minted
 * @param newOptions
 * @returns
 */
function mergeLoaderOptions(baseOptions, newOptions) {
    return mergeOptionsRecursively(baseOptions || {}, newOptions);
}
exports.mergeLoaderOptions = mergeLoaderOptions;
function mergeOptionsRecursively(baseOptions, newOptions) {
    const options = { ...baseOptions };
    for (const [key, newValue] of Object.entries(newOptions)) {
        if (newValue && typeof newValue === 'object') {
            options[key] = mergeOptionsRecursively(options[key] || {}, newOptions[key]);
            // Object.assign(options[key] as object, newOptions[key]);
        }
        else {
            options[key] = newOptions[key];
        }
    }
    return options;
}
