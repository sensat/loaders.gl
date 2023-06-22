"use strict";
// PLY Loader, adapted from THREE.js (MIT license)
//
// Attributions per original THREE.js source file:
//
// @author Wei Meng / http://about.me/menway
//
// Description: A loader for PLY ASCII files (known as the Polygon File Format
// or the Stanford Triangle Format).
//
// Limitations: ASCII decoding assumes file is UTF-8.
//
// If the PLY file uses non standard property names, they can be mapped while
// loading. For example, the following maps the properties
// “diffuse_(red|green|blue)” in the file to standard color names.
//
// parsePLY(data, {
//   propertyNameMapping: {
//     diffuse_red: 'red',
//     diffuse_green: 'green',
//     diffuse_blue: 'blue'
//   }
// });
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePLYInBatches = void 0;
const loader_utils_1 = require("@loaders.gl/loader-utils");
const normalize_ply_1 = __importDefault(require("./normalize-ply"));
let currentElement;
/**
 * PARSER
 * @param iterator
 * @param options
 */
async function* parsePLYInBatches(iterator, options) {
    const lineIterator = (0, loader_utils_1.makeLineIterator)((0, loader_utils_1.makeTextDecoderIterator)(iterator));
    const header = await parsePLYHeader(lineIterator, options);
    let attributes;
    switch (header.format) {
        case 'ascii':
            attributes = await parseASCII(lineIterator, header);
            break;
        default:
            throw new Error('Binary PLY can not yet be parsed in streaming mode');
        // attributes = await parseBinary(lineIterator, header);
    }
    yield (0, normalize_ply_1.default)(header, attributes, options);
}
exports.parsePLYInBatches = parsePLYInBatches;
/**
 * Parses header
 * @param lineIterator
 * @param options
 * @returns
 */
async function parsePLYHeader(lineIterator, options) {
    const header = {
        comments: [],
        elements: []
        // headerLength
    };
    // Note: forEach does not reset iterator if exiting loop prematurely
    // so that iteration can continue in a second loop
    await (0, loader_utils_1.forEach)(lineIterator, (line) => {
        line = line.trim();
        // End of header
        if (line === 'end_header') {
            return true; // Returning true cancels `forEach`
        }
        // Ignore empty lines
        if (line === '') {
            // eslint-disable-next-line
            return false; // Returning false does not cancel `forEach`
        }
        const lineValues = line.split(/\s+/);
        const lineType = lineValues.shift();
        line = lineValues.join(' ');
        switch (lineType) {
            case 'ply':
                // First line magic characters, ignore
                break;
            case 'format':
                header.format = lineValues[0];
                header.version = lineValues[1];
                break;
            case 'comment':
                header.comments.push(line);
                break;
            case 'element':
                if (currentElement) {
                    header.elements.push(currentElement);
                }
                currentElement = {
                    name: lineValues[0],
                    count: parseInt(lineValues[1], 10),
                    properties: []
                };
                break;
            case 'property':
                const property = makePLYElementProperty(lineValues, options.propertyNameMapping);
                currentElement.properties.push(property);
                break;
            default:
                // eslint-disable-next-line
                console.log('unhandled', lineType, lineValues);
        }
        return false;
    });
    if (currentElement) {
        header.elements.push(currentElement);
    }
    return header;
}
function makePLYElementProperty(propertyValues, propertyNameMapping) {
    const type = propertyValues[0];
    switch (type) {
        case 'list':
            return {
                type,
                name: propertyValues[3],
                countType: propertyValues[1],
                itemType: propertyValues[2]
            };
        default:
            return {
                type,
                name: propertyValues[1]
            };
    }
}
// ASCII PARSING
/**
 * @param lineIterator
 * @param header
 * @returns
 */
async function parseASCII(lineIterator, header) {
    // PLY ascii format specification, as per http://en.wikipedia.org/wiki/PLY_(file_format)
    const attributes = {
        indices: [],
        vertices: [],
        normals: [],
        uvs: [],
        colors: []
    };
    let currentElement = 0;
    let currentElementCount = 0;
    for await (let line of lineIterator) {
        line = line.trim();
        if (line !== '') {
            if (currentElementCount >= header.elements[currentElement].count) {
                currentElement++;
                currentElementCount = 0;
            }
            const element = parsePLYElement(header.elements[currentElement].properties, line);
            handleElement(attributes, header.elements[currentElement].name, element);
            currentElementCount++;
        }
    }
    return attributes;
}
/**
 * Parses ASCII number
 * @param n
 * @param type
 * @returns ASCII number
 */
// eslint-disable-next-line complexity
function parseASCIINumber(n, type) {
    switch (type) {
        case 'char':
        case 'uchar':
        case 'short':
        case 'ushort':
        case 'int':
        case 'uint':
        case 'int8':
        case 'uint8':
        case 'int16':
        case 'uint16':
        case 'int32':
        case 'uint32':
            return parseInt(n, 10);
        case 'float':
        case 'double':
        case 'float32':
        case 'float64':
            return parseFloat(n);
        default:
            throw new Error(type);
    }
}
/**
 * Parses ASCII element
 * @param properties
 * @param line
 * @returns element
 */
function parsePLYElement(properties, line) {
    const values = line.split(/\s+/);
    const element = {};
    for (let i = 0; i < properties.length; i++) {
        if (properties[i].type === 'list') {
            const list = [];
            const n = parseASCIINumber(values.shift(), properties[i].countType);
            for (let j = 0; j < n; j++) {
                list.push(parseASCIINumber(values.shift(), properties[i].itemType));
            }
            element[properties[i].name] = list;
        }
        else {
            element[properties[i].name] = parseASCIINumber(values.shift(), properties[i].type);
        }
    }
    return element;
}
/**
 * @param buffer
 * @param elementName
 * @param element
 */
// HELPER FUNCTIONS
// eslint-disable-next-line complexity
function handleElement(buffer, elementName, element = {}) {
    switch (elementName) {
        case 'vertex':
            buffer.vertices.push(element.x, element.y, element.z);
            if ('nx' in element && 'ny' in element && 'nz' in element) {
                buffer.normals.push(element.nx, element.ny, element.nz);
            }
            if ('s' in element && 't' in element) {
                buffer.uvs.push(element.s, element.t);
            }
            if ('red' in element && 'green' in element && 'blue' in element) {
                buffer.colors.push(element.red / 255.0, element.green / 255.0, element.blue / 255.0);
            }
            break;
        case 'face':
            const vertexIndices = element.vertex_indices || element.vertex_index; // issue #9338
            if (vertexIndices.length === 3) {
                buffer.indices.push(vertexIndices[0], vertexIndices[1], vertexIndices[2]);
            }
            else if (vertexIndices.length === 4) {
                buffer.indices.push(vertexIndices[0], vertexIndices[1], vertexIndices[3]);
                buffer.indices.push(vertexIndices[1], vertexIndices[2], vertexIndices[3]);
            }
            break;
        default:
            break;
    }
}
