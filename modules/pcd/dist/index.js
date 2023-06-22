"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckPCDLoader = exports.PCDLoader = exports.PCDWorkerLoader = void 0;
const parse_pcd_1 = __importDefault(require("./lib/parse-pcd"));
const pcd_loader_1 = require("./pcd-loader");
Object.defineProperty(exports, "PCDWorkerLoader", { enumerable: true, get: function () { return pcd_loader_1.PCDLoader; } });
/**
 * Loader for PCD - Point Cloud Data
 */
exports.PCDLoader = {
    ...pcd_loader_1.PCDLoader,
    parse: async (arrayBuffer) => (0, parse_pcd_1.default)(arrayBuffer),
    parseSync: parse_pcd_1.default
};
exports._typecheckPCDLoader = exports.PCDLoader;
