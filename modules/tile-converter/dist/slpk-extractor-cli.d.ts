import '@loaders.gl/polyfills';
type SLPKExtractionOptions = {
    /** "tileset.json" file (3DTiles) / "http://..../SceneServer/layers/0" resource (I3S) */
    tileset?: string;
    /** Output folder. This folder will be created by converter if doesn't exist. It is relative to the converter path.
     * Default: "data" folder */
    output?: string;
};
export type ValidatedSLPKExtractionOptions = SLPKExtractionOptions & {
    /** slpk file */
    tileset: string;
    /** Output folder. This folder will be created by converter if doesn't exist. It is relative to the converter path.
     * Default: "data" folder */
    output: string;
};
export {};
//# sourceMappingURL=slpk-extractor-cli.d.ts.map