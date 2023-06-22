"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParquetEnvelopeWriter = exports.ParquetEncoder = void 0;
const codecs_1 = require("../codecs");
const Compression = __importStar(require("../compression"));
const Shred = __importStar(require("../schema/shred"));
const parquet_thrift_1 = require("../parquet-thrift");
const file_utils_1 = require("../utils/file-utils");
const read_utils_1 = require("../utils/read-utils");
const node_int64_1 = __importDefault(require("node-int64"));
/**
 * Parquet File Magic String
 */
const PARQUET_MAGIC = 'PAR1';
/**
 * Parquet File Format Version
 */
const PARQUET_VERSION = 1;
/**
 * Default Page and Row Group sizes
 */
const PARQUET_DEFAULT_PAGE_SIZE = 8192;
const PARQUET_DEFAULT_ROW_GROUP_SIZE = 4096;
/**
 * Repetition and Definition Level Encoding
 */
const PARQUET_RDLVL_TYPE = 'INT32';
const PARQUET_RDLVL_ENCODING = 'RLE';
/**
 * Write a parquet file to an output stream. The ParquetEncoder will perform
 * buffering/batching for performance, so close() must be called after all rows
 * are written.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class ParquetEncoder {
    /**
     * Convenience method to create a new buffered parquet writer that writes to
     * the specified file
     */
    static async openFile(schema, path, opts) {
        const outputStream = await (0, file_utils_1.osopen)(path, opts);
        return ParquetEncoder.openStream(schema, outputStream, opts);
    }
    /**
     * Convenience method to create a new buffered parquet writer that writes to
     * the specified stream
     */
    static async openStream(schema, outputStream, opts = {}) {
        const envelopeWriter = await ParquetEnvelopeWriter.openStream(schema, outputStream, opts);
        return new ParquetEncoder(schema, envelopeWriter, opts);
    }
    /**
     * Create a new buffered parquet writer for a given envelope writer
     */
    constructor(schema, envelopeWriter, opts) {
        this.schema = schema;
        this.envelopeWriter = envelopeWriter;
        // @ts-ignore Row buffer typings...
        this.rowBuffer = {};
        this.rowGroupSize = opts.rowGroupSize || PARQUET_DEFAULT_ROW_GROUP_SIZE;
        this.closed = false;
        this.userMetadata = {};
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.writeHeader();
    }
    async writeHeader() {
        // TODO - better not mess with promises in the constructor
        try {
            await this.envelopeWriter.writeHeader();
        }
        catch (err) {
            await this.envelopeWriter.close();
            throw err;
        }
    }
    /**
     * Append a single row to the parquet file. Rows are buffered in memory until
     * rowGroupSize rows are in the buffer or close() is called
     */
    async appendRow(row) {
        if (this.closed) {
            throw new Error('writer was closed');
        }
        Shred.shredRecord(this.schema, row, this.rowBuffer);
        if (this.rowBuffer.rowCount >= this.rowGroupSize) {
            // @ts-ignore
            this.rowBuffer = {};
        }
    }
    /**
     * Finish writing the parquet file and commit the footer to disk. This method
     * MUST be called after you are finished adding rows. You must not call this
     * method twice on the same object or add any rows after the close() method has
     * been called
     */
    async close(callback) {
        if (this.closed) {
            throw new Error('writer was closed');
        }
        this.closed = true;
        if (this.rowBuffer.rowCount > 0 || this.rowBuffer.rowCount >= this.rowGroupSize) {
            // @ts-ignore
            this.rowBuffer = {};
        }
        await this.envelopeWriter.writeFooter(this.userMetadata);
        await this.envelopeWriter.close();
        // this.envelopeWriter = null;
        if (callback) {
            callback();
        }
    }
    /**
     * Add key<>value metadata to the file
     */
    setMetadata(key, value) {
        // TODO: value to be any, obj -> JSON
        this.userMetadata[String(key)] = String(value);
    }
    /**
     * Set the parquet row group size. This values controls the maximum number
     * of rows that are buffered in memory at any given time as well as the number
     * of rows that are co-located on disk. A higher value is generally better for
     * read-time I/O performance at the tradeoff of write-time memory usage.
     */
    setRowGroupSize(cnt) {
        this.rowGroupSize = cnt;
    }
    /**
     * Set the parquet data page size. The data page size controls the maximum
     * number of column values that are written to disk as a consecutive array
     */
    setPageSize(cnt) {
        this.envelopeWriter.setPageSize(cnt);
    }
}
exports.ParquetEncoder = ParquetEncoder;
/**
 * Create a parquet file from a schema and a number of row groups. This class
 * performs direct, unbuffered writes to the underlying output stream and is
 * intendend for advanced and internal users; the writeXXX methods must be
 * called in the correct order to produce a valid file.
 */
