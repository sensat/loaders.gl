"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PointCloudOctree = exports.PointCloudOctant = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var PointCloudOctree = (0, _createClass2.default)(function PointCloudOctree() {
  (0, _classCallCheck2.default)(this, PointCloudOctree);
  this.url = null;
  this.octreeDir = null;
  this.spacing = 0;
  this.boundingBox = null;
  this.root = null;
  this.nodes = null;
  this.pointAttributes = null;
  this.hierarchyStepSize = -1;
  this.loader = null;
});
exports.PointCloudOctree = PointCloudOctree;
var PointCloudOctant = function () {
  function PointCloudOctant(name, octree, boundingBox) {
    (0, _classCallCheck2.default)(this, PointCloudOctant);
    this.octree = this.id = PointCloudOctreeGeometryNode.IDCount++;
    this.name = name;
    this.index = parseInt(name.charAt(name.length - 1));
    this.octree = octree;
    this.geometry = null;
    this.boundingBox = boundingBox;
    this.boundingSphere = boundingBox.getBoundingSphere(new THREE.Sphere());
    this.children = {};
    this.numPoints = 0;
    this.level = null;
    this.loaded = false;
    this.oneTimeDisposeHandlers = [];
  }
  (0, _createClass2.default)(PointCloudOctant, [{
    key: "isGeometryNode",
    value: function isGeometryNode() {
      return true;
    }
  }, {
    key: "getLevel",
    value: function getLevel() {
      return this.level;
    }
  }, {
    key: "isTreeNode",
    value: function isTreeNode() {
      return false;
    }
  }, {
    key: "isLoaded",
    value: function isLoaded() {
      return this.loaded;
    }
  }, {
    key: "getBoundingSphere",
    value: function getBoundingSphere() {
      return this.boundingSphere;
    }
  }, {
    key: "getBoundingBox",
    value: function getBoundingBox() {
      return this.boundingBox;
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      return this.children.filter(Boolean);
    }
  }, {
    key: "getURL",
    value: function getURL() {
      var version = this.octree.version;
      var hierarchyPath = version >= 1.5 ? "".concat(this.getHierarchyPath(), "/") : '';
      return "".concat(this.octree.octreeDir, "/").concat(hierarchyPath).concat(this.name);
    }
  }, {
    key: "getHierarchyPath",
    value: function getHierarchyPath() {
      var path = 'r/';
      var hierarchyStepSize = this.octree.hierarchyStepSize;
      var indices = this.name.substr(1);
      var numParts = Math.floor(indices.length / hierarchyStepSize);
      for (var i = 0; i < numParts; i++) {
        path += indices.substr(i * hierarchyStepSize, hierarchyStepSize) + '/';
      }
      path = path.slice(0, -1);
      return path;
    }
  }, {
    key: "addChild",
    value: function addChild(child) {
      this.children[child.index] = child;
      child.parent = this;
    }
  }, {
    key: "load",
    value: function load() {
      if (this.loading === true || this.loaded === true || Potree.numNodesLoading >= Potree.maxNodesLoading) {
        return;
      }
      this.loading = true;
      Potree.numNodesLoading++;
      if (this.octree.loader.version.equalOrHigher('1.5')) {
        if (this.level % this.octree.hierarchyStepSize === 0 && this.hasChildren) {
          this.loadHierachyThenPoints();
        } else {
          this.loadPoints();
        }
      } else {
        this.loadPoints();
      }
    }
  }, {
    key: "loadPoints",
    value: function loadPoints() {
      this.octree.loader.load(this);
    }
  }, {
    key: "loadHierachyThenPoints",
    value: function loadHierachyThenPoints() {
      var node = this;
      var callback = function callback(node, hbuffer) {
        var view = new DataView(hbuffer);
        var stack = [];
        var children = view.getUint8(0);
        var numPoints = view.getUint32(1, true);
        node.numPoints = numPoints;
        stack.push({
          children: children,
          numPoints: numPoints,
          name: node.name
        });
        var decoded = [];
        var offset = 5;
        while (stack.length > 0) {
          var snode = stack.shift();
          var mask = 1;
          for (var i = 0; i < 8; i++) {
            if ((snode.children & mask) !== 0) {
              var childName = snode.name + i;
              var childChildren = view.getUint8(offset);
              var childNumPoints = view.getUint32(offset + 1, true);
              stack.push({
                children: childChildren,
                numPoints: childNumPoints,
                name: childName
              });
              decoded.push({
                children: childChildren,
                numPoints: childNumPoints,
                name: childName
              });
              offset += 5;
            }
            mask = mask * 2;
          }
          if (offset === hbuffer.byteLength) {
            break;
          }
        }
        var nodes = {};
        nodes[node.name] = node;
        var pco = node.pcoGeometry;
        for (var _i = 0; _i < decoded.length; _i++) {
          var name = decoded[_i].name;
          var decodedNumPoints = decoded[_i].numPoints;
          var index = parseInt(name.charAt(name.length - 1));
          var parentName = name.substring(0, name.length - 1);
          var parentNode = nodes[parentName];
          var level = name.length - 1;
          var boundingBox = Utils.createChildAABB(parentNode.boundingBox, index);
          var currentNode = new PointCloudOctreeGeometryNode(name, pco, boundingBox);
          currentNode.level = level;
          currentNode.numPoints = decodedNumPoints;
          currentNode.hasChildren = decoded[_i].children > 0;
          currentNode.spacing = pco.spacing / Math.pow(2, level);
          parentNode.addChild(currentNode);
          nodes[name] = currentNode;
        }
        node.loadPoints();
      };
      if (node.level % node.pcoGeometry.hierarchyStepSize === 0) {
        var hurl = node.pcoGeometry.octreeDir + '/' + node.getHierarchyPath() + '/' + node.name + '.hrc';
        var xhr = XHRFactory.createXMLHttpRequest();
        xhr.open('GET', hurl, true);
        xhr.responseType = 'arraybuffer';
        xhr.overrideMimeType('text/plain; charset=x-user-defined');
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) {
              var hbuffer = xhr.response;
              callback(node, hbuffer);
            } else {
              console.log('Failed to load file! HTTP status: ' + xhr.status + ', file: ' + hurl);
              Potree.numNodesLoading--;
            }
          }
        };
        try {
          xhr.send(null);
        } catch (e) {
          console.log('fehler beim laden der punktwolke: ' + e);
        }
      }
    }
  }, {
    key: "getNumPoints",
    value: function getNumPoints() {
      return this.numPoints;
    }
  }, {
    key: "dispose",
    value: function dispose() {
      if (this.geometry && this.parent != null) {
        this.geometry.dispose();
        this.geometry = null;
        this.loaded = false;
        for (var i = 0; i < this.oneTimeDisposeHandlers.length; i++) {
          var handler = this.oneTimeDisposeHandlers[i];
          handler();
        }
        this.oneTimeDisposeHandlers = [];
      }
    }
  }]);
  return PointCloudOctant;
}();
exports.PointCloudOctant = PointCloudOctant;
PointCloudOctreeGeometryNode.IDCount = 0;
//# sourceMappingURL=octree.js.map