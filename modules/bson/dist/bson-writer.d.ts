import type { Writer, WriterOptions } from '@loaders.gl/loader-utils';
import type { EncodeBSONOptions } from './lib/encoders/encode-bson';
export type BSONWriterOptions = WriterOptions & {
    bson?: EncodeBSONOptions;
};
export declare const BSONWriter: Writer<Record<string, unknown>, never, BSONWriterOptions>;
//# sourceMappingURL=bson-writer.d.ts.map