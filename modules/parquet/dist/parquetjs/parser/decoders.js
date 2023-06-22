"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeSchema = exports.decodePage = exports.decodeDataPages = void 0;
const codecs_1 = require("../codecs");
const parquet_thrift_1 = require("../parquet-thrift");
const compression_1 = require("../compression");
const constants_1 = require("../../constants");
const read_utils_1 = require("../utils/read-utils");
/**
 * Decode data pages
 * @param buffer - input data
 * @param column - parquet column
 * @param compression - compression type
 * @returns parquet data page data
 */
async function decodeDataPages(buffer, options) {
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
    while (
    // @ts-ignore size can be undefined
    cursor.offset < cursor.size &&
        (!options.numValues || data.dlevels.length < Number(options.numValues))) {
        // Looks like we have to decode these in sequence due to cursor updates?
        const page = await decodePage(cursor, options);
        if (page.dictionary) {
            dictionary = page.dictionary;
            // eslint-disable-next-line no-continue
            continue;
        }
        if (dictionary.length) {
            // eslint-disable-next-line no-loop-func
            page.values = page.values.map((value) => dictionary[value]);
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
exports.decodeDataPages = decodeDataPages;
/**
 * Decode parquet page based on page type
 * @param cursor
 * @param options
 */
async function decodePage(cursor, options) {
    let page;
    const { pageHeader, length } = (0, read_utils_1.decodePageHeader)(cursor.buffer, cursor.offset);
    cursor.offset += length;
    const pageType = (0, read_utils_1.getThriftEnum)(parquet_thrift_1.PageType, pageHeader.type);
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
            throw new Error(`invalid page type: ${pageType}`);
    }
    return page;
}
exports.decodePage = decodePage;
/**
 * Decode parquet schema
 * @param schemaElements input schema elements data
 * @param offset offset to read from
 * @param len length of data
 * @returns result.offset
 *   result.next - offset at the end of function
 *   result.schema - schema read from the input data
 * @todo output offset is the same as input - possibly excess output field
 */
function decodeSchema(schemaElements, offset, len) {
    const schema = {};
    let next = offset;
    for (let i = 0; i < len; i++) {
        const schemaElement = schemaElements[next];
        const repetitionType = next > 0 ? (0, read_utils_1.getThriftEnum)(parquet_thrift_1.FieldRepetitionType, schemaElement.repetition_type) : 'ROOT';
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
                // type: undefined,
                optional,
                repeated,
                fields: res.schema
            };
        }
        else {
            const type = (0, read_utils_1.getThriftEnum)(parquet_thrift_1.Type, schemaElement.type);
            let logicalType = type;
            if (schemaElement.converted_type) {
                logicalType = (0, read_utils_1.getThriftEnum)(parquet_thrift_1.ConvertedType, schemaElement.converted_type);
            }
            switch (logicalType) {
                case 'DECIMAL':
                    logicalType = `${logicalType}_${type}`;
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
    return { schema, offset, next };
}
exports.decodeSchema = decodeSchema;
/**
 * Decode a consecutive array of data using one of the parquet encodings
 */
function decodeValues(type, encoding, cursor, count, opts) {
    if (!(encoding in codecs_1.PARQUET_CODECS)) {
        throw new Error(`invalid encoding: ${encoding}`);
    }
    return codecs_1.PARQUET_CODECS[encoding].decodeValues(type, cursor, count, opts);
}
/**
 * Do decoding of parquet dataPage from column chunk
 * @param cursor
 * @param header
 * @param options
 */
async function decodeDataPage(cursor, header, options) {
    const cursorEnd = cursor.offset + header.compressed_page_size;
    const valueCount = header.data_page_header?.num_values;
    /* uncompress page */
    let dataCursor = cursor;
    if (options.compression !== 'UNCOMPRESSED') {
        const valuesBuf = await (0, compression_1.decompress)(options.compression, cursor.buffer.slice(cursor.offset, cursorEnd), header.uncompressed_page_size);
        dataCursor = {
            buffer: valuesBuf,
            offset: 0,
            size: valuesBuf.length
        };
        cursor.offset = cursorEnd;
    }
    /* read repetition levels */
    const rLevelEncoding = (0, read_utils_1.getThriftEnum)(parquet_thrift_1.Encoding, header.data_page_header?.repetition_level_encoding);
    // tslint:disable-next-line:prefer-array-literal
    let rLevels = new Array(valueCount);
    if (options.column.rLevelMax > 0) {
        rLevels = decodeValues(constants_1.PARQUET_RDLVL_TYPE, rLevelEncoding, dataCursor, valueCount, {
            bitWidth: (0, read_utils_1.getBitWidth)(options.column.rLevelMax),
            disableEnvelope: false
            // column: opts.column
        });
    }
    else {
        rLevels.fill(0);
    }
    /* read definition levels */
    const dLevelEncoding = (0, read_utils_1.getThriftEnum)(parquet_thrift_1.Encoding, header.data_page_header?.definition_level_encoding);
    // tslint:disable-next-line:prefer-array-literal
    let dLevels = new Array(valueCount);
    if (options.column.dLevelMax > 0) {
        dLevels = decodeValues(constants_1.PARQUET_RDLVL_TYPE, dLevelEncoding, dataCursor, valueCount, {
            bitWidth: (0, read_utils_1.getBitWidth)(options.column.dLevelMax),
            disableEnvelope: false
            // column: opts.column
        });
    }
    else {
        dLevels.fill(0);
    }
    let valueCountNonNull = 0;
    for (const dlvl of dLevels) {
        if (dlvl === options.column.dLevelMax) {
            valueCountNonNull++;
        }
    }
    /* read values */
    const valueEncoding = (0, read_utils_1.getThriftEnum)(parquet_thrift_1.Encoding, header.data_page_header?.encoding);
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
/**
 * Do decoding of parquet dataPage in version 2 from column chunk
 * @param cursor
 * @param header
 * @param opts
 * @returns
 */
async function decodeDataPageV2(cursor, header, opts) {
    const cursorEnd = cursor.offset + header.compressed_page_size;
    const valueCount = header.data_page_header_v2?.num_values;
    // @ts-ignore
    const valueCountNonNull = valueCount - header.data_page_header_v2?.num_nulls;
    const valueEncoding = (0, read_utils_1.getThriftEnum)(parquet_thrift_1.Encoding, header.data_page_header_v2?.encoding);
    /* read repetition levels */
    // tslint:disable-next-line:prefer-array-literal
    let rLevels = new Array(valueCount);
    if (opts.column.rLevelMax > 0) {
        rLevels = decodeValues(constants_1.PARQUET_RDLVL_TYPE, constants_1.PARQUET_RDLVL_ENCODING, cursor, valueCount, {
            bitWidth: (0, read_utils_1.getBitWidth)(opts.column.rLevelMax),
            disableEnvelope: true
        });
    }
    else {
        rLevels.fill(0);
    }
    /* read definition levels */
    // tslint:disable-next-line:prefer-array-literal
    let dLevels = new Array(valueCount);
    if (opts.column.dLevelMax > 0) {
        dLevels = decodeValues(constants_1.PARQUET_RDLVL_TYPE, constants_1.PARQUET_RDLVL_ENCODING, cursor, valueCount, {
            bitWidth: (0, read_utils_1.getBitWidth)(opts.column.dLevelMax),
            disableEnvelope: true
        });
    }
    else {
        dLevels.fill(0);
    }
    /* read values */
    let valuesBufCursor = cursor;
    if (header.data_page_header_v2?.is_compressed) {
        const valuesBuf = await (0, compression_1.decompress)(opts.compression, cursor.buffer.slice(cursor.offset, cursorEnd), header.uncompressed_page_size);
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
/**
 * Do decoding of dictionary page which helps to iterate over all indexes and get dataPage values.
 * @param cursor
 * @param pageHeader
 * @param options
 */
async function decodeDictionaryPage(cursor, pageHeader, options) {
    const cursorEnd = cursor.offset + pageHeader.compressed_page_size;
    let dictCursor = {
        offset: 0,
        buffer: cursor.buffer.slice(cursor.offset, cursorEnd),
        size: cursorEnd - cursor.offset
    };
    cursor.offset = cursorEnd;
    if (options.compression !== 'UNCOMPRESSED') {
        const valuesBuf = await (0, compression_1.decompress)(options.compression, dictCursor.buffer.slice(dictCursor.offset, cursorEnd), pageHeader.uncompressed_page_size);
        dictCursor = {
            buffer: valuesBuf,
            offset: 0,
            size: valuesBuf.length
        };
        cursor.offset = cursorEnd;
    }
    const numValues = pageHeader?.dictionary_page_header?.num_values || 0;
    return decodeValues(options.column.primitiveType, options.column.encoding, dictCursor, numValues, options).map((d) => d.toString());
}
