// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
// import {validateLoader} from 'test/common/conformance';

import {XMLLoader} from '@sensat/loaders-gl-xml';
import {load} from '@sensat/loaders-gl-core';

const FORECASTS_URL = '@sensat/loaders-gl-xml/test/data/forecasts.xml';

test('XMLLoader#forecasts.xml', async (t) => {
  const json = await load(FORECASTS_URL, XMLLoader);

  t.ok(json, 'got result');
  t.equal(typeof json, 'object', 'parsed');
  t.equal(json.WMT_MS_Capabilities.Capability.Layer.Layer[2].Name, 'world_rivers', 'contents');

  t.end();
});
