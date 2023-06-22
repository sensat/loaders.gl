import type { Writer } from '@loaders.gl/loader-utils';
import type { ImageDataType } from '@loaders.gl/images';
/** @todo should be in basis sub-object */
export type KTX2BasisWriterOptions = {
    useSRGB?: boolean;
    qualityLevel?: number;
    encodeUASTC?: boolean;
    mipmaps?: boolean;
};
/**
 *  Basis Universal Supercompressed GPU Texture.
 *  Spec - https://github.com/Esri/i3s-spec/blob/master/docs/1.8/textureSetDefinitionFormat.cmn.md
 */
export declare const KTX2BasisWriter: Writer<ImageDataType, unknown, KTX2BasisWriterOptions>;
export declare const _TypecheckKTX2TextureWriter: Writer;
//# sourceMappingURL=ktx2-basis-writer.d.ts.map