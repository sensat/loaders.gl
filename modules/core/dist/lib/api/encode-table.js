"use strict";
// loaders.gl, MIT license
// Copyright 2022 Foursquare Labs, Inc
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeTableInBatches = exports.encodeTableAsText = exports.encodeTable = void 0;
/* global TextEncoder, TextDecoder */
const loader_utils_1 = require("@loaders.gl/loader-utils");
async function encodeTable(data, writer, options) {
    if (writer.encode) {
        return await writer.encode(data, options);
    }
    if (writer.encodeText) {
        const text = await writer.encodeText(data, options);
        return new TextEncoder().encode(text);
    }
    if (writer.encodeInBatches) {
        // Create an iterator representing the data
        // TODO - Assumes this is a table
        const batches = encodeTableInBatches(data, writer, options);
        // Concatenate the output
        const chunks = [];
        for await (const batch of batches) {
            chunks.push(batch);
        }
        return (0, loader_utils_1.concatenateArrayBuffers)(...chunks);
    }
    throw new Error('Writer could not encode data');
}
exports.encodeTable = encodeTable;
async function encodeTableAsText(data, writer, options) {
    if (writer.text && writer.encodeText) {
        return await writer.encodeText(data, options);
    }
    if (writer.text && (writer.encode || writer.encodeInBatches)) {
        const arrayBuffer = await encodeTable(data, writer, options);
        return new TextDecoder().decode(arrayBuffer);
    }
    throw new Error('Writer could not encode data as text');
}
exports.encodeTableAsText = encodeTableAsText;
function encodeTableInBatches(data, writer, options) {
    if (writer.encodeInBatches) {
        const dataIterator = getIterator(data);
        // @ts-expect-error
        return writer.encodeInBatches(dataIterator, options);
    }
    // TODO -fall back to atomic encode?
    throw new Error('Writer could not encode data in batches');
}
exports.encodeTableInBatches = encodeTableInBatches;
function getIterator(data) {
    const dataIterator = [{ table: data, start: 0, end: data.length }];
    return dataIterator;
}
