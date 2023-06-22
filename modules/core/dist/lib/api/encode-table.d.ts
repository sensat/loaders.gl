import { Writer, WriterOptionsType } from '@loaders.gl/loader-utils';
import { Table } from '@loaders.gl/schema';
export declare function encodeTable<WriterT extends Writer = Writer>(data: Table, writer: WriterT, options?: WriterOptionsType<WriterT>): Promise<ArrayBuffer>;
export declare function encodeTableAsText<WriterT extends Writer = Writer>(data: Table, writer: WriterT, options?: WriterOptionsType<WriterT>): Promise<string>;
export declare function encodeTableInBatches<WriterT extends Writer = Writer>(data: Table, writer: WriterT, options?: WriterOptionsType<WriterT>): AsyncIterable<ArrayBuffer>;
//# sourceMappingURL=encode-table.d.ts.map