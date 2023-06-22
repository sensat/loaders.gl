import * as PLAIN from './plain';
import * as RLE from './rle';
import * as DICTIONARY from './dictionary';
export * from './declare';
export const PARQUET_CODECS = {
  PLAIN: {
    encodeValues: PLAIN.encodeValues,
    decodeValues: PLAIN.decodeValues
  },
  RLE: {
    encodeValues: RLE.encodeValues,
    decodeValues: RLE.decodeValues
  },
  PLAIN_DICTIONARY: {
    encodeValues: DICTIONARY.encodeValues,
    decodeValues: DICTIONARY.decodeValues
  },
  RLE_DICTIONARY: {
    encodeValues: DICTIONARY.encodeValues,
    decodeValues: DICTIONARY.decodeValues
  }
};
//# sourceMappingURL=index.js.map