import type { Writer, WriterOptions } from '@loaders.gl/loader-utils';
import type { DracoMesh } from './lib/draco-types';
import type { DracoBuildOptions } from './lib/draco-builder';
/** Writer Options for draco */
export type DracoWriterOptions = WriterOptions & {
    draco?: DracoBuildOptions & {
        method?: 'MESH_EDGEBREAKER_ENCODING' | 'MESH_SEQUENTIAL_ENCODING';
        speed?: [number, number];
        quantization?: Record<string, number>;
        attributeNameEntry?: string;
    };
};
/**
 * Exporter for Draco3D compressed geometries
 */
export declare const DracoWriter: Writer<DracoMesh, unknown, DracoWriterOptions>;
//# sourceMappingURL=draco-writer.d.ts.map