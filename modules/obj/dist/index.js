"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckMTLLoader = exports._typecheckOBJLoader = exports.MTLLoader = exports.OBJLoader = exports.OBJWorkerLoader = void 0;
const parse_obj_1 = require("./lib/parse-obj");
const obj_loader_1 = require("./obj-loader");
Object.defineProperty(exports, "OBJWorkerLoader", { enumerable: true, get: function () { return obj_loader_1.OBJLoader; } });
const parse_mtl_1 = require("./lib/parse-mtl");
const mtl_loader_1 = require("./mtl-loader");
/**
 * Loader for the OBJ geometry format
 */
exports.OBJLoader = {
    ...obj_loader_1.OBJLoader,
    parse: async (arrayBuffer, options) => (0, parse_obj_1.parseOBJ)(new TextDecoder().decode(arrayBuffer), options),
    parseTextSync: (text, options) => (0, parse_obj_1.parseOBJ)(text, options)
};
// MTLLoader
/**
 * Loader for the MTL material format
 */
exports.MTLLoader = {
    ...mtl_loader_1.MTLLoader,
    parse: async (arrayBuffer, options) => (0, parse_mtl_1.parseMTL)(new TextDecoder().decode(arrayBuffer), options?.mtl),
    parseTextSync: (text, options) => (0, parse_mtl_1.parseMTL)(text, options?.mtl)
};
exports._typecheckOBJLoader = exports.OBJLoader;
exports._typecheckMTLLoader = exports.MTLLoader;
