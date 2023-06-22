import { Table as ArrowTable, RecordBatchStreamReader } from 'apache-arrow';
import { loadWasm } from './load-wasm/load-wasm-node';
export async function parseParquetWasm(arrayBuffer, options) {
  var _options$parquet;
  const wasmUrl = options === null || options === void 0 ? void 0 : (_options$parquet = options.parquet) === null || _options$parquet === void 0 ? void 0 : _options$parquet.wasmUrl;
  const wasm = await loadWasm(wasmUrl);
  const arr = new Uint8Array(arrayBuffer);
  const arrowIPCUint8Arr = wasm.readParquet(arr);
  const arrowIPCBuffer = arrowIPCUint8Arr.buffer.slice(arrowIPCUint8Arr.byteOffset, arrowIPCUint8Arr.byteLength + arrowIPCUint8Arr.byteOffset);
  const arrowTable = tableFromIPC(arrowIPCBuffer);
  return arrowTable;
}
function tableFromIPC(input) {
  const reader = RecordBatchStreamReader.from(input);
  const recordBatches = [];
  for (const recordBatch of reader) {
    recordBatches.push(recordBatch);
  }
  return new ArrowTable(recordBatches);
}
//# sourceMappingURL=parse-parquet-wasm.js.map