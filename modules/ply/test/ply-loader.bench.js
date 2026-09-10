import {fetchFile, load} from '@sensat/loaders-gl-core';
import {PLYLoader, PLYWorkerLoader} from '@sensat/loaders-gl-ply';

// TODO - use parseInBatches or remove
// import {createReadStream, makeStreamIterator} from '@sensat/loaders-gl-core';
// import {_PLYStreamLoader} from '@sensat/loaders-gl-ply';

export default function PLYLoaderBench(bench) {
  return (
    bench
      // TODO - add parse from arrayBuffer (no load)

      .group('PLYLoader (ASCII)')
      .addAsync('Atomic parsing', async () => {
        await load('@sensat/loaders-gl-ply/test/data/cube_att.ply', PLYLoader);
      })
      .addAsync('Worker parsing', async () => {
        // Once binary is transferred to worker it cannot be read from the main thread
        // Duplicate it here to avoid breaking other tests
        const response = await fetchFile('@sensat/loaders-gl-ply/test/data/bun_zipper.ply');
        const arrayBuffer = await response.arrayBuffer();
        await load(arrayBuffer, PLYWorkerLoader);
      })
      // .addAsync('Stream parsing', async () => {
      //   const stream = await createReadStream('@sensat/loaders-gl-ply/test/data/cube_att.ply');
      //   await _PLYStreamLoader.parseStream(getStreamIterator(stream));
      // })

      .group('PLYLoader (Binary)')
      .addAsync('Atomic parsing', async () => {
        await load('@sensat/loaders-gl-ply/test/data/cube_att.ply', PLYLoader);
      })
      .addAsync('Worker parsing', async () => {
        const response = await fetchFile('@sensat/loaders-gl-ply/test/data/bun_zipper.ply');
        const arrayBuffer = await response.arrayBuffer();
        await load(arrayBuffer, PLYWorkerLoader);
      })
  );
}
