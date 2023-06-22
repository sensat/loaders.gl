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

  // ../schema/src/lib/mesh/mesh-utils.ts
  function getMeshBoundingBox(attributes) {
    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;
    const positions = attributes.POSITION ? attributes.POSITION.value : [];
    const len = positions && positions.length;
    for (let i = 0; i < len; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      minX = x < minX ? x : minX;
      minY = y < minY ? y : minY;
      minZ = z < minZ ? z : minZ;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
      maxZ = z > maxZ ? z : maxZ;
    }
    return [
      [minX, minY, minZ],
      [maxX, maxY, maxZ]
    ];
  }

  // src/lib/decompress-lzf.ts
  function decompressLZF(inData, outLength) {
    const inLength = inData.length;
    const outData = new Uint8Array(outLength);
    let inPtr = 0;
    let outPtr = 0;
    let ctrl;
    let len;
    let ref;
    do {
      ctrl = inData[inPtr++];
      if (ctrl < 1 << 5) {
        ctrl++;
        if (outPtr + ctrl > outLength) {
          throw new Error("Output buffer is not large enough");
        }
        if (inPtr + ctrl > inLength) {
          throw new Error("Invalid compressed data");
        }
        do {
          outData[outPtr++] = inData[inPtr++];
        } while (--ctrl);
      } else {
        len = ctrl >> 5;
        ref = outPtr - ((ctrl & 31) << 8) - 1;
        if (inPtr >= inLength) {
          throw new Error("Invalid compressed data");
        }
        if (len === 7) {
          len += inData[inPtr++];
          if (inPtr >= inLength) {
            throw new Error("Invalid compressed data");
          }
        }
        ref -= inData[inPtr++];
        if (outPtr + len + 2 > outLength) {
          throw new Error("Output buffer is not large enough");
        }
        if (ref < 0) {
          throw new Error("Invalid compressed data");
        }
        if (ref >= outPtr) {
          throw new Error("Invalid compressed data");
        }
        do {
          outData[outPtr++] = outData[ref++];
        } while (--len + 2);
      }
    } while (inPtr < inLength);
    return outData;
  }

  // src/lib/get-pcd-schema.ts
  function getPCDSchema(PCDheader, metadata) {
    const offset = PCDheader.offset;
    const fields = [];
    if (offset.x !== void 0) {
      fields.push({
        name: "POSITION",
        type: { type: "fixed-size-list", listSize: 3, children: [{ name: "xyz", type: "float32" }] }
      });
    }
    if (offset.normal_x !== void 0) {
      fields.push({
        name: "NORMAL",
        type: { type: "fixed-size-list", listSize: 3, children: [{ name: "xyz", type: "float32" }] }
      });
    }
    if (offset.rgb !== void 0) {
      fields.push({
        name: "COLOR_0",
        type: { type: "fixed-size-list", listSize: 3, children: [{ name: "rgb", type: "uint8" }] }
      });
    }
    return { fields, metadata };
  }

  // src/lib/parse-pcd.ts
  var LITTLE_ENDIAN = true;
  function parsePCD(data) {
    const textData = new TextDecoder().decode(data);
    const pcdHeader = parsePCDHeader(textData);
    let attributes = {};
    switch (pcdHeader.data) {
      case "ascii":
        attributes = parsePCDASCII(pcdHeader, textData);
        break;
      case "binary":
        attributes = parsePCDBinary(pcdHeader, data);
        break;
      case "binary_compressed":
        attributes = parsePCDBinaryCompressed(pcdHeader, data);
        break;
      default:
        throw new Error(`PCD: ${pcdHeader.data} files are not supported`);
    }
    attributes = getMeshAttributes(attributes);
    const header = getMeshHeader(pcdHeader, attributes);
    const metadata = Object.fromEntries([
      ["mode", "0"],
      ["boundingBox", JSON.stringify(header.boundingBox)]
    ]);
    const schema = getPCDSchema(pcdHeader, metadata);
    return {
      loader: "pcd",
      loaderData: pcdHeader,
      header,
      schema,
      mode: 0,
      topology: "point-list",
      attributes
    };
  }
  function getMeshHeader(pcdHeader, attributes) {
    if (typeof pcdHeader.width === "number" && typeof pcdHeader.height === "number") {
      const pointCount = pcdHeader.width * pcdHeader.height;
      return {
        vertexCount: pointCount,
        boundingBox: getMeshBoundingBox(attributes)
      };
    }
    return {
      vertexCount: pcdHeader.vertexCount,
      boundingBox: pcdHeader.boundingBox
    };
  }
  function getMeshAttributes(attributes) {
    const normalizedAttributes = {
      POSITION: {
        value: new Float32Array(attributes.position),
        size: 3
      }
    };
    if (attributes.normal && attributes.normal.length > 0) {
      normalizedAttributes.NORMAL = {
        value: new Float32Array(attributes.normal),
        size: 3
      };
    }
    if (attributes.color && attributes.color.length > 0) {
      normalizedAttributes.COLOR_0 = {
        value: new Uint8Array(attributes.color),
        size: 3
      };
    }
    if (attributes.intensity && attributes.intensity.length > 0) {
      normalizedAttributes.COLOR_0 = {
        value: new Uint8Array(attributes.color),
        size: 3
      };
    }
    if (attributes.label && attributes.label.length > 0) {
      normalizedAttributes.COLOR_0 = {
        value: new Uint8Array(attributes.label),
        size: 3
      };
    }
    return normalizedAttributes;
  }
  function parsePCDHeader(data) {
    const result1 = data.search(/[\r\n]DATA\s(\S*)\s/i);
    const result2 = /[\r\n]DATA\s(\S*)\s/i.exec(data.substr(result1 - 1));
    const pcdHeader = {};
    pcdHeader.data = result2 && result2[1];
    if (result2 !== null) {
      pcdHeader.headerLen = (result2 && result2[0].length) + result1;
    }
    pcdHeader.str = data.substr(0, pcdHeader.headerLen);
    pcdHeader.str = pcdHeader.str.replace(/\#.*/gi, "");
    pcdHeader.version = /VERSION (.*)/i.exec(pcdHeader.str);
    pcdHeader.fields = /FIELDS (.*)/i.exec(pcdHeader.str);
    pcdHeader.size = /SIZE (.*)/i.exec(pcdHeader.str);
    pcdHeader.type = /TYPE (.*)/i.exec(pcdHeader.str);
    pcdHeader.count = /COUNT (.*)/i.exec(pcdHeader.str);
    pcdHeader.width = /WIDTH (.*)/i.exec(pcdHeader.str);
    pcdHeader.height = /HEIGHT (.*)/i.exec(pcdHeader.str);
    pcdHeader.viewpoint = /VIEWPOINT (.*)/i.exec(pcdHeader.str);
    pcdHeader.points = /POINTS (.*)/i.exec(pcdHeader.str);
    if (pcdHeader.version !== null) {
      pcdHeader.version = parseFloat(pcdHeader.version[1]);
    }
    if (pcdHeader.fields !== null) {
      pcdHeader.fields = pcdHeader.fields[1].split(" ");
    }
    if (pcdHeader.type !== null) {
      pcdHeader.type = pcdHeader.type[1].split(" ");
    }
    if (pcdHeader.width !== null) {
      pcdHeader.width = parseInt(pcdHeader.width[1], 10);
    }
    if (pcdHeader.height !== null) {
      pcdHeader.height = parseInt(pcdHeader.height[1], 10);
    }
    if (pcdHeader.viewpoint !== null) {
      pcdHeader.viewpoint = pcdHeader.viewpoint[1];
    }
    if (pcdHeader.points !== null) {
      pcdHeader.points = parseInt(pcdHeader.points[1], 10);
    }
    if (pcdHeader.points === null && typeof pcdHeader.width === "number" && typeof pcdHeader.height === "number") {
      pcdHeader.points = pcdHeader.width * pcdHeader.height;
    }
    if (pcdHeader.size !== null) {
      pcdHeader.size = pcdHeader.size[1].split(" ").map((x) => parseInt(x, 10));
    }
    if (pcdHeader.count !== null) {
      pcdHeader.count = pcdHeader.count[1].split(" ").map((x) => parseInt(x, 10));
    } else {
      pcdHeader.count = [];
      if (pcdHeader.fields !== null) {
        for (let i = 0; i < pcdHeader.fields.length; i++) {
          pcdHeader.count.push(1);
        }
      }
    }
    pcdHeader.offset = {};
    let sizeSum = 0;
    if (pcdHeader.fields !== null && pcdHeader.size !== null) {
      for (let i = 0; i < pcdHeader.fields.length; i++) {
        if (pcdHeader.data === "ascii") {
          pcdHeader.offset[pcdHeader.fields[i]] = i;
        } else {
          pcdHeader.offset[pcdHeader.fields[i]] = sizeSum;
          sizeSum += pcdHeader.size[i];
        }
      }
    }
    pcdHeader.rowSize = sizeSum;
    return pcdHeader;
  }
  function parsePCDASCII(pcdHeader, textData) {
    const position = [];
    const normal = [];
    const color = [];
    const intensity = [];
    const label = [];
    const offset = pcdHeader.offset;
    const pcdData = textData.substr(pcdHeader.headerLen);
    const lines = pcdData.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] !== "") {
        const line = lines[i].split(" ");
        if (offset.x !== void 0) {
          position.push(parseFloat(line[offset.x]));
          position.push(parseFloat(line[offset.y]));
          position.push(parseFloat(line[offset.z]));
        }
        if (offset.rgb !== void 0) {
          const floatValue = parseFloat(line[offset.rgb]);
          const binaryColor = new Float32Array([floatValue]);
          const dataview = new DataView(binaryColor.buffer, 0);
          color.push(dataview.getUint8(0));
          color.push(dataview.getUint8(1));
          color.push(dataview.getUint8(2));
        }
        if (offset.normal_x !== void 0) {
          normal.push(parseFloat(line[offset.normal_x]));
          normal.push(parseFloat(line[offset.normal_y]));
          normal.push(parseFloat(line[offset.normal_z]));
        }
        if (offset.intensity !== void 0) {
          intensity.push(parseFloat(line[offset.intensity]));
        }
        if (offset.label !== void 0) {
          label.push(parseInt(line[offset.label]));
        }
      }
    }
    return { position, normal, color };
  }
  function parsePCDBinary(pcdHeader, data) {
    const position = [];
    const normal = [];
    const color = [];
    const intensity = [];
    const label = [];
    const dataview = new DataView(data, pcdHeader.headerLen);
    const offset = pcdHeader.offset;
    for (let i = 0, row = 0; i < pcdHeader.points; i++, row += pcdHeader.rowSize) {
      if (offset.x !== void 0) {
        position.push(dataview.getFloat32(row + offset.x, LITTLE_ENDIAN));
        position.push(dataview.getFloat32(row + offset.y, LITTLE_ENDIAN));
        position.push(dataview.getFloat32(row + offset.z, LITTLE_ENDIAN));
      }
      if (offset.rgb !== void 0) {
        color.push(dataview.getUint8(row + offset.rgb + 0));
        color.push(dataview.getUint8(row + offset.rgb + 1));
        color.push(dataview.getUint8(row + offset.rgb + 2));
      }
      if (offset.normal_x !== void 0) {
        normal.push(dataview.getFloat32(row + offset.normal_x, LITTLE_ENDIAN));
        normal.push(dataview.getFloat32(row + offset.normal_y, LITTLE_ENDIAN));
        normal.push(dataview.getFloat32(row + offset.normal_z, LITTLE_ENDIAN));
      }
      if (offset.intensity !== void 0) {
        intensity.push(dataview.getFloat32(row + offset.intensity, LITTLE_ENDIAN));
      }
      if (offset.label !== void 0) {
        label.push(dataview.getInt32(row + offset.label, LITTLE_ENDIAN));
      }
    }
    return { position, normal, color, intensity, label };
  }
  function parsePCDBinaryCompressed(pcdHeader, data) {
    const position = [];
    const normal = [];
    const color = [];
    const intensity = [];
    const label = [];
    const sizes = new Uint32Array(data.slice(pcdHeader.headerLen, pcdHeader.headerLen + 8));
    const compressedSize = sizes[0];
    const decompressedSize = sizes[1];
    const decompressed = decompressLZF(new Uint8Array(data, pcdHeader.headerLen + 8, compressedSize), decompressedSize);
    const dataview = new DataView(decompressed.buffer);
    const offset = pcdHeader.offset;
    for (let i = 0; i < pcdHeader.points; i++) {
      if (offset.x !== void 0) {
        position.push(dataview.getFloat32(pcdHeader.points * offset.x + pcdHeader.size[0] * i, LITTLE_ENDIAN));
        position.push(dataview.getFloat32(pcdHeader.points * offset.y + pcdHeader.size[1] * i, LITTLE_ENDIAN));
        position.push(dataview.getFloat32(pcdHeader.points * offset.z + pcdHeader.size[2] * i, LITTLE_ENDIAN));
      }
      if (offset.rgb !== void 0) {
        color.push(dataview.getUint8(pcdHeader.points * offset.rgb + pcdHeader.size[3] * i + 0) / 255);
        color.push(dataview.getUint8(pcdHeader.points * offset.rgb + pcdHeader.size[3] * i + 1) / 255);
        color.push(dataview.getUint8(pcdHeader.points * offset.rgb + pcdHeader.size[3] * i + 2) / 255);
      }
      if (offset.normal_x !== void 0) {
        normal.push(dataview.getFloat32(pcdHeader.points * offset.normal_x + pcdHeader.size[4] * i, LITTLE_ENDIAN));
        normal.push(dataview.getFloat32(pcdHeader.points * offset.normal_y + pcdHeader.size[5] * i, LITTLE_ENDIAN));
        normal.push(dataview.getFloat32(pcdHeader.points * offset.normal_z + pcdHeader.size[6] * i, LITTLE_ENDIAN));
      }
      if (offset.intensity !== void 0) {
        const intensityIndex = pcdHeader.fields.indexOf("intensity");
        intensity.push(dataview.getFloat32(pcdHeader.points * offset.intensity + pcdHeader.size[intensityIndex] * i, LITTLE_ENDIAN));
      }
      if (offset.label !== void 0) {
        const labelIndex = pcdHeader.fields.indexOf("label");
        label.push(dataview.getInt32(pcdHeader.points * offset.label + pcdHeader.size[labelIndex] * i, LITTLE_ENDIAN));
      }
    }
    return {
      position,
      normal,
      color,
      intensity,
      label
    };
  }

  // src/pcd-loader.ts
  var VERSION = true ? "4.0.0-alpha.7" : "latest";
  var PCDLoader = {
    name: "PCD (Point Cloud Data)",
    id: "pcd",
    module: "pcd",
    version: VERSION,
    worker: true,
    extensions: ["pcd"],
    mimeTypes: ["text/plain"],
    options: {
      pcd: {}
    }
  };

  // src/index.ts
  var PCDLoader2 = {
    ...PCDLoader,
    parse: async (arrayBuffer) => parsePCD(arrayBuffer),
    parseSync: parsePCD
  };

  // src/workers/pcd-worker.ts
  createLoaderWorker(PCDLoader2);
})();
/** Parse compressed PCD data in in binary_compressed form ( https://pointclouds.org/documentation/tutorials/pcd_file_format.html)
 * from https://github.com/mrdoob/three.js/blob/master/examples/jsm/loaders/PCDLoader.js
 * @license MIT (http://opensource.org/licenses/MIT)
 * @param pcdHeader
 * @param data
 * @returns [attributes]
 */
