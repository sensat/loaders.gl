// loaders.gl
// SPDX-License-Identifier: MIT
// Copyright vis.gl contributors

import type {LoaderWithParser} from '@sensat/loaders-gl-loader-utils';
import type {XMLLoaderOptions} from '@sensat/loaders-gl-xml';
import {WMSCapabilitiesLoader} from '../wms-capabilities-loader';

import type {WMSFeatureInfo} from '../lib/parsers/wms/parse-wms-features';
import {parseWMSFeatureInfo} from '../lib/parsers/wms/parse-wms-features';

export {WMSFeatureInfo};

/**
 * Loader for the response to the WMS GetFeatureInfo request
 */
export const WMSFeatureInfoLoader = {
  ...WMSCapabilitiesLoader,
  dataType: null as unknown as WMSFeatureInfo,

  id: 'wms-feature-info',
  name: 'WMS FeatureInfo',

  parse: async (arrayBuffer: ArrayBuffer, options?: XMLLoaderOptions) =>
    parseWMSFeatureInfo(new TextDecoder().decode(arrayBuffer), options),
  parseTextSync: (text: string, options?: XMLLoaderOptions) => parseWMSFeatureInfo(text, options)
} as const satisfies LoaderWithParser<WMSFeatureInfo, never, XMLLoaderOptions>;
