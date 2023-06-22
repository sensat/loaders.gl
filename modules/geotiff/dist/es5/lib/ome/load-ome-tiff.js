"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isOmeTiff = void 0;
exports.loadOmeTiff = loadOmeTiff;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _tiffPixelSource = _interopRequireDefault(require("../tiff-pixel-source"));
var _omeIndexers = require("./ome-indexers");
var _omeUtils = require("./ome-utils");
var _omexml = require("./omexml");
var isOmeTiff = function isOmeTiff(img) {
  return img.fileDirectory.ImageDescription.includes('<OME');
};
exports.isOmeTiff = isOmeTiff;
function loadOmeTiff(_x, _x2) {
  return _loadOmeTiff.apply(this, arguments);
}
function _loadOmeTiff() {
  _loadOmeTiff = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(tiff, firstImage) {
    var _firstImage$fileDirec, ImageDescription, SubIFDs, photometricInterpretation, omexml, levels, pyramidIndexer, imgMeta, _getOmePixelSourceMet, labels, getShape, physicalSizes, dtype, tileSize, meta, data;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _firstImage$fileDirec = firstImage.fileDirectory, ImageDescription = _firstImage$fileDirec.ImageDescription, SubIFDs = _firstImage$fileDirec.SubIFDs, photometricInterpretation = _firstImage$fileDirec.PhotometricInterpretation;
          omexml = (0, _omexml.fromString)(ImageDescription);
          if (SubIFDs) {
            levels = SubIFDs.length + 1;
            pyramidIndexer = (0, _omeIndexers.getOmeSubIFDIndexer)(tiff, omexml);
          } else {
            levels = omexml.length;
            pyramidIndexer = (0, _omeIndexers.getOmeLegacyIndexer)(tiff, omexml);
          }
          imgMeta = omexml[0];
          _getOmePixelSourceMet = (0, _omeUtils.getOmePixelSourceMeta)(imgMeta), labels = _getOmePixelSourceMet.labels, getShape = _getOmePixelSourceMet.getShape, physicalSizes = _getOmePixelSourceMet.physicalSizes, dtype = _getOmePixelSourceMet.dtype;
          tileSize = firstImage.getTileWidth();
          meta = {
            photometricInterpretation: photometricInterpretation,
            physicalSizes: physicalSizes
          };
          data = Array.from({
            length: levels
          }).map(function (_, resolution) {
            var shape = getShape(resolution);
            var indexer = function indexer(sel) {
              return pyramidIndexer(sel, resolution);
            };
            var source = new _tiffPixelSource.default(indexer, dtype, tileSize, shape, labels, meta);
            return source;
          });
          return _context.abrupt("return", {
            data: data,
            metadata: imgMeta
          });
        case 9:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _loadOmeTiff.apply(this, arguments);
}
//# sourceMappingURL=load-ome-tiff.js.map