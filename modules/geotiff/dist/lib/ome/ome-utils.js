"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOmePixelSourceMeta = exports.DTYPE_LOOKUP = void 0;
const utils_1 = require("./utils");
exports.DTYPE_LOOKUP = {
    uint8: 'Uint8',
    uint16: 'Uint16',
    uint32: 'Uint32',
    float: 'Float32',
    double: 'Float64',
    int8: 'Int8',
    int16: 'Int16',
    int32: 'Int32'
};
function getOmePixelSourceMeta({ Pixels }) {
    // e.g. 'XYZCT' -> ['t', 'c', 'z', 'y', 'x']
    const labels = (0, utils_1.getLabels)(Pixels.DimensionOrder);
    // Compute "shape" of image
    const dims = (0, utils_1.getDims)(labels);
    const shape = Array(labels.length).fill(0);
    shape[dims('t')] = Pixels.SizeT;
    shape[dims('c')] = Pixels.SizeC;
    shape[dims('z')] = Pixels.SizeZ;
    // Push extra dimension if data are interleaved.
    if (Pixels.Interleaved) {
        // @ts-ignore
        labels.push('_c');
        shape.push(3);
    }
    // Creates a new shape for different level of pyramid.
    // Assumes factor-of-two downsampling.
    const getShape = (level) => {
        const s = [...shape];
        s[dims('x')] = Pixels.SizeX >> level;
        s[dims('y')] = Pixels.SizeY >> level;
        return s;
    };
    if (!(Pixels.Type in exports.DTYPE_LOOKUP)) {
        throw Error(`Pixel type ${Pixels.Type} not supported.`);
    }
    const dtype = exports.DTYPE_LOOKUP[Pixels.Type];
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
        return { labels, getShape, physicalSizes, dtype };
    }
    return { labels, getShape, dtype };
}
exports.getOmePixelSourceMeta = getOmePixelSourceMeta;
