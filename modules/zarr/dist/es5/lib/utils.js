"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDims = getDims;
exports.getImageSize = getImageSize;
exports.getIndexer = getIndexer;
exports.guessLabels = guessLabels;
exports.guessTileSize = guessTileSize;
exports.isInterleaved = isInterleaved;
exports.joinUrlParts = joinUrlParts;
exports.loadMultiscales = loadMultiscales;
exports.normalizeStore = normalizeStore;
exports.validLabels = validLabels;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _zarr = require("zarr");
function normalizeStore(source) {
  if (typeof source === 'string') {
    return new _zarr.HTTPStore(source);
  }
  return source;
}
function loadMultiscales(_x) {
  return _loadMultiscales.apply(this, arguments);
}
function _loadMultiscales() {
  _loadMultiscales = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(store) {
    var path,
      grp,
      rootAttrs,
      datasets,
      promises,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          path = _args.length > 1 && _args[1] !== undefined ? _args[1] : '';
          _context.next = 3;
          return (0, _zarr.openGroup)(store, path);
        case 3:
          grp = _context.sent;
          _context.next = 6;
          return grp.attrs.asObject();
        case 6:
          rootAttrs = _context.sent;
          if (Array.isArray(rootAttrs.multiscales)) {
            _context.next = 9;
            break;
          }
          throw new Error('Cannot find Zarr multiscales metadata.');
        case 9:
          datasets = rootAttrs.multiscales[0].datasets;
          promises = datasets.map(function (d) {
            return grp.getItem(d.path);
          });
          _context.next = 13;
          return Promise.all(promises);
        case 13:
          _context.t0 = _context.sent;
          _context.t1 = rootAttrs;
          return _context.abrupt("return", {
            data: _context.t0,
            rootAttrs: _context.t1
          });
        case 16:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _loadMultiscales.apply(this, arguments);
}
function getDims(labels) {
  var lookup = new Map(labels.map(function (name, i) {
    return [name, i];
  }));
  if (lookup.size !== labels.length) {
    throw Error('Labels must be unique, found duplicated label.');
  }
  return function (name) {
    var index = lookup.get(name);
    if (index === undefined) {
      throw Error('Invalid dimension.');
    }
    return index;
  };
}
function prevPowerOf2(x) {
  return Math.pow(2, Math.floor(Math.log2(x)));
}
function isInterleaved(shape) {
  var lastDimSize = shape[shape.length - 1];
  return lastDimSize === 3 || lastDimSize === 4;
}
function guessTileSize(arr) {
  var interleaved = isInterleaved(arr.shape);
  var _arr$chunks$slice = arr.chunks.slice(interleaved ? -3 : -2),
    _arr$chunks$slice2 = (0, _slicedToArray2.default)(_arr$chunks$slice, 2),
    yChunk = _arr$chunks$slice2[0],
    xChunk = _arr$chunks$slice2[1];
  var size = Math.min(yChunk, xChunk);
  return prevPowerOf2(size);
}
function guessLabels(rootAttrs) {
  if ('omero' in rootAttrs) {
    return ['t', 'c', 'z', 'y', 'x'];
  }
  throw new Error('Could not infer dimension labels for Zarr source. Must provide dimension labels.');
}
function getIndexer(labels) {
  var size = labels.length;
  var dims = getDims(labels);
  return function (sel) {
    if (Array.isArray(sel)) {
      return (0, _toConsumableArray2.default)(sel);
    }
    var selection = Array(size).fill(0);
    for (var _i = 0, _Object$entries = Object.entries(sel); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];
      selection[dims(key)] = value;
    }
    return selection;
  };
}
function getImageSize(source) {
  var interleaved = isInterleaved(source.shape);
  var _source$shape$slice = source.shape.slice(interleaved ? -3 : -2),
    _source$shape$slice2 = (0, _slicedToArray2.default)(_source$shape$slice, 2),
    height = _source$shape$slice2[0],
    width = _source$shape$slice2[1];
  return {
    height: height,
    width: width
  };
}
function joinUrlParts() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return args.map(function (part, i) {
    if (i === 0) return part.trim().replace(/[/]*$/g, '');
    return part.trim().replace(/(^[/]*|[/]*$)/g, '');
  }).filter(function (x) {
    return x.length;
  }).join('/');
}
function validLabels(labels, shape) {
  if (labels.length !== shape.length) {
    throw new Error('Labels do not match Zarr array shape.');
  }
  var n = shape.length;
  if (isInterleaved(shape)) {
    return labels[n - 3] === 'y' && labels[n - 2] === 'x' && labels[n - 1] === '_c';
  }
  return labels[n - 2] === 'y' && labels[n - 1] === 'x';
}
//# sourceMappingURL=utils.js.map