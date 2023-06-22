"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBSONSync = void 0;
const bson_1 = require("bson");
function parseBSONSync(value, options) {
    const parsedData = (0, bson_1.deserialize)(new Uint8Array(value), options);
    return parsedData;
}
exports.parseBSONSync = parseBSONSync;
