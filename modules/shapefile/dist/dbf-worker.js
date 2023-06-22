(() => {
  // src/lib/streaming/binary-chunk-reader.ts
  var BinaryChunkReader = class {
    constructor(options) {
      const { maxRewindBytes = 0 } = options || {};
      this.offset = 0;
      this.arrayBuffers = [];
      this.ended = false;
      this.maxRewindBytes = maxRewindBytes;
    }
    write(arrayBuffer) {
      this.arrayBuffers.push(arrayBuffer);
    }
    end() {
      this.arrayBuffers = [];
      this.ended = true;
    }
    hasAvailableBytes(bytes) {
      let bytesAvailable = -this.offset;
      for (const arrayBuffer of this.arrayBuffers) {
        bytesAvailable += arrayBuffer.byteLength;
        if (bytesAvailable >= bytes) {
          return true;
        }
      }
      return false;
    }
    findBufferOffsets(bytes) {
      let offset = -this.offset;
      const selectedBuffers = [];
      for (let i = 0; i < this.arrayBuffers.length; i++) {
        const buf = this.arrayBuffers[i];
        if (offset + buf.byteLength <= 0) {
          offset += buf.byteLength;
          continue;
        }
        const start = offset <= 0 ? Math.abs(offset) : 0;
        let end;
        if (start + bytes <= buf.byteLength) {
          end = start + bytes;
          selectedBuffers.push([i, [start, end]]);
          return selectedBuffers;
        }
        end = buf.byteLength;
        selectedBuffers.push([i, [start, end]]);
        bytes -= buf.byteLength - start;
        offset += buf.byteLength;
      }
      return null;
    }
    getDataView(bytes) {
      const bufferOffsets = this.findBufferOffsets(bytes);
      if (!bufferOffsets && this.ended) {
        throw new Error("binary data exhausted");
      }
      if (!bufferOffsets) {
        return null;
      }
      if (bufferOffsets.length === 1) {
        const [bufferIndex, [start, end]] = bufferOffsets[0];
        const arrayBuffer = this.arrayBuffers[bufferIndex];
        const view2 = new DataView(arrayBuffer, start, end - start);
        this.offset += bytes;
        this.disposeBuffers();
        return view2;
      }
      const view = new DataView(this._combineArrayBuffers(bufferOffsets));
      this.offset += bytes;
      this.disposeBuffers();
      return view;
    }
    disposeBuffers() {
      while (this.arrayBuffers.length > 0 && this.offset - this.maxRewindBytes >= this.arrayBuffers[0].byteLength) {
        this.offset -= this.arrayBuffers[0].byteLength;
        this.arrayBuffers.shift();
      }
    }
    _combineArrayBuffers(bufferOffsets) {
      let byteLength = 0;
      for (const bufferOffset of bufferOffsets) {
        const [start, end] = bufferOffset[1];
        byteLength += end - start;
      }
      const result = new Uint8Array(byteLength);
      let resultOffset = 0;
      for (const bufferOffset of bufferOffsets) {
        const [bufferIndex, [start, end]] = bufferOffset;
        const sourceArray = new Uint8Array(this.arrayBuffers[bufferIndex]);
        result.set(sourceArray.subarray(start, end), resultOffset);
        resultOffset += end - start;
      }
      return result.buffer;
    }
    skip(bytes) {
      this.offset += bytes;
    }
    rewind(bytes) {
      this.offset -= bytes;
    }
  };

  // src/lib/parsers/parse-dbf.ts
  var LITTLE_ENDIAN = true;
  var DBF_HEADER_SIZE = 32;
  var STATE;
  (function(STATE2) {
    STATE2[STATE2["START"] = 0] = "START";
    STATE2[STATE2["FIELD_DESCRIPTORS"] = 1] = "FIELD_DESCRIPTORS";
    STATE2[STATE2["FIELD_PROPERTIES"] = 2] = "FIELD_PROPERTIES";
    STATE2[STATE2["END"] = 3] = "END";
    STATE2[STATE2["ERROR"] = 4] = "ERROR";
  })(STATE || (STATE = {}));
  var DBFParser = class {
    constructor(options) {
      this.binaryReader = new BinaryChunkReader();
      this.state = 0;
      this.result = {
        data: []
      };
      this.textDecoder = new TextDecoder(options.encoding);
    }
    write(arrayBuffer) {
      this.binaryReader.write(arrayBuffer);
      this.state = parseState(this.state, this.result, this.binaryReader, this.textDecoder);
    }
    end() {
      this.binaryReader.end();
      this.state = parseState(this.state, this.result, this.binaryReader, this.textDecoder);
      if (this.state !== 3) {
        this.state = 4;
        this.result.error = "DBF incomplete file";
      }
    }
  };
  function parseDBF(arrayBuffer, options = {}) {
    const { encoding = "latin1" } = options.dbf || {};
    const dbfParser = new DBFParser({ encoding });
    dbfParser.write(arrayBuffer);
    dbfParser.end();
    const { data, schema } = dbfParser.result;
    const shape = options?.tables?.format || options?.dbf?.shape;
    switch (shape) {
      case "object-row-table": {
        const table = {
          shape: "object-row-table",
          schema,
          data
        };
        return table;
      }
      case "table":
        return { schema, rows: data };
      case "rows":
      default:
        return data;
    }
  }
  async function* parseDBFInBatches(asyncIterator, options = {}) {
    const { encoding = "latin1" } = options.dbf || {};
    const parser = new DBFParser({ encoding });
    let headerReturned = false;
    for await (const arrayBuffer of asyncIterator) {
      parser.write(arrayBuffer);
      if (!headerReturned && parser.result.dbfHeader) {
        headerReturned = true;
        yield parser.result.dbfHeader;
      }
      if (parser.result.data.length > 0) {
        yield parser.result.data;
        parser.result.data = [];
      }
    }
    parser.end();
    if (parser.result.data.length > 0) {
      yield parser.result.data;
    }
  }
  function parseState(state, result, binaryReader, textDecoder) {
    while (true) {
      try {
        switch (state) {
          case 4:
          case 3:
            return state;
          case 0:
            const dataView = binaryReader.getDataView(DBF_HEADER_SIZE);
            if (!dataView) {
              return state;
            }
            result.dbfHeader = parseDBFHeader(dataView);
            result.progress = {
              bytesUsed: 0,
              rowsTotal: result.dbfHeader.nRecords,
              rows: 0
            };
            state = 1;
            break;
          case 1:
            const fieldDescriptorView = binaryReader.getDataView(result.dbfHeader.headerLength - DBF_HEADER_SIZE);
            if (!fieldDescriptorView) {
              return state;
            }
            result.dbfFields = parseFieldDescriptors(fieldDescriptorView, textDecoder);
            result.schema = {
              fields: result.dbfFields.map((dbfField) => makeField(dbfField)),
              metadata: {}
            };
            state = 2;
            binaryReader.skip(1);
            break;
          case 2:
            const { recordLength = 0, nRecords = 0 } = result?.dbfHeader || {};
            while (result.data.length < nRecords) {
              const recordView = binaryReader.getDataView(recordLength - 1);
              if (!recordView) {
                return state;
              }
              binaryReader.skip(1);
              const row = parseRow(recordView, result.dbfFields, textDecoder);
              result.data.push(row);
              result.progress.rows = result.data.length;
            }
            state = 3;
            break;
          default:
            state = 4;
            result.error = `illegal parser state ${state}`;
            return state;
        }
      } catch (error) {
        state = 4;
        result.error = `DBF parsing failed: ${error.message}`;
        return state;
      }
    }
  }
  function parseDBFHeader(headerView) {
    return {
      year: headerView.getUint8(1) + 1900,
      month: headerView.getUint8(2),
      day: headerView.getUint8(3),
      nRecords: headerView.getUint32(4, LITTLE_ENDIAN),
      headerLength: headerView.getUint16(8, LITTLE_ENDIAN),
      recordLength: headerView.getUint16(10, LITTLE_ENDIAN),
      languageDriver: headerView.getUint8(29)
    };
  }
  function parseFieldDescriptors(view, textDecoder) {
    const nFields = (view.byteLength - 1) / 32;
    const fields = [];
    let offset = 0;
    for (let i = 0; i < nFields; i++) {
      const name = textDecoder.decode(new Uint8Array(view.buffer, view.byteOffset + offset, 11)).replace(/\u0000/g, "");
      fields.push({
        name,
        dataType: String.fromCharCode(view.getUint8(offset + 11)),
        fieldLength: view.getUint8(offset + 16),
        decimal: view.getUint8(offset + 17)
      });
      offset += 32;
    }
    return fields;
  }
  function parseRow(view, fields, textDecoder) {
    const out = {};
    let offset = 0;
    for (const field of fields) {
      const text = textDecoder.decode(new Uint8Array(view.buffer, view.byteOffset + offset, field.fieldLength));
      out[field.name] = parseField(text, field.dataType);
      offset += field.fieldLength;
    }
    return out;
  }
  function parseField(text, dataType) {
    switch (dataType) {
      case "B":
        return parseNumber(text);
      case "C":
        return parseCharacter(text);
      case "F":
        return parseNumber(text);
      case "N":
        return parseNumber(text);
      case "O":
        return parseNumber(text);
      case "D":
        return parseDate(text);
      case "L":
        return parseBoolean(text);
      default:
        throw new Error("Unsupported data type");
    }
  }
  function parseDate(str) {
    return Date.UTC(str.slice(0, 4), parseInt(str.slice(4, 6), 10) - 1, str.slice(6, 8));
  }
  function parseBoolean(value) {
    return /^[nf]$/i.test(value) ? false : /^[yt]$/i.test(value) ? true : null;
  }
  function parseNumber(text) {
    const number = parseFloat(text);
    return isNaN(number) ? null : number;
  }
  function parseCharacter(text) {
    return text.trim() || null;
  }
  function makeField({ name, dataType, fieldLength, decimal }) {
    switch (dataType) {
      case "B":
        return { name, type: "float64", nullable: true, metadata: {} };
      case "C":
        return { name, type: "utf8", nullable: true, metadata: {} };
      case "F":
        return { name, type: "float64", nullable: true, metadata: {} };
      case "N":
        return { name, type: "float64", nullable: true, metadata: {} };
      case "O":
        return { name, type: "float64", nullable: true, metadata: {} };
      case "D":
        return { name, type: "timestamp-millisecond", nullable: true, metadata: {} };
      case "L":
        return { name, type: "bool", nullable: true, metadata: {} };
      default:
        throw new Error("Unsupported data type");
    }
  }

  // src/dbf-loader.ts
  var VERSION = true ? "4.0.0-alpha.7" : "latest";
  var DBFWorkerLoader = {
    name: "DBF",
    id: "dbf",
    module: "shapefile",
    version: VERSION,
    worker: true,
    category: "table",
    extensions: ["dbf"],
    mimeTypes: ["application/x-dbf"],
    options: {
      dbf: {
        encoding: "latin1"
      }
    }
  };
  var DBFLoader = {
    ...DBFWorkerLoader,
    parse: async (arrayBuffer, options) => parseDBF(arrayBuffer, options),
    parseSync: parseDBF,
    parseInBatches: parseDBFInBatches
  };

  // ../worker-utils/src/lib/worker-utils/get-transfer-list.ts
  function getTransferList(object, recursive = true, transfers) {
    const transfersSet = transfers || new Set();
    if (!object) {
    } else if (isTransferable(object)) {
      transfersSet.add(object);
    } else if (isTransferable(object.buffer)) {
      transfersSet.add(object.buffer);
    } else if (ArrayBuffer.isView(object)) {
    } else if (recursive && typeof object === "object") {
      for (const key in object) {
        getTransferList(object[key], recursive, transfersSet);
      }
    }
    return transfers === void 0 ? Array.from(transfersSet) : [];
  }
  function isTransferable(object) {
    if (!object) {
      return false;
    }
    if (object instanceof ArrayBuffer) {
      return true;
    }
    if (typeof MessagePort !== "undefined" && object instanceof MessagePort) {
      return true;
    }
    if (typeof ImageBitmap !== "undefined" && object instanceof ImageBitmap) {
      return true;
    }
    if (typeof OffscreenCanvas !== "undefined" && object instanceof OffscreenCanvas) {
      return true;
    }
    return false;
  }

  // ../worker-utils/src/lib/worker-farm/worker-body.ts
  function getParentPort() {
    let parentPort;
    try {
      eval("globalThis.parentPort = require('worker_threads').parentPort");
      parentPort = globalThis.parentPort;
    } catch {
    }
    return parentPort;
  }
  var onMessageWrapperMap = new Map();
  var WorkerBody = class {
    static inWorkerThread() {
      return typeof self !== "undefined" || Boolean(getParentPort());
    }
    static set onmessage(onMessage) {
      function handleMessage(message) {
        const parentPort3 = getParentPort();
        const { type, payload } = parentPort3 ? message : message.data;
        onMessage(type, payload);
      }
      const parentPort2 = getParentPort();
      if (parentPort2) {
        parentPort2.on("message", handleMessage);
        parentPort2.on("exit", () => console.debug("Node worker closing"));
      } else {
        globalThis.onmessage = handleMessage;
      }
    }
    static addEventListener(onMessage) {
      let onMessageWrapper = onMessageWrapperMap.get(onMessage);
      if (!onMessageWrapper) {
        onMessageWrapper = (message) => {
          if (!isKnownMessage(message)) {
            return;
          }
          const parentPort3 = getParentPort();
          const { type, payload } = parentPort3 ? message : message.data;
          onMessage(type, payload);
        };
      }
      const parentPort2 = getParentPort();
      if (parentPort2) {
        console.error("not implemented");
      } else {
        globalThis.addEventListener("message", onMessageWrapper);
      }
    }
    static removeEventListener(onMessage) {
      const onMessageWrapper = onMessageWrapperMap.get(onMessage);
      onMessageWrapperMap.delete(onMessage);
      const parentPort2 = getParentPort();
      if (parentPort2) {
        console.error("not implemented");
      } else {
        globalThis.removeEventListener("message", onMessageWrapper);
      }
    }
    static postMessage(type, payload) {
      const data = { source: "loaders.gl", type, payload };
      const transferList = getTransferList(payload);
      const parentPort2 = getParentPort();
      if (parentPort2) {
        parentPort2.postMessage(data, transferList);
      } else {
        globalThis.postMessage(data, transferList);
      }
    }
  };
  function isKnownMessage(message) {
    const { type, data } = message;
    return type === "message" && data && typeof data.source === "string" && data.source.startsWith("loaders.gl");
  }

  // ../loader-utils/src/lib/worker-loader-utils/create-loader-worker.ts
  var requestId = 0;
  function createLoaderWorker(loader) {
    if (!WorkerBody.inWorkerThread()) {
      return;
    }
    WorkerBody.onmessage = async (type, payload) => {
      switch (type) {
        case "process":
          try {
            const { input, options = {}, context = {} } = payload;
            const result = await parseData({
              loader,
              arrayBuffer: input,
              options,
              context: {
                ...context,
                parse: parseOnMainThread
              }
            });
            WorkerBody.postMessage("done", { result });
          } catch (error) {
            const message = error instanceof Error ? error.message : "";
            WorkerBody.postMessage("error", { error: message });
          }
          break;
        default:
      }
    };
  }
  function parseOnMainThread(arrayBuffer, options) {
    return new Promise((resolve, reject) => {
      const id = requestId++;
      const onMessage = (type, payload2) => {
        if (payload2.id !== id) {
          return;
        }
        switch (type) {
          case "done":
            WorkerBody.removeEventListener(onMessage);
            resolve(payload2.result);
            break;
          case "error":
            WorkerBody.removeEventListener(onMessage);
            reject(payload2.error);
            break;
          default:
        }
      };
      WorkerBody.addEventListener(onMessage);
      const payload = { id, input: arrayBuffer, options };
      WorkerBody.postMessage("process", payload);
    });
  }
  async function parseData({ loader, arrayBuffer, options, context }) {
    let data;
    let parser;
    if (loader.parseSync || loader.parse) {
      data = arrayBuffer;
      parser = loader.parseSync || loader.parse;
    } else if (loader.parseTextSync) {
      const textDecoder = new TextDecoder();
      data = textDecoder.decode(arrayBuffer);
      parser = loader.parseTextSync;
    } else {
      throw new Error(`Could not load data with ${loader.name} loader`);
    }
    options = {
      ...options,
      modules: loader && loader.options && loader.options.modules || {},
      worker: false
    };
    return await parser(data, { ...options }, context, loader);
  }

  // src/workers/dbf-worker.ts
  createLoaderWorker(DBFLoader);
})();
