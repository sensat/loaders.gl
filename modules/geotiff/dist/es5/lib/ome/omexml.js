"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fromString = fromString;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _fastXmlParser = _interopRequireDefault(require("fast-xml-parser"));
var _tiffUtils = require("../utils/tiff-utils");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var PARSER_OPTIONS = {
  attributeNamePrefix: '',
  attrNodeName: 'attr',
  parseNodeValue: true,
  parseAttributeValue: true,
  ignoreAttributes: false
};
var parse = function parse(str) {
  return _fastXmlParser.default.parse(str, PARSER_OPTIONS);
};
function fromString(str) {
  var res = parse(str);
  if (!res.OME) {
    throw Error('Failed to parse OME-XML metadata.');
  }
  return (0, _tiffUtils.ensureArray)(res.OME.Image).map(function (img) {
    var Channels = (0, _tiffUtils.ensureArray)(img.Pixels.Channel).map(function (c) {
      if ('Color' in c.attr) {
        return _objectSpread(_objectSpread({}, c.attr), {}, {
          Color: (0, _tiffUtils.intToRgba)(c.attr.Color)
        });
      }
      return _objectSpread({}, c.attr);
    });
    var _img$AquisitionDate = img.AquisitionDate,
      AquisitionDate = _img$AquisitionDate === void 0 ? '' : _img$AquisitionDate,
      _img$Description = img.Description,
      Description = _img$Description === void 0 ? '' : _img$Description;
    var image = _objectSpread(_objectSpread({}, img.attr), {}, {
      AquisitionDate: AquisitionDate,
      Description: Description,
      Pixels: _objectSpread(_objectSpread({}, img.Pixels.attr), {}, {
        Channels: Channels
      })
    });
    return _objectSpread(_objectSpread({}, image), {}, {
      format: function format() {
        var Pixels = image.Pixels;
        var sizes = ['X', 'Y', 'Z'].map(function (name) {
          var size = Pixels["PhysicalSize".concat(name)];
          var unit = Pixels["PhysicalSize".concat(name, "Unit")];
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
    });
  });
}
//# sourceMappingURL=omexml.js.map