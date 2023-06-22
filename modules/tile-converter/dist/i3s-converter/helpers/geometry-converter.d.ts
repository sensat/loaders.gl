import type { B3DMContent, FeatureTableJson } from '@loaders.gl/3d-tiles';
import { ConvertedAttributes, I3SConvertedResources, I3SMaterialWithTexture } from '../types';
import { AttributeStorageInfo } from '@loaders.gl/i3s';
import { Geoid } from '@math.gl/geoid';
/** Usage of worker here brings more overhead than advantage */
import { B3DMAttributesData } from '../../i3s-attributes-worker';
/**
 * Convert binary data from b3dm file to i3s resources
 *
 * @param tileContent - 3d tile content
 * @param addNodeToNodePage - function to add new node to node pages
 * @param propertyTable - batch table (corresponding to feature attributes data)
 * @param featuresHashArray - hash array of features that is needed to not to mix up same features in parent and child nodes
 * @param attributeStorageInfo - attributes metadata from 3DSceneLayer json
 * @param draco - is converter should create draco compressed geometry
 * @param generateBoundingVolumes - is converter should create accurate bounding voulmes from geometry attributes
 * @param shouldMergeMaterials - Try to merge similar materials to be able to merge meshes into one node
 * @param geoidHeightModel - model to convert elevation from elipsoidal to geoid
 * @param workerSource - source code of used workers
 * @returns Array of node resources to create one or more i3s nodes
 */
export default function convertB3dmToI3sGeometry(tileContent: B3DMContent, addNodeToNodePage: () => Promise<number>, propertyTable: FeatureTableJson | null, featuresHashArray: string[], attributeStorageInfo: AttributeStorageInfo[] | undefined, draco: boolean, generateBoundingVolumes: boolean, shouldMergeMaterials: boolean, geoidHeightModel: Geoid, workerSource: {
    [key: string]: string;
}): Promise<I3SConvertedResources[] | null>;
/**
 * Convert attributes from the gltf nodes tree to i3s plain geometry
 * @param attributesData - geometry attributes from gltf
 * @param materialAndTextureList - array of data about materials and textures of the content
 * @param useCartesianPositions - convert positions to absolute cartesian coordinates instead of cartographic offsets.
 * Cartesian coordinates will be required for creating bounding voulmest from geometry positions
 * @returns map of converted geometry attributes
 */
export declare function convertAttributes(attributesData: B3DMAttributesData, materialAndTextureList: I3SMaterialWithTexture[], useCartesianPositions: boolean): Promise<Map<string, ConvertedAttributes>>;
/**
 * Find property table in tile
 * For example it can be batchTable for b3dm files or property table in gLTF extension.
 * @param sourceTile
 * @return batch table from b3dm / feature properties from EXT_FEATURE_METADATA
 */
export declare function getPropertyTable(tileContent: B3DMContent): FeatureTableJson | null;
//# sourceMappingURL=geometry-converter.d.ts.map