"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_utils_1 = require("@loaders.gl/worker-utils");
const b3dm_converter_1 = __importDefault(require("../3d-tiles-converter/helpers/b3dm-converter"));
const b3dmConverter = new b3dm_converter_1.default();
(0, worker_utils_1.createWorker)(async (data, options = {}) => b3dmConverter.convert(data, options.featureAttributes));
