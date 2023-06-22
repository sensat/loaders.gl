var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

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
            context: __spreadProps(__spreadValues({}, context), {
              parse: parseOnMainThread
            })
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
  options = __spreadProps(__spreadValues({}, options), {
    modules: loader && loader.options && loader.options.modules || {},
    worker: false
  });
  return await parser(data, __spreadValues({}, options), context, loader);
}

// src/null-loader.ts
var VERSION = true ? "4.0.0-alpha.7" : "latest";
function parseSync(arrayBuffer, options, context) {
  if (!options.null.echoParameters)
    return null;
  context = context && JSON.parse(JSON.stringify(context));
  return { arrayBuffer, options, context };
}
var NullLoader = {
  name: "Null loader",
  id: "null",
  module: "core",
  version: VERSION,
  mimeTypes: ["application/x.empty"],
  extensions: ["null"],
  parse: async (arrayBuffer, options, context) => parseSync(arrayBuffer, options, context),
  parseSync,
  parseInBatches: async function* generator(asyncIterator, options, context) {
    for await (const batch of asyncIterator) {
      yield parseSync(batch, options, context);
    }
  },
  tests: [() => false],
  options: {
    null: {
      echoParameters: false
    }
  }
};

// src/workers/null-worker.ts
createLoaderWorker(NullLoader);
