"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
const is_type_1 = require("../../javascript-utils/is-type");
const normalize_loader_1 = require("../loader-utils/normalize-loader");
const get_fetch_function_1 = require("../loader-utils/get-fetch-function");
const parse_1 = require("./parse");
// implementation signature
async function load(url, loaders, options, context) {
    let resolvedLoaders;
    let resolvedOptions;
    // Signature: load(url, options)
    if (!Array.isArray(loaders) && !(0, normalize_loader_1.isLoaderObject)(loaders)) {
        resolvedLoaders = [];
        resolvedOptions = loaders;
        context = undefined; // context not supported in short signature
    }
    else {
        resolvedLoaders = loaders;
        resolvedOptions = options;
    }
    // Select fetch function
    const fetch = (0, get_fetch_function_1.getFetchFunction)(resolvedOptions);
    // at this point, `url` could be already loaded binary data
    let data = url;
    // url is a string, fetch the url
    if (typeof url === 'string') {
        data = await fetch(url);
        // URL is Blob or File, fetchFile handles it (alt: we could generate ObjectURL here)
    }
    if ((0, is_type_1.isBlob)(url)) {
        // The fetch response object will contain blob.name
        // @ts-expect-error TODO - This may not work for overridden fetch functions
        data = await fetch(url);
    }
    // Data is loaded (at least we have a `Response` object) so time to hand over to `parse`
    // return await parse(data, loaders as Loader[], options);
    return Array.isArray(resolvedLoaders)
        ? await (0, parse_1.parse)(data, resolvedLoaders, resolvedOptions) // loader array overload
        : await (0, parse_1.parse)(data, resolvedLoaders, resolvedOptions); // single loader overload
}
exports.load = load;
