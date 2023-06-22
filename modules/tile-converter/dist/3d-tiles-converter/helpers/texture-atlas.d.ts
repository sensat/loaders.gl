/**
 * Apply uvRegions to texture coordinates.
 * Spec - https://github.com/Esri/i3s-spec/blob/master/docs/1.7/geometryUVRegion.cmn.md
 * Shader formula vec2 uv = fract(texCoords) * (uvRegions.zw - uvRegions.xy) + uvRegions.xy;
 * @param texCoords
 * @param uvRegions
 */
export declare function convertTextureAtlas(texCoords: Float32Array, uvRegions: Uint16Array): Float32Array;
//# sourceMappingURL=texture-atlas.d.ts.map