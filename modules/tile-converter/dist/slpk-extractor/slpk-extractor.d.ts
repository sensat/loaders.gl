/**
 * Converter from slpk to i3s
 */
export default class SLPKExtractor {
    /**
     * extract slpk to i3s
     * @param options
     * @param options.inputUrl the url to read SLPK file
     * @param options.outputPath the output filename
     */
    extract(options: {
        inputUrl: string;
        outputPath: string;
    }): Promise<string>;
    /**
     * Defines file name and path for i3s format
     * @param fileName initial file name and path
     */
    private correctIndexNames;
    private unGzip;
    private writeFile;
}
//# sourceMappingURL=slpk-extractor.d.ts.map