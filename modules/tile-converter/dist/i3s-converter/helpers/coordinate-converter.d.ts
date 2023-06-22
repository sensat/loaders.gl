import type { BoundingVolumes, FullExtent, Mbs, Obb } from '@loaders.gl/i3s';
import { Vector3 } from '@math.gl/core';
import { OrientedBoundingBox, BoundingSphere } from '@math.gl/culling';
import { Tile3D } from '@loaders.gl/tiles';
import { Geoid } from '@math.gl/geoid';
/**
 * Create bounding volumes object from tile and geoid height model.
 * @param tile
 * @param geoidHeightModel
 * @returns - Bounding volumes object
 */
export declare function createBoundingVolumes(tile: Tile3D, geoidHeightModel: Geoid): BoundingVolumes;
/**
 * Generates bounding volumes from geometry positions
 * @param cartesianPositions
 * @param geoidHeightModel
 */
export declare function createBoundingVolumesFromGeometry(cartesianPositions: Float32Array, geoidHeightModel: Geoid): {
    mbs: Mbs;
    obb: Obb;
};
/**
 * Create array of posisitons where each vertex is vector
 * @param {array} positions
 * @returns {Vector3[]}
 */
export declare function convertPositionsToVectors(positions: Float32Array): Vector3[];
/**
 * Convert common coordinate to fullExtent https://github.com/Esri/i3s-spec/blob/master/docs/1.8/fullExtent.cmn.md
 * @param
 * @param boundingVolume
 * @returns - fullExtent object
 */
export declare function convertBoundingVolumeToI3SFullExtent(boundingVolume: OrientedBoundingBox | BoundingSphere): FullExtent;
/**
 * Creates oriented boundinb box from mbs.
 * @param mbs - Minimum Bounding Sphere
 * @returns - Oriented BOunding Box
 */
export declare function createObbFromMbs(mbs: Mbs): Obb;
//# sourceMappingURL=coordinate-converter.d.ts.map