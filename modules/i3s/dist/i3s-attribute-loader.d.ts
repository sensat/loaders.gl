import type { LoaderOptions, LoaderWithParser } from '@loaders.gl/loader-utils';
import type { I3STileAttributes } from './lib/parsers/parse-i3s-attribute';
/**
 * Loader for I3S attributes
 */
export declare const I3SAttributeLoader: LoaderWithParser<I3STileAttributes, never, LoaderOptions>;
/**
 * Load attributes based on feature id
 * @param {Object} tile
 * @param {number} featureId
 * @param {Object} options
 * @returns {Promise}
 */
export declare function loadFeatureAttributes(tile: any, featureId: any, options?: {}): Promise<{} | null>;
/**
 * Get attribute value type based on property names
 * @param {Object} attribute
 * @returns {String}
 */
export declare function getAttributeValueType(attribute: any): any;
//# sourceMappingURL=i3s-attribute-loader.d.ts.map