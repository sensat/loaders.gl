"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE = void 0;
const json_map_transform_1 = __importDefault(require("json-map-transform"));
const COORDINATES = () => ({
    mbs: {
        path: 'mbs'
    },
    obb: {
        path: 'obb'
    }
});
const HREF = () => ({
    href: {
        path: 'href'
    }
});
const PARENT_NODE = () => ({
    id: {
        path: 'id'
    },
    ...HREF(),
    ...COORDINATES()
});
const NODE = () => ({
    version: {
        path: 'version'
    },
    id: {
        path: 'id'
    },
    path: {
        path: 'path'
    },
    level: {
        path: 'level'
    },
    ...COORDINATES(),
    lodSelection: {
        path: 'lodSelection',
        default: [
            {
                metricType: 'maxScreenThresholdSQ',
                maxError: 196349.54374999998
            },
            {
                metricType: 'maxScreenThreshold',
                maxError: 999.99999999999994
            }
        ]
    },
    children: {
        path: 'children',
        default: null
    },
    neighbors: {
        path: 'neighbors',
        default: null
    },
    parentNode: {
        path: 'parentNode',
        transform: (val) => (0, json_map_transform_1.default)(val, PARENT_NODE()),
        default: null
    },
    sharedResource: {
        path: 'sharedResource',
        default: null
    },
    featureData: {
        path: 'featureData',
        default: null
    },
    geometryData: {
        path: 'geometryData',
        default: null
    },
    textureData: {
        path: 'textureData',
        default: null
    },
    attributeData: {
        path: 'attributeData',
        default: null
    }
});
exports.NODE = NODE;
