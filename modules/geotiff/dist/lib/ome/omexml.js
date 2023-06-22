"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromString = void 0;
const fast_xml_parser_1 = __importDefault(require("fast-xml-parser"));
const tiff_utils_1 = require("../utils/tiff-utils");
// WARNING: Changes to the parser options _will_ effect the types in types/omexml.d.ts.
const PARSER_OPTIONS = {
    // Nests attributes withtout prefix under 'attr' key for each node
    attributeNamePrefix: '',
    attrNodeName: 'attr',
    // Parses numbers for both attributes and nodes
    parseNodeValue: true,
    parseAttributeValue: true,
    // Forces attributes to be parsed
    ignoreAttributes: false
};
const parse = (str) => fast_xml_parser_1.default.parse(str, PARSER_OPTIONS);
function fromString(str) {
    const res = parse(str);
    if (!res.OME) {
        throw Error('Failed to parse OME-XML metadata.');
    }
    return (0, tiff_utils_1.ensureArray)(res.OME.Image).map((img) => {
        const Channels = (0, tiff_utils_1.ensureArray)(img.Pixels.Channel).map((c) => {
            if ('Color' in c.attr) {
                return { ...c.attr, Color: (0, tiff_utils_1.intToRgba)(c.attr.Color) };
            }
            return { ...c.attr };
        });
        const { AquisitionDate = '', Description = '' } = img;
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
                const { Pixels } = image;
                const sizes = ['X', 'Y', 'Z']
                    .map((name) => {
                    const size = Pixels[`PhysicalSize${name}`];
                    const unit = Pixels[`PhysicalSize${name}Unit`];
                    return size && unit ? `${size} ${unit}` : '-';
                })
                    .join(' x ');
                return {
                    'Acquisition Date': image.AquisitionDate,
                    'Dimensions (XY)': `${Pixels.SizeX} x ${Pixels.SizeY}`,
                    'Pixels Type': Pixels.Type,
                    'Pixels Size (XYZ)': sizes,
                    'Z-sections/Timepoints': `${Pixels.SizeZ} x ${Pixels.SizeT}`,
                    Channels: Pixels.SizeC
                };
            }
        };
    });
}
exports.fromString = fromString;
