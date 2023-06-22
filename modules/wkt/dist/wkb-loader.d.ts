import type { Loader, LoaderWithParser } from '@loaders.gl/loader-utils';
import parseWKB from './lib/parse-wkb';
/**
 * Worker loader for WKB (Well-Known Binary)
 */
export declare const WKBWorkerLoader: {
    name: string;
    id: string;
    module: string;
    version: any;
    worker: boolean;
    category: string;
    extensions: string[];
    mimeTypes: never[];
    options: {
        wkb: {};
    };
};
/**
 * Loader for WKB (Well-Known Binary)
 */
export declare const WKBLoader: {
    parse: (arrayBuffer: ArrayBuffer) => Promise<import("@loaders.gl/schema").BinaryGeometry>;
    parseSync: typeof parseWKB;
    name: string;
    id: string;
    module: string;
    version: any;
    worker: boolean;
    category: string;
    extensions: string[];
    mimeTypes: never[];
    options: {
        wkb: {};
    };
};
export declare const _typecheckWKBWorkerLoader: Loader;
export declare const _typecheckWKBLoader: LoaderWithParser;
//# sourceMappingURL=wkb-loader.d.ts.map