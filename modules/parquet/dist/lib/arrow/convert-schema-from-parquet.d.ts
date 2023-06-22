import { Schema, DataType } from '@loaders.gl/schema';
import type { ParquetSchema } from '../../parquetjs/schema/schema';
import type { ParquetType } from '../../parquetjs/schema/declare';
import { FileMetaData } from '../../parquetjs/parquet-thrift';
export declare const PARQUET_TYPE_MAPPING: {
    [type in ParquetType]: DataType;
};
export declare function convertParquetSchema(parquetSchema: ParquetSchema, parquetMetadata: FileMetaData | null): Schema;
//# sourceMappingURL=convert-schema-from-parquet.d.ts.map