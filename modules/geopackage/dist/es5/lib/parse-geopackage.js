"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_SQLJS_CDN = void 0;
exports.default = parseGeoPackage;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _sql = _interopRequireDefault(require("sql.js"));
var _wkt = require("@loaders.gl/wkt");
var _gis = require("@loaders.gl/gis");
var _proj = require("@math.gl/proj4");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var DEFAULT_SQLJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/';
exports.DEFAULT_SQLJS_CDN = DEFAULT_SQLJS_CDN;
var ENVELOPE_BYTE_LENGTHS = {
  0: 0,
  1: 32,
  2: 48,
  3: 48,
  4: 64,
  5: 0,
  6: 0,
  7: 0
};
var SQL_TYPE_MAPPING = {
  BOOLEAN: 'bool',
  TINYINT: 'int8',
  SMALLINT: 'int16',
  MEDIUMINT: 'int32',
  INT: 'int32',
  INTEGER: 'int32',
  FLOAT: 'float32',
  DOUBLE: 'float64',
  REAL: 'float64',
  TEXT: 'utf8',
  BLOB: 'binary',
  DATE: 'utf8',
  DATETIME: 'utf8',
  GEOMETRY: 'binary',
  POINT: 'binary',
  LINESTRING: 'binary',
  POLYGON: 'binary',
  MULTIPOINT: 'binary',
  MULTILINESTRING: 'binary',
  MULTIPOLYGON: 'binary',
  GEOMETRYCOLLECTION: 'binary'
};
function parseGeoPackage(_x, _x2) {
  return _parseGeoPackage.apply(this, arguments);
}
function _parseGeoPackage() {
  _parseGeoPackage = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, options) {
    var _ref2, _ref2$sqlJsCDN, sqlJsCDN, _ref3, _ref3$reproject, reproject, _ref3$_targetCrs, _targetCrs, _ref3$format, format, db, tables, projections, outputTables, _iterator3, _step3, table, tableName;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _ref2 = (options === null || options === void 0 ? void 0 : options.geopackage) || {}, _ref2$sqlJsCDN = _ref2.sqlJsCDN, sqlJsCDN = _ref2$sqlJsCDN === void 0 ? DEFAULT_SQLJS_CDN : _ref2$sqlJsCDN;
          _ref3 = (options === null || options === void 0 ? void 0 : options.gis) || {}, _ref3$reproject = _ref3.reproject, reproject = _ref3$reproject === void 0 ? false : _ref3$reproject, _ref3$_targetCrs = _ref3._targetCrs, _targetCrs = _ref3$_targetCrs === void 0 ? 'WGS84' : _ref3$_targetCrs, _ref3$format = _ref3.format, format = _ref3$format === void 0 ? 'tables' : _ref3$format;
          _context.next = 4;
          return loadDatabase(arrayBuffer, sqlJsCDN);
        case 4:
          db = _context.sent;
          tables = listVectorTables(db);
          projections = getProjections(db);
          outputTables = {
            shape: 'tables',
            tables: []
          };
          _iterator3 = _createForOfIteratorHelper(tables);
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              table = _step3.value;
              tableName = table.table_name;
              outputTables.tables.push({
                name: tableName,
                table: getVectorTable(db, tableName, projections, {
                  reproject: reproject,
                  _targetCrs: _targetCrs
                })
              });
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
          if (!(format === 'geojson')) {
            _context.next = 12;
            break;
          }
          return _context.abrupt("return", formatTablesAsGeojson(outputTables));
        case 12:
          return _context.abrupt("return", outputTables);
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parseGeoPackage.apply(this, arguments);
}
function loadDatabase(_x3, _x4) {
  return _loadDatabase.apply(this, arguments);
}
function _loadDatabase() {
  _loadDatabase = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(arrayBuffer, sqlJsCDN) {
    var SQL;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!sqlJsCDN) {
            _context2.next = 6;
            break;
          }
          _context2.next = 3;
          return (0, _sql.default)({
            locateFile: function locateFile(file) {
              return "".concat(sqlJsCDN).concat(file);
            }
          });
        case 3:
          SQL = _context2.sent;
          _context2.next = 9;
          break;
        case 6:
          _context2.next = 8;
          return (0, _sql.default)();
        case 8:
          SQL = _context2.sent;
        case 9:
          return _context2.abrupt("return", new SQL.Database(new Uint8Array(arrayBuffer)));
        case 10:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _loadDatabase.apply(this, arguments);
}
function listVectorTables(db) {
  var stmt = db.prepare("SELECT * FROM gpkg_contents WHERE data_type='features';");
  var vectorTablesInfo = [];
  while (stmt.step()) {
    var vectorTableInfo = stmt.getAsObject();
    vectorTablesInfo.push(vectorTableInfo);
  }
  return vectorTablesInfo;
}
function getVectorTable(db, tableName, projections, _ref) {
  var reproject = _ref.reproject,
    _targetCrs = _ref._targetCrs;
  var dataColumns = getDataColumns(db, tableName);
  var geomColumn = getGeometryColumn(db, tableName);
  var featureIdColumn = getFeatureIdName(db, tableName);
  var _db$exec$ = db.exec("SELECT * FROM `".concat(tableName, "`;"))[0],
    columns = _db$exec$.columns,
    values = _db$exec$.values;
  var projection;
  if (reproject) {
    var geomColumnProjStr = projections[geomColumn.srs_id];
    projection = new _proj.Proj4Projection({
      from: geomColumnProjStr,
      to: _targetCrs
    });
  }
  var geojsonFeatures = [];
  var _iterator = _createForOfIteratorHelper(values),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var row = _step.value;
      var geojsonFeature = constructGeoJsonFeature(columns, row, geomColumn, dataColumns, featureIdColumn);
      geojsonFeatures.push(geojsonFeature);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var schema = getSchema(db, tableName);
  if (projection) {
    return {
      shape: 'object-row-table',
      data: (0, _gis.transformGeoJsonCoords)(geojsonFeatures, projection.project),
      schema: schema
    };
  }
  return {
    data: geojsonFeatures,
    schema: schema,
    shape: 'object-row-table'
  };
}
function getProjections(db) {
  var stmt = db.prepare('SELECT * FROM gpkg_spatial_ref_sys;');
  var projectionMapping = {};
  while (stmt.step()) {
    var srsInfo = stmt.getAsObject();
    var srs_id = srsInfo.srs_id,
      definition = srsInfo.definition;
    projectionMapping[srs_id] = definition;
  }
  return projectionMapping;
}
function constructGeoJsonFeature(columns, row, geomColumn, dataColumns, featureIdColumn) {
  var idIdx = columns.indexOf(featureIdColumn);
  var id = row[idIdx];
  var geomColumnIdx = columns.indexOf(geomColumn.column_name);
  var geometry = parseGeometry(row[geomColumnIdx].buffer);
  var properties = {};
  if (dataColumns) {
    for (var _i = 0, _Object$entries = Object.entries(dataColumns); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        value = _Object$entries$_i[1];
      var idx = columns.indexOf(key);
      properties[value] = row[idx];
    }
  } else {
    for (var i = 0; i < columns.length; i++) {
      if (i === idIdx || i === geomColumnIdx) {
        continue;
      }
      var columnName = columns[i];
      properties[columnName] = row[i];
    }
  }
  return {
    id: id,
    type: 'Feature',
    geometry: geometry,
    properties: properties
  };
}
function getGeopackageVersion(db) {
  var textDecoder = new TextDecoder();
  var applicationIdQuery = db.exec('PRAGMA application_id;')[0];
  var applicationId = applicationIdQuery.values[0][0];
  var buffer = new ArrayBuffer(4);
  var view = new DataView(buffer);
  view.setInt32(0, Number(applicationId));
  var versionString = textDecoder.decode(buffer);
  if (versionString === 'GP10') {
    return '1.0';
  }
  if (versionString === 'GP11') {
    return '1.1';
  }
  var userVersionQuery = db.exec('PRAGMA user_version;')[0];
  var userVersionInt = userVersionQuery.values[0][0];
  if (userVersionInt && typeof userVersionInt === 'number' && userVersionInt < 10300) {
    return '1.2';
  }
  return null;
}
function getFeatureIdName(db, tableName) {
  var stmt = db.prepare("PRAGMA table_info(`".concat(tableName, "`)"));
  while (stmt.step()) {
    var pragmaTableInfo = stmt.getAsObject();
    var name = pragmaTableInfo.name,
      pk = pragmaTableInfo.pk;
    if (pk) {
      return name;
    }
  }
  return null;
}
function parseGeometry(arrayBuffer) {
  var view = new DataView(arrayBuffer);
  var _parseGeometryBitFlag = parseGeometryBitFlags(view.getUint8(3)),
    envelopeLength = _parseGeometryBitFlag.envelopeLength,
    emptyGeometry = _parseGeometryBitFlag.emptyGeometry;
  if (emptyGeometry) {
    return null;
  }
  var wkbOffset = 8 + envelopeLength;
  var binaryGeometry = _wkt.WKBLoader.parseSync(arrayBuffer.slice(wkbOffset));
  return (0, _gis.binaryToGeometry)(binaryGeometry);
}
function parseGeometryBitFlags(byte) {
  var envelopeValue = (byte & 14) / 2;
  var envelopeLength = ENVELOPE_BYTE_LENGTHS[envelopeValue];
  return {
    littleEndian: Boolean(byte & 1),
    envelopeLength: envelopeLength,
    emptyGeometry: Boolean(byte & 16),
    extendedGeometryType: Boolean(byte & 32)
  };
}
function getGeometryColumn(db, tableName) {
  var stmt = db.prepare('SELECT * FROM gpkg_geometry_columns WHERE table_name=:tableName;');
  stmt.bind({
    ':tableName': tableName
  });
  stmt.step();
  var geometryColumn = stmt.getAsObject();
  return geometryColumn;
}
function getDataColumns(db, tableName) {
  var stmt;
  try {
    stmt = db.prepare('SELECT * FROM gpkg_data_columns WHERE table_name=:tableName;');
  } catch (error) {
    if (error.message.includes('no such table')) {
      return null;
    }
    throw error;
  }
  stmt.bind({
    ':tableName': tableName
  });
  var result = {};
  while (stmt.step()) {
    var column = stmt.getAsObject();
    var column_name = column.column_name,
      name = column.name;
    result[column_name] = name || null;
  }
  return result;
}
function getSchema(db, tableName) {
  var stmt = db.prepare("PRAGMA table_info(`".concat(tableName, "`)"));
  var fields = [];
  while (stmt.step()) {
    var pragmaTableInfo = stmt.getAsObject();
    var name = pragmaTableInfo.name,
      sqlType = pragmaTableInfo.type,
      notnull = pragmaTableInfo.notnull;
    var type = SQL_TYPE_MAPPING[sqlType];
    var field = {
      name: name,
      type: type,
      nullable: !notnull
    };
    fields.push(field);
  }
  return {
    fields: fields,
    metadata: {}
  };
}
function formatTablesAsGeojson(tables) {
  var geojsonMap = {};
  var _iterator2 = _createForOfIteratorHelper(tables.tables),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var table = _step2.value;
      geojsonMap[table.name] = table.table.data;
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return geojsonMap;
}
//# sourceMappingURL=parse-geopackage.js.map