class ParquetEnvelopeWriter {
    /**
     * Create a new parquet envelope writer that writes to the specified stream
     */
    static async openStream(schema, outputStream, opts) {
        const writeFn = file_utils_1.oswrite.bind(undefined, outputStream);
        const closeFn = file_utils_1.osclose.bind(undefined, outputStream);
        return new ParquetEnvelopeWriter(schema, writeFn, closeFn, 0, opts);
    }
    constructor(schema, writeFn, closeFn, fileOffset, opts) {
        this.schema = schema;
        this.write = writeFn;
        this.close = closeFn;
        this.offset = fileOffset;
        this.rowCount = 0;
        this.rowGroups = [];
        this.pageSize = opts.pageSize || PARQUET_DEFAULT_PAGE_SIZE;
        this.useDataPageV2 = 'useDataPageV2' in opts ? Boolean(opts.useDataPageV2) : false;
    }
    writeSection(buf) {
        this.offset += buf.length;
        return this.write(buf);
    }
    /**
     * Encode the parquet file header
     */
    writeHeader() {
        return this.writeSection(Buffer.from(PARQUET_MAGIC));
    }
    /**
     * Encode a parquet row group. The records object should be created using the
     * shredRecord method
     */
    async writeRowGroup(records) {
        const rgroup = await encodeRowGroup(this.schema, records, {
            baseOffset: this.offset,
            pageSize: this.pageSize,
            useDataPageV2: this.useDataPageV2
        });
        this.rowCount += records.rowCount;
        this.rowGroups.push(rgroup.metadata);
        return await this.writeSection(rgroup.body);
    }
    /**
     * Write the parquet file footer
     */
    writeFooter(userMetadata) {
        if (!userMetadata) {
            // tslint:disable-next-line:no-parameter-reassignment
            userMetadata = {};
        }
        return this.writeSection(encodeFooter(this.schema, this.rowCount, this.rowGroups, userMetadata));
    }
    /**
     * Set the parquet data page size. The data page size controls the maximum
     * number of column values that are written to disk as a consecutive array
     */
    setPageSize(cnt) {
        this.pageSize = cnt;
    }
}
exports.ParquetEnvelopeWriter = ParquetEnvelopeWriter;
/**
 * Create a parquet transform stream
export class ParquetTransformer<T> extends stream.Transform {
  public writer: ParquetEncoder<T>;

  constructor(schema: ParquetSchema, opts: ParquetEncoderOptions = {}) {
    super({objectMode: true});

    const writeProxy = (function (t: ParquetTransformer<any>) {
      return async function (b: any): Promise<void> {
        t.push(b);
      };
    })(this);

    this.writer = new ParquetEncoder(
      schema,
      new ParquetEnvelopeWriter(schema, writeProxy, async () => {}, 0, opts),
      opts
    );
  }

  // tslint:disable-next-line:function-name
  _transform(row: any, encoding: string, callback: (val?: any) => void): Promise<void> {
    if (row) {
      return this.writer.appendRow(row).then(callback);
    }
    callback();
    return Promise.resolve();
  }

  // tslint:disable-next-line:function-name
  async _flush(callback: (val?: any) => void) {
    await this.writer.close(callback);
  }
}
 */
/**
 * Encode a consecutive array of data using one of the parquet encodings
 */
function encodeValues(type, encoding, values, opts) {
    if (!(encoding in codecs_1.PARQUET_CODECS)) {
        throw new Error(`invalid encoding: ${encoding}`);
    }
    return codecs_1.PARQUET_CODECS[encoding].encodeValues(type, values, opts);
}
/**
 * Encode a parquet data page
 */
