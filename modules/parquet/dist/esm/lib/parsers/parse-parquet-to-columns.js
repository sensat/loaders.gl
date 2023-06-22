import { makeReadableFile } from '@loaders.gl/loader-utils';
import { ParquetReader } from '../../parquetjs/parser/parquet-reader';
import { convertParquetSchema } from '../arrow/convert-schema-from-parquet';
import { materializeColumns } from '../../parquetjs/schema/shred';
import { unpackGeoMetadata } from '../geo/decode-geo-metadata';
export async function parseParquetInColumns(arrayBuffer, options) {
  const blob = new Blob([arrayBuffer]);
  for await (const batch of parseParquetFileInColumnarBatches(blob, options)) {
    return {
      shape: 'columnar-table',
      schema: batch.schema,
      data: batch.data
    };
  }
  throw new Error('empty table');
}
export async function* parseParquetFileInColumnarBatches(blob, options) {
  const file = makeReadableFile(blob);
  const reader = new ParquetReader(file);
  const parquetSchema = await reader.getSchema();
  const parquetMetadata = await reader.getFileMetadata();
  const schema = convertParquetSchema(parquetSchema, parquetMetadata);
  unpackGeoMetadata(schema);
  const rowGroups = reader.rowGroupIterator(options === null || options === void 0 ? void 0 : options.parquet);
  for await (const rowGroup of rowGroups) {
    yield convertRowGroupToTableBatch(parquetSchema, rowGroup, schema);
  }
}
function convertRowGroupToTableBatch(parquetSchema, rowGroup, schema) {
  const data = materializeColumns(parquetSchema, rowGroup);
  return {
    shape: 'columnar-table',
    batchType: 'data',
    schema,
    data,
    length: rowGroup.rowCount
  };
}
//# sourceMappingURL=parse-parquet-to-columns.js.map