"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadGifshotModule = void 0;
// @ts-nocheck
const worker_utils_1 = require("@loaders.gl/worker-utils");
let loadGifshotPromise;
async function loadGifshotModule(options = {}) {
    const modules = options.modules || {};
    if (modules.gifshot) {
        return modules.gifshot;
    }
    loadGifshotPromise = loadGifshotPromise || loadGifshot(options);
    return await loadGifshotPromise;
}
exports.loadGifshotModule = loadGifshotModule;
async function loadGifshot(options) {
    options.libraryPath = options.libraryPath || 'libs/';
    const gifshot = await (0, worker_utils_1.loadLibrary)('gifshot.js', 'gifshot', options);
    // Depends on how import happened...
    // @ts-ignore TS2339: Property does not exist on type
    return gifshot || globalThis.gifshot;
}
