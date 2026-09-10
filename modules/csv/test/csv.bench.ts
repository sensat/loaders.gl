import {fetchFile, parse} from '@sensat/loaders-gl-core';
import {CSVLoader} from '@sensat/loaders-gl-csv';

const SAMPLE_CSV_URL = '@sensat/loaders-gl-csv/test/data/sample-very-long.csv';

// Comparison loader based on D3
import {csvParseRows} from 'd3-dsv';

const D3CSVLoader = {
  name: 'D3 CSV',
  extensions: ['csv'],
  testText: null,
  text: true,
  parseTextSync: (text) => csvParseRows(text)
};

export default async function csvBench(bench) {
  const response = await fetchFile(SAMPLE_CSV_URL);
  const sample = await response.text();

  bench = bench.group('CSV Decode');

  bench = bench.addAsync('CSVLoader#parse', {multiplier: 2000, unit: 'rows'}, async () => {
    return await parse(sample, CSVLoader);
  });

  bench = bench.addAsync('d3-dsv#parse', {multiplier: 2000, unit: 'rows'}, async () => {
    // @ts-ignore
    return await parse(sample, D3CSVLoader);
  });

  return bench;
}
