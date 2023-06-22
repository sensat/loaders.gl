import type { LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
import { parseNDJSONSync } from './lib/parsers/parse-ndjson';
import { parseNDJSONInBatches } from './lib/parsers/parse-ndjson-in-batches';
export type NDGeoJSONLoaderOptions = LoaderOptions & {
    geojson?: {
        shape?: 'object-row-table';
    };
    gis?: {
        format: 'geojson';
    };
};
export declare const NDJSONLoader: {
    name: string;
    id: string;
    module: string;
    version: any;
    extensions: string[];
    mimeTypes: string[];
    category: string;
    text: boolean;
    parse: (arrayBuffer: ArrayBuffer) => Promise<import("@loaders.gl/schema").ArrayRowTable | import("@loaders.gl/schema").ObjectRowTable>;
    parseTextSync: typeof parseNDJSONSync;
    parseInBatches: typeof parseNDJSONInBatches;
    options: {
        geojson: {
            shape: string;
        };
        gis: {
            format: string;
        };
    };
};
export declare const _typecheckNDJSONLoader: LoaderWithParser;
//# sourceMappingURL=ndgeoson-loader.d.ts.map