import type { PLYMesh } from './ply-types';
export type ParsePLYOptions = {
    propertyNameMapping?: Record<string, string>;
};
/**
 * @param data
 * @param options
 * @returns
 */
export declare function parsePLY(data: ArrayBuffer | string, options?: ParsePLYOptions): PLYMesh;
//# sourceMappingURL=parse-ply.d.ts.map