// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';

import {isBrowser, load, setLoaderOptions} from '@sensat/loaders-gl-core';
import {CrunchWorkerLoader} from '@sensat/loaders-gl-textures';

const CRUNCH_URL = '@sensat/loaders-gl-textures/test/data/shannon-dxt1.crn';

setLoaderOptions({
  _workerType: 'test',
  CDN: null
});

test('CrunchWorkerLoader#imports', (t) => {
  t.ok(CrunchWorkerLoader, 'CrunchWorkerLoader defined');
  t.end();
});

test.skip('CrunchWorkerLoader#load', async (t) => {
  // Decoder lib `src/libs/crunch.js` works only in browser
  if (isBrowser) {
    const texture = await load(CRUNCH_URL, CrunchWorkerLoader, {
      core: {worker: false}
    });
    t.ok(texture, 'Crunch container loaded OK');
  }
  t.end();
});
