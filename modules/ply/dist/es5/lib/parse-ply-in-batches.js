"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePLYInBatches = parsePLYInBatches;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _awaitAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/awaitAsyncGenerator"));
var _wrapAsyncGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/wrapAsyncGenerator"));
var _loaderUtils = require("@loaders.gl/loader-utils");
var _normalizePly = _interopRequireDefault(require("./normalize-ply"));
function _asyncIterator(iterable) { var method, async, sync, retry = 2; for ("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;) { if (async && null != (method = iterable[async])) return method.call(iterable); if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable)); async = "@@asyncIterator", sync = "@@iterator"; } throw new TypeError("Object is not async iterable"); }
function AsyncFromSyncIterator(s) { function AsyncFromSyncIteratorContinuation(r) { if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object.")); var done = r.done; return Promise.resolve(r.value).then(function (value) { return { value: value, done: done }; }); } return AsyncFromSyncIterator = function AsyncFromSyncIterator(s) { this.s = s, this.n = s.next; }, AsyncFromSyncIterator.prototype = { s: null, n: null, next: function next() { return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments)); }, return: function _return(value) { var ret = this.s.return; return void 0 === ret ? Promise.resolve({ value: value, done: !0 }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments)); }, throw: function _throw(value) { var thr = this.s.return; return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments)); } }, new AsyncFromSyncIterator(s); }
var currentElement;
function parsePLYInBatches(_x, _x2) {
  return _parsePLYInBatches.apply(this, arguments);
}
function _parsePLYInBatches() {
  _parsePLYInBatches = (0, _wrapAsyncGenerator2.default)(_regenerator.default.mark(function _callee(iterator, options) {
    var lineIterator, header, attributes;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          lineIterator = (0, _loaderUtils.makeLineIterator)((0, _loaderUtils.makeTextDecoderIterator)(iterator));
          _context.next = 3;
          return (0, _awaitAsyncGenerator2.default)(parsePLYHeader(lineIterator, options));
        case 3:
          header = _context.sent;
          _context.t0 = header.format;
          _context.next = _context.t0 === 'ascii' ? 7 : 11;
          break;
        case 7:
          _context.next = 9;
          return (0, _awaitAsyncGenerator2.default)(parseASCII(lineIterator, header));
        case 9:
          attributes = _context.sent;
          return _context.abrupt("break", 12);
        case 11:
          throw new Error('Binary PLY can not yet be parsed in streaming mode');
        case 12:
          _context.next = 14;
          return (0, _normalizePly.default)(header, attributes, options);
        case 14:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parsePLYInBatches.apply(this, arguments);
}
function parsePLYHeader(_x3, _x4) {
  return _parsePLYHeader.apply(this, arguments);
}
function _parsePLYHeader() {
  _parsePLYHeader = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(lineIterator, options) {
    var header;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          header = {
            comments: [],
            elements: []
          };
          _context2.next = 3;
          return (0, _loaderUtils.forEach)(lineIterator, function (line) {
            line = line.trim();
            if (line === 'end_header') {
              return true;
            }
            if (line === '') {
              return false;
            }
            var lineValues = line.split(/\s+/);
            var lineType = lineValues.shift();
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
                var property = makePLYElementProperty(lineValues, options.propertyNameMapping);
                currentElement.properties.push(property);
                break;
              default:
                console.log('unhandled', lineType, lineValues);
            }
            return false;
          });
        case 3:
          if (currentElement) {
            header.elements.push(currentElement);
          }
          return _context2.abrupt("return", header);
        case 5:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _parsePLYHeader.apply(this, arguments);
}
function makePLYElementProperty(propertyValues, propertyNameMapping) {
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
function parseASCII(_x5, _x6) {
  return _parseASCII.apply(this, arguments);
}
function _parseASCII() {
  _parseASCII = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(lineIterator, header) {
    var attributes, currentElement, currentElementCount, _iteratorAbruptCompletion, _didIteratorError, _iteratorError, _iterator, _step, line, element;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          attributes = {
            indices: [],
            vertices: [],
            normals: [],
            uvs: [],
            colors: []
          };
          currentElement = 0;
          currentElementCount = 0;
          _iteratorAbruptCompletion = false;
          _didIteratorError = false;
          _context3.prev = 5;
          _iterator = _asyncIterator(lineIterator);
        case 7:
          _context3.next = 9;
          return _iterator.next();
        case 9:
          if (!(_iteratorAbruptCompletion = !(_step = _context3.sent).done)) {
            _context3.next = 16;
            break;
          }
          line = _step.value;
          line = line.trim();
          if (line !== '') {
            if (currentElementCount >= header.elements[currentElement].count) {
              currentElement++;
              currentElementCount = 0;
            }
            element = parsePLYElement(header.elements[currentElement].properties, line);
            handleElement(attributes, header.elements[currentElement].name, element);
            currentElementCount++;
          }
        case 13:
          _iteratorAbruptCompletion = false;
          _context3.next = 7;
          break;
        case 16:
          _context3.next = 22;
          break;
        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](5);
          _didIteratorError = true;
          _iteratorError = _context3.t0;
        case 22:
          _context3.prev = 22;
          _context3.prev = 23;
          if (!(_iteratorAbruptCompletion && _iterator.return != null)) {
            _context3.next = 27;
            break;
          }
          _context3.next = 27;
          return _iterator.return();
        case 27:
          _context3.prev = 27;
          if (!_didIteratorError) {
            _context3.next = 30;
            break;
          }
          throw _iteratorError;
        case 30:
          return _context3.finish(27);
        case 31:
          return _context3.finish(22);
        case 32:
          return _context3.abrupt("return", attributes);
        case 33:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[5, 18, 22, 32], [23,, 27, 31]]);
  }));
  return _parseASCII.apply(this, arguments);
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
function handleElement(buffer, elementName) {
  var element = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
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
      var vertexIndices = element.vertex_indices || element.vertex_index;
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