import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { ParquetSchema } from '../schema/schema';
import { decodeSchema } from './decoders';
import { materializeRows } from '../schema/shred';
import { PARQUET_MAGIC, PARQUET_MAGIC_ENCRYPTED } from '../../constants';
import { CompressionCodec, Type } from '../parquet-thrift';
import { decodeFileMetadata, getThriftEnum, fieldIndexOf } from '../utils/read-utils';
import { decodeDataPages, decodePage } from './decoders';
const DEFAULT_PROPS = {
  defaultDictionarySize: 1e6
};
export class ParquetReader {
  constructor(file, props) {
    _defineProperty(this, "props", void 0);
    _defineProperty(this, "file", void 0);
    _defineProperty(this, "metadata", null);
    this.file = file;
    this.props = {
      ...DEFAULT_PROPS,
      ...props
    };
  }
  close() {
    this.file.close();
  }
  async *rowIterator(props) {
    for await (const rows of this.rowBatchIterator(props)) {
      for (const row of rows) {
        yield row;
      }
    }
  }
  async *rowBatchIterator(props) {
    const schema = await this.getSchema();
    for await (const rowGroup of this.rowGroupIterator(props)) {
      yield materializeRows(schema, rowGroup);
    }
  }
  async *rowGroupIterator(props) {
    const columnList = ((props === null || props === void 0 ? void 0 : props.columnList) || []).map(x => Array.isArray(x) ? x : [x]);
    const metadata = await this.getFileMetadata();
    const schema = await this.getSchema();
    const rowGroupCount = (metadata === null || metadata === void 0 ? void 0 : metadata.row_groups.length) || 0;
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
    const {
      schema: schemaDefinition
    } = decodeSchema(metadata.schema, 1, root.num_children);
    const schema = new ParquetSchema(schemaDefinition);
    return schema;
  }
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
  async readHeader() {
    const buffer = await this.file.read(0, PARQUET_MAGIC.length);
    const magic = buffer.toString();
    switch (magic) {
      case PARQUET_MAGIC:
        break;
      case PARQUET_MAGIC_ENCRYPTED:
        throw new Error('Encrypted parquet file not supported');
      default:
        throw new Error("Invalid parquet file (magic=".concat(magic, ")"));
    }
  }
  async readFooter() {
    const trailerLen = PARQUET_MAGIC.length + 4;
    const trailerBuf = await this.file.read(this.file.size - trailerLen, trailerLen);
    const magic = trailerBuf.slice(4).toString();
    if (magic !== PARQUET_MAGIC) {
      throw new Error("Not a valid parquet file (magic=\"".concat(magic, ")"));
    }
    const metadataSize = trailerBuf.readUInt32LE(0);
    const metadataOffset = this.file.size - metadataSize - trailerLen;
    if (metadataOffset < PARQUET_MAGIC.length) {
      throw new Error("Invalid metadata size ".concat(metadataOffset));
    }
    const metadataBuf = await this.file.read(metadataOffset, metadataSize);
    const {
      metadata
    } = decodeFileMetadata(metadataBuf);
    return metadata;
  }
  async readRowGroup(schema, rowGroup, columnList) {
    const buffer = {
      rowCount: Number(rowGroup.num_rows),
      columnData: {}
    };
    for (const colChunk of rowGroup.columns) {
      const colMetadata = colChunk.meta_data;
      const colKey = colMetadata === null || colMetadata === void 0 ? void 0 : colMetadata.path_in_schema;
      if (columnList.length > 0 && fieldIndexOf(columnList, colKey) < 0) {
        continue;
      }
      buffer.columnData[colKey.join()] = await this.readColumnChunk(schema, colChunk);
    }
    return buffer;
  }
  async readColumnChunk(schema, colChunk) {
    var _colChunk$meta_data, _colChunk$meta_data2, _colChunk$meta_data3, _colChunk$meta_data4, _colChunk$meta_data5, _colChunk$meta_data7, _colChunk$meta_data8, _options$dictionary;
    if (colChunk.file_path !== undefined && colChunk.file_path !== null) {
      throw new Error('external references are not supported');
    }
    const field = schema.findField((_colChunk$meta_data = colChunk.meta_data) === null || _colChunk$meta_data === void 0 ? void 0 : _colChunk$meta_data.path_in_schema);
    const type = getThriftEnum(Type, (_colChunk$meta_data2 = colChunk.meta_data) === null || _colChunk$meta_data2 === void 0 ? void 0 : _colChunk$meta_data2.type);
    if (type !== field.primitiveType) {
      throw new Error("chunk type not matching schema: ".concat(type));
    }
    const compression = getThriftEnum(CompressionCodec, (_colChunk$meta_data3 = colChunk.meta_data) === null || _colChunk$meta_data3 === void 0 ? void 0 : _colChunk$meta_data3.codec);
    const pagesOffset = Number((_colChunk$meta_data4 = colChunk.meta_data) === null || _colChunk$meta_data4 === void 0 ? void 0 : _colChunk$meta_data4.data_page_offset);
    let pagesSize = Number((_colChunk$meta_data5 = colChunk.meta_data) === null || _colChunk$meta_data5 === void 0 ? void 0 : _colChunk$meta_data5.total_compressed_size);
    if (!colChunk.file_path) {
      var _colChunk$meta_data6;
      pagesSize = Math.min(this.file.size - pagesOffset, Number((_colChunk$meta_data6 = colChunk.meta_data) === null || _colChunk$meta_data6 === void 0 ? void 0 : _colChunk$meta_data6.total_compressed_size));
    }
    const options = {
      type,
      rLevelMax: field.rLevelMax,
      dLevelMax: field.dLevelMax,
      compression,
      column: field,
      numValues: (_colChunk$meta_data7 = colChunk.meta_data) === null || _colChunk$meta_data7 === void 0 ? void 0 : _colChunk$meta_data7.num_values,
      dictionary: []
    };
    let dictionary;
    const dictionaryPageOffset = colChunk === null || colChunk === void 0 ? void 0 : (_colChunk$meta_data8 = colChunk.meta_data) === null || _colChunk$meta_data8 === void 0 ? void 0 : _colChunk$meta_data8.dictionary_page_offset;
    if (dictionaryPageOffset) {
      const dictionaryOffset = Number(dictionaryPageOffset);
      dictionary = await this.getDictionary(dictionaryOffset, options, pagesOffset);
    }
    dictionary = (_options$dictionary = options.dictionary) !== null && _options$dictionary !== void 0 && _options$dictionary.length ? options.dictionary : dictionary;
    const pagesBuf = await this.file.read(pagesOffset, pagesSize);
    return await decodeDataPages(pagesBuf, {
      ...options,
      dictionary
    });
  }
  async getDictionary(dictionaryPageOffset, options, pagesOffset) {
    if (dictionaryPageOffset === 0) {
      return [];
    }
    const dictionarySize = Math.min(this.file.size - dictionaryPageOffset, this.props.defaultDictionarySize);
    const pagesBuf = await this.file.read(dictionaryPageOffset, dictionarySize);
    const cursor = {
      buffer: pagesBuf,
      offset: 0,
      size: pagesBuf.length
    };
    const decodedPage = await decodePage(cursor, options);
    return decodedPage.dictionary;
  }
}
//# sourceMappingURL=parquet-reader.js.map