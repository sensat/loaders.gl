"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOmeLegacyIndexer = getOmeLegacyIndexer;
exports.getOmeSubIFDIndexer = getOmeSubIFDIndexer;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
function getOmeLegacyIndexer(tiff, rootMeta) {
  var imgMeta = rootMeta[0];
  var _imgMeta$Pixels = imgMeta.Pixels,
    SizeT = _imgMeta$Pixels.SizeT,
    SizeC = _imgMeta$Pixels.SizeC,
    SizeZ = _imgMeta$Pixels.SizeZ;
  var ifdIndexer = getOmeIFDIndexer(imgMeta);
  return function (sel, pyramidLevel) {
    var index = ifdIndexer(sel);
    var pyramidIndex = pyramidLevel * SizeZ * SizeT * SizeC;
    return tiff.getImage(index + pyramidIndex);
  };
}
function getOmeSubIFDIndexer(tiff, rootMeta) {
  var imgMeta = rootMeta[0];
  var ifdIndexer = getOmeIFDIndexer(imgMeta);
  var ifdCache = new Map();
  return function () {
    var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(sel, pyramidLevel) {
      var index, baseImage, SubIFDs, key, subIfdOffset, ifd;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            index = ifdIndexer(sel);
            _context.next = 3;
            return tiff.getImage(index);
          case 3:
            baseImage = _context.sent;
            if (!(pyramidLevel === 0)) {
              _context.next = 6;
              break;
            }
            return _context.abrupt("return", baseImage);
          case 6:
            SubIFDs = baseImage.fileDirectory.SubIFDs;
            if (SubIFDs) {
              _context.next = 9;
              break;
            }
            throw Error('Indexing Error: OME-TIFF is missing SubIFDs.');
          case 9:
            key = "".concat(sel.t, "-").concat(sel.c, "-").concat(sel.z, "-").concat(pyramidLevel);
            if (!ifdCache.has(key)) {
              subIfdOffset = SubIFDs[pyramidLevel - 1];
              ifdCache.set(key, tiff.parseFileDirectoryAt(subIfdOffset));
            }
            _context.next = 13;
            return ifdCache.get(key);
          case 13:
            ifd = _context.sent;
            return _context.abrupt("return", new baseImage.constructor(ifd.fileDirectory, ifd.geoKeyDirectory, tiff.dataView, tiff.littleEndian, tiff.cache, tiff.source));
          case 15:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
}
function getOmeIFDIndexer(imgMeta) {
  var _imgMeta$Pixels2 = imgMeta.Pixels,
    SizeC = _imgMeta$Pixels2.SizeC,
    SizeZ = _imgMeta$Pixels2.SizeZ,
    SizeT = _imgMeta$Pixels2.SizeT,
    DimensionOrder = _imgMeta$Pixels2.DimensionOrder;
  switch (DimensionOrder) {
    case 'XYZCT':
      {
        return function (_ref2) {
          var t = _ref2.t,
            c = _ref2.c,
            z = _ref2.z;
          return t * SizeZ * SizeC + c * SizeZ + z;
        };
      }
    case 'XYZTC':
      {
        return function (_ref3) {
          var t = _ref3.t,
            c = _ref3.c,
            z = _ref3.z;
          return c * SizeZ * SizeT + t * SizeZ + z;
        };
      }
    case 'XYCTZ':
      {
        return function (_ref4) {
          var t = _ref4.t,
            c = _ref4.c,
            z = _ref4.z;
          return z * SizeC * SizeT + t * SizeC + c;
        };
      }
    case 'XYCZT':
      {
        return function (_ref5) {
          var t = _ref5.t,
            c = _ref5.c,
            z = _ref5.z;
          return t * SizeC * SizeZ + z * SizeC + c;
        };
      }
    case 'XYTCZ':
      {
        return function (_ref6) {
          var t = _ref6.t,
            c = _ref6.c,
            z = _ref6.z;
          return z * SizeT * SizeC + c * SizeT + t;
        };
      }
    case 'XYTZC':
      {
        return function (_ref7) {
          var t = _ref7.t,
            c = _ref7.c,
            z = _ref7.z;
          return c * SizeT * SizeZ + z * SizeT + t;
        };
      }
    default:
      {
        throw new Error("Invalid OME-XML DimensionOrder, got ".concat(DimensionOrder, "."));
      }
  }
}
//# sourceMappingURL=ome-indexers.js.map