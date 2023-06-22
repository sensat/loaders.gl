"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckFlatGeobufLoader = exports.FlatGeobufLoader = exports.FlatGeobufWorkerLoader = void 0;
const flatgeobuf_loader_1 = require("./flatgeobuf-loader");
Object.defineProperty(exports, "FlatGeobufWorkerLoader", { enumerable: true, get: function () { return flatgeobuf_loader_1.FlatGeobufLoader; } });
const parse_flatgeobuf_1 = require("./lib/parse-flatgeobuf");
exports.FlatGeobufLoader = {
    ...flatgeobuf_loader_1.FlatGeobufLoader,
    parse: async (arrayBuffer, options) => (0, parse_flatgeobuf_1.parseFlatGeobuf)(arrayBuffer, options),
    parseSync: parse_flatgeobuf_1.parseFlatGeobuf,
    parseInBatchesFromStream: parse_flatgeobuf_1.parseFlatGeobufInBatches,
    binary: true
};
exports._typecheckFlatGeobufLoader = exports.FlatGeobufLoader;
