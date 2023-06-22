/// <reference types="node" />
import { Compression } from '@loaders.gl/compression';
import { ParquetCompression } from './schema/declare';
/**
 * See https://github.com/apache/parquet-format/blob/master/Compression.md
 */
export declare const PARQUET_COMPRESSION_METHODS: Record<ParquetCompression, Compression>;
/**
 * Register compressions that have big external libraries
 * @param options.modules External library dependencies
 */
export declare function preloadCompressions(options?: {
    modules: {
        [key: string]: any;
    };
}): Promise<void[]>;
/**
 * Deflate a value using compression method `method`
 */
export declare function deflate(method: ParquetCompression, value: Buffer): Promise<Buffer>;
/**
 * Inflate a value using compression method `method`
 */
export declare function decompress(method: ParquetCompression, value: Buffer, size: number): Promise<Buffer>;
export declare function inflate(method: ParquetCompression, value: Buffer, size: number): Buffer;
//# sourceMappingURL=compression.d.ts.map