import { WorkerBody } from '@loaders.gl/worker-utils';
import { KTX2BasisWriter } from '../ktx2-basis-writer';
(() => {
  if (!WorkerBody.inWorkerThread()) {
    return;
  }
  WorkerBody.onmessage = async (type, payload) => {
    switch (type) {
      case 'process':
        try {
          var _KTX2BasisWriter$enco;
          const {
            input,
            options
          } = payload;
          const result = await ((_KTX2BasisWriter$enco = KTX2BasisWriter.encode) === null || _KTX2BasisWriter$enco === void 0 ? void 0 : _KTX2BasisWriter$enco.call(KTX2BasisWriter, input, options));
          WorkerBody.postMessage('done', {
            result
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : '';
          WorkerBody.postMessage('error', {
            error: message
          });
        }
        break;
      default:
    }
  };
})();
//# sourceMappingURL=ktx2-basis-writer-worker.js.map