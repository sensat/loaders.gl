"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSceneServerPath = void 0;
const uuid_1 = require("uuid");
const json_map_transform_1 = __importDefault(require("json-map-transform"));
const path_1 = require("path");
const scene_server_1 = require("../json-templates/scene-server");
const file_utils_1 = require("../../lib/utils/file-utils");
/**
 * Form and save sceneServer meta data into a file
 * @param layerName - layer name to display
 * @param layers0 - layer object embedded into sceneServer meta data
 * @param rootPath - root path of new converted tileset
 */
async function createSceneServerPath(layerName, layers0, rootPath) {
    const sceneServerData = {
        serviceItemId: (0, uuid_1.v4)().replace(/-/gi, ''),
        layerName,
        layers0
    };
    const sceneServer = (0, json_map_transform_1.default)(sceneServerData, (0, scene_server_1.SCENE_SERVER)());
    const nodePagePath = (0, path_1.join)(rootPath, 'SceneServer');
    await (0, file_utils_1.writeFile)(nodePagePath, JSON.stringify(sceneServer));
}
exports.createSceneServerPath = createSceneServerPath;
