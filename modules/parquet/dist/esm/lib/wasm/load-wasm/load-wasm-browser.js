import * as wasmEsm from 'parquet-wasm/esm2/arrow1';
let cached = null;
export async function loadWasm(wasmUrl) {
  if (cached !== null) {
    return cached;
  }
  await wasmEsm.default(wasmUrl);
  cached = wasmEsm;
  return wasmEsm;
}
//# sourceMappingURL=load-wasm-browser.js.map