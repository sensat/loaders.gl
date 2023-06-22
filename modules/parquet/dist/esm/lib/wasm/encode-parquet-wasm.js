import { RecordBatchStreamWriter } from 'apache-arrow';
import { loadWasm } from './load-wasm';
export async function encode(table, options) {
  var _options$parquet;
  const wasmUrl = options === null || options === void 0 ? void 0 : (_options$parquet = options.parquet) === null || _options$parquet === void 0 ? void 0 : _options$parquet.wasmUrl;
  const wasm = await loadWasm(wasmUrl);
  const arrowIPCBytes = tableToIPC(table);
  const writerProperties = new wasm.WriterPropertiesBuilder().build();
  const parquetBytes = wasm.writeParquet(arrowIPCBytes, writerProperties);
  return parquetBytes.buffer.slice(parquetBytes.byteOffset, parquetBytes.byteLength + parquetBytes.byteOffset);
}
export function tableToIPC(table) {
  return RecordBatchStreamWriter.writeAll(table).toUint8Array(true);
}
//# sourceMappingURL=encode-parquet-wasm.js.map