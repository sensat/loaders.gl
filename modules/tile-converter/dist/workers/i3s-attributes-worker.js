"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_utils_1 = require("@loaders.gl/worker-utils");
const geometry_converter_1 = require("../i3s-converter/helpers/geometry-converter");
(0, worker_utils_1.createWorker)(async (data, options = {}) => await (0, geometry_converter_1.convertAttributes)(data, options.materialAndTextureList, options.useCartesianPositions));
