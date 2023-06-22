import type { Writer, WriterOptions } from '@loaders.gl/loader-utils';
import { ColumnarTable } from './lib/encode-arrow';
type ArrowWriterOptions = WriterOptions & {
    arrow?: {};
};
/** Apache Arrow writer */
export declare const ArrowWriter: Writer<ColumnarTable, never, ArrowWriterOptions>;
export {};
//# sourceMappingURL=arrow-writer.d.ts.map