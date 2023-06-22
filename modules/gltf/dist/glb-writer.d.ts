import type { Writer, WriterOptions } from '@loaders.gl/loader-utils';
import type { GLB } from './lib/types/glb-types';
import type { GLBEncodeOptions } from './lib/encoders/encode-glb';
export type GLBWriterOptions = WriterOptions & {
    glb?: GLBEncodeOptions;
};
/**
 * GLB exporter
 * GLB is the binary container format for GLTF
 */
export declare const GLBWriter: Writer<GLB, never, GLBWriterOptions>;
export declare const _TypecheckGLBLoader: Writer;
//# sourceMappingURL=glb-writer.d.ts.map