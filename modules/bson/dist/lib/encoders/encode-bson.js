"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBSONSync = void 0;
const bson_1 = require("bson");
function encodeBSONSync(value, options) {
    const uint8Array = (0, bson_1.serialize)(value);
    // TODO - make sure the uint8array occupies the entire buffer.
    return uint8Array.buffer;
}
exports.encodeBSONSync = encodeBSONSync;
