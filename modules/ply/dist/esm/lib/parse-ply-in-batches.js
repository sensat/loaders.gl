import { makeLineIterator, makeTextDecoderIterator, forEach } from '@loaders.gl/loader-utils';
import normalizePLY from './normalize-ply';
let currentElement;
export async function* parsePLYInBatches(iterator, options) {
  const lineIterator = makeLineIterator(makeTextDecoderIterator(iterator));
  const header = await parsePLYHeader(lineIterator, options);
  let attributes;
  switch (header.format) {
    case 'ascii':
      attributes = await parseASCII(lineIterator, header);
      break;
    default:
      throw new Error('Binary PLY can not yet be parsed in streaming mode');
  }
  yield normalizePLY(header, attributes, options);
}
async function parsePLYHeader(lineIterator, options) {
  const header = {
    comments: [],
    elements: []
  };
  await forEach(lineIterator, line => {
    line = line.trim();
    if (line === 'end_header') {
      return true;
    }
    if (line === '') {
      return false;
    }
    const lineValues = line.split(/\s+/);
    const lineType = lineValues.shift();
    line = lineValues.join(' ');
    switch (lineType) {
      case 'ply':
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
async function parseASCII(lineIterator, header) {
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
    } else {
      element[properties[i].name] = parseASCIINumber(values.shift(), properties[i].type);
    }
  }
  return element;
}
function handleElement(buffer, elementName) {
  let element = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
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
      const vertexIndices = element.vertex_indices || element.vertex_index;
      if (vertexIndices.length === 3) {
        buffer.indices.push(vertexIndices[0], vertexIndices[1], vertexIndices[2]);
      } else if (vertexIndices.length === 4) {
        buffer.indices.push(vertexIndices[0], vertexIndices[1], vertexIndices[3]);
        buffer.indices.push(vertexIndices[1], vertexIndices[2], vertexIndices[3]);
      }
      break;
    default:
      break;
  }
}
//# sourceMappingURL=parse-ply-in-batches.js.map