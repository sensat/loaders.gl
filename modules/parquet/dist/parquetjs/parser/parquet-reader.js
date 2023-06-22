"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParquetReader = void 0;
const schema_1 = require("../schema/schema");
const decoders_1 = require("./decoders");
const shred_1 = require("../schema/shred");
const constants_1 = require("../../constants");
const parquet_thrift_1 = require("../parquet-thrift");
const read_utils_1 = require("../utils/read-utils");
const decoders_2 = require("./decoders");
const DEFAULT_PROPS = {
    defaultDictionarySize: 1e6
};
/**
 * The parquet envelope reader allows direct, unbuffered access to the individual
 * sections of the parquet file, namely the header, footer and the row groups.
 * This class is intended for advanced/internal users; if you just want to retrieve
 * rows from a parquet file use the ParquetReader instead
 */
class ParquetReader {
    constructor(file, props) {
        this.metadata = null;
        this.file = file;
        this.props = { ...DEFAULT_PROPS, ...props };
    }
    close() {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.file.close();
    }
    // HIGH LEVEL METHODS
    /** Yield one row at a time */
    async *rowIterator(props) {
        for await (const rows of this.rowBatchIterator(props)) {
            // yield *rows
            for (const row of rows) {
                yield row;
            }
        }
    }
    /** Yield one batch of rows at a time */
    async *rowBatchIterator(props) {
        const schema = await this.getSchema();
        for await (const rowGroup of this.rowGroupIterator(props)) {
            yield (0, shred_1.materializeRows)(schema, rowGroup);
        }
    }
    /** Iterate over the raw row groups */
    async *rowGroupIterator(props) {
        // Ensure strings are nested in arrays
        const columnList = (props?.columnList || []).map((x) => Array.isArray(x) ? x : [x]);
        const metadata = await this.getFileMetadata();
        const schema = await this.getSchema();
        const rowGroupCount = metadata?.row_groups.length || 0;
        for (let rowGroupIndex = 0; rowGroupIndex < rowGroupCount; rowGroupIndex++) {
            const rowGroup = await this.readRowGroup(schema, metadata.row_groups[rowGroupIndex], columnList);
            yield rowGroup;
        }
    }
    async getRowCount() {
        const metadata = await this.getFileMetadata();
        return Number(metadata.num_rows);
    }
    async getSchema() {
        const metadata = await this.getFileMetadata();
        const root = metadata.schema[0];
        const { schema: schemaDefinition } = (0, decoders_1.decodeSchema)(metadata.schema, 1, root.num_children);
        const schema = new schema_1.ParquetSchema(schemaDefinition);
        return schema;
    }
    /**
     * Returns the user (key/value) metadata for this file
     * In parquet this is not stored on the schema like it is in arrow
     */
    async getSchemaMetadata() {
        const metadata = await this.getFileMetadata();
        const md = {};
        for (const kv of metadata.key_value_metadata) {
            md[kv.key] = kv.value;
        }
        return md;
    }
    async getFileMetadata() {
        if (!this.metadata) {
            await this.readHeader();
            this.metadata = this.readFooter();
        }
        return this.metadata;
    }
    // LOW LEVEL METHODS
    /** Metadata is stored in the footer */
    async readHeader() {
        const buffer = await this.file.read(0, constants_1.PARQUET_MAGIC.length);
        const magic = buffer.toString();
        switch (magic) {
            case constants_1.PARQUET_MAGIC:
                break;
            case constants_1.PARQUET_MAGIC_ENCRYPTED:
                throw new Error('Encrypted parquet file not supported');
            default:
                throw new Error(`Invalid parquet file (magic=${magic})`);
        }
    }
    /** Metadata is stored in the footer */
    async readFooter() {
        const trailerLen = constants_1.PARQUET_MAGIC.length + 4;
        const trailerBuf = await this.file.read(this.file.size - trailerLen, trailerLen);
        const magic = trailerBuf.slice(4).toString();
        if (magic !== constants_1.PARQUET_MAGIC) {
            throw new Error(`Not a valid parquet file (magic="${magic})`);
        }
        const metadataSize = trailerBuf.readUInt32LE(0);
        const metadataOffset = this.file.size - metadataSize - trailerLen;
        if (metadataOffset < constants_1.PARQUET_MAGIC.length) {
            throw new Error(`Invalid metadata size ${metadataOffset}`);
        }
        const metadataBuf = await this.file.read(metadataOffset, metadataSize);
        // let metadata = new parquet_thrift.FileMetaData();
        // parquet_util.decodeThrift(metadata, metadataBuf);
        const { metadata } = (0, read_utils_1.decodeFileMetadata)(metadataBuf);
        return metadata;
    }
    /** Data is stored in row groups (similar to Apache Arrow record batches) */
    async readRowGroup(schema, rowGroup, columnList) {
        const buffer = {
            rowCount: Number(rowGroup.num_rows),
            columnData: {}
        };
        for (const colChunk of rowGroup.columns) {
            const colMetadata = colChunk.meta_data;
            const colKey = colMetadata?.path_in_schema;
            if (columnList.length > 0 && (0, read_utils_1.fieldIndexOf)(columnList, colKey) < 0) {
                continue; // eslint-disable-line no-continue
            }
            buffer.columnData[colKey.join()] = await this.readColumnChunk(schema, colChunk);
        }
        return buffer;
    }
    /**
     * Each row group contains column chunks for all the columns.
     */
    async readColumnChunk(schema, colChunk) {
        if (colChunk.file_path !== undefined && colChunk.file_path !== null) {
            throw new Error('external references are not supported');
        }
        const field = schema.findField(colChunk.meta_data?.path_in_schema);
        const type = (0, read_utils_1.getThriftEnum)(parquet_thrift_1.Type, colChunk.meta_data?.type);
        if (type !== field.primitiveType) {
            throw new Error(`chunk type not matching schema: ${type}`);
        }
        const compression = (0, read_utils_1.getThriftEnum)(parquet_thrift_1.CompressionCodec, colChunk.meta_data?.codec);
        const pagesOffset = Number(colChunk.meta_data?.data_page_offset);
        let pagesSize = Number(colChunk.meta_data?.total_compressed_size);
        if (!colChunk.file_path) {
            pagesSize = Math.min(this.file.size - pagesOffset, Number(colChunk.meta_data?.total_compressed_size));
        }
        const options = {
            type,
            rLevelMax: field.rLevelMax,
            dLevelMax: field.dLevelMax,
            compression,
            column: field,
            numValues: colChunk.meta_data?.num_values,
            dictionary: []
        };
        let dictionary;
        const dictionaryPageOffset = colChunk?.meta_data?.dictionary_page_offset;
        if (dictionaryPageOffset) {
            const dictionaryOffset = Number(dictionaryPageOffset);
            // Getting dictionary from column chunk to iterate all over indexes to get dataPage values.
            dictionary = await this.getDictionary(dictionaryOffset, options, pagesOffset);
        }
        dictionary = options.dictionary?.length ? options.dictionary : dictionary;
        const pagesBuf = await this.file.read(pagesOffset, pagesSize);
        return await (0, decoders_2.decodeDataPages)(pagesBuf, { ...options, dictionary });
    }
    /**
     * Getting dictionary for allows to flatten values by indices.
     * @param dictionaryPageOffset
     * @param options
     * @param pagesOffset
     * @returns
     */
    async getDictionary(dictionaryPageOffset, options, pagesOffset) {
        if (dictionaryPageOffset === 0) {
            // dictionarySize = Math.min(this.fileSize - pagesOffset, this.defaultDictionarySize);
            // pagesBuf = await this.read(pagesOffset, dictionarySize);
            // In this case we are working with parquet-mr files format. Problem is described below:
            // https://stackoverflow.com/questions/55225108/why-is-dictionary-page-offset-0-for-plain-dictionary-encoding
            // We need to get dictionary page from column chunk if it exists.
            // Now if we use code commented above we don't get DICTIONARY_PAGE we get DATA_PAGE instead.
            return [];
        }
        const dictionarySize = Math.min(this.file.size - dictionaryPageOffset, this.props.defaultDictionarySize);
        const pagesBuf = await this.file.read(dictionaryPageOffset, dictionarySize);
        const cursor = { buffer: pagesBuf, offset: 0, size: pagesBuf.length };
        const decodedPage = await (0, decoders_2.decodePage)(cursor, options);
        return decodedPage.dictionary;
    }
}
exports.ParquetReader = ParquetReader;
