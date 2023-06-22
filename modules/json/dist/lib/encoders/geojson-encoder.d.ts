import { TableBatch } from '@loaders.gl/schema';
export type GeoJSONWriterOptions = {
    geojson?: {
        featureArray?: boolean;
        geometryColumn?: number | null;
    };
    chunkSize?: number;
};
/**
 * Encode a table as GeoJSON
 */
export declare function encodeTableAsGeojsonInBatches(batchIterator: AsyncIterable<TableBatch>, // | Iterable<TableBatch>,
inputOpts?: GeoJSONWriterOptions): AsyncIterable<ArrayBuffer>;
//# sourceMappingURL=geojson-encoder.d.ts.map