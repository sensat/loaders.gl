import { PARQUET_CODECS } from '../codecs';
import { ConvertedType, Encoding, FieldRepetitionType, PageType, Type } from '../parquet-thrift';
import { decompress } from '../compression';
import { PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING } from '../../constants';
import { decodePageHeader, getThriftEnum, getBitWidth } from '../utils/read-utils';
export async function decodeDataPages(buffer, options) {
  const cursor = {
    buffer,
    offset: 0,
    size: buffer.length
  };
  const data = {
    rlevels: [],
    dlevels: [],
    values: [],
    pageHeaders: [],
    count: 0
  };
  let dictionary = options.dictionary || [];
  while (cursor.offset < cursor.size && (!options.numValues || data.dlevels.length < Number(options.numValues))) {
    const page = await decodePage(cursor, options);
    if (page.dictionary) {
      dictionary = page.dictionary;
      continue;
    }
    if (dictionary.length) {
      page.values = page.values.map(value => dictionary[value]);
    }
    for (let index = 0; index < page.rlevels.length; index++) {
      data.rlevels.push(page.rlevels[index]);
      data.dlevels.push(page.dlevels[index]);
      const value = page.values[index];
      if (value !== undefined) {
        data.values.push(value);
      }
    }
    data.count += page.count;
    data.pageHeaders.push(page.pageHeader);
  }
  return data;
}
export async function decodePage(cursor, options) {
  let page;
  const {
    pageHeader,
    length
  } = decodePageHeader(cursor.buffer, cursor.offset);
  cursor.offset += length;
  const pageType = getThriftEnum(PageType, pageHeader.type);
  switch (pageType) {
    case 'DATA_PAGE':
      page = await decodeDataPage(cursor, pageHeader, options);
      break;
    case 'DATA_PAGE_V2':
      page = await decodeDataPageV2(cursor, pageHeader, options);
      break;
    case 'DICTIONARY_PAGE':
      page = {
        dictionary: await decodeDictionaryPage(cursor, pageHeader, options),
        pageHeader
      };
      break;
    default:
      throw new Error("invalid page type: ".concat(pageType));
  }
  return page;
}
export function decodeSchema(schemaElements, offset, len) {
  const schema = {};
  let next = offset;
  for (let i = 0; i < len; i++) {
    const schemaElement = schemaElements[next];
    const repetitionType = next > 0 ? getThriftEnum(FieldRepetitionType, schemaElement.repetition_type) : 'ROOT';
    let optional = false;
    let repeated = false;
    switch (repetitionType) {
      case 'REQUIRED':
        break;
      case 'OPTIONAL':
        optional = true;
        break;
      case 'REPEATED':
        repeated = true;
        break;
      default:
        throw new Error('parquet: unknown repetition type');
    }
    if (schemaElement.num_children > 0) {
      const res = decodeSchema(schemaElements, next + 1, schemaElement.num_children);
      next = res.next;
      schema[schemaElement.name] = {
        optional,
        repeated,
        fields: res.schema
      };
    } else {
      const type = getThriftEnum(Type, schemaElement.type);
      let logicalType = type;
      if (schemaElement.converted_type) {
        logicalType = getThriftEnum(ConvertedType, schemaElement.converted_type);
      }
      switch (logicalType) {
        case 'DECIMAL':
          logicalType = "".concat(logicalType, "_").concat(type);
          break;
        default:
      }
      schema[schemaElement.name] = {
        type: logicalType,
        typeLength: schemaElement.type_length,
        presision: schemaElement.precision,
        scale: schemaElement.scale,
        optional,
        repeated
      };
      next++;
    }
  }
  return {
    schema,
    offset,
    next
  };
}
function decodeValues(type, encoding, cursor, count, opts) {
  if (!(encoding in PARQUET_CODECS)) {
    throw new Error("invalid encoding: ".concat(encoding));
  }
  return PARQUET_CODECS[encoding].decodeValues(type, cursor, count, opts);
}
async function decodeDataPage(cursor, header, options) {
  var _header$data_page_hea, _header$data_page_hea2, _header$data_page_hea3, _header$data_page_hea4;
  const cursorEnd = cursor.offset + header.compressed_page_size;
  const valueCount = (_header$data_page_hea = header.data_page_header) === null || _header$data_page_hea === void 0 ? void 0 : _header$data_page_hea.num_values;
  let dataCursor = cursor;
  if (options.compression !== 'UNCOMPRESSED') {
    const valuesBuf = await decompress(options.compression, cursor.buffer.slice(cursor.offset, cursorEnd), header.uncompressed_page_size);
    dataCursor = {
      buffer: valuesBuf,
      offset: 0,
      size: valuesBuf.length
    };
    cursor.offset = cursorEnd;
  }
  const rLevelEncoding = getThriftEnum(Encoding, (_header$data_page_hea2 = header.data_page_header) === null || _header$data_page_hea2 === void 0 ? void 0 : _header$data_page_hea2.repetition_level_encoding);
  let rLevels = new Array(valueCount);
  if (options.column.rLevelMax > 0) {
    rLevels = decodeValues(PARQUET_RDLVL_TYPE, rLevelEncoding, dataCursor, valueCount, {
      bitWidth: getBitWidth(options.column.rLevelMax),
      disableEnvelope: false
    });
  } else {
    rLevels.fill(0);
  }
  const dLevelEncoding = getThriftEnum(Encoding, (_header$data_page_hea3 = header.data_page_header) === null || _header$data_page_hea3 === void 0 ? void 0 : _header$data_page_hea3.definition_level_encoding);
  let dLevels = new Array(valueCount);
  if (options.column.dLevelMax > 0) {
    dLevels = decodeValues(PARQUET_RDLVL_TYPE, dLevelEncoding, dataCursor, valueCount, {
      bitWidth: getBitWidth(options.column.dLevelMax),
      disableEnvelope: false
    });
  } else {
    dLevels.fill(0);
  }
  let valueCountNonNull = 0;
  for (const dlvl of dLevels) {
    if (dlvl === options.column.dLevelMax) {
      valueCountNonNull++;
    }
  }
  const valueEncoding = getThriftEnum(Encoding, (_header$data_page_hea4 = header.data_page_header) === null || _header$data_page_hea4 === void 0 ? void 0 : _header$data_page_hea4.encoding);
  const decodeOptions = {
    typeLength: options.column.typeLength,
    bitWidth: options.column.typeLength
  };
  const values = decodeValues(options.column.primitiveType, valueEncoding, dataCursor, valueCountNonNull, decodeOptions);
  return {
    dlevels: dLevels,
    rlevels: rLevels,
    values,
    count: valueCount,
    pageHeader: header
  };
}
async function decodeDataPageV2(cursor, header, opts) {
  var _header$data_page_hea5, _header$data_page_hea6, _header$data_page_hea7, _header$data_page_hea8;
  const cursorEnd = cursor.offset + header.compressed_page_size;
  const valueCount = (_header$data_page_hea5 = header.data_page_header_v2) === null || _header$data_page_hea5 === void 0 ? void 0 : _header$data_page_hea5.num_values;
  const valueCountNonNull = valueCount - ((_header$data_page_hea6 = header.data_page_header_v2) === null || _header$data_page_hea6 === void 0 ? void 0 : _header$data_page_hea6.num_nulls);
  const valueEncoding = getThriftEnum(Encoding, (_header$data_page_hea7 = header.data_page_header_v2) === null || _header$data_page_hea7 === void 0 ? void 0 : _header$data_page_hea7.encoding);
  let rLevels = new Array(valueCount);
  if (opts.column.rLevelMax > 0) {
    rLevels = decodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, cursor, valueCount, {
      bitWidth: getBitWidth(opts.column.rLevelMax),
      disableEnvelope: true
    });
  } else {
    rLevels.fill(0);
  }
  let dLevels = new Array(valueCount);
  if (opts.column.dLevelMax > 0) {
    dLevels = decodeValues(PARQUET_RDLVL_TYPE, PARQUET_RDLVL_ENCODING, cursor, valueCount, {
      bitWidth: getBitWidth(opts.column.dLevelMax),
      disableEnvelope: true
    });
  } else {
    dLevels.fill(0);
  }
  let valuesBufCursor = cursor;
  if ((_header$data_page_hea8 = header.data_page_header_v2) !== null && _header$data_page_hea8 !== void 0 && _header$data_page_hea8.is_compressed) {
    const valuesBuf = await decompress(opts.compression, cursor.buffer.slice(cursor.offset, cursorEnd), header.uncompressed_page_size);
    valuesBufCursor = {
      buffer: valuesBuf,
      offset: 0,
      size: valuesBuf.length
    };
    cursor.offset = cursorEnd;
  }
  const decodeOptions = {
    typeLength: opts.column.typeLength,
    bitWidth: opts.column.typeLength
  };
  const values = decodeValues(opts.column.primitiveType, valueEncoding, valuesBufCursor, valueCountNonNull, decodeOptions);
  return {
    dlevels: dLevels,
    rlevels: rLevels,
    values,
    count: valueCount,
    pageHeader: header
  };
}
async function decodeDictionaryPage(cursor, pageHeader, options) {
  var _pageHeader$dictionar;
  const cursorEnd = cursor.offset + pageHeader.compressed_page_size;
  let dictCursor = {
    offset: 0,
    buffer: cursor.buffer.slice(cursor.offset, cursorEnd),
    size: cursorEnd - cursor.offset
  };
  cursor.offset = cursorEnd;
  if (options.compression !== 'UNCOMPRESSED') {
    const valuesBuf = await decompress(options.compression, dictCursor.buffer.slice(dictCursor.offset, cursorEnd), pageHeader.uncompressed_page_size);
    dictCursor = {
      buffer: valuesBuf,
      offset: 0,
      size: valuesBuf.length
    };
    cursor.offset = cursorEnd;
  }
  const numValues = (pageHeader === null || pageHeader === void 0 ? void 0 : (_pageHeader$dictionar = pageHeader.dictionary_page_header) === null || _pageHeader$dictionar === void 0 ? void 0 : _pageHeader$dictionar.num_values) || 0;
  return decodeValues(options.column.primitiveType, options.column.encoding, dictCursor, numValues, options).map(d => d.toString());
}
//# sourceMappingURL=decoders.js.map