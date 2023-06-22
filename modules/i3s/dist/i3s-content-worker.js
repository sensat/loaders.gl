(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // (disabled):../worker-utils/src/lib/node/require-utils.node
  var require_require_utils = __commonJS({
    "(disabled):../worker-utils/src/lib/node/require-utils.node"() {
    }
  });

  // ../loader-utils/src/lib/env-utils/assert.ts
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "loader assertion failed.");
    }
  }

  // ../loader-utils/src/lib/env-utils/globals.ts
  var globals = {
    self: typeof self !== "undefined" && self,
    window: typeof window !== "undefined" && window,
    global: typeof global !== "undefined" && global,
    document: typeof document !== "undefined" && document
  };
  var self_ = globals.self || globals.window || globals.global || {};
  var window_ = globals.window || globals.self || globals.global || {};
  var global_ = globals.global || globals.self || globals.window || {};
  var document_ = globals.document || {};
  var isBrowser = Boolean(typeof process !== "object" || String(process) !== "[object process]" || process.browser);
  var matches = typeof process !== "undefined" && process.version && /v([0-9]*)/.exec(process.version);
  var nodeVersion = matches && parseFloat(matches[1]) || 0;

  // ../worker-utils/src/lib/env-utils/version.ts
  var VERSION = true ? "4.0.0-alpha.7" : DEFAULT_VERSION;
  if (false) {
    console.error("loaders.gl: The __VERSION__ variable is not injected using babel plugin. Latest unstable workers would be fetched from the CDN.");
  }

  // ../worker-utils/src/lib/env-utils/assert.ts
  function assert2(condition, message) {
    if (!condition) {
      throw new Error(message || "loaders.gl assertion failed.");
    }
  }

  // ../worker-utils/src/lib/env-utils/globals.ts
  var globals2 = {
    self: typeof self !== "undefined" && self,
    window: typeof window !== "undefined" && window,
    global: typeof global !== "undefined" && global,
    document: typeof document !== "undefined" && document
  };
  var self_2 = globals2.self || globals2.window || globals2.global || {};
  var window_2 = globals2.window || globals2.self || globals2.global || {};
  var global_2 = globals2.global || globals2.self || globals2.window || {};
  var document_2 = globals2.document || {};
  var isBrowser2 = typeof process !== "object" || String(process) !== "[object process]" || process.browser;
  var isWorker = typeof importScripts === "function";
  var isMobile = typeof window !== "undefined" && typeof window.orientation !== "undefined";
  var matches2 = typeof process !== "undefined" && process.version && /v([0-9]*)/.exec(process.version);
  var nodeVersion2 = matches2 && parseFloat(matches2[1]) || 0;

  // ../worker-utils/src/lib/worker-farm/worker-job.ts
  var WorkerJob = class {
    constructor(jobName, workerThread) {
      this.isRunning = true;
      this._resolve = () => {
      };
      this._reject = () => {
      };
      this.name = jobName;
      this.workerThread = workerThread;
      this.result = new Promise((resolve2, reject) => {
        this._resolve = resolve2;
        this._reject = reject;
      });
    }
    postMessage(type, payload) {
      this.workerThread.postMessage({
        source: "loaders.gl",
        type,
        payload
      });
    }
    done(value) {
      assert2(this.isRunning);
      this.isRunning = false;
      this._resolve(value);
    }
    error(error) {
      assert2(this.isRunning);
      this.isRunning = false;
      this._reject(error);
    }
  };

  // ../worker-utils/src/lib/node/worker_threads-browser.ts
  var Worker2 = class {
    terminate() {
    }
  };

  // ../worker-utils/src/lib/worker-utils/get-loadable-worker-url.ts
  var workerURLCache = new Map();
  function getLoadableWorkerURL(props) {
    assert2(props.source && !props.url || !props.source && props.url);
    let workerURL = workerURLCache.get(props.source || props.url);
    if (!workerURL) {
      if (props.url) {
        workerURL = getLoadableWorkerURLFromURL(props.url);
        workerURLCache.set(props.url, workerURL);
      }
      if (props.source) {
        workerURL = getLoadableWorkerURLFromSource(props.source);
        workerURLCache.set(props.source, workerURL);
      }
    }
    assert2(workerURL);
    return workerURL;
  }
  function getLoadableWorkerURLFromURL(url) {
    if (!url.startsWith("http")) {
      return url;
    }
    const workerSource = buildScriptSource(url);
    return getLoadableWorkerURLFromSource(workerSource);
  }
  function getLoadableWorkerURLFromSource(workerSource) {
    const blob = new Blob([workerSource], { type: "application/javascript" });
    return URL.createObjectURL(blob);
  }
  function buildScriptSource(workerUrl) {
    return `try {
  importScripts('${workerUrl}');
} catch (error) {
  console.error(error);
  throw error;
}`;
  }

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

  // ../worker-utils/src/lib/worker-farm/worker-thread.ts
  var NOOP = () => {
  };
  var WorkerThread = class {
    constructor(props) {
      this.terminated = false;
      this._loadableURL = "";
      const { name, source, url } = props;
      assert2(source || url);
      this.name = name;
      this.source = source;
      this.url = url;
      this.onMessage = NOOP;
      this.onError = (error) => console.log(error);
      this.worker = isBrowser2 ? this._createBrowserWorker() : this._createNodeWorker();
    }
    static isSupported() {
      return typeof Worker !== "undefined" && isBrowser2 || typeof Worker2 !== "undefined" && !isBrowser2;
    }
    destroy() {
      this.onMessage = NOOP;
      this.onError = NOOP;
      this.worker.terminate();
      this.terminated = true;
    }
    get isRunning() {
      return Boolean(this.onMessage);
    }
    postMessage(data, transferList) {
      transferList = transferList || getTransferList(data);
      this.worker.postMessage(data, transferList);
    }
    _getErrorFromErrorEvent(event) {
      let message = "Failed to load ";
      message += `worker ${this.name} from ${this.url}. `;
      if (event.message) {
        message += `${event.message} in `;
      }
      if (event.lineno) {
        message += `:${event.lineno}:${event.colno}`;
      }
      return new Error(message);
    }
    _createBrowserWorker() {
      this._loadableURL = getLoadableWorkerURL({ source: this.source, url: this.url });
      const worker = new Worker(this._loadableURL, { name: this.name });
      worker.onmessage = (event) => {
        if (!event.data) {
          this.onError(new Error("No data received"));
        } else {
          this.onMessage(event.data);
        }
      };
      worker.onerror = (error) => {
        this.onError(this._getErrorFromErrorEvent(error));
        this.terminated = true;
      };
      worker.onmessageerror = (event) => console.error(event);
      return worker;
    }
    _createNodeWorker() {
      let worker;
      if (this.url) {
        const absolute = this.url.includes(":/") || this.url.startsWith("/");
        const url = absolute ? this.url : `./${this.url}`;
        worker = new Worker2(url, { eval: false });
      } else if (this.source) {
        worker = new Worker2(this.source, { eval: true });
      } else {
        throw new Error("no worker");
      }
      worker.on("message", (data) => {
        this.onMessage(data);
      });
      worker.on("error", (error) => {
        this.onError(error);
      });
      worker.on("exit", (code) => {
      });
      return worker;
    }
  };

  // ../worker-utils/src/lib/worker-farm/worker-pool.ts
  var WorkerPool = class {
    constructor(props) {
      this.name = "unnamed";
      this.maxConcurrency = 1;
      this.maxMobileConcurrency = 1;
      this.onDebug = () => {
      };
      this.reuseWorkers = true;
      this.props = {};
      this.jobQueue = [];
      this.idleQueue = [];
      this.count = 0;
      this.isDestroyed = false;
      this.source = props.source;
      this.url = props.url;
      this.setProps(props);
    }
    static isSupported() {
      return WorkerThread.isSupported();
    }
    destroy() {
      this.idleQueue.forEach((worker) => worker.destroy());
      this.isDestroyed = true;
    }
    setProps(props) {
      this.props = { ...this.props, ...props };
      if (props.name !== void 0) {
        this.name = props.name;
      }
      if (props.maxConcurrency !== void 0) {
        this.maxConcurrency = props.maxConcurrency;
      }
      if (props.maxMobileConcurrency !== void 0) {
        this.maxMobileConcurrency = props.maxMobileConcurrency;
      }
      if (props.reuseWorkers !== void 0) {
        this.reuseWorkers = props.reuseWorkers;
      }
      if (props.onDebug !== void 0) {
        this.onDebug = props.onDebug;
      }
    }
    async startJob(name, onMessage2 = (job, type, data) => job.done(data), onError = (job, error) => job.error(error)) {
      const startPromise = new Promise((onStart) => {
        this.jobQueue.push({ name, onMessage: onMessage2, onError, onStart });
        return this;
      });
      this._startQueuedJob();
      return await startPromise;
    }
    async _startQueuedJob() {
      if (!this.jobQueue.length) {
        return;
      }
      const workerThread = this._getAvailableWorker();
      if (!workerThread) {
        return;
      }
      const queuedJob = this.jobQueue.shift();
      if (queuedJob) {
        this.onDebug({
          message: "Starting job",
          name: queuedJob.name,
          workerThread,
          backlog: this.jobQueue.length
        });
        const job = new WorkerJob(queuedJob.name, workerThread);
        workerThread.onMessage = (data) => queuedJob.onMessage(job, data.type, data.payload);
        workerThread.onError = (error) => queuedJob.onError(job, error);
        queuedJob.onStart(job);
        try {
          await job.result;
        } finally {
          this.returnWorkerToQueue(workerThread);
        }
      }
    }
    returnWorkerToQueue(worker) {
      const shouldDestroyWorker = !isBrowser2 || this.isDestroyed || !this.reuseWorkers || this.count > this._getMaxConcurrency();
      if (shouldDestroyWorker) {
        worker.destroy();
        this.count--;
      } else {
        this.idleQueue.push(worker);
      }
      if (!this.isDestroyed) {
        this._startQueuedJob();
      }
    }
    _getAvailableWorker() {
      if (this.idleQueue.length > 0) {
        return this.idleQueue.shift() || null;
      }
      if (this.count < this._getMaxConcurrency()) {
        this.count++;
        const name = `${this.name.toLowerCase()} (#${this.count} of ${this.maxConcurrency})`;
        return new WorkerThread({ name, source: this.source, url: this.url });
      }
      return null;
    }
    _getMaxConcurrency() {
      return isMobile ? this.maxMobileConcurrency : this.maxConcurrency;
    }
  };

  // ../worker-utils/src/lib/worker-farm/worker-farm.ts
  var DEFAULT_PROPS = {
    maxConcurrency: 3,
    maxMobileConcurrency: 1,
    reuseWorkers: true,
    onDebug: () => {
    }
  };
  var WorkerFarm = class {
    constructor(props) {
      this.workerPools = new Map();
      this.props = { ...DEFAULT_PROPS };
      this.setProps(props);
      this.workerPools = new Map();
    }
    static isSupported() {
      return WorkerThread.isSupported();
    }
    static getWorkerFarm(props = {}) {
      WorkerFarm._workerFarm = WorkerFarm._workerFarm || new WorkerFarm({});
      WorkerFarm._workerFarm.setProps(props);
      return WorkerFarm._workerFarm;
    }
    destroy() {
      for (const workerPool of this.workerPools.values()) {
        workerPool.destroy();
      }
      this.workerPools = new Map();
    }
    setProps(props) {
      this.props = { ...this.props, ...props };
      for (const workerPool of this.workerPools.values()) {
        workerPool.setProps(this._getWorkerPoolProps());
      }
    }
    getWorkerPool(options) {
      const { name, source, url } = options;
      let workerPool = this.workerPools.get(name);
      if (!workerPool) {
        workerPool = new WorkerPool({
          name,
          source,
          url
        });
        workerPool.setProps(this._getWorkerPoolProps());
        this.workerPools.set(name, workerPool);
      }
      return workerPool;
    }
    _getWorkerPoolProps() {
      return {
        maxConcurrency: this.props.maxConcurrency,
        maxMobileConcurrency: this.props.maxMobileConcurrency,
        reuseWorkers: this.props.reuseWorkers,
        onDebug: this.props.onDebug
      };
    }
  };

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
    static set onmessage(onMessage2) {
      function handleMessage(message) {
        const parentPort3 = getParentPort();
        const { type, payload } = parentPort3 ? message : message.data;
        onMessage2(type, payload);
      }
      const parentPort2 = getParentPort();
      if (parentPort2) {
        parentPort2.on("message", handleMessage);
        parentPort2.on("exit", () => console.debug("Node worker closing"));
      } else {
        globalThis.onmessage = handleMessage;
      }
    }
    static addEventListener(onMessage2) {
      let onMessageWrapper = onMessageWrapperMap.get(onMessage2);
      if (!onMessageWrapper) {
        onMessageWrapper = (message) => {
          if (!isKnownMessage(message)) {
            return;
          }
          const parentPort3 = getParentPort();
          const { type, payload } = parentPort3 ? message : message.data;
          onMessage2(type, payload);
        };
      }
      const parentPort2 = getParentPort();
      if (parentPort2) {
        console.error("not implemented");
      } else {
        globalThis.addEventListener("message", onMessageWrapper);
      }
    }
    static removeEventListener(onMessage2) {
      const onMessageWrapper = onMessageWrapperMap.get(onMessage2);
      onMessageWrapperMap.delete(onMessage2);
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

  // ../worker-utils/src/lib/worker-api/get-worker-url.ts
  var NPM_TAG = "beta";
  function getWorkerURL(worker, options = {}) {
    const workerOptions = options[worker.id] || {};
    const workerFile = isBrowser2 ? `${worker.id}-worker.js` : `${worker.id}-worker-node.js`;
    let url = workerOptions.workerUrl;
    if (!url && worker.id === "compression") {
      url = options.workerUrl;
    }
    if (options._workerType === "test") {
      url = `modules/${worker.module}/dist/${workerFile}`;
    }
    if (!url) {
      let version = worker.version;
      if (version === "latest") {
        version = NPM_TAG;
      }
      const versionTag = version ? `@${version}` : "";
      url = `https://unpkg.com/@loaders.gl/${worker.module}${versionTag}/dist/${workerFile}`;
    }
    assert2(url);
    return url;
  }

  // ../worker-utils/src/lib/worker-api/validate-worker-version.ts
  function validateWorkerVersion(worker, coreVersion = VERSION) {
    assert2(worker, "no worker provided");
    const workerVersion = worker.version;
    if (!coreVersion || !workerVersion) {
      return false;
    }
    return true;
  }

  // ../worker-utils/src/lib/library-utils/library-utils.ts
  var node = __toModule(require_require_utils());
  var LATEST = "beta";
  var VERSION2 = typeof VERSION !== "undefined" ? VERSION : LATEST;
  var loadLibraryPromises = {};
  async function loadLibrary(libraryUrl, moduleName = null, options = {}) {
    if (moduleName) {
      libraryUrl = getLibraryUrl(libraryUrl, moduleName, options);
    }
    loadLibraryPromises[libraryUrl] = loadLibraryPromises[libraryUrl] || loadLibraryFromFile(libraryUrl);
    return await loadLibraryPromises[libraryUrl];
  }
  function getLibraryUrl(library, moduleName, options) {
    if (library.startsWith("http")) {
      return library;
    }
    const modules = options.modules || {};
    if (modules[library]) {
      return modules[library];
    }
    if (!isBrowser2) {
      return `modules/${moduleName}/dist/libs/${library}`;
    }
    if (options.CDN) {
      assert2(options.CDN.startsWith("http"));
      return `${options.CDN}/${moduleName}@${VERSION2}/dist/libs/${library}`;
    }
    if (isWorker) {
      return `../src/libs/${library}`;
    }
    return `modules/${moduleName}/src/libs/${library}`;
  }
  async function loadLibraryFromFile(libraryUrl) {
    if (libraryUrl.endsWith("wasm")) {
      const response2 = await fetch(libraryUrl);
      return await response2.arrayBuffer();
    }
    if (!isBrowser2) {
      try {
        return node && node.requireFromFile && await node.requireFromFile(libraryUrl);
      } catch {
        return null;
      }
    }
    if (isWorker) {
      return importScripts(libraryUrl);
    }
    const response = await fetch(libraryUrl);
    const scriptSource = await response.text();
    return loadLibraryFromString(scriptSource, libraryUrl);
  }
  function loadLibraryFromString(scriptSource, id) {
    if (!isBrowser2) {
      return node.requireFromString && node.requireFromString(scriptSource, id);
    }
    if (isWorker) {
      eval.call(global_2, scriptSource);
      return null;
    }
    const script = document.createElement("script");
    script.id = id;
    try {
      script.appendChild(document.createTextNode(scriptSource));
    } catch (e2) {
      script.text = scriptSource;
    }
    document.body.appendChild(script);
    return null;
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
    return new Promise((resolve2, reject) => {
      const id = requestId++;
      const onMessage2 = (type, payload2) => {
        if (payload2.id !== id) {
          return;
        }
        switch (type) {
          case "done":
            WorkerBody.removeEventListener(onMessage2);
            resolve2(payload2.result);
            break;
          case "error":
            WorkerBody.removeEventListener(onMessage2);
            reject(payload2.error);
            break;
          default:
        }
      };
      WorkerBody.addEventListener(onMessage2);
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

  // ../loader-utils/src/lib/worker-loader-utils/parse-with-worker.ts
  function canParseWithWorker(loader, options) {
    if (!WorkerFarm.isSupported()) {
      return false;
    }
    if (!isBrowser2 && !options?._nodeWorkers) {
      return false;
    }
    return loader.worker && options?.worker;
  }
  async function parseWithWorker(loader, data, options, context, parseOnMainThread2) {
    const name = loader.id;
    const url = getWorkerURL(loader, options);
    const workerFarm = WorkerFarm.getWorkerFarm(options);
    const workerPool = workerFarm.getWorkerPool({ name, url });
    options = JSON.parse(JSON.stringify(options));
    context = JSON.parse(JSON.stringify(context || {}));
    const job = await workerPool.startJob("process-on-worker", onMessage.bind(null, parseOnMainThread2));
    job.postMessage("process", {
      input: data,
      options,
      context
    });
    const result = await job.result;
    return await result.result;
  }
  async function onMessage(parseOnMainThread2, job, type, payload) {
    switch (type) {
      case "done":
        job.done(payload);
        break;
      case "error":
        job.error(new Error(payload.error));
        break;
      case "process":
        const { id, input, options } = payload;
        try {
          const result = await parseOnMainThread2(input, options);
          job.postMessage("done", { id, result });
        } catch (error) {
          const message = error instanceof Error ? error.message : "unknown error";
          job.postMessage("error", { id, error: message });
        }
        break;
      default:
        console.warn(`parse-with-worker unknown message ${type}`);
    }
  }

  // ../loader-utils/src/lib/binary-utils/array-buffer-utils.ts
  function compareArrayBuffers(arrayBuffer1, arrayBuffer2, byteLength) {
    byteLength = byteLength || arrayBuffer1.byteLength;
    if (arrayBuffer1.byteLength < byteLength || arrayBuffer2.byteLength < byteLength) {
      return false;
    }
    const array1 = new Uint8Array(arrayBuffer1);
    const array2 = new Uint8Array(arrayBuffer2);
    for (let i2 = 0; i2 < array1.length; ++i2) {
      if (array1[i2] !== array2[i2]) {
        return false;
      }
    }
    return true;
  }
  function concatenateArrayBuffers(...sources) {
    const sourceArrays = sources.map((source2) => source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2);
    const byteLength = sourceArrays.reduce((length2, typedArray) => length2 + typedArray.byteLength, 0);
    const result = new Uint8Array(byteLength);
    let offset = 0;
    for (const sourceArray of sourceArrays) {
      result.set(sourceArray, offset);
      offset += sourceArray.byteLength;
    }
    return result.buffer;
  }

  // ../loader-utils/src/lib/iterators/async-iteration.ts
  async function concatenateArrayBuffersAsync(asyncIterator) {
    const arrayBuffers = [];
    for await (const chunk of asyncIterator) {
      arrayBuffers.push(chunk);
    }
    return concatenateArrayBuffers(...arrayBuffers);
  }

  // ../../node_modules/@babel/runtime/helpers/esm/typeof.js
  function _typeof(obj) {
    "@babel/helpers - typeof";
    return _typeof = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(obj2) {
      return typeof obj2;
    } : function(obj2) {
      return obj2 && typeof Symbol == "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    }, _typeof(obj);
  }

  // ../../node_modules/@babel/runtime/helpers/esm/toPrimitive.js
  function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null)
      return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== void 0) {
      var res = prim.call(input, hint || "default");
      if (_typeof(res) !== "object")
        return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }

  // ../../node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
  }

  // ../../node_modules/@babel/runtime/helpers/esm/defineProperty.js
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }

  // ../loader-utils/src/lib/path-utils/file-aliases.ts
  var pathPrefix = "";
  var fileAliases = {};
  function resolvePath(filename2) {
    for (const alias in fileAliases) {
      if (filename2.startsWith(alias)) {
        const replacement = fileAliases[alias];
        filename2 = filename2.replace(alias, replacement);
      }
    }
    if (!filename2.startsWith("http://") && !filename2.startsWith("https://")) {
      filename2 = `${pathPrefix}${filename2}`;
    }
    return filename2;
  }

  // ../loader-utils/src/lib/node/buffer.browser.ts
  function toArrayBuffer(buffer) {
    return buffer;
  }

  // ../loader-utils/src/lib/binary-utils/memory-conversion-utils.ts
  function isBuffer(value) {
    return value && typeof value === "object" && value.isBuffer;
  }
  function toArrayBuffer2(data) {
    if (isBuffer(data)) {
      return toArrayBuffer(data);
    }
    if (data instanceof ArrayBuffer) {
      return data;
    }
    if (ArrayBuffer.isView(data)) {
      if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
        return data.buffer;
      }
      return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    }
    if (typeof data === "string") {
      const text = data;
      const uint8Array = new TextEncoder().encode(text);
      return uint8Array.buffer;
    }
    if (data && typeof data === "object" && data._toArrayBuffer) {
      return data._toArrayBuffer();
    }
    throw new Error("toArrayBuffer");
  }

  // ../loader-utils/src/lib/path-utils/path.ts
  var path_exports = {};
  __export(path_exports, {
    dirname: () => dirname,
    filename: () => filename,
    join: () => join,
    resolve: () => resolve
  });

  // ../loader-utils/src/lib/path-utils/get-cwd.ts
  function getCWD() {
    if (typeof process !== "undefined" && typeof process.cwd !== "undefined") {
      return process.cwd();
    }
    const pathname = window.location?.pathname;
    return pathname?.slice(0, pathname.lastIndexOf("/") + 1) || "";
  }

  // ../loader-utils/src/lib/path-utils/path.ts
  function filename(url) {
    const slashIndex = url ? url.lastIndexOf("/") : -1;
    return slashIndex >= 0 ? url.substr(slashIndex + 1) : "";
  }
  function dirname(url) {
    const slashIndex = url ? url.lastIndexOf("/") : -1;
    return slashIndex >= 0 ? url.substr(0, slashIndex) : "";
  }
  function join(...parts) {
    const separator = "/";
    parts = parts.map((part, index) => {
      if (index) {
        part = part.replace(new RegExp(`^${separator}`), "");
      }
      if (index !== parts.length - 1) {
        part = part.replace(new RegExp(`${separator}$`), "");
      }
      return part;
    });
    return parts.join(separator);
  }
  function resolve(...components) {
    const paths = [];
    for (let _i = 0; _i < components.length; _i++) {
      paths[_i] = components[_i];
    }
    let resolvedPath = "";
    let resolvedAbsolute = false;
    let cwd;
    for (let i2 = paths.length - 1; i2 >= -1 && !resolvedAbsolute; i2--) {
      let path;
      if (i2 >= 0) {
        path = paths[i2];
      } else {
        if (cwd === void 0) {
          cwd = getCWD();
        }
        path = cwd;
      }
      if (path.length === 0) {
        continue;
      }
      resolvedPath = `${path}/${resolvedPath}`;
      resolvedAbsolute = path.charCodeAt(0) === SLASH;
    }
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
    if (resolvedAbsolute) {
      return `/${resolvedPath}`;
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    }
    return ".";
  }
  var SLASH = 47;
  var DOT = 46;
  function normalizeStringPosix(path, allowAboveRoot) {
    let res = "";
    let lastSlash = -1;
    let dots = 0;
    let code;
    let isAboveRoot = false;
    for (let i2 = 0; i2 <= path.length; ++i2) {
      if (i2 < path.length) {
        code = path.charCodeAt(i2);
      } else if (code === SLASH) {
        break;
      } else {
        code = SLASH;
      }
      if (code === SLASH) {
        if (lastSlash === i2 - 1 || dots === 1) {
        } else if (lastSlash !== i2 - 1 && dots === 2) {
          if (res.length < 2 || !isAboveRoot || res.charCodeAt(res.length - 1) !== DOT || res.charCodeAt(res.length - 2) !== DOT) {
            if (res.length > 2) {
              const start = res.length - 1;
              let j = start;
              for (; j >= 0; --j) {
                if (res.charCodeAt(j) === SLASH) {
                  break;
                }
              }
              if (j !== start) {
                res = j === -1 ? "" : res.slice(0, j);
                lastSlash = i2;
                dots = 0;
                isAboveRoot = false;
                continue;
              }
            } else if (res.length === 2 || res.length === 1) {
              res = "";
              lastSlash = i2;
              dots = 0;
              isAboveRoot = false;
              continue;
            }
          }
          if (allowAboveRoot) {
            if (res.length > 0) {
              res += "/..";
            } else {
              res = "..";
            }
            isAboveRoot = true;
          }
        } else {
          const slice = path.slice(lastSlash + 1, i2);
          if (res.length > 0) {
            res += `/${slice}`;
          } else {
            res = slice;
          }
          isAboveRoot = false;
        }
        lastSlash = i2;
        dots = 0;
      } else if (code === DOT && dots !== -1) {
        ++dots;
      } else {
        dots = -1;
      }
    }
    return res;
  }

  // ../core/src/javascript-utils/is-type.ts
  var isBoolean = (x) => typeof x === "boolean";
  var isFunction = (x) => typeof x === "function";
  var isObject = (x) => x !== null && typeof x === "object";
  var isPureObject = (x) => isObject(x) && x.constructor === {}.constructor;
  var isIterable = (x) => x && typeof x[Symbol.iterator] === "function";
  var isAsyncIterable = (x) => x && typeof x[Symbol.asyncIterator] === "function";
  var isResponse = (x) => typeof Response !== "undefined" && x instanceof Response || x && x.arrayBuffer && x.text && x.json;
  var isBlob = (x) => typeof Blob !== "undefined" && x instanceof Blob;
  var isBuffer2 = (x) => x && typeof x === "object" && x.isBuffer;
  var isReadableDOMStream = (x) => typeof ReadableStream !== "undefined" && x instanceof ReadableStream || isObject(x) && isFunction(x.tee) && isFunction(x.cancel) && isFunction(x.getReader);
  var isReadableNodeStream = (x) => isObject(x) && isFunction(x.read) && isFunction(x.pipe) && isBoolean(x.readable);
  var isReadableStream = (x) => isReadableDOMStream(x) || isReadableNodeStream(x);

  // ../core/src/lib/utils/mime-type-utils.ts
  var DATA_URL_PATTERN = /^data:([-\w.]+\/[-\w.+]+)(;|,)/;
  var MIME_TYPE_PATTERN = /^([-\w.]+\/[-\w.+]+)/;
  function parseMIMEType(mimeString) {
    const matches3 = MIME_TYPE_PATTERN.exec(mimeString);
    if (matches3) {
      return matches3[1];
    }
    return mimeString;
  }
  function parseMIMETypeFromURL(url) {
    const matches3 = DATA_URL_PATTERN.exec(url);
    if (matches3) {
      return matches3[1];
    }
    return "";
  }

  // ../core/src/lib/utils/url-utils.ts
  var QUERY_STRING_PATTERN = /\?.*/;
  function extractQueryString(url) {
    const matches3 = url.match(QUERY_STRING_PATTERN);
    return matches3 && matches3[0];
  }
  function stripQueryString(url) {
    return url.replace(QUERY_STRING_PATTERN, "");
  }

  // ../core/src/lib/utils/resource-utils.ts
  function getResourceUrl(resource) {
    if (isResponse(resource)) {
      const response = resource;
      return response.url;
    }
    if (isBlob(resource)) {
      const blob = resource;
      return blob.name || "";
    }
    if (typeof resource === "string") {
      return resource;
    }
    return "";
  }
  function getResourceMIMEType(resource) {
    if (isResponse(resource)) {
      const response = resource;
      const contentTypeHeader = response.headers.get("content-type") || "";
      const noQueryUrl = stripQueryString(response.url);
      return parseMIMEType(contentTypeHeader) || parseMIMETypeFromURL(noQueryUrl);
    }
    if (isBlob(resource)) {
      const blob = resource;
      return blob.type || "";
    }
    if (typeof resource === "string") {
      return parseMIMETypeFromURL(resource);
    }
    return "";
  }
  function getResourceContentLength(resource) {
    if (isResponse(resource)) {
      const response = resource;
      return response.headers["content-length"] || -1;
    }
    if (isBlob(resource)) {
      const blob = resource;
      return blob.size;
    }
    if (typeof resource === "string") {
      return resource.length;
    }
    if (resource instanceof ArrayBuffer) {
      return resource.byteLength;
    }
    if (ArrayBuffer.isView(resource)) {
      return resource.byteLength;
    }
    return -1;
  }

  // ../core/src/lib/utils/response-utils.ts
  async function makeResponse(resource) {
    if (isResponse(resource)) {
      return resource;
    }
    const headers = {};
    const contentLength = getResourceContentLength(resource);
    if (contentLength >= 0) {
      headers["content-length"] = String(contentLength);
    }
    const url = getResourceUrl(resource);
    const type = getResourceMIMEType(resource);
    if (type) {
      headers["content-type"] = type;
    }
    const initialDataUrl = await getInitialDataUrl(resource);
    if (initialDataUrl) {
      headers["x-first-bytes"] = initialDataUrl;
    }
    if (typeof resource === "string") {
      resource = new TextEncoder().encode(resource);
    }
    const response = new Response(resource, { headers });
    Object.defineProperty(response, "url", { value: url });
    return response;
  }
  async function checkResponse(response) {
    if (!response.ok) {
      const message = await getResponseError(response);
      throw new Error(message);
    }
  }
  async function getResponseError(response) {
    let message = `Failed to fetch resource ${response.url} (${response.status}): `;
    try {
      const contentType = response.headers.get("Content-Type");
      let text = response.statusText;
      if (contentType.includes("application/json")) {
        text += ` ${await response.text()}`;
      }
      message += text;
      message = message.length > 60 ? `${message.slice(0, 60)}...` : message;
    } catch (error) {
    }
    return message;
  }
  async function getInitialDataUrl(resource) {
    const INITIAL_DATA_LENGTH = 5;
    if (typeof resource === "string") {
      return `data:,${resource.slice(0, INITIAL_DATA_LENGTH)}`;
    }
    if (resource instanceof Blob) {
      const blobSlice = resource.slice(0, 5);
      return await new Promise((resolve2) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve2(event?.target?.result);
        reader.readAsDataURL(blobSlice);
      });
    }
    if (resource instanceof ArrayBuffer) {
      const slice = resource.slice(0, INITIAL_DATA_LENGTH);
      const base64 = arrayBufferToBase64(slice);
      return `data:base64,${base64}`;
    }
    return null;
  }
  function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i2 = 0; i2 < bytes.byteLength; i2++) {
      binary += String.fromCharCode(bytes[i2]);
    }
    return btoa(binary);
  }

  // ../core/src/lib/fetch/fetch-file.ts
  async function fetchFile(url, options) {
    if (typeof url === "string") {
      url = resolvePath(url);
      let fetchOptions = options;
      if (options?.fetch && typeof options?.fetch !== "function") {
        fetchOptions = options.fetch;
      }
      return await fetch(url, fetchOptions);
    }
    return await makeResponse(url);
  }

  // ../../node_modules/@probe.gl/log/node_modules/@probe.gl/env/dist/lib/is-electron.js
  function isElectron(mockUserAgent) {
    if (typeof window !== "undefined" && typeof window.process === "object" && window.process.type === "renderer") {
      return true;
    }
    if (typeof process !== "undefined" && typeof process.versions === "object" && Boolean(process.versions["electron"])) {
      return true;
    }
    const realUserAgent = typeof navigator === "object" && typeof navigator.userAgent === "string" && navigator.userAgent;
    const userAgent = mockUserAgent || realUserAgent;
    if (userAgent && userAgent.indexOf("Electron") >= 0) {
      return true;
    }
    return false;
  }

  // ../../node_modules/@probe.gl/log/node_modules/@probe.gl/env/dist/lib/is-browser.js
  function isBrowser3() {
    const isNode = typeof process === "object" && String(process) === "[object process]" && !process.browser;
    return !isNode || isElectron();
  }

  // ../../node_modules/@probe.gl/log/node_modules/@probe.gl/env/dist/lib/globals.js
  var self_3 = globalThis.self || globalThis.window || globalThis.global;
  var window_3 = globalThis.window || globalThis.self || globalThis.global;
  var document_3 = globalThis.document || {};
  var process_ = globalThis.process || {};
  var console_ = globalThis.console;
  var navigator_ = globalThis.navigator || {};

  // ../../node_modules/@probe.gl/log/node_modules/@probe.gl/env/dist/utils/globals.js
  var VERSION3 = true ? "4.0.0-alpha.7" : "untranspiled source";
  var isBrowser4 = isBrowser3();

  // ../../node_modules/@probe.gl/log/dist/utils/local-storage.js
  function getStorage(type) {
    try {
      const storage = window[type];
      const x = "__storage_test__";
      storage.setItem(x, x);
      storage.removeItem(x);
      return storage;
    } catch (e2) {
      return null;
    }
  }
  var LocalStorage = class {
    constructor(id, defaultConfig) {
      let type = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "sessionStorage";
      _defineProperty(this, "storage", void 0);
      _defineProperty(this, "id", void 0);
      _defineProperty(this, "config", void 0);
      this.storage = getStorage(type);
      this.id = id;
      this.config = defaultConfig;
      this._loadConfiguration();
    }
    getConfiguration() {
      return this.config;
    }
    setConfiguration(configuration) {
      Object.assign(this.config, configuration);
      if (this.storage) {
        const serialized = JSON.stringify(this.config);
        this.storage.setItem(this.id, serialized);
      }
    }
    _loadConfiguration() {
      let configuration = {};
      if (this.storage) {
        const serializedConfiguration = this.storage.getItem(this.id);
        configuration = serializedConfiguration ? JSON.parse(serializedConfiguration) : {};
      }
      Object.assign(this.config, configuration);
      return this;
    }
  };

  // ../../node_modules/@probe.gl/log/dist/utils/formatters.js
  function formatTime(ms) {
    let formatted;
    if (ms < 10) {
      formatted = "".concat(ms.toFixed(2), "ms");
    } else if (ms < 100) {
      formatted = "".concat(ms.toFixed(1), "ms");
    } else if (ms < 1e3) {
      formatted = "".concat(ms.toFixed(0), "ms");
    } else {
      formatted = "".concat((ms / 1e3).toFixed(2), "s");
    }
    return formatted;
  }
  function leftPad(string) {
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 8;
    const padLength = Math.max(length2 - string.length, 0);
    return "".concat(" ".repeat(padLength)).concat(string);
  }
  function formatImage(image, message, scale2) {
    let maxWidth = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 600;
    const imageUrl = image.src.replace(/\(/g, "%28").replace(/\)/g, "%29");
    if (image.width > maxWidth) {
      scale2 = Math.min(scale2, maxWidth / image.width);
    }
    const width = image.width * scale2;
    const height = image.height * scale2;
    const style = ["font-size:1px;", "padding:".concat(Math.floor(height / 2), "px ").concat(Math.floor(width / 2), "px;"), "line-height:".concat(height, "px;"), "background:url(".concat(imageUrl, ");"), "background-size:".concat(width, "px ").concat(height, "px;"), "color:transparent;"].join("");
    return ["".concat(message, " %c+"), style];
  }

  // ../../node_modules/@probe.gl/log/dist/utils/color.js
  var COLOR;
  (function(COLOR2) {
    COLOR2[COLOR2["BLACK"] = 30] = "BLACK";
    COLOR2[COLOR2["RED"] = 31] = "RED";
    COLOR2[COLOR2["GREEN"] = 32] = "GREEN";
    COLOR2[COLOR2["YELLOW"] = 33] = "YELLOW";
    COLOR2[COLOR2["BLUE"] = 34] = "BLUE";
    COLOR2[COLOR2["MAGENTA"] = 35] = "MAGENTA";
    COLOR2[COLOR2["CYAN"] = 36] = "CYAN";
    COLOR2[COLOR2["WHITE"] = 37] = "WHITE";
    COLOR2[COLOR2["BRIGHT_BLACK"] = 90] = "BRIGHT_BLACK";
    COLOR2[COLOR2["BRIGHT_RED"] = 91] = "BRIGHT_RED";
    COLOR2[COLOR2["BRIGHT_GREEN"] = 92] = "BRIGHT_GREEN";
    COLOR2[COLOR2["BRIGHT_YELLOW"] = 93] = "BRIGHT_YELLOW";
    COLOR2[COLOR2["BRIGHT_BLUE"] = 94] = "BRIGHT_BLUE";
    COLOR2[COLOR2["BRIGHT_MAGENTA"] = 95] = "BRIGHT_MAGENTA";
    COLOR2[COLOR2["BRIGHT_CYAN"] = 96] = "BRIGHT_CYAN";
    COLOR2[COLOR2["BRIGHT_WHITE"] = 97] = "BRIGHT_WHITE";
  })(COLOR || (COLOR = {}));
  var BACKGROUND_INCREMENT = 10;
  function getColor(color) {
    if (typeof color !== "string") {
      return color;
    }
    color = color.toUpperCase();
    return COLOR[color] || COLOR.WHITE;
  }
  function addColor(string, color, background) {
    if (!isBrowser3 && typeof string === "string") {
      if (color) {
        const colorCode = getColor(color);
        string = "[".concat(colorCode, "m").concat(string, "[39m");
      }
      if (background) {
        const colorCode = getColor(background);
        string = "[".concat(colorCode + BACKGROUND_INCREMENT, "m").concat(string, "[49m");
      }
    }
    return string;
  }

  // ../../node_modules/@probe.gl/log/dist/utils/autobind.js
  function autobind(obj) {
    let predefined = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : ["constructor"];
    const proto = Object.getPrototypeOf(obj);
    const propNames = Object.getOwnPropertyNames(proto);
    const object = obj;
    for (const key of propNames) {
      const value = object[key];
      if (typeof value === "function") {
        if (!predefined.find((name) => key === name)) {
          object[key] = value.bind(obj);
        }
      }
    }
  }

  // ../../node_modules/@probe.gl/log/dist/utils/assert.js
  function assert3(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failed");
    }
  }

  // ../../node_modules/@probe.gl/log/dist/utils/hi-res-timestamp.js
  function getHiResTimestamp() {
    let timestamp;
    if (isBrowser3() && window_3.performance) {
      var _window$performance, _window$performance$n;
      timestamp = window_3 === null || window_3 === void 0 ? void 0 : (_window$performance = window_3.performance) === null || _window$performance === void 0 ? void 0 : (_window$performance$n = _window$performance.now) === null || _window$performance$n === void 0 ? void 0 : _window$performance$n.call(_window$performance);
    } else if ("hrtime" in process_) {
      var _process$hrtime;
      const timeParts = process_ === null || process_ === void 0 ? void 0 : (_process$hrtime = process_.hrtime) === null || _process$hrtime === void 0 ? void 0 : _process$hrtime.call(process_);
      timestamp = timeParts[0] * 1e3 + timeParts[1] / 1e6;
    } else {
      timestamp = Date.now();
    }
    return timestamp;
  }

  // ../../node_modules/@probe.gl/log/dist/log.js
  var originalConsole = {
    debug: isBrowser3() ? console.debug || console.log : console.log,
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
  };
  var DEFAULT_LOG_CONFIGURATION = {
    enabled: true,
    level: 0
  };
  function noop() {
  }
  var cache = {};
  var ONCE = {
    once: true
  };
  var Log = class {
    constructor() {
      let {
        id
      } = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {
        id: ""
      };
      _defineProperty(this, "id", void 0);
      _defineProperty(this, "VERSION", VERSION3);
      _defineProperty(this, "_startTs", getHiResTimestamp());
      _defineProperty(this, "_deltaTs", getHiResTimestamp());
      _defineProperty(this, "_storage", void 0);
      _defineProperty(this, "userData", {});
      _defineProperty(this, "LOG_THROTTLE_TIMEOUT", 0);
      this.id = id;
      this.userData = {};
      this._storage = new LocalStorage("__probe-".concat(this.id, "__"), DEFAULT_LOG_CONFIGURATION);
      this.timeStamp("".concat(this.id, " started"));
      autobind(this);
      Object.seal(this);
    }
    set level(newLevel) {
      this.setLevel(newLevel);
    }
    get level() {
      return this.getLevel();
    }
    isEnabled() {
      return this._storage.config.enabled;
    }
    getLevel() {
      return this._storage.config.level;
    }
    getTotal() {
      return Number((getHiResTimestamp() - this._startTs).toPrecision(10));
    }
    getDelta() {
      return Number((getHiResTimestamp() - this._deltaTs).toPrecision(10));
    }
    set priority(newPriority) {
      this.level = newPriority;
    }
    get priority() {
      return this.level;
    }
    getPriority() {
      return this.level;
    }
    enable() {
      let enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
      this._storage.setConfiguration({
        enabled
      });
      return this;
    }
    setLevel(level) {
      this._storage.setConfiguration({
        level
      });
      return this;
    }
    get(setting) {
      return this._storage.config[setting];
    }
    set(setting, value) {
      this._storage.setConfiguration({
        [setting]: value
      });
    }
    settings() {
      if (console.table) {
        console.table(this._storage.config);
      } else {
        console.log(this._storage.config);
      }
    }
    assert(condition, message) {
      assert3(condition, message);
    }
    warn(message) {
      return this._getLogFunction(0, message, originalConsole.warn, arguments, ONCE);
    }
    error(message) {
      return this._getLogFunction(0, message, originalConsole.error, arguments);
    }
    deprecated(oldUsage, newUsage) {
      return this.warn("`".concat(oldUsage, "` is deprecated and will be removed in a later version. Use `").concat(newUsage, "` instead"));
    }
    removed(oldUsage, newUsage) {
      return this.error("`".concat(oldUsage, "` has been removed. Use `").concat(newUsage, "` instead"));
    }
    probe(logLevel, message) {
      return this._getLogFunction(logLevel, message, originalConsole.log, arguments, {
        time: true,
        once: true
      });
    }
    log(logLevel, message) {
      return this._getLogFunction(logLevel, message, originalConsole.debug, arguments);
    }
    info(logLevel, message) {
      return this._getLogFunction(logLevel, message, console.info, arguments);
    }
    once(logLevel, message) {
      return this._getLogFunction(logLevel, message, originalConsole.debug || originalConsole.info, arguments, ONCE);
    }
    table(logLevel, table, columns) {
      if (table) {
        return this._getLogFunction(logLevel, table, console.table || noop, columns && [columns], {
          tag: getTableHeader(table)
        });
      }
      return noop;
    }
    image(_ref) {
      let {
        logLevel,
        priority,
        image,
        message = "",
        scale: scale2 = 1
      } = _ref;
      if (!this._shouldLog(logLevel || priority)) {
        return noop;
      }
      return isBrowser3() ? logImageInBrowser({
        image,
        message,
        scale: scale2
      }) : logImageInNode({
        image,
        message,
        scale: scale2
      });
    }
    time(logLevel, message) {
      return this._getLogFunction(logLevel, message, console.time ? console.time : console.info);
    }
    timeEnd(logLevel, message) {
      return this._getLogFunction(logLevel, message, console.timeEnd ? console.timeEnd : console.info);
    }
    timeStamp(logLevel, message) {
      return this._getLogFunction(logLevel, message, console.timeStamp || noop);
    }
    group(logLevel, message) {
      let opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
        collapsed: false
      };
      const options = normalizeArguments({
        logLevel,
        message,
        opts
      });
      const {
        collapsed
      } = opts;
      options.method = (collapsed ? console.groupCollapsed : console.group) || console.info;
      return this._getLogFunction(options);
    }
    groupCollapsed(logLevel, message) {
      let opts = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this.group(logLevel, message, Object.assign({}, opts, {
        collapsed: true
      }));
    }
    groupEnd(logLevel) {
      return this._getLogFunction(logLevel, "", console.groupEnd || noop);
    }
    withGroup(logLevel, message, func) {
      this.group(logLevel, message)();
      try {
        func();
      } finally {
        this.groupEnd(logLevel)();
      }
    }
    trace() {
      if (console.trace) {
        console.trace();
      }
    }
    _shouldLog(logLevel) {
      return this.isEnabled() && this.getLevel() >= normalizeLogLevel(logLevel);
    }
    _getLogFunction(logLevel, message, method, args, opts) {
      if (this._shouldLog(logLevel)) {
        opts = normalizeArguments({
          logLevel,
          message,
          args,
          opts
        });
        method = method || opts.method;
        assert3(method);
        opts.total = this.getTotal();
        opts.delta = this.getDelta();
        this._deltaTs = getHiResTimestamp();
        const tag = opts.tag || opts.message;
        if (opts.once && tag) {
          if (!cache[tag]) {
            cache[tag] = getHiResTimestamp();
          } else {
            return noop;
          }
        }
        message = decorateMessage(this.id, opts.message, opts);
        return method.bind(console, message, ...opts.args);
      }
      return noop;
    }
  };
  _defineProperty(Log, "VERSION", VERSION3);
  function normalizeLogLevel(logLevel) {
    if (!logLevel) {
      return 0;
    }
    let resolvedLevel;
    switch (typeof logLevel) {
      case "number":
        resolvedLevel = logLevel;
        break;
      case "object":
        resolvedLevel = logLevel.logLevel || logLevel.priority || 0;
        break;
      default:
        return 0;
    }
    assert3(Number.isFinite(resolvedLevel) && resolvedLevel >= 0);
    return resolvedLevel;
  }
  function normalizeArguments(opts) {
    const {
      logLevel,
      message
    } = opts;
    opts.logLevel = normalizeLogLevel(logLevel);
    const args = opts.args ? Array.from(opts.args) : [];
    while (args.length && args.shift() !== message) {
    }
    switch (typeof logLevel) {
      case "string":
      case "function":
        if (message !== void 0) {
          args.unshift(message);
        }
        opts.message = logLevel;
        break;
      case "object":
        Object.assign(opts, logLevel);
        break;
      default:
    }
    if (typeof opts.message === "function") {
      opts.message = opts.message();
    }
    const messageType = typeof opts.message;
    assert3(messageType === "string" || messageType === "object");
    return Object.assign(opts, {
      args
    }, opts.opts);
  }
  function decorateMessage(id, message, opts) {
    if (typeof message === "string") {
      const time = opts.time ? leftPad(formatTime(opts.total)) : "";
      message = opts.time ? "".concat(id, ": ").concat(time, "  ").concat(message) : "".concat(id, ": ").concat(message);
      message = addColor(message, opts.color, opts.background);
    }
    return message;
  }
  function logImageInNode(_ref2) {
    let {
      image,
      message = "",
      scale: scale2 = 1
    } = _ref2;
    console.warn("removed");
    return noop;
  }
  function logImageInBrowser(_ref3) {
    let {
      image,
      message = "",
      scale: scale2 = 1
    } = _ref3;
    if (typeof image === "string") {
      const img = new Image();
      img.onload = () => {
        const args = formatImage(img, message, scale2);
        console.log(...args);
      };
      img.src = image;
      return noop;
    }
    const element = image.nodeName || "";
    if (element.toLowerCase() === "img") {
      console.log(...formatImage(image, message, scale2));
      return noop;
    }
    if (element.toLowerCase() === "canvas") {
      const img = new Image();
      img.onload = () => console.log(...formatImage(img, message, scale2));
      img.src = image.toDataURL();
      return noop;
    }
    return noop;
  }
  function getTableHeader(table) {
    for (const key in table) {
      for (const title in table[key]) {
        return title || "untitled";
      }
    }
    return "empty";
  }

  // ../../node_modules/@probe.gl/log/dist/index.js
  var dist_default = new Log({
    id: "@probe.gl/log"
  });

  // ../core/src/lib/loader-utils/loggers.ts
  var probeLog = new Log({ id: "loaders.gl" });
  var NullLog = class {
    log() {
      return () => {
      };
    }
    info() {
      return () => {
      };
    }
    warn() {
      return () => {
      };
    }
    error() {
      return () => {
      };
    }
  };
  var ConsoleLog = class {
    constructor() {
      this.console = console;
    }
    log(...args) {
      return this.console.log.bind(this.console, ...args);
    }
    info(...args) {
      return this.console.info.bind(this.console, ...args);
    }
    warn(...args) {
      return this.console.warn.bind(this.console, ...args);
    }
    error(...args) {
      return this.console.error.bind(this.console, ...args);
    }
  };

  // ../core/src/lib/loader-utils/option-defaults.ts
  var DEFAULT_LOADER_OPTIONS = {
    fetch: null,
    mimeType: void 0,
    nothrow: false,
    log: new ConsoleLog(),
    CDN: "https://unpkg.com/@loaders.gl",
    worker: true,
    maxConcurrency: 3,
    maxMobileConcurrency: 1,
    reuseWorkers: isBrowser,
    _nodeWorkers: false,
    _workerType: "",
    limit: 0,
    _limitMB: 0,
    batchSize: "auto",
    batchDebounceMs: 0,
    metadata: false,
    transforms: []
  };
  var REMOVED_LOADER_OPTIONS = {
    throws: "nothrow",
    dataType: "(no longer used)",
    uri: "baseUri",
    method: "fetch.method",
    headers: "fetch.headers",
    body: "fetch.body",
    mode: "fetch.mode",
    credentials: "fetch.credentials",
    cache: "fetch.cache",
    redirect: "fetch.redirect",
    referrer: "fetch.referrer",
    referrerPolicy: "fetch.referrerPolicy",
    integrity: "fetch.integrity",
    keepalive: "fetch.keepalive",
    signal: "fetch.signal"
  };

  // ../core/src/lib/loader-utils/option-utils.ts
  function getGlobalLoaderState() {
    globalThis.loaders = globalThis.loaders || {};
    const { loaders } = globalThis;
    loaders._state = loaders._state || {};
    return loaders._state;
  }
  var getGlobalLoaderOptions = () => {
    const state = getGlobalLoaderState();
    state.globalOptions = state.globalOptions || { ...DEFAULT_LOADER_OPTIONS };
    return state.globalOptions;
  };
  function normalizeOptions(options, loader, loaders, url) {
    loaders = loaders || [];
    loaders = Array.isArray(loaders) ? loaders : [loaders];
    validateOptions(options, loaders);
    return normalizeOptionsInternal(loader, options, url);
  }
  function validateOptions(options, loaders) {
    validateOptionsObject(options, null, DEFAULT_LOADER_OPTIONS, REMOVED_LOADER_OPTIONS, loaders);
    for (const loader of loaders) {
      const idOptions = options && options[loader.id] || {};
      const loaderOptions = loader.options && loader.options[loader.id] || {};
      const deprecatedOptions = loader.deprecatedOptions && loader.deprecatedOptions[loader.id] || {};
      validateOptionsObject(idOptions, loader.id, loaderOptions, deprecatedOptions, loaders);
    }
  }
  function validateOptionsObject(options, id, defaultOptions, deprecatedOptions, loaders) {
    const loaderName = id || "Top level";
    const prefix = id ? `${id}.` : "";
    for (const key in options) {
      const isSubOptions = !id && isObject(options[key]);
      const isBaseUriOption = key === "baseUri" && !id;
      const isWorkerUrlOption = key === "workerUrl" && id;
      if (!(key in defaultOptions) && !isBaseUriOption && !isWorkerUrlOption) {
        if (key in deprecatedOptions) {
          probeLog.warn(`${loaderName} loader option '${prefix}${key}' no longer supported, use '${deprecatedOptions[key]}'`)();
        } else if (!isSubOptions) {
          const suggestion = findSimilarOption(key, loaders);
          probeLog.warn(`${loaderName} loader option '${prefix}${key}' not recognized. ${suggestion}`)();
        }
      }
    }
  }
  function findSimilarOption(optionKey, loaders) {
    const lowerCaseOptionKey = optionKey.toLowerCase();
    let bestSuggestion = "";
    for (const loader of loaders) {
      for (const key in loader.options) {
        if (optionKey === key) {
          return `Did you mean '${loader.id}.${key}'?`;
        }
        const lowerCaseKey = key.toLowerCase();
        const isPartialMatch = lowerCaseOptionKey.startsWith(lowerCaseKey) || lowerCaseKey.startsWith(lowerCaseOptionKey);
        if (isPartialMatch) {
          bestSuggestion = bestSuggestion || `Did you mean '${loader.id}.${key}'?`;
        }
      }
    }
    return bestSuggestion;
  }
  function normalizeOptionsInternal(loader, options, url) {
    const loaderDefaultOptions = loader.options || {};
    const mergedOptions = { ...loaderDefaultOptions };
    addUrlOptions(mergedOptions, url);
    if (mergedOptions.log === null) {
      mergedOptions.log = new NullLog();
    }
    mergeNestedFields(mergedOptions, getGlobalLoaderOptions());
    mergeNestedFields(mergedOptions, options);
    return mergedOptions;
  }
  function mergeNestedFields(mergedOptions, options) {
    for (const key in options) {
      if (key in options) {
        const value = options[key];
        if (isPureObject(value) && isPureObject(mergedOptions[key])) {
          mergedOptions[key] = {
            ...mergedOptions[key],
            ...options[key]
          };
        } else {
          mergedOptions[key] = options[key];
        }
      }
    }
  }
  function addUrlOptions(options, url) {
    if (url && !("baseUri" in options)) {
      options.baseUri = url;
    }
  }

  // ../core/src/lib/loader-utils/normalize-loader.ts
  function isLoaderObject(loader) {
    if (!loader) {
      return false;
    }
    if (Array.isArray(loader)) {
      loader = loader[0];
    }
    const hasExtensions = Array.isArray(loader?.extensions);
    return hasExtensions;
  }
  function normalizeLoader(loader) {
    assert(loader, "null loader");
    assert(isLoaderObject(loader), "invalid loader");
    let options;
    if (Array.isArray(loader)) {
      options = loader[1];
      loader = loader[0];
      loader = {
        ...loader,
        options: { ...loader.options, ...options }
      };
    }
    if (loader?.parseTextSync || loader?.parseText) {
      loader.text = true;
    }
    if (!loader.text) {
      loader.binary = true;
    }
    return loader;
  }

  // ../core/src/lib/api/register-loaders.ts
  var getGlobalLoaderRegistry = () => {
    const state = getGlobalLoaderState();
    state.loaderRegistry = state.loaderRegistry || [];
    return state.loaderRegistry;
  };
  function getRegisteredLoaders() {
    return getGlobalLoaderRegistry();
  }

  // ../core/src/lib/utils/log.ts
  var log = new Log({ id: "loaders.gl" });

  // ../core/src/lib/api/select-loader.ts
  var EXT_PATTERN = /\.([^.]+)$/;
  async function selectLoader(data, loaders = [], options, context) {
    if (!validHTTPResponse(data)) {
      return null;
    }
    let loader = selectLoaderSync(data, loaders, { ...options, nothrow: true }, context);
    if (loader) {
      return loader;
    }
    if (isBlob(data)) {
      data = await data.slice(0, 10).arrayBuffer();
      loader = selectLoaderSync(data, loaders, options, context);
    }
    if (!loader && !options?.nothrow) {
      throw new Error(getNoValidLoaderMessage(data));
    }
    return loader;
  }
  function selectLoaderSync(data, loaders = [], options, context) {
    if (!validHTTPResponse(data)) {
      return null;
    }
    if (loaders && !Array.isArray(loaders)) {
      return normalizeLoader(loaders);
    }
    let candidateLoaders = [];
    if (loaders) {
      candidateLoaders = candidateLoaders.concat(loaders);
    }
    if (!options?.ignoreRegisteredLoaders) {
      candidateLoaders.push(...getRegisteredLoaders());
    }
    normalizeLoaders(candidateLoaders);
    const loader = selectLoaderInternal(data, candidateLoaders, options, context);
    if (!loader && !options?.nothrow) {
      throw new Error(getNoValidLoaderMessage(data));
    }
    return loader;
  }
  function selectLoaderInternal(data, loaders, options, context) {
    const url = getResourceUrl(data);
    const type = getResourceMIMEType(data);
    const testUrl = stripQueryString(url) || context?.url;
    let loader = null;
    let reason = "";
    if (options?.mimeType) {
      loader = findLoaderByMIMEType(loaders, options?.mimeType);
      reason = `match forced by supplied MIME type ${options?.mimeType}`;
    }
    loader = loader || findLoaderByUrl(loaders, testUrl);
    reason = reason || (loader ? `matched url ${testUrl}` : "");
    loader = loader || findLoaderByMIMEType(loaders, type);
    reason = reason || (loader ? `matched MIME type ${type}` : "");
    loader = loader || findLoaderByInitialBytes(loaders, data);
    reason = reason || (loader ? `matched initial data ${getFirstCharacters(data)}` : "");
    loader = loader || findLoaderByMIMEType(loaders, options?.fallbackMimeType);
    reason = reason || (loader ? `matched fallback MIME type ${type}` : "");
    if (reason) {
      log.log(1, `selectLoader selected ${loader?.name}: ${reason}.`);
    }
    return loader;
  }
  function validHTTPResponse(data) {
    if (data instanceof Response) {
      if (data.status === 204) {
        return false;
      }
    }
    return true;
  }
  function getNoValidLoaderMessage(data) {
    const url = getResourceUrl(data);
    const type = getResourceMIMEType(data);
    let message = "No valid loader found (";
    message += url ? `${path_exports.filename(url)}, ` : "no url provided, ";
    message += `MIME type: ${type ? `"${type}"` : "not provided"}, `;
    const firstCharacters = data ? getFirstCharacters(data) : "";
    message += firstCharacters ? ` first bytes: "${firstCharacters}"` : "first bytes: not available";
    message += ")";
    return message;
  }
  function normalizeLoaders(loaders) {
    for (const loader of loaders) {
      normalizeLoader(loader);
    }
  }
  function findLoaderByUrl(loaders, url) {
    const match = url && EXT_PATTERN.exec(url);
    const extension = match && match[1];
    return extension ? findLoaderByExtension(loaders, extension) : null;
  }
  function findLoaderByExtension(loaders, extension) {
    extension = extension.toLowerCase();
    for (const loader of loaders) {
      for (const loaderExtension of loader.extensions) {
        if (loaderExtension.toLowerCase() === extension) {
          return loader;
        }
      }
    }
    return null;
  }
  function findLoaderByMIMEType(loaders, mimeType) {
    for (const loader of loaders) {
      if (loader.mimeTypes && loader.mimeTypes.includes(mimeType)) {
        return loader;
      }
      if (mimeType === `application/x.${loader.id}`) {
        return loader;
      }
    }
    return null;
  }
  function findLoaderByInitialBytes(loaders, data) {
    if (!data) {
      return null;
    }
    for (const loader of loaders) {
      if (typeof data === "string") {
        if (testDataAgainstText(data, loader)) {
          return loader;
        }
      } else if (ArrayBuffer.isView(data)) {
        if (testDataAgainstBinary(data.buffer, data.byteOffset, loader)) {
          return loader;
        }
      } else if (data instanceof ArrayBuffer) {
        const byteOffset = 0;
        if (testDataAgainstBinary(data, byteOffset, loader)) {
          return loader;
        }
      }
    }
    return null;
  }
  function testDataAgainstText(data, loader) {
    if (loader.testText) {
      return loader.testText(data);
    }
    const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
    return tests.some((test) => data.startsWith(test));
  }
  function testDataAgainstBinary(data, byteOffset, loader) {
    const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
    return tests.some((test) => testBinary(data, byteOffset, loader, test));
  }
  function testBinary(data, byteOffset, loader, test) {
    if (test instanceof ArrayBuffer) {
      return compareArrayBuffers(test, data, test.byteLength);
    }
    switch (typeof test) {
      case "function":
        return test(data, loader);
      case "string":
        const magic = getMagicString(data, byteOffset, test.length);
        return test === magic;
      default:
        return false;
    }
  }
  function getFirstCharacters(data, length2 = 5) {
    if (typeof data === "string") {
      return data.slice(0, length2);
    } else if (ArrayBuffer.isView(data)) {
      return getMagicString(data.buffer, data.byteOffset, length2);
    } else if (data instanceof ArrayBuffer) {
      const byteOffset = 0;
      return getMagicString(data, byteOffset, length2);
    }
    return "";
  }
  function getMagicString(arrayBuffer, byteOffset, length2) {
    if (arrayBuffer.byteLength < byteOffset + length2) {
      return "";
    }
    const dataView = new DataView(arrayBuffer);
    let magic = "";
    for (let i2 = 0; i2 < length2; i2++) {
      magic += String.fromCharCode(dataView.getUint8(byteOffset + i2));
    }
    return magic;
  }

  // ../core/src/iterators/make-iterator/make-string-iterator.ts
  var DEFAULT_CHUNK_SIZE = 256 * 1024;
  function* makeStringIterator(string, options) {
    const chunkSize = options?.chunkSize || DEFAULT_CHUNK_SIZE;
    let offset = 0;
    const textEncoder = new TextEncoder();
    while (offset < string.length) {
      const chunkLength = Math.min(string.length - offset, chunkSize);
      const chunk = string.slice(offset, offset + chunkLength);
      offset += chunkLength;
      yield textEncoder.encode(chunk);
    }
  }

  // ../core/src/iterators/make-iterator/make-array-buffer-iterator.ts
  var DEFAULT_CHUNK_SIZE2 = 256 * 1024;
  function* makeArrayBufferIterator(arrayBuffer, options = {}) {
    const { chunkSize = DEFAULT_CHUNK_SIZE2 } = options;
    let byteOffset = 0;
    while (byteOffset < arrayBuffer.byteLength) {
      const chunkByteLength = Math.min(arrayBuffer.byteLength - byteOffset, chunkSize);
      const chunk = new ArrayBuffer(chunkByteLength);
      const sourceArray = new Uint8Array(arrayBuffer, byteOffset, chunkByteLength);
      const chunkArray = new Uint8Array(chunk);
      chunkArray.set(sourceArray);
      byteOffset += chunkByteLength;
      yield chunk;
    }
  }

  // ../core/src/iterators/make-iterator/make-blob-iterator.ts
  var DEFAULT_CHUNK_SIZE3 = 1024 * 1024;
  async function* makeBlobIterator(blob, options) {
    const chunkSize = options?.chunkSize || DEFAULT_CHUNK_SIZE3;
    let offset = 0;
    while (offset < blob.size) {
      const end = offset + chunkSize;
      const chunk = await blob.slice(offset, end).arrayBuffer();
      offset = end;
      yield chunk;
    }
  }

  // ../core/src/iterators/make-iterator/make-stream-iterator.ts
  function makeStreamIterator(stream, options) {
    return isBrowser ? makeBrowserStreamIterator(stream, options) : makeNodeStreamIterator(stream, options);
  }
  async function* makeBrowserStreamIterator(stream, options) {
    const reader = stream.getReader();
    let nextBatchPromise;
    try {
      while (true) {
        const currentBatchPromise = nextBatchPromise || reader.read();
        if (options?._streamReadAhead) {
          nextBatchPromise = reader.read();
        }
        const { done, value } = await currentBatchPromise;
        if (done) {
          return;
        }
        yield toArrayBuffer2(value);
      }
    } catch (error) {
      reader.releaseLock();
    }
  }
  async function* makeNodeStreamIterator(stream, options) {
    for await (const chunk of stream) {
      yield toArrayBuffer2(chunk);
    }
  }

  // ../core/src/iterators/make-iterator/make-iterator.ts
  function makeIterator(data, options) {
    if (typeof data === "string") {
      return makeStringIterator(data, options);
    }
    if (data instanceof ArrayBuffer) {
      return makeArrayBufferIterator(data, options);
    }
    if (isBlob(data)) {
      return makeBlobIterator(data, options);
    }
    if (isReadableStream(data)) {
      return makeStreamIterator(data, options);
    }
    if (isResponse(data)) {
      const response = data;
      return makeStreamIterator(response.body, options);
    }
    throw new Error("makeIterator");
  }

  // ../core/src/lib/loader-utils/get-data.ts
  var ERR_DATA = "Cannot convert supplied data type";
  function getArrayBufferOrStringFromDataSync(data, loader, options) {
    if (loader.text && typeof data === "string") {
      return data;
    }
    if (isBuffer2(data)) {
      data = data.buffer;
    }
    if (data instanceof ArrayBuffer) {
      const arrayBuffer = data;
      if (loader.text && !loader.binary) {
        const textDecoder = new TextDecoder("utf8");
        return textDecoder.decode(arrayBuffer);
      }
      return arrayBuffer;
    }
    if (ArrayBuffer.isView(data)) {
      if (loader.text && !loader.binary) {
        const textDecoder = new TextDecoder("utf8");
        return textDecoder.decode(data);
      }
      let arrayBuffer = data.buffer;
      const byteLength = data.byteLength || data.length;
      if (data.byteOffset !== 0 || byteLength !== arrayBuffer.byteLength) {
        arrayBuffer = arrayBuffer.slice(data.byteOffset, data.byteOffset + byteLength);
      }
      return arrayBuffer;
    }
    throw new Error(ERR_DATA);
  }
  async function getArrayBufferOrStringFromData(data, loader, options) {
    const isArrayBuffer = data instanceof ArrayBuffer || ArrayBuffer.isView(data);
    if (typeof data === "string" || isArrayBuffer) {
      return getArrayBufferOrStringFromDataSync(data, loader, options);
    }
    if (isBlob(data)) {
      data = await makeResponse(data);
    }
    if (isResponse(data)) {
      const response = data;
      await checkResponse(response);
      return loader.binary ? await response.arrayBuffer() : await response.text();
    }
    if (isReadableStream(data)) {
      data = makeIterator(data, options);
    }
    if (isIterable(data) || isAsyncIterable(data)) {
      return concatenateArrayBuffersAsync(data);
    }
    throw new Error(ERR_DATA);
  }

  // ../core/src/lib/loader-utils/get-fetch-function.ts
  function getFetchFunction(options, context) {
    const globalOptions = getGlobalLoaderOptions();
    const fetchOptions = options || globalOptions;
    if (typeof fetchOptions.fetch === "function") {
      return fetchOptions.fetch;
    }
    if (isObject(fetchOptions.fetch)) {
      return (url) => fetchFile(url, fetchOptions);
    }
    if (context?.fetch) {
      return context?.fetch;
    }
    return fetchFile;
  }

  // ../core/src/lib/loader-utils/loader-context.ts
  function getLoaderContext(context, options, parentContext) {
    if (parentContext) {
      return parentContext;
    }
    const newContext = {
      fetch: getFetchFunction(options, context),
      ...context
    };
    if (newContext.url) {
      const baseUrl = stripQueryString(newContext.url);
      newContext.baseUrl = baseUrl;
      newContext.queryString = extractQueryString(newContext.url);
      newContext.filename = path_exports.filename(baseUrl);
      newContext.baseUrl = path_exports.dirname(baseUrl);
    }
    if (!Array.isArray(newContext.loaders)) {
      newContext.loaders = null;
    }
    return newContext;
  }
  function getLoadersFromContext(loaders, context) {
    if (!context && loaders && !Array.isArray(loaders)) {
      return loaders;
    }
    let candidateLoaders;
    if (loaders) {
      candidateLoaders = Array.isArray(loaders) ? loaders : [loaders];
    }
    if (context && context.loaders) {
      const contextLoaders = Array.isArray(context.loaders) ? context.loaders : [context.loaders];
      candidateLoaders = candidateLoaders ? [...candidateLoaders, ...contextLoaders] : contextLoaders;
    }
    return candidateLoaders && candidateLoaders.length ? candidateLoaders : null;
  }

  // ../core/src/lib/api/parse.ts
  async function parse(data, loaders, options, context) {
    assert2(!context || typeof context === "object");
    if (loaders && !Array.isArray(loaders) && !isLoaderObject(loaders)) {
      context = void 0;
      options = loaders;
      loaders = void 0;
    }
    data = await data;
    options = options || {};
    const url = getResourceUrl(data);
    const typedLoaders = loaders;
    const candidateLoaders = getLoadersFromContext(typedLoaders, context);
    const loader = await selectLoader(data, candidateLoaders, options);
    if (!loader) {
      return null;
    }
    options = normalizeOptions(options, loader, candidateLoaders, url);
    context = getLoaderContext({ url, parse, loaders: candidateLoaders }, options, context || null);
    return await parseWithLoader(loader, data, options, context);
  }
  async function parseWithLoader(loader, data, options, context) {
    validateWorkerVersion(loader);
    if (isResponse(data)) {
      const response = data;
      const { ok, redirected, status, statusText, type, url } = response;
      const headers = Object.fromEntries(response.headers.entries());
      context.response = { headers, ok, redirected, status, statusText, type, url };
    }
    data = await getArrayBufferOrStringFromData(data, loader, options);
    if (loader.parseTextSync && typeof data === "string") {
      options.dataType = "text";
      return loader.parseTextSync(data, options, context, loader);
    }
    if (canParseWithWorker(loader, options)) {
      return await parseWithWorker(loader, data, options, context, parse);
    }
    if (loader.parseText && typeof data === "string") {
      return await loader.parseText(data, options, context, loader);
    }
    if (loader.parse) {
      return await loader.parse(data, options, context, loader);
    }
    assert2(!loader.parseSync);
    throw new Error(`${loader.id} loader - no parser found and worker is disabled`);
  }

  // ../core/src/lib/api/load.ts
  async function load(url, loaders, options, context) {
    let resolvedLoaders;
    let resolvedOptions;
    if (!Array.isArray(loaders) && !isLoaderObject(loaders)) {
      resolvedLoaders = [];
      resolvedOptions = loaders;
      context = void 0;
    } else {
      resolvedLoaders = loaders;
      resolvedOptions = options;
    }
    const fetch2 = getFetchFunction(resolvedOptions);
    let data = url;
    if (typeof url === "string") {
      data = await fetch2(url);
    }
    if (isBlob(url)) {
      data = await fetch2(url);
    }
    return Array.isArray(resolvedLoaders) ? await parse(data, resolvedLoaders, resolvedOptions) : await parse(data, resolvedLoaders, resolvedOptions);
  }

  // ../../node_modules/@math.gl/core/dist/esm/lib/assert.js
  function assert4(condition, message) {
    if (!condition) {
      throw new Error("math.gl assertion ".concat(message));
    }
  }

  // ../../node_modules/@math.gl/core/dist/esm/lib/common.js
  var RADIANS_TO_DEGREES = 1 / Math.PI * 180;
  var DEGREES_TO_RADIANS = 1 / 180 * Math.PI;
  var config = {
    EPSILON: 1e-12,
    debug: false,
    precision: 4,
    printTypes: false,
    printDegrees: false,
    printRowMajor: true
  };
  function formatValue(value, {
    precision = config.precision
  } = {}) {
    value = round(value);
    return "".concat(parseFloat(value.toPrecision(precision)));
  }
  function isArray(value) {
    return Array.isArray(value) || ArrayBuffer.isView(value) && !(value instanceof DataView);
  }
  function toRadians(degrees2) {
    return radians(degrees2);
  }
  function toDegrees(radians2) {
    return degrees(radians2);
  }
  function radians(degrees2, result) {
    return map(degrees2, (degrees3) => degrees3 * DEGREES_TO_RADIANS, result);
  }
  function degrees(radians2, result) {
    return map(radians2, (radians3) => radians3 * RADIANS_TO_DEGREES, result);
  }
  function equals(a2, b, epsilon) {
    const oldEpsilon = config.EPSILON;
    if (epsilon) {
      config.EPSILON = epsilon;
    }
    try {
      if (a2 === b) {
        return true;
      }
      if (isArray(a2) && isArray(b)) {
        if (a2.length !== b.length) {
          return false;
        }
        for (let i2 = 0; i2 < a2.length; ++i2) {
          if (!equals(a2[i2], b[i2])) {
            return false;
          }
        }
        return true;
      }
      if (a2 && a2.equals) {
        return a2.equals(b);
      }
      if (b && b.equals) {
        return b.equals(a2);
      }
      if (typeof a2 === "number" && typeof b === "number") {
        return Math.abs(a2 - b) <= config.EPSILON * Math.max(1, Math.abs(a2), Math.abs(b));
      }
      return false;
    } finally {
      config.EPSILON = oldEpsilon;
    }
  }
  function round(value) {
    return Math.round(value / config.EPSILON) * config.EPSILON;
  }
  function duplicateArray(array) {
    return array.clone ? array.clone() : new Array(array.length);
  }
  function map(value, func, result) {
    if (isArray(value)) {
      const array = value;
      result = result || duplicateArray(array);
      for (let i2 = 0; i2 < result.length && i2 < array.length; ++i2) {
        result[i2] = func(value[i2], i2, result);
      }
      return result;
    }
    return func(value);
  }

  // ../../node_modules/@math.gl/core/dist/esm/classes/base/math-array.js
  function _extendableBuiltin(cls) {
    function ExtendableBuiltin() {
      var instance = Reflect.construct(cls, Array.from(arguments));
      Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
      return instance;
    }
    ExtendableBuiltin.prototype = Object.create(cls.prototype, {
      constructor: {
        value: cls,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(ExtendableBuiltin, cls);
    } else {
      ExtendableBuiltin.__proto__ = cls;
    }
    return ExtendableBuiltin;
  }
  var MathArray = class extends _extendableBuiltin(Array) {
    clone() {
      return new this.constructor().copy(this);
    }
    fromArray(array, offset = 0) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = array[i2 + offset];
      }
      return this.check();
    }
    toArray(targetArray = [], offset = 0) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        targetArray[offset + i2] = this[i2];
      }
      return targetArray;
    }
    from(arrayOrObject) {
      return Array.isArray(arrayOrObject) ? this.copy(arrayOrObject) : this.fromObject(arrayOrObject);
    }
    to(arrayOrObject) {
      if (arrayOrObject === this) {
        return this;
      }
      return isArray(arrayOrObject) ? this.toArray(arrayOrObject) : this.toObject(arrayOrObject);
    }
    toTarget(target) {
      return target ? this.to(target) : this;
    }
    toFloat32Array() {
      return new Float32Array(this);
    }
    toString() {
      return this.formatString(config);
    }
    formatString(opts) {
      let string = "";
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        string += (i2 > 0 ? ", " : "") + formatValue(this[i2], opts);
      }
      return "".concat(opts.printTypes ? this.constructor.name : "", "[").concat(string, "]");
    }
    equals(array) {
      if (!array || this.length !== array.length) {
        return false;
      }
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        if (!equals(this[i2], array[i2])) {
          return false;
        }
      }
      return true;
    }
    exactEquals(array) {
      if (!array || this.length !== array.length) {
        return false;
      }
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        if (this[i2] !== array[i2]) {
          return false;
        }
      }
      return true;
    }
    negate() {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = -this[i2];
      }
      return this.check();
    }
    lerp(a2, b, t2) {
      if (t2 === void 0) {
        return this.lerp(this, a2, b);
      }
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        const ai = a2[i2];
        this[i2] = ai + t2 * (b[i2] - ai);
      }
      return this.check();
    }
    min(vector) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = Math.min(vector[i2], this[i2]);
      }
      return this.check();
    }
    max(vector) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = Math.max(vector[i2], this[i2]);
      }
      return this.check();
    }
    clamp(minVector, maxVector) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = Math.min(Math.max(this[i2], minVector[i2]), maxVector[i2]);
      }
      return this.check();
    }
    add(...vectors) {
      for (const vector of vectors) {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] += vector[i2];
        }
      }
      return this.check();
    }
    subtract(...vectors) {
      for (const vector of vectors) {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] -= vector[i2];
        }
      }
      return this.check();
    }
    scale(scale2) {
      if (typeof scale2 === "number") {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] *= scale2;
        }
      } else {
        for (let i2 = 0; i2 < this.ELEMENTS && i2 < scale2.length; ++i2) {
          this[i2] *= scale2[i2];
        }
      }
      return this.check();
    }
    multiplyByScalar(scalar) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] *= scalar;
      }
      return this.check();
    }
    check() {
      if (config.debug && !this.validate()) {
        throw new Error("math.gl: ".concat(this.constructor.name, " some fields set to invalid numbers'"));
      }
      return this;
    }
    validate() {
      let valid = this.length === this.ELEMENTS;
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        valid = valid && Number.isFinite(this[i2]);
      }
      return valid;
    }
    sub(a2) {
      return this.subtract(a2);
    }
    setScalar(a2) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = a2;
      }
      return this.check();
    }
    addScalar(a2) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] += a2;
      }
      return this.check();
    }
    subScalar(a2) {
      return this.addScalar(-a2);
    }
    multiplyScalar(scalar) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] *= scalar;
      }
      return this.check();
    }
    divideScalar(a2) {
      return this.multiplyByScalar(1 / a2);
    }
    clampScalar(min, max) {
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        this[i2] = Math.min(Math.max(this[i2], min), max);
      }
      return this.check();
    }
    get elements() {
      return this;
    }
  };

  // ../../node_modules/@math.gl/core/dist/esm/lib/validators.js
  function validateVector(v, length2) {
    if (v.length !== length2) {
      return false;
    }
    for (let i2 = 0; i2 < v.length; ++i2) {
      if (!Number.isFinite(v[i2])) {
        return false;
      }
    }
    return true;
  }
  function checkNumber(value) {
    if (!Number.isFinite(value)) {
      throw new Error("Invalid number ".concat(value));
    }
    return value;
  }
  function checkVector(v, length2, callerName = "") {
    if (config.debug && !validateVector(v, length2)) {
      throw new Error("math.gl: ".concat(callerName, " some fields set to invalid numbers'"));
    }
    return v;
  }

  // ../../node_modules/@math.gl/core/dist/esm/classes/base/vector.js
  var Vector = class extends MathArray {
    get x() {
      return this[0];
    }
    set x(value) {
      this[0] = checkNumber(value);
    }
    get y() {
      return this[1];
    }
    set y(value) {
      this[1] = checkNumber(value);
    }
    len() {
      return Math.sqrt(this.lengthSquared());
    }
    magnitude() {
      return this.len();
    }
    lengthSquared() {
      let length2 = 0;
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        length2 += this[i2] * this[i2];
      }
      return length2;
    }
    magnitudeSquared() {
      return this.lengthSquared();
    }
    distance(mathArray) {
      return Math.sqrt(this.distanceSquared(mathArray));
    }
    distanceSquared(mathArray) {
      let length2 = 0;
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        const dist = this[i2] - mathArray[i2];
        length2 += dist * dist;
      }
      return checkNumber(length2);
    }
    dot(mathArray) {
      let product = 0;
      for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
        product += this[i2] * mathArray[i2];
      }
      return checkNumber(product);
    }
    normalize() {
      const length2 = this.magnitude();
      if (length2 !== 0) {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] /= length2;
        }
      }
      return this.check();
    }
    multiply(...vectors) {
      for (const vector of vectors) {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] *= vector[i2];
        }
      }
      return this.check();
    }
    divide(...vectors) {
      for (const vector of vectors) {
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          this[i2] /= vector[i2];
        }
      }
      return this.check();
    }
    lengthSq() {
      return this.lengthSquared();
    }
    distanceTo(vector) {
      return this.distance(vector);
    }
    distanceToSquared(vector) {
      return this.distanceSquared(vector);
    }
    getComponent(i2) {
      assert4(i2 >= 0 && i2 < this.ELEMENTS, "index is out of range");
      return checkNumber(this[i2]);
    }
    setComponent(i2, value) {
      assert4(i2 >= 0 && i2 < this.ELEMENTS, "index is out of range");
      this[i2] = value;
      return this.check();
    }
    addVectors(a2, b) {
      return this.copy(a2).add(b);
    }
    subVectors(a2, b) {
      return this.copy(a2).subtract(b);
    }
    multiplyVectors(a2, b) {
      return this.copy(a2).multiply(b);
    }
    addScaledVector(a2, b) {
      return this.add(new this.constructor(a2).multiplyScalar(b));
    }
  };

  // ../../node_modules/gl-matrix/esm/common.js
  var EPSILON = 1e-6;
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  var degree = Math.PI / 180;
  if (!Math.hypot)
    Math.hypot = function() {
      var y = 0, i2 = arguments.length;
      while (i2--) {
        y += arguments[i2] * arguments[i2];
      }
      return Math.sqrt(y);
    };

  // ../../node_modules/gl-matrix/esm/vec2.js
  function create() {
    var out = new ARRAY_TYPE(2);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
    }
    return out;
  }
  function transformMat4(out, a2, m) {
    var x = a2[0];
    var y = a2[1];
    out[0] = m[0] * x + m[4] * y + m[12];
    out[1] = m[1] * x + m[5] * y + m[13];
    return out;
  }
  var forEach2 = function() {
    var vec = create();
    return function(a2, stride, offset, count, fn, arg) {
      var i2, l2;
      if (!stride) {
        stride = 2;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l2 = Math.min(count * stride + offset, a2.length);
      } else {
        l2 = a2.length;
      }
      for (i2 = offset; i2 < l2; i2 += stride) {
        vec[0] = a2[i2];
        vec[1] = a2[i2 + 1];
        fn(vec, vec, arg);
        a2[i2] = vec[0];
        a2[i2 + 1] = vec[1];
      }
      return a2;
    };
  }();

  // ../../node_modules/@math.gl/core/dist/esm/lib/gl-matrix-extras.js
  function vec2_transformMat4AsVector(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    const w = m[3] * x + m[7] * y || 1;
    out[0] = (m[0] * x + m[4] * y) / w;
    out[1] = (m[1] * x + m[5] * y) / w;
    return out;
  }
  function vec3_transformMat4AsVector(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    const z = a2[2];
    const w = m[3] * x + m[7] * y + m[11] * z || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z) / w;
    return out;
  }
  function vec3_transformMat2(out, a2, m) {
    const x = a2[0];
    const y = a2[1];
    out[0] = m[0] * x + m[2] * y;
    out[1] = m[1] * x + m[3] * y;
    out[2] = a2[2];
    return out;
  }

  // ../../node_modules/gl-matrix/esm/vec3.js
  function create2() {
    var out = new ARRAY_TYPE(3);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  function length(a2) {
    var x = a2[0];
    var y = a2[1];
    var z = a2[2];
    return Math.hypot(x, y, z);
  }
  function dot(a2, b) {
    return a2[0] * b[0] + a2[1] * b[1] + a2[2] * b[2];
  }
  function cross(out, a2, b) {
    var ax = a2[0], ay = a2[1], az = a2[2];
    var bx = b[0], by = b[1], bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  }
  function transformMat42(out, a2, m) {
    var x = a2[0], y = a2[1], z = a2[2];
    var w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  function transformMat3(out, a2, m) {
    var x = a2[0], y = a2[1], z = a2[2];
    out[0] = x * m[0] + y * m[3] + z * m[6];
    out[1] = x * m[1] + y * m[4] + z * m[7];
    out[2] = x * m[2] + y * m[5] + z * m[8];
    return out;
  }
  function transformQuat(out, a2, q) {
    var qx = q[0], qy = q[1], qz = q[2], qw = q[3];
    var x = a2[0], y = a2[1], z = a2[2];
    var uvx = qy * z - qz * y, uvy = qz * x - qx * z, uvz = qx * y - qy * x;
    var uuvx = qy * uvz - qz * uvy, uuvy = qz * uvx - qx * uvz, uuvz = qx * uvy - qy * uvx;
    var w2 = qw * 2;
    uvx *= w2;
    uvy *= w2;
    uvz *= w2;
    uuvx *= 2;
    uuvy *= 2;
    uuvz *= 2;
    out[0] = x + uvx + uuvx;
    out[1] = y + uvy + uuvy;
    out[2] = z + uvz + uuvz;
    return out;
  }
  function rotateX(out, a2, b, rad) {
    var p2 = [], r2 = [];
    p2[0] = a2[0] - b[0];
    p2[1] = a2[1] - b[1];
    p2[2] = a2[2] - b[2];
    r2[0] = p2[0];
    r2[1] = p2[1] * Math.cos(rad) - p2[2] * Math.sin(rad);
    r2[2] = p2[1] * Math.sin(rad) + p2[2] * Math.cos(rad);
    out[0] = r2[0] + b[0];
    out[1] = r2[1] + b[1];
    out[2] = r2[2] + b[2];
    return out;
  }
  function rotateY(out, a2, b, rad) {
    var p2 = [], r2 = [];
    p2[0] = a2[0] - b[0];
    p2[1] = a2[1] - b[1];
    p2[2] = a2[2] - b[2];
    r2[0] = p2[2] * Math.sin(rad) + p2[0] * Math.cos(rad);
    r2[1] = p2[1];
    r2[2] = p2[2] * Math.cos(rad) - p2[0] * Math.sin(rad);
    out[0] = r2[0] + b[0];
    out[1] = r2[1] + b[1];
    out[2] = r2[2] + b[2];
    return out;
  }
  function rotateZ(out, a2, b, rad) {
    var p2 = [], r2 = [];
    p2[0] = a2[0] - b[0];
    p2[1] = a2[1] - b[1];
    p2[2] = a2[2] - b[2];
    r2[0] = p2[0] * Math.cos(rad) - p2[1] * Math.sin(rad);
    r2[1] = p2[0] * Math.sin(rad) + p2[1] * Math.cos(rad);
    r2[2] = p2[2];
    out[0] = r2[0] + b[0];
    out[1] = r2[1] + b[1];
    out[2] = r2[2] + b[2];
    return out;
  }
  function angle(a2, b) {
    var ax = a2[0], ay = a2[1], az = a2[2], bx = b[0], by = b[1], bz = b[2], mag1 = Math.sqrt(ax * ax + ay * ay + az * az), mag2 = Math.sqrt(bx * bx + by * by + bz * bz), mag = mag1 * mag2, cosine = mag && dot(a2, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  }
  var forEach3 = function() {
    var vec = create2();
    return function(a2, stride, offset, count, fn, arg) {
      var i2, l2;
      if (!stride) {
        stride = 3;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l2 = Math.min(count * stride + offset, a2.length);
      } else {
        l2 = a2.length;
      }
      for (i2 = offset; i2 < l2; i2 += stride) {
        vec[0] = a2[i2];
        vec[1] = a2[i2 + 1];
        vec[2] = a2[i2 + 2];
        fn(vec, vec, arg);
        a2[i2] = vec[0];
        a2[i2 + 1] = vec[1];
        a2[i2 + 2] = vec[2];
      }
      return a2;
    };
  }();

  // ../../node_modules/@math.gl/core/dist/esm/classes/vector3.js
  var ORIGIN = [0, 0, 0];
  var ZERO;
  var Vector3 = class extends Vector {
    static get ZERO() {
      if (!ZERO) {
        ZERO = new Vector3(0, 0, 0);
        Object.freeze(ZERO);
      }
      return ZERO;
    }
    constructor(x = 0, y = 0, z = 0) {
      super(-0, -0, -0);
      if (arguments.length === 1 && isArray(x)) {
        this.copy(x);
      } else {
        if (config.debug) {
          checkNumber(x);
          checkNumber(y);
          checkNumber(z);
        }
        this[0] = x;
        this[1] = y;
        this[2] = z;
      }
    }
    set(x, y, z) {
      this[0] = x;
      this[1] = y;
      this[2] = z;
      return this.check();
    }
    copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      this[2] = array[2];
      return this.check();
    }
    fromObject(object) {
      if (config.debug) {
        checkNumber(object.x);
        checkNumber(object.y);
        checkNumber(object.z);
      }
      this[0] = object.x;
      this[1] = object.y;
      this[2] = object.z;
      return this.check();
    }
    toObject(object) {
      object.x = this[0];
      object.y = this[1];
      object.z = this[2];
      return object;
    }
    get ELEMENTS() {
      return 3;
    }
    get z() {
      return this[2];
    }
    set z(value) {
      this[2] = checkNumber(value);
    }
    angle(vector) {
      return angle(this, vector);
    }
    cross(vector) {
      cross(this, this, vector);
      return this.check();
    }
    rotateX({
      radians: radians2,
      origin = ORIGIN
    }) {
      rotateX(this, this, origin, radians2);
      return this.check();
    }
    rotateY({
      radians: radians2,
      origin = ORIGIN
    }) {
      rotateY(this, this, origin, radians2);
      return this.check();
    }
    rotateZ({
      radians: radians2,
      origin = ORIGIN
    }) {
      rotateZ(this, this, origin, radians2);
      return this.check();
    }
    transform(matrix4) {
      return this.transformAsPoint(matrix4);
    }
    transformAsPoint(matrix4) {
      transformMat42(this, this, matrix4);
      return this.check();
    }
    transformAsVector(matrix4) {
      vec3_transformMat4AsVector(this, this, matrix4);
      return this.check();
    }
    transformByMatrix3(matrix3) {
      transformMat3(this, this, matrix3);
      return this.check();
    }
    transformByMatrix2(matrix2) {
      vec3_transformMat2(this, this, matrix2);
      return this.check();
    }
    transformByQuaternion(quaternion) {
      transformQuat(this, this, quaternion);
      return this.check();
    }
  };

  // ../../node_modules/@math.gl/core/dist/esm/classes/base/matrix.js
  var Matrix = class extends MathArray {
    toString() {
      let string = "[";
      if (config.printRowMajor) {
        string += "row-major:";
        for (let row = 0; row < this.RANK; ++row) {
          for (let col = 0; col < this.RANK; ++col) {
            string += " ".concat(this[col * this.RANK + row]);
          }
        }
      } else {
        string += "column-major:";
        for (let i2 = 0; i2 < this.ELEMENTS; ++i2) {
          string += " ".concat(this[i2]);
        }
      }
      string += "]";
      return string;
    }
    getElementIndex(row, col) {
      return col * this.RANK + row;
    }
    getElement(row, col) {
      return this[col * this.RANK + row];
    }
    setElement(row, col, value) {
      this[col * this.RANK + row] = checkNumber(value);
      return this;
    }
    getColumn(columnIndex, result = new Array(this.RANK).fill(-0)) {
      const firstIndex = columnIndex * this.RANK;
      for (let i2 = 0; i2 < this.RANK; ++i2) {
        result[i2] = this[firstIndex + i2];
      }
      return result;
    }
    setColumn(columnIndex, columnVector) {
      const firstIndex = columnIndex * this.RANK;
      for (let i2 = 0; i2 < this.RANK; ++i2) {
        this[firstIndex + i2] = columnVector[i2];
      }
      return this;
    }
  };

  // ../../node_modules/gl-matrix/esm/mat4.js
  function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function transpose(out, a2) {
    if (out === a2) {
      var a01 = a2[1], a02 = a2[2], a03 = a2[3];
      var a12 = a2[6], a13 = a2[7];
      var a23 = a2[11];
      out[1] = a2[4];
      out[2] = a2[8];
      out[3] = a2[12];
      out[4] = a01;
      out[6] = a2[9];
      out[7] = a2[13];
      out[8] = a02;
      out[9] = a12;
      out[11] = a2[14];
      out[12] = a03;
      out[13] = a13;
      out[14] = a23;
    } else {
      out[0] = a2[0];
      out[1] = a2[4];
      out[2] = a2[8];
      out[3] = a2[12];
      out[4] = a2[1];
      out[5] = a2[5];
      out[6] = a2[9];
      out[7] = a2[13];
      out[8] = a2[2];
      out[9] = a2[6];
      out[10] = a2[10];
      out[11] = a2[14];
      out[12] = a2[3];
      out[13] = a2[7];
      out[14] = a2[11];
      out[15] = a2[15];
    }
    return out;
  }
  function invert(out, a2) {
    var a00 = a2[0], a01 = a2[1], a02 = a2[2], a03 = a2[3];
    var a10 = a2[4], a11 = a2[5], a12 = a2[6], a13 = a2[7];
    var a20 = a2[8], a21 = a2[9], a22 = a2[10], a23 = a2[11];
    var a30 = a2[12], a31 = a2[13], a32 = a2[14], a33 = a2[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    var det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  }
  function determinant(a2) {
    var a00 = a2[0], a01 = a2[1], a02 = a2[2], a03 = a2[3];
    var a10 = a2[4], a11 = a2[5], a12 = a2[6], a13 = a2[7];
    var a20 = a2[8], a21 = a2[9], a22 = a2[10], a23 = a2[11];
    var a30 = a2[12], a31 = a2[13], a32 = a2[14], a33 = a2[15];
    var b00 = a00 * a11 - a01 * a10;
    var b01 = a00 * a12 - a02 * a10;
    var b02 = a00 * a13 - a03 * a10;
    var b03 = a01 * a12 - a02 * a11;
    var b04 = a01 * a13 - a03 * a11;
    var b05 = a02 * a13 - a03 * a12;
    var b06 = a20 * a31 - a21 * a30;
    var b07 = a20 * a32 - a22 * a30;
    var b08 = a20 * a33 - a23 * a30;
    var b09 = a21 * a32 - a22 * a31;
    var b10 = a21 * a33 - a23 * a31;
    var b11 = a22 * a33 - a23 * a32;
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  }
  function multiply(out, a2, b) {
    var a00 = a2[0], a01 = a2[1], a02 = a2[2], a03 = a2[3];
    var a10 = a2[4], a11 = a2[5], a12 = a2[6], a13 = a2[7];
    var a20 = a2[8], a21 = a2[9], a22 = a2[10], a23 = a2[11];
    var a30 = a2[12], a31 = a2[13], a32 = a2[14], a33 = a2[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  function translate(out, a2, v) {
    var x = v[0], y = v[1], z = v[2];
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    if (a2 === out) {
      out[12] = a2[0] * x + a2[4] * y + a2[8] * z + a2[12];
      out[13] = a2[1] * x + a2[5] * y + a2[9] * z + a2[13];
      out[14] = a2[2] * x + a2[6] * y + a2[10] * z + a2[14];
      out[15] = a2[3] * x + a2[7] * y + a2[11] * z + a2[15];
    } else {
      a00 = a2[0];
      a01 = a2[1];
      a02 = a2[2];
      a03 = a2[3];
      a10 = a2[4];
      a11 = a2[5];
      a12 = a2[6];
      a13 = a2[7];
      a20 = a2[8];
      a21 = a2[9];
      a22 = a2[10];
      a23 = a2[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + a2[12];
      out[13] = a01 * x + a11 * y + a21 * z + a2[13];
      out[14] = a02 * x + a12 * y + a22 * z + a2[14];
      out[15] = a03 * x + a13 * y + a23 * z + a2[15];
    }
    return out;
  }
  function scale(out, a2, v) {
    var x = v[0], y = v[1], z = v[2];
    out[0] = a2[0] * x;
    out[1] = a2[1] * x;
    out[2] = a2[2] * x;
    out[3] = a2[3] * x;
    out[4] = a2[4] * y;
    out[5] = a2[5] * y;
    out[6] = a2[6] * y;
    out[7] = a2[7] * y;
    out[8] = a2[8] * z;
    out[9] = a2[9] * z;
    out[10] = a2[10] * z;
    out[11] = a2[11] * z;
    out[12] = a2[12];
    out[13] = a2[13];
    out[14] = a2[14];
    out[15] = a2[15];
    return out;
  }
  function rotate(out, a2, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2];
    var len = Math.hypot(x, y, z);
    var s2, c2, t2;
    var a00, a01, a02, a03;
    var a10, a11, a12, a13;
    var a20, a21, a22, a23;
    var b00, b01, b02;
    var b10, b11, b12;
    var b20, b21, b22;
    if (len < EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    s2 = Math.sin(rad);
    c2 = Math.cos(rad);
    t2 = 1 - c2;
    a00 = a2[0];
    a01 = a2[1];
    a02 = a2[2];
    a03 = a2[3];
    a10 = a2[4];
    a11 = a2[5];
    a12 = a2[6];
    a13 = a2[7];
    a20 = a2[8];
    a21 = a2[9];
    a22 = a2[10];
    a23 = a2[11];
    b00 = x * x * t2 + c2;
    b01 = y * x * t2 + z * s2;
    b02 = z * x * t2 - y * s2;
    b10 = x * y * t2 - z * s2;
    b11 = y * y * t2 + c2;
    b12 = z * y * t2 + x * s2;
    b20 = x * z * t2 + y * s2;
    b21 = y * z * t2 - x * s2;
    b22 = z * z * t2 + c2;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a2 !== out) {
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    return out;
  }
  function rotateX2(out, a2, rad) {
    var s2 = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a10 = a2[4];
    var a11 = a2[5];
    var a12 = a2[6];
    var a13 = a2[7];
    var a20 = a2[8];
    var a21 = a2[9];
    var a22 = a2[10];
    var a23 = a2[11];
    if (a2 !== out) {
      out[0] = a2[0];
      out[1] = a2[1];
      out[2] = a2[2];
      out[3] = a2[3];
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    out[4] = a10 * c2 + a20 * s2;
    out[5] = a11 * c2 + a21 * s2;
    out[6] = a12 * c2 + a22 * s2;
    out[7] = a13 * c2 + a23 * s2;
    out[8] = a20 * c2 - a10 * s2;
    out[9] = a21 * c2 - a11 * s2;
    out[10] = a22 * c2 - a12 * s2;
    out[11] = a23 * c2 - a13 * s2;
    return out;
  }
  function rotateY2(out, a2, rad) {
    var s2 = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a00 = a2[0];
    var a01 = a2[1];
    var a02 = a2[2];
    var a03 = a2[3];
    var a20 = a2[8];
    var a21 = a2[9];
    var a22 = a2[10];
    var a23 = a2[11];
    if (a2 !== out) {
      out[4] = a2[4];
      out[5] = a2[5];
      out[6] = a2[6];
      out[7] = a2[7];
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    out[0] = a00 * c2 - a20 * s2;
    out[1] = a01 * c2 - a21 * s2;
    out[2] = a02 * c2 - a22 * s2;
    out[3] = a03 * c2 - a23 * s2;
    out[8] = a00 * s2 + a20 * c2;
    out[9] = a01 * s2 + a21 * c2;
    out[10] = a02 * s2 + a22 * c2;
    out[11] = a03 * s2 + a23 * c2;
    return out;
  }
  function rotateZ2(out, a2, rad) {
    var s2 = Math.sin(rad);
    var c2 = Math.cos(rad);
    var a00 = a2[0];
    var a01 = a2[1];
    var a02 = a2[2];
    var a03 = a2[3];
    var a10 = a2[4];
    var a11 = a2[5];
    var a12 = a2[6];
    var a13 = a2[7];
    if (a2 !== out) {
      out[8] = a2[8];
      out[9] = a2[9];
      out[10] = a2[10];
      out[11] = a2[11];
      out[12] = a2[12];
      out[13] = a2[13];
      out[14] = a2[14];
      out[15] = a2[15];
    }
    out[0] = a00 * c2 + a10 * s2;
    out[1] = a01 * c2 + a11 * s2;
    out[2] = a02 * c2 + a12 * s2;
    out[3] = a03 * c2 + a13 * s2;
    out[4] = a10 * c2 - a00 * s2;
    out[5] = a11 * c2 - a01 * s2;
    out[6] = a12 * c2 - a02 * s2;
    out[7] = a13 * c2 - a03 * s2;
    return out;
  }
  function fromQuat(out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3];
    var x2 = x + x;
    var y2 = y + y;
    var z2 = z + z;
    var xx = x * x2;
    var yx = y * x2;
    var yy = y * y2;
    var zx = z * x2;
    var zy = z * y2;
    var zz = z * z2;
    var wx = w * x2;
    var wy = w * y2;
    var wz = w * z2;
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;
    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;
    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  }
  function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left);
    var tb = 1 / (top - bottom);
    var nf = 1 / (near - far);
    out[0] = near * 2 * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = near * 2 * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = far * near * 2 * nf;
    out[15] = 0;
    return out;
  }
  function perspectiveNO(out, fovy, aspect, near, far) {
    var f2 = 1 / Math.tan(fovy / 2), nf;
    out[0] = f2 / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f2;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[15] = 0;
    if (far != null && far !== Infinity) {
      nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }
  var perspective = perspectiveNO;
  function orthoNO(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right);
    var bt = 1 / (bottom - top);
    var nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
  }
  var ortho = orthoNO;
  function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    var eyex = eye[0];
    var eyey = eye[1];
    var eyez = eye[2];
    var upx = up[0];
    var upy = up[1];
    var upz = up[2];
    var centerx = center[0];
    var centery = center[1];
    var centerz = center[2];
    if (Math.abs(eyex - centerx) < EPSILON && Math.abs(eyey - centery) < EPSILON && Math.abs(eyez - centerz) < EPSILON) {
      return identity(out);
    }
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.hypot(x0, x1, x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = Math.hypot(y0, y1, y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;
    return out;
  }

  // ../../node_modules/gl-matrix/esm/vec4.js
  function create3() {
    var out = new ARRAY_TYPE(4);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }
    return out;
  }
  function transformMat43(out, a2, m) {
    var x = a2[0], y = a2[1], z = a2[2], w = a2[3];
    out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
    out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
    out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
    out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
    return out;
  }
  var forEach4 = function() {
    var vec = create3();
    return function(a2, stride, offset, count, fn, arg) {
      var i2, l2;
      if (!stride) {
        stride = 4;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l2 = Math.min(count * stride + offset, a2.length);
      } else {
        l2 = a2.length;
      }
      for (i2 = offset; i2 < l2; i2 += stride) {
        vec[0] = a2[i2];
        vec[1] = a2[i2 + 1];
        vec[2] = a2[i2 + 2];
        vec[3] = a2[i2 + 3];
        fn(vec, vec, arg);
        a2[i2] = vec[0];
        a2[i2 + 1] = vec[1];
        a2[i2 + 2] = vec[2];
        a2[i2 + 3] = vec[3];
      }
      return a2;
    };
  }();

  // ../../node_modules/@math.gl/core/dist/esm/classes/matrix4.js
  var INDICES;
  (function(INDICES2) {
    INDICES2[INDICES2["COL0ROW0"] = 0] = "COL0ROW0";
    INDICES2[INDICES2["COL0ROW1"] = 1] = "COL0ROW1";
    INDICES2[INDICES2["COL0ROW2"] = 2] = "COL0ROW2";
    INDICES2[INDICES2["COL0ROW3"] = 3] = "COL0ROW3";
    INDICES2[INDICES2["COL1ROW0"] = 4] = "COL1ROW0";
    INDICES2[INDICES2["COL1ROW1"] = 5] = "COL1ROW1";
    INDICES2[INDICES2["COL1ROW2"] = 6] = "COL1ROW2";
    INDICES2[INDICES2["COL1ROW3"] = 7] = "COL1ROW3";
    INDICES2[INDICES2["COL2ROW0"] = 8] = "COL2ROW0";
    INDICES2[INDICES2["COL2ROW1"] = 9] = "COL2ROW1";
    INDICES2[INDICES2["COL2ROW2"] = 10] = "COL2ROW2";
    INDICES2[INDICES2["COL2ROW3"] = 11] = "COL2ROW3";
    INDICES2[INDICES2["COL3ROW0"] = 12] = "COL3ROW0";
    INDICES2[INDICES2["COL3ROW1"] = 13] = "COL3ROW1";
    INDICES2[INDICES2["COL3ROW2"] = 14] = "COL3ROW2";
    INDICES2[INDICES2["COL3ROW3"] = 15] = "COL3ROW3";
  })(INDICES || (INDICES = {}));
  var DEFAULT_FOVY = 45 * Math.PI / 180;
  var DEFAULT_ASPECT = 1;
  var DEFAULT_NEAR = 0.1;
  var DEFAULT_FAR = 500;
  var IDENTITY_MATRIX = Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  var Matrix4 = class extends Matrix {
    static get IDENTITY() {
      return getIdentityMatrix();
    }
    static get ZERO() {
      return getZeroMatrix();
    }
    get ELEMENTS() {
      return 16;
    }
    get RANK() {
      return 4;
    }
    get INDICES() {
      return INDICES;
    }
    constructor(array) {
      super(-0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0);
      if (arguments.length === 1 && Array.isArray(array)) {
        this.copy(array);
      } else {
        this.identity();
      }
    }
    copy(array) {
      this[0] = array[0];
      this[1] = array[1];
      this[2] = array[2];
      this[3] = array[3];
      this[4] = array[4];
      this[5] = array[5];
      this[6] = array[6];
      this[7] = array[7];
      this[8] = array[8];
      this[9] = array[9];
      this[10] = array[10];
      this[11] = array[11];
      this[12] = array[12];
      this[13] = array[13];
      this[14] = array[14];
      this[15] = array[15];
      return this.check();
    }
    set(m00, m10, m20, m30, m01, m11, m21, m31, m02, m12, m22, m32, m03, m13, m23, m33) {
      this[0] = m00;
      this[1] = m10;
      this[2] = m20;
      this[3] = m30;
      this[4] = m01;
      this[5] = m11;
      this[6] = m21;
      this[7] = m31;
      this[8] = m02;
      this[9] = m12;
      this[10] = m22;
      this[11] = m32;
      this[12] = m03;
      this[13] = m13;
      this[14] = m23;
      this[15] = m33;
      return this.check();
    }
    setRowMajor(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
      this[0] = m00;
      this[1] = m10;
      this[2] = m20;
      this[3] = m30;
      this[4] = m01;
      this[5] = m11;
      this[6] = m21;
      this[7] = m31;
      this[8] = m02;
      this[9] = m12;
      this[10] = m22;
      this[11] = m32;
      this[12] = m03;
      this[13] = m13;
      this[14] = m23;
      this[15] = m33;
      return this.check();
    }
    toRowMajor(result) {
      result[0] = this[0];
      result[1] = this[4];
      result[2] = this[8];
      result[3] = this[12];
      result[4] = this[1];
      result[5] = this[5];
      result[6] = this[9];
      result[7] = this[13];
      result[8] = this[2];
      result[9] = this[6];
      result[10] = this[10];
      result[11] = this[14];
      result[12] = this[3];
      result[13] = this[7];
      result[14] = this[11];
      result[15] = this[15];
      return result;
    }
    identity() {
      return this.copy(IDENTITY_MATRIX);
    }
    fromObject(object) {
      return this.check();
    }
    fromQuaternion(quaternion) {
      fromQuat(this, quaternion);
      return this.check();
    }
    frustum(view) {
      const {
        left,
        right,
        bottom,
        top,
        near = DEFAULT_NEAR,
        far = DEFAULT_FAR
      } = view;
      if (far === Infinity) {
        computeInfinitePerspectiveOffCenter(this, left, right, bottom, top, near);
      } else {
        frustum(this, left, right, bottom, top, near, far);
      }
      return this.check();
    }
    lookAt(view) {
      const {
        eye,
        center = [0, 0, 0],
        up = [0, 1, 0]
      } = view;
      lookAt(this, eye, center, up);
      return this.check();
    }
    ortho(view) {
      const {
        left,
        right,
        bottom,
        top,
        near = DEFAULT_NEAR,
        far = DEFAULT_FAR
      } = view;
      ortho(this, left, right, bottom, top, near, far);
      return this.check();
    }
    orthographic(view) {
      const {
        fovy = DEFAULT_FOVY,
        aspect = DEFAULT_ASPECT,
        focalDistance = 1,
        near = DEFAULT_NEAR,
        far = DEFAULT_FAR
      } = view;
      checkRadians(fovy);
      const halfY = fovy / 2;
      const top = focalDistance * Math.tan(halfY);
      const right = top * aspect;
      return this.ortho({
        left: -right,
        right,
        bottom: -top,
        top,
        near,
        far
      });
    }
    perspective(view) {
      const {
        fovy = 45 * Math.PI / 180,
        aspect = 1,
        near = 0.1,
        far = 500
      } = view;
      checkRadians(fovy);
      perspective(this, fovy, aspect, near, far);
      return this.check();
    }
    determinant() {
      return determinant(this);
    }
    getScale(result = [-0, -0, -0]) {
      result[0] = Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);
      result[1] = Math.sqrt(this[4] * this[4] + this[5] * this[5] + this[6] * this[6]);
      result[2] = Math.sqrt(this[8] * this[8] + this[9] * this[9] + this[10] * this[10]);
      return result;
    }
    getTranslation(result = [-0, -0, -0]) {
      result[0] = this[12];
      result[1] = this[13];
      result[2] = this[14];
      return result;
    }
    getRotation(result, scaleResult) {
      result = result || [-0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0, -0];
      scaleResult = scaleResult || [-0, -0, -0];
      const scale2 = this.getScale(scaleResult);
      const inverseScale0 = 1 / scale2[0];
      const inverseScale1 = 1 / scale2[1];
      const inverseScale2 = 1 / scale2[2];
      result[0] = this[0] * inverseScale0;
      result[1] = this[1] * inverseScale1;
      result[2] = this[2] * inverseScale2;
      result[3] = 0;
      result[4] = this[4] * inverseScale0;
      result[5] = this[5] * inverseScale1;
      result[6] = this[6] * inverseScale2;
      result[7] = 0;
      result[8] = this[8] * inverseScale0;
      result[9] = this[9] * inverseScale1;
      result[10] = this[10] * inverseScale2;
      result[11] = 0;
      result[12] = 0;
      result[13] = 0;
      result[14] = 0;
      result[15] = 1;
      return result;
    }
    getRotationMatrix3(result, scaleResult) {
      result = result || [-0, -0, -0, -0, -0, -0, -0, -0, -0];
      scaleResult = scaleResult || [-0, -0, -0];
      const scale2 = this.getScale(scaleResult);
      const inverseScale0 = 1 / scale2[0];
      const inverseScale1 = 1 / scale2[1];
      const inverseScale2 = 1 / scale2[2];
      result[0] = this[0] * inverseScale0;
      result[1] = this[1] * inverseScale1;
      result[2] = this[2] * inverseScale2;
      result[3] = this[4] * inverseScale0;
      result[4] = this[5] * inverseScale1;
      result[5] = this[6] * inverseScale2;
      result[6] = this[8] * inverseScale0;
      result[7] = this[9] * inverseScale1;
      result[8] = this[10] * inverseScale2;
      return result;
    }
    transpose() {
      transpose(this, this);
      return this.check();
    }
    invert() {
      invert(this, this);
      return this.check();
    }
    multiplyLeft(a2) {
      multiply(this, a2, this);
      return this.check();
    }
    multiplyRight(a2) {
      multiply(this, this, a2);
      return this.check();
    }
    rotateX(radians2) {
      rotateX2(this, this, radians2);
      return this.check();
    }
    rotateY(radians2) {
      rotateY2(this, this, radians2);
      return this.check();
    }
    rotateZ(radians2) {
      rotateZ2(this, this, radians2);
      return this.check();
    }
    rotateXYZ(angleXYZ) {
      return this.rotateX(angleXYZ[0]).rotateY(angleXYZ[1]).rotateZ(angleXYZ[2]);
    }
    rotateAxis(radians2, axis) {
      rotate(this, this, radians2, axis);
      return this.check();
    }
    scale(factor) {
      scale(this, this, Array.isArray(factor) ? factor : [factor, factor, factor]);
      return this.check();
    }
    translate(vector) {
      translate(this, this, vector);
      return this.check();
    }
    transform(vector, result) {
      if (vector.length === 4) {
        result = transformMat43(result || [-0, -0, -0, -0], vector, this);
        checkVector(result, 4);
        return result;
      }
      return this.transformAsPoint(vector, result);
    }
    transformAsPoint(vector, result) {
      const {
        length: length2
      } = vector;
      let out;
      switch (length2) {
        case 2:
          out = transformMat4(result || [-0, -0], vector, this);
          break;
        case 3:
          out = transformMat42(result || [-0, -0, -0], vector, this);
          break;
        default:
          throw new Error("Illegal vector");
      }
      checkVector(out, vector.length);
      return out;
    }
    transformAsVector(vector, result) {
      let out;
      switch (vector.length) {
        case 2:
          out = vec2_transformMat4AsVector(result || [-0, -0], vector, this);
          break;
        case 3:
          out = vec3_transformMat4AsVector(result || [-0, -0, -0], vector, this);
          break;
        default:
          throw new Error("Illegal vector");
      }
      checkVector(out, vector.length);
      return out;
    }
    transformPoint(vector, result) {
      return this.transformAsPoint(vector, result);
    }
    transformVector(vector, result) {
      return this.transformAsPoint(vector, result);
    }
    transformDirection(vector, result) {
      return this.transformAsVector(vector, result);
    }
    makeRotationX(radians2) {
      return this.identity().rotateX(radians2);
    }
    makeTranslation(x, y, z) {
      return this.identity().translate([x, y, z]);
    }
  };
  var ZERO2;
  var IDENTITY;
  function getZeroMatrix() {
    if (!ZERO2) {
      ZERO2 = new Matrix4([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      Object.freeze(ZERO2);
    }
    return ZERO2;
  }
  function getIdentityMatrix() {
    if (!IDENTITY) {
      IDENTITY = new Matrix4();
      Object.freeze(IDENTITY);
    }
    return IDENTITY;
  }
  function checkRadians(possiblyDegrees) {
    if (possiblyDegrees > Math.PI * 2) {
      throw Error("expected radians");
    }
  }
  function computeInfinitePerspectiveOffCenter(result, left, right, bottom, top, near) {
    const column0Row0 = 2 * near / (right - left);
    const column1Row1 = 2 * near / (top - bottom);
    const column2Row0 = (right + left) / (right - left);
    const column2Row1 = (top + bottom) / (top - bottom);
    const column2Row2 = -1;
    const column2Row3 = -1;
    const column3Row2 = -2 * near;
    result[0] = column0Row0;
    result[1] = 0;
    result[2] = 0;
    result[3] = 0;
    result[4] = 0;
    result[5] = column1Row1;
    result[6] = 0;
    result[7] = 0;
    result[8] = column2Row0;
    result[9] = column2Row1;
    result[10] = column2Row2;
    result[11] = column2Row3;
    result[12] = 0;
    result[13] = 0;
    result[14] = column3Row2;
    result[15] = 0;
    return result;
  }

  // ../../node_modules/@math.gl/core/dist/esm/lib/math-utils.js
  var math_utils_default = {
    EPSILON1: 0.1,
    EPSILON2: 0.01,
    EPSILON3: 1e-3,
    EPSILON4: 1e-4,
    EPSILON5: 1e-5,
    EPSILON6: 1e-6,
    EPSILON7: 1e-7,
    EPSILON8: 1e-8,
    EPSILON9: 1e-9,
    EPSILON10: 1e-10,
    EPSILON11: 1e-11,
    EPSILON12: 1e-12,
    EPSILON13: 1e-13,
    EPSILON14: 1e-14,
    EPSILON15: 1e-15,
    EPSILON16: 1e-16,
    EPSILON17: 1e-17,
    EPSILON18: 1e-18,
    EPSILON19: 1e-19,
    EPSILON20: 1e-20,
    PI_OVER_TWO: Math.PI / 2,
    PI_OVER_FOUR: Math.PI / 4,
    PI_OVER_SIX: Math.PI / 6,
    TWO_PI: Math.PI * 2
  };

  // ../../node_modules/@math.gl/geospatial/dist/esm/constants.js
  var WGS84_RADIUS_X = 6378137;
  var WGS84_RADIUS_Y = 6378137;
  var WGS84_RADIUS_Z = 6356752314245179e-9;
  var WGS84_CONSTANTS = {
    radii: [WGS84_RADIUS_X, WGS84_RADIUS_Y, WGS84_RADIUS_Z],
    radiiSquared: [WGS84_RADIUS_X * WGS84_RADIUS_X, WGS84_RADIUS_Y * WGS84_RADIUS_Y, WGS84_RADIUS_Z * WGS84_RADIUS_Z],
    oneOverRadii: [1 / WGS84_RADIUS_X, 1 / WGS84_RADIUS_Y, 1 / WGS84_RADIUS_Z],
    oneOverRadiiSquared: [1 / (WGS84_RADIUS_X * WGS84_RADIUS_X), 1 / (WGS84_RADIUS_Y * WGS84_RADIUS_Y), 1 / (WGS84_RADIUS_Z * WGS84_RADIUS_Z)],
    maximumRadius: Math.max(WGS84_RADIUS_X, WGS84_RADIUS_Y, WGS84_RADIUS_Z),
    centerToleranceSquared: 0.1
  };

  // ../../node_modules/@math.gl/geospatial/dist/esm/type-utils.js
  function identity2(x) {
    return x;
  }
  var scratchVector = new Vector3();
  function fromCartographic(cartographic, result = [], map2 = identity2) {
    if ("longitude" in cartographic) {
      result[0] = map2(cartographic.longitude);
      result[1] = map2(cartographic.latitude);
      result[2] = cartographic.height;
    } else if ("x" in cartographic) {
      result[0] = map2(cartographic.x);
      result[1] = map2(cartographic.y);
      result[2] = cartographic.z;
    } else {
      result[0] = map2(cartographic[0]);
      result[1] = map2(cartographic[1]);
      result[2] = cartographic[2];
    }
    return result;
  }
  function fromCartographicToRadians(cartographic, vector = []) {
    return fromCartographic(cartographic, vector, config._cartographicRadians ? identity2 : toRadians);
  }
  function toCartographic(vector, cartographic, map2 = identity2) {
    if ("longitude" in cartographic) {
      cartographic.longitude = map2(vector[0]);
      cartographic.latitude = map2(vector[1]);
      cartographic.height = vector[2];
    } else if ("x" in cartographic) {
      cartographic.x = map2(vector[0]);
      cartographic.y = map2(vector[1]);
      cartographic.z = vector[2];
    } else {
      cartographic[0] = map2(vector[0]);
      cartographic[1] = map2(vector[1]);
      cartographic[2] = vector[2];
    }
    return cartographic;
  }
  function toCartographicFromRadians(vector, cartographic) {
    return toCartographic(vector, cartographic, config._cartographicRadians ? identity2 : toDegrees);
  }

  // ../../node_modules/@math.gl/geospatial/dist/esm/ellipsoid/helpers/scale-to-geodetic-surface.js
  var scratchVector2 = new Vector3();
  var scaleToGeodeticSurfaceIntersection = new Vector3();
  var scaleToGeodeticSurfaceGradient = new Vector3();
  function scaleToGeodeticSurface(cartesian, ellipsoid, result = []) {
    const {
      oneOverRadii,
      oneOverRadiiSquared,
      centerToleranceSquared
    } = ellipsoid;
    scratchVector2.from(cartesian);
    const positionX = scratchVector2.x;
    const positionY = scratchVector2.y;
    const positionZ = scratchVector2.z;
    const oneOverRadiiX = oneOverRadii.x;
    const oneOverRadiiY = oneOverRadii.y;
    const oneOverRadiiZ = oneOverRadii.z;
    const x2 = positionX * positionX * oneOverRadiiX * oneOverRadiiX;
    const y2 = positionY * positionY * oneOverRadiiY * oneOverRadiiY;
    const z2 = positionZ * positionZ * oneOverRadiiZ * oneOverRadiiZ;
    const squaredNorm = x2 + y2 + z2;
    const ratio = Math.sqrt(1 / squaredNorm);
    if (!Number.isFinite(ratio)) {
      return void 0;
    }
    const intersection = scaleToGeodeticSurfaceIntersection;
    intersection.copy(cartesian).scale(ratio);
    if (squaredNorm < centerToleranceSquared) {
      return intersection.to(result);
    }
    const oneOverRadiiSquaredX = oneOverRadiiSquared.x;
    const oneOverRadiiSquaredY = oneOverRadiiSquared.y;
    const oneOverRadiiSquaredZ = oneOverRadiiSquared.z;
    const gradient = scaleToGeodeticSurfaceGradient;
    gradient.set(intersection.x * oneOverRadiiSquaredX * 2, intersection.y * oneOverRadiiSquaredY * 2, intersection.z * oneOverRadiiSquaredZ * 2);
    let lambda = (1 - ratio) * scratchVector2.len() / (0.5 * gradient.len());
    let correction = 0;
    let xMultiplier;
    let yMultiplier;
    let zMultiplier;
    let func;
    do {
      lambda -= correction;
      xMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredX);
      yMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredY);
      zMultiplier = 1 / (1 + lambda * oneOverRadiiSquaredZ);
      const xMultiplier2 = xMultiplier * xMultiplier;
      const yMultiplier2 = yMultiplier * yMultiplier;
      const zMultiplier2 = zMultiplier * zMultiplier;
      const xMultiplier3 = xMultiplier2 * xMultiplier;
      const yMultiplier3 = yMultiplier2 * yMultiplier;
      const zMultiplier3 = zMultiplier2 * zMultiplier;
      func = x2 * xMultiplier2 + y2 * yMultiplier2 + z2 * zMultiplier2 - 1;
      const denominator = x2 * xMultiplier3 * oneOverRadiiSquaredX + y2 * yMultiplier3 * oneOverRadiiSquaredY + z2 * zMultiplier3 * oneOverRadiiSquaredZ;
      const derivative = -2 * denominator;
      correction = func / derivative;
    } while (Math.abs(func) > math_utils_default.EPSILON12);
    return scratchVector2.scale([xMultiplier, yMultiplier, zMultiplier]).to(result);
  }

  // ../../node_modules/@math.gl/geospatial/dist/esm/ellipsoid/helpers/ellipsoid-transform.js
  var EPSILON14 = 1e-14;
  var scratchOrigin = new Vector3();
  var VECTOR_PRODUCT_LOCAL_FRAME = {
    up: {
      south: "east",
      north: "west",
      west: "south",
      east: "north"
    },
    down: {
      south: "west",
      north: "east",
      west: "north",
      east: "south"
    },
    south: {
      up: "west",
      down: "east",
      west: "down",
      east: "up"
    },
    north: {
      up: "east",
      down: "west",
      west: "up",
      east: "down"
    },
    west: {
      up: "north",
      down: "south",
      north: "down",
      south: "up"
    },
    east: {
      up: "south",
      down: "north",
      north: "up",
      south: "down"
    }
  };
  var degeneratePositionLocalFrame = {
    north: [-1, 0, 0],
    east: [0, 1, 0],
    up: [0, 0, 1],
    south: [1, 0, 0],
    west: [0, -1, 0],
    down: [0, 0, -1]
  };
  var scratchAxisVectors = {
    east: new Vector3(),
    north: new Vector3(),
    up: new Vector3(),
    west: new Vector3(),
    south: new Vector3(),
    down: new Vector3()
  };
  var scratchVector1 = new Vector3();
  var scratchVector22 = new Vector3();
  var scratchVector3 = new Vector3();
  function localFrameToFixedFrame(ellipsoid, firstAxis, secondAxis, thirdAxis, cartesianOrigin, result) {
    const thirdAxisInferred = VECTOR_PRODUCT_LOCAL_FRAME[firstAxis] && VECTOR_PRODUCT_LOCAL_FRAME[firstAxis][secondAxis];
    assert4(thirdAxisInferred && (!thirdAxis || thirdAxis === thirdAxisInferred));
    let firstAxisVector;
    let secondAxisVector;
    let thirdAxisVector;
    const origin = scratchOrigin.copy(cartesianOrigin);
    const atPole = equals(origin.x, 0, EPSILON14) && equals(origin.y, 0, EPSILON14);
    if (atPole) {
      const sign = Math.sign(origin.z);
      firstAxisVector = scratchVector1.fromArray(degeneratePositionLocalFrame[firstAxis]);
      if (firstAxis !== "east" && firstAxis !== "west") {
        firstAxisVector.scale(sign);
      }
      secondAxisVector = scratchVector22.fromArray(degeneratePositionLocalFrame[secondAxis]);
      if (secondAxis !== "east" && secondAxis !== "west") {
        secondAxisVector.scale(sign);
      }
      thirdAxisVector = scratchVector3.fromArray(degeneratePositionLocalFrame[thirdAxis]);
      if (thirdAxis !== "east" && thirdAxis !== "west") {
        thirdAxisVector.scale(sign);
      }
    } else {
      const {
        up,
        east,
        north
      } = scratchAxisVectors;
      east.set(-origin.y, origin.x, 0).normalize();
      ellipsoid.geodeticSurfaceNormal(origin, up);
      north.copy(up).cross(east);
      const {
        down,
        west,
        south
      } = scratchAxisVectors;
      down.copy(up).scale(-1);
      west.copy(east).scale(-1);
      south.copy(north).scale(-1);
      firstAxisVector = scratchAxisVectors[firstAxis];
      secondAxisVector = scratchAxisVectors[secondAxis];
      thirdAxisVector = scratchAxisVectors[thirdAxis];
    }
    result[0] = firstAxisVector.x;
    result[1] = firstAxisVector.y;
    result[2] = firstAxisVector.z;
    result[3] = 0;
    result[4] = secondAxisVector.x;
    result[5] = secondAxisVector.y;
    result[6] = secondAxisVector.z;
    result[7] = 0;
    result[8] = thirdAxisVector.x;
    result[9] = thirdAxisVector.y;
    result[10] = thirdAxisVector.z;
    result[11] = 0;
    result[12] = origin.x;
    result[13] = origin.y;
    result[14] = origin.z;
    result[15] = 1;
    return result;
  }

  // ../../node_modules/@math.gl/geospatial/dist/esm/ellipsoid/ellipsoid.js
  var scratchVector4 = new Vector3();
  var scratchNormal = new Vector3();
  var scratchK = new Vector3();
  var scratchPosition = new Vector3();
  var scratchHeight = new Vector3();
  var scratchCartesian = new Vector3();
  var Ellipsoid = class {
    constructor(x = 0, y = 0, z = 0) {
      _defineProperty(this, "radii", void 0);
      _defineProperty(this, "radiiSquared", void 0);
      _defineProperty(this, "radiiToTheFourth", void 0);
      _defineProperty(this, "oneOverRadii", void 0);
      _defineProperty(this, "oneOverRadiiSquared", void 0);
      _defineProperty(this, "minimumRadius", void 0);
      _defineProperty(this, "maximumRadius", void 0);
      _defineProperty(this, "centerToleranceSquared", math_utils_default.EPSILON1);
      _defineProperty(this, "squaredXOverSquaredZ", void 0);
      assert4(x >= 0);
      assert4(y >= 0);
      assert4(z >= 0);
      this.radii = new Vector3(x, y, z);
      this.radiiSquared = new Vector3(x * x, y * y, z * z);
      this.radiiToTheFourth = new Vector3(x * x * x * x, y * y * y * y, z * z * z * z);
      this.oneOverRadii = new Vector3(x === 0 ? 0 : 1 / x, y === 0 ? 0 : 1 / y, z === 0 ? 0 : 1 / z);
      this.oneOverRadiiSquared = new Vector3(x === 0 ? 0 : 1 / (x * x), y === 0 ? 0 : 1 / (y * y), z === 0 ? 0 : 1 / (z * z));
      this.minimumRadius = Math.min(x, y, z);
      this.maximumRadius = Math.max(x, y, z);
      if (this.radiiSquared.z !== 0) {
        this.squaredXOverSquaredZ = this.radiiSquared.x / this.radiiSquared.z;
      }
      Object.freeze(this);
    }
    equals(right) {
      return this === right || Boolean(right && this.radii.equals(right.radii));
    }
    toString() {
      return this.radii.toString();
    }
    cartographicToCartesian(cartographic, result = [0, 0, 0]) {
      const normal = scratchNormal;
      const k = scratchK;
      const [, , height] = cartographic;
      this.geodeticSurfaceNormalCartographic(cartographic, normal);
      k.copy(this.radiiSquared).scale(normal);
      const gamma = Math.sqrt(normal.dot(k));
      k.scale(1 / gamma);
      normal.scale(height);
      k.add(normal);
      return k.to(result);
    }
    cartesianToCartographic(cartesian, result = [0, 0, 0]) {
      scratchCartesian.from(cartesian);
      const point = this.scaleToGeodeticSurface(scratchCartesian, scratchPosition);
      if (!point) {
        return void 0;
      }
      const normal = this.geodeticSurfaceNormal(point, scratchNormal);
      const h = scratchHeight;
      h.copy(scratchCartesian).subtract(point);
      const longitude = Math.atan2(normal.y, normal.x);
      const latitude = Math.asin(normal.z);
      const height = Math.sign(dot(h, scratchCartesian)) * length(h);
      return toCartographicFromRadians([longitude, latitude, height], result);
    }
    eastNorthUpToFixedFrame(origin, result = new Matrix4()) {
      return localFrameToFixedFrame(this, "east", "north", "up", origin, result);
    }
    localFrameToFixedFrame(firstAxis, secondAxis, thirdAxis, origin, result = new Matrix4()) {
      return localFrameToFixedFrame(this, firstAxis, secondAxis, thirdAxis, origin, result);
    }
    geocentricSurfaceNormal(cartesian, result = [0, 0, 0]) {
      return scratchVector4.from(cartesian).normalize().to(result);
    }
    geodeticSurfaceNormalCartographic(cartographic, result = [0, 0, 0]) {
      const cartographicVectorRadians = fromCartographicToRadians(cartographic);
      const longitude = cartographicVectorRadians[0];
      const latitude = cartographicVectorRadians[1];
      const cosLatitude = Math.cos(latitude);
      scratchVector4.set(cosLatitude * Math.cos(longitude), cosLatitude * Math.sin(longitude), Math.sin(latitude)).normalize();
      return scratchVector4.to(result);
    }
    geodeticSurfaceNormal(cartesian, result = [0, 0, 0]) {
      return scratchVector4.from(cartesian).scale(this.oneOverRadiiSquared).normalize().to(result);
    }
    scaleToGeodeticSurface(cartesian, result) {
      return scaleToGeodeticSurface(cartesian, this, result);
    }
    scaleToGeocentricSurface(cartesian, result = [0, 0, 0]) {
      scratchPosition.from(cartesian);
      const positionX = scratchPosition.x;
      const positionY = scratchPosition.y;
      const positionZ = scratchPosition.z;
      const oneOverRadiiSquared = this.oneOverRadiiSquared;
      const beta = 1 / Math.sqrt(positionX * positionX * oneOverRadiiSquared.x + positionY * positionY * oneOverRadiiSquared.y + positionZ * positionZ * oneOverRadiiSquared.z);
      return scratchPosition.multiplyScalar(beta).to(result);
    }
    transformPositionToScaledSpace(position, result = [0, 0, 0]) {
      return scratchPosition.from(position).scale(this.oneOverRadii).to(result);
    }
    transformPositionFromScaledSpace(position, result = [0, 0, 0]) {
      return scratchPosition.from(position).scale(this.radii).to(result);
    }
    getSurfaceNormalIntersectionWithZAxis(position, buffer = 0, result = [0, 0, 0]) {
      assert4(equals(this.radii.x, this.radii.y, math_utils_default.EPSILON15));
      assert4(this.radii.z > 0);
      scratchPosition.from(position);
      const z = scratchPosition.z * (1 - this.squaredXOverSquaredZ);
      if (Math.abs(z) >= this.radii.z - buffer) {
        return void 0;
      }
      return scratchPosition.set(0, 0, z).to(result);
    }
  };
  _defineProperty(Ellipsoid, "WGS84", new Ellipsoid(WGS84_RADIUS_X, WGS84_RADIUS_Y, WGS84_RADIUS_Z));

  // ../images/src/lib/utils/version.ts
  var VERSION4 = true ? "4.0.0-alpha.7" : "latest";

  // ../images/src/lib/category-api/image-type.ts
  var { _parseImageNode } = globalThis;
  var IMAGE_SUPPORTED = typeof Image !== "undefined";
  var IMAGE_BITMAP_SUPPORTED = typeof ImageBitmap !== "undefined";
  var NODE_IMAGE_SUPPORTED = Boolean(_parseImageNode);
  var DATA_SUPPORTED = isBrowser ? true : NODE_IMAGE_SUPPORTED;
  function isImageTypeSupported(type) {
    switch (type) {
      case "auto":
        return IMAGE_BITMAP_SUPPORTED || IMAGE_SUPPORTED || DATA_SUPPORTED;
      case "imagebitmap":
        return IMAGE_BITMAP_SUPPORTED;
      case "image":
        return IMAGE_SUPPORTED;
      case "data":
        return DATA_SUPPORTED;
      default:
        throw new Error(`@loaders.gl/images: image ${type} not supported in this environment`);
    }
  }
  function getDefaultImageType() {
    if (IMAGE_BITMAP_SUPPORTED) {
      return "imagebitmap";
    }
    if (IMAGE_SUPPORTED) {
      return "image";
    }
    if (DATA_SUPPORTED) {
      return "data";
    }
    throw new Error("Install '@loaders.gl/polyfills' to parse images under Node.js");
  }

  // ../images/src/lib/category-api/parsed-image-api.ts
  function getImageType(image) {
    const format = getImageTypeOrNull(image);
    if (!format) {
      throw new Error("Not an image");
    }
    return format;
  }
  function getImageData(image) {
    switch (getImageType(image)) {
      case "data":
        return image;
      case "image":
      case "imagebitmap":
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("getImageData");
        }
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height);
      default:
        throw new Error("getImageData");
    }
  }
  function getImageTypeOrNull(image) {
    if (typeof ImageBitmap !== "undefined" && image instanceof ImageBitmap) {
      return "imagebitmap";
    }
    if (typeof Image !== "undefined" && image instanceof Image) {
      return "image";
    }
    if (image && typeof image === "object" && image.data && image.width && image.height) {
      return "data";
    }
    return null;
  }

  // ../images/src/lib/parsers/svg-utils.ts
  var SVG_DATA_URL_PATTERN = /^data:image\/svg\+xml/;
  var SVG_URL_PATTERN = /\.svg((\?|#).*)?$/;
  function isSVG(url) {
    return url && (SVG_DATA_URL_PATTERN.test(url) || SVG_URL_PATTERN.test(url));
  }
  function getBlobOrSVGDataUrl(arrayBuffer, url) {
    if (isSVG(url)) {
      const textDecoder = new TextDecoder();
      let xmlText = textDecoder.decode(arrayBuffer);
      try {
        if (typeof unescape === "function" && typeof encodeURIComponent === "function") {
          xmlText = unescape(encodeURIComponent(xmlText));
        }
      } catch (error) {
        throw new Error(error.message);
      }
      const src = `data:image/svg+xml;base64,${btoa(xmlText)}`;
      return src;
    }
    return getBlob(arrayBuffer, url);
  }
  function getBlob(arrayBuffer, url) {
    if (isSVG(url)) {
      throw new Error("SVG cannot be parsed directly to imagebitmap");
    }
    return new Blob([new Uint8Array(arrayBuffer)]);
  }

  // ../images/src/lib/parsers/parse-to-image.ts
  async function parseToImage(arrayBuffer, options, url) {
    const blobOrDataUrl = getBlobOrSVGDataUrl(arrayBuffer, url);
    const URL2 = self.URL || self.webkitURL;
    const objectUrl = typeof blobOrDataUrl !== "string" && URL2.createObjectURL(blobOrDataUrl);
    try {
      return await loadToImage(objectUrl || blobOrDataUrl, options);
    } finally {
      if (objectUrl) {
        URL2.revokeObjectURL(objectUrl);
      }
    }
  }
  async function loadToImage(url, options) {
    const image = new Image();
    image.src = url;
    if (options.image && options.image.decode && image.decode) {
      await image.decode();
      return image;
    }
    return await new Promise((resolve2, reject) => {
      try {
        image.onload = () => resolve2(image);
        image.onerror = (err) => reject(new Error(`Could not load image ${url}: ${err}`));
      } catch (error) {
        reject(error);
      }
    });
  }

  // ../images/src/lib/parsers/parse-to-image-bitmap.ts
  var EMPTY_OBJECT = {};
  var imagebitmapOptionsSupported = true;
  async function parseToImageBitmap(arrayBuffer, options, url) {
    let blob;
    if (isSVG(url)) {
      const image = await parseToImage(arrayBuffer, options, url);
      blob = image;
    } else {
      blob = getBlob(arrayBuffer, url);
    }
    const imagebitmapOptions = options && options.imagebitmap;
    return await safeCreateImageBitmap(blob, imagebitmapOptions);
  }
  async function safeCreateImageBitmap(blob, imagebitmapOptions = null) {
    if (isEmptyObject(imagebitmapOptions) || !imagebitmapOptionsSupported) {
      imagebitmapOptions = null;
    }
    if (imagebitmapOptions) {
      try {
        return await createImageBitmap(blob, imagebitmapOptions);
      } catch (error) {
        console.warn(error);
        imagebitmapOptionsSupported = false;
      }
    }
    return await createImageBitmap(blob);
  }
  function isEmptyObject(object) {
    for (const key in object || EMPTY_OBJECT) {
      return false;
    }
    return true;
  }

  // ../images/src/lib/category-api/parse-isobmff-binary.ts
  function getISOBMFFMediaType(buffer) {
    if (!checkString(buffer, "ftyp", 4)) {
      return null;
    }
    if ((buffer[8] & 96) === 0) {
      return null;
    }
    return decodeMajorBrand(buffer);
  }
  function decodeMajorBrand(buffer) {
    const brandMajor = getUTF8String(buffer, 8, 12).replace("\0", " ").trim();
    switch (brandMajor) {
      case "avif":
      case "avis":
        return { extension: "avif", mimeType: "image/avif" };
      default:
        return null;
    }
  }
  function getUTF8String(array, start, end) {
    return String.fromCharCode(...array.slice(start, end));
  }
  function stringToBytes(string) {
    return [...string].map((character) => character.charCodeAt(0));
  }
  function checkString(buffer, header, offset = 0) {
    const headerBytes = stringToBytes(header);
    for (let i2 = 0; i2 < headerBytes.length; ++i2) {
      if (headerBytes[i2] !== buffer[i2 + offset]) {
        return false;
      }
    }
    return true;
  }

  // ../images/src/lib/category-api/binary-image-api.ts
  var BIG_ENDIAN = false;
  var LITTLE_ENDIAN = true;
  function getBinaryImageMetadata(binaryData) {
    const dataView = toDataView(binaryData);
    return getPngMetadata(dataView) || getJpegMetadata(dataView) || getGifMetadata(dataView) || getBmpMetadata(dataView) || getISOBMFFMetadata(dataView);
  }
  function getISOBMFFMetadata(binaryData) {
    const buffer = new Uint8Array(binaryData instanceof DataView ? binaryData.buffer : binaryData);
    const mediaType = getISOBMFFMediaType(buffer);
    if (!mediaType) {
      return null;
    }
    return {
      mimeType: mediaType.mimeType,
      width: 0,
      height: 0
    };
  }
  function getPngMetadata(binaryData) {
    const dataView = toDataView(binaryData);
    const isPng = dataView.byteLength >= 24 && dataView.getUint32(0, BIG_ENDIAN) === 2303741511;
    if (!isPng) {
      return null;
    }
    return {
      mimeType: "image/png",
      width: dataView.getUint32(16, BIG_ENDIAN),
      height: dataView.getUint32(20, BIG_ENDIAN)
    };
  }
  function getGifMetadata(binaryData) {
    const dataView = toDataView(binaryData);
    const isGif = dataView.byteLength >= 10 && dataView.getUint32(0, BIG_ENDIAN) === 1195984440;
    if (!isGif) {
      return null;
    }
    return {
      mimeType: "image/gif",
      width: dataView.getUint16(6, LITTLE_ENDIAN),
      height: dataView.getUint16(8, LITTLE_ENDIAN)
    };
  }
  function getBmpMetadata(binaryData) {
    const dataView = toDataView(binaryData);
    const isBmp = dataView.byteLength >= 14 && dataView.getUint16(0, BIG_ENDIAN) === 16973 && dataView.getUint32(2, LITTLE_ENDIAN) === dataView.byteLength;
    if (!isBmp) {
      return null;
    }
    return {
      mimeType: "image/bmp",
      width: dataView.getUint32(18, LITTLE_ENDIAN),
      height: dataView.getUint32(22, LITTLE_ENDIAN)
    };
  }
  function getJpegMetadata(binaryData) {
    const dataView = toDataView(binaryData);
    const isJpeg = dataView.byteLength >= 3 && dataView.getUint16(0, BIG_ENDIAN) === 65496 && dataView.getUint8(2) === 255;
    if (!isJpeg) {
      return null;
    }
    const { tableMarkers, sofMarkers } = getJpegMarkers();
    let i2 = 2;
    while (i2 + 9 < dataView.byteLength) {
      const marker = dataView.getUint16(i2, BIG_ENDIAN);
      if (sofMarkers.has(marker)) {
        return {
          mimeType: "image/jpeg",
          height: dataView.getUint16(i2 + 5, BIG_ENDIAN),
          width: dataView.getUint16(i2 + 7, BIG_ENDIAN)
        };
      }
      if (!tableMarkers.has(marker)) {
        return null;
      }
      i2 += 2;
      i2 += dataView.getUint16(i2, BIG_ENDIAN);
    }
    return null;
  }
  function getJpegMarkers() {
    const tableMarkers = new Set([65499, 65476, 65484, 65501, 65534]);
    for (let i2 = 65504; i2 < 65520; ++i2) {
      tableMarkers.add(i2);
    }
    const sofMarkers = new Set([
      65472,
      65473,
      65474,
      65475,
      65477,
      65478,
      65479,
      65481,
      65482,
      65483,
      65485,
      65486,
      65487,
      65502
    ]);
    return { tableMarkers, sofMarkers };
  }
  function toDataView(data) {
    if (data instanceof DataView) {
      return data;
    }
    if (ArrayBuffer.isView(data)) {
      return new DataView(data.buffer);
    }
    if (data instanceof ArrayBuffer) {
      return new DataView(data);
    }
    throw new Error("toDataView");
  }

  // ../images/src/lib/parsers/parse-to-node-image.ts
  async function parseToNodeImage(arrayBuffer, options) {
    const { mimeType } = getBinaryImageMetadata(arrayBuffer) || {};
    const _parseImageNode2 = globalThis._parseImageNode;
    assert(_parseImageNode2);
    return await _parseImageNode2(arrayBuffer, mimeType);
  }

  // ../images/src/lib/parsers/parse-image.ts
  async function parseImage(arrayBuffer, options, context) {
    options = options || {};
    const imageOptions = options.image || {};
    const imageType = imageOptions.type || "auto";
    const { url } = context || {};
    const loadType = getLoadableImageType(imageType);
    let image;
    switch (loadType) {
      case "imagebitmap":
        image = await parseToImageBitmap(arrayBuffer, options, url);
        break;
      case "image":
        image = await parseToImage(arrayBuffer, options, url);
        break;
      case "data":
        image = await parseToNodeImage(arrayBuffer, options);
        break;
      default:
        assert(false);
    }
    if (imageType === "data") {
      image = getImageData(image);
    }
    return image;
  }
  function getLoadableImageType(type) {
    switch (type) {
      case "auto":
      case "data":
        return getDefaultImageType();
      default:
        isImageTypeSupported(type);
        return type;
    }
  }

  // ../images/src/image-loader.ts
  var EXTENSIONS = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "svg", "avif"];
  var MIME_TYPES = [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/avif",
    "image/bmp",
    "image/vnd.microsoft.icon",
    "image/svg+xml"
  ];
  var DEFAULT_IMAGE_LOADER_OPTIONS = {
    image: {
      type: "auto",
      decode: true
    }
  };
  var ImageLoader = {
    id: "image",
    module: "images",
    name: "Images",
    version: VERSION4,
    mimeTypes: MIME_TYPES,
    extensions: EXTENSIONS,
    parse: parseImage,
    tests: [(arrayBuffer) => Boolean(getBinaryImageMetadata(new DataView(arrayBuffer)))],
    options: DEFAULT_IMAGE_LOADER_OPTIONS
  };

  // ../draco/src/lib/utils/version.ts
  var VERSION5 = true ? "4.0.0-alpha.7" : "latest";

  // ../draco/src/draco-loader.ts
  var DEFAULT_DRACO_OPTIONS = {
    draco: {
      decoderType: typeof WebAssembly === "object" ? "wasm" : "js",
      libraryPath: "libs/",
      extraAttributes: {},
      attributeNameEntry: void 0
    }
  };
  var DracoLoader = {
    name: "Draco",
    id: "draco",
    module: "draco",
    version: VERSION5,
    worker: true,
    extensions: ["drc"],
    mimeTypes: ["application/octet-stream"],
    binary: true,
    tests: ["DRACO"],
    options: DEFAULT_DRACO_OPTIONS
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
    for (let i2 = 0; i2 < len; i2 += 3) {
      const x = positions[i2];
      const y = positions[i2 + 1];
      const z = positions[i2 + 2];
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

  // ../draco/src/lib/utils/get-draco-schema.ts
  function getDracoSchema(attributes, loaderData, indices) {
    const metadata = makeMetadata(loaderData.metadata);
    const fields = [];
    const namedLoaderDataAttributes = transformAttributesLoaderData(loaderData.attributes);
    for (const attributeName in attributes) {
      const attribute = attributes[attributeName];
      const field = getArrowFieldFromAttribute(attributeName, attribute, namedLoaderDataAttributes[attributeName]);
      fields.push(field);
    }
    if (indices) {
      const indicesField = getArrowFieldFromAttribute("indices", indices);
      fields.push(indicesField);
    }
    return { fields, metadata };
  }
  function transformAttributesLoaderData(loaderData) {
    const result = {};
    for (const key in loaderData) {
      const dracoAttribute = loaderData[key];
      result[dracoAttribute.name || "undefined"] = dracoAttribute;
    }
    return result;
  }
  function getArrowFieldFromAttribute(attributeName, attribute, loaderData) {
    const metadataMap = loaderData ? makeMetadata(loaderData.metadata) : void 0;
    const field = deduceMeshField(attributeName, attribute, metadataMap);
    return field;
  }
  function makeMetadata(metadata) {
    Object.entries(metadata);
    const serializedMetadata = {};
    for (const key in metadata) {
      serializedMetadata[`${key}.string`] = JSON.stringify(metadata[key]);
    }
    return serializedMetadata;
  }

  // ../draco/src/lib/draco-parser.ts
  var DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP = {
    POSITION: "POSITION",
    NORMAL: "NORMAL",
    COLOR: "COLOR_0",
    TEX_COORD: "TEXCOORD_0"
  };
  var DRACO_DATA_TYPE_TO_TYPED_ARRAY_MAP = {
    1: Int8Array,
    2: Uint8Array,
    3: Int16Array,
    4: Uint16Array,
    5: Int32Array,
    6: Uint32Array,
    9: Float32Array
  };
  var INDEX_ITEM_SIZE = 4;
  var DracoParser = class {
    constructor(draco) {
      this.draco = draco;
      this.decoder = new this.draco.Decoder();
      this.metadataQuerier = new this.draco.MetadataQuerier();
    }
    destroy() {
      this.draco.destroy(this.decoder);
      this.draco.destroy(this.metadataQuerier);
    }
    parseSync(arrayBuffer, options = {}) {
      const buffer = new this.draco.DecoderBuffer();
      buffer.Init(new Int8Array(arrayBuffer), arrayBuffer.byteLength);
      this._disableAttributeTransforms(options);
      const geometry_type = this.decoder.GetEncodedGeometryType(buffer);
      const dracoGeometry = geometry_type === this.draco.TRIANGULAR_MESH ? new this.draco.Mesh() : new this.draco.PointCloud();
      try {
        let dracoStatus;
        switch (geometry_type) {
          case this.draco.TRIANGULAR_MESH:
            dracoStatus = this.decoder.DecodeBufferToMesh(buffer, dracoGeometry);
            break;
          case this.draco.POINT_CLOUD:
            dracoStatus = this.decoder.DecodeBufferToPointCloud(buffer, dracoGeometry);
            break;
          default:
            throw new Error("DRACO: Unknown geometry type.");
        }
        if (!dracoStatus.ok() || !dracoGeometry.ptr) {
          const message = `DRACO decompression failed: ${dracoStatus.error_msg()}`;
          throw new Error(message);
        }
        const loaderData = this._getDracoLoaderData(dracoGeometry, geometry_type, options);
        const geometry = this._getMeshData(dracoGeometry, loaderData, options);
        const boundingBox = getMeshBoundingBox(geometry.attributes);
        const schema = getDracoSchema(geometry.attributes, loaderData, geometry.indices);
        const data = {
          loader: "draco",
          loaderData,
          header: {
            vertexCount: dracoGeometry.num_points(),
            boundingBox
          },
          ...geometry,
          schema
        };
        return data;
      } finally {
        this.draco.destroy(buffer);
        if (dracoGeometry) {
          this.draco.destroy(dracoGeometry);
        }
      }
    }
    _getDracoLoaderData(dracoGeometry, geometry_type, options) {
      const metadata = this._getTopLevelMetadata(dracoGeometry);
      const attributes = this._getDracoAttributes(dracoGeometry, options);
      return {
        geometry_type,
        num_attributes: dracoGeometry.num_attributes(),
        num_points: dracoGeometry.num_points(),
        num_faces: dracoGeometry instanceof this.draco.Mesh ? dracoGeometry.num_faces() : 0,
        metadata,
        attributes
      };
    }
    _getDracoAttributes(dracoGeometry, options) {
      const dracoAttributes = {};
      for (let attributeId = 0; attributeId < dracoGeometry.num_attributes(); attributeId++) {
        const dracoAttribute = this.decoder.GetAttribute(dracoGeometry, attributeId);
        const metadata = this._getAttributeMetadata(dracoGeometry, attributeId);
        dracoAttributes[dracoAttribute.unique_id()] = {
          unique_id: dracoAttribute.unique_id(),
          attribute_type: dracoAttribute.attribute_type(),
          data_type: dracoAttribute.data_type(),
          num_components: dracoAttribute.num_components(),
          byte_offset: dracoAttribute.byte_offset(),
          byte_stride: dracoAttribute.byte_stride(),
          normalized: dracoAttribute.normalized(),
          attribute_index: attributeId,
          metadata
        };
        const quantization = this._getQuantizationTransform(dracoAttribute, options);
        if (quantization) {
          dracoAttributes[dracoAttribute.unique_id()].quantization_transform = quantization;
        }
        const octahedron = this._getOctahedronTransform(dracoAttribute, options);
        if (octahedron) {
          dracoAttributes[dracoAttribute.unique_id()].octahedron_transform = octahedron;
        }
      }
      return dracoAttributes;
    }
    _getMeshData(dracoGeometry, loaderData, options) {
      const attributes = this._getMeshAttributes(loaderData, dracoGeometry, options);
      const positionAttribute = attributes.POSITION;
      if (!positionAttribute) {
        throw new Error("DRACO: No position attribute found.");
      }
      if (dracoGeometry instanceof this.draco.Mesh) {
        switch (options.topology) {
          case "triangle-strip":
            return {
              topology: "triangle-strip",
              mode: 4,
              attributes,
              indices: {
                value: this._getTriangleStripIndices(dracoGeometry),
                size: 1
              }
            };
          case "triangle-list":
          default:
            return {
              topology: "triangle-list",
              mode: 5,
              attributes,
              indices: {
                value: this._getTriangleListIndices(dracoGeometry),
                size: 1
              }
            };
        }
      }
      return {
        topology: "point-list",
        mode: 0,
        attributes
      };
    }
    _getMeshAttributes(loaderData, dracoGeometry, options) {
      const attributes = {};
      for (const loaderAttribute of Object.values(loaderData.attributes)) {
        const attributeName = this._deduceAttributeName(loaderAttribute, options);
        loaderAttribute.name = attributeName;
        const { value, size } = this._getAttributeValues(dracoGeometry, loaderAttribute);
        attributes[attributeName] = {
          value,
          size,
          byteOffset: loaderAttribute.byte_offset,
          byteStride: loaderAttribute.byte_stride,
          normalized: loaderAttribute.normalized
        };
      }
      return attributes;
    }
    _getTriangleListIndices(dracoGeometry) {
      const numFaces = dracoGeometry.num_faces();
      const numIndices = numFaces * 3;
      const byteLength = numIndices * INDEX_ITEM_SIZE;
      const ptr = this.draco._malloc(byteLength);
      try {
        this.decoder.GetTrianglesUInt32Array(dracoGeometry, byteLength, ptr);
        return new Uint32Array(this.draco.HEAPF32.buffer, ptr, numIndices).slice();
      } finally {
        this.draco._free(ptr);
      }
    }
    _getTriangleStripIndices(dracoGeometry) {
      const dracoArray = new this.draco.DracoInt32Array();
      try {
        this.decoder.GetTriangleStripsFromMesh(dracoGeometry, dracoArray);
        return getUint32Array(dracoArray);
      } finally {
        this.draco.destroy(dracoArray);
      }
    }
    _getAttributeValues(dracoGeometry, attribute) {
      const TypedArrayCtor = DRACO_DATA_TYPE_TO_TYPED_ARRAY_MAP[attribute.data_type];
      const numComponents = attribute.num_components;
      const numPoints = dracoGeometry.num_points();
      const numValues = numPoints * numComponents;
      const byteLength = numValues * TypedArrayCtor.BYTES_PER_ELEMENT;
      const dataType = getDracoDataType(this.draco, TypedArrayCtor);
      let value;
      const ptr = this.draco._malloc(byteLength);
      try {
        const dracoAttribute = this.decoder.GetAttribute(dracoGeometry, attribute.attribute_index);
        this.decoder.GetAttributeDataArrayForAllPoints(dracoGeometry, dracoAttribute, dataType, byteLength, ptr);
        value = new TypedArrayCtor(this.draco.HEAPF32.buffer, ptr, numValues).slice();
      } finally {
        this.draco._free(ptr);
      }
      return { value, size: numComponents };
    }
    _deduceAttributeName(attribute, options) {
      const uniqueId = attribute.unique_id;
      for (const [attributeName, attributeUniqueId] of Object.entries(options.extraAttributes || {})) {
        if (attributeUniqueId === uniqueId) {
          return attributeName;
        }
      }
      const thisAttributeType = attribute.attribute_type;
      for (const dracoAttributeConstant in DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP) {
        const attributeType = this.draco[dracoAttributeConstant];
        if (attributeType === thisAttributeType) {
          return DRACO_TO_GLTF_ATTRIBUTE_NAME_MAP[dracoAttributeConstant];
        }
      }
      const entryName = options.attributeNameEntry || "name";
      if (attribute.metadata[entryName]) {
        return attribute.metadata[entryName].string;
      }
      return `CUSTOM_ATTRIBUTE_${uniqueId}`;
    }
    _getTopLevelMetadata(dracoGeometry) {
      const dracoMetadata = this.decoder.GetMetadata(dracoGeometry);
      return this._getDracoMetadata(dracoMetadata);
    }
    _getAttributeMetadata(dracoGeometry, attributeId) {
      const dracoMetadata = this.decoder.GetAttributeMetadata(dracoGeometry, attributeId);
      return this._getDracoMetadata(dracoMetadata);
    }
    _getDracoMetadata(dracoMetadata) {
      if (!dracoMetadata || !dracoMetadata.ptr) {
        return {};
      }
      const result = {};
      const numEntries = this.metadataQuerier.NumEntries(dracoMetadata);
      for (let entryIndex = 0; entryIndex < numEntries; entryIndex++) {
        const entryName = this.metadataQuerier.GetEntryName(dracoMetadata, entryIndex);
        result[entryName] = this._getDracoMetadataField(dracoMetadata, entryName);
      }
      return result;
    }
    _getDracoMetadataField(dracoMetadata, entryName) {
      const dracoArray = new this.draco.DracoInt32Array();
      try {
        this.metadataQuerier.GetIntEntryArray(dracoMetadata, entryName, dracoArray);
        const intArray = getInt32Array(dracoArray);
        return {
          int: this.metadataQuerier.GetIntEntry(dracoMetadata, entryName),
          string: this.metadataQuerier.GetStringEntry(dracoMetadata, entryName),
          double: this.metadataQuerier.GetDoubleEntry(dracoMetadata, entryName),
          intArray
        };
      } finally {
        this.draco.destroy(dracoArray);
      }
    }
    _disableAttributeTransforms(options) {
      const { quantizedAttributes = [], octahedronAttributes = [] } = options;
      const skipAttributes = [...quantizedAttributes, ...octahedronAttributes];
      for (const dracoAttributeName of skipAttributes) {
        this.decoder.SkipAttributeTransform(this.draco[dracoAttributeName]);
      }
    }
    _getQuantizationTransform(dracoAttribute, options) {
      const { quantizedAttributes = [] } = options;
      const attribute_type = dracoAttribute.attribute_type();
      const skip = quantizedAttributes.map((type) => this.decoder[type]).includes(attribute_type);
      if (skip) {
        const transform = new this.draco.AttributeQuantizationTransform();
        try {
          if (transform.InitFromAttribute(dracoAttribute)) {
            return {
              quantization_bits: transform.quantization_bits(),
              range: transform.range(),
              min_values: new Float32Array([1, 2, 3]).map((i2) => transform.min_value(i2))
            };
          }
        } finally {
          this.draco.destroy(transform);
        }
      }
      return null;
    }
    _getOctahedronTransform(dracoAttribute, options) {
      const { octahedronAttributes = [] } = options;
      const attribute_type = dracoAttribute.attribute_type();
      const octahedron = octahedronAttributes.map((type) => this.decoder[type]).includes(attribute_type);
      if (octahedron) {
        const transform = new this.draco.AttributeQuantizationTransform();
        try {
          if (transform.InitFromAttribute(dracoAttribute)) {
            return {
              quantization_bits: transform.quantization_bits()
            };
          }
        } finally {
          this.draco.destroy(transform);
        }
      }
      return null;
    }
  };
  function getDracoDataType(draco, attributeType) {
    switch (attributeType) {
      case Float32Array:
        return draco.DT_FLOAT32;
      case Int8Array:
        return draco.DT_INT8;
      case Int16Array:
        return draco.DT_INT16;
      case Int32Array:
        return draco.DT_INT32;
      case Uint8Array:
        return draco.DT_UINT8;
      case Uint16Array:
        return draco.DT_UINT16;
      case Uint32Array:
        return draco.DT_UINT32;
      default:
        return draco.DT_INVALID;
    }
  }
  function getInt32Array(dracoArray) {
    const numValues = dracoArray.size();
    const intArray = new Int32Array(numValues);
    for (let i2 = 0; i2 < numValues; i2++) {
      intArray[i2] = dracoArray.GetValue(i2);
    }
    return intArray;
  }
  function getUint32Array(dracoArray) {
    const numValues = dracoArray.size();
    const intArray = new Int32Array(numValues);
    for (let i2 = 0; i2 < numValues; i2++) {
      intArray[i2] = dracoArray.GetValue(i2);
    }
    return intArray;
  }

  // ../draco/src/lib/draco-module-loader.ts
  var DRACO_DECODER_VERSION = "1.5.5";
  var DRACO_ENCODER_VERSION = "1.4.1";
  var STATIC_DECODER_URL = `https://www.gstatic.com/draco/versioned/decoders/${DRACO_DECODER_VERSION}`;
  var DRACO_JS_DECODER_URL = `${STATIC_DECODER_URL}/draco_decoder.js`;
  var DRACO_WASM_WRAPPER_URL = `${STATIC_DECODER_URL}/draco_wasm_wrapper.js`;
  var DRACO_WASM_DECODER_URL = `${STATIC_DECODER_URL}/draco_decoder.wasm`;
  var DRACO_ENCODER_URL = `https://raw.githubusercontent.com/google/draco/${DRACO_ENCODER_VERSION}/javascript/draco_encoder.js`;
  var loadDecoderPromise;
  async function loadDracoDecoderModule(options) {
    const modules = options.modules || {};
    if (modules.draco3d) {
      loadDecoderPromise = loadDecoderPromise || modules.draco3d.createDecoderModule({}).then((draco) => {
        return { draco };
      });
    } else {
      loadDecoderPromise = loadDecoderPromise || loadDracoDecoder(options);
    }
    return await loadDecoderPromise;
  }
  async function loadDracoDecoder(options) {
    let DracoDecoderModule;
    let wasmBinary;
    switch (options.draco && options.draco.decoderType) {
      case "js":
        DracoDecoderModule = await loadLibrary(DRACO_JS_DECODER_URL, "draco", options);
        break;
      case "wasm":
      default:
        [DracoDecoderModule, wasmBinary] = await Promise.all([
          await loadLibrary(DRACO_WASM_WRAPPER_URL, "draco", options),
          await loadLibrary(DRACO_WASM_DECODER_URL, "draco", options)
        ]);
    }
    DracoDecoderModule = DracoDecoderModule || globalThis.DracoDecoderModule;
    return await initializeDracoDecoder(DracoDecoderModule, wasmBinary);
  }
  function initializeDracoDecoder(DracoDecoderModule, wasmBinary) {
    const options = {};
    if (wasmBinary) {
      options.wasmBinary = wasmBinary;
    }
    return new Promise((resolve2) => {
      DracoDecoderModule({
        ...options,
        onModuleLoaded: (draco) => resolve2({ draco })
      });
    });
  }

  // ../draco/src/index.ts
  var DracoLoader2 = {
    ...DracoLoader,
    parse: parse2
  };
  async function parse2(arrayBuffer, options) {
    const { draco } = await loadDracoDecoderModule(options);
    const dracoParser = new DracoParser(draco);
    try {
      return dracoParser.parseSync(arrayBuffer, options?.draco);
    } finally {
      dracoParser.destroy();
    }
  }

  // ../textures/src/lib/utils/version.ts
  var VERSION6 = true ? "4.0.0-alpha.7" : "beta";

  // ../textures/src/lib/parsers/basis-module-loader.ts
  var VERSION7 = true ? "4.0.0-alpha.7" : "beta";
  var BASIS_CDN_ENCODER_WASM = `https://unpkg.com/@loaders.gl/textures@${VERSION7}/dist/libs/basis_encoder.wasm`;
  var BASIS_CDN_ENCODER_JS = `https://unpkg.com/@loaders.gl/textures@${VERSION7}/dist/libs/basis_encoder.js`;
  var loadBasisTranscoderPromise;
  async function loadBasisTrascoderModule(options) {
    const modules = options.modules || {};
    if (modules.basis) {
      return modules.basis;
    }
    loadBasisTranscoderPromise = loadBasisTranscoderPromise || loadBasisTrascoder(options);
    return await loadBasisTranscoderPromise;
  }
  async function loadBasisTrascoder(options) {
    let BASIS = null;
    let wasmBinary = null;
    [BASIS, wasmBinary] = await Promise.all([
      await loadLibrary("basis_transcoder.js", "textures", options),
      await loadLibrary("basis_transcoder.wasm", "textures", options)
    ]);
    BASIS = BASIS || globalThis.BASIS;
    return await initializeBasisTrascoderModule(BASIS, wasmBinary);
  }
  function initializeBasisTrascoderModule(BasisModule, wasmBinary) {
    const options = {};
    if (wasmBinary) {
      options.wasmBinary = wasmBinary;
    }
    return new Promise((resolve2) => {
      BasisModule(options).then((module) => {
        const { BasisFile, initializeBasis } = module;
        initializeBasis();
        resolve2({ BasisFile });
      });
    });
  }
  var loadBasisEncoderPromise;
  async function loadBasisEncoderModule(options) {
    const modules = options.modules || {};
    if (modules.basisEncoder) {
      return modules.basisEncoder;
    }
    loadBasisEncoderPromise = loadBasisEncoderPromise || loadBasisEncoder(options);
    return await loadBasisEncoderPromise;
  }
  async function loadBasisEncoder(options) {
    let BASIS_ENCODER = null;
    let wasmBinary = null;
    [BASIS_ENCODER, wasmBinary] = await Promise.all([
      await loadLibrary(BASIS_CDN_ENCODER_JS, "textures", options),
      await loadLibrary(BASIS_CDN_ENCODER_WASM, "textures", options)
    ]);
    BASIS_ENCODER = BASIS_ENCODER || globalThis.BASIS;
    return await initializeBasisEncoderModule(BASIS_ENCODER, wasmBinary);
  }
  function initializeBasisEncoderModule(BasisEncoderModule, wasmBinary) {
    const options = {};
    if (wasmBinary) {
      options.wasmBinary = wasmBinary;
    }
    return new Promise((resolve2) => {
      BasisEncoderModule(options).then((module) => {
        const { BasisFile, KTX2File, initializeBasis, BasisEncoder } = module;
        initializeBasis();
        resolve2({ BasisFile, KTX2File, BasisEncoder });
      });
    });
  }

  // ../textures/src/lib/gl-extensions.ts
  var GL_EXTENSIONS_CONSTANTS = {
    COMPRESSED_RGB_S3TC_DXT1_EXT: 33776,
    COMPRESSED_RGBA_S3TC_DXT1_EXT: 33777,
    COMPRESSED_RGBA_S3TC_DXT3_EXT: 33778,
    COMPRESSED_RGBA_S3TC_DXT5_EXT: 33779,
    COMPRESSED_R11_EAC: 37488,
    COMPRESSED_SIGNED_R11_EAC: 37489,
    COMPRESSED_RG11_EAC: 37490,
    COMPRESSED_SIGNED_RG11_EAC: 37491,
    COMPRESSED_RGB8_ETC2: 37492,
    COMPRESSED_RGBA8_ETC2_EAC: 37493,
    COMPRESSED_SRGB8_ETC2: 37494,
    COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 37495,
    COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37496,
    COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37497,
    COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 35840,
    COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 35842,
    COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 35841,
    COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 35843,
    COMPRESSED_RGB_ETC1_WEBGL: 36196,
    COMPRESSED_RGB_ATC_WEBGL: 35986,
    COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 35987,
    COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 34798,
    COMPRESSED_RGBA_ASTC_4X4_KHR: 37808,
    COMPRESSED_RGBA_ASTC_5X4_KHR: 37809,
    COMPRESSED_RGBA_ASTC_5X5_KHR: 37810,
    COMPRESSED_RGBA_ASTC_6X5_KHR: 37811,
    COMPRESSED_RGBA_ASTC_6X6_KHR: 37812,
    COMPRESSED_RGBA_ASTC_8X5_KHR: 37813,
    COMPRESSED_RGBA_ASTC_8X6_KHR: 37814,
    COMPRESSED_RGBA_ASTC_8X8_KHR: 37815,
    COMPRESSED_RGBA_ASTC_10X5_KHR: 37816,
    COMPRESSED_RGBA_ASTC_10X6_KHR: 37817,
    COMPRESSED_RGBA_ASTC_10X8_KHR: 37818,
    COMPRESSED_RGBA_ASTC_10X10_KHR: 37819,
    COMPRESSED_RGBA_ASTC_12X10_KHR: 37820,
    COMPRESSED_RGBA_ASTC_12X12_KHR: 37821,
    COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR: 37840,
    COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR: 37841,
    COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR: 37842,
    COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR: 37843,
    COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR: 37844,
    COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR: 37845,
    COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR: 37846,
    COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR: 37847,
    COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR: 37848,
    COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR: 37849,
    COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR: 37850,
    COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR: 37851,
    COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR: 37852,
    COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR: 37853,
    COMPRESSED_RED_RGTC1_EXT: 36283,
    COMPRESSED_SIGNED_RED_RGTC1_EXT: 36284,
    COMPRESSED_RED_GREEN_RGTC2_EXT: 36285,
    COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT: 36286,
    COMPRESSED_SRGB_S3TC_DXT1_EXT: 35916,
    COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT: 35917,
    COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT: 35918,
    COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT: 35919
  };

  // ../textures/src/lib/utils/texture-formats.ts
  var BROWSER_PREFIXES = ["", "WEBKIT_", "MOZ_"];
  var WEBGL_EXTENSIONS = {
    WEBGL_compressed_texture_s3tc: "dxt",
    WEBGL_compressed_texture_s3tc_srgb: "dxt-srgb",
    WEBGL_compressed_texture_etc1: "etc1",
    WEBGL_compressed_texture_etc: "etc2",
    WEBGL_compressed_texture_pvrtc: "pvrtc",
    WEBGL_compressed_texture_atc: "atc",
    WEBGL_compressed_texture_astc: "astc",
    EXT_texture_compression_rgtc: "rgtc"
  };
  var formats = null;
  function getSupportedGPUTextureFormats(gl) {
    if (!formats) {
      gl = gl || getWebGLContext() || void 0;
      formats = new Set();
      for (const prefix of BROWSER_PREFIXES) {
        for (const extension in WEBGL_EXTENSIONS) {
          if (gl && gl.getExtension(`${prefix}${extension}`)) {
            const gpuTextureFormat = WEBGL_EXTENSIONS[extension];
            formats.add(gpuTextureFormat);
          }
        }
      }
    }
    return formats;
  }
  function getWebGLContext() {
    try {
      const canvas = document.createElement("canvas");
      return canvas.getContext("webgl");
    } catch (error) {
      return null;
    }
  }

  // ../../node_modules/ktx-parse/dist/ktx-parse.modern.js
  var t = new Uint8Array([0]);
  var e = [171, 75, 84, 88, 32, 50, 48, 187, 13, 10, 26, 10];
  var n;
  var i;
  var s;
  var a;
  var r;
  var o;
  var l;
  var f;
  !function(t2) {
    t2[t2.NONE = 0] = "NONE", t2[t2.BASISLZ = 1] = "BASISLZ", t2[t2.ZSTD = 2] = "ZSTD", t2[t2.ZLIB = 3] = "ZLIB";
  }(n || (n = {})), function(t2) {
    t2[t2.BASICFORMAT = 0] = "BASICFORMAT";
  }(i || (i = {})), function(t2) {
    t2[t2.UNSPECIFIED = 0] = "UNSPECIFIED", t2[t2.ETC1S = 163] = "ETC1S", t2[t2.UASTC = 166] = "UASTC";
  }(s || (s = {})), function(t2) {
    t2[t2.UNSPECIFIED = 0] = "UNSPECIFIED", t2[t2.SRGB = 1] = "SRGB";
  }(a || (a = {})), function(t2) {
    t2[t2.UNSPECIFIED = 0] = "UNSPECIFIED", t2[t2.LINEAR = 1] = "LINEAR", t2[t2.SRGB = 2] = "SRGB", t2[t2.ITU = 3] = "ITU", t2[t2.NTSC = 4] = "NTSC", t2[t2.SLOG = 5] = "SLOG", t2[t2.SLOG2 = 6] = "SLOG2";
  }(r || (r = {})), function(t2) {
    t2[t2.ALPHA_STRAIGHT = 0] = "ALPHA_STRAIGHT", t2[t2.ALPHA_PREMULTIPLIED = 1] = "ALPHA_PREMULTIPLIED";
  }(o || (o = {})), function(t2) {
    t2[t2.RGB = 0] = "RGB", t2[t2.RRR = 3] = "RRR", t2[t2.GGG = 4] = "GGG", t2[t2.AAA = 15] = "AAA";
  }(l || (l = {})), function(t2) {
    t2[t2.RGB = 0] = "RGB", t2[t2.RGBA = 3] = "RGBA", t2[t2.RRR = 4] = "RRR", t2[t2.RRRG = 5] = "RRRG";
  }(f || (f = {}));
  var U = class {
    constructor() {
      this.vkFormat = 0, this.typeSize = 1, this.pixelWidth = 0, this.pixelHeight = 0, this.pixelDepth = 0, this.layerCount = 0, this.faceCount = 1, this.supercompressionScheme = n.NONE, this.levels = [], this.dataFormatDescriptor = [{ vendorId: 0, descriptorType: i.BASICFORMAT, versionNumber: 2, descriptorBlockSize: 40, colorModel: s.UNSPECIFIED, colorPrimaries: a.SRGB, transferFunction: a.SRGB, flags: o.ALPHA_STRAIGHT, texelBlockDimension: { x: 4, y: 4, z: 1, w: 1 }, bytesPlane: [], samples: [] }], this.keyValue = {}, this.globalData = null;
    }
  };
  var c = class {
    constructor(t2, e2, n2, i2) {
      this._dataView = new DataView(t2.buffer, t2.byteOffset + e2, n2), this._littleEndian = i2, this._offset = 0;
    }
    _nextUint8() {
      const t2 = this._dataView.getUint8(this._offset);
      return this._offset += 1, t2;
    }
    _nextUint16() {
      const t2 = this._dataView.getUint16(this._offset, this._littleEndian);
      return this._offset += 2, t2;
    }
    _nextUint32() {
      const t2 = this._dataView.getUint32(this._offset, this._littleEndian);
      return this._offset += 4, t2;
    }
    _nextUint64() {
      const t2 = this._dataView.getUint32(this._offset, this._littleEndian) + 2 ** 32 * this._dataView.getUint32(this._offset + 4, this._littleEndian);
      return this._offset += 8, t2;
    }
    _skip(t2) {
      return this._offset += t2, this;
    }
    _scan(t2, e2 = 0) {
      const n2 = this._offset;
      let i2 = 0;
      for (; this._dataView.getUint8(this._offset) !== e2 && i2 < t2; )
        i2++, this._offset++;
      return i2 < t2 && this._offset++, new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + n2, i2);
    }
  };
  function _(t2) {
    return typeof TextDecoder != "undefined" ? new TextDecoder().decode(t2) : Buffer.from(t2).toString("utf8");
  }
  function p(t2) {
    const n2 = new Uint8Array(t2.buffer, t2.byteOffset, e.length);
    if (n2[0] !== e[0] || n2[1] !== e[1] || n2[2] !== e[2] || n2[3] !== e[3] || n2[4] !== e[4] || n2[5] !== e[5] || n2[6] !== e[6] || n2[7] !== e[7] || n2[8] !== e[8] || n2[9] !== e[9] || n2[10] !== e[10] || n2[11] !== e[11])
      throw new Error("Missing KTX 2.0 identifier.");
    const i2 = new U(), s2 = 17 * Uint32Array.BYTES_PER_ELEMENT, a2 = new c(t2, e.length, s2, true);
    i2.vkFormat = a2._nextUint32(), i2.typeSize = a2._nextUint32(), i2.pixelWidth = a2._nextUint32(), i2.pixelHeight = a2._nextUint32(), i2.pixelDepth = a2._nextUint32(), i2.layerCount = a2._nextUint32(), i2.faceCount = a2._nextUint32();
    const r2 = a2._nextUint32();
    i2.supercompressionScheme = a2._nextUint32();
    const o2 = a2._nextUint32(), l2 = a2._nextUint32(), f2 = a2._nextUint32(), h = a2._nextUint32(), g = a2._nextUint64(), p2 = a2._nextUint64(), x = new c(t2, e.length + s2, 3 * r2 * 8, true);
    for (let e2 = 0; e2 < r2; e2++)
      i2.levels.push({ levelData: new Uint8Array(t2.buffer, t2.byteOffset + x._nextUint64(), x._nextUint64()), uncompressedByteLength: x._nextUint64() });
    const u = new c(t2, o2, l2, true), y = { vendorId: u._skip(4)._nextUint16(), descriptorType: u._nextUint16(), versionNumber: u._nextUint16(), descriptorBlockSize: u._nextUint16(), colorModel: u._nextUint8(), colorPrimaries: u._nextUint8(), transferFunction: u._nextUint8(), flags: u._nextUint8(), texelBlockDimension: { x: u._nextUint8() + 1, y: u._nextUint8() + 1, z: u._nextUint8() + 1, w: u._nextUint8() + 1 }, bytesPlane: [u._nextUint8(), u._nextUint8(), u._nextUint8(), u._nextUint8(), u._nextUint8(), u._nextUint8(), u._nextUint8(), u._nextUint8()], samples: [] }, D = (y.descriptorBlockSize / 4 - 6) / 4;
    for (let t3 = 0; t3 < D; t3++)
      y.samples[t3] = { bitOffset: u._nextUint16(), bitLength: u._nextUint8(), channelID: u._nextUint8(), samplePosition: [u._nextUint8(), u._nextUint8(), u._nextUint8(), u._nextUint8()], sampleLower: u._nextUint32(), sampleUpper: u._nextUint32() };
    i2.dataFormatDescriptor.length = 0, i2.dataFormatDescriptor.push(y);
    const b = new c(t2, f2, h, true);
    for (; b._offset < h; ) {
      const t3 = b._nextUint32(), e2 = b._scan(t3), n3 = _(e2), s3 = b._scan(t3 - e2.byteLength);
      i2.keyValue[n3] = n3.match(/^ktx/i) ? _(s3) : s3, t3 % 4 && b._skip(4 - t3 % 4);
    }
    if (p2 <= 0)
      return i2;
    const d = new c(t2, g, p2, true), B = d._nextUint16(), w = d._nextUint16(), A = d._nextUint32(), S = d._nextUint32(), m = d._nextUint32(), L = d._nextUint32(), I = [];
    for (let t3 = 0; t3 < r2; t3++)
      I.push({ imageFlags: d._nextUint32(), rgbSliceByteOffset: d._nextUint32(), rgbSliceByteLength: d._nextUint32(), alphaSliceByteOffset: d._nextUint32(), alphaSliceByteLength: d._nextUint32() });
    const R = g + d._offset, E = R + A, T = E + S, O = T + m, P = new Uint8Array(t2.buffer, t2.byteOffset + R, A), C = new Uint8Array(t2.buffer, t2.byteOffset + E, S), F = new Uint8Array(t2.buffer, t2.byteOffset + T, m), G = new Uint8Array(t2.buffer, t2.byteOffset + O, L);
    return i2.globalData = { endpointCount: B, selectorCount: w, imageDescs: I, endpointsData: P, selectorsData: C, tablesData: F, extendedData: G }, i2;
  }

  // ../textures/src/lib/utils/extract-mipmap-images.ts
  function extractMipmapImages(data, options) {
    const images = new Array(options.mipMapLevels);
    let levelWidth = options.width;
    let levelHeight = options.height;
    let offset = 0;
    for (let i2 = 0; i2 < options.mipMapLevels; ++i2) {
      const levelSize = getLevelSize(options, levelWidth, levelHeight, data, i2);
      const levelData = getLevelData(data, i2, offset, levelSize);
      images[i2] = {
        compressed: true,
        format: options.internalFormat,
        data: levelData,
        width: levelWidth,
        height: levelHeight,
        levelSize
      };
      levelWidth = Math.max(1, levelWidth >> 1);
      levelHeight = Math.max(1, levelHeight >> 1);
      offset += levelSize;
    }
    return images;
  }
  function getLevelData(data, index, offset, levelSize) {
    if (!Array.isArray(data)) {
      return new Uint8Array(data.buffer, data.byteOffset + offset, levelSize);
    }
    return data[index].levelData;
  }
  function getLevelSize(options, levelWidth, levelHeight, data, index) {
    if (!Array.isArray(data)) {
      return options.sizeFunction(levelWidth, levelHeight);
    }
    return options.sizeFunction(data[index]);
  }

  // ../textures/src/lib/utils/ktx-format-helper.ts
  var VULKAN_TO_WEBGL_FORMAT_MAP = {
    131: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_S3TC_DXT1_EXT,
    132: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB_S3TC_DXT1_EXT,
    133: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_S3TC_DXT1_EXT,
    134: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT,
    135: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_S3TC_DXT3_EXT,
    136: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT,
    137: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
    138: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT,
    139: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RED_RGTC1_EXT,
    140: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SIGNED_RED_RGTC1_EXT,
    141: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RED_GREEN_RGTC2_EXT,
    142: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT,
    147: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB8_ETC2,
    148: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ETC2,
    149: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2,
    150: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2,
    151: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA8_ETC2_EAC,
    152: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC,
    153: GL_EXTENSIONS_CONSTANTS.COMPRESSED_R11_EAC,
    154: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SIGNED_R11_EAC,
    155: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RG11_EAC,
    156: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SIGNED_RG11_EAC,
    157: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_4x4_KHR,
    158: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR,
    159: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_5x4_KHR,
    160: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR,
    161: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_5x5_KHR,
    162: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR,
    163: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_6x5_KHR,
    164: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR,
    165: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_6x6_KHR,
    166: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR,
    167: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_8x5_KHR,
    168: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR,
    169: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_8x6_KHR,
    170: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR,
    171: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_8x8_KHR,
    172: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR,
    173: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10x5_KHR,
    174: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR,
    175: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10x6_KHR,
    176: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR,
    177: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10x8_KHR,
    178: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR,
    179: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10x10_KHR,
    180: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR,
    181: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_12x10_KHR,
    182: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR,
    183: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_12x12_KHR,
    184: GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR,
    1000054e3: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG,
    1000054001: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG,
    1000066e3: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_4x4_KHR,
    1000066001: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_5x4_KHR,
    1000066002: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_5x5_KHR,
    1000066003: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_6x5_KHR,
    1000066004: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_6x6_KHR,
    1000066005: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_8x5_KHR,
    1000066006: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_8x6_KHR,
    1000066007: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_8x8_KHR,
    1000066008: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10x5_KHR,
    1000066009: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10x6_KHR,
    1000066010: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10x8_KHR,
    1000066011: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10x10_KHR,
    1000066012: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_12x10_KHR,
    1000066013: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_12x12_KHR
  };
  function mapVkFormatToWebGL(vkFormat) {
    return VULKAN_TO_WEBGL_FORMAT_MAP[vkFormat];
  }

  // ../textures/src/lib/parsers/parse-ktx.ts
  var KTX2_ID = [
    171,
    75,
    84,
    88,
    32,
    50,
    48,
    187,
    13,
    10,
    26,
    10
  ];
  function isKTX(data) {
    const id = new Uint8Array(data);
    const notKTX = id.byteLength < KTX2_ID.length || id[0] !== KTX2_ID[0] || id[1] !== KTX2_ID[1] || id[2] !== KTX2_ID[2] || id[3] !== KTX2_ID[3] || id[4] !== KTX2_ID[4] || id[5] !== KTX2_ID[5] || id[6] !== KTX2_ID[6] || id[7] !== KTX2_ID[7] || id[8] !== KTX2_ID[8] || id[9] !== KTX2_ID[9] || id[10] !== KTX2_ID[10] || id[11] !== KTX2_ID[11];
    return !notKTX;
  }
  function parseKTX(arrayBuffer) {
    const uint8Array = new Uint8Array(arrayBuffer);
    const ktx = p(uint8Array);
    const mipMapLevels = Math.max(1, ktx.levels.length);
    const width = ktx.pixelWidth;
    const height = ktx.pixelHeight;
    const internalFormat = mapVkFormatToWebGL(ktx.vkFormat);
    return extractMipmapImages(ktx.levels, {
      mipMapLevels,
      width,
      height,
      sizeFunction: (level) => level.uncompressedByteLength,
      internalFormat
    });
  }

  // ../textures/src/lib/parsers/parse-basis.ts
  var OutputFormat = {
    etc1: {
      basisFormat: 0,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_ETC1_WEBGL
    },
    etc2: { basisFormat: 1, compressed: true },
    bc1: {
      basisFormat: 2,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_S3TC_DXT1_EXT
    },
    bc3: {
      basisFormat: 3,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_S3TC_DXT5_EXT
    },
    bc4: { basisFormat: 4, compressed: true },
    bc5: { basisFormat: 5, compressed: true },
    "bc7-m6-opaque-only": { basisFormat: 6, compressed: true },
    "bc7-m5": { basisFormat: 7, compressed: true },
    "pvrtc1-4-rgb": {
      basisFormat: 8,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_PVRTC_4BPPV1_IMG
    },
    "pvrtc1-4-rgba": {
      basisFormat: 9,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
    },
    "astc-4x4": {
      basisFormat: 10,
      compressed: true,
      format: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_4X4_KHR
    },
    "atc-rgb": { basisFormat: 11, compressed: true },
    "atc-rgba-interpolated-alpha": { basisFormat: 12, compressed: true },
    rgba32: { basisFormat: 13, compressed: false },
    rgb565: { basisFormat: 14, compressed: false },
    bgr565: { basisFormat: 15, compressed: false },
    rgba4444: { basisFormat: 16, compressed: false }
  };
  async function parseBasis(data, options) {
    if (options.basis.containerFormat === "auto") {
      if (isKTX(data)) {
        const fileConstructors = await loadBasisEncoderModule(options);
        return parseKTX2File(fileConstructors.KTX2File, data, options);
      }
      const { BasisFile } = await loadBasisTrascoderModule(options);
      return parseBasisFile(BasisFile, data, options);
    }
    switch (options.basis.module) {
      case "encoder":
        const fileConstructors = await loadBasisEncoderModule(options);
        switch (options.basis.containerFormat) {
          case "ktx2":
            return parseKTX2File(fileConstructors.KTX2File, data, options);
          case "basis":
          default:
            return parseBasisFile(fileConstructors.BasisFile, data, options);
        }
      case "transcoder":
      default:
        const { BasisFile } = await loadBasisTrascoderModule(options);
        return parseBasisFile(BasisFile, data, options);
    }
  }
  function parseBasisFile(BasisFile, data, options) {
    const basisFile = new BasisFile(new Uint8Array(data));
    try {
      if (!basisFile.startTranscoding()) {
        throw new Error("Failed to start basis transcoding");
      }
      const imageCount = basisFile.getNumImages();
      const images = [];
      for (let imageIndex = 0; imageIndex < imageCount; imageIndex++) {
        const levelsCount = basisFile.getNumLevels(imageIndex);
        const levels = [];
        for (let levelIndex = 0; levelIndex < levelsCount; levelIndex++) {
          levels.push(transcodeImage(basisFile, imageIndex, levelIndex, options));
        }
        images.push(levels);
      }
      return images;
    } finally {
      basisFile.close();
      basisFile.delete();
    }
  }
  function transcodeImage(basisFile, imageIndex, levelIndex, options) {
    const width = basisFile.getImageWidth(imageIndex, levelIndex);
    const height = basisFile.getImageHeight(imageIndex, levelIndex);
    const hasAlpha = basisFile.getHasAlpha();
    const { compressed, format, basisFormat } = getBasisOptions(options, hasAlpha);
    const decodedSize = basisFile.getImageTranscodedSizeInBytes(imageIndex, levelIndex, basisFormat);
    const decodedData = new Uint8Array(decodedSize);
    if (!basisFile.transcodeImage(decodedData, imageIndex, levelIndex, basisFormat, 0, 0)) {
      throw new Error("failed to start Basis transcoding");
    }
    return {
      width,
      height,
      data: decodedData,
      compressed,
      format,
      hasAlpha
    };
  }
  function parseKTX2File(KTX2File, data, options) {
    const ktx2File = new KTX2File(new Uint8Array(data));
    try {
      if (!ktx2File.startTranscoding()) {
        throw new Error("failed to start KTX2 transcoding");
      }
      const levelsCount = ktx2File.getLevels();
      const levels = [];
      for (let levelIndex = 0; levelIndex < levelsCount; levelIndex++) {
        levels.push(transcodeKTX2Image(ktx2File, levelIndex, options));
        break;
      }
      return [levels];
    } finally {
      ktx2File.close();
      ktx2File.delete();
    }
  }
  function transcodeKTX2Image(ktx2File, levelIndex, options) {
    const { alphaFlag, height, width } = ktx2File.getImageLevelInfo(levelIndex, 0, 0);
    const { compressed, format, basisFormat } = getBasisOptions(options, alphaFlag);
    const decodedSize = ktx2File.getImageTranscodedSizeInBytes(levelIndex, 0, 0, basisFormat);
    const decodedData = new Uint8Array(decodedSize);
    if (!ktx2File.transcodeImage(decodedData, levelIndex, 0, 0, basisFormat, 0, -1, -1)) {
      throw new Error("Failed to transcode KTX2 image");
    }
    return {
      width,
      height,
      data: decodedData,
      compressed,
      levelSize: decodedSize,
      hasAlpha: alphaFlag,
      format
    };
  }
  function getBasisOptions(options, hasAlpha) {
    let format = options && options.basis && options.basis.format;
    if (format === "auto") {
      format = selectSupportedBasisFormat();
    }
    if (typeof format === "object") {
      format = hasAlpha ? format.alpha : format.noAlpha;
    }
    format = format.toLowerCase();
    return OutputFormat[format];
  }
  function selectSupportedBasisFormat() {
    const supportedFormats = getSupportedGPUTextureFormats();
    if (supportedFormats.has("astc")) {
      return "astc-4x4";
    } else if (supportedFormats.has("dxt")) {
      return {
        alpha: "bc3",
        noAlpha: "bc1"
      };
    } else if (supportedFormats.has("pvrtc")) {
      return {
        alpha: "pvrtc1-4-rgba",
        noAlpha: "pvrtc1-4-rgb"
      };
    } else if (supportedFormats.has("etc1")) {
      return "etc1";
    } else if (supportedFormats.has("etc2")) {
      return "etc2";
    }
    return "rgb565";
  }

  // ../textures/src/basis-loader.ts
  var BasisWorkerLoader = {
    name: "Basis",
    id: "basis",
    module: "textures",
    version: VERSION6,
    worker: true,
    extensions: ["basis", "ktx2"],
    mimeTypes: ["application/octet-stream", "image/ktx2"],
    tests: ["sB"],
    binary: true,
    options: {
      basis: {
        format: "auto",
        libraryPath: "libs/",
        containerFormat: "auto",
        module: "transcoder"
      }
    }
  };
  var BasisLoader = {
    ...BasisWorkerLoader,
    parse: parseBasis
  };

  // ../textures/src/lib/parsers/parse-dds.ts
  var DDS_CONSTANTS = {
    MAGIC_NUMBER: 542327876,
    HEADER_LENGTH: 31,
    MAGIC_NUMBER_INDEX: 0,
    HEADER_SIZE_INDEX: 1,
    HEADER_FLAGS_INDEX: 2,
    HEADER_HEIGHT_INDEX: 3,
    HEADER_WIDTH_INDEX: 4,
    MIPMAPCOUNT_INDEX: 7,
    HEADER_PF_FLAGS_INDEX: 20,
    HEADER_PF_FOURCC_INDEX: 21,
    DDSD_MIPMAPCOUNT: 131072,
    DDPF_FOURCC: 4
  };
  var DDS_PIXEL_FORMATS = {
    DXT1: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_S3TC_DXT1_EXT,
    DXT3: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_S3TC_DXT3_EXT,
    DXT5: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
    "ATC ": GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_ATC_WEBGL,
    ATCA: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL,
    ATCI: GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL
  };
  var getATCLevelSize = getDxt1LevelSize;
  var getATCALevelSize = getDxtXLevelSize;
  var getATCILevelSize = getDxtXLevelSize;
  var DDS_SIZE_FUNCTIONS = {
    DXT1: getDxt1LevelSize,
    DXT3: getDxtXLevelSize,
    DXT5: getDxtXLevelSize,
    "ATC ": getATCLevelSize,
    ATCA: getATCALevelSize,
    ATCI: getATCILevelSize
  };
  function isDDS(data) {
    const header = new Uint32Array(data, 0, DDS_CONSTANTS.HEADER_LENGTH);
    const magic = header[DDS_CONSTANTS.MAGIC_NUMBER_INDEX];
    return magic === DDS_CONSTANTS.MAGIC_NUMBER;
  }
  function parseDDS(data) {
    const header = new Int32Array(data, 0, DDS_CONSTANTS.HEADER_LENGTH);
    const pixelFormatNumber = header[DDS_CONSTANTS.HEADER_PF_FOURCC_INDEX];
    assert(Boolean(header[DDS_CONSTANTS.HEADER_PF_FLAGS_INDEX] & DDS_CONSTANTS.DDPF_FOURCC), "DDS: Unsupported format, must contain a FourCC code");
    const fourCC = int32ToFourCC(pixelFormatNumber);
    const internalFormat = DDS_PIXEL_FORMATS[fourCC];
    const sizeFunction = DDS_SIZE_FUNCTIONS[fourCC];
    assert(internalFormat && sizeFunction, `DDS: Unknown pixel format ${pixelFormatNumber}`);
    let mipMapLevels = 1;
    if (header[DDS_CONSTANTS.HEADER_FLAGS_INDEX] & DDS_CONSTANTS.DDSD_MIPMAPCOUNT) {
      mipMapLevels = Math.max(1, header[DDS_CONSTANTS.MIPMAPCOUNT_INDEX]);
    }
    const width = header[DDS_CONSTANTS.HEADER_WIDTH_INDEX];
    const height = header[DDS_CONSTANTS.HEADER_HEIGHT_INDEX];
    const dataOffset = header[DDS_CONSTANTS.HEADER_SIZE_INDEX] + 4;
    const image = new Uint8Array(data, dataOffset);
    return extractMipmapImages(image, {
      mipMapLevels,
      width,
      height,
      sizeFunction,
      internalFormat
    });
  }
  function getDxt1LevelSize(width, height) {
    return (width + 3 >> 2) * (height + 3 >> 2) * 8;
  }
  function getDxtXLevelSize(width, height) {
    return (width + 3 >> 2) * (height + 3 >> 2) * 16;
  }
  function int32ToFourCC(value) {
    return String.fromCharCode(value & 255, value >> 8 & 255, value >> 16 & 255, value >> 24 & 255);
  }

  // ../textures/src/lib/parsers/parse-pvr.ts
  var PVR_CONSTANTS = {
    MAGIC_NUMBER: 55727696,
    MAGIC_NUMBER_EXTRA: 1347834371,
    HEADER_LENGTH: 13,
    HEADER_SIZE: 52,
    MAGIC_NUMBER_INDEX: 0,
    PIXEL_FORMAT_INDEX: 2,
    COLOUR_SPACE_INDEX: 4,
    HEIGHT_INDEX: 6,
    WIDTH_INDEX: 7,
    MIPMAPCOUNT_INDEX: 11,
    METADATA_SIZE_INDEX: 12
  };
  var PVR_PIXEL_FORMATS = {
    0: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_PVRTC_2BPPV1_IMG],
    1: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG],
    2: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_PVRTC_4BPPV1_IMG],
    3: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG],
    6: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_ETC1_WEBGL],
    7: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB_S3TC_DXT1_EXT],
    9: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_S3TC_DXT3_EXT],
    11: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_S3TC_DXT5_EXT],
    22: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB8_ETC2],
    23: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA8_ETC2_EAC],
    24: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2],
    25: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_R11_EAC],
    26: [GL_EXTENSIONS_CONSTANTS.COMPRESSED_RG11_EAC],
    27: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_4X4_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_4X4_KHR
    ],
    28: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_5X4_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_5X4_KHR
    ],
    29: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_5X5_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_5X5_KHR
    ],
    30: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_6X5_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_6X5_KHR
    ],
    31: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_6X6_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_6X6_KHR
    ],
    32: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_8X5_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_8X5_KHR
    ],
    33: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_8X6_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_8X6_KHR
    ],
    34: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_8X8_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_8X8_KHR
    ],
    35: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10X5_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_10X5_KHR
    ],
    36: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10X6_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_10X6_KHR
    ],
    37: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10X8_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_10X8_KHR
    ],
    38: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_10X10_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_10X10_KHR
    ],
    39: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_12X10_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_12X10_KHR
    ],
    40: [
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_RGBA_ASTC_12X12_KHR,
      GL_EXTENSIONS_CONSTANTS.COMPRESSED_SRGB8_ALPHA8_ASTC_12X12_KHR
    ]
  };
  var PVR_SIZE_FUNCTIONS = {
    0: pvrtc2bppSize,
    1: pvrtc2bppSize,
    2: pvrtc4bppSize,
    3: pvrtc4bppSize,
    6: dxtEtcSmallSize,
    7: dxtEtcSmallSize,
    9: dxtEtcAstcBigSize,
    11: dxtEtcAstcBigSize,
    22: dxtEtcSmallSize,
    23: dxtEtcAstcBigSize,
    24: dxtEtcSmallSize,
    25: dxtEtcSmallSize,
    26: dxtEtcAstcBigSize,
    27: dxtEtcAstcBigSize,
    28: atc5x4Size,
    29: atc5x5Size,
    30: atc6x5Size,
    31: atc6x6Size,
    32: atc8x5Size,
    33: atc8x6Size,
    34: atc8x8Size,
    35: atc10x5Size,
    36: atc10x6Size,
    37: atc10x8Size,
    38: atc10x10Size,
    39: atc12x10Size,
    40: atc12x12Size
  };
  function isPVR(data) {
    const header = new Uint32Array(data, 0, PVR_CONSTANTS.HEADER_LENGTH);
    const version = header[PVR_CONSTANTS.MAGIC_NUMBER_INDEX];
    return version === PVR_CONSTANTS.MAGIC_NUMBER || version === PVR_CONSTANTS.MAGIC_NUMBER_EXTRA;
  }
  function parsePVR(data) {
    const header = new Uint32Array(data, 0, PVR_CONSTANTS.HEADER_LENGTH);
    const pvrFormat = header[PVR_CONSTANTS.PIXEL_FORMAT_INDEX];
    const colourSpace = header[PVR_CONSTANTS.COLOUR_SPACE_INDEX];
    const pixelFormats = PVR_PIXEL_FORMATS[pvrFormat] || [];
    const internalFormat = pixelFormats.length > 1 && colourSpace ? pixelFormats[1] : pixelFormats[0];
    const sizeFunction = PVR_SIZE_FUNCTIONS[pvrFormat];
    const mipMapLevels = header[PVR_CONSTANTS.MIPMAPCOUNT_INDEX];
    const width = header[PVR_CONSTANTS.WIDTH_INDEX];
    const height = header[PVR_CONSTANTS.HEIGHT_INDEX];
    const dataOffset = PVR_CONSTANTS.HEADER_SIZE + header[PVR_CONSTANTS.METADATA_SIZE_INDEX];
    const image = new Uint8Array(data, dataOffset);
    return extractMipmapImages(image, {
      mipMapLevels,
      width,
      height,
      sizeFunction,
      internalFormat
    });
  }
  function pvrtc2bppSize(width, height) {
    width = Math.max(width, 16);
    height = Math.max(height, 8);
    return width * height / 4;
  }
  function pvrtc4bppSize(width, height) {
    width = Math.max(width, 8);
    height = Math.max(height, 8);
    return width * height / 2;
  }
  function dxtEtcSmallSize(width, height) {
    return Math.floor((width + 3) / 4) * Math.floor((height + 3) / 4) * 8;
  }
  function dxtEtcAstcBigSize(width, height) {
    return Math.floor((width + 3) / 4) * Math.floor((height + 3) / 4) * 16;
  }
  function atc5x4Size(width, height) {
    return Math.floor((width + 4) / 5) * Math.floor((height + 3) / 4) * 16;
  }
  function atc5x5Size(width, height) {
    return Math.floor((width + 4) / 5) * Math.floor((height + 4) / 5) * 16;
  }
  function atc6x5Size(width, height) {
    return Math.floor((width + 5) / 6) * Math.floor((height + 4) / 5) * 16;
  }
  function atc6x6Size(width, height) {
    return Math.floor((width + 5) / 6) * Math.floor((height + 5) / 6) * 16;
  }
  function atc8x5Size(width, height) {
    return Math.floor((width + 7) / 8) * Math.floor((height + 4) / 5) * 16;
  }
  function atc8x6Size(width, height) {
    return Math.floor((width + 7) / 8) * Math.floor((height + 5) / 6) * 16;
  }
  function atc8x8Size(width, height) {
    return Math.floor((width + 7) / 8) * Math.floor((height + 7) / 8) * 16;
  }
  function atc10x5Size(width, height) {
    return Math.floor((width + 9) / 10) * Math.floor((height + 4) / 5) * 16;
  }
  function atc10x6Size(width, height) {
    return Math.floor((width + 9) / 10) * Math.floor((height + 5) / 6) * 16;
  }
  function atc10x8Size(width, height) {
    return Math.floor((width + 9) / 10) * Math.floor((height + 7) / 8) * 16;
  }
  function atc10x10Size(width, height) {
    return Math.floor((width + 9) / 10) * Math.floor((height + 9) / 10) * 16;
  }
  function atc12x10Size(width, height) {
    return Math.floor((width + 11) / 12) * Math.floor((height + 9) / 10) * 16;
  }
  function atc12x12Size(width, height) {
    return Math.floor((width + 11) / 12) * Math.floor((height + 11) / 12) * 16;
  }

  // ../textures/src/lib/parsers/parse-compressed-texture.ts
  function parseCompressedTexture(data) {
    if (isKTX(data)) {
      return parseKTX(data);
    }
    if (isDDS(data)) {
      return parseDDS(data);
    }
    if (isPVR(data)) {
      return parsePVR(data);
    }
    throw new Error("Texture container format not recognized");
  }

  // ../textures/src/compressed-texture-loader.ts
  var DEFAULT_TEXTURE_LOADER_OPTIONS = {
    "compressed-texture": {
      libraryPath: "libs/",
      useBasis: false
    }
  };
  var CompressedTextureWorkerLoader = {
    name: "Texture Containers",
    id: "compressed-texture",
    module: "textures",
    version: VERSION6,
    worker: true,
    extensions: [
      "ktx",
      "ktx2",
      "dds",
      "pvr"
    ],
    mimeTypes: [
      "image/ktx2",
      "image/ktx",
      "image/vnd-ms.dds",
      "image/x-dds",
      "application/octet-stream"
    ],
    binary: true,
    options: DEFAULT_TEXTURE_LOADER_OPTIONS
  };
  var CompressedTextureLoader = {
    ...CompressedTextureWorkerLoader,
    parse: async (arrayBuffer, options) => {
      if (options["compressed-texture"].useBasis) {
        options.basis = {
          format: {
            alpha: "BC3",
            noAlpha: "BC1"
          },
          ...options.basis,
          containerFormat: "ktx2",
          module: "encoder"
        };
        return (await parseBasis(arrayBuffer, options))[0];
      }
      return parseCompressedTexture(arrayBuffer);
    }
  };

  // src/types.ts
  var DATA_TYPE;
  (function(DATA_TYPE2) {
    DATA_TYPE2["UInt8"] = "UInt8";
    DATA_TYPE2["UInt16"] = "UInt16";
    DATA_TYPE2["UInt32"] = "UInt32";
    DATA_TYPE2["UInt64"] = "UInt64";
    DATA_TYPE2["Int16"] = "Int16";
    DATA_TYPE2["Int32"] = "Int32";
    DATA_TYPE2["Int64"] = "Int64";
    DATA_TYPE2["Float32"] = "Float32";
    DATA_TYPE2["Float64"] = "Float64";
  })(DATA_TYPE || (DATA_TYPE = {}));
  var HeaderAttributeProperty;
  (function(HeaderAttributeProperty2) {
    HeaderAttributeProperty2["vertexCount"] = "vertexCount";
    HeaderAttributeProperty2["featureCount"] = "featureCount";
  })(HeaderAttributeProperty || (HeaderAttributeProperty = {}));

  // src/lib/utils/url-utils.ts
  function getUrlWithToken(url, token = null) {
    return token ? `${url}?token=${token}` : url;
  }

  // ../../node_modules/@luma.gl/constants/dist/esm/index.js
  var esm_default = {
    DEPTH_BUFFER_BIT: 256,
    STENCIL_BUFFER_BIT: 1024,
    COLOR_BUFFER_BIT: 16384,
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6,
    ZERO: 0,
    ONE: 1,
    SRC_COLOR: 768,
    ONE_MINUS_SRC_COLOR: 769,
    SRC_ALPHA: 770,
    ONE_MINUS_SRC_ALPHA: 771,
    DST_ALPHA: 772,
    ONE_MINUS_DST_ALPHA: 773,
    DST_COLOR: 774,
    ONE_MINUS_DST_COLOR: 775,
    SRC_ALPHA_SATURATE: 776,
    CONSTANT_COLOR: 32769,
    ONE_MINUS_CONSTANT_COLOR: 32770,
    CONSTANT_ALPHA: 32771,
    ONE_MINUS_CONSTANT_ALPHA: 32772,
    FUNC_ADD: 32774,
    FUNC_SUBTRACT: 32778,
    FUNC_REVERSE_SUBTRACT: 32779,
    BLEND_EQUATION: 32777,
    BLEND_EQUATION_RGB: 32777,
    BLEND_EQUATION_ALPHA: 34877,
    BLEND_DST_RGB: 32968,
    BLEND_SRC_RGB: 32969,
    BLEND_DST_ALPHA: 32970,
    BLEND_SRC_ALPHA: 32971,
    BLEND_COLOR: 32773,
    ARRAY_BUFFER_BINDING: 34964,
    ELEMENT_ARRAY_BUFFER_BINDING: 34965,
    LINE_WIDTH: 2849,
    ALIASED_POINT_SIZE_RANGE: 33901,
    ALIASED_LINE_WIDTH_RANGE: 33902,
    CULL_FACE_MODE: 2885,
    FRONT_FACE: 2886,
    DEPTH_RANGE: 2928,
    DEPTH_WRITEMASK: 2930,
    DEPTH_CLEAR_VALUE: 2931,
    DEPTH_FUNC: 2932,
    STENCIL_CLEAR_VALUE: 2961,
    STENCIL_FUNC: 2962,
    STENCIL_FAIL: 2964,
    STENCIL_PASS_DEPTH_FAIL: 2965,
    STENCIL_PASS_DEPTH_PASS: 2966,
    STENCIL_REF: 2967,
    STENCIL_VALUE_MASK: 2963,
    STENCIL_WRITEMASK: 2968,
    STENCIL_BACK_FUNC: 34816,
    STENCIL_BACK_FAIL: 34817,
    STENCIL_BACK_PASS_DEPTH_FAIL: 34818,
    STENCIL_BACK_PASS_DEPTH_PASS: 34819,
    STENCIL_BACK_REF: 36003,
    STENCIL_BACK_VALUE_MASK: 36004,
    STENCIL_BACK_WRITEMASK: 36005,
    VIEWPORT: 2978,
    SCISSOR_BOX: 3088,
    COLOR_CLEAR_VALUE: 3106,
    COLOR_WRITEMASK: 3107,
    UNPACK_ALIGNMENT: 3317,
    PACK_ALIGNMENT: 3333,
    MAX_TEXTURE_SIZE: 3379,
    MAX_VIEWPORT_DIMS: 3386,
    SUBPIXEL_BITS: 3408,
    RED_BITS: 3410,
    GREEN_BITS: 3411,
    BLUE_BITS: 3412,
    ALPHA_BITS: 3413,
    DEPTH_BITS: 3414,
    STENCIL_BITS: 3415,
    POLYGON_OFFSET_UNITS: 10752,
    POLYGON_OFFSET_FACTOR: 32824,
    TEXTURE_BINDING_2D: 32873,
    SAMPLE_BUFFERS: 32936,
    SAMPLES: 32937,
    SAMPLE_COVERAGE_VALUE: 32938,
    SAMPLE_COVERAGE_INVERT: 32939,
    COMPRESSED_TEXTURE_FORMATS: 34467,
    VENDOR: 7936,
    RENDERER: 7937,
    VERSION: 7938,
    IMPLEMENTATION_COLOR_READ_TYPE: 35738,
    IMPLEMENTATION_COLOR_READ_FORMAT: 35739,
    BROWSER_DEFAULT_WEBGL: 37444,
    STATIC_DRAW: 35044,
    STREAM_DRAW: 35040,
    DYNAMIC_DRAW: 35048,
    ARRAY_BUFFER: 34962,
    ELEMENT_ARRAY_BUFFER: 34963,
    BUFFER_SIZE: 34660,
    BUFFER_USAGE: 34661,
    CURRENT_VERTEX_ATTRIB: 34342,
    VERTEX_ATTRIB_ARRAY_ENABLED: 34338,
    VERTEX_ATTRIB_ARRAY_SIZE: 34339,
    VERTEX_ATTRIB_ARRAY_STRIDE: 34340,
    VERTEX_ATTRIB_ARRAY_TYPE: 34341,
    VERTEX_ATTRIB_ARRAY_NORMALIZED: 34922,
    VERTEX_ATTRIB_ARRAY_POINTER: 34373,
    VERTEX_ATTRIB_ARRAY_BUFFER_BINDING: 34975,
    CULL_FACE: 2884,
    FRONT: 1028,
    BACK: 1029,
    FRONT_AND_BACK: 1032,
    BLEND: 3042,
    DEPTH_TEST: 2929,
    DITHER: 3024,
    POLYGON_OFFSET_FILL: 32823,
    SAMPLE_ALPHA_TO_COVERAGE: 32926,
    SAMPLE_COVERAGE: 32928,
    SCISSOR_TEST: 3089,
    STENCIL_TEST: 2960,
    NO_ERROR: 0,
    INVALID_ENUM: 1280,
    INVALID_VALUE: 1281,
    INVALID_OPERATION: 1282,
    OUT_OF_MEMORY: 1285,
    CONTEXT_LOST_WEBGL: 37442,
    CW: 2304,
    CCW: 2305,
    DONT_CARE: 4352,
    FASTEST: 4353,
    NICEST: 4354,
    GENERATE_MIPMAP_HINT: 33170,
    BYTE: 5120,
    UNSIGNED_BYTE: 5121,
    SHORT: 5122,
    UNSIGNED_SHORT: 5123,
    INT: 5124,
    UNSIGNED_INT: 5125,
    FLOAT: 5126,
    DOUBLE: 5130,
    DEPTH_COMPONENT: 6402,
    ALPHA: 6406,
    RGB: 6407,
    RGBA: 6408,
    LUMINANCE: 6409,
    LUMINANCE_ALPHA: 6410,
    UNSIGNED_SHORT_4_4_4_4: 32819,
    UNSIGNED_SHORT_5_5_5_1: 32820,
    UNSIGNED_SHORT_5_6_5: 33635,
    FRAGMENT_SHADER: 35632,
    VERTEX_SHADER: 35633,
    COMPILE_STATUS: 35713,
    DELETE_STATUS: 35712,
    LINK_STATUS: 35714,
    VALIDATE_STATUS: 35715,
    ATTACHED_SHADERS: 35717,
    ACTIVE_ATTRIBUTES: 35721,
    ACTIVE_UNIFORMS: 35718,
    MAX_VERTEX_ATTRIBS: 34921,
    MAX_VERTEX_UNIFORM_VECTORS: 36347,
    MAX_VARYING_VECTORS: 36348,
    MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
    MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
    MAX_TEXTURE_IMAGE_UNITS: 34930,
    MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
    SHADER_TYPE: 35663,
    SHADING_LANGUAGE_VERSION: 35724,
    CURRENT_PROGRAM: 35725,
    NEVER: 512,
    ALWAYS: 519,
    LESS: 513,
    EQUAL: 514,
    LEQUAL: 515,
    GREATER: 516,
    GEQUAL: 518,
    NOTEQUAL: 517,
    KEEP: 7680,
    REPLACE: 7681,
    INCR: 7682,
    DECR: 7683,
    INVERT: 5386,
    INCR_WRAP: 34055,
    DECR_WRAP: 34056,
    NEAREST: 9728,
    LINEAR: 9729,
    NEAREST_MIPMAP_NEAREST: 9984,
    LINEAR_MIPMAP_NEAREST: 9985,
    NEAREST_MIPMAP_LINEAR: 9986,
    LINEAR_MIPMAP_LINEAR: 9987,
    TEXTURE_MAG_FILTER: 10240,
    TEXTURE_MIN_FILTER: 10241,
    TEXTURE_WRAP_S: 10242,
    TEXTURE_WRAP_T: 10243,
    TEXTURE_2D: 3553,
    TEXTURE: 5890,
    TEXTURE_CUBE_MAP: 34067,
    TEXTURE_BINDING_CUBE_MAP: 34068,
    TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
    TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
    TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
    TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
    TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
    TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074,
    MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
    TEXTURE0: 33984,
    ACTIVE_TEXTURE: 34016,
    REPEAT: 10497,
    CLAMP_TO_EDGE: 33071,
    MIRRORED_REPEAT: 33648,
    TEXTURE_WIDTH: 4096,
    TEXTURE_HEIGHT: 4097,
    FLOAT_VEC2: 35664,
    FLOAT_VEC3: 35665,
    FLOAT_VEC4: 35666,
    INT_VEC2: 35667,
    INT_VEC3: 35668,
    INT_VEC4: 35669,
    BOOL: 35670,
    BOOL_VEC2: 35671,
    BOOL_VEC3: 35672,
    BOOL_VEC4: 35673,
    FLOAT_MAT2: 35674,
    FLOAT_MAT3: 35675,
    FLOAT_MAT4: 35676,
    SAMPLER_2D: 35678,
    SAMPLER_CUBE: 35680,
    LOW_FLOAT: 36336,
    MEDIUM_FLOAT: 36337,
    HIGH_FLOAT: 36338,
    LOW_INT: 36339,
    MEDIUM_INT: 36340,
    HIGH_INT: 36341,
    FRAMEBUFFER: 36160,
    RENDERBUFFER: 36161,
    RGBA4: 32854,
    RGB5_A1: 32855,
    RGB565: 36194,
    DEPTH_COMPONENT16: 33189,
    STENCIL_INDEX: 6401,
    STENCIL_INDEX8: 36168,
    DEPTH_STENCIL: 34041,
    RENDERBUFFER_WIDTH: 36162,
    RENDERBUFFER_HEIGHT: 36163,
    RENDERBUFFER_INTERNAL_FORMAT: 36164,
    RENDERBUFFER_RED_SIZE: 36176,
    RENDERBUFFER_GREEN_SIZE: 36177,
    RENDERBUFFER_BLUE_SIZE: 36178,
    RENDERBUFFER_ALPHA_SIZE: 36179,
    RENDERBUFFER_DEPTH_SIZE: 36180,
    RENDERBUFFER_STENCIL_SIZE: 36181,
    FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE: 36048,
    FRAMEBUFFER_ATTACHMENT_OBJECT_NAME: 36049,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL: 36050,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE: 36051,
    COLOR_ATTACHMENT0: 36064,
    DEPTH_ATTACHMENT: 36096,
    STENCIL_ATTACHMENT: 36128,
    DEPTH_STENCIL_ATTACHMENT: 33306,
    NONE: 0,
    FRAMEBUFFER_COMPLETE: 36053,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT: 36054,
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: 36055,
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS: 36057,
    FRAMEBUFFER_UNSUPPORTED: 36061,
    FRAMEBUFFER_BINDING: 36006,
    RENDERBUFFER_BINDING: 36007,
    READ_FRAMEBUFFER: 36008,
    DRAW_FRAMEBUFFER: 36009,
    MAX_RENDERBUFFER_SIZE: 34024,
    INVALID_FRAMEBUFFER_OPERATION: 1286,
    UNPACK_FLIP_Y_WEBGL: 37440,
    UNPACK_PREMULTIPLY_ALPHA_WEBGL: 37441,
    UNPACK_COLORSPACE_CONVERSION_WEBGL: 37443,
    READ_BUFFER: 3074,
    UNPACK_ROW_LENGTH: 3314,
    UNPACK_SKIP_ROWS: 3315,
    UNPACK_SKIP_PIXELS: 3316,
    PACK_ROW_LENGTH: 3330,
    PACK_SKIP_ROWS: 3331,
    PACK_SKIP_PIXELS: 3332,
    TEXTURE_BINDING_3D: 32874,
    UNPACK_SKIP_IMAGES: 32877,
    UNPACK_IMAGE_HEIGHT: 32878,
    MAX_3D_TEXTURE_SIZE: 32883,
    MAX_ELEMENTS_VERTICES: 33e3,
    MAX_ELEMENTS_INDICES: 33001,
    MAX_TEXTURE_LOD_BIAS: 34045,
    MAX_FRAGMENT_UNIFORM_COMPONENTS: 35657,
    MAX_VERTEX_UNIFORM_COMPONENTS: 35658,
    MAX_ARRAY_TEXTURE_LAYERS: 35071,
    MIN_PROGRAM_TEXEL_OFFSET: 35076,
    MAX_PROGRAM_TEXEL_OFFSET: 35077,
    MAX_VARYING_COMPONENTS: 35659,
    FRAGMENT_SHADER_DERIVATIVE_HINT: 35723,
    RASTERIZER_DISCARD: 35977,
    VERTEX_ARRAY_BINDING: 34229,
    MAX_VERTEX_OUTPUT_COMPONENTS: 37154,
    MAX_FRAGMENT_INPUT_COMPONENTS: 37157,
    MAX_SERVER_WAIT_TIMEOUT: 37137,
    MAX_ELEMENT_INDEX: 36203,
    RED: 6403,
    RGB8: 32849,
    RGBA8: 32856,
    RGB10_A2: 32857,
    TEXTURE_3D: 32879,
    TEXTURE_WRAP_R: 32882,
    TEXTURE_MIN_LOD: 33082,
    TEXTURE_MAX_LOD: 33083,
    TEXTURE_BASE_LEVEL: 33084,
    TEXTURE_MAX_LEVEL: 33085,
    TEXTURE_COMPARE_MODE: 34892,
    TEXTURE_COMPARE_FUNC: 34893,
    SRGB: 35904,
    SRGB8: 35905,
    SRGB8_ALPHA8: 35907,
    COMPARE_REF_TO_TEXTURE: 34894,
    RGBA32F: 34836,
    RGB32F: 34837,
    RGBA16F: 34842,
    RGB16F: 34843,
    TEXTURE_2D_ARRAY: 35866,
    TEXTURE_BINDING_2D_ARRAY: 35869,
    R11F_G11F_B10F: 35898,
    RGB9_E5: 35901,
    RGBA32UI: 36208,
    RGB32UI: 36209,
    RGBA16UI: 36214,
    RGB16UI: 36215,
    RGBA8UI: 36220,
    RGB8UI: 36221,
    RGBA32I: 36226,
    RGB32I: 36227,
    RGBA16I: 36232,
    RGB16I: 36233,
    RGBA8I: 36238,
    RGB8I: 36239,
    RED_INTEGER: 36244,
    RGB_INTEGER: 36248,
    RGBA_INTEGER: 36249,
    R8: 33321,
    RG8: 33323,
    R16F: 33325,
    R32F: 33326,
    RG16F: 33327,
    RG32F: 33328,
    R8I: 33329,
    R8UI: 33330,
    R16I: 33331,
    R16UI: 33332,
    R32I: 33333,
    R32UI: 33334,
    RG8I: 33335,
    RG8UI: 33336,
    RG16I: 33337,
    RG16UI: 33338,
    RG32I: 33339,
    RG32UI: 33340,
    R8_SNORM: 36756,
    RG8_SNORM: 36757,
    RGB8_SNORM: 36758,
    RGBA8_SNORM: 36759,
    RGB10_A2UI: 36975,
    TEXTURE_IMMUTABLE_FORMAT: 37167,
    TEXTURE_IMMUTABLE_LEVELS: 33503,
    UNSIGNED_INT_2_10_10_10_REV: 33640,
    UNSIGNED_INT_10F_11F_11F_REV: 35899,
    UNSIGNED_INT_5_9_9_9_REV: 35902,
    FLOAT_32_UNSIGNED_INT_24_8_REV: 36269,
    UNSIGNED_INT_24_8: 34042,
    HALF_FLOAT: 5131,
    RG: 33319,
    RG_INTEGER: 33320,
    INT_2_10_10_10_REV: 36255,
    CURRENT_QUERY: 34917,
    QUERY_RESULT: 34918,
    QUERY_RESULT_AVAILABLE: 34919,
    ANY_SAMPLES_PASSED: 35887,
    ANY_SAMPLES_PASSED_CONSERVATIVE: 36202,
    MAX_DRAW_BUFFERS: 34852,
    DRAW_BUFFER0: 34853,
    DRAW_BUFFER1: 34854,
    DRAW_BUFFER2: 34855,
    DRAW_BUFFER3: 34856,
    DRAW_BUFFER4: 34857,
    DRAW_BUFFER5: 34858,
    DRAW_BUFFER6: 34859,
    DRAW_BUFFER7: 34860,
    DRAW_BUFFER8: 34861,
    DRAW_BUFFER9: 34862,
    DRAW_BUFFER10: 34863,
    DRAW_BUFFER11: 34864,
    DRAW_BUFFER12: 34865,
    DRAW_BUFFER13: 34866,
    DRAW_BUFFER14: 34867,
    DRAW_BUFFER15: 34868,
    MAX_COLOR_ATTACHMENTS: 36063,
    COLOR_ATTACHMENT1: 36065,
    COLOR_ATTACHMENT2: 36066,
    COLOR_ATTACHMENT3: 36067,
    COLOR_ATTACHMENT4: 36068,
    COLOR_ATTACHMENT5: 36069,
    COLOR_ATTACHMENT6: 36070,
    COLOR_ATTACHMENT7: 36071,
    COLOR_ATTACHMENT8: 36072,
    COLOR_ATTACHMENT9: 36073,
    COLOR_ATTACHMENT10: 36074,
    COLOR_ATTACHMENT11: 36075,
    COLOR_ATTACHMENT12: 36076,
    COLOR_ATTACHMENT13: 36077,
    COLOR_ATTACHMENT14: 36078,
    COLOR_ATTACHMENT15: 36079,
    SAMPLER_3D: 35679,
    SAMPLER_2D_SHADOW: 35682,
    SAMPLER_2D_ARRAY: 36289,
    SAMPLER_2D_ARRAY_SHADOW: 36292,
    SAMPLER_CUBE_SHADOW: 36293,
    INT_SAMPLER_2D: 36298,
    INT_SAMPLER_3D: 36299,
    INT_SAMPLER_CUBE: 36300,
    INT_SAMPLER_2D_ARRAY: 36303,
    UNSIGNED_INT_SAMPLER_2D: 36306,
    UNSIGNED_INT_SAMPLER_3D: 36307,
    UNSIGNED_INT_SAMPLER_CUBE: 36308,
    UNSIGNED_INT_SAMPLER_2D_ARRAY: 36311,
    MAX_SAMPLES: 36183,
    SAMPLER_BINDING: 35097,
    PIXEL_PACK_BUFFER: 35051,
    PIXEL_UNPACK_BUFFER: 35052,
    PIXEL_PACK_BUFFER_BINDING: 35053,
    PIXEL_UNPACK_BUFFER_BINDING: 35055,
    COPY_READ_BUFFER: 36662,
    COPY_WRITE_BUFFER: 36663,
    COPY_READ_BUFFER_BINDING: 36662,
    COPY_WRITE_BUFFER_BINDING: 36663,
    FLOAT_MAT2x3: 35685,
    FLOAT_MAT2x4: 35686,
    FLOAT_MAT3x2: 35687,
    FLOAT_MAT3x4: 35688,
    FLOAT_MAT4x2: 35689,
    FLOAT_MAT4x3: 35690,
    UNSIGNED_INT_VEC2: 36294,
    UNSIGNED_INT_VEC3: 36295,
    UNSIGNED_INT_VEC4: 36296,
    UNSIGNED_NORMALIZED: 35863,
    SIGNED_NORMALIZED: 36764,
    VERTEX_ATTRIB_ARRAY_INTEGER: 35069,
    VERTEX_ATTRIB_ARRAY_DIVISOR: 35070,
    TRANSFORM_FEEDBACK_BUFFER_MODE: 35967,
    MAX_TRANSFORM_FEEDBACK_SEPARATE_COMPONENTS: 35968,
    TRANSFORM_FEEDBACK_VARYINGS: 35971,
    TRANSFORM_FEEDBACK_BUFFER_START: 35972,
    TRANSFORM_FEEDBACK_BUFFER_SIZE: 35973,
    TRANSFORM_FEEDBACK_PRIMITIVES_WRITTEN: 35976,
    MAX_TRANSFORM_FEEDBACK_INTERLEAVED_COMPONENTS: 35978,
    MAX_TRANSFORM_FEEDBACK_SEPARATE_ATTRIBS: 35979,
    INTERLEAVED_ATTRIBS: 35980,
    SEPARATE_ATTRIBS: 35981,
    TRANSFORM_FEEDBACK_BUFFER: 35982,
    TRANSFORM_FEEDBACK_BUFFER_BINDING: 35983,
    TRANSFORM_FEEDBACK: 36386,
    TRANSFORM_FEEDBACK_PAUSED: 36387,
    TRANSFORM_FEEDBACK_ACTIVE: 36388,
    TRANSFORM_FEEDBACK_BINDING: 36389,
    FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING: 33296,
    FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE: 33297,
    FRAMEBUFFER_ATTACHMENT_RED_SIZE: 33298,
    FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: 33299,
    FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: 33300,
    FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: 33301,
    FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: 33302,
    FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE: 33303,
    FRAMEBUFFER_DEFAULT: 33304,
    DEPTH24_STENCIL8: 35056,
    DRAW_FRAMEBUFFER_BINDING: 36006,
    READ_FRAMEBUFFER_BINDING: 36010,
    RENDERBUFFER_SAMPLES: 36011,
    FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER: 36052,
    FRAMEBUFFER_INCOMPLETE_MULTISAMPLE: 36182,
    UNIFORM_BUFFER: 35345,
    UNIFORM_BUFFER_BINDING: 35368,
    UNIFORM_BUFFER_START: 35369,
    UNIFORM_BUFFER_SIZE: 35370,
    MAX_VERTEX_UNIFORM_BLOCKS: 35371,
    MAX_FRAGMENT_UNIFORM_BLOCKS: 35373,
    MAX_COMBINED_UNIFORM_BLOCKS: 35374,
    MAX_UNIFORM_BUFFER_BINDINGS: 35375,
    MAX_UNIFORM_BLOCK_SIZE: 35376,
    MAX_COMBINED_VERTEX_UNIFORM_COMPONENTS: 35377,
    MAX_COMBINED_FRAGMENT_UNIFORM_COMPONENTS: 35379,
    UNIFORM_BUFFER_OFFSET_ALIGNMENT: 35380,
    ACTIVE_UNIFORM_BLOCKS: 35382,
    UNIFORM_TYPE: 35383,
    UNIFORM_SIZE: 35384,
    UNIFORM_BLOCK_INDEX: 35386,
    UNIFORM_OFFSET: 35387,
    UNIFORM_ARRAY_STRIDE: 35388,
    UNIFORM_MATRIX_STRIDE: 35389,
    UNIFORM_IS_ROW_MAJOR: 35390,
    UNIFORM_BLOCK_BINDING: 35391,
    UNIFORM_BLOCK_DATA_SIZE: 35392,
    UNIFORM_BLOCK_ACTIVE_UNIFORMS: 35394,
    UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES: 35395,
    UNIFORM_BLOCK_REFERENCED_BY_VERTEX_SHADER: 35396,
    UNIFORM_BLOCK_REFERENCED_BY_FRAGMENT_SHADER: 35398,
    OBJECT_TYPE: 37138,
    SYNC_CONDITION: 37139,
    SYNC_STATUS: 37140,
    SYNC_FLAGS: 37141,
    SYNC_FENCE: 37142,
    SYNC_GPU_COMMANDS_COMPLETE: 37143,
    UNSIGNALED: 37144,
    SIGNALED: 37145,
    ALREADY_SIGNALED: 37146,
    TIMEOUT_EXPIRED: 37147,
    CONDITION_SATISFIED: 37148,
    WAIT_FAILED: 37149,
    SYNC_FLUSH_COMMANDS_BIT: 1,
    COLOR: 6144,
    DEPTH: 6145,
    STENCIL: 6146,
    MIN: 32775,
    MAX: 32776,
    DEPTH_COMPONENT24: 33190,
    STREAM_READ: 35041,
    STREAM_COPY: 35042,
    STATIC_READ: 35045,
    STATIC_COPY: 35046,
    DYNAMIC_READ: 35049,
    DYNAMIC_COPY: 35050,
    DEPTH_COMPONENT32F: 36012,
    DEPTH32F_STENCIL8: 36013,
    INVALID_INDEX: 4294967295,
    TIMEOUT_IGNORED: -1,
    MAX_CLIENT_WAIT_TIMEOUT_WEBGL: 37447,
    VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE: 35070,
    UNMASKED_VENDOR_WEBGL: 37445,
    UNMASKED_RENDERER_WEBGL: 37446,
    MAX_TEXTURE_MAX_ANISOTROPY_EXT: 34047,
    TEXTURE_MAX_ANISOTROPY_EXT: 34046,
    COMPRESSED_RGB_S3TC_DXT1_EXT: 33776,
    COMPRESSED_RGBA_S3TC_DXT1_EXT: 33777,
    COMPRESSED_RGBA_S3TC_DXT3_EXT: 33778,
    COMPRESSED_RGBA_S3TC_DXT5_EXT: 33779,
    COMPRESSED_R11_EAC: 37488,
    COMPRESSED_SIGNED_R11_EAC: 37489,
    COMPRESSED_RG11_EAC: 37490,
    COMPRESSED_SIGNED_RG11_EAC: 37491,
    COMPRESSED_RGB8_ETC2: 37492,
    COMPRESSED_RGBA8_ETC2_EAC: 37493,
    COMPRESSED_SRGB8_ETC2: 37494,
    COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: 37495,
    COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37496,
    COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: 37497,
    COMPRESSED_RGB_PVRTC_4BPPV1_IMG: 35840,
    COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: 35842,
    COMPRESSED_RGB_PVRTC_2BPPV1_IMG: 35841,
    COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: 35843,
    COMPRESSED_RGB_ETC1_WEBGL: 36196,
    COMPRESSED_RGB_ATC_WEBGL: 35986,
    COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL: 35986,
    COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL: 34798,
    UNSIGNED_INT_24_8_WEBGL: 34042,
    HALF_FLOAT_OES: 36193,
    RGBA32F_EXT: 34836,
    RGB32F_EXT: 34837,
    FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: 33297,
    UNSIGNED_NORMALIZED_EXT: 35863,
    MIN_EXT: 32775,
    MAX_EXT: 32776,
    SRGB_EXT: 35904,
    SRGB_ALPHA_EXT: 35906,
    SRGB8_ALPHA8_EXT: 35907,
    FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT: 33296,
    FRAGMENT_SHADER_DERIVATIVE_HINT_OES: 35723,
    COLOR_ATTACHMENT0_WEBGL: 36064,
    COLOR_ATTACHMENT1_WEBGL: 36065,
    COLOR_ATTACHMENT2_WEBGL: 36066,
    COLOR_ATTACHMENT3_WEBGL: 36067,
    COLOR_ATTACHMENT4_WEBGL: 36068,
    COLOR_ATTACHMENT5_WEBGL: 36069,
    COLOR_ATTACHMENT6_WEBGL: 36070,
    COLOR_ATTACHMENT7_WEBGL: 36071,
    COLOR_ATTACHMENT8_WEBGL: 36072,
    COLOR_ATTACHMENT9_WEBGL: 36073,
    COLOR_ATTACHMENT10_WEBGL: 36074,
    COLOR_ATTACHMENT11_WEBGL: 36075,
    COLOR_ATTACHMENT12_WEBGL: 36076,
    COLOR_ATTACHMENT13_WEBGL: 36077,
    COLOR_ATTACHMENT14_WEBGL: 36078,
    COLOR_ATTACHMENT15_WEBGL: 36079,
    DRAW_BUFFER0_WEBGL: 34853,
    DRAW_BUFFER1_WEBGL: 34854,
    DRAW_BUFFER2_WEBGL: 34855,
    DRAW_BUFFER3_WEBGL: 34856,
    DRAW_BUFFER4_WEBGL: 34857,
    DRAW_BUFFER5_WEBGL: 34858,
    DRAW_BUFFER6_WEBGL: 34859,
    DRAW_BUFFER7_WEBGL: 34860,
    DRAW_BUFFER8_WEBGL: 34861,
    DRAW_BUFFER9_WEBGL: 34862,
    DRAW_BUFFER10_WEBGL: 34863,
    DRAW_BUFFER11_WEBGL: 34864,
    DRAW_BUFFER12_WEBGL: 34865,
    DRAW_BUFFER13_WEBGL: 34866,
    DRAW_BUFFER14_WEBGL: 34867,
    DRAW_BUFFER15_WEBGL: 34868,
    MAX_COLOR_ATTACHMENTS_WEBGL: 36063,
    MAX_DRAW_BUFFERS_WEBGL: 34852,
    VERTEX_ARRAY_BINDING_OES: 34229,
    QUERY_COUNTER_BITS_EXT: 34916,
    CURRENT_QUERY_EXT: 34917,
    QUERY_RESULT_EXT: 34918,
    QUERY_RESULT_AVAILABLE_EXT: 34919,
    TIME_ELAPSED_EXT: 35007,
    TIMESTAMP_EXT: 36392,
    GPU_DISJOINT_EXT: 36795
  };

  // src/lib/parsers/constants.ts
  function getConstructorForDataFormat(dataType) {
    switch (dataType) {
      case DATA_TYPE.UInt8:
        return Uint8Array;
      case DATA_TYPE.UInt16:
        return Uint16Array;
      case DATA_TYPE.UInt32:
        return Uint32Array;
      case DATA_TYPE.Float32:
        return Float32Array;
      case DATA_TYPE.UInt64:
        return Float64Array;
      default:
        throw new Error(`parse i3s tile content: unknown type of data: ${dataType}`);
    }
  }
  var GL_TYPE_MAP = {
    UInt8: esm_default.UNSIGNED_BYTE,
    UInt16: esm_default.UNSIGNED_SHORT,
    Float32: esm_default.FLOAT,
    UInt32: esm_default.UNSIGNED_INT,
    UInt64: esm_default.DOUBLE
  };
  function sizeOf(dataType) {
    switch (dataType) {
      case DATA_TYPE.UInt8:
        return 1;
      case DATA_TYPE.UInt16:
      case DATA_TYPE.Int16:
        return 2;
      case DATA_TYPE.UInt32:
      case DATA_TYPE.Int32:
      case DATA_TYPE.Float32:
        return 4;
      case DATA_TYPE.UInt64:
      case DATA_TYPE.Int64:
      case DATA_TYPE.Float64:
        return 8;
      default:
        throw new Error(`parse i3s tile content: unknown size of data: ${dataType}`);
    }
  }
  var STRING_ATTRIBUTE_TYPE = "String";
  var OBJECT_ID_ATTRIBUTE_TYPE = "Oid32";
  var FLOAT_64_TYPE = "Float64";
  var INT_16_ATTRIBUTE_TYPE = "Int16";
  var COORDINATE_SYSTEM;
  (function(COORDINATE_SYSTEM2) {
    COORDINATE_SYSTEM2[COORDINATE_SYSTEM2["DEFAULT"] = -1] = "DEFAULT";
    COORDINATE_SYSTEM2[COORDINATE_SYSTEM2["LNGLAT"] = 1] = "LNGLAT";
    COORDINATE_SYSTEM2[COORDINATE_SYSTEM2["METER_OFFSETS"] = 2] = "METER_OFFSETS";
    COORDINATE_SYSTEM2[COORDINATE_SYSTEM2["LNGLAT_OFFSETS"] = 3] = "LNGLAT_OFFSETS";
    COORDINATE_SYSTEM2[COORDINATE_SYSTEM2["CARTESIAN"] = 0] = "CARTESIAN";
  })(COORDINATE_SYSTEM || (COORDINATE_SYSTEM = {}));

  // src/lib/parsers/parse-i3s-attribute.ts
  function parseI3STileAttribute(arrayBuffer, options) {
    const { attributeName, attributeType } = options;
    if (!attributeName) {
      return {};
    }
    return {
      [attributeName]: attributeType ? parseAttribute(attributeType, arrayBuffer) : null
    };
  }
  function parseAttribute(attributeType, arrayBuffer) {
    switch (attributeType) {
      case STRING_ATTRIBUTE_TYPE:
        return parseStringsAttribute(arrayBuffer);
      case OBJECT_ID_ATTRIBUTE_TYPE:
        return parseShortNumberAttribute(arrayBuffer);
      case FLOAT_64_TYPE:
        return parseFloatAttribute(arrayBuffer);
      case INT_16_ATTRIBUTE_TYPE:
        return parseInt16ShortNumberAttribute(arrayBuffer);
      default:
        return parseShortNumberAttribute(arrayBuffer);
    }
  }
  function parseShortNumberAttribute(arrayBuffer) {
    const countOffset = 4;
    return new Uint32Array(arrayBuffer, countOffset);
  }
  function parseInt16ShortNumberAttribute(arrayBuffer) {
    const countOffset = 4;
    return new Int16Array(arrayBuffer, countOffset);
  }
  function parseFloatAttribute(arrayBuffer) {
    const countOffset = 8;
    return new Float64Array(arrayBuffer, countOffset);
  }
  function parseStringsAttribute(arrayBuffer) {
    const stringsCountOffset = 0;
    const dataOffset = 8;
    const bytesPerStringSize = 4;
    const stringsArray = [];
    try {
      const stringsCount = new DataView(arrayBuffer, stringsCountOffset, bytesPerStringSize).getUint32(stringsCountOffset, true);
      const stringSizes = new Uint32Array(arrayBuffer, dataOffset, stringsCount);
      let stringOffset = dataOffset + stringsCount * bytesPerStringSize;
      for (const stringByteSize of stringSizes) {
        const textDecoder = new TextDecoder("utf-8");
        const stringAttribute = new Uint8Array(arrayBuffer, stringOffset, stringByteSize);
        stringsArray.push(textDecoder.decode(stringAttribute));
        stringOffset += stringByteSize;
      }
    } catch (error) {
      console.error("Parse string attribute error: ", error.message);
    }
    return stringsArray;
  }

  // src/i3s-attribute-loader.ts
  var VERSION8 = true ? "4.0.0-alpha.7" : "latest";
  var I3SAttributeLoader = {
    name: "I3S Attribute",
    id: "i3s-attribute",
    module: "i3s",
    version: VERSION8,
    mimeTypes: ["application/binary"],
    parse: async (arrayBuffer, options) => parseI3STileAttribute(arrayBuffer, options),
    extensions: ["bin"],
    options: {},
    binary: true
  };
  function getAttributeValueType(attribute) {
    if (attribute.hasOwnProperty("objectIds")) {
      return "Oid32";
    } else if (attribute.hasOwnProperty("attributeValues")) {
      return attribute.attributeValues.valueType;
    }
    return "";
  }

  // src/lib/utils/customizeColors.ts
  async function customizeColors(colors, featureIds, tileOptions, tilesetOptions, options) {
    if (!options?.i3s?.colorsByAttribute) {
      return colors;
    }
    const colorizeAttributeField = tilesetOptions.fields.find(({ name }) => name === options?.i3s?.colorsByAttribute?.attributeName);
    if (!colorizeAttributeField || !["esriFieldTypeDouble", "esriFieldTypeInteger", "esriFieldTypeSmallInteger"].includes(colorizeAttributeField.type)) {
      return colors;
    }
    const colorizeAttributeData = await loadFeatureAttributeData(colorizeAttributeField.name, tileOptions, tilesetOptions, options);
    if (!colorizeAttributeData) {
      return colors;
    }
    const objectIdField = tilesetOptions.fields.find(({ type }) => type === "esriFieldTypeOID");
    if (!objectIdField) {
      return colors;
    }
    const objectIdAttributeData = await loadFeatureAttributeData(objectIdField.name, tileOptions, tilesetOptions, options);
    if (!objectIdAttributeData) {
      return colors;
    }
    const attributeValuesMap = {};
    for (let i2 = 0; i2 < objectIdAttributeData[objectIdField.name].length; i2++) {
      attributeValuesMap[objectIdAttributeData[objectIdField.name][i2]] = calculateColorForAttribute(colorizeAttributeData[colorizeAttributeField.name][i2], options);
    }
    for (let i2 = 0; i2 < featureIds.value.length; i2++) {
      const color = attributeValuesMap[featureIds.value[i2]];
      if (!color) {
        continue;
      }
      colors.value.set(color, i2 * 4);
    }
    return colors;
  }
  function calculateColorForAttribute(attributeValue, options) {
    if (!options?.i3s?.colorsByAttribute) {
      return [255, 255, 255, 255];
    }
    const { minValue, maxValue, minColor, maxColor } = options.i3s.colorsByAttribute;
    const rate = (attributeValue - minValue) / (maxValue - minValue);
    const color = [255, 255, 255, 255];
    for (let i2 = 0; i2 < minColor.length; i2++) {
      color[i2] = Math.round((maxColor[i2] - minColor[i2]) * rate + minColor[i2]);
    }
    return color;
  }
  async function loadFeatureAttributeData(attributeName, { attributeUrls }, { attributeStorageInfo }, options) {
    const attributeIndex = attributeStorageInfo.findIndex(({ name }) => attributeName === name);
    if (attributeIndex === -1) {
      return null;
    }
    const objectIdAttributeUrl = getUrlWithToken(attributeUrls[attributeIndex], options?.i3s?.token);
    const attributeType = getAttributeValueType(attributeStorageInfo[attributeIndex]);
    const objectIdAttributeData = await load(objectIdAttributeUrl, I3SAttributeLoader, {
      attributeName,
      attributeType
    });
    return objectIdAttributeData;
  }

  // src/lib/parsers/parse-i3s-tile-content.ts
  var scratchVector5 = new Vector3([0, 0, 0]);
  function getLoaderForTextureFormat(textureFormat) {
    switch (textureFormat) {
      case "ktx-etc2":
      case "dds":
        return CompressedTextureLoader;
      case "ktx2":
        return BasisLoader;
      case "jpg":
      case "png":
      default:
        return ImageLoader;
    }
  }
  var I3S_ATTRIBUTE_TYPE = "i3s-attribute-type";
  async function parseI3STileContent(arrayBuffer, tileOptions, tilesetOptions, options, context) {
    const content = {
      attributes: {},
      indices: null,
      featureIds: [],
      vertexCount: 0,
      modelMatrix: new Matrix4(),
      coordinateSystem: 0,
      byteLength: 0,
      texture: null
    };
    if (tileOptions.textureUrl) {
      const url = getUrlWithToken(tileOptions.textureUrl, options?.i3s?.token);
      const loader = getLoaderForTextureFormat(tileOptions.textureFormat);
      const response = await fetch(url, options?.fetch);
      const arrayBuffer2 = await response.arrayBuffer();
      if (options?.i3s.decodeTextures) {
        if (loader === ImageLoader) {
          const options2 = { ...tileOptions.textureLoaderOptions, image: { type: "data" } };
          try {
            content.texture = await context.parse(arrayBuffer2, options2);
          } catch (e2) {
            content.texture = await parse(arrayBuffer2, loader, options2);
          }
        } else if (loader === CompressedTextureLoader || loader === BasisLoader) {
          let texture = await load(arrayBuffer2, loader, tileOptions.textureLoaderOptions);
          if (loader === BasisLoader) {
            texture = texture[0];
          }
          content.texture = {
            compressed: true,
            mipmaps: false,
            width: texture[0].width,
            height: texture[0].height,
            data: texture
          };
        }
      } else {
        content.texture = arrayBuffer2;
      }
    }
    content.material = makePbrMaterial(tileOptions.materialDefinition, content.texture);
    if (content.material) {
      content.texture = null;
    }
    return await parseI3SNodeGeometry(arrayBuffer, content, tileOptions, tilesetOptions, options);
  }
  async function parseI3SNodeGeometry(arrayBuffer, content, tileOptions, tilesetOptions, options) {
    const contentByteLength = arrayBuffer.byteLength;
    let attributes;
    let vertexCount;
    let byteOffset = 0;
    let featureCount = 0;
    let indices;
    if (tileOptions.isDracoGeometry) {
      const decompressedGeometry = await parse(arrayBuffer, DracoLoader2, {
        draco: {
          attributeNameEntry: I3S_ATTRIBUTE_TYPE
        }
      });
      vertexCount = decompressedGeometry.header.vertexCount;
      indices = decompressedGeometry.indices?.value;
      const {
        POSITION,
        NORMAL,
        COLOR_0,
        TEXCOORD_0,
        ["feature-index"]: featureIndex,
        ["uv-region"]: uvRegion
      } = decompressedGeometry.attributes;
      attributes = {
        position: POSITION,
        normal: NORMAL,
        color: COLOR_0,
        uv0: TEXCOORD_0,
        uvRegion,
        id: featureIndex
      };
      updateAttributesMetadata(attributes, decompressedGeometry);
      const featureIds = getFeatureIdsFromFeatureIndexMetadata(featureIndex);
      if (featureIds) {
        flattenFeatureIdsByFeatureIndices(attributes, featureIds);
      }
    } else {
      const {
        vertexAttributes,
        ordering: attributesOrder,
        featureAttributes,
        featureAttributeOrder
      } = tilesetOptions.store.defaultGeometrySchema;
      const headers = parseHeaders(arrayBuffer, tilesetOptions);
      byteOffset = headers.byteOffset;
      vertexCount = headers.vertexCount;
      featureCount = headers.featureCount;
      const { attributes: normalizedVertexAttributes, byteOffset: offset } = normalizeAttributes(arrayBuffer, byteOffset, vertexAttributes, vertexCount, attributesOrder);
      const { attributes: normalizedFeatureAttributes } = normalizeAttributes(arrayBuffer, offset, featureAttributes, featureCount, featureAttributeOrder);
      flattenFeatureIdsByFaceRanges(normalizedFeatureAttributes);
      attributes = concatAttributes(normalizedVertexAttributes, normalizedFeatureAttributes);
    }
    if (!options?.i3s?.coordinateSystem || options.i3s.coordinateSystem === COORDINATE_SYSTEM.METER_OFFSETS) {
      const enuMatrix = parsePositions(attributes.position, tileOptions);
      content.modelMatrix = enuMatrix.invert();
      content.coordinateSystem = COORDINATE_SYSTEM.METER_OFFSETS;
    } else {
      content.modelMatrix = getModelMatrix(attributes.position);
      content.coordinateSystem = COORDINATE_SYSTEM.LNGLAT_OFFSETS;
    }
    attributes.color = await customizeColors(attributes.color, attributes.id, tileOptions, tilesetOptions, options);
    content.attributes = {
      positions: attributes.position,
      normals: attributes.normal,
      colors: normalizeAttribute(attributes.color),
      texCoords: attributes.uv0,
      uvRegions: normalizeAttribute(attributes.uvRegion || attributes.region)
    };
    content.indices = indices || null;
    if (attributes.id && attributes.id.value) {
      content.featureIds = attributes.id.value;
    }
    for (const attributeIndex in content.attributes) {
      if (!content.attributes[attributeIndex]) {
        delete content.attributes[attributeIndex];
      }
    }
    content.vertexCount = vertexCount;
    content.byteLength = contentByteLength;
    return content;
  }
  function updateAttributesMetadata(attributes, decompressedGeometry) {
    for (const key in decompressedGeometry.loaderData.attributes) {
      const dracoAttribute = decompressedGeometry.loaderData.attributes[key];
      switch (dracoAttribute.name) {
        case "POSITION":
          attributes.position.metadata = dracoAttribute.metadata;
          break;
        case "feature-index":
          attributes.id.metadata = dracoAttribute.metadata;
          break;
        default:
          break;
      }
    }
  }
  function concatAttributes(normalizedVertexAttributes, normalizedFeatureAttributes) {
    return { ...normalizedVertexAttributes, ...normalizedFeatureAttributes };
  }
  function normalizeAttribute(attribute) {
    if (!attribute) {
      return attribute;
    }
    attribute.normalized = true;
    return attribute;
  }
  function parseHeaders(arrayBuffer, options) {
    let byteOffset = 0;
    let vertexCount = 0;
    let featureCount = 0;
    for (const { property, type } of options.store.defaultGeometrySchema.header) {
      const TypedArrayTypeHeader = getConstructorForDataFormat(type);
      switch (property) {
        case HeaderAttributeProperty.vertexCount:
          vertexCount = new TypedArrayTypeHeader(arrayBuffer, 0, 4)[0];
          byteOffset += sizeOf(type);
          break;
        case HeaderAttributeProperty.featureCount:
          featureCount = new TypedArrayTypeHeader(arrayBuffer, 4, 4)[0];
          byteOffset += sizeOf(type);
          break;
        default:
          break;
      }
    }
    return {
      vertexCount,
      featureCount,
      byteOffset
    };
  }
  function normalizeAttributes(arrayBuffer, byteOffset, vertexAttributes, attributeCount, attributesOrder) {
    const attributes = {};
    for (const attribute of attributesOrder) {
      if (vertexAttributes[attribute]) {
        const { valueType, valuesPerElement } = vertexAttributes[attribute];
        if (byteOffset + attributeCount * valuesPerElement * sizeOf(valueType) <= arrayBuffer.byteLength) {
          const buffer = arrayBuffer.slice(byteOffset);
          let value;
          if (valueType === "UInt64") {
            value = parseUint64Values(buffer, attributeCount * valuesPerElement, sizeOf(valueType));
          } else {
            const TypedArrayType = getConstructorForDataFormat(valueType);
            value = new TypedArrayType(buffer, 0, attributeCount * valuesPerElement);
          }
          attributes[attribute] = {
            value,
            type: GL_TYPE_MAP[valueType],
            size: valuesPerElement
          };
          switch (attribute) {
            case "color":
              attributes.color.normalized = true;
              break;
            case "position":
            case "region":
            case "normal":
            default:
          }
          byteOffset = byteOffset + attributeCount * valuesPerElement * sizeOf(valueType);
        } else if (attribute !== "uv0") {
          break;
        }
      }
    }
    return { attributes, byteOffset };
  }
  function parseUint64Values(buffer, elementsCount, attributeSize) {
    const values = [];
    const dataView = new DataView(buffer);
    let offset = 0;
    for (let index = 0; index < elementsCount; index++) {
      const left = dataView.getUint32(offset, true);
      const right = dataView.getUint32(offset + 4, true);
      const value = left + 2 ** 32 * right;
      values.push(value);
      offset += attributeSize;
    }
    return new Uint32Array(values);
  }
  function parsePositions(attribute, options) {
    const mbs = options.mbs;
    const value = attribute.value;
    const metadata = attribute.metadata;
    const enuMatrix = new Matrix4();
    const cartographicOrigin = new Vector3(mbs[0], mbs[1], mbs[2]);
    const cartesianOrigin = new Vector3();
    Ellipsoid.WGS84.cartographicToCartesian(cartographicOrigin, cartesianOrigin);
    Ellipsoid.WGS84.eastNorthUpToFixedFrame(cartesianOrigin, enuMatrix);
    attribute.value = offsetsToCartesians(value, metadata, cartographicOrigin);
    return enuMatrix;
  }
  function offsetsToCartesians(vertices, metadata = {}, cartographicOrigin) {
    const positions = new Float64Array(vertices.length);
    const scaleX = metadata["i3s-scale_x"] && metadata["i3s-scale_x"].double || 1;
    const scaleY = metadata["i3s-scale_y"] && metadata["i3s-scale_y"].double || 1;
    for (let i2 = 0; i2 < positions.length; i2 += 3) {
      positions[i2] = vertices[i2] * scaleX + cartographicOrigin.x;
      positions[i2 + 1] = vertices[i2 + 1] * scaleY + cartographicOrigin.y;
      positions[i2 + 2] = vertices[i2 + 2] + cartographicOrigin.z;
    }
    for (let i2 = 0; i2 < positions.length; i2 += 3) {
      Ellipsoid.WGS84.cartographicToCartesian(positions.subarray(i2, i2 + 3), scratchVector5);
      positions[i2] = scratchVector5.x;
      positions[i2 + 1] = scratchVector5.y;
      positions[i2 + 2] = scratchVector5.z;
    }
    return positions;
  }
  function getModelMatrix(positions) {
    const metadata = positions.metadata;
    const scaleX = metadata?.["i3s-scale_x"]?.double || 1;
    const scaleY = metadata?.["i3s-scale_y"]?.double || 1;
    const modelMatrix = new Matrix4();
    modelMatrix[0] = scaleX;
    modelMatrix[5] = scaleY;
    return modelMatrix;
  }
  function makePbrMaterial(materialDefinition, texture) {
    let pbrMaterial;
    if (materialDefinition) {
      pbrMaterial = {
        ...materialDefinition,
        pbrMetallicRoughness: materialDefinition.pbrMetallicRoughness ? { ...materialDefinition.pbrMetallicRoughness } : { baseColorFactor: [255, 255, 255, 255] }
      };
    } else {
      pbrMaterial = {
        pbrMetallicRoughness: {}
      };
      if (texture) {
        pbrMaterial.pbrMetallicRoughness.baseColorTexture = { texCoord: 0 };
      } else {
        pbrMaterial.pbrMetallicRoughness.baseColorFactor = [255, 255, 255, 255];
      }
    }
    pbrMaterial.alphaCutoff = pbrMaterial.alphaCutoff || 0.25;
    if (pbrMaterial.alphaMode) {
      pbrMaterial.alphaMode = pbrMaterial.alphaMode.toUpperCase();
    }
    if (pbrMaterial.emissiveFactor) {
      pbrMaterial.emissiveFactor = convertColorFormat(pbrMaterial.emissiveFactor);
    }
    if (pbrMaterial.pbrMetallicRoughness && pbrMaterial.pbrMetallicRoughness.baseColorFactor) {
      pbrMaterial.pbrMetallicRoughness.baseColorFactor = convertColorFormat(pbrMaterial.pbrMetallicRoughness.baseColorFactor);
    }
    if (texture) {
      setMaterialTexture(pbrMaterial, texture);
    }
    return pbrMaterial;
  }
  function convertColorFormat(colorFactor) {
    const normalizedColor = [...colorFactor];
    for (let index = 0; index < colorFactor.length; index++) {
      normalizedColor[index] = colorFactor[index] / 255;
    }
    return normalizedColor;
  }
  function setMaterialTexture(material, image) {
    const texture = { source: { image } };
    if (material.pbrMetallicRoughness && material.pbrMetallicRoughness.baseColorTexture) {
      material.pbrMetallicRoughness.baseColorTexture = {
        ...material.pbrMetallicRoughness.baseColorTexture,
        texture
      };
    } else if (material.emissiveTexture) {
      material.emissiveTexture = { ...material.emissiveTexture, texture };
    } else if (material.pbrMetallicRoughness && material.pbrMetallicRoughness.metallicRoughnessTexture) {
      material.pbrMetallicRoughness.metallicRoughnessTexture = {
        ...material.pbrMetallicRoughness.metallicRoughnessTexture,
        texture
      };
    } else if (material.normalTexture) {
      material.normalTexture = { ...material.normalTexture, texture };
    } else if (material.occlusionTexture) {
      material.occlusionTexture = { ...material.occlusionTexture, texture };
    }
  }
  function flattenFeatureIdsByFaceRanges(normalizedFeatureAttributes) {
    const { id, faceRange } = normalizedFeatureAttributes;
    if (!id || !faceRange) {
      return;
    }
    const featureIds = id.value;
    const range = faceRange.value;
    const featureIdsLength = range[range.length - 1] + 1;
    const orderedFeatureIndices = new Uint32Array(featureIdsLength * 3);
    let featureIndex = 0;
    let startIndex = 0;
    for (let index = 1; index < range.length; index += 2) {
      const fillId = Number(featureIds[featureIndex]);
      const endValue = range[index];
      const prevValue = range[index - 1];
      const trianglesCount = endValue - prevValue + 1;
      const endIndex = startIndex + trianglesCount * 3;
      orderedFeatureIndices.fill(fillId, startIndex, endIndex);
      featureIndex++;
      startIndex = endIndex;
    }
    normalizedFeatureAttributes.id.value = orderedFeatureIndices;
  }
  function flattenFeatureIdsByFeatureIndices(attributes, featureIds) {
    const featureIndices = attributes.id.value;
    const result = new Float32Array(featureIndices.length);
    for (let index = 0; index < featureIndices.length; index++) {
      result[index] = featureIds[featureIndices[index]];
    }
    attributes.id.value = result;
  }
  function getFeatureIdsFromFeatureIndexMetadata(featureIndex) {
    return featureIndex?.metadata?.["i3s-feature-ids"]?.intArray;
  }

  // src/i3s-content-loader.ts
  var VERSION9 = true ? "4.0.0-alpha.7" : "beta";
  var I3SContentLoader = {
    name: "I3S Content (Indexed Scene Layers)",
    id: "i3s-content",
    module: "i3s",
    worker: true,
    version: VERSION9,
    mimeTypes: ["application/octet-stream"],
    parse: parse3,
    extensions: ["bin"],
    options: {
      "i3s-content": {}
    }
  };
  async function parse3(data, options, context) {
    const { tile, _tileOptions, tileset, _tilesetOptions } = options?.i3s || {};
    const tileOptions = _tileOptions || tile;
    const tilesetOptions = _tilesetOptions || tileset;
    if (!tileOptions || !tilesetOptions) {
      return null;
    }
    return await parseI3STileContent(data, tileOptions, tilesetOptions, options, context);
  }

  // src/workers/i3s-content-worker.ts
  createLoaderWorker(I3SContentLoader);
})();
