export function getOmeLegacyIndexer(tiff, rootMeta) {
  const imgMeta = rootMeta[0];
  const {
    SizeT,
    SizeC,
    SizeZ
  } = imgMeta.Pixels;
  const ifdIndexer = getOmeIFDIndexer(imgMeta);
  return (sel, pyramidLevel) => {
    const index = ifdIndexer(sel);
    const pyramidIndex = pyramidLevel * SizeZ * SizeT * SizeC;
    return tiff.getImage(index + pyramidIndex);
  };
}
export function getOmeSubIFDIndexer(tiff, rootMeta) {
  const imgMeta = rootMeta[0];
  const ifdIndexer = getOmeIFDIndexer(imgMeta);
  const ifdCache = new Map();
  return async (sel, pyramidLevel) => {
    const index = ifdIndexer(sel);
    const baseImage = await tiff.getImage(index);
    if (pyramidLevel === 0) {
      return baseImage;
    }
    const {
      SubIFDs
    } = baseImage.fileDirectory;
    if (!SubIFDs) {
      throw Error('Indexing Error: OME-TIFF is missing SubIFDs.');
    }
    const key = "".concat(sel.t, "-").concat(sel.c, "-").concat(sel.z, "-").concat(pyramidLevel);
    if (!ifdCache.has(key)) {
      const subIfdOffset = SubIFDs[pyramidLevel - 1];
      ifdCache.set(key, tiff.parseFileDirectoryAt(subIfdOffset));
    }
    const ifd = await ifdCache.get(key);
    return new baseImage.constructor(ifd.fileDirectory, ifd.geoKeyDirectory, tiff.dataView, tiff.littleEndian, tiff.cache, tiff.source);
  };
}
function getOmeIFDIndexer(imgMeta) {
  const {
    SizeC,
    SizeZ,
    SizeT,
    DimensionOrder
  } = imgMeta.Pixels;
  switch (DimensionOrder) {
    case 'XYZCT':
      {
        return _ref => {
          let {
            t,
            c,
            z
          } = _ref;
          return t * SizeZ * SizeC + c * SizeZ + z;
        };
      }
    case 'XYZTC':
      {
        return _ref2 => {
          let {
            t,
            c,
            z
          } = _ref2;
          return c * SizeZ * SizeT + t * SizeZ + z;
        };
      }
    case 'XYCTZ':
      {
        return _ref3 => {
          let {
            t,
            c,
            z
          } = _ref3;
          return z * SizeC * SizeT + t * SizeC + c;
        };
      }
    case 'XYCZT':
      {
        return _ref4 => {
          let {
            t,
            c,
            z
          } = _ref4;
          return t * SizeC * SizeZ + z * SizeC + c;
        };
      }
    case 'XYTCZ':
      {
        return _ref5 => {
          let {
            t,
            c,
            z
          } = _ref5;
          return z * SizeT * SizeC + c * SizeT + t;
        };
      }
    case 'XYTZC':
      {
        return _ref6 => {
          let {
            t,
            c,
            z
          } = _ref6;
          return c * SizeT * SizeZ + z * SizeT + t;
        };
      }
    default:
      {
        throw new Error("Invalid OME-XML DimensionOrder, got ".concat(DimensionOrder, "."));
      }
  }
}
//# sourceMappingURL=ome-indexers.js.map