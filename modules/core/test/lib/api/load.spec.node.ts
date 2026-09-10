// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {isBrowser, load, resolvePath} from '@sensat/loaders-gl-core';
import {JSONLoader} from '@sensat/loaders-gl-json';

const JSON_URL = '@sensat/loaders-gl-core/test/data/files/basic.json';

test('load#Node stream - NODE ONLY', async (t) => {
  if (isBrowser) {
    t.comment('Skipping load(Node stream) tests in Node.js');
    t.end();
    return;
  }

  const fs = await import('fs');
  const stream = fs.createReadStream(resolvePath(JSON_URL));
  // @ts-ignore TODO remove this ts-ignore
  const data = await load(stream, JSONLoader);
  t.equals(typeof data, 'object', 'load(Node stream) returned data');

  t.end();
});
