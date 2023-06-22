/**
 * Returns data bytes representing a compressed image in PNG or JPG format,
 * This data can be saved using file system (f) methods or
 * used in a request.
 * @param image to save
 * @param options
 * @param options.type='png' - png, jpg or image/png, image/jpg are valid
 * @param options.dataURI - Whether to include a data URI header
 * @return {*} bytes
 */
export declare function encodeImageToStreamNode(image: {
    data: any;
    width: number;
    height: number;
}, options: {
    type?: string;
    dataURI?: string;
}): any;
export declare function encodeImageNode(image: any, options: any): Promise<unknown>;
//# sourceMappingURL=encode-image.node.d.ts.map