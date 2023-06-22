"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableToIPC = exports.encode = void 0;
const apache_arrow_1 = require("apache-arrow");
const load_wasm_1 = require("./load-wasm");
/**
 * Encode Arrow Table to Parquet buffer
 */
async function encode(table, options) {
    const wasmUrl = options?.parquet?.wasmUrl;
    const wasm = await (0, load_wasm_1.loadWasm)(wasmUrl);
    const arrowIPCBytes = tableToIPC(table);
    // TODO: provide options for how to write table.
    const writerProperties = new wasm.WriterPropertiesBuilder().build();
    const parquetBytes = wasm.writeParquet(arrowIPCBytes, writerProperties);
    return parquetBytes.buffer.slice(parquetBytes.byteOffset, parquetBytes.byteLength + parquetBytes.byteOffset);
}
exports.encode = encode;
/**
 * Serialize a {@link Table} to the IPC format. This function is a convenience
 * wrapper for {@link RecordBatchStreamWriter} and {@link RecordBatchFileWriter}.
 * Opposite of {@link tableFromIPC}.
 *
 * @param table The Table to serialize.
 * @param type Whether to serialize the Table as a file or a stream.
 */
function tableToIPC(table) {
    return apache_arrow_1.RecordBatchStreamWriter.writeAll(table).toUint8Array(true);
}
exports.tableToIPC = tableToIPC;
