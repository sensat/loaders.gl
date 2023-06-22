import type { ZarrArray } from 'zarr';
import type { Store } from 'zarr/types/storage/types';
import type { PixelSource, RootAttrs, Labels } from '../types';
export declare function normalizeStore(source: string | Store): Store;
export declare function loadMultiscales(store: Store, path?: string): Promise<{
    data: ZarrArray[];
    rootAttrs: RootAttrs;
}>;
export declare function getDims<S extends string>(labels: S[]): (name: S) => number;
export declare function isInterleaved(shape: number[]): boolean;
export declare function guessTileSize(arr: ZarrArray): number;
export declare function guessLabels(rootAttrs: RootAttrs): Labels<["t", "c", "z"]>;
export declare function getIndexer<T extends string>(labels: T[]): (sel: number[] | { [K in T]: number; }) => number[];
export declare function getImageSize<T extends string[]>(source: PixelSource<T>): {
    height: number;
    width: number;
};
/**
 * Preserves (double) slashes earlier in the path, so this works better
 * for URLs. From https://stackoverflow.com/a/46427607
 * @param args parts of a path or URL to join.
 */
export declare function joinUrlParts(...args: string[]): string;
export declare function validLabels(labels: string[], shape: number[]): labels is Labels<string[]>;
//# sourceMappingURL=utils.d.ts.map