/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { fs, stream } from '@loaders.gl/loader-utils';
export declare function load(name: string): any;
export interface WriteStreamOptions {
    flags?: string;
    encoding?: string;
    fd?: number;
    mode?: number;
    autoClose?: boolean;
    start?: number;
}
export declare function oswrite(os: stream.Writable, buf: Buffer): Promise<void>;
export declare function osclose(os: stream.Writable): Promise<void>;
export declare function osopen(path: string, opts?: WriteStreamOptions): Promise<fs.WriteStream>;
//# sourceMappingURL=file-utils.d.ts.map