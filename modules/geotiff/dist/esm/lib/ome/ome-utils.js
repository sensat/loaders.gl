import { getDims, getLabels } from './utils';
export const DTYPE_LOOKUP = {
  uint8: 'Uint8',
  uint16: 'Uint16',
  uint32: 'Uint32',
  float: 'Float32',
  double: 'Float64',
  int8: 'Int8',
  int16: 'Int16',
  int32: 'Int32'
};
export function getOmePixelSourceMeta(_ref) {
  let {
    Pixels
  } = _ref;
  const labels = getLabels(Pixels.DimensionOrder);
  const dims = getDims(labels);
  const shape = Array(labels.length).fill(0);
  shape[dims('t')] = Pixels.SizeT;
  shape[dims('c')] = Pixels.SizeC;
  shape[dims('z')] = Pixels.SizeZ;
  if (Pixels.Interleaved) {
    labels.push('_c');
    shape.push(3);
  }
  const getShape = level => {
    const s = [...shape];
    s[dims('x')] = Pixels.SizeX >> level;
    s[dims('y')] = Pixels.SizeY >> level;
    return s;
  };
  if (!(Pixels.Type in DTYPE_LOOKUP)) {
    throw Error("Pixel type ".concat(Pixels.Type, " not supported."));
  }
  const dtype = DTYPE_LOOKUP[Pixels.Type];
  if (Pixels.PhysicalSizeX && Pixels.PhysicalSizeY) {
    const physicalSizes = {
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
      labels,
      getShape,
      physicalSizes,
      dtype
    };
  }
  return {
    labels,
    getShape,
    dtype
  };
}
//# sourceMappingURL=ome-utils.js.map