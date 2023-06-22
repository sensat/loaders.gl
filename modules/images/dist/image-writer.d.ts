import type { Writer, WriterOptions } from '@loaders.gl/loader-utils';
import type { ImageDataType } from './types';
export type ImageWriterOptions = WriterOptions & {
    image: {
        mimeType: 'image/png';
        jpegQuality: null;
    };
};
/** Writer for image data */
export declare const ImageWriter: Writer<ImageDataType, never, ImageWriterOptions>;
//# sourceMappingURL=image-writer.d.ts.map