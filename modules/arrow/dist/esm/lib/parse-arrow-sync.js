import { tableFromIPC } from 'apache-arrow';
export default function parseArrowSync(arrayBuffer, options) {
  var _options$arrow;
  const arrowTable = tableFromIPC([new Uint8Array(arrayBuffer)]);
  const columnarTable = {};
  for (const field of arrowTable.schema.fields) {
    const arrowColumn = arrowTable.getChild(field.name);
    const values = arrowColumn === null || arrowColumn === void 0 ? void 0 : arrowColumn.toArray();
    columnarTable[field.name] = values;
  }
  switch (options === null || options === void 0 ? void 0 : (_options$arrow = options.arrow) === null || _options$arrow === void 0 ? void 0 : _options$arrow.shape) {
    case 'arrow-table':
      return arrowTable;
    case 'object-row-table':
      return convertColumnarToRowFormatTable(columnarTable);
    case 'columnar-table':
    default:
      return columnarTable;
  }
}
function convertColumnarToRowFormatTable(columnarTable) {
  const tableKeys = Object.keys(columnarTable);
  const tableRowsCount = columnarTable[tableKeys[0]].length;
  const rowFormatTable = [];
  for (let index = 0; index < tableRowsCount; index++) {
    const tableItem = {};
    for (let keyIndex = 0; keyIndex < tableKeys.length; keyIndex++) {
      const fieldName = tableKeys[keyIndex];
      tableItem[fieldName] = columnarTable[fieldName][index];
    }
    rowFormatTable.push(tableItem);
  }
  return rowFormatTable;
}
//# sourceMappingURL=parse-arrow-sync.js.map