"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Polyfills increases the bundle size significantly. Use it for NodeJS worker only
require("@loaders.gl/polyfills");
const loader_utils_1 = require("@loaders.gl/loader-utils");
const i3s_content_loader_1 = require("../i3s-content-loader");
(0, loader_utils_1.createLoaderWorker)(i3s_content_loader_1.I3SContentLoader);
