// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {getTiles3DScreenSpaceError} from '../../../src/tileset/helpers/tiles-3d-lod';

test('getTiles3DScreenSpaceError#uses rootViewDistanceScale only for the root tile', (t) => {
  const tileset = {
    options: {viewDistanceScale: 1, rootViewDistanceScale: 2},
    dynamicScreenSpaceError: false
  };
  const frameState = {height: 100, sseDenominator: 1};
  const root = {tileset, lodMetricValue: 10, _distanceToCamera: 10, parent: undefined};
  const child = {tileset, lodMetricValue: 10, _distanceToCamera: 10, parent: root};

  t.equal(getTiles3DScreenSpaceError(root, frameState, false), 200);
  t.equal(getTiles3DScreenSpaceError(child, frameState, false), 100);
  t.end();
});
