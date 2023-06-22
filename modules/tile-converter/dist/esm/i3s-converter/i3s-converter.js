import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
var _process$env;
import { load, encode, fetchFile, getLoaderOptions, isBrowser } from '@loaders.gl/core';
import { Tileset3D } from '@loaders.gl/tiles';
import { CesiumIonLoader, Tiles3DLoader } from '@loaders.gl/3d-tiles';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import process from 'process';
import transform from 'json-map-transform';
import md5 from 'md5';
import NodePages from './helpers/node-pages';
import { writeFile, removeDir, writeFileForSlpk, removeFile } from '../lib/utils/file-utils';
import { compressFileWithGzip, compressWithChildProcess } from '../lib/utils/compress-util';
import { calculateFilesSize, timeConverter } from '../lib/utils/statistic-utills';
import convertB3dmToI3sGeometry, { getPropertyTable } from './helpers/geometry-converter';
import { createBoundingVolumes, convertBoundingVolumeToI3SFullExtent } from './helpers/coordinate-converter';
import { createSceneServerPath } from './helpers/create-scene-server-path';
import { convertGeometricErrorToScreenThreshold } from '../lib/utils/lod-conversion-utils';
import { PGMLoader } from '../pgm-loader';
import { LAYERS as layersTemplate } from './json-templates/layers';
import { GEOMETRY_DEFINITION as geometryDefinitionTemlate } from './json-templates/geometry-definitions';
import { SHARED_RESOURCES as sharedResourcesTemplate } from './json-templates/shared-resources';
import { validateNodeBoundingVolumes } from './helpers/node-debug';
import { KTX2BasisWriterWorker } from '@loaders.gl/textures';
import { ImageWriter } from '@loaders.gl/images';
import { getWorkerURL, WorkerFarm } from '@loaders.gl/worker-utils';
import { DracoWriterWorker } from '@loaders.gl/draco';
import WriteQueue from '../lib/utils/write-queue';
import { I3SAttributesWorker } from '../i3s-attributes-worker';
import { BROWSER_ERROR_MESSAGE } from '../constants';
import { createdStorageAttribute, createFieldAttribute, createPopupInfo, getAttributeType, getFieldAttributeType } from './helpers/feature-attributes';
import { NodeIndexDocument } from './helpers/node-index-document';
const ION_DEFAULT_TOKEN = ((_process$env = process.env) === null || _process$env === void 0 ? void 0 : _process$env.IonToken) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWMxMzcyYy0zZjJkLTQwODctODNlNi01MDRkZmMzMjIxOWIiLCJpZCI6OTYyMCwic2NvcGVzIjpbImFzbCIsImFzciIsImdjIl0sImlhdCI6MTU2Mjg2NjI3M30.1FNiClUyk00YH_nWfSGpiQAjR5V2OvREDq1PJ5QMjWQ';
const HARDCODED_NODES_PER_PAGE = 64;
const _3D_TILES = '3DTILES';
const _3D_OBJECT_LAYER_TYPE = '3DObject';
const REFRESH_TOKEN_TIMEOUT = 1800;
const CESIUM_DATASET_PREFIX = 'https://';
export default class I3SConverter {
  constructor() {
    _defineProperty(this, "nodePages", void 0);
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "layers0Path", void 0);
    _defineProperty(this, "materialMap", void 0);
    _defineProperty(this, "materialDefinitions", void 0);
    _defineProperty(this, "geometryMap", void 0);
    _defineProperty(this, "geometryConfigs", void 0);
    _defineProperty(this, "vertexCounter", void 0);
    _defineProperty(this, "layers0", void 0);
    _defineProperty(this, "featuresHashArray", void 0);
    _defineProperty(this, "refinementCounter", void 0);
    _defineProperty(this, "validate", void 0);
    _defineProperty(this, "boundingVolumeWarnings", []);
    _defineProperty(this, "conversionStartTime", [0, 0]);
    _defineProperty(this, "refreshTokenTime", [0, 0]);
    _defineProperty(this, "sourceTileset", null);
    _defineProperty(this, "geoidHeightModel", null);
    _defineProperty(this, "Loader", Tiles3DLoader);
    _defineProperty(this, "generateTextures", void 0);
    _defineProperty(this, "generateBoundingVolumes", void 0);
    _defineProperty(this, "layersHasTexture", void 0);
    _defineProperty(this, "workerSource", {});
    _defineProperty(this, "writeQueue", new WriteQueue());
    _defineProperty(this, "compressList", null);
    this.nodePages = new NodePages(writeFile, HARDCODED_NODES_PER_PAGE, this);
    this.options = {};
    this.layers0Path = '';
    this.materialMap = new Map();
    this.materialDefinitions = [];
    this.geometryMap = new Map();
    this.geometryConfigs = [];
    this.vertexCounter = 0;
    this.layers0 = null;
    this.featuresHashArray = [];
    this.refinementCounter = {
      tilesCount: 0,
      tilesWithAddRefineCount: 0
    };
    this.validate = false;
    this.generateTextures = false;
    this.generateBoundingVolumes = false;
    this.layersHasTexture = false;
    this.compressList = null;
  }
  async convert(options) {
    if (isBrowser) {
      console.log(BROWSER_ERROR_MESSAGE);
      return BROWSER_ERROR_MESSAGE;
    }
    this.conversionStartTime = process.hrtime();
    const {
      tilesetName,
      slpk,
      egmFilePath,
      inputUrl,
      validate,
      outputPath,
      draco = true,
      sevenZipExe,
      maxDepth,
      token,
      generateTextures,
      generateBoundingVolumes,
      instantNodeWriting = false,
      mergeMaterials = true
    } = options;
    this.options = {
      maxDepth,
      slpk,
      sevenZipExe,
      egmFilePath,
      draco,
      token,
      inputUrl,
      instantNodeWriting,
      mergeMaterials
    };
    this.compressList = this.options.instantNodeWriting && [] || null;
    this.validate = Boolean(validate);
    this.Loader = inputUrl.indexOf(CESIUM_DATASET_PREFIX) !== -1 ? CesiumIonLoader : Tiles3DLoader;
    this.generateTextures = Boolean(generateTextures);
    this.generateBoundingVolumes = Boolean(generateBoundingVolumes);
    this.writeQueue = new WriteQueue();
    this.writeQueue.startListening();
    console.log('Loading egm file...');
    this.geoidHeightModel = await load(egmFilePath, PGMLoader);
    console.log('Loading egm file completed!');
    if (slpk) {
      this.nodePages.useWriteFunction(writeFileForSlpk);
    }
    await this.loadWorkers();
    try {
      var _sourceTilesetJson$ro, _sourceTilesetJson$ro2;
      const preloadOptions = await this._fetchPreloadOptions();
      const tilesetOptions = {
        loadOptions: {
          _nodeWorkers: true,
          reuseWorkers: true,
          basis: {
            format: 'rgba32',
            workerUrl: './modules/textures/dist/basis-worker-node.js'
          },
          draco: {
            workerUrl: './modules/draco/dist/draco-worker-node.js'
          }
        }
      };
      if (preloadOptions.headers) {
        tilesetOptions.loadOptions.fetch = {
          headers: preloadOptions.headers
        };
      }
      Object.assign(tilesetOptions, preloadOptions);
      const sourceTilesetJson = await load(inputUrl, this.Loader, tilesetOptions.loadOptions);
      this.sourceTileset = new Tileset3D(sourceTilesetJson, tilesetOptions);
      await this._createAndSaveTileset(outputPath, tilesetName, sourceTilesetJson === null || sourceTilesetJson === void 0 ? void 0 : (_sourceTilesetJson$ro = sourceTilesetJson.root) === null || _sourceTilesetJson$ro === void 0 ? void 0 : (_sourceTilesetJson$ro2 = _sourceTilesetJson$ro.boundingVolume) === null || _sourceTilesetJson$ro2 === void 0 ? void 0 : _sourceTilesetJson$ro2.region);
      await this._finishConversion({
        slpk: Boolean(slpk),
        outputPath,
        tilesetName
      });
      return sourceTilesetJson;
    } catch (error) {
      throw error;
    } finally {
      const workerFarm = WorkerFarm.getWorkerFarm({});
      workerFarm.destroy();
    }
  }
  async _createAndSaveTileset(outputPath, tilesetName, boundingVolumeRegion) {
    const tilesetPath = join("".concat(outputPath), "".concat(tilesetName));
    try {
      await removeDir(tilesetPath);
    } catch (e) {}
    this.layers0Path = join(tilesetPath, 'SceneServer', 'layers', '0');
    this._formLayers0(tilesetName, boundingVolumeRegion);
    this.materialDefinitions = [];
    this.materialMap = new Map();
    const sourceRootTile = this.sourceTileset.root;
    const boundingVolumes = createBoundingVolumes(sourceRootTile, this.geoidHeightModel);
    await this.nodePages.push({
      index: 0,
      lodThreshold: 0,
      obb: boundingVolumes.obb,
      children: []
    });
    const rootNode = await NodeIndexDocument.createRootNode(boundingVolumes, this);
    await this._convertNodesTree(rootNode, sourceRootTile);
    this.layers0.materialDefinitions = this.materialDefinitions;
    this.layers0.geometryDefinitions = transform(this.geometryConfigs.map(config => ({
      geometryConfig: {
        ...config,
        draco: this.options.draco
      }
    })), geometryDefinitionTemlate());
    if (this.layersHasTexture === false) {
      this.layers0.store.defaultGeometrySchema.ordering = this.layers0.store.defaultGeometrySchema.ordering.filter(attribute => attribute !== 'uv0');
    }
    await this._writeLayers0();
    createSceneServerPath(tilesetName, this.layers0, tilesetPath);
    for (const filePath of this.compressList || []) {
      await compressFileWithGzip(filePath);
      await removeFile(filePath);
    }
    await this.nodePages.save();
    await this.writeQueue.finalize();
    await this._createSlpk(tilesetPath);
  }
  _formLayers0(tilesetName, boundingVolumeRegion) {
    var _this$sourceTileset, _this$sourceTileset2, _this$sourceTileset2$;
    const fullExtent = convertBoundingVolumeToI3SFullExtent(((_this$sourceTileset = this.sourceTileset) === null || _this$sourceTileset === void 0 ? void 0 : _this$sourceTileset.boundingVolume) || ((_this$sourceTileset2 = this.sourceTileset) === null || _this$sourceTileset2 === void 0 ? void 0 : (_this$sourceTileset2$ = _this$sourceTileset2.root) === null || _this$sourceTileset2$ === void 0 ? void 0 : _this$sourceTileset2$.boundingVolume));
    if (boundingVolumeRegion) {
      fullExtent.zmin = boundingVolumeRegion[4];
      fullExtent.zmax = boundingVolumeRegion[5];
    }
    const extent = [fullExtent.xmin, fullExtent.ymin, fullExtent.xmax, fullExtent.ymax];
    const layers0data = {
      version: "{".concat(uuidv4().toUpperCase(), "}"),
      id: 0,
      name: tilesetName,
      href: './layers/0',
      store: {
        id: "{".concat(uuidv4().toUpperCase(), "}"),
        extent
      },
      nodePages: {
        nodesPerPage: HARDCODED_NODES_PER_PAGE
      },
      compressGeometry: this.options.draco,
      fullExtent
    };
    this.layers0 = transform(layers0data, layersTemplate());
  }
  async _convertNodesTree(rootNode, sourceRootTile) {
    await this.sourceTileset._loadTile(sourceRootTile);
    if (this.isContentSupported(sourceRootTile)) {
      const childNodes = await this._createNode(rootNode, sourceRootTile, 0);
      for (const childNode of childNodes) {
        await childNode.save();
      }
      await rootNode.addChildren(childNodes);
    } else {
      await this._addChildrenWithNeighborsAndWriteFile({
        parentNode: rootNode,
        sourceTiles: sourceRootTile.children,
        level: 1
      });
    }
    await sourceRootTile.unloadContent();
    await rootNode.save();
  }
  async _writeLayers0() {
    if (this.options.slpk) {
      await this.writeQueue.enqueue({
        archiveKey: '3dSceneLayer.json.gz',
        writePromise: () => writeFileForSlpk(this.layers0Path, JSON.stringify(this.layers0), '3dSceneLayer.json')
      });
    } else {
      await this.writeQueue.enqueue({
        writePromise: () => writeFile(this.layers0Path, JSON.stringify(this.layers0))
      });
    }
  }
  async _createSlpk(tilesetPath) {
    if (this.options.slpk) {
      const slpkTilesetPath = join(tilesetPath, 'SceneServer', 'layers', '0');
      const slpkFileName = "".concat(tilesetPath, ".slpk");
      await compressWithChildProcess(slpkTilesetPath, slpkFileName, 0, '.', this.options.sevenZipExe);
      try {
        await removeDir(tilesetPath);
      } catch (e) {}
    }
  }
  async _addChildrenWithNeighborsAndWriteFile(data) {
    await this._addChildren(data);
    await data.parentNode.addNeighbors();
  }
  async convertNestedTileset(_ref) {
    let {
      parentNode,
      sourceTile,
      level
    } = _ref;
    await this.sourceTileset._loadTile(sourceTile);
    await this._addChildren({
      parentNode,
      sourceTiles: sourceTile.children,
      level: level + 1
    });
    await sourceTile.unloadContent();
  }
  async convertNode(_ref2) {
    let {
      parentNode,
      sourceTile,
      level
    } = _ref2;
    const childNodes = await this._createNode(parentNode, sourceTile, level);
    await parentNode.addChildren(childNodes);
  }
  async _addChildren(data) {
    const {
      sourceTiles,
      parentNode,
      level
    } = data;
    if (this.options.maxDepth && level > this.options.maxDepth) {
      return;
    }
    for (const sourceTile of sourceTiles) {
      if (sourceTile.type === 'json') {
        await this.convertNestedTileset({
          parentNode,
          sourceTile,
          level
        });
      } else {
        await this.convertNode({
          parentNode,
          sourceTile,
          level
        });
      }
      if (sourceTile.id) {
        console.log(sourceTile.id);
      }
    }
  }
  async _createNode(parentNode, sourceTile, level) {
    var _this$layers, _this$layers$attribut;
    this._checkAddRefinementTypeForTile(sourceTile);
    await this._updateTilesetOptions();
    await this.sourceTileset._loadTile(sourceTile);
    let boundingVolumes = createBoundingVolumes(sourceTile, this.geoidHeightModel);
    const propertyTable = getPropertyTable(sourceTile.content);
    if (propertyTable && !((_this$layers = this.layers0) !== null && _this$layers !== void 0 && (_this$layers$attribut = _this$layers.attributeStorageInfo) !== null && _this$layers$attribut !== void 0 && _this$layers$attribut.length)) {
      this._convertPropertyTableToNodeAttributes(propertyTable);
    }
    const resourcesData = await this._convertResources(sourceTile, parentNode.inPageId, propertyTable);
    const nodes = [];
    const nodeIds = [];
    const nodesInPage = [];
    const emptyResources = {
      geometry: null,
      compressedGeometry: null,
      texture: null,
      hasUvRegions: false,
      sharedResources: null,
      meshMaterial: null,
      vertexCount: null,
      attributes: null,
      featureCount: null,
      boundingVolumes: null
    };
    for (const resources of resourcesData || [emptyResources]) {
      this.layersHasTexture = this.layersHasTexture || Boolean(resources.texture);
      if (this.generateBoundingVolumes && resources.boundingVolumes) {
        boundingVolumes = resources.boundingVolumes;
      }
      const lodSelection = convertGeometricErrorToScreenThreshold(sourceTile, boundingVolumes);
      const maxScreenThresholdSQ = lodSelection.find(val => val.metricType === 'maxScreenThresholdSQ') || {
        maxError: 0
      };
      const nodeInPage = await this._updateNodeInNodePages(maxScreenThresholdSQ, boundingVolumes, sourceTile, parentNode.inPageId, resources);
      const nodeData = await NodeIndexDocument.createNodeIndexDocument(parentNode, boundingVolumes, lodSelection, nodeInPage, resources);
      const node = await new NodeIndexDocument(nodeInPage.index, this).addData(nodeData);
      nodes.push(node);
      if (nodeInPage.mesh) {
        await this._writeResources(resources, node.id);
      }
      if (this.validate) {
        this.boundingVolumeWarnings = validateNodeBoundingVolumes(nodeData);
        if (this.boundingVolumeWarnings && this.boundingVolumeWarnings.length) {
          console.warn('Bounding Volume Warnings: ', ...this.boundingVolumeWarnings);
        }
      }
      nodeIds.push(nodeInPage.index);
      nodesInPage.push(nodeInPage);
    }
    sourceTile.unloadContent();
    await this._addChildrenWithNeighborsAndWriteFile({
      parentNode: nodes[0],
      sourceTiles: sourceTile.children,
      level: level + 1
    });
    return nodes;
  }
  async _convertResources(sourceTile, parentId, propertyTable) {
    var _this$layers2;
    if (!this.isContentSupported(sourceTile)) {
      return null;
    }
    const draftObb = {
      center: [],
      halfSize: [],
      quaternion: []
    };
    const resourcesData = await convertB3dmToI3sGeometry(sourceTile.content, async () => (await this.nodePages.push({
      index: 0,
      obb: draftObb
    }, parentId)).index, propertyTable, this.featuresHashArray, (_this$layers2 = this.layers0) === null || _this$layers2 === void 0 ? void 0 : _this$layers2.attributeStorageInfo, this.options.draco, this.generateBoundingVolumes, this.options.mergeMaterials, this.geoidHeightModel, this.workerSource);
    return resourcesData;
  }
  async _updateNodeInNodePages(maxScreenThresholdSQ, boundingVolumes, sourceTile, parentId, resources) {
    const {
      meshMaterial,
      texture,
      vertexCount,
      featureCount,
      geometry,
      hasUvRegions
    } = resources;
    const nodeInPage = {
      index: 0,
      lodThreshold: maxScreenThresholdSQ.maxError,
      obb: boundingVolumes.obb,
      children: []
    };
    if (geometry && this.isContentSupported(sourceTile)) {
      nodeInPage.mesh = {
        geometry: {
          definition: this.findOrCreateGeometryDefinition(Boolean(texture), hasUvRegions),
          resource: 0
        },
        attribute: {
          resource: 0
        },
        material: {
          definition: 0
        }
      };
    }
    let nodeId = resources.nodeId;
    let node;
    if (!nodeId) {
      node = await this.nodePages.push(nodeInPage, parentId);
    } else {
      node = await this.nodePages.getNodeById(nodeId);
    }
    NodePages.updateAll(node, nodeInPage);
    if (meshMaterial) {
      NodePages.updateMaterialByNodeId(node, this._findOrCreateMaterial(meshMaterial));
    }
    if (texture) {
      const texelCountHint = texture.image.height * texture.image.width;
      NodePages.updateTexelCountHintByNodeId(node, texelCountHint);
    }
    if (vertexCount) {
      this.vertexCounter += vertexCount;
      NodePages.updateVertexCountByNodeId(node, vertexCount);
    }
    NodePages.updateNodeAttributeByNodeId(node);
    if (featureCount) {
      NodePages.updateFeatureCountByNodeId(node, featureCount);
    }
    this.nodePages.saveNode(node);
    return node;
  }
  async _writeResources(resources, nodePath) {
    const {
      geometry: geometryBuffer,
      compressedGeometry,
      texture,
      sharedResources,
      attributes
    } = resources;
    const childPath = join(this.layers0Path, 'nodes', nodePath);
    const slpkChildPath = join('nodes', nodePath);
    await this._writeGeometries(geometryBuffer, compressedGeometry, childPath, slpkChildPath);
    await this._writeShared(sharedResources, childPath, slpkChildPath, nodePath);
    await this._writeTexture(texture, childPath, slpkChildPath);
    await this._writeAttributes(attributes, childPath, slpkChildPath);
  }
  async _writeGeometries(geometryBuffer, compressedGeometry, childPath, slpkChildPath) {
    if (this.options.slpk) {
      const slpkGeometryPath = join(childPath, 'geometries');
      await this.writeQueue.enqueue({
        archiveKey: "".concat(slpkChildPath, "/geometries/0.bin.gz"),
        writePromise: () => writeFileForSlpk(slpkGeometryPath, geometryBuffer, '0.bin')
      });
    } else {
      const geometryPath = join(childPath, 'geometries/0/');
      await this.writeQueue.enqueue({
        writePromise: () => writeFile(geometryPath, geometryBuffer, 'index.bin')
      });
    }
    if (this.options.draco) {
      if (this.options.slpk) {
        const slpkCompressedGeometryPath = join(childPath, 'geometries');
        await this.writeQueue.enqueue({
          archiveKey: "".concat(slpkChildPath, "/geometries/1.bin.gz"),
          writePromise: () => writeFileForSlpk(slpkCompressedGeometryPath, compressedGeometry, '1.bin')
        });
      } else {
        const compressedGeometryPath = join(childPath, 'geometries/1/');
        await this.writeQueue.enqueue({
          writePromise: () => writeFile(compressedGeometryPath, compressedGeometry, 'index.bin')
        });
      }
    }
  }
  async _writeShared(sharedResources, childPath, slpkChildPath, nodePath) {
    if (!sharedResources) {
      return;
    }
    sharedResources.nodePath = nodePath;
    const sharedData = transform(sharedResources, sharedResourcesTemplate());
    const sharedDataStr = JSON.stringify(sharedData);
    if (this.options.slpk) {
      const slpkSharedPath = join(childPath, 'shared');
      await this.writeQueue.enqueue({
        archiveKey: "".concat(slpkChildPath, "/shared/sharedResource.json.gz"),
        writePromise: () => writeFileForSlpk(slpkSharedPath, sharedDataStr, 'sharedResource.json')
      });
    } else {
      const sharedPath = join(childPath, 'shared/');
      await this.writeQueue.enqueue({
        writePromise: () => writeFile(sharedPath, sharedDataStr)
      });
    }
  }
  async _writeTexture(texture, childPath, slpkChildPath) {
    if (texture) {
      const format = this._getFormatByMimeType(texture === null || texture === void 0 ? void 0 : texture.mimeType);
      const formats = [];
      const textureData = texture.bufferView.data;
      switch (format) {
        case 'jpg':
        case 'png':
          {
            formats.push({
              name: '0',
              format
            });
            await this.writeTextureFile(textureData, '0', format, childPath, slpkChildPath);
            if (this.generateTextures) {
              formats.push({
                name: '1',
                format: 'ktx2'
              });
              const copyArrayBuffer = texture.image.data.subarray();
              const arrayToEncode = new Uint8Array(copyArrayBuffer);
              const ktx2TextureData = encode({
                ...texture.image,
                data: arrayToEncode
              }, KTX2BasisWriterWorker, {
                ...KTX2BasisWriterWorker.options,
                source: this.workerSource.ktx2,
                reuseWorkers: true,
                _nodeWorkers: true
              });
              await this.writeTextureFile(ktx2TextureData, '1', 'ktx2', childPath, slpkChildPath);
            }
            break;
          }
        case 'ktx2':
          {
            formats.push({
              name: '1',
              format
            });
            await this.writeTextureFile(textureData, '1', format, childPath, slpkChildPath);
            if (this.generateTextures) {
              formats.push({
                name: '0',
                format: 'jpg'
              });
              const decodedFromKTX2TextureData = encode(texture.image.data[0], ImageWriter);
              await this.writeTextureFile(decodedFromKTX2TextureData, '0', 'jpg', childPath, slpkChildPath);
            }
          }
      }
      if (!this.layers0.textureSetDefinitions.length) {
        this.layers0.textureSetDefinitions.push({
          formats
        });
        this.layers0.textureSetDefinitions.push({
          formats,
          atlas: true
        });
      }
    }
  }
  async writeTextureFile(textureData, name, format, childPath, slpkChildPath) {
    if (this.options.slpk) {
      const slpkTexturePath = join(childPath, 'textures');
      const compress = false;
      await this.writeQueue.enqueue({
        archiveKey: "".concat(slpkChildPath, "/textures/").concat(name, ".").concat(format),
        writePromise: () => writeFileForSlpk(slpkTexturePath, textureData, "".concat(name, ".").concat(format), compress)
      });
    } else {
      const texturePath = join(childPath, "textures/".concat(name, "/"));
      await this.writeQueue.enqueue({
        writePromise: () => writeFile(texturePath, textureData, "index.".concat(format))
      });
    }
  }
  async _writeAttributes() {
    var _this$layers3, _this$layers3$attribu;
    let attributes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    let childPath = arguments.length > 1 ? arguments[1] : undefined;
    let slpkChildPath = arguments.length > 2 ? arguments[2] : undefined;
    if (attributes !== null && attributes !== void 0 && attributes.length && (_this$layers3 = this.layers0) !== null && _this$layers3 !== void 0 && (_this$layers3$attribu = _this$layers3.attributeStorageInfo) !== null && _this$layers3$attribu !== void 0 && _this$layers3$attribu.length) {
      for (let index = 0; index < attributes.length; index++) {
        const folderName = this.layers0.attributeStorageInfo[index].key;
        const fileBuffer = new Uint8Array(attributes[index]);
        if (this.options.slpk) {
          const slpkAttributesPath = join(childPath, 'attributes', folderName);
          await this.writeQueue.enqueue({
            archiveKey: "".concat(slpkChildPath, "/attributes/").concat(folderName, ".bin.gz"),
            writePromise: () => writeFileForSlpk(slpkAttributesPath, fileBuffer, '0.bin')
          });
        } else {
          const attributesPath = join(childPath, "attributes/".concat(folderName, "/0"));
          await this.writeQueue.enqueue({
            writePromise: () => writeFile(attributesPath, fileBuffer, 'index.bin')
          });
        }
      }
    }
  }
  _getFormatByMimeType(mimeType) {
    switch (mimeType) {
      case 'image/jpeg':
        return 'jpg';
      case 'image/png':
        return 'png';
      case 'image/ktx2':
        return 'ktx2';
      default:
        return 'jpg';
    }
  }
  _findOrCreateMaterial(material) {
    const hash = md5(JSON.stringify(material));
    if (this.materialMap.has(hash)) {
      return this.materialMap.get(hash) || 0;
    }
    const newMaterialId = this.materialDefinitions.push(material) - 1;
    this.materialMap.set(hash, newMaterialId);
    return newMaterialId;
  }
  findOrCreateGeometryDefinition(hasTexture, hasUvRegions) {
    const geometryConfig = {
      hasTexture,
      hasUvRegions
    };
    const hash = md5(JSON.stringify(geometryConfig));
    if (this.geometryMap.has(hash)) {
      return this.geometryMap.get(hash) || 0;
    }
    const newGeometryId = this.geometryConfigs.push(geometryConfig) - 1;
    this.geometryMap.set(hash, newGeometryId);
    return newGeometryId;
  }
  _convertPropertyTableToNodeAttributes(propertyTable) {
    let attributeIndex = 0;
    const propertyTableWithObjectId = {
      OBJECTID: [0],
      ...propertyTable
    };
    for (const key in propertyTableWithObjectId) {
      const firstAttribute = propertyTableWithObjectId[key][0];
      const attributeType = getAttributeType(key, firstAttribute);
      const storageAttribute = createdStorageAttribute(attributeIndex, key, attributeType);
      const fieldAttributeType = getFieldAttributeType(attributeType);
      const fieldAttribute = createFieldAttribute(key, fieldAttributeType);
      const popupInfo = createPopupInfo(propertyTableWithObjectId);
      this.layers0.attributeStorageInfo.push(storageAttribute);
      this.layers0.fields.push(fieldAttribute);
      this.layers0.popupInfo = popupInfo;
      this.layers0.layerType = _3D_OBJECT_LAYER_TYPE;
      attributeIndex += 1;
    }
  }
  async _finishConversion(params) {
    const {
      tilesCount,
      tilesWithAddRefineCount
    } = this.refinementCounter;
    const addRefinementPercentage = tilesWithAddRefineCount ? tilesWithAddRefineCount / tilesCount * 100 : 0;
    const filesSize = await calculateFilesSize(params);
    const diff = process.hrtime(this.conversionStartTime);
    const conversionTime = timeConverter(diff);
    console.log("------------------------------------------------");
    console.log("Finishing conversion of ".concat(_3D_TILES));
    console.log("Total conversion time: ".concat(conversionTime));
    console.log("Vertex count: ", this.vertexCounter);
    console.log("File(s) size: ", filesSize, ' bytes');
    console.log("Percentage of tiles with \"ADD\" refinement type:", addRefinementPercentage, '%');
    console.log("------------------------------------------------");
  }
  async _fetchPreloadOptions() {
    if (!this.Loader.preload) {
      return {};
    }
    const options = {
      'cesium-ion': {
        accessToken: this.options.token || ION_DEFAULT_TOKEN
      }
    };
    const preloadOptions = await this.Loader.preload(this.options.inputUrl, options);
    this.refreshTokenTime = process.hrtime();
    return {
      ...options,
      ...preloadOptions
    };
  }
  async _updateTilesetOptions() {
    const diff = process.hrtime(this.refreshTokenTime);
    if (diff[0] < REFRESH_TOKEN_TIMEOUT) {
      return;
    }
    this.refreshTokenTime = process.hrtime();
    const preloadOptions = await this._fetchPreloadOptions();
    this.sourceTileset.options = {
      ...this.sourceTileset.options,
      ...preloadOptions
    };
    if (preloadOptions.headers) {
      this.sourceTileset.loadOptions.fetch = {
        ...this.sourceTileset.loadOptions.fetch,
        headers: preloadOptions.headers
      };
      console.log('Authorization Bearer token has been updated');
    }
  }
  _checkAddRefinementTypeForTile(tile) {
    const ADD_TILE_REFINEMENT = 1;
    if (tile.refine === ADD_TILE_REFINEMENT) {
      this.refinementCounter.tilesWithAddRefineCount += 1;
      console.warn('This tile uses "ADD" type of refinement');
    }
    this.refinementCounter.tilesCount += 1;
  }
  isContentSupported(sourceRootTile) {
    var _sourceRootTile$conte;
    return ['b3dm', 'glTF'].includes(sourceRootTile === null || sourceRootTile === void 0 ? void 0 : (_sourceRootTile$conte = sourceRootTile.content) === null || _sourceRootTile$conte === void 0 ? void 0 : _sourceRootTile$conte.type);
  }
  async loadWorkers() {
    console.log("Loading workers source...");
    if (this.options.draco) {
      const url = getWorkerURL(DracoWriterWorker, {
        ...getLoaderOptions()
      });
      const sourceResponse = await fetchFile(url);
      const source = await sourceResponse.text();
      this.workerSource.draco = source;
    }
    if (this.generateTextures) {
      const url = getWorkerURL(KTX2BasisWriterWorker, {
        ...getLoaderOptions()
      });
      const sourceResponse = await fetchFile(url);
      const source = await sourceResponse.text();
      this.workerSource.ktx2 = source;
    }
    const i3sAttributesWorkerUrl = getWorkerURL(I3SAttributesWorker, {
      ...getLoaderOptions()
    });
    const sourceResponse = await fetchFile(i3sAttributesWorkerUrl);
    const source = await sourceResponse.text();
    this.workerSource.I3SAttributes = source;
    console.log("Loading workers source completed!");
  }
}
//# sourceMappingURL=i3s-converter.js.map