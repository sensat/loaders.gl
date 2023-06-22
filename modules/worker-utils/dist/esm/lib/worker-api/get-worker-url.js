import { assert } from '../env-utils/assert';
import { isBrowser } from '../env-utils/globals';
import { VERSION as __VERSION__ } from '../env-utils/version';
const NPM_TAG = 'beta';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : NPM_TAG;
export function getWorkerName(worker) {
  const warning = worker.version !== VERSION ? " (worker-utils@".concat(VERSION, ")") : '';
  return "".concat(worker.name, "@").concat(worker.version).concat(warning);
}
export function getWorkerURL(worker) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const workerOptions = options[worker.id] || {};
  const workerFile = isBrowser ? "".concat(worker.id, "-worker.js") : "".concat(worker.id, "-worker-node.js");
  let url = workerOptions.workerUrl;
  if (!url && worker.id === 'compression') {
    url = options.workerUrl;
  }
  if (options._workerType === 'test') {
    url = "modules/".concat(worker.module, "/dist/").concat(workerFile);
  }
  if (!url) {
    let version = worker.version;
    if (version === 'latest') {
      version = NPM_TAG;
    }
    const versionTag = version ? "@".concat(version) : '';
    url = "https://unpkg.com/@loaders.gl/".concat(worker.module).concat(versionTag, "/dist/").concat(workerFile);
  }
  assert(url);
  return url;
}
//# sourceMappingURL=get-worker-url.js.map