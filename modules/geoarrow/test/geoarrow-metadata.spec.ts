// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';

import type {GeoArrowMetadata} from '@sensat/loaders-gl-geoarrow';
import {getGeometryColumnsFromSchema} from '@sensat/loaders-gl-geoarrow';

// fix a bug that map bounds are not updated correctly from arrow samples
test('geoarrow#getGeometryColumnsFromSchema', (t) => {
  const testCases: {schema: string; columns: Record<string, GeoArrowMetadata>}[] = [
    {
      schema: '',
      columns: {}
    }
  ];

  for (const testCase of testCases) {
    const columns = getGeometryColumnsFromSchema(testCase.schema as any);
    t.ok(columns);
  }

  t.end();
});
