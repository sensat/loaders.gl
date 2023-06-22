import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { join } from 'path';
import transform from 'json-map-transform';
import { v4 as uuidv4 } from 'uuid';
import { openJson, writeFile, writeFileForSlpk } from '../../lib/utils/file-utils';
import { NODE as nodeTemplate } from '../json-templates/node';
export class NodeIndexDocument {
  constructor(id, converter) {
    _defineProperty(this, "id", void 0);
    _defineProperty(this, "inPageId", void 0);
    _defineProperty(this, "data", null);
    _defineProperty(this, "children", []);
    _defineProperty(this, "converter", void 0);
    this.inPageId = id;
    this.id = id === 0 ? 'root' : id.toString();
    this.converter = converter;
  }
  async addData(data) {
    if (this.converter.options.instantNodeWriting) {
      await this.write(data);
    } else {
      this.data = data;
    }
    return this;
  }
  async addChildren(childNodes) {
    const newChildren = [];
    for (const node of childNodes) {
      const nodeData = await node.load();
      newChildren.push({
        id: node.id,
        href: "../".concat(node.id),
        obb: nodeData.obb,
        mbs: nodeData.mbs
      });
    }
    this.children = this.children.concat(childNodes);
    let data = this.data;
    if (this.converter.options.instantNodeWriting) {
      data = await this.load();
    }
    if (data) {
      var _data$children;
      data.children = (_data$children = data.children) !== null && _data$children !== void 0 ? _data$children : [];
      data.children = data.children.concat(newChildren);
    }
    if (this.converter.options.instantNodeWriting && data) {
      await this.write(data);
    }
  }
  async addNeighbors() {
    const nodeData = await this.load();
    for (const childNode of this.children) {
      var _childNodeData$neighb, _nodeData$children;
      const childNodeData = await childNode.load();
      childNodeData.neighbors = (_childNodeData$neighb = childNodeData.neighbors) !== null && _childNodeData$neighb !== void 0 ? _childNodeData$neighb : [];
      if (Number(nodeData === null || nodeData === void 0 ? void 0 : (_nodeData$children = nodeData.children) === null || _nodeData$children === void 0 ? void 0 : _nodeData$children.length) < 1000) {
        for (const neighbor of nodeData.children || []) {
          if (childNode.id === neighbor.id) {
            continue;
          }
          childNodeData.neighbors.push({
            ...neighbor
          });
        }
      } else {
        console.warn("Node ".concat(childNode.id, ": neighbors attribute is omited because of large number of neigbors"));
        delete childNodeData.neighbors;
      }
      if (this.converter.options.instantNodeWriting && childNodeData) {
        await childNode.write(childNodeData);
      }
      await childNode.save();
      childNode.flush();
    }
  }
  async save() {
    if (this.data) {
      await this.write(this.data);
    }
  }
  async write(node) {
    const path = join(this.converter.layers0Path, 'nodes', this.id);
    if (this.converter.options.slpk) {
      await this.converter.writeQueue.enqueue({
        archiveKey: "nodes/".concat(this.id, "/3dNodeIndexDocument.json.gz"),
        writePromise: () => writeFileForSlpk(path, JSON.stringify(node), '3dNodeIndexDocument.json', true, this.converter.compressList)
      }, true);
    } else {
      await this.converter.writeQueue.enqueue({
        writePromise: () => writeFile(path, JSON.stringify(node))
      }, true);
    }
  }
  async load() {
    if (this.data) {
      return this.data;
    }
    const path = this.id;
    const parentNodePath = join(this.converter.layers0Path, 'nodes', path);
    let parentNodeFileName = 'index.json';
    if (this.converter.options.slpk) {
      parentNodeFileName = '3dNodeIndexDocument.json';
    }
    return await openJson(parentNodePath, parentNodeFileName);
  }
  flush() {
    this.data = null;
  }
  static async createRootNode(boundingVolumes, converter) {
    const rootData = NodeIndexDocument.createRootNodeIndexDocument(boundingVolumes);
    const rootNode = await new NodeIndexDocument(0, converter).addData(rootData);
    return rootNode;
  }
  static async createNode(parentNode, boundingVolumes, lodSelection, nodeInPage, resources, converter) {
    const data = await NodeIndexDocument.createNodeIndexDocument(parentNode, boundingVolumes, lodSelection, nodeInPage, resources);
    const node = await new NodeIndexDocument(nodeInPage.index, converter).addData(data);
    return node;
  }
  static createRootNodeIndexDocument(boundingVolumes) {
    const root0data = {
      version: "{".concat(uuidv4().toUpperCase(), "}"),
      id: 'root',
      level: 0,
      lodSelection: [{
        metricType: 'maxScreenThresholdSQ',
        maxError: 0
      }, {
        metricType: 'maxScreenThreshold',
        maxError: 0
      }],
      ...boundingVolumes,
      children: []
    };
    return transform(root0data, nodeTemplate());
  }
  static async createNodeIndexDocument(parentNode, boundingVolumes, lodSelection, nodeInPage, resources) {
    const {
      texture,
      attributes
    } = resources;
    const nodeId = nodeInPage.index;
    const parentNodeData = await parentNode.load();
    const nodeData = {
      version: parentNodeData.version,
      id: nodeId.toString(),
      level: parentNodeData.level + 1,
      ...boundingVolumes,
      lodSelection,
      parentNode: {
        id: parentNode.id,
        href: "../".concat(parentNode.id),
        mbs: parentNodeData.mbs,
        obb: parentNodeData.obb
      },
      children: [],
      neighbors: []
    };
    const node = transform(nodeData, nodeTemplate());
    if (nodeInPage.mesh) {
      var _parentNode$converter, _parentNode$converter2;
      node.geometryData = [{
        href: './geometries/0'
      }];
      node.sharedResource = {
        href: './shared'
      };
      if (texture) {
        node.textureData = [{
          href: './textures/0'
        }, {
          href: './textures/1'
        }];
      }
      if (attributes && attributes.length && (_parentNode$converter = parentNode.converter.layers0) !== null && _parentNode$converter !== void 0 && (_parentNode$converter2 = _parentNode$converter.attributeStorageInfo) !== null && _parentNode$converter2 !== void 0 && _parentNode$converter2.length) {
        node.attributeData = [];
        for (let index = 0; index < attributes.length; index++) {
          const folderName = parentNode.converter.layers0.attributeStorageInfo[index].key;
          node.attributeData.push({
            href: "./attributes/".concat(folderName, "/0")
          });
        }
      }
    }
    return node;
  }
}
//# sourceMappingURL=node-index-document.js.map