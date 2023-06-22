"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.osopen = exports.osclose = exports.oswrite = exports.load = void 0;
// Forked from https://github.com/kbajalc/parquets under MIT license (Copyright (c) 2017 ironSource Ltd.)
const loader_utils_1 = require("@loaders.gl/loader-utils");
function load(name) {
    return (module || global).require(name);
}
exports.load = load;
function oswrite(os, buf) {
    return new Promise((resolve, reject) => {
        os.write(buf, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
exports.oswrite = oswrite;
function osclose(os) {
    return new Promise((resolve, reject) => {
        os.close((err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
exports.osclose = osclose;
function osopen(path, opts) {
    return new Promise((resolve, reject) => {
        const outputStream = loader_utils_1.fs.createWriteStream(path, opts);
        outputStream.once('open', (fd) => resolve(outputStream));
        outputStream.once('error', (err) => reject(err));
    });
}
exports.osopen = osopen;
