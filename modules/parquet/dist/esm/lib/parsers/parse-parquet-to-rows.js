import { makeReadableFile } from '@loaders.gl/loader-utils';
import { ParquetReader } from '../../parquetjs/parser/parquet-reader';
export async function parseParquet(arrayBuffer, options) {
  const blob = new Blob([arrayBuffer]);
  const rows = [];
  for await (const batch of parseParquetFileInBatches(blob, options)) {
    for (const row of batch.data) {
      rows.push(row);
    }
  }
  return {
    shape: 'object-row-table',
    data: rows
  };
}
export async function* parseParquetFileInBatches(blob, options) {
  const file = makeReadableFile(blob);
  const reader = new ParquetReader(file);
  const rowBatches = reader.rowBatchIterator(options === null || options === void 0 ? void 0 : options.parquet);
  for await (const rows of rowBatches) {
    yield {
      shape: 'object-row-table',
      data: rows,
      batchType: 'data',
      length: rows.length
    };
  }
}
//# sourceMappingURL=parse-parquet-to-rows.js.map