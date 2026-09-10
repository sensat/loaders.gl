// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import test from 'tape-promise/tape';
import {load, loadInBatches} from '@sensat/loaders-gl-core';
import type {ObjectRowTable, ObjectRowTableBatch} from '@sensat/loaders-gl-schema';
import {ExcelLoader} from '@sensat/loaders-gl-excel';
import {CSVLoader} from '@sensat/loaders-gl-csv';

const ZIPCODES_XLSX_PATH = '@sensat/loaders-gl-excel/test/data/zipcodes.xlsx';
const ZIPCODES_XLSB_PATH = '@sensat/loaders-gl-excel/test/data/zipcodes.xlsb';
const ZIPCODES_CSV_PATH = '@sensat/loaders-gl-excel/test/data/zipcodes.csv';

test('ExcelLoader#load(ZIPCODES)', async (t) => {
  const csvTable = (await load(ZIPCODES_CSV_PATH, CSVLoader, {
    csv: {shape: 'object-row-table'}
  })) as ObjectRowTable;

  let table = await load(ZIPCODES_XLSB_PATH, ExcelLoader);
  t.equal(table.data.length, 42049, 'XLSB: Correct number of row received');
  t.deepEqual(table.data[0], csvTable.data[0], 'XLSB: Data corresponds to CSV');

  table = await load(ZIPCODES_XLSX_PATH, ExcelLoader);
  t.equal(table.data.length, 42049, 'XLSX: Correct number of row received');
  t.deepEqual(table.data[100], csvTable.data[100], 'XLSX: Data corresponds to CSV');

  t.end();
});

test('ExcelLoader#loadInBatches (on worker)', async (t) => {
  // This masquerades an atomic loader as batches
  const batches = (await loadInBatches(
    ZIPCODES_XLSX_PATH,
    ExcelLoader
  )) as unknown as AsyncIterable<ObjectRowTableBatch>;
  let firstBatch: ObjectRowTableBatch | null = null;
  for await (const batch of batches) {
    firstBatch = firstBatch || batch;
  }
  t.equal(firstBatch?.shape, 'object-row-table', 'XLSX: correct batch type received');
  t.equal(firstBatch?.data.length, 42049, 'XLSX: Correct batch row count received');
  t.end();
});
