import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { join } from 'path';
import process from 'process';
import transform from 'json-map-transform';
import { fetchFile, getLoaderOptions, load, isBrowser } from '@loaders.gl/core';
import { I3SLoader, I3SAttributeLoader, COORDINATE_SYSTEM } from '@loaders.gl/i3s';
import { Tileset3D, Tile3D } from '@loaders.gl/tiles';
import { PGMLoader } from '../pgm-loader';
import { i3sObbTo3dTilesObb } from './helpers/i3s-obb-to-3d-tiles-obb';
import { convertScreenThresholdToGeometricError } from '../lib/utils/lod-conversion-utils';
import { writeFile, removeDir } from '../lib/utils/file-utils';
import { calculateFilesSize, timeConverter } from '../lib/utils/statistic-utills';
import { TILESET as tilesetTemplate } from './json-templates/tileset';
import { createObbFromMbs } from '../i3s-converter/helpers/coordinate-converter';
import { Tile3dAttributesWorker, transform3DTilesAttributesOnWorker } from '../3d-tiles-attributes-worker';
import { getWorkerURL, WorkerFarm } from '@loaders.gl/worker-utils';
import { BROWSER_ERROR_MESSAGE } from '../constants';
const I3S = 'I3S';
export default class Tiles3DConverter {
  constructor() {
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "tilesetPath", void 0);
    _defineProperty(this, "vertexCounter", void 0);
    _defineProperty(this, "conversionStartTime", void 0);
    _defineProperty(this, "geoidHeightModel", void 0);
    _defineProperty(this, "sourceTileset", void 0);
    _defineProperty(this, "attributeStorageInfo", void 0);
    _defineProperty(this, "workerSource", {});
    this.options = {};
    this.tilesetPath = '';
    this.vertexCounter = 0;
    this.conversionStartTime = [0, 0];
    this.geoidHeightModel = null;
    this.sourceTileset = null;
    this.attributeStorageInfo = null;
    this.workerSource = {};
  }
  async convert(options) {
    if (isBrowser) {
      console.log(BROWSER_ERROR_MESSAGE);
      return BROWSER_ERROR_MESSAGE;
    }
    const {
      inputUrl,
      outputPath,
      tilesetName,
      maxDepth,
      egmFilePath
    } = options;
    this.conversionStartTime = process.hrtime();
    this.options = {
      maxDepth
    };
    console.log('Loading egm file...');
    this.geoidHeightModel = await load(egmFilePath, PGMLoader);
    console.log('Loading egm file completed!');
    await this.loadWorkers();
    const sourceTilesetJson = await load(inputUrl, I3SLoader, {});
    this.sourceTileset = new Tileset3D(sourceTilesetJson, {
      loadOptions: {
        _nodeWorkers: true,
        reuseWorkers: true,
        i3s: {
          coordinateSystem: COORDINATE_SYSTEM.LNGLAT_OFFSETS,
          decodeTextures: false
        }
      }
    });
    await this.sourceTileset.tilesetInitializationPromise;
    const rootNode = this.sourceTileset.root;
    if (!rootNode.header.obb) {
      rootNode.header.obb = createObbFromMbs(rootNode.header.mbs);
    }
    this.tilesetPath = join("".concat(outputPath), "".concat(tilesetName));
    this.attributeStorageInfo = sourceTilesetJson.attributeStorageInfo;
    try {
      await removeDir(this.tilesetPath);
    } catch (e) {}
    const rootTile = {
      boundingVolume: {
        box: i3sObbTo3dTilesObb(rootNode.header.obb, this.geoidHeightModel)
      },
      geometricError: convertScreenThresholdToGeometricError(rootNode),
      children: []
    };
    await this._addChildren(rootNode, rootTile, 1);
    const tileset = transform({
      root: rootTile
    }, tilesetTemplate());
    await writeFile(this.tilesetPath, JSON.stringify(tileset), 'tileset.json');
    this._finishConversion({
      slpk: false,
      outputPath,
      tilesetName
    });
    const workerFarm = WorkerFarm.getWorkerFarm({});
    workerFarm.destroy();
  }
  async convertChildNode(parentSourceNode, parentNode, level, childNodeInfo) {
    const sourceChild = await this._loadChildNode(parentSourceNode, childNodeInfo);
    parentSourceNode.children.push(sourceChild);
    if (sourceChild.contentUrl) {
      var _sourceChild$header;
      await this.sourceTileset._loadTile(sourceChild);
      this.vertexCounter += sourceChild.content.vertexCount;
      let featureAttributes = null;
      if (this.attributeStorageInfo) {
        featureAttributes = await this._loadChildAttributes(sourceChild, this.attributeStorageInfo);
      }
      if (!sourceChild.header.obb) {
        sourceChild.header.obb = createObbFromMbs(sourceChild.header.mbs);
      }
      const boundingVolume = {
        box: i3sObbTo3dTilesObb(sourceChild.header.obb, this.geoidHeightModel)
      };
      const child = {
        boundingVolume,
        geometricError: convertScreenThresholdToGeometricError(sourceChild),
        children: []
      };
      const i3sAttributesData = {
        tileContent: sourceChild.content,
        textureFormat: sourceChild === null || sourceChild === void 0 ? void 0 : (_sourceChild$header = sourceChild.header) === null || _sourceChild$header === void 0 ? void 0 : _sourceChild$header.textureFormat
      };
      const b3dm = await transform3DTilesAttributesOnWorker(i3sAttributesData, {
        source: this.workerSource.tile3dWorkerSource,
        featureAttributes
      });
      child.content = {
        uri: "".concat(sourceChild.id, ".b3dm"),
        boundingVolume
      };
      await writeFile(this.tilesetPath, new Uint8Array(b3dm), "".concat(sourceChild.id, ".b3dm"));
      parentNode.children.push(child);
      sourceChild.unloadContent();
      await this._addChildren(sourceChild, child, level + 1);
    } else {
      await this._addChildren(sourceChild, parentNode, level + 1);
    }
  }
  async _addChildren(parentSourceNode, parentNode, level) {
    if (this.options.maxDepth && level > this.options.maxDepth) {
      return;
    }
    const promises = [];
    for (const childNodeInfo of parentSourceNode.header.children || []) {
      promises.push(this.convertChildNode(parentSourceNode, parentNode, level, childNodeInfo));
    }
    await Promise.all(promises);
  }
  async _loadChildNode(parentNode, childNodeInfo) {
    let header;
    if (this.sourceTileset.tileset.nodePages) {
      console.log("Node conversion: ".concat(childNodeInfo.id));
      header = await this.sourceTileset.tileset.nodePagesTile.formTileFromNodePages(childNodeInfo.id);
    } else {
      const {
        loader
      } = this.sourceTileset;
      const nodeUrl = this._relativeUrlToFullUrl(parentNode.url, childNodeInfo.href);
      const options = {
        i3s: {
          ...this.sourceTileset.loadOptions,
          isTileHeader: true,
          loadContent: false
        }
      };
      console.log("Node conversion: ".concat(nodeUrl));
      header = await load(nodeUrl, loader, options);
    }
    return new Tile3D(this.sourceTileset, header, parentNode);
  }
  _relativeUrlToFullUrl(baseUrl, relativeUrl) {
    let resultArray = baseUrl.split('/');
    const relativeUrlArray = relativeUrl.split('/');
    for (const folder of relativeUrlArray) {
      switch (folder) {
        case '.':
          continue;
        case '..':
          resultArray = resultArray.slice(0, -1);
          break;
        default:
          resultArray.push(folder);
      }
    }
    return resultArray.join('/');
  }
  async _loadChildAttributes(sourceChild, attributeStorageInfo) {
    const promises = [];
    const {
      attributeUrls
    } = sourceChild.header;
    for (let index = 0; index < attributeUrls.length; index++) {
      const inputUrl = attributeUrls[index];
      const attribute = attributeStorageInfo[index];
      const options = {
        attributeName: attribute.name,
        attributeType: this._getAttributeType(attribute)
      };
      promises.push(load(inputUrl, I3SAttributeLoader, options));
    }
    const attributesList = await Promise.all(promises);
    this._replaceNestedArrays(attributesList);
    return Object.assign({}, ...attributesList);
  }
  _getAttributeType(attribute) {
    if (attribute.attributeValues) {
      return attribute.attributeValues.valueType;
    } else if (attribute.objectIds) {
      return 'Oid32';
    }
    return '';
  }
  _replaceNestedArrays(attributesList) {
    for (let index = 0; index < attributesList.length; index++) {
      const attributeObject = attributesList[index];
      for (const key in attributeObject) {
        attributeObject[key] = Array.from(attributeObject[key]);
      }
    }
  }
  async _finishConversion(params) {
    const filesSize = await calculateFilesSize(params);
    const diff = process.hrtime(this.conversionStartTime);
    const conversionTime = timeConverter(diff);
    console.log("------------------------------------------------");
    console.log("Finish conversion of ".concat(I3S));
    console.log("Total conversion time: ".concat(conversionTime));
    console.log("Vertex count: ", this.vertexCounter);
    console.log("File(s) size: ", filesSize, ' bytes');
    console.log("------------------------------------------------");
  }
  async loadWorkers() {
    console.log("Loading workers source...");
    const tile3dAttributesWorkerUrl = getWorkerURL(Tile3dAttributesWorker, {
      ...getLoaderOptions()
    });
    const sourceResponse = await fetchFile(tile3dAttributesWorkerUrl);
    const source = await sourceResponse.text();
    this.workerSource.tile3dWorkerSource = source;
    console.log("Loading workers source completed!");
  }
}
//# sourceMappingURL=3d-tiles-converter.js.map