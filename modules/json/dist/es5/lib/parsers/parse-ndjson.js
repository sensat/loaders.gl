"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseNDJSONSync = parseNDJSONSync;
var _schema = require("@loaders.gl/schema");
function parseNDJSONSync(ndjsonText) {
  var lines = ndjsonText.trim().split('\n');
  var parsedLines = lines.map(function (line, counter) {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error("NDJSONLoader: failed to parse JSON on line ".concat(counter + 1));
    }
  });
  return (0, _schema.makeTableFromData)(parsedLines);
}
//# sourceMappingURL=parse-ndjson.js.map