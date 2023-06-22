import { makeArrayRowIterator, getTableNumCols } from '@loaders.gl/schema';
import { csvFormatRows } from 'd3-dsv';
export function encodeTableAsCSV(table) {
  var _options$csv, _table$schema;
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    csv: {
      useDisplayNames: true
    }
  };
  const useDisplayNames = options.useDisplayNames || ((_options$csv = options.csv) === null || _options$csv === void 0 ? void 0 : _options$csv.useDisplayNames);
  const fields = ((_table$schema = table.schema) === null || _table$schema === void 0 ? void 0 : _table$schema.fields) || [];
  const columnNames = fields.map(f => {
    var _f$metadata;
    const displayName = (_f$metadata = f.metadata) === null || _f$metadata === void 0 ? void 0 : _f$metadata.displayName;
    return useDisplayNames && typeof displayName === 'string' ? displayName : f.name;
  });
  const formattedData = [columnNames];
  for (const row of makeArrayRowIterator(table)) {
    const formattedRow = [];
    for (let columnIndex = 0; columnIndex < getTableNumCols(table); ++columnIndex) {
      const value = row[columnIndex];
      formattedRow[columnIndex] = preformatFieldValue(value);
    }
    formattedData.push(formattedRow);
  }
  return csvFormatRows(formattedData);
}
const preformatFieldValue = value => {
  if (value === null || value === undefined) {
    return null;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};
//# sourceMappingURL=encode-csv.js.map