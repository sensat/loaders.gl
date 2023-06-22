/** Declares which image format mime types this loader polyfill supports */
export declare const NODE_FORMAT_SUPPORT: string[];
type NDArray = {
    shape: number[];
    data: Uint8Array;
    width: number;
    height: number;
    components: number;
    layers: number[];
};
export declare function parseImageNode(arrayBuffer: ArrayBuffer, mimeType: string): Promise<NDArray>;
export {};
//# sourceMappingURL=parse-image.node.d.ts.map