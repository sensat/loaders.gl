(() => {
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

  // src/lib/utils/version.ts
  var VERSION = true ? "4.0.0-alpha.7" : "latest";

  // src/lib/parse-wkt.ts
  var numberRegexp = /[-+]?([0-9]*\.[0-9]+|[0-9]+)([eE][-+]?[0-9]+)?/;
  var tuples = new RegExp("^" + numberRegexp.source + "(\\s" + numberRegexp.source + "){1,}");
  function parseWKT(input) {
    const parts = input.split(";");
    let _ = parts.pop();
    const srid = (parts.shift() || "").split("=").pop();
    let i = 0;
    function $(re) {
      const match = _.substring(i).match(re);
      if (!match)
        return null;
      else {
        i += match[0].length;
        return match[0];
      }
    }
    function crs(obj) {
      if (obj && srid.match(/\d+/)) {
        obj.crs = {
          type: "name",
          properties: {
            name: "urn:ogc:def:crs:EPSG::" + srid
          }
        };
      }
      return obj;
    }
    function white() {
      $(/^\s*/);
    }
    function multicoords() {
      white();
      let depth = 0;
      const rings = [];
      const stack = [rings];
      let pointer = rings;
      let elem;
      while (elem = $(/^(\()/) || $(/^(\))/) || $(/^(,)/) || $(tuples)) {
        if (elem === "(") {
          stack.push(pointer);
          pointer = [];
          stack[stack.length - 1].push(pointer);
          depth++;
        } else if (elem === ")") {
          if (pointer.length === 0)
            return null;
          pointer = stack.pop();
          if (!pointer)
            return null;
          depth--;
          if (depth === 0)
            break;
        } else if (elem === ",") {
          pointer = [];
          stack[stack.length - 1].push(pointer);
        } else if (!elem.split(/\s/g).some(isNaN)) {
          Array.prototype.push.apply(pointer, elem.split(/\s/g).map(parseFloat));
        } else {
          return null;
        }
        white();
      }
      if (depth !== 0)
        return null;
      return rings;
    }
    function coords() {
      const list = [];
      let item;
      let pt;
      while (pt = $(tuples) || $(/^(,)/)) {
        if (pt === ",") {
          list.push(item);
          item = [];
        } else if (!pt.split(/\s/g).some(isNaN)) {
          if (!item)
            item = [];
          Array.prototype.push.apply(item, pt.split(/\s/g).map(parseFloat));
        }
        white();
      }
      if (item)
        list.push(item);
      else
        return null;
      return list.length ? list : null;
    }
    function point() {
      if (!$(/^(point(\sz)?)/i))
        return null;
      white();
      if (!$(/^(\()/))
        return null;
      const c = coords();
      if (!c)
        return null;
      white();
      if (!$(/^(\))/))
        return null;
      return {
        type: "Point",
        coordinates: c[0]
      };
    }
    function multipoint() {
      if (!$(/^(multipoint)/i))
        return null;
      white();
      const newCoordsFormat = _.substring(_.indexOf("(") + 1, _.length - 1).replace(/\(/g, "").replace(/\)/g, "");
      _ = "MULTIPOINT (" + newCoordsFormat + ")";
      const c = multicoords();
      if (!c)
        return null;
      white();
      return {
        type: "MultiPoint",
        coordinates: c
      };
    }
    function multilinestring() {
      if (!$(/^(multilinestring)/i))
        return null;
      white();
      const c = multicoords();
      if (!c)
        return null;
      white();
      return {
        type: "MultiLineString",
        coordinates: c
      };
    }
    function linestring() {
      if (!$(/^(linestring(\sz)?)/i))
        return null;
      white();
      if (!$(/^(\()/))
        return null;
      const c = coords();
      if (!c)
        return null;
      if (!$(/^(\))/))
        return null;
      return {
        type: "LineString",
        coordinates: c
      };
    }
    function polygon() {
      if (!$(/^(polygon(\sz)?)/i))
        return null;
      white();
      const c = multicoords();
      if (!c)
        return null;
      return {
        type: "Polygon",
        coordinates: c
      };
    }
    function multipolygon() {
      if (!$(/^(multipolygon)/i))
        return null;
      white();
      const c = multicoords();
      if (!c)
        return null;
      return {
        type: "MultiPolygon",
        coordinates: c
      };
    }
    function geometrycollection() {
      const geometries = [];
      let geometry;
      if (!$(/^(geometrycollection)/i))
        return null;
      white();
      if (!$(/^(\()/))
        return null;
      while (geometry = root()) {
        geometries.push(geometry);
        white();
        $(/^(,)/);
        white();
      }
      if (!$(/^(\))/))
        return null;
      return {
        type: "GeometryCollection",
        geometries
      };
    }
    function root() {
      return point() || linestring() || polygon() || multipoint() || multilinestring() || multipolygon() || geometrycollection();
    }
    return crs(root());
  }

  // src/wkt-loader.ts
  var WKTWorkerLoader = {
    name: "WKT (Well-Known Text)",
    id: "wkt",
    module: "wkt",
    version: VERSION,
    worker: true,
    extensions: ["wkt"],
    mimeTypes: ["text/plain"],
    category: "geometry",
    text: true,
    options: {
      wkt: {}
    }
  };
  var WKTLoader = {
    ...WKTWorkerLoader,
    parse: async (arrayBuffer) => parseWKT(new TextDecoder().decode(arrayBuffer)),
    parseTextSync: parseWKT
  };

  // src/workers/wkt-worker.ts
  createLoaderWorker(WKTLoader);
})();
