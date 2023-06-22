import type { B3DMContent } from '@loaders.gl/3d-tiles';
import type { B3DMAttributesData } from '../../i3s-attributes-worker';
/**
 * Prepare attributes for conversion to avoid binary data breaking in worker thread.
 * @param tileContent
 * @returns
 */
export declare function prepareDataForAttributesConversion(tileContent: B3DMContent): B3DMAttributesData;
//# sourceMappingURL=gltf-attributes.d.ts.map