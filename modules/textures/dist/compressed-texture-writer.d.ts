import type { Writer, WriterOptions } from '@loaders.gl/loader-utils';
export type CompressedTextureWriterOptions = WriterOptions & {
    cwd?: string;
    texture?: {
        format: string;
        compression: string;
        quality: string;
        mipmap: boolean;
        flipY: boolean;
        toolFlags: string;
    };
};
/**
 * DDS Texture Container Exporter
 */
export declare const CompressedTextureWriter: Writer<unknown, unknown, CompressedTextureWriterOptions>;
//# sourceMappingURL=compressed-texture-writer.d.ts.map