import { makeTableFromData } from '@loaders.gl/schema';
export function parseNDJSONSync(ndjsonText) {
  const lines = ndjsonText.trim().split('\n');
  const parsedLines = lines.map((line, counter) => {
    try {
      return JSON.parse(line);
    } catch (error) {
      throw new Error("NDJSONLoader: failed to parse JSON on line ".concat(counter + 1));
    }
  });
  return makeTableFromData(parsedLines);
}
//# sourceMappingURL=parse-ndjson.js.map