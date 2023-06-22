"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseParquetWasm = void 0;
const apache_arrow_1 = require("apache-arrow");
const load_wasm_node_1 = require("./load-wasm/load-wasm-node");
async function parseParquetWasm(arrayBuffer, options) {
    const wasmUrl = options?.parquet?.wasmUrl;
    const wasm = await (0, load_wasm_node_1.loadWasm)(wasmUrl);
    const arr = new Uint8Array(arrayBuffer);
    const arrowIPCUint8Arr = wasm.readParquet(arr);
    const arrowIPCBuffer = arrowIPCUint8Arr.buffer.slice(arrowIPCUint8Arr.byteOffset, arrowIPCUint8Arr.byteLength + arrowIPCUint8Arr.byteOffset);
    const arrowTable = tableFromIPC(arrowIPCBuffer);
    return arrowTable;
}
exports.parseParquetWasm = parseParquetWasm;
/**
 * Deserialize the IPC format into a {@link Table}. This function is a
 * convenience wrapper for {@link RecordBatchReader}. Opposite of {@link tableToIPC}.
 */
function tableFromIPC(input) {
    const reader = apache_arrow_1.RecordBatchStreamReader.from(input);
    const recordBatches = [];
    for (const recordBatch of reader) {
        recordBatches.push(recordBatch);
    }
    return new apache_arrow_1.Table(recordBatches);
}
