import parser from 'fast-xml-parser';
import { ensureArray, intToRgba } from '../utils/tiff-utils';
const PARSER_OPTIONS = {
  attributeNamePrefix: '',
  attrNodeName: 'attr',
  parseNodeValue: true,
  parseAttributeValue: true,
  ignoreAttributes: false
};
const parse = str => parser.parse(str, PARSER_OPTIONS);
export function fromString(str) {
  const res = parse(str);
  if (!res.OME) {
    throw Error('Failed to parse OME-XML metadata.');
  }
  return ensureArray(res.OME.Image).map(img => {
    const Channels = ensureArray(img.Pixels.Channel).map(c => {
      if ('Color' in c.attr) {
        return {
          ...c.attr,
          Color: intToRgba(c.attr.Color)
        };
      }
      return {
        ...c.attr
      };
    });
    const {
      AquisitionDate = '',
      Description = ''
    } = img;
    const image = {
      ...img.attr,
      AquisitionDate,
      Description,
      Pixels: {
        ...img.Pixels.attr,
        Channels
      }
    };
    return {
      ...image,
      format() {
        const {
          Pixels
        } = image;
        const sizes = ['X', 'Y', 'Z'].map(name => {
          const size = Pixels["PhysicalSize".concat(name)];
          const unit = Pixels["PhysicalSize".concat(name, "Unit")];
          return size && unit ? "".concat(size, " ").concat(unit) : '-';
        }).join(' x ');
        return {
          'Acquisition Date': image.AquisitionDate,
          'Dimensions (XY)': "".concat(Pixels.SizeX, " x ").concat(Pixels.SizeY),
          'Pixels Type': Pixels.Type,
          'Pixels Size (XYZ)': sizes,
          'Z-sections/Timepoints': "".concat(Pixels.SizeZ, " x ").concat(Pixels.SizeT),
          Channels: Pixels.SizeC
        };
      }
    };
  });
}
//# sourceMappingURL=omexml.js.map