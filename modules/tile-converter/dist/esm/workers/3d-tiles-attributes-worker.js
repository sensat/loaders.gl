import { createWorker } from '@loaders.gl/worker-utils';
import B3dmConverter from '../3d-tiles-converter/helpers/b3dm-converter';
const b3dmConverter = new B3dmConverter();
createWorker(async function (data) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return b3dmConverter.convert(data, options.featureAttributes);
});
//# sourceMappingURL=3d-tiles-attributes-worker.js.map