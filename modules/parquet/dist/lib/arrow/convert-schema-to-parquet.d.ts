import type { ParquetType } from '../../parquetjs/schema/declare';
import { Schema, DataType } from '@loaders.gl/schema';
export declare const PARQUET_TYPE_MAPPING: {
    [type in ParquetType]: DataType;
};
export declare function convertToParquetSchema(schema: Schema): Schema;
//# sourceMappingURL=convert-schema-to-parquet.d.ts.map