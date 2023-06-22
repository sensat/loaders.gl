"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Polyfills increases the bundle size significantly. Use it for NodeJS worker only
require("@loaders.gl/polyfills");
const loader_utils_1 = require("@loaders.gl/loader-utils");
const basis_loader_1 = require("../basis-loader");
(0, loader_utils_1.createLoaderWorker)(basis_loader_1.BasisLoader);
