// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
// import {validateLoader} from 'test/common/conformance';

import {CSWCapabilitiesLoader} from '@sensat/loaders-gl-wms';
import {load} from '@sensat/loaders-gl-core';

const CSW_CAPABILITIES_URL = '@sensat/loaders-gl-wms/test/data/csw/get-capabilities.xml';

test('CSWCapabilitiesLoader#forecasts.xml', async (t) => {
  const capabilities = await load(CSW_CAPABILITIES_URL, CSWCapabilitiesLoader);
  // t.comment(JSON.stringify(capabilities));

  t.equal(typeof capabilities, 'object', 'parsed');
  // t.equal(capabilities.layer.layers[2]?.name, 'world_rivers', 'contents');

  t.end();
});
