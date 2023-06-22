import { FlatGeobufLoaderOptions } from './types';
import { GeoJSONRowTable } from '@loaders.gl/schema';
export declare function parseFlatGeobuf(arrayBuffer: ArrayBuffer, options?: FlatGeobufLoaderOptions): any[] | GeoJSONRowTable | AsyncGenerator<import("flatgeobuf/lib/cjs/generic/feature").IFeature, any, unknown> | {
    shape: string;
    data: any[] | AsyncGenerator<import("flatgeobuf/lib/cjs/generic/feature").IFeature, any, unknown>;
};
export declare function parseFlatGeobufInBatches(stream: any, options: FlatGeobufLoaderOptions): any[] | AsyncGenerator<import("flatgeobuf/lib/cjs/generic/feature").IFeature, any, unknown> | AsyncGenerator<any, void, unknown>;
//# sourceMappingURL=parse-flatgeobuf.d.ts.map