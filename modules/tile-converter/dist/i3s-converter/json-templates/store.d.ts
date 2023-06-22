export declare const STORE: {
    id: {
        path: string;
        transform: (val: any) => any;
    };
    profile: {
        path: string;
        default: string;
    };
    version: {
        path: string;
        default: string;
    };
    resourcePattern: {
        path: string;
        default: string[];
    };
    rootNode: {
        path: string;
        default: string;
    };
    extent: {
        path: string;
    };
    indexCRS: {
        path: string;
        default: string;
    };
    vertexCRS: {
        path: string;
        default: string;
    };
    normalReferenceFrame: {
        path: string;
        default: string;
    };
    attributeEncoding: {
        path: string;
        default: string;
    };
    textureEncoding: {
        path: string;
        default: string[];
    };
    lodType: {
        path: string;
        default: string;
    };
    lodModel: {
        path: string;
        default: string;
    };
    defaultGeometrySchema: {
        path: string;
        default: {
            geometryType: string;
            header: {
                property: string;
                type: string;
            }[];
            topology: string;
            ordering: string[];
            vertexAttributes: {
                position: {
                    valueType: string;
                    valuesPerElement: number;
                };
                normal: {
                    valueType: string;
                    valuesPerElement: number;
                };
                uv0: {
                    valueType: string;
                    valuesPerElement: number;
                };
                color: {
                    valueType: string;
                    valuesPerElement: number;
                };
            };
            featureAttributeOrder: string[];
            featureAttributes: {
                id: {
                    valueType: string;
                    valuesPerElement: number;
                };
                faceRange: {
                    valueType: string;
                    valuesPerElement: number;
                };
            };
        };
    };
};
//# sourceMappingURL=store.d.ts.map