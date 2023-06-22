"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DTYPE_LOOKUP = void 0;
exports.getOmePixelSourceMeta = getOmePixelSourceMeta;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _utils = require("./utils");
var DTYPE_LOOKUP = {
  uint8: 'Uint8',
  uint16: 'Uint16',
  uint32: 'Uint32',
  float: 'Float32',
  double: 'Float64',
  int8: 'Int8',
  int16: 'Int16',
  int32: 'Int32'
};
exports.DTYPE_LOOKUP = DTYPE_LOOKUP;
function getOmePixelSourceMeta(_ref) {
  var Pixels = _ref.Pixels;
  var labels = (0, _utils.getLabels)(Pixels.DimensionOrder);
  var dims = (0, _utils.getDims)(labels);
  var shape = Array(labels.length).fill(0);
  shape[dims('t')] = Pixels.SizeT;
  shape[dims('c')] = Pixels.SizeC;
  shape[dims('z')] = Pixels.SizeZ;
  if (Pixels.Interleaved) {
    labels.push('_c');
    shape.push(3);
  }
  var getShape = function getShape(level) {
    var s = (0, _toConsumableArray2.default)(shape);
    s[dims('x')] = Pixels.SizeX >> level;
    s[dims('y')] = Pixels.SizeY >> level;
    return s;
  };
  if (!(Pixels.Type in DTYPE_LOOKUP)) {
    throw Error("Pixel type ".concat(Pixels.Type, " not supported."));
  }
  var dtype = DTYPE_LOOKUP[Pixels.Type];
  if (Pixels.PhysicalSizeX && Pixels.PhysicalSizeY) {
    var physicalSizes = {
      x: {
        size: Pixels.PhysicalSizeX,
        unit: Pixels.PhysicalSizeXUnit
      },
      y: {
        size: Pixels.PhysicalSizeY,
        unit: Pixels.PhysicalSizeYUnit
      }
    };
    if (Pixels.PhysicalSizeZ) {
      physicalSizes.z = {
        size: Pixels.PhysicalSizeZ,
        unit: Pixels.PhysicalSizeZUnit
      };
    }
    return {
      labels: labels,
      getShape: getShape,
      physicalSizes: physicalSizes,
      dtype: dtype
    };
  }
  return {
    labels: labels,
    getShape: getShape,
    dtype: dtype
  };
}
//# sourceMappingURL=ome-utils.js.map