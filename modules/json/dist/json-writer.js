"use strict";
// loaders.gl, MIT license
// Copyright 2022 Foursquare Labs, Inc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONWriter = void 0;
const json_encoder_1 = require("./lib/encoders/json-encoder");
exports.JSONWriter = {
    id: 'json',
    version: 'latest',
    module: 'json',
    name: 'JSON',
    extensions: ['json'],
    mimeTypes: ['application/json'],
    options: {},
    text: true,
    encode: async (table, options) => new TextEncoder().encode((0, json_encoder_1.encodeTableAsJSON)(table, options)).buffer,
    encodeText: (table, options) => (0, json_encoder_1.encodeTableAsJSON)(table, options)
};
