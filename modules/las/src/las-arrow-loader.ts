// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {LoaderWithParser} from '@sensat/loaders-gl-loader-utils';
import type {ArrowTable} from '@sensat/loaders-gl-schema';
import {convertMeshToTable} from '@sensat/loaders-gl-schema-utils';

import type {LASLoaderOptions} from './las-loader';
import {LAZPerfLoader} from './lazperf-loader';

/**
 * Worker loader for LAS - Point Cloud Data
 */
export const LASArrowLoader = {
  ...LAZPerfLoader,
  dataType: null as unknown as ArrowTable,
  batchType: null as never,
  worker: false,
  parse: async (arrayBuffer: ArrayBuffer) => {
    const mesh = await LAZPerfLoader.parse(arrayBuffer);
    const arrowTable = convertMeshToTable(mesh, 'arrow-table');
    return arrowTable;
  }
  // @ts-expect-error parseSync
} as const satisfies LoaderWithParser<ArrowTable, never, LASLoaderOptions>;
