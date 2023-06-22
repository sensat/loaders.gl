"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSONSync = void 0;
const schema_1 = require("@loaders.gl/schema");
function parseJSONSync(jsonText, options) {
    try {
        const json = JSON.parse(jsonText);
        if (options.json?.table) {
            const data = getFirstArray(json) || json;
            return (0, schema_1.makeTableFromData)(data);
        }
        return json;
    }
    catch (error) {
        throw new Error('JSONLoader: failed to parse JSON');
    }
}
exports.parseJSONSync = parseJSONSync;
function getFirstArray(json) {
    if (Array.isArray(json)) {
        return json;
    }
    if (json && typeof json === 'object') {
        for (const value of Object.values(json)) {
            const array = getFirstArray(value);
            if (array) {
                return array;
            }
        }
    }
    return null;
}
