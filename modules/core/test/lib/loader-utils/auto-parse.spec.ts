// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {load} from '@sensat/loaders-gl-core';
import {OBJLoader} from '@sensat/loaders-gl-obj';
import {KMLLoader} from '@sensat/loaders-gl-kml';

const KML_URL = '@sensat/loaders-gl-kml/test/data/kml/KML_Samples.kml';

const LOADERS = [OBJLoader, KMLLoader];

test('parseSync#autoParse', async (t) => {
  const data = await load(KML_URL, LOADERS);
  t.ok(data);
  t.end();
});
