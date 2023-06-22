"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  PARQUET_CODECS: true
};
exports.PARQUET_CODECS = void 0;
var PLAIN = _interopRequireWildcard(require("./plain"));
var RLE = _interopRequireWildcard(require("./rle"));
var DICTIONARY = _interopRequireWildcard(require("./dictionary"));
var _declare = require("./declare");
Object.keys(_declare).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _declare[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _declare[key];
    }
  });
});
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var PARQUET_CODECS = {
  PLAIN: {
    encodeValues: PLAIN.encodeValues,
    decodeValues: PLAIN.decodeValues
  },
  RLE: {
    encodeValues: RLE.encodeValues,
    decodeValues: RLE.decodeValues
  },
  PLAIN_DICTIONARY: {
    encodeValues: DICTIONARY.encodeValues,
    decodeValues: DICTIONARY.decodeValues
  },
  RLE_DICTIONARY: {
    encodeValues: DICTIONARY.encodeValues,
    decodeValues: DICTIONARY.decodeValues
  }
};
exports.PARQUET_CODECS = PARQUET_CODECS;
//# sourceMappingURL=index.js.map