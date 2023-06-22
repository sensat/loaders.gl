export declare const LAYERS: () => {
    version: {
        path: string;
        transform: (val: any) => any;
    };
    id: {
        path: string;
        default: number;
    };
    name: {
        path: string;
    };
    href: {
        path: string;
        default: string;
    };
    layerType: {
        path: string;
        default: string;
    };
    spatialReference: {
        path: string;
        transform: (val: any) => any;
    };
    capabilities: {
        path: string;
        default: string[];
    };
    store: {
        path: string;
        transform: (val: any) => any;
    };
    fullExtent: {
        path: string;
        transform: (val: any) => any;
    };
    heightModelInfo: {
        path: string;
        transform: (val: any) => any;
    };
    nodePages: {
        path: string;
        transform: (val: any) => any;
    };
    materialDefinitions: {
        path: string;
        default: never[];
    };
    textureSetDefinitions: {
        path: string;
        default: never[];
    };
    geometryDefinitions: {
        path: string;
        default: never[];
    };
    attributeStorageInfo: {
        path: string;
        default: never[];
    };
    fields: {
        path: string;
        default: never[];
    };
    popupInfo: {
        path: string;
        default: null;
    };
};
//# sourceMappingURL=layers.d.ts.map