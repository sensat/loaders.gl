import { Proj4Projection } from '@math.gl/proj4';
import { transformGeoJsonCoords } from '@loaders.gl/gis';
import { deserialize as deserializeGeoJson } from 'flatgeobuf/lib/cjs/geojson';
import { deserialize as deserializeGeneric } from 'flatgeobuf/lib/cjs/generic';
import { parseProperties as parsePropertiesBinary } from 'flatgeobuf/lib/cjs/generic/feature';
import { fromGeometry as binaryFromGeometry } from './binary-geometries';
function binaryFromFeature(feature, header) {
  const geometry = feature.geometry();
  const geometryType = header.geometryType || geometry.type();
  const parsedGeometry = binaryFromGeometry(geometry, geometryType);
  parsedGeometry.properties = parsePropertiesBinary(feature, header.columns);
  return parsedGeometry;
}
export function parseFlatGeobuf(arrayBuffer, options) {
  var _options$gis, _options$flatgeobuf;
  const shape = (options === null || options === void 0 ? void 0 : (_options$gis = options.gis) === null || _options$gis === void 0 ? void 0 : _options$gis.format) || (options === null || options === void 0 ? void 0 : (_options$flatgeobuf = options.flatgeobuf) === null || _options$flatgeobuf === void 0 ? void 0 : _options$flatgeobuf.shape);
  switch (shape) {
    case 'geojson-row-table':
      {
        const table = {
          shape: 'geojson-row-table',
          data: parseFlatGeobufToGeoJSON(arrayBuffer, options)
        };
        return table;
      }
    case 'columnar-table':
      return {
        shape: 'columnar-table',
        data: parseFlatGeobufToBinary(arrayBuffer, options)
      };
    case 'geojson':
      return parseFlatGeobufToGeoJSON(arrayBuffer, options);
    case 'binary':
      return parseFlatGeobufToBinary(arrayBuffer, options);
    default:
      throw new Error(shape);
  }
}
function parseFlatGeobufToBinary(arrayBuffer, options) {
  const array = new Uint8Array(arrayBuffer);
  return deserializeGeneric(array, binaryFromFeature);
}
function parseFlatGeobufToGeoJSON(arrayBuffer, options) {
  if (arrayBuffer.byteLength === 0) {
    return [];
  }
  const {
    reproject = false,
    _targetCrs = 'WGS84'
  } = options && options.gis || {};
  const arr = new Uint8Array(arrayBuffer);
  let headerMeta;
  const {
    features
  } = deserializeGeoJson(arr, false, header => {
    headerMeta = header;
  });
  const crs = headerMeta && headerMeta.crs;
  let projection;
  if (reproject && crs) {
    try {
      projection = new Proj4Projection({
        from: crs.wkt,
        to: _targetCrs
      });
    } catch (e) {}
  }
  if (projection) {
    return transformGeoJsonCoords(features, coords => projection.project(coords));
  }
  return features;
}
export function parseFlatGeobufInBatches(stream, options) {
  if (options && options.gis && options.gis.format === 'binary') {
    return parseFlatGeobufInBatchesToBinary(stream, options);
  }
  return parseFlatGeobufInBatchesToGeoJSON(stream, options);
}
function parseFlatGeobufInBatchesToBinary(stream, options) {
  const iterator = deserializeGeneric(stream, binaryFromFeature);
  return iterator;
}
async function* parseFlatGeobufInBatchesToGeoJSON(stream, options) {
  const {
    reproject = false,
    _targetCrs = 'WGS84'
  } = options && options.gis || {};
  let headerMeta;
  const iterator = deserializeGeoJson(stream, false, header => {
    headerMeta = header;
  });
  let projection;
  let firstRecord = true;
  for await (const feature of iterator) {
    if (firstRecord) {
      const crs = headerMeta && headerMeta.crs;
      if (reproject && crs) {
        projection = new Proj4Projection({
          from: crs.wkt,
          to: _targetCrs
        });
      }
      firstRecord = false;
    }
    if (reproject && projection) {
      yield transformGeoJsonCoords([feature], coords => projection.project(coords));
    } else {
      yield feature;
    }
  }
}
//# sourceMappingURL=parse-flatgeobuf.js.map