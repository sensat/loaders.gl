import TiffPixelSource from '../tiff-pixel-source';
import { getOmeLegacyIndexer, getOmeSubIFDIndexer } from './ome-indexers';
import { getOmePixelSourceMeta } from './ome-utils';
import { fromString } from './omexml';
export const isOmeTiff = img => img.fileDirectory.ImageDescription.includes('<OME');
export async function loadOmeTiff(tiff, firstImage) {
  const {
    ImageDescription,
    SubIFDs,
    PhotometricInterpretation: photometricInterpretation
  } = firstImage.fileDirectory;
  const omexml = fromString(ImageDescription);
  let levels;
  let pyramidIndexer;
  if (SubIFDs) {
    levels = SubIFDs.length + 1;
    pyramidIndexer = getOmeSubIFDIndexer(tiff, omexml);
  } else {
    levels = omexml.length;
    pyramidIndexer = getOmeLegacyIndexer(tiff, omexml);
  }
  const imgMeta = omexml[0];
  const {
    labels,
    getShape,
    physicalSizes,
    dtype
  } = getOmePixelSourceMeta(imgMeta);
  const tileSize = firstImage.getTileWidth();
  const meta = {
    photometricInterpretation,
    physicalSizes
  };
  const data = Array.from({
    length: levels
  }).map((_, resolution) => {
    const shape = getShape(resolution);
    const indexer = sel => pyramidIndexer(sel, resolution);
    const source = new TiffPixelSource(indexer, dtype, tileSize, shape, labels, meta);
    return source;
  });
  return {
    data,
    metadata: imgMeta
  };
}
//# sourceMappingURL=load-ome-tiff.js.map