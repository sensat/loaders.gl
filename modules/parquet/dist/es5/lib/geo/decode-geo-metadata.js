"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGeoMetadata = getGeoMetadata;
exports.setGeoMetadata = setGeoMetadata;
exports.unpackGeoMetadata = unpackGeoMetadata;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
function getGeoMetadata(schema) {
  var stringifiedGeoMetadata = schema.metadata.geo;
  if (!stringifiedGeoMetadata) {
    return null;
  }
  try {
    var geoMetadata = JSON.parse(stringifiedGeoMetadata);
    return geoMetadata;
  } catch (_unused) {
    return null;
  }
}
function setGeoMetadata(schema, geoMetadata) {
  var stringifiedGeoMetadata = JSON.stringify(geoMetadata);
  schema.metadata.geo = stringifiedGeoMetadata;
}
function unpackGeoMetadata(schema) {
  var geoMetadata = getGeoMetadata(schema);
  if (!geoMetadata) {
    return;
  }
  var version = geoMetadata.version,
    primary_column = geoMetadata.primary_column,
    columns = geoMetadata.columns;
  if (version) {
    schema.metadata['geo.version'] = version;
  }
  if (primary_column) {
    schema.metadata['geo.primary_column'] = primary_column;
  }
  schema.metadata['geo.columns'] = Object.keys(columns || {}).join('');
  var _loop = function _loop() {
    var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
      columnName = _Object$entries$_i[0],
      columnMetadata = _Object$entries$_i[1];
    var field = schema.fields.find(function (field) {
      return field.name === columnName;
    });
    if (field) {
      if (field.name === primary_column) {
        setFieldMetadata(field, 'geo.primary_field', 'true');
      }
      unpackGeoFieldMetadata(field, columnMetadata);
    }
  };
  for (var _i = 0, _Object$entries = Object.entries(columns || {}); _i < _Object$entries.length; _i++) {
    _loop();
  }
}
function unpackGeoFieldMetadata(field, columnMetadata) {
  for (var _i2 = 0, _Object$entries2 = Object.entries(columnMetadata || {}); _i2 < _Object$entries2.length; _i2++) {
    var _Object$entries2$_i = (0, _slicedToArray2.default)(_Object$entries2[_i2], 2),
      _key = _Object$entries2$_i[0],
      value = _Object$entries2$_i[1];
    switch (_key) {
      case 'geometry_type':
        setFieldMetadata(field, "geo.".concat(_key), value.join(','));
        break;
      case 'bbox':
      case 'crs':
      case 'edges':
      default:
        setFieldMetadata(field, "geo.".concat(_key), typeof value === 'string' ? value : JSON.stringify(value));
    }
  }
}
function setFieldMetadata(field, key, value) {
  field.metadata = field.metadata || {};
  field.metadata[key] = value;
}
//# sourceMappingURL=decode-geo-metadata.js.map