export declare const NODE: () => {
    lodSelection: {
        path: string;
        default: {
            metricType: string;
            maxError: number;
        }[];
    };
    children: {
        path: string;
        default: null;
    };
    neighbors: {
        path: string;
        default: null;
    };
    parentNode: {
        path: string;
        transform: (val: any) => any;
        default: null;
    };
    sharedResource: {
        path: string;
        default: null;
    };
    featureData: {
        path: string;
        default: null;
    };
    geometryData: {
        path: string;
        default: null;
    };
    textureData: {
        path: string;
        default: null;
    };
    attributeData: {
        path: string;
        default: null;
    };
    mbs: {
        path: string;
    };
    obb: {
        path: string;
    };
    version: {
        path: string;
    };
    id: {
        path: string;
    };
    path: {
        path: string;
    };
    level: {
        path: string;
    };
};
//# sourceMappingURL=node.d.ts.map