import type { LoaderWithParser } from '@loaders.gl/loader-utils';
import { FlatGeobufLoader as FlatGeobufWorkerLoader } from './flatgeobuf-loader';
import { parseFlatGeobuf, parseFlatGeobufInBatches } from './lib/parse-flatgeobuf';
export { FlatGeobufWorkerLoader };
export declare const FlatGeobufLoader: {
    parse: (arrayBuffer: any, options: any) => Promise<any[] | import("@loaders.gl/schema").GeoJSONRowTable | AsyncGenerator<import("flatgeobuf/lib/cjs/generic/feature").IFeature, any, unknown> | {
        shape: string;
        data: any[] | AsyncGenerator<import("flatgeobuf/lib/cjs/generic/feature").IFeature, any, unknown>;
    }>;
    parseSync: typeof parseFlatGeobuf;
    parseInBatchesFromStream: typeof parseFlatGeobufInBatches;
    binary: boolean;
    id: string;
    name: string;
    module: string;
    version: any;
    worker: boolean;
    extensions: string[];
    mimeTypes: string[];
    category: string;
    options: {
        flatgeobuf: {
            shape: string;
        };
    };
};
export declare const _typecheckFlatGeobufLoader: LoaderWithParser;
//# sourceMappingURL=index.d.ts.map