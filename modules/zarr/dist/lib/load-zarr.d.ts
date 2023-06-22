import type { Store } from 'zarr/types/storage/types';
import ZarrPixelSource from './zarr-pixel-source';
interface ZarrOptions {
    labels?: string[];
}
export declare function loadZarr(root: string | Store, options?: ZarrOptions): Promise<{
    data: ZarrPixelSource<string[]>[];
    metadata: import("../types").RootAttrs;
}>;
export {};
//# sourceMappingURL=load-zarr.d.ts.map