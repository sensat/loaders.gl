import initSqlJs from 'sql.js';
import { WKBLoader } from '@loaders.gl/wkt';
import { binaryToGeometry, transformGeoJsonCoords } from '@loaders.gl/gis';
import { Proj4Projection } from '@math.gl/proj4';
export const DEFAULT_SQLJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.5.0/';
const ENVELOPE_BYTE_LENGTHS = {
  0: 0,
  1: 32,
  2: 48,
  3: 48,
  4: 64,
  5: 0,
  6: 0,
  7: 0
};
const SQL_TYPE_MAPPING = {
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
export default async function parseGeoPackage(arrayBuffer, options) {
  const {
    sqlJsCDN = DEFAULT_SQLJS_CDN
  } = (options === null || options === void 0 ? void 0 : options.geopackage) || {};
  const {
    reproject = false,
    _targetCrs = 'WGS84',
    format = 'tables'
  } = (options === null || options === void 0 ? void 0 : options.gis) || {};
  const db = await loadDatabase(arrayBuffer, sqlJsCDN);
  const tables = listVectorTables(db);
  const projections = getProjections(db);
  const outputTables = {
    shape: 'tables',
    tables: []
  };
  for (const table of tables) {
    const {
      table_name: tableName
    } = table;
    outputTables.tables.push({
      name: tableName,
      table: getVectorTable(db, tableName, projections, {
        reproject,
        _targetCrs
      })
    });
  }
  if (format === 'geojson') {
    return formatTablesAsGeojson(outputTables);
  }
  return outputTables;
}
async function loadDatabase(arrayBuffer, sqlJsCDN) {
  let SQL;
  if (sqlJsCDN) {
    SQL = await initSqlJs({
      locateFile: file => "".concat(sqlJsCDN).concat(file)
    });
  } else {
    SQL = await initSqlJs();
  }
  return new SQL.Database(new Uint8Array(arrayBuffer));
}
function listVectorTables(db) {
  const stmt = db.prepare("SELECT * FROM gpkg_contents WHERE data_type='features';");
  const vectorTablesInfo = [];
  while (stmt.step()) {
    const vectorTableInfo = stmt.getAsObject();
    vectorTablesInfo.push(vectorTableInfo);
  }
  return vectorTablesInfo;
}
function getVectorTable(db, tableName, projections, _ref) {
  let {
    reproject,
    _targetCrs
  } = _ref;
  const dataColumns = getDataColumns(db, tableName);
  const geomColumn = getGeometryColumn(db, tableName);
  const featureIdColumn = getFeatureIdName(db, tableName);
  const {
    columns,
    values
  } = db.exec("SELECT * FROM `".concat(tableName, "`;"))[0];
  let projection;
  if (reproject) {
    const geomColumnProjStr = projections[geomColumn.srs_id];
    projection = new Proj4Projection({
      from: geomColumnProjStr,
      to: _targetCrs
    });
  }
  const geojsonFeatures = [];
  for (const row of values) {
    const geojsonFeature = constructGeoJsonFeature(columns, row, geomColumn, dataColumns, featureIdColumn);
    geojsonFeatures.push(geojsonFeature);
  }
  const schema = getSchema(db, tableName);
  if (projection) {
    return {
      shape: 'object-row-table',
      data: transformGeoJsonCoords(geojsonFeatures, projection.project),
      schema
    };
  }
  return {
    data: geojsonFeatures,
    schema,
    shape: 'object-row-table'
  };
}
function getProjections(db) {
  const stmt = db.prepare('SELECT * FROM gpkg_spatial_ref_sys;');
  const projectionMapping = {};
  while (stmt.step()) {
    const srsInfo = stmt.getAsObject();
    const {
      srs_id,
      definition
    } = srsInfo;
    projectionMapping[srs_id] = definition;
  }
  return projectionMapping;
}
function constructGeoJsonFeature(columns, row, geomColumn, dataColumns, featureIdColumn) {
  const idIdx = columns.indexOf(featureIdColumn);
  const id = row[idIdx];
  const geomColumnIdx = columns.indexOf(geomColumn.column_name);
  const geometry = parseGeometry(row[geomColumnIdx].buffer);
  const properties = {};
  if (dataColumns) {
    for (const [key, value] of Object.entries(dataColumns)) {
      const idx = columns.indexOf(key);
      properties[value] = row[idx];
    }
  } else {
    for (let i = 0; i < columns.length; i++) {
      if (i === idIdx || i === geomColumnIdx) {
        continue;
      }
      const columnName = columns[i];
      properties[columnName] = row[i];
    }
  }
  return {
    id,
    type: 'Feature',
    geometry,
    properties
  };
}
function getGeopackageVersion(db) {
  const textDecoder = new TextDecoder();
  const applicationIdQuery = db.exec('PRAGMA application_id;')[0];
  const applicationId = applicationIdQuery.values[0][0];
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setInt32(0, Number(applicationId));
  const versionString = textDecoder.decode(buffer);
  if (versionString === 'GP10') {
    return '1.0';
  }
  if (versionString === 'GP11') {
    return '1.1';
  }
  const userVersionQuery = db.exec('PRAGMA user_version;')[0];
  const userVersionInt = userVersionQuery.values[0][0];
  if (userVersionInt && typeof userVersionInt === 'number' && userVersionInt < 10300) {
    return '1.2';
  }
  return null;
}
function getFeatureIdName(db, tableName) {
  const stmt = db.prepare("PRAGMA table_info(`".concat(tableName, "`)"));
  while (stmt.step()) {
    const pragmaTableInfo = stmt.getAsObject();
    const {
      name,
      pk
    } = pragmaTableInfo;
    if (pk) {
      return name;
    }
  }
  return null;
}
function parseGeometry(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const {
    envelopeLength,
    emptyGeometry
  } = parseGeometryBitFlags(view.getUint8(3));
  if (emptyGeometry) {
    return null;
  }
  const wkbOffset = 8 + envelopeLength;
  const binaryGeometry = WKBLoader.parseSync(arrayBuffer.slice(wkbOffset));
  return binaryToGeometry(binaryGeometry);
}
function parseGeometryBitFlags(byte) {
  const envelopeValue = (byte & 0b00001110) / 2;
  const envelopeLength = ENVELOPE_BYTE_LENGTHS[envelopeValue];
  return {
    littleEndian: Boolean(byte & 0b00000001),
    envelopeLength,
    emptyGeometry: Boolean(byte & 0b00010000),
    extendedGeometryType: Boolean(byte & 0b00100000)
  };
}
function getGeometryColumn(db, tableName) {
  const stmt = db.prepare('SELECT * FROM gpkg_geometry_columns WHERE table_name=:tableName;');
  stmt.bind({
    ':tableName': tableName
  });
  stmt.step();
  const geometryColumn = stmt.getAsObject();
  return geometryColumn;
}
function getDataColumns(db, tableName) {
  let stmt;
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
  const result = {};
  while (stmt.step()) {
    const column = stmt.getAsObject();
    const {
      column_name,
      name
    } = column;
    result[column_name] = name || null;
  }
  return result;
}
function getSchema(db, tableName) {
  const stmt = db.prepare("PRAGMA table_info(`".concat(tableName, "`)"));
  const fields = [];
  while (stmt.step()) {
    const pragmaTableInfo = stmt.getAsObject();
    const {
      name,
      type: sqlType,
      notnull
    } = pragmaTableInfo;
    const type = SQL_TYPE_MAPPING[sqlType];
    const field = {
      name,
      type,
      nullable: !notnull
    };
    fields.push(field);
  }
  return {
    fields,
    metadata: {}
  };
}
function formatTablesAsGeojson(tables) {
  const geojsonMap = {};
  for (const table of tables.tables) {
    geojsonMap[table.name] = table.table.data;
  }
  return geojsonMap;
}
//# sourceMappingURL=parse-geopackage.js.map