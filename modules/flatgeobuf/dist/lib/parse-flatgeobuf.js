"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFlatGeobufInBatches = exports.parseFlatGeobuf = void 0;
// @ts-nocheck
const proj4_1 = require("@math.gl/proj4");
const gis_1 = require("@loaders.gl/gis");
const geojson_1 = require("flatgeobuf/lib/cjs/geojson");
const generic_1 = require("flatgeobuf/lib/cjs/generic");
const feature_1 = require("flatgeobuf/lib/cjs/generic/feature");
const binary_geometries_1 = require("./binary-geometries");
// TODO: reproject binary features
function binaryFromFeature(feature, header) {
    const geometry = feature.geometry();
    // FlatGeobuf files can only hold a single geometry type per file, otherwise
    // GeometryType is GeometryCollection
    // I believe geometry.type() is null (0) except when the geometry type isn't
    // known in the header?
    const geometryType = header.geometryType || geometry.type();
    const parsedGeometry = (0, binary_geometries_1.fromGeometry)(geometry, geometryType);
    parsedGeometry.properties = (0, feature_1.parseProperties)(feature, header.columns);
    // TODO: wrap binary data either in points, lines, or polygons key
    return parsedGeometry;
}
/*
 * Parse FlatGeobuf arrayBuffer and return GeoJSON.
 *
 * @param arrayBuffer  A FlatGeobuf arrayBuffer
 * @return A GeoJSON geometry object
 */
function parseFlatGeobuf(arrayBuffer, options) {
    const shape = options?.gis?.format || options?.flatgeobuf?.shape;
    switch (shape) {
        case 'geojson-row-table': {
            const table = {
                shape: 'geojson-row-table',
                data: parseFlatGeobufToGeoJSON(arrayBuffer, options)
            };
            return table;
        }
        case 'columnar-table': // binary + some JS arrays
            return { shape: 'columnar-table', data: parseFlatGeobufToBinary(arrayBuffer, options) };
        case 'geojson':
            return parseFlatGeobufToGeoJSON(arrayBuffer, options);
        case 'binary':
            return parseFlatGeobufToBinary(arrayBuffer, options);
        default:
            throw new Error(shape);
    }
}
exports.parseFlatGeobuf = parseFlatGeobuf;
function parseFlatGeobufToBinary(arrayBuffer, options) {
    // TODO: reproject binary features
    // const {reproject = false, _targetCrs = 'WGS84'} = (options && options.gis) || {};
    const array = new Uint8Array(arrayBuffer);
    return (0, generic_1.deserialize)(array, binaryFromFeature);
}
function parseFlatGeobufToGeoJSON(arrayBuffer, options) {
    if (arrayBuffer.byteLength === 0) {
        return [];
    }
    const { reproject = false, _targetCrs = 'WGS84' } = (options && options.gis) || {};
    const arr = new Uint8Array(arrayBuffer);
    let headerMeta;
    const { features } = (0, geojson_1.deserialize)(arr, false, (header) => {
        headerMeta = header;
    });
    const crs = headerMeta && headerMeta.crs;
    let projection;
    if (reproject && crs) {
        // Constructing the projection may fail for some invalid WKT strings
        try {
            projection = new proj4_1.Proj4Projection({ from: crs.wkt, to: _targetCrs });
        }
        catch (e) {
            // no op
        }
    }
    if (projection) {
        return (0, gis_1.transformGeoJsonCoords)(features, (coords) => projection.project(coords));
    }
    return features;
}
/*
 * Parse FlatGeobuf arrayBuffer and return GeoJSON.
 *
 * @param {ReadableStream} _ A FlatGeobuf arrayBuffer
 * @return  A GeoJSON geometry object iterator
 */
// eslint-disable-next-line complexity
function parseFlatGeobufInBatches(stream, options) {
    if (options && options.gis && options.gis.format === 'binary') {
        return parseFlatGeobufInBatchesToBinary(stream, options);
    }
    return parseFlatGeobufInBatchesToGeoJSON(stream, options);
}
exports.parseFlatGeobufInBatches = parseFlatGeobufInBatches;
function parseFlatGeobufInBatchesToBinary(stream, options) {
    // TODO: reproject binary streaming features
    // const {reproject = false, _targetCrs = 'WGS84'} = (options && options.gis) || {};
    const iterator = (0, generic_1.deserialize)(stream, binaryFromFeature);
    return iterator;
}
// eslint-disable-next-line complexity
async function* parseFlatGeobufInBatchesToGeoJSON(stream, options) {
    const { reproject = false, _targetCrs = 'WGS84' } = (options && options.gis) || {};
    let headerMeta;
    const iterator = (0, geojson_1.deserialize)(stream, false, (header) => {
        headerMeta = header;
    });
    let projection;
    let firstRecord = true;
    for await (const feature of iterator) {
        if (firstRecord) {
            const crs = headerMeta && headerMeta.crs;
            if (reproject && crs) {
                projection = new proj4_1.Proj4Projection({ from: crs.wkt, to: _targetCrs });
            }
            firstRecord = false;
        }
        if (reproject && projection) {
            // eslint-disable-next-line
            yield (0, gis_1.transformGeoJsonCoords)([feature], (coords) => projection.project(coords));
        }
        else {
            yield feature;
        }
    }
}
