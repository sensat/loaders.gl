"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCENE_SERVER = void 0;
const SCENE_SERVER = () => ({
    serviceItemId: {
        path: 'serviceItemId'
    },
    serviceName: {
        path: 'layerName'
    },
    name: {
        path: 'layerName'
    },
    currentVersion: {
        path: 'currentVersion',
        default: 10.7
    },
    serviceVersion: {
        path: 'serviceVersion',
        default: '1.8'
    },
    supportedBindings: {
        path: 'supportedBindings',
        default: ['REST']
    },
    layers: {
        path: 'layers0',
        transform: (layers0) => [layers0]
    }
});
exports.SCENE_SERVER = SCENE_SERVER;
