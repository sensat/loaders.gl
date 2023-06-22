"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loader_utils_1 = require("@loaders.gl/loader-utils");
const wkb_loader_1 = require("../wkb-loader");
(0, loader_utils_1.createLoaderWorker)(wkb_loader_1.WKBLoader);