async function encodeDataPage(column, data) {
    /* encode repetition and definition levels */
    let rLevelsBuf = Buffer.alloc(0);
    if (column.rLevelMax > 0) {
        rLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.rlevels, {
            bitWidth: (0, read_utils_1.getBitWidth)(column.rLevelMax)
            // disableEnvelope: false
        });
    }
    let dLevelsBuf = Buffer.alloc(0);
    if (column.dLevelMax > 0) {
        dLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.dlevels, {
            bitWidth: (0, read_utils_1.getBitWidth)(column.dLevelMax)
            // disableEnvelope: false
        });
    }
    /* encode values */
    const valuesBuf = encodeValues(column.primitiveType, column.encoding, data.values, {
        typeLength: column.typeLength,
        bitWidth: column.typeLength
    });
    const dataBuf = Buffer.concat([rLevelsBuf, dLevelsBuf, valuesBuf]);
    // compression = column.compression === 'UNCOMPRESSED' ? (compression || 'UNCOMPRESSED') : column.compression;
    const compressedBuf = await Compression.deflate(column.compression, dataBuf);
    /* build page header */
    const header = new parquet_thrift_1.PageHeader({
        type: parquet_thrift_1.PageType.DATA_PAGE,
        data_page_header: new parquet_thrift_1.DataPageHeader({
            num_values: data.count,
            encoding: parquet_thrift_1.Encoding[column.encoding],
            definition_level_encoding: parquet_thrift_1.Encoding[PARQUET_RDLVL_ENCODING],
            repetition_level_encoding: parquet_thrift_1.Encoding[PARQUET_RDLVL_ENCODING] // [PARQUET_RDLVL_ENCODING]
        }),
        uncompressed_page_size: dataBuf.length,
        compressed_page_size: compressedBuf.length
    });
    /* concat page header, repetition and definition levels and values */
    const headerBuf = (0, read_utils_1.serializeThrift)(header);
    const page = Buffer.concat([headerBuf, compressedBuf]);
    return { header, headerSize: headerBuf.length, page };
}
/**
 * Encode a parquet data page (v2)
 */
async function encodeDataPageV2(column, data, rowCount) {
    /* encode values */
    const valuesBuf = encodeValues(column.primitiveType, column.encoding, data.values, {
        typeLength: column.typeLength,
        bitWidth: column.typeLength
    });
    // compression = column.compression === 'UNCOMPRESSED' ? (compression || 'UNCOMPRESSED') : column.compression;
    const compressedBuf = await Compression.deflate(column.compression, valuesBuf);
    /* encode repetition and definition levels */
    let rLevelsBuf = Buffer.alloc(0);
    if (column.rLevelMax > 0) {
        rLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.rlevels, {
            bitWidth: (0, read_utils_1.getBitWidth)(column.rLevelMax),
            disableEnvelope: true
        });
    }
    let dLevelsBuf = Buffer.alloc(0);
    if (column.dLevelMax > 0) {
        dLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.dlevels, {
            bitWidth: (0, read_utils_1.getBitWidth)(column.dLevelMax),
            disableEnvelope: true
        });
    }
    /* build page header */
    const header = new parquet_thrift_1.PageHeader({
        type: parquet_thrift_1.PageType.DATA_PAGE_V2,
        data_page_header_v2: new parquet_thrift_1.DataPageHeaderV2({
            num_values: data.count,
            num_nulls: data.count - data.values.length,
            num_rows: rowCount,
            encoding: parquet_thrift_1.Encoding[column.encoding],
            definition_levels_byte_length: dLevelsBuf.length,
            repetition_levels_byte_length: rLevelsBuf.length,
            is_compressed: column.compression !== 'UNCOMPRESSED'
        }),
        uncompressed_page_size: rLevelsBuf.length + dLevelsBuf.length + valuesBuf.length,
        compressed_page_size: rLevelsBuf.length + dLevelsBuf.length + compressedBuf.length
    });
    /* concat page header, repetition and definition levels and values */
    const headerBuf = (0, read_utils_1.serializeThrift)(header);
    const page = Buffer.concat([headerBuf, rLevelsBuf, dLevelsBuf, compressedBuf]);
    return { header, headerSize: headerBuf.length, page };
}
/**
 * Encode an array of values into a parquet column chunk
 */
