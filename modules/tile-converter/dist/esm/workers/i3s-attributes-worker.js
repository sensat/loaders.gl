import { createWorker } from '@loaders.gl/worker-utils';
import { convertAttributes } from '../i3s-converter/helpers/geometry-converter';
createWorker(async function (data) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return await convertAttributes(data, options.materialAndTextureList, options.useCartesianPositions);
});
//# sourceMappingURL=i3s-attributes-worker.js.map