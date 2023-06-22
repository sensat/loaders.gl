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

  // ../loader-utils/src/lib/iterators/text-iterators.ts
  async function* makeTextDecoderIterator(arrayBufferIterator, options = {}) {
    const textDecoder = new TextDecoder(void 0, options);
    for await (const arrayBuffer of arrayBufferIterator) {
      yield typeof arrayBuffer === "string" ? arrayBuffer : textDecoder.decode(arrayBuffer, { stream: true });
    }
  }
  async function* makeLineIterator(textIterator) {
    let previous = "";
    for await (const textChunk of textIterator) {
      previous += textChunk;
      let eolIndex;
      while ((eolIndex = previous.indexOf("\n")) >= 0) {
        const line = previous.slice(0, eolIndex + 1);
        previous = previous.slice(eolIndex + 1);
        yield line;
      }
    }
    if (previous.length > 0) {
      yield previous;
    }
  }

  // ../loader-utils/src/lib/iterators/async-iteration.ts
  async function forEach(iterator, visitor) {
    while (true) {
      const { done, value } = await iterator.next();
      if (done) {
        iterator.return();
        return;
      }
      const cancel = visitor(value);
      if (cancel) {
        return;
      }
    }
  }

  // src/ply-loader.ts
  var VERSION = true ? "4.0.0-alpha.7" : "latest";
  var PLYLoader = {
    name: "PLY",
    id: "ply",
    module: "ply",
    version: VERSION,
    worker: true,
    extensions: ["ply"],
    mimeTypes: ["text/plain", "application/octet-stream"],
    text: true,
    binary: true,
    tests: ["ply"],
    options: {
      ply: {}
    }
  };

  // ../schema/src/lib/table/simple-table/data-type.ts
  function getDataTypeFromTypedArray(array) {
    switch (array.constructor) {
      case Int8Array:
        return "int8";
      case Uint8Array:
      case Uint8ClampedArray:
        return "uint8";
      case Int16Array:
        return "int16";
      case Uint16Array:
        return "uint16";
      case Int32Array:
        return "int32";
      case Uint32Array:
        return "uint32";
      case Float32Array:
        return "float32";
      case Float64Array:
        return "float64";
      default:
        return "null";
    }
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

  // ../schema/src/lib/mesh/deduce-mesh-schema.ts
  function deduceMeshSchema(attributes, metadata = {}) {
    const fields = deduceMeshFields(attributes);
    return { fields, metadata };
  }
  function deduceMeshField(name, attribute, optionalMetadata) {
    const type = getDataTypeFromTypedArray(attribute.value);
    const metadata = optionalMetadata ? optionalMetadata : makeMeshAttributeMetadata(attribute);
    return {
      name,
      type: { type: "fixed-size-list", listSize: attribute.size, children: [{ name: "value", type }] },
      nullable: false,
      metadata
    };
  }
  function deduceMeshFields(attributes) {
    const fields = [];
    for (const attributeName in attributes) {
      const attribute = attributes[attributeName];
      fields.push(deduceMeshField(attributeName, attribute));
    }
    return fields;
  }
  function makeMeshAttributeMetadata(attribute) {
    const result = {};
    if ("byteOffset" in attribute) {
      result.byteOffset = attribute.byteOffset.toString(10);
    }
    if ("byteStride" in attribute) {
      result.byteStride = attribute.byteStride.toString(10);
    }
    if ("normalized" in attribute) {
      result.normalized = attribute.normalized.toString();
    }
    return result;
  }

  // src/lib/get-ply-schema.ts
  function getPLYSchema(plyHeader, attributes) {
    const metadata = makeMetadataFromPlyHeader(plyHeader);
    const schema = deduceMeshSchema(attributes, metadata);
    return schema;
  }
  function makeMetadataFromPlyHeader(plyHeader) {
    const metadata = {};
    metadata.ply_comments = JSON.stringify(plyHeader.comments);
    metadata.ply_elements = JSON.stringify(plyHeader.elements);
    if (plyHeader.format !== void 0) {
      metadata.ply_format = plyHeader.format;
    }
    if (plyHeader.version !== void 0) {
      metadata.ply_version = plyHeader.version;
    }
    if (plyHeader.headerLength !== void 0) {
      metadata.ply_headerLength = plyHeader.headerLength.toString(10);
    }
    return metadata;
  }

  // src/lib/normalize-ply.ts
  function normalizePLY(plyHeader, plyAttributes, options) {
    const attributes = getMeshAttributes(plyAttributes);
    const boundingBox = getMeshBoundingBox(attributes);
    const vertexCount = plyAttributes.indices.length || plyAttributes.vertices.length / 3;
    const isTriangles = plyAttributes.indices && plyAttributes.indices.length > 0;
    const mode = isTriangles ? 4 : 0;
    const topology = isTriangles ? "triangle-list" : "point-list";
    const schema = getPLYSchema(plyHeader, attributes);
    const plyMesh = {
      loader: "ply",
      loaderData: plyHeader,
      header: {
        vertexCount,
        boundingBox
      },
      schema,
      attributes,
      indices: { value: new Uint32Array(0), size: 0 },
      mode,
      topology
    };
    if (plyAttributes.indices.length > 0) {
      plyMesh.indices = { value: new Uint32Array(plyAttributes.indices), size: 1 };
    }
    return plyMesh;
  }
  function getMeshAttributes(attributes) {
    const accessors = {};
    for (const attributeName of Object.keys(attributes)) {
      switch (attributeName) {
        case "vertices":
          if (attributes.vertices.length > 0) {
            accessors.POSITION = { value: new Float32Array(attributes.vertices), size: 3 };
          }
          break;
        case "normals":
          if (attributes.normals.length > 0) {
            accessors.NORMAL = { value: new Float32Array(attributes.normals), size: 3 };
          }
          break;
        case "uvs":
          if (attributes.uvs.length > 0) {
            accessors.TEXCOORD_0 = { value: new Float32Array(attributes.uvs), size: 2 };
          }
          break;
        case "colors":
          if (attributes.colors.length > 0) {
            accessors.COLOR_0 = { value: new Uint8Array(attributes.colors), size: 3, normalized: true };
          }
          break;
        case "indices":
          break;
        default:
          if (attributes[attributeName].length > 0) {
            accessors[attributeName] = { value: new Float32Array(attributes[attributeName]), size: 1 };
          }
          break;
      }
    }
    return accessors;
  }

  // src/lib/parse-ply.ts
  function parsePLY(data, options = {}) {
    let header;
    let attributes;
    if (data instanceof ArrayBuffer) {
      const text = new TextDecoder().decode(data);
      header = parseHeader(text, options);
      attributes = header.format === "ascii" ? parseASCII(text, header) : parseBinary(data, header);
    } else {
      header = parseHeader(data, options);
      attributes = parseASCII(data, header);
    }
    return normalizePLY(header, attributes);
  }
  function parseHeader(data, options) {
    const PLY_HEADER_PATTERN = /ply([\s\S]*)end_header\s/;
    let headerText = "";
    let headerLength = 0;
    const result = PLY_HEADER_PATTERN.exec(data);
    if (result !== null) {
      headerText = result[1];
      headerLength = result[0].length;
    }
    const lines = headerText.split("\n");
    const header = parseHeaderLines(lines, headerLength, options);
    return header;
  }
  function parseHeaderLines(lines, headerLength, options) {
    const header = {
      comments: [],
      elements: [],
      headerLength
    };
    let lineType;
    let lineValues;
    let currentElement2 = null;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      line = line.trim();
      if (line === "") {
        continue;
      }
      lineValues = line.split(/\s+/);
      lineType = lineValues.shift();
      line = lineValues.join(" ");
      switch (lineType) {
        case "format":
          header.format = lineValues[0];
          header.version = lineValues[1];
          break;
        case "comment":
          header.comments.push(line);
          break;
        case "element":
          if (currentElement2) {
            header.elements.push(currentElement2);
          }
          currentElement2 = {
            name: lineValues[0],
            count: parseInt(lineValues[1], 10),
            properties: []
          };
          break;
        case "property":
          if (currentElement2) {
            const property = makePLYElementProperty(lineValues);
            if (options?.propertyNameMapping && property.name in options?.propertyNameMapping) {
              property.name = options?.propertyNameMapping[property.name];
            }
            currentElement2.properties.push(property);
          }
          break;
        default:
          console.log("unhandled", lineType, lineValues);
      }
    }
    if (currentElement2) {
      header.elements.push(currentElement2);
    }
    return header;
  }
  function getPLYAttributes(header) {
    const attributes = {
      indices: [],
      vertices: [],
      normals: [],
      uvs: [],
      colors: []
    };
    for (const element of header.elements) {
      if (element.name === "vertex") {
        for (const property of element.properties) {
          switch (property.name) {
            case "x":
            case "y":
            case "z":
            case "nx":
            case "ny":
            case "nz":
            case "s":
            case "t":
            case "red":
            case "green":
            case "blue":
              break;
            default:
              attributes[property.name] = [];
              break;
          }
        }
      }
    }
    return attributes;
  }
  function makePLYElementProperty(propertyValues) {
    const type = propertyValues[0];
    switch (type) {
      case "list":
        return {
          type,
          name: propertyValues[3],
          countType: propertyValues[1],
          itemType: propertyValues[2]
        };
      default:
        return {
          type,
          name: propertyValues[1]
        };
    }
  }
  function parseASCIINumber(n, type) {
    switch (type) {
      case "char":
      case "uchar":
      case "short":
      case "ushort":
      case "int":
      case "uint":
      case "int8":
      case "uint8":
      case "int16":
      case "uint16":
      case "int32":
      case "uint32":
        return parseInt(n, 10);
      case "float":
      case "double":
      case "float32":
      case "float64":
        return parseFloat(n);
      default:
        throw new Error(type);
    }
  }
  function parsePLYElement(properties, line) {
    const values = line.split(/\s+/);
    const element = {};
    for (let i = 0; i < properties.length; i++) {
      if (properties[i].type === "list") {
        const list = [];
        const n = parseASCIINumber(values.shift(), properties[i].countType);
        for (let j = 0; j < n; j++) {
          list.push(parseASCIINumber(values.shift(), properties[i].itemType));
        }
        element[properties[i].name] = list;
      } else {
        element[properties[i].name] = parseASCIINumber(values.shift(), properties[i].type);
      }
    }
    return element;
  }
  function parseASCII(data, header) {
    const attributes = getPLYAttributes(header);
    let result;
    const patternBody = /end_header\s([\s\S]*)$/;
    let body = "";
    if ((result = patternBody.exec(data)) !== null) {
      body = result[1];
    }
    const lines = body.split("\n");
    let currentElement2 = 0;
    let currentElementCount = 0;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      line = line.trim();
      if (line !== "") {
        if (currentElementCount >= header.elements[currentElement2].count) {
          currentElement2++;
          currentElementCount = 0;
        }
        const element = parsePLYElement(header.elements[currentElement2].properties, line);
        handleElement(attributes, header.elements[currentElement2].name, element);
        currentElementCount++;
      }
    }
    return attributes;
  }
  function handleElement(buffer, elementName, element = {}) {
    if (elementName === "vertex") {
      for (const propertyName of Object.keys(element)) {
        switch (propertyName) {
          case "x":
            buffer.vertices.push(element.x, element.y, element.z);
            break;
          case "y":
          case "z":
            break;
          case "nx":
            if ("nx" in element && "ny" in element && "nz" in element) {
              buffer.normals.push(element.nx, element.ny, element.nz);
            }
            break;
          case "ny":
          case "nz":
            break;
          case "s":
            if ("s" in element && "t" in element) {
              buffer.uvs.push(element.s, element.t);
            }
            break;
          case "t":
            break;
          case "red":
            if ("red" in element && "green" in element && "blue" in element) {
              buffer.colors.push(element.red, element.green, element.blue);
            }
            break;
          case "green":
          case "blue":
            break;
          default:
            buffer[propertyName].push(element[propertyName]);
        }
      }
    } else if (elementName === "face") {
      const vertexIndices = element.vertex_indices || element.vertex_index;
      if (vertexIndices.length === 3) {
        buffer.indices.push(vertexIndices[0], vertexIndices[1], vertexIndices[2]);
      } else if (vertexIndices.length === 4) {
        buffer.indices.push(vertexIndices[0], vertexIndices[1], vertexIndices[3]);
        buffer.indices.push(vertexIndices[1], vertexIndices[2], vertexIndices[3]);
      }
    }
  }
  function binaryRead(dataview, at, type, littleEndian) {
    switch (type) {
      case "int8":
      case "char":
        return [dataview.getInt8(at), 1];
      case "uint8":
      case "uchar":
        return [dataview.getUint8(at), 1];
      case "int16":
      case "short":
        return [dataview.getInt16(at, littleEndian), 2];
      case "uint16":
      case "ushort":
        return [dataview.getUint16(at, littleEndian), 2];
      case "int32":
      case "int":
        return [dataview.getInt32(at, littleEndian), 4];
      case "uint32":
      case "uint":
        return [dataview.getUint32(at, littleEndian), 4];
      case "float32":
      case "float":
        return [dataview.getFloat32(at, littleEndian), 4];
      case "float64":
      case "double":
        return [dataview.getFloat64(at, littleEndian), 8];
      default:
        throw new Error(type);
    }
  }
  function binaryReadElement(dataview, at, properties, littleEndian) {
    const element = {};
    let result;
    let read = 0;
    for (let i = 0; i < properties.length; i++) {
      if (properties[i].type === "list") {
        const list = [];
        result = binaryRead(dataview, at + read, properties[i].countType, littleEndian);
        const n = result[0];
        read += result[1];
        for (let j = 0; j < n; j++) {
          result = binaryRead(dataview, at + read, properties[i].itemType, littleEndian);
          list.push(result[0]);
          read += result[1];
        }
        element[properties[i].name] = list;
      } else {
        result = binaryRead(dataview, at + read, properties[i].type, littleEndian);
        element[properties[i].name] = result[0];
        read += result[1];
      }
    }
    return [element, read];
  }
  function parseBinary(data, header) {
    const attributes = getPLYAttributes(header);
    const littleEndian = header.format === "binary_little_endian";
    const body = new DataView(data, header.headerLength);
    let result;
    let loc = 0;
    for (let currentElement2 = 0; currentElement2 < header.elements.length; currentElement2++) {
      const count = header.elements[currentElement2].count;
      for (let currentElementCount = 0; currentElementCount < count; currentElementCount++) {
        result = binaryReadElement(body, loc, header.elements[currentElement2].properties, littleEndian);
        loc += result[1];
        const element = result[0];
        handleElement(attributes, header.elements[currentElement2].name, element);
      }
    }
    return attributes;
  }

  // src/lib/parse-ply-in-batches.ts
  var currentElement;
  async function* parsePLYInBatches(iterator, options) {
    const lineIterator = makeLineIterator(makeTextDecoderIterator(iterator));
    const header = await parsePLYHeader(lineIterator, options);
    let attributes;
    switch (header.format) {
      case "ascii":
        attributes = await parseASCII2(lineIterator, header);
        break;
      default:
        throw new Error("Binary PLY can not yet be parsed in streaming mode");
    }
    yield normalizePLY(header, attributes, options);
  }
  async function parsePLYHeader(lineIterator, options) {
    const header = {
      comments: [],
      elements: []
    };
    await forEach(lineIterator, (line) => {
      line = line.trim();
      if (line === "end_header") {
        return true;
      }
      if (line === "") {
        return false;
      }
      const lineValues = line.split(/\s+/);
      const lineType = lineValues.shift();
      line = lineValues.join(" ");
      switch (lineType) {
        case "ply":
          break;
        case "format":
          header.format = lineValues[0];
          header.version = lineValues[1];
          break;
        case "comment":
          header.comments.push(line);
          break;
        case "element":
          if (currentElement) {
            header.elements.push(currentElement);
          }
          currentElement = {
            name: lineValues[0],
            count: parseInt(lineValues[1], 10),
            properties: []
          };
          break;
        case "property":
          const property = makePLYElementProperty2(lineValues, options.propertyNameMapping);
          currentElement.properties.push(property);
          break;
        default:
          console.log("unhandled", lineType, lineValues);
      }
      return false;
    });
    if (currentElement) {
      header.elements.push(currentElement);
    }
    return header;
  }
  function makePLYElementProperty2(propertyValues, propertyNameMapping) {
    const type = propertyValues[0];
    switch (type) {
      case "list":
        return {
          type,
          name: propertyValues[3],
          countType: propertyValues[1],
          itemType: propertyValues[2]
        };
      default:
        return {
          type,
          name: propertyValues[1]
        };
    }
  }
  async function parseASCII2(lineIterator, header) {
    const attributes = {
      indices: [],
      vertices: [],
      normals: [],
      uvs: [],
      colors: []
    };
    let currentElement2 = 0;
    let currentElementCount = 0;
    for await (let line of lineIterator) {
      line = line.trim();
      if (line !== "") {
        if (currentElementCount >= header.elements[currentElement2].count) {
          currentElement2++;
          currentElementCount = 0;
        }
        const element = parsePLYElement2(header.elements[currentElement2].properties, line);
        handleElement2(attributes, header.elements[currentElement2].name, element);
        currentElementCount++;
      }
    }
    return attributes;
  }
  function parseASCIINumber2(n, type) {
    switch (type) {
      case "char":
      case "uchar":
      case "short":
      case "ushort":
      case "int":
      case "uint":
      case "int8":
      case "uint8":
      case "int16":
      case "uint16":
      case "int32":
      case "uint32":
        return parseInt(n, 10);
      case "float":
      case "double":
      case "float32":
      case "float64":
        return parseFloat(n);
      default:
        throw new Error(type);
    }
  }
  function parsePLYElement2(properties, line) {
    const values = line.split(/\s+/);
    const element = {};
    for (let i = 0; i < properties.length; i++) {
      if (properties[i].type === "list") {
        const list = [];
        const n = parseASCIINumber2(values.shift(), properties[i].countType);
        for (let j = 0; j < n; j++) {
          list.push(parseASCIINumber2(values.shift(), properties[i].itemType));
        }
        element[properties[i].name] = list;
      } else {
        element[properties[i].name] = parseASCIINumber2(values.shift(), properties[i].type);
      }
    }
    return element;
  }
  function handleElement2(buffer, elementName, element = {}) {
    switch (elementName) {
      case "vertex":
        buffer.vertices.push(element.x, element.y, element.z);
        if ("nx" in element && "ny" in element && "nz" in element) {
          buffer.normals.push(element.nx, element.ny, element.nz);
        }
        if ("s" in element && "t" in element) {
          buffer.uvs.push(element.s, element.t);
        }
        if ("red" in element && "green" in element && "blue" in element) {
          buffer.colors.push(element.red / 255, element.green / 255, element.blue / 255);
        }
        break;
      case "face":
        const vertexIndices = element.vertex_indices || element.vertex_index;
        if (vertexIndices.length === 3) {
          buffer.indices.push(vertexIndices[0], vertexIndices[1], vertexIndices[2]);
        } else if (vertexIndices.length === 4) {
          buffer.indices.push(vertexIndices[0], vertexIndices[1], vertexIndices[3]);
          buffer.indices.push(vertexIndices[1], vertexIndices[2], vertexIndices[3]);
        }
        break;
      default:
        break;
    }
  }

  // src/index.ts
  var PLYLoader2 = {
    ...PLYLoader,
    parse: async (arrayBuffer, options) => parsePLY(arrayBuffer, options?.ply),
    parseTextSync: (arrayBuffer, options) => parsePLY(arrayBuffer, options?.ply),
    parseSync: (arrayBuffer, options) => parsePLY(arrayBuffer, options?.ply),
    parseInBatches: (arrayBuffer, options) => parsePLYInBatches(arrayBuffer, options?.ply)
  };

  // src/workers/ply-worker.ts
  createLoaderWorker(PLYLoader2);
})();
