export declare const SCENE_SERVER: () => {
    serviceItemId: {
        path: string;
    };
    serviceName: {
        path: string;
    };
    name: {
        path: string;
    };
    currentVersion: {
        path: string;
        default: number;
    };
    serviceVersion: {
        path: string;
        default: string;
    };
    supportedBindings: {
        path: string;
        default: string[];
    };
    layers: {
        path: string;
        transform: (layers0: any) => any[];
    };
};
//# sourceMappingURL=scene-server.d.ts.map