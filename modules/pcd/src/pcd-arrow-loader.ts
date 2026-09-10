// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright (c) vis.gl contributors

import type {LoaderWithParser} from '@sensat/loaders-gl-loader-utils';
import type {ArrowTable} from '@sensat/loaders-gl-schema';

import {PCDLoaderOptions, PCDWorkerLoader} from './pcd-loader';
import {convertMeshToTable} from '@sensat/loaders-gl-schema-utils';
import {parsePCD} from './lib/parse-pcd';

/**
 * Worker loader for PCD - Point Cloud Data
 */
export const PCDArrowLoader = {
  ...PCDWorkerLoader,
  dataType: null as unknown as ArrowTable,
  batchType: null as never,
  worker: false,
  parse: async (arrayBuffer: ArrayBuffer) => {
    const mesh = parsePCD(arrayBuffer);
    const arrowTable = convertMeshToTable(mesh, 'arrow-table');
    return arrowTable;
  }
} as const satisfies LoaderWithParser<ArrowTable, never, PCDLoaderOptions>;