async function encodeColumnChunk(column, buffer, offset, opts) {
    const data = buffer.columnData[column.path.join()];
    const baseOffset = (opts.baseOffset || 0) + offset;
    /* encode data page(s) */
    // const pages: Buffer[] = [];
    let pageBuf;
    // tslint:disable-next-line:variable-name
    let total_uncompressed_size = 0;
    // tslint:disable-next-line:variable-name
    let total_compressed_size = 0;
    {
        const result = opts.useDataPageV2
            ? await encodeDataPageV2(column, data, buffer.rowCount)
            : await encodeDataPage(column, data);
        // pages.push(result.page);
        pageBuf = result.page;
        total_uncompressed_size += result.header.uncompressed_page_size + result.headerSize;
        total_compressed_size += result.header.compressed_page_size + result.headerSize;
    }
    // const pagesBuf = Buffer.concat(pages);
    // const compression = column.compression === 'UNCOMPRESSED' ? (opts.compression || 'UNCOMPRESSED') : column.compression;
    /* prepare metadata header */
    const metadata = new parquet_thrift_1.ColumnMetaData({
        path_in_schema: column.path,
        num_values: data.count,
        data_page_offset: baseOffset,
        encodings: [],
        total_uncompressed_size,
        total_compressed_size,
        type: parquet_thrift_1.Type[column.primitiveType],
        codec: parquet_thrift_1.CompressionCodec[column.compression]
    });
    /* list encodings */
    metadata.encodings.push(parquet_thrift_1.Encoding[PARQUET_RDLVL_ENCODING]);
    metadata.encodings.push(parquet_thrift_1.Encoding[column.encoding]);
    /* concat metadata header and data pages */
    const metadataOffset = baseOffset + pageBuf.length;
    const body = Buffer.concat([pageBuf, (0, read_utils_1.serializeThrift)(metadata)]);
    return { body, metadata, metadataOffset };
}
/**
 * Encode a list of column values into a parquet row group
 */
async function encodeRowGroup(schema, data, opts) {
    const metadata = new parquet_thrift_1.RowGroup({
        num_rows: data.rowCount,
        columns: [],
        total_byte_size: 0
    });
    let body = Buffer.alloc(0);
    for (const field of schema.fieldList) {
        if (field.isNested) {
            continue; // eslint-disable-line no-continue
        }
        const cchunkData = await encodeColumnChunk(field, data, body.length, opts);
        const cchunk = new parquet_thrift_1.ColumnChunk({
            file_offset: cchunkData.metadataOffset,
            meta_data: cchunkData.metadata
        });
        metadata.columns.push(cchunk);
        metadata.total_byte_size = new node_int64_1.default(Number(metadata.total_byte_size) + cchunkData.body.length);
        body = Buffer.concat([body, cchunkData.body]);
    }
    return { body, metadata };
}
/**
 * Encode a parquet file metadata footer
 */
function encodeFooter(schema, rowCount, rowGroups, userMetadata) {
    const metadata = new parquet_thrift_1.FileMetaData({
        version: PARQUET_VERSION,
        created_by: 'parquets',
        num_rows: rowCount,
        row_groups: rowGroups,
        schema: [],
        key_value_metadata: []
    });
    for (const key in userMetadata) {
        const kv = new parquet_thrift_1.KeyValue({
            key,
            value: userMetadata[key]
        });
        metadata.key_value_metadata?.push?.(kv);
    }
    {
        const schemaRoot = new parquet_thrift_1.SchemaElement({
            name: 'root',
            num_children: Object.keys(schema.fields).length
        });
        metadata.schema.push(schemaRoot);
    }
    for (const field of schema.fieldList) {
        const relt = parquet_thrift_1.FieldRepetitionType[field.repetitionType];
        const schemaElem = new parquet_thrift_1.SchemaElement({
            name: field.name,
            repetition_type: relt
        });
        if (field.isNested) {
            schemaElem.num_children = field.fieldCount;
        }
        else {
            schemaElem.type = parquet_thrift_1.Type[field.primitiveType];
        }
        if (field.originalType) {
            schemaElem.converted_type = parquet_thrift_1.ConvertedType[field.originalType];
        }
        schemaElem.type_length = field.typeLength;
        metadata.schema.push(schemaElem);
    }
    const metadataEncoded = (0, read_utils_1.serializeThrift)(metadata);
    const footerEncoded = Buffer.alloc(metadataEncoded.length + 8);
    metadataEncoded.copy(footerEncoded);
    footerEncoded.writeUInt32LE(metadataEncoded.length, metadataEncoded.length);
    footerEncoded.write(PARQUET_MAGIC, metadataEncoded.length + 4);
    return footerEncoded;
}
