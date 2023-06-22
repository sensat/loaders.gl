"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseNDJSONSync = void 0;
const schema_1 = require("@loaders.gl/schema");
function parseNDJSONSync(ndjsonText) {
    const lines = ndjsonText.trim().split('\n');
    const parsedLines = lines.map((line, counter) => {
        try {
            return JSON.parse(line);
        }
        catch (error) {
            throw new Error(`NDJSONLoader: failed to parse JSON on line ${counter + 1}`);
        }
    });
    return (0, schema_1.makeTableFromData)(parsedLines);
}
exports.parseNDJSONSync = parseNDJSONSync;
