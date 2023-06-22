import type { LoaderOptions, LoaderWithParser } from '@loaders.gl/loader-utils';
import type { ImageType } from './types';
export type ImageLoaderOptions = LoaderOptions & {
    image?: {
        type?: 'auto' | 'data' | 'imagebitmap' | 'image';
        decode?: boolean;
    };
    imagebitmap?: ImageBitmapOptions;
};
/**
 * Loads a platform-specific image type
 * Note: This type can be used as input data to WebGL texture creation
 */
export declare const ImageLoader: LoaderWithParser<ImageType, never, ImageLoaderOptions>;
//# sourceMappingURL=image-loader.d.ts.map