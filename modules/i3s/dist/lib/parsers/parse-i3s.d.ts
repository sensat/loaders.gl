import { I3STilesetHeader, I3STileHeader, I3SMinimalNodeData, Node3DIndexDocument } from '../../types';
import type { LoaderOptions, LoaderContext } from '@loaders.gl/loader-utils';
export declare function normalizeTileData(tile: Node3DIndexDocument, context: LoaderContext): I3STileHeader;
export declare function normalizeTileNonUrlData(tile: I3SMinimalNodeData): I3STileHeader;
export declare function normalizeTilesetData(tileset: I3STilesetHeader, options: LoaderOptions, context: LoaderContext): Promise<void>;
//# sourceMappingURL=parse-i3s.d.ts.map