"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.BSONWriter = void 0;
const encode_bson_1 = require("./lib/encoders/encode-bson");
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
exports.BSONWriter = {
    name: 'BSON',
    id: 'bson',
    module: 'bson',
    version: VERSION,
    extensions: ['bson'],
    options: {
        bson: {}
    },
    async encode(data, options) {
        return (0, encode_bson_1.encodeBSONSync)(data, {}); // options
    },
    encodeSync(data, options) {
        return (0, encode_bson_1.encodeBSONSync)(data, {}); // options
    }
};
