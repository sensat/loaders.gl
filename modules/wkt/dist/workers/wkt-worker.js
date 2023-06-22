"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_utils_1 = require("@loaders.gl/loader-utils");
const wkt_loader_1 = require("../wkt-loader");
(0, loader_utils_1.createLoaderWorker)(wkt_loader_1.WKTLoader);
