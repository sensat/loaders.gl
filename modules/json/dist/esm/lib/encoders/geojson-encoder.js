import { getTableLength } from '@loaders.gl/schema';
import { getTableRowAsObject } from '@loaders.gl/schema';
import { detectGeometryColumnIndex, getRowPropertyObject } from './encode-utils';
import { Utf8ArrayBufferEncoder } from './utf8-encoder';
export function encodeTableAsGeojsonInBatches(batchIterator) {
  try {
    let inputOpts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return async function* () {
      const options = {
        geojson: {},
        chunkSize: 10000,
        ...inputOpts
      };
      const utf8Encoder = new Utf8ArrayBufferEncoder(options.chunkSize);
      if (!options.geojson.featureArray) {
        utf8Encoder.push('{\n', '"type": "FeatureCollection",\n', '"features":\n');
      }
      utf8Encoder.push('[');
      let geometryColumn = options.geojson.geometryColumn;
      let isFirstLine = true;
      for await (const batch of batchIterator) {
        const {
          table,
          start,
          end = getTableLength(batch.table) - start
        } = batch;
        if (!geometryColumn) {
          geometryColumn = geometryColumn || detectGeometryColumnIndex(table);
        }
        for (let rowIndex = start; rowIndex < end; ++rowIndex) {
          if (!isFirstLine) {
            utf8Encoder.push(',');
          }
          utf8Encoder.push('\n');
          isFirstLine = false;
          encodeRow(table, rowIndex, geometryColumn, utf8Encoder);
          if (utf8Encoder.isFull()) {
            yield utf8Encoder.getArrayBufferBatch();
          }
        }
        const arrayBufferBatch = utf8Encoder.getArrayBufferBatch();
        if (arrayBufferBatch.byteLength > 0) {
          yield arrayBufferBatch;
        }
      }
      utf8Encoder.push('\n');
      utf8Encoder.push(']\n');
      if (!options.geojson.featureArray) {
        utf8Encoder.push('}');
      }
      yield utf8Encoder.getArrayBufferBatch();
    }();
  } catch (e) {
    return Promise.reject(e);
  }
}
function encodeRow(table, rowIndex, geometryColumnIndex, utf8Encoder) {
  const row = getTableRowAsObject(table, rowIndex);
  if (!row) return;
  const featureWithProperties = getFeatureFromRow(table, row, geometryColumnIndex);
  const featureString = JSON.stringify(featureWithProperties);
  utf8Encoder.push(featureString);
}
function getFeatureFromRow(table, row, geometryColumnIndex) {
  var _table$schema, _featureOrGeometry, _featureOrGeometry2;
  const properties = getRowPropertyObject(table, row, [geometryColumnIndex]);
  const columnName = (_table$schema = table.schema) === null || _table$schema === void 0 ? void 0 : _table$schema.fields[geometryColumnIndex].name;
  let featureOrGeometry = columnName && row[columnName];
  if (!featureOrGeometry) {
    return {
      type: 'Feature',
      geometry: null,
      properties
    };
  }
  if (typeof featureOrGeometry === 'string') {
    try {
      featureOrGeometry = JSON.parse(featureOrGeometry);
    } catch (err) {
      throw new Error('Invalid string geometry');
    }
  }
  if (typeof featureOrGeometry !== 'object' || typeof ((_featureOrGeometry = featureOrGeometry) === null || _featureOrGeometry === void 0 ? void 0 : _featureOrGeometry.type) !== 'string') {
    throw new Error('invalid geometry column value');
  }
  if (((_featureOrGeometry2 = featureOrGeometry) === null || _featureOrGeometry2 === void 0 ? void 0 : _featureOrGeometry2.type) === 'Feature') {
    return {
      ...featureOrGeometry,
      properties
    };
  }
  return {
    type: 'Feature',
    geometry: featureOrGeometry,
    properties
  };
}
//# sourceMappingURL=geojson-encoder.js.map