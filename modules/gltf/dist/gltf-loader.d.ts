import type { LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
import type { DracoLoaderOptions } from '@loaders.gl/draco';
import type { ImageLoaderOptions } from '@loaders.gl/images';
import type { TextureLoaderOptions } from '@loaders.gl/textures';
import type { ParseGLTFOptions } from './lib/parsers/parse-gltf';
import type { GLTFWithBuffers } from './lib/types/gltf-types';
import type { GLBLoaderOptions } from './glb-loader';
/**
 * GLTF loader options
 */
export type GLTFLoaderOptions = LoaderOptions & ImageLoaderOptions & TextureLoaderOptions & GLBLoaderOptions & DracoLoaderOptions & {
    gltf?: ParseGLTFOptions;
};
/**
 * GLTF loader
 */
export declare const GLTFLoader: LoaderWithParser<GLTFWithBuffers, never, GLBLoaderOptions>;
export declare function parse(arrayBuffer: any, options: GLTFLoaderOptions | undefined, context: any): Promise<GLTFWithBuffers>;
//# sourceMappingURL=gltf-loader.d.ts.map