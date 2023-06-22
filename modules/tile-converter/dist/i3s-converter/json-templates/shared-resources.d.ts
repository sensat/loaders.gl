export declare const SHARED_RESOURCES: () => {
    materialDefinitions: {
        path: string;
        transform: typeof transfromMaterialDefinitions;
    };
    textureDefinitions: {
        path: string;
        transform: typeof transfromTextureDefinitions;
    };
};
declare function transfromMaterialDefinitions(materialDefinitionInfos: any, thisObject: any, originalObject: any): {};
declare function transfromTextureDefinitions(textureDefinitionInfos: any, thisObject: any, originalObject: any): {} | null;
export {};
//# sourceMappingURL=shared-resources.d.ts.map