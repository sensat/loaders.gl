import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { PARQUET_CODECS } from '../codecs';
import * as Compression from '../compression';
import * as Shred from '../schema/shred';
import { ColumnChunk, ColumnMetaData, CompressionCodec, ConvertedType, DataPageHeader, DataPageHeaderV2, Encoding, FieldRepetitionType, FileMetaData, KeyValue, PageHeader, PageType, RowGroup, SchemaElement, Type } from '../parquet-thrift';
import { osopen, oswrite, osclose } from '../utils/file-utils';
import { getBitWidth, serializeThrift } from '../utils/read-utils';
import Int64 from 'node-int64';
const PARQUET_MAGIC = 'PAR1';
const PARQUET_VERSION = 1;
const PARQUET_DEFAULT_PAGE_SIZE = 8192;
const PARQUET_DEFAULT_ROW_GROUP_SIZE = 4096;
const PARQUET_RDLVL_TYPE = 'INT32';
const PARQUET_RDLVL_ENCODING = 'RLE';
export class ParquetEncoder {
  static async openFile(schema, path, opts) {
    const outputStream = await osopen(path, opts);
    return ParquetEncoder.openStream(schema, outputStream, opts);
  }
  static async openStream(schema, outputStream) {
    let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    const envelopeWriter = await ParquetEnvelopeWriter.openStream(schema, outputStream, opts);
    return new ParquetEncoder(schema, envelopeWriter, opts);
  }
  constructor(schema, envelopeWriter, opts) {
    _defineProperty(this, "schema", void 0);
    _defineProperty(this, "envelopeWriter", void 0);
    _defineProperty(this, "rowBuffer", void 0);
    _defineProperty(this, "rowGroupSize", void 0);
    _defineProperty(this, "closed", void 0);
    _defineProperty(this, "userMetadata", void 0);
    this.schema = schema;
    this.envelopeWriter = envelopeWriter;
    this.rowBuffer = {};
    this.rowGroupSize = opts.rowGroupSize || PARQUET_DEFAULT_ROW_GROUP_SIZE;
    this.closed = false;
    this.userMetadata = {};
    this.writeHeader();
  }
  async writeHeader() {
    try {
      await this.envelopeWriter.writeHeader();
    } catch (err) {
      await this.envelopeWriter.close();
      throw err;
    }
  }
  async appendRow(row) {
    if (this.closed) {
      throw new Error('writer was closed');
    }
    Shred.shredRecord(this.schema, row, this.rowBuffer);
    if (this.rowBuffer.rowCount >= this.rowGroupSize) {
      this.rowBuffer = {};
    }
  }
  async close(callback) {
    if (this.closed) {
      throw new Error('writer was closed');
    }
    this.closed = true;
    if (this.rowBuffer.rowCount > 0 || this.rowBuffer.rowCount >= this.rowGroupSize) {
      this.rowBuffer = {};
    }
    await this.envelopeWriter.writeFooter(this.userMetadata);
    await this.envelopeWriter.close();
    if (callback) {
      callback();
    }
  }
  setMetadata(key, value) {
    this.userMetadata[String(key)] = String(value);
  }
  setRowGroupSize(cnt) {
    this.rowGroupSize = cnt;
  }
  setPageSize(cnt) {
    this.envelopeWriter.setPageSize(cnt);
  }
}
export class ParquetEnvelopeWriter {
  static async openStream(schema, outputStream, opts) {
    const writeFn = oswrite.bind(undefined, outputStream);
    const closeFn = osclose.bind(undefined, outputStream);
    return new ParquetEnvelopeWriter(schema, writeFn, closeFn, 0, opts);
  }
  constructor(schema, writeFn, closeFn, fileOffset, opts) {
    _defineProperty(this, "schema", void 0);
    _defineProperty(this, "write", void 0);
    _defineProperty(this, "close", void 0);
    _defineProperty(this, "offset", void 0);
    _defineProperty(this, "rowCount", void 0);
    _defineProperty(this, "rowGroups", void 0);
    _defineProperty(this, "pageSize", void 0);
    _defineProperty(this, "useDataPageV2", void 0);
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
  writeHeader() {
    return this.writeSection(Buffer.from(PARQUET_MAGIC));
  }
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
  writeFooter(userMetadata) {
    if (!userMetadata) {
      userMetadata = {};
    }
    return this.writeSection(encodeFooter(this.schema, this.rowCount, this.rowGroups, userMetadata));
  }
  setPageSize(cnt) {
    this.pageSize = cnt;
  }
}
function encodeValues(type, encoding, values, opts) {
  if (!(encoding in PARQUET_CODECS)) {
    throw new Error("invalid encoding: ".concat(encoding));
  }
  return PARQUET_CODECS[encoding].encodeValues(type, values, opts);
}
async function encodeDataPage(column, data) {
  let rLevelsBuf = Buffer.alloc(0);
  if (column.rLevelMax > 0) {
    rLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.rlevels, {
      bitWidth: getBitWidth(column.rLevelMax)
    });
  }
  let dLevelsBuf = Buffer.alloc(0);
  if (column.dLevelMax > 0) {
    dLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.dlevels, {
      bitWidth: getBitWidth(column.dLevelMax)
    });
  }
  const valuesBuf = encodeValues(column.primitiveType, column.encoding, data.values, {
    typeLength: column.typeLength,
    bitWidth: column.typeLength
  });
  const dataBuf = Buffer.concat([rLevelsBuf, dLevelsBuf, valuesBuf]);
  const compressedBuf = await Compression.deflate(column.compression, dataBuf);
  const header = new PageHeader({
    type: PageType.DATA_PAGE,
    data_page_header: new DataPageHeader({
      num_values: data.count,
      encoding: Encoding[column.encoding],
      definition_level_encoding: Encoding[PARQUET_RDLVL_ENCODING],
      repetition_level_encoding: Encoding[PARQUET_RDLVL_ENCODING]
    }),
    uncompressed_page_size: dataBuf.length,
    compressed_page_size: compressedBuf.length
  });
  const headerBuf = serializeThrift(header);
  const page = Buffer.concat([headerBuf, compressedBuf]);
  return {
    header,
    headerSize: headerBuf.length,
    page
  };
}
async function encodeDataPageV2(column, data, rowCount) {
  const valuesBuf = encodeValues(column.primitiveType, column.encoding, data.values, {
    typeLength: column.typeLength,
    bitWidth: column.typeLength
  });
  const compressedBuf = await Compression.deflate(column.compression, valuesBuf);
  let rLevelsBuf = Buffer.alloc(0);
  if (column.rLevelMax > 0) {
    rLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.rlevels, {
      bitWidth: getBitWidth(column.rLevelMax),
      disableEnvelope: true
    });
  }
  let dLevelsBuf = Buffer.alloc(0);
  if (column.dLevelMax > 0) {
    dLevelsBuf = encodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, data.dlevels, {
      bitWidth: getBitWidth(column.dLevelMax),
      disableEnvelope: true
    });
  }
  const header = new PageHeader({
    type: PageType.DATA_PAGE_V2,
    data_page_header_v2: new DataPageHeaderV2({
      num_values: data.count,
      num_nulls: data.count - data.values.length,
      num_rows: rowCount,
      encoding: Encoding[column.encoding],
      definition_levels_byte_length: dLevelsBuf.length,
      repetition_levels_byte_length: rLevelsBuf.length,
      is_compressed: column.compression !== 'UNCOMPRESSED'
    }),
    uncompressed_page_size: rLevelsBuf.length + dLevelsBuf.length + valuesBuf.length,
    compressed_page_size: rLevelsBuf.length + dLevelsBuf.length + compressedBuf.length
  });
  const headerBuf = serializeThrift(header);
  const page = Buffer.concat([headerBuf, rLevelsBuf, dLevelsBuf, compressedBuf]);
  return {
    header,
    headerSize: headerBuf.length,
    page
  };
}
async function encodeColumnChunk(column, buffer, offset, opts) {
  const data = buffer.columnData[column.path.join()];
  const baseOffset = (opts.baseOffset || 0) + offset;
  let pageBuf;
  let total_uncompressed_size = 0;
  let total_compressed_size = 0;
  {
    const result = opts.useDataPageV2 ? await encodeDataPageV2(column, data, buffer.rowCount) : await encodeDataPage(column, data);
    pageBuf = result.page;
    total_uncompressed_size += result.header.uncompressed_page_size + result.headerSize;
    total_compressed_size += result.header.compressed_page_size + result.headerSize;
  }
  const metadata = new ColumnMetaData({
    path_in_schema: column.path,
    num_values: data.count,
    data_page_offset: baseOffset,
    encodings: [],
    total_uncompressed_size,
    total_compressed_size,
    type: Type[column.primitiveType],
    codec: CompressionCodec[column.compression]
  });
  metadata.encodings.push(Encoding[PARQUET_RDLVL_ENCODING]);
  metadata.encodings.push(Encoding[column.encoding]);
  const metadataOffset = baseOffset + pageBuf.length;
  const body = Buffer.concat([pageBuf, serializeThrift(metadata)]);
  return {
    body,
    metadata,
    metadataOffset
  };
}
async function encodeRowGroup(schema, data, opts) {
  const metadata = new RowGroup({
    num_rows: data.rowCount,
    columns: [],
    total_byte_size: 0
  });
  let body = Buffer.alloc(0);
  for (const field of schema.fieldList) {
    if (field.isNested) {
      continue;
    }
    const cchunkData = await encodeColumnChunk(field, data, body.length, opts);
    const cchunk = new ColumnChunk({
      file_offset: cchunkData.metadataOffset,
      meta_data: cchunkData.metadata
    });
    metadata.columns.push(cchunk);
    metadata.total_byte_size = new Int64(Number(metadata.total_byte_size) + cchunkData.body.length);
    body = Buffer.concat([body, cchunkData.body]);
  }
  return {
    body,
    metadata
  };
}
function encodeFooter(schema, rowCount, rowGroups, userMetadata) {
  const metadata = new FileMetaData({
    version: PARQUET_VERSION,
    created_by: 'parquets',
    num_rows: rowCount,
    row_groups: rowGroups,
    schema: [],
    key_value_metadata: []
  });
  for (const key in userMetadata) {
    var _metadata$key_value_m, _metadata$key_value_m2, _metadata$key_value_m3;
    const kv = new KeyValue({
      key,
      value: userMetadata[key]
    });
    (_metadata$key_value_m = metadata.key_value_metadata) === null || _metadata$key_value_m === void 0 ? void 0 : (_metadata$key_value_m2 = (_metadata$key_value_m3 = _metadata$key_value_m).push) === null || _metadata$key_value_m2 === void 0 ? void 0 : _metadata$key_value_m2.call(_metadata$key_value_m3, kv);
  }
  {
    const schemaRoot = new SchemaElement({
      name: 'root',
      num_children: Object.keys(schema.fields).length
    });
    metadata.schema.push(schemaRoot);
  }
  for (const field of schema.fieldList) {
    const relt = FieldRepetitionType[field.repetitionType];
    const schemaElem = new SchemaElement({
      name: field.name,
      repetition_type: relt
    });
    if (field.isNested) {
      schemaElem.num_children = field.fieldCount;
    } else {
      schemaElem.type = Type[field.primitiveType];
    }
    if (field.originalType) {
      schemaElem.converted_type = ConvertedType[field.originalType];
    }
    schemaElem.type_length = field.typeLength;
    metadata.schema.push(schemaElem);
  }
  const metadataEncoded = serializeThrift(metadata);
  const footerEncoded = Buffer.alloc(metadataEncoded.length + 8);
  metadataEncoded.copy(footerEncoded);
  footerEncoded.writeUInt32LE(metadataEncoded.length, metadataEncoded.length);
  footerEncoded.write(PARQUET_MAGIC, metadataEncoded.length + 4);
  return footerEncoded;
}
//# sourceMappingURL=parquet-encoder.js.map