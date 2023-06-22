import { BoundingVolumes } from '@loaders.gl/i3s';
import { Tile3D } from '@loaders.gl/tiles';
/**
 * Do conversion from geometric error to screen threshold
 *
 * In 3DTiles we have HLOD logic and parent tile also has bigger lodMetric value then its children.
 * In I3s we have reverse logic related to maxError. Parent has lower maxError than its child.
 * In nodes where are no children tile.lodMetricValue is 0. This is because of logic of HLOD in 3DTiles
 * 3DTiles spec:
 * https://github.com/CesiumGS/3d-tiles/tree/master/specification#geometric-error
 * I3S spec:
 * https://github.com/Esri/i3s-spec/blob/master/docs/1.7/lodSelection.cmn.md
 * To avoid infinity values when we do calculations of maxError we shold replace 0 with value which allows us
 * to make child maxError bigger than his parent maxError.
 *
 * @param tile - 3d-tiles tile Object
 * @param coordinates - node converted coordinates
 * @returns An array of LOD metrics in format compatible with i3s 3DNodeIndexDocument.lodSelection
 * @example
 *  [
        {
            "metricType": "maxScreenThresholdSQ",
            "maxError": 870638.071285568
        },
        {
            "metricType": "maxScreenThreshold",
            "maxError": 1052.8679031638949
        }
    ]
 */
export declare function convertGeometricErrorToScreenThreshold(tile: Tile3D, coordinates: BoundingVolumes): {
    metricType: string;
    maxError: number;
}[];
/**
 * Convert LOD metric from "Screen Threshold" to "Screen Space Error"
 * @param node - i3s node data
 * @returns lod metric in 3d-tiles format
 */
export declare function convertScreenThresholdToGeometricError(node: Tile3D): number;
//# sourceMappingURL=lod-conversion-utils.d.ts.map