import type { LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
import type { GLB } from './lib/types/glb-types';
import type { ParseGLBOptions } from './lib/parsers/parse-glb';
export type GLBLoaderOptions = LoaderOptions & {
    glb?: ParseGLBOptions;
    byteOffset?: number;
};
/**
 * GLB Loader -
 * GLB is the binary container format for GLTF
 */
export declare const GLBLoader: LoaderWithParser<GLB, never, GLBLoaderOptions>;
export declare const _TypecheckGLBLoader: LoaderWithParser;
//# sourceMappingURL=glb-loader.d.ts.map