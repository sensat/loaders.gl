"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePLY = parsePLY;
var _normalizePly = _interopRequireDefault(require("./normalize-ply"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function parsePLY(data) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var header;
  var attributes;
  if (data instanceof ArrayBuffer) {
    var text = new TextDecoder().decode(data);
    header = parseHeader(text, options);
    attributes = header.format === 'ascii' ? parseASCII(text, header) : parseBinary(data, header);
  } else {
    header = parseHeader(data, options);
    attributes = parseASCII(data, header);
  }
  return (0, _normalizePly.default)(header, attributes);
}
function parseHeader(data, options) {
  var PLY_HEADER_PATTERN = /ply([\s\S]*)end_header\s/;
  var headerText = '';
  var headerLength = 0;
  var result = PLY_HEADER_PATTERN.exec(data);
  if (result !== null) {
    headerText = result[1];
    headerLength = result[0].length;
  }
  var lines = headerText.split('\n');
  var header = parseHeaderLines(lines, headerLength, options);
  return header;
}
function parseHeaderLines(lines, headerLength, options) {
  var header = {
    comments: [],
    elements: [],
    headerLength: headerLength
  };
  var lineType;
  var lineValues;
  var currentElement = null;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    line = line.trim();
    if (line === '') {
      continue;
    }
    lineValues = line.split(/\s+/);
    lineType = lineValues.shift();
    line = lineValues.join(' ');
    switch (lineType) {
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
        if (currentElement) {
          var property = makePLYElementProperty(lineValues);
          if (options !== null && options !== void 0 && options.propertyNameMapping && property.name in (options === null || options === void 0 ? void 0 : options.propertyNameMapping)) {
            property.name = options === null || options === void 0 ? void 0 : options.propertyNameMapping[property.name];
          }
          currentElement.properties.push(property);
        }
        break;
      default:
        console.log('unhandled', lineType, lineValues);
    }
  }
  if (currentElement) {
    header.elements.push(currentElement);
  }
  return header;
}
function getPLYAttributes(header) {
  var attributes = {
    indices: [],
    vertices: [],
    normals: [],
    uvs: [],
    colors: []
  };
  var _iterator = _createForOfIteratorHelper(header.elements),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var element = _step.value;
      if (element.name === 'vertex') {
        var _iterator2 = _createForOfIteratorHelper(element.properties),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var property = _step2.value;
            switch (property.name) {
              case 'x':
              case 'y':
              case 'z':
              case 'nx':
              case 'ny':
              case 'nz':
              case 's':
              case 't':
              case 'red':
              case 'green':
              case 'blue':
                break;
              default:
                attributes[property.name] = [];
                break;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return attributes;
}
function makePLYElementProperty(propertyValues) {
  var type = propertyValues[0];
  switch (type) {
    case 'list':
      return {
        type: type,
        name: propertyValues[3],
        countType: propertyValues[1],
        itemType: propertyValues[2]
      };
    default:
      return {
        type: type,
        name: propertyValues[1]
      };
  }
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
  var values = line.split(/\s+/);
  var element = {};
  for (var i = 0; i < properties.length; i++) {
    if (properties[i].type === 'list') {
      var list = [];
      var n = parseASCIINumber(values.shift(), properties[i].countType);
      for (var j = 0; j < n; j++) {
        list.push(parseASCIINumber(values.shift(), properties[i].itemType));
      }
      element[properties[i].name] = list;
    } else {
      element[properties[i].name] = parseASCIINumber(values.shift(), properties[i].type);
    }
  }
  return element;
}
function parseASCII(data, header) {
  var attributes = getPLYAttributes(header);
  var result;
  var patternBody = /end_header\s([\s\S]*)$/;
  var body = '';
  if ((result = patternBody.exec(data)) !== null) {
    body = result[1];
  }
  var lines = body.split('\n');
  var currentElement = 0;
  var currentElementCount = 0;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    line = line.trim();
    if (line !== '') {
      if (currentElementCount >= header.elements[currentElement].count) {
        currentElement++;
        currentElementCount = 0;
      }
      var element = parsePLYElement(header.elements[currentElement].properties, line);
      handleElement(attributes, header.elements[currentElement].name, element);
      currentElementCount++;
    }
  }
  return attributes;
}
function handleElement(buffer, elementName) {
  var element = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (elementName === 'vertex') {
    for (var _i = 0, _Object$keys = Object.keys(element); _i < _Object$keys.length; _i++) {
      var propertyName = _Object$keys[_i];
      switch (propertyName) {
        case 'x':
          buffer.vertices.push(element.x, element.y, element.z);
          break;
        case 'y':
        case 'z':
          break;
        case 'nx':
          if ('nx' in element && 'ny' in element && 'nz' in element) {
            buffer.normals.push(element.nx, element.ny, element.nz);
          }
          break;
        case 'ny':
        case 'nz':
          break;
        case 's':
          if ('s' in element && 't' in element) {
            buffer.uvs.push(element.s, element.t);
          }
          break;
        case 't':
          break;
        case 'red':
          if ('red' in element && 'green' in element && 'blue' in element) {
            buffer.colors.push(element.red, element.green, element.blue);
          }
          break;
        case 'green':
        case 'blue':
          break;
        default:
          buffer[propertyName].push(element[propertyName]);
      }
    }
  } else if (elementName === 'face') {
    var vertexIndices = element.vertex_indices || element.vertex_index;
    if (vertexIndices.length === 3) {
      buffer.indices.push(vertexIndices[0], vertexIndices[1], vertexIndices[2]);
    } else if (vertexIndices.length === 4) {
      buffer.indices.push(vertexIndices[0], vertexIndices[1], vertexIndices[3]);
      buffer.indices.push(vertexIndices[1], vertexIndices[2], vertexIndices[3]);
    }
  }
}
function binaryRead(dataview, at, type, littleEndian) {
  switch (type) {
    case 'int8':
    case 'char':
      return [dataview.getInt8(at), 1];
    case 'uint8':
    case 'uchar':
      return [dataview.getUint8(at), 1];
    case 'int16':
    case 'short':
      return [dataview.getInt16(at, littleEndian), 2];
    case 'uint16':
    case 'ushort':
      return [dataview.getUint16(at, littleEndian), 2];
    case 'int32':
    case 'int':
      return [dataview.getInt32(at, littleEndian), 4];
    case 'uint32':
    case 'uint':
      return [dataview.getUint32(at, littleEndian), 4];
    case 'float32':
    case 'float':
      return [dataview.getFloat32(at, littleEndian), 4];
    case 'float64':
    case 'double':
      return [dataview.getFloat64(at, littleEndian), 8];
    default:
      throw new Error(type);
  }
}
function binaryReadElement(dataview, at, properties, littleEndian) {
  var element = {};
  var result;
  var read = 0;
  for (var i = 0; i < properties.length; i++) {
    if (properties[i].type === 'list') {
      var list = [];
      result = binaryRead(dataview, at + read, properties[i].countType, littleEndian);
      var n = result[0];
      read += result[1];
      for (var j = 0; j < n; j++) {
        result = binaryRead(dataview, at + read, properties[i].itemType, littleEndian);
        list.push(result[0]);
        read += result[1];
      }
      element[properties[i].name] = list;
    } else {
      result = binaryRead(dataview, at + read, properties[i].type, littleEndian);
      element[properties[i].name] = result[0];
      read += result[1];
    }
  }
  return [element, read];
}
function parseBinary(data, header) {
  var attributes = getPLYAttributes(header);
  var littleEndian = header.format === 'binary_little_endian';
  var body = new DataView(data, header.headerLength);
  var result;
  var loc = 0;
  for (var currentElement = 0; currentElement < header.elements.length; currentElement++) {
    var count = header.elements[currentElement].count;
    for (var currentElementCount = 0; currentElementCount < count; currentElementCount++) {
      result = binaryReadElement(body, loc, header.elements[currentElement].properties, littleEndian);
      loc += result[1];
      var element = result[0];
      handleElement(attributes, header.elements[currentElement].name, element);
    }
  }
  return attributes;
}
//# sourceMappingURL=parse-ply.js.map