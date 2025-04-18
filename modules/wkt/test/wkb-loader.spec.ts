// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

/* eslint-disable no-continue */

import test from 'tape-promise/tape';
import {fetchFile, parseSync} from '@loaders.gl/core';
import {WKBLoader, isWKB} from '@loaders.gl/wkt';
import {parseTestCases} from './utils/parse-test-cases';

const WKB_2D_TEST_CASES = '@loaders.gl/wkt/test/data/wkb-testdata2d.json';
const WKB_Z_TEST_CASES = '@loaders.gl/wkt/test/data/wkb-testdataZ.json';

test('WKBLoader#2D', async (t) => {
  const response = await fetchFile(WKB_2D_TEST_CASES);
  const TEST_CASES = parseTestCases(await response.json());

  const TEST_CASES2 = {multiPolygonWithTwoPolygons: TEST_CASES.multiPolygonWithTwoPolygons};
  // TODO parseWKB outputs TypedArrays; testCase contains regular arrays
  for (const [title, testCase] of Object.entries(TEST_CASES2)) {
    // Little endian
    if (testCase.wkb && testCase.binary) {
      t.ok(isWKB(testCase.wkb), 'isWKB(2D)');
      const result = parseSync(testCase.wkb, WKBLoader, {wkb: {shape: 'binary-geometry'}});
      t.deepEqual(result, testCase.binary, title);
    }

    // Big endian
    if (testCase.wkbXdr && testCase.binary) {
      t.ok(isWKB(testCase.wkbXdr), 'isWKB(2D)');
      const result = parseSync(testCase.wkbXdr, WKBLoader, {wkb: {shape: 'binary-geometry'}});
      t.deepEqual(result, testCase.binary, title);
    }
  }

  t.end();
});

test('WKBLoader#Z', async (t) => {
  const response = await fetchFile(WKB_Z_TEST_CASES);
  const TEST_CASES = parseTestCases(await response.json());

  // TODO parseWKB outputs TypedArrays; testCase contains regular arrays
  for (const [title, testCase] of Object.entries(TEST_CASES)) {
    // Little endian
    if (testCase.wkb && testCase.binary) {
      t.ok(isWKB(testCase.wkb), 'isWKB(Z)');
      const result = parseSync(testCase.wkb, WKBLoader);
      t.deepEqual(result, testCase.binary, title);
    }

    // Big endian
    if (testCase.wkbXdr && testCase.binary) {
      t.ok(isWKB(testCase.wkbXdr), 'isWKB(Z)');
      const result = parseSync(testCase.wkbXdr, WKBLoader);
      t.deepEqual(result, testCase.binary, title);
    }

    // if (testCase.wkbXdr && testCase.binary && testCase.geoJSON) {
    //   t.deepEqual(parseSync(testCase.wkbXdr, WKBLoader, {wkb: {shape: 'geometry'}}), testCase.geoJSON);
    // }
  }

  t.end();
});